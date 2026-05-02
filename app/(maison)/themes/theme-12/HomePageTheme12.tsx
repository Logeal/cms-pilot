import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 140) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null;
};

type HomeContent = {
  heroEyebrow: string; heroLine1: string; heroLine2: string;
  heroSub: string; heroCta: string;
  expertiseEyebrow: string; expertiseTitle: string;
};

type CategoryData = { slug: string; label: string; metaDescription: string | null; seoIntro: string | null; description: string | null; heroImage: string | null; bullets: unknown };

type Props = {
  home: HomeContent; heroImageUrl: string | null;
  expertiseCats: string[]; extraCats: string[];
  categoryHeroImages: Record<string, string>;
  totalArticles: number; totalCats: number;
  heroArt: Article | undefined; cardArts: Article[]; moreArts: Article[];
  categoriesData?: CategoryData[];
};

export function HomePageTheme12({ home, expertiseCats, extraCats, categoryHeroImages, totalArticles, totalCats, heroArt, cardArts, moreArts }: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const allArts = heroArt ? [heroArt, ...cardArts, ...moreArts] : [...cardArts, ...moreArts];

  const hero = allArts[0];
  const featured2 = allArts[1];
  const featured3 = allArts[2];
  const strip = allArts.slice(3, 7);
  const grid = allArts.slice(7, 13);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .t12 {
          background: var(--c-dark);
          color: var(--c-cream);
          font-family: var(--f-body, Georgia, serif);
          --gold: var(--c-terra);
          --gold-dim: color-mix(in srgb, var(--c-terra) 15%, transparent);
          --gold-8: color-mix(in srgb, var(--c-terra) 8%, transparent);
          --gold-10: color-mix(in srgb, var(--c-terra) 10%, transparent);
          --gold-20: color-mix(in srgb, var(--c-terra) 20%, transparent);
          --gold-30: color-mix(in srgb, var(--c-terra) 30%, transparent);
          --gold-40: color-mix(in srgb, var(--c-terra) 40%, transparent);
          --panel: color-mix(in srgb, var(--c-dark) 80%, white);
          --text-20: color-mix(in srgb, var(--c-cream) 20%, transparent);
          --text-25: color-mix(in srgb, var(--c-cream) 25%, transparent);
          --text-30: color-mix(in srgb, var(--c-cream) 30%, transparent);
          --text-40: color-mix(in srgb, var(--c-cream) 40%, transparent);
          --text-45: color-mix(in srgb, var(--c-cream) 45%, transparent);
          --text-60: color-mix(in srgb, var(--c-cream) 60%, transparent);
          --dark-10: color-mix(in srgb, var(--c-dark) 10%, transparent);
          --dark-40: color-mix(in srgb, var(--c-dark) 40%, transparent);
          --dark-95: color-mix(in srgb, var(--c-dark) 95%, transparent);
        }

        /* ── HEADER ── */
        .t12-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid var(--gold-20);
          flex-wrap: wrap; gap: 16px;
        }
        .t12-logo {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(18px, 2.5vw, 28px); font-weight: 400;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--c-cream); text-decoration: none;
        }
        .t12-logo span { color: var(--gold, #C9A96E); }
        .t12-nav { display: flex; gap: 32px; }
        .t12-nav-link {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--text-40); text-decoration: none; transition: color 0.2s;
        }
        .t12-nav-link:hover { color: var(--gold, #C9A96E); }
        .t12-header-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--text-25); letter-spacing: 0.1em; }

        /* ── HERO ── */
        .t12-hero {
          position: relative; overflow: hidden;
          height: 88vh; min-height: 520px;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .t12-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .t12-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, var(--dark-95) 0%, var(--dark-40) 50%, var(--dark-10) 100%);
        }
        .t12-hero-body { position: relative; z-index: 1; padding: 0 48px 56px; max-width: 900px; }
        .t12-hero-kicker {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold, #C9A96E); display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .t12-hero-kicker::before { content: ''; width: 32px; height: 1px; background: var(--gold, #C9A96E); }
        .t12-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(28px, 5vw, 68px); font-weight: 400;
          line-height: 1.05; letter-spacing: -0.02em; color: var(--c-cream);
          margin-bottom: 20px;
        }
        .t12-hero-title a { color: inherit; text-decoration: none; }
        .t12-hero-title a:hover { color: var(--gold, #C9A96E); }
        .t12-hero-desc { font-size: 16px; color: var(--text-60); line-height: 1.65; margin-bottom: 24px; max-width: 560px; }
        .t12-hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold, #C9A96E); text-decoration: none;
          border-bottom: 1px solid var(--gold-40); padding-bottom: 4px;
          transition: border-color 0.2s;
        }
        .t12-hero-cta:hover { border-color: var(--gold, #C9A96E); }
        .t12-hero-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--text-30); margin-top: 16px; }

        /* ── DEUX COLONNES SECOND ── */
        .t12-dual {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
          background: var(--gold-10);
        }
        @media (max-width: 768px) { .t12-dual { grid-template-columns: 1fr; } }
        .t12-dual-art {
          background: var(--c-dark); padding: 40px 48px;
          text-decoration: none; display: flex; flex-direction: column; gap: 14px;
          transition: background 0.2s;
        }
        .t12-dual-art:hover { background: color-mix(in srgb, var(--c-dark) 85%, white); }
        .t12-dual-art:hover .t12-dual-title { color: var(--gold, #C9A96E); }
        .t12-dual-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; margin-bottom: 4px; }
        .t12-dual-img-empty { width: 100%; aspect-ratio: 16/9; background: var(--panel); margin-bottom: 4px; }
        .t12-dual-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold, #C9A96E);
        }
        .t12-dual-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(18px, 2vw, 26px); font-weight: 400;
          line-height: 1.2; color: var(--c-cream); transition: color 0.2s;
        }
        .t12-dual-desc { font-size: 13px; color: var(--text-45); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t12-dual-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--text-25); margin-top: auto; }

        /* ── STRIP ── */
        .t12-strip-wrap { padding: 48px 48px 0; border-top: 1px solid var(--gold-10); }
        .t12-strip-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold, #C9A96E); display: flex; align-items: center; gap: 16px; margin-bottom: 28px;
        }
        .t12-strip-label::after { content: ''; flex: 1; height: 1px; background: var(--gold-20); }
        .t12-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--gold-8); }
        @media (max-width: 800px) { .t12-strip { grid-template-columns: repeat(2, 1fr); } }
        .t12-strip-art { background: var(--c-dark); padding: 20px 24px; text-decoration: none; transition: background 0.15s; }
        .t12-strip-art:hover { background: color-mix(in srgb, var(--c-dark) 85%, white); }
        .t12-strip-art:hover .t12-strip-title { color: var(--gold, #C9A96E); }
        .t12-strip-num { font-family: var(--f-display, Georgia, serif); font-size: 11px; color: var(--gold-30); margin-bottom: 10px; display: block; }
        .t12-strip-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-30); margin-bottom: 6px; display: block; }
        .t12-strip-title { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 400; line-height: 1.3; color: var(--c-cream); transition: color 0.2s; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t12-strip-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--text-20); }

        /* ── GRID ── */
        .t12-grid-wrap { padding: 48px; }
        .t12-grid-label { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold, #C9A96E); display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .t12-grid-label::after { content: ''; flex: 1; height: 1px; background: var(--gold-20); }
        .t12-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 900px) { .t12-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .t12-grid { grid-template-columns: 1fr; } }

        .t12-grid-card { text-decoration: none; display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--gold-10); padding-bottom: 20px; }
        .t12-grid-card:hover .t12-grid-title { color: var(--gold, #C9A96E); }
        .t12-grid-img { width: 100%; aspect-ratio: 3/2; object-fit: cover; }
        .t12-grid-img-empty { width: 100%; aspect-ratio: 3/2; background: var(--panel); }
        .t12-grid-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold, #C9A96E); }
        .t12-grid-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 400; line-height: 1.3; color: var(--c-cream); transition: color 0.2s; }
        .t12-grid-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--text-25); margin-top: auto; }

        /* ── FOOTER ── */
        .t12-footer {
          border-top: 1px solid var(--gold-dim);
          padding: 32px 48px;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .t12-footer-logo { font-family: var(--f-display, Georgia, serif); font-size: 16px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-40); text-decoration: none; }
        .t12-footer-copy { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--text-20); letter-spacing: 0.08em; }

        @media (max-width: 768px) {
          .t12-header, .t12-hero-body, .t12-dual-art, .t12-strip-wrap, .t12-grid-wrap, .t12-footer { padding-left: 20px; padding-right: 20px; }
        }
      `}} />

      <div className="t12">
        {/* ── HEADER ── */}
        <header className="t12-header">
          <Link href="/" className="t12-logo">{home.heroLine1} <span>·</span> {home.heroLine2}</Link>
          <span className="t12-header-meta">{totalArticles} articles · {totalCats} rubriques</span>
        </header>

        {/* ── HERO ── */}
        {hero && (
          <div className="t12-hero">
            {hero.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={hero.imageUrl} alt={hero.title} className="t12-hero-bg" />
              : null
            }
            <div className="t12-hero-overlay" />
            <div className="t12-hero-body">
              <div className="t12-hero-kicker">{home.heroEyebrow}</div>
              <h1 className="t12-hero-title">
                <Link href={`/${catSlug(hero.category)}/${hero.slug}`}>{hero.title}</Link>
              </h1>
              <p className="t12-hero-desc">{hero.metaDescription || excerpt(hero.content, 180)}</p>
              <Link href={`/${catSlug(hero.category)}/${hero.slug}`} className="t12-hero-cta">
                Lire l&apos;article <span>→</span>
              </Link>
              <div className="t12-hero-meta">{hero.category} · {fmt(hero.publishedAt)}</div>
            </div>
          </div>
        )}

        {/* ── DEUX FEATURED ── */}
        {(featured2 || featured3) && (
          <div className="t12-dual">
            {featured2 && (
              <Link href={`/${catSlug(featured2.category)}/${featured2.slug}`} className="t12-dual-art">
                {featured2.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured2.imageUrl} alt={featured2.title} className="t12-dual-img" />
                  : <div className="t12-dual-img-empty" />
                }
                {featured2.category && <div className="t12-dual-cat">{featured2.category}</div>}
                <div className="t12-dual-title">{featured2.title}</div>
                <div className="t12-dual-desc">{featured2.metaDescription || excerpt(featured2.content)}</div>
                <div className="t12-dual-date">{fmt(featured2.publishedAt)}</div>
              </Link>
            )}
            {featured3 && (
              <Link href={`/${catSlug(featured3.category)}/${featured3.slug}`} className="t12-dual-art">
                {featured3.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured3.imageUrl} alt={featured3.title} className="t12-dual-img" />
                  : <div className="t12-dual-img-empty" />
                }
                {featured3.category && <div className="t12-dual-cat">{featured3.category}</div>}
                <div className="t12-dual-title">{featured3.title}</div>
                <div className="t12-dual-desc">{featured3.metaDescription || excerpt(featured3.content)}</div>
                <div className="t12-dual-date">{fmt(featured3.publishedAt)}</div>
              </Link>
            )}
          </div>
        )}

        {/* ── STRIP 4 ── */}
        {strip.length > 0 && (
          <div className="t12-strip-wrap">
            <div className="t12-strip-label">Sélection</div>
            <div className="t12-strip">
              {strip.map((a, i) => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t12-strip-art">
                  <span className="t12-strip-num">0{i + 1}</span>
                  {a.category && <span className="t12-strip-cat">{a.category}</span>}
                  <div className="t12-strip-title">{a.title}</div>
                  <div className="t12-strip-date">{fmt(a.publishedAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── GRID ── */}
        {grid.length > 0 && (
          <div className="t12-grid-wrap">
            <div className="t12-grid-label">Tous les articles</div>
            <div className="t12-grid">
              {grid.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t12-grid-card">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t12-grid-img" />
                    : <div className="t12-grid-img-empty" />
                  }
                  {a.category && <div className="t12-grid-cat">{a.category}</div>}
                  <div className="t12-grid-title">{a.title}</div>
                  <div className="t12-grid-date">{fmt(a.publishedAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── NOS RUBRIQUES ── */}
        {allCats.length > 0 && (
          <div style={{ padding: "48px 48px 0", borderTop: "1px solid var(--gold-10)" }}>
            <div style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold, #C9A96E)", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              Nos rubriques
              <span style={{ flex: 1, height: 1, background: "var(--gold-20)", display: "block" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(allCats.length, 4)}, 1fr)`, gap: 1, background: "var(--gold-8)", marginBottom: 48 }}>
              {allCats.map((c, i) => {
                const img = categoryHeroImages[c];
                return (
                  <Link key={c} href={`/${catSlug(c)}`} style={{ background: "var(--c-dark)", padding: "24px", textDecoration: "none", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10, minHeight: 140 }}>
                    {img && <img src={img} alt={c} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.08 }} />}
                    <span style={{ fontFamily: "var(--f-display, Georgia, serif)", fontSize: 11, color: "var(--gold-40)", position: "relative" }}>0{i + 1}</span>
                    <span style={{ fontFamily: "var(--f-display, Georgia, serif)", fontSize: 20, fontWeight: 400, color: "var(--c-cream)", lineHeight: 1.2, position: "relative" }}>{c}</span>
                    <span style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold, #C9A96E)", position: "relative", marginTop: "auto" }}>Explorer →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer className="t12-footer">
          <Link href="/" className="t12-footer-logo">{home.heroEyebrow}</Link>
          <span className="t12-footer-copy">© {new Date().getFullYear()} — Conseils d&apos;experts pour votre maison</span>
        </footer>
      </div>
    </>
  );
}
