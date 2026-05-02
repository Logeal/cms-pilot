export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import "./theme.css";
import { prisma } from "@/lib/prisma";
import { getPalette } from "@/lib/palettes";
import { parseJsonField } from "@/lib/parseJson";
import MobileNav from "./MobileNav";

function sanitizeSvg(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\bon\w+\s*=/gi, "data-removed=")
    .replace(/javascript\s*:/gi, "");
}

function buildGoogleFontsUrl(fonts: { display: string; heading: string; body: string }): string {
  const systemFonts = new Set(["Georgia", "system-ui", "Arial", "Times New Roman"]);
  const toLoad = [...new Set([fonts.display, fonts.heading, fonts.body])].filter(f => !systemFonts.has(f));
  if (toLoad.length === 0) return "";
  const families = toLoad.map(f => `family=${encodeURIComponent(f)}:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export const metadata: Metadata = {
  title: "Maison & Conseil — Déco, Immobilier, Jardin, Piscine",
  description: "Conseils d'experts en décoration, immobilier, jardin et piscine.",
};

type SiteSetup = {
  categories?: string[];
  paletteId?: string;
  colors?: Record<string, string>;
  fonts?: { display: string; heading: string; body: string };
};

const footerLegal = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  { label: "Cookies", href: "/cookies" },
  { label: "Contact", href: "/contact" },
];

export default async function MaisonLayout({ children }: { children: React.ReactNode }) {
  // Charge le CSS du thème actif depuis la base
  const activeTheme = await prisma.theme.findFirst({ where: { active: true } });
  const themeCSS = activeTheme?.css ?? "";

  const site = await prisma.site.findFirst();
  const menuConfig = site?.menuConfig != null ? parseJsonField(site.menuConfig) : null;

  const config = (menuConfig as { setup?: SiteSetup } | null)?.setup;

  // Nav depuis menuConfig.items (géré dans Paramètres)
  const menuItems: Array<{ id: string; type: string; label: string; slug?: string; url?: string; enabled: boolean; level: number }> =
    (menuConfig as { items?: Array<{ id: string; type: string; label: string; slug?: string; url?: string; enabled: boolean; level: number }> } | null)?.items ?? [];

  // Grouper les items : chaque item level=0 avec ses enfants level=1 qui suivent
  type NavItem = { label: string; href: string };
  type NavGroup = { item: NavItem; children: NavItem[] };
  const navGroups: NavGroup[] = [];
  for (const i of menuItems) {
    if (!i.enabled) continue;
    const href = i.type === "category" ? `/${i.slug}` : (i.url ?? "#");
    if (i.level === 0) {
      navGroups.push({ item: { label: i.label, href }, children: [] });
    } else if (i.level === 1 && navGroups.length > 0) {
      navGroups[navGroups.length - 1].children.push({ label: i.label, href });
    }
  }
  const navLinks = navGroups.map(g => g.item);

  // Pour la topbar et footer, garder les catégories setup
  const setupCategories = config?.categories ?? [];

  // Logo dynamique depuis site.logoUrl
  const siteName = site?.name ?? "Maison&Conseil";
  const logoUrl = site?.logoUrl ?? null;

  // Typographie dynamique
  const fonts = config?.fonts ?? null;
  const googleFontsUrl = fonts ? buildGoogleFontsUrl(fonts) : null;

  // Couleurs dynamiques — override les CSS vars via style inline sur .ms-root
  const paletteId = config?.paletteId ?? "warm-earth";
  const palette = getPalette(paletteId);
  const c = palette.colors;

  const fontVars = fonts ? {
    "--f-display": `"${fonts.display}", Georgia, serif`,
    "--f-heading": `"${fonts.heading}", system-ui, sans-serif`,
    "--f-body":    `"${fonts.body}", system-ui, sans-serif`,
  } as React.CSSProperties : {};

  const cssVars: React.CSSProperties = {
    "--c-dark":       c.dark,
    "--c-green":      c.brand,
    "--c-green-lt":   c.brandLight,
    "--c-terra":      c.accent,
    "--c-cream":      c.bg,
    "--c-cream-2":    c.bgAlt,
    "--c-sand":       c.secondary,
    "--c-mid":        c.mid,
    "--c-border":     c.border,
  } as React.CSSProperties;

  // Rendu du logo
  function renderLogo() {
    if (logoUrl) {
      if (logoUrl.trimStart().startsWith("<svg")) {
        return <span dangerouslySetInnerHTML={{ __html: sanitizeSvg(logoUrl) }} />;
      }
      return <img src={logoUrl} alt={siteName} style={{ maxHeight: 40, objectFit: "contain" }} />;
    }
    return <>{siteName.replace("&", "")}<em>&</em>{siteName.split("&")[1] ?? ""}</>;
  }

  // Si le site n'a pas de nom avec &, afficher simplement le nom
  const logoDisplay = logoUrl ? null : siteName;

  return (
    <div className="ms-root" style={{ ...cssVars, ...fontVars }}>
      {/* CSS du thème actif injecté côté serveur — pas de flash */}
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      <style dangerouslySetInnerHTML={{ __html: `:root { --c-cream-2: ${c.bgAlt}; } html, body { background: ${c.bgAlt} !important; }` }} />
      {/* Google Fonts dynamiques */}
      {googleFontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={googleFontsUrl} />
        </>
      )}
      {/* CSS vars typographie pour H2/H3 */}
      {fonts && (
        <style dangerouslySetInnerHTML={{ __html: `
          .ms-root h2, .ms-root h3,
          .ms-art-featured-title, .ms-cat-card-title, .ms-compact-title, .ms-card-title,
          .ms-sidebar-block-title {
            font-family: var(--f-heading, var(--f-display)) !important;
          }
          .ms-art-content,
          .ms-art-content p,
          .ms-art-content li,
          .ms-art-content blockquote,
          .ms-static p,
          .ms-card-excerpt, .ms-cat-card-excerpt, .ms-compact-excerpt,
          .ms-art-featured-excerpt, .ms-hero-sub, .ms-exp-split-text {
            font-family: var(--f-body) !important;
            font-weight: 400 !important;
          }
        `}} />
      )}
      {/* Dropdown mega menu + mobile nav — CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
/* Dropdown desktop */
.ms-nav-group { position: relative; display: flex; align-items: center; height: 100%; }
.ms-dropdown {
  position: absolute; top: calc(100% + 4px); left: 50%; transform: translateX(-50%);
  min-width: 200px;
  background: var(--c-cream); border: 1px solid var(--c-border);
  border-radius: 12px; box-shadow: 0 8px 28px rgba(0,0,0,0.12);
  padding: 8px;
  opacity: 0; pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  transform: translateX(-50%) translateY(-6px);
  z-index: 100;
}
.ms-nav-group:hover .ms-dropdown,
.ms-nav-group:focus-within .ms-dropdown {
  opacity: 1; pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.ms-dropdown-link {
  display: block; padding: 9px 14px; border-radius: 8px;
  font-size: 13px; font-weight: 500; color: var(--c-dark);
  text-decoration: none; transition: background 0.12s, color 0.12s;
  white-space: nowrap;
}
.ms-dropdown-link:hover { background: var(--c-cream-2); color: var(--c-green); }

/* Mobile nav */
.ms-burger { display: none; }
.ms-mobile-nav {
  display: none;
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.5);
}
.ms-mobile-nav-panel {
  position: absolute; top: 0; right: 0; bottom: 0;
  width: min(320px, 85vw);
  background: var(--c-cream);
  padding: 0;
  overflow-y: auto;
  box-shadow: -8px 0 40px rgba(0,0,0,0.18);
}
.ms-mobile-close {
  position: absolute; top: 16px; right: 16px;
  background: none; border: none; cursor: pointer;
  color: var(--c-dark); opacity: 0.6; padding: 4px;
}
.ms-mobile-links { padding: 64px 0 32px; }
.ms-mobile-link {
  display: block; padding: 14px 24px;
  font-size: 15px; font-weight: 500; color: var(--c-dark);
  text-decoration: none; border-bottom: 1px solid var(--c-border);
  transition: color 0.15s;
}
.ms-mobile-link:hover { color: var(--c-green); }
.ms-mobile-link-sub {
  display: block; padding: 11px 24px 11px 40px;
  font-size: 14px; color: var(--c-mid);
  text-decoration: none; border-bottom: 1px solid var(--c-border);
}
.ms-mobile-cta {
  display: block; margin: 24px 24px 0;
  padding: 14px; text-align: center;
  background: var(--c-green); color: #fff !important;
  border-radius: 10px; font-size: 15px; font-weight: 600;
  text-decoration: none;
}

/* ── MOBILE RESPONSIVE ── */
@media (max-width: 768px) {
  /* Header */
  .ms-topbar { display: none; }
  .ms-burger { display: flex !important; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: var(--c-dark); padding: 4px; }
  .ms-nav, .ms-header-cta { display: none !important; }
  .ms-header-inner { padding: 0 16px !important; height: 56px !important; }
  .ms-logo { margin-right: 0 !important; font-size: 20px !important; }

  /* Wrap */
  .ms-wrap { padding: 0 16px !important; }

  /* Hero */
  .ms-hero-inner { grid-template-columns: 1fr !important; min-height: auto !important; }
  .ms-hero-visual { display: none !important; }
  .ms-hero-content { padding: 48px 0 40px !important; }
  .ms-hero-headline { font-size: clamp(28px, 8vw, 48px) !important; }
  .ms-hero-sub { font-size: 15px !important; }
  .ms-reassurance { gap: 16px !important; flex-wrap: wrap !important; }

  /* Sections */
  .ms-section { padding: 40px 0 !important; }
  .ms-section--sm { padding: 28px 0 !important; }

  /* Articles grids */
  .ms-cards-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
  .ms-compact-list { grid-template-columns: 1fr !important; }
  .ms-art-featured-card { grid-template-columns: 1fr !important; }
  .ms-art-featured-img { aspect-ratio: 16/9 !important; }
  .ms-art-featured-body { padding: 24px !important; }

  /* Category */
  .ms-cat-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
  .ms-cat-h1 { font-size: 32px !important; }
  .ms-cat-seo-inner { grid-template-columns: 1fr !important; gap: 32px !important; }
  .ms-cat-duo { flex-direction: column !important; padding: 40px 0 !important; }
  .ms-cat-duo-col { width: 100% !important; }
  .ms-cat-duo-img-wrap { height: 220px !important; }

  /* Article detail */
  .ms-art-header-body { grid-template-columns: 1fr !important; gap: 24px !important; }
  .ms-art-header-img { height: 220px !important; width: 100% !important; margin-top: 0 !important; }
  .ms-art-h1 { font-size: 28px !important; }
  .ms-art-layout { grid-template-columns: 1fr !important; gap: 32px !important; padding: 32px 16px !important; }
  .ms-art-sidebar { display: none !important; }
  .ms-art-content { font-size: 16px !important; }
  .ms-art-related-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

  /* Stats */
  .ms-stats-inner { flex-wrap: wrap !important; gap: 0 !important; padding: 32px 0 !important; }
  .ms-stat { padding: 20px 24px !important; width: 50% !important; }
  .ms-stat-sep { display: none !important; }
  .ms-stat-num { font-size: 32px !important; }

  /* Expertise splits */
  .ms-exp-split { grid-template-columns: 1fr !important; min-height: auto !important; }
  .ms-exp-split-img { height: 220px !important; }
  .ms-exp-split-body { padding: 32px 24px !important; }
  .ms-exp-split-title { font-size: 24px !important; }
  .ms-exp-split--reverse { direction: ltr !important; }

  /* Footer */
  .ms-footer-main { grid-template-columns: 1fr 1fr !important; gap: 28px 32px !important; padding: 40px 0 28px !important; }
  .ms-footer-brand { grid-column: 1 / -1 !important; }
  .ms-footer-bottom { flex-direction: column !important; gap: 6px !important; text-align: center !important; }

  /* Static pages */
  .ms-static { margin: 32px auto !important; padding: 0 16px !important; max-width: 100% !important; }
  .ms-static h1 { font-size: 26px !important; }
  .ms-static h2 { font-size: 18px !important; }
  .ms-form > div { grid-template-columns: 1fr !important; }

  /* Section title */
  .ms-section-title { font-size: 26px !important; }
}

@media (max-width: 480px) {
  .ms-cards-grid { grid-template-columns: 1fr !important; }
  .ms-cat-grid { grid-template-columns: 1fr !important; }
  .ms-hero-headline { font-size: 26px !important; }
  .ms-stat { width: 100% !important; }
}
      `}} />
      {/* Topbar */}
      <div className="ms-topbar">
        <div className="ms-wrap ms-topbar-inner">
          <span>Conseil &amp; expertise{setupCategories.length > 0 ? ` — ${setupCategories.slice(0, 3).join(", ")}` : ""}</span>
          <div className="ms-topbar-links">
            <Link href="/contact">Contact</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/cgu">CGU</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="ms-header">
        <div className="ms-wrap ms-header-inner">
          <Link href="/" className="ms-logo">
            {logoUrl ? (
              logoUrl.trimStart().startsWith("<svg")
                ? <span dangerouslySetInnerHTML={{ __html: sanitizeSvg(logoUrl) }} />
                : <img src={logoUrl} alt={siteName} style={{ maxHeight: 40, objectFit: "contain" }} />
            ) : (
              logoDisplay ?? (
                <>Maison<em>&</em>Conseil</>
              )
            )}
          </Link>
          <nav className="ms-nav">
            {navGroups.map((g) =>
              g.children.length === 0 ? (
                <Link key={g.item.href} href={g.item.href} className="ms-nav-link">
                  {g.item.label}
                </Link>
              ) : (
                <div key={g.item.href} className="ms-nav-group">
                  <Link href={g.item.href} className="ms-nav-link">
                    {g.item.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ marginLeft: 4, opacity: 0.6 }}>
                      <path d="M2 3.5l3 3 3-3"/>
                    </svg>
                  </Link>
                  <div className="ms-dropdown">
                    {g.children.map(c => (
                      <Link key={c.href} href={c.href} className="ms-dropdown-link">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </nav>
          <Link href="/contact" className="ms-header-cta">
            Nous contacter
          </Link>

          {/* Burger + mobile nav — client component */}
          <MobileNav navGroups={navGroups} />
        </div>
      </header>

      {/* Contenu */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="ms-footer">
        <div className="ms-wrap">
          <div className="ms-footer-main">
            <div className="ms-footer-brand">
              <Link href="/" className="ms-logo" style={{ color: "#fff" }}>
                {logoUrl ? (
                  logoUrl.trimStart().startsWith("<svg")
                    ? <span dangerouslySetInnerHTML={{ __html: sanitizeSvg(logoUrl) }} />
                    : <img src={logoUrl} alt={siteName} style={{ maxHeight: 36, objectFit: "contain" }} />
                ) : (
                  logoDisplay ?? <>Maison<em>&</em>Conseil</>
                )}
              </Link>
              <p>
                Votre référence en matière de conseil.{setupCategories.length > 0 ? ` ${setupCategories.join(", ")} —` : ""} des experts à votre service.
              </p>
            </div>
            <div className="ms-footer-col">
              <h4>Rubriques</h4>
              <ul>
                {navLinks.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="ms-footer-col">
              <h4>Légal</h4>
              <ul>
                {footerLegal.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ms-footer-bottom">
            <span>© {new Date().getFullYear()} {siteName} — Tous droits réservés</span>
            <span>Fait avec soin en France 🇫🇷</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
