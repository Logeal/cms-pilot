import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 110) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

function readTime(wc: number | null | undefined) {
  if (!wc) return null;
  return Math.ceil(wc / 200);
}

const CAT_COLORS: Record<number, { bg: string; text: string; badge: string; badgeText: string }> = {
  0: { bg: "#E8DDD0", text: "#8B6F5A", badge: "#D4B896", badgeText: "#6B4F3A" },
  1: { bg: "#C8D8C8", text: "#4A6B4A", badge: "#9EBF9E", badgeText: "#3A5A3A" },
  2: { bg: "#C8C0D8", text: "#5A4A6B", badge: "#A89EBF", badgeText: "#4A3A5A" },
  3: { bg: "#BDD0D8", text: "#3A5A6B", badge: "#8BB4C0", badgeText: "#2A4A5A" },
  4: { bg: "#D8C0C0", text: "#6B3A3A", badge: "#C89898", badgeText: "#5A2A2A" },
  5: { bg: "#C8D0C0", text: "#4A5A3A", badge: "#9AB49A", badgeText: "#3A4A2A" },
};

function getCatColor(name: string | null | undefined) {
  if (!name) return CAT_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 6;
  return CAT_COLORS[h];
}

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null; wordCount?: number | null;
  author?: string | null;
};

type CategoryData = {
  slug: string; label: string;
  metaDescription: string | null; seoIntro: string | null;
};

type HomeContent = {
  heroEyebrow: string; heroLine1: string; heroLine2: string;
  heroSub: string; heroCta: string;
  expertiseEyebrow: string; expertiseTitle: string;
};

type Props = {
  home: HomeContent; heroImageUrl: string | null;
  expertiseCats: string[]; extraCats: string[];
  categoryHeroImages: Record<string, string>;
  totalArticles: number; totalCats: number;
  heroArt: Article | undefined; cardArts: Article[]; moreArts: Article[];
  categoriesData?: CategoryData[];
};

export function HomePageTheme6({
  expertiseCats, extraCats, categoryHeroImages,
  totalArticles, totalCats, heroArt, cardArts, moreArts,
  categoriesData = [],
}: Props) {
  const allCats = [...expertiseCats, ...extraCats];

  // Hero sidebar: next 6 articles
  const sideArts = cardArts.slice(0, 6);

  // Group all articles by category (excluding heroArt)
  const allArts = [heroArt, ...cardArts, ...moreArts].filter(Boolean) as Article[];
  // Toutes les catégories présentes dans les articles, dans l'ordre de la config si disponible
  const allArticleCats = [...new Set(allArts.map(a => a.category).filter(Boolean))] as string[];
  const catOrder = allArticleCats.sort((a, b) => {
    const ia = allCats.indexOf(a);
    const ib = allCats.indexOf(b);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const grouped: { name: string; slug: string; articles: Article[] }[] = catOrder.map(name => {
    const slug = catSlug(name);
    const arts = allArts.filter(a => a.category === name);
    return { name, slug, articles: arts };
  }).filter(g => g.articles.length > 0);

  const heroColor = getCatColor(heroArt?.category);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t6-page { background: var(--c-cream); color: var(--c-dark); font-family: var(--f-body, Georgia, serif); min-height: 100vh; }

        /* ══════════════════════════════════════
           HERO SECTION
        ══════════════════════════════════════ */
        .t6-hero-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 32px 40px 0;
        }
        .t6-eyebrow {
          display: flex; align-items: center; gap: 12px;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--c-terra, #C4603A);
          margin-bottom: 20px;
        }
        .t6-eyebrow::before {
          content: ""; display: block;
          width: 32px; height: 2px;
          background: var(--c-terra, #C4603A);
        }
        .t6-hero-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px; align-items: start;
        }
        @media (max-width: 900px) { .t6-hero-grid { grid-template-columns: 1fr; } }

        /* Grand article hero */
        .t6-hero-main {
          background: var(--c-cream);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .t6-hero-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
        }
        .t6-hero-placeholder {
          width: 100%; aspect-ratio: 16/9;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .t6-hero-placeholder-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .t6-hero-stripe {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            rgba(255,255,255,0.18) 8px,
            rgba(255,255,255,0.18) 9px
          );
        }
        .t6-hero-body {
          padding: 28px 32px 32px;
        }
        .t6-hero-pills {
          display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;
        }
        .t6-pill {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.04em;
          padding: 4px 12px;
          border-radius: 20px;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .t6-pill:hover { opacity: 0.75; }
        .t6-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(22px, 2.8vw, 38px);
          font-weight: 700; line-height: 1.15;
          color: var(--c-dark); margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .t6-hero-title a { color: inherit; text-decoration: none; }
        .t6-hero-title a:hover { color: var(--c-terra, #C4603A); }
        .t6-hero-desc {
          font-size: 15px; color: var(--c-mid); line-height: 1.65;
          margin-bottom: 18px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t6-hero-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: var(--c-sand);
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .t6-hero-meta-dot { width: 3px; height: 3px; background: var(--c-border); border-radius: 50%; display: inline-block; }

        /* Sidebar 4 petites cartes */
        .t6-hero-side { display: flex; flex-direction: column; gap: 12px; }
        .t6-side-card {
          background: var(--c-cream); border-radius: 10px; overflow: hidden;
          display: flex; text-decoration: none;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s;
        }
        .t6-side-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .t6-side-img-wrap {
          width: 96px; flex-shrink: 0;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .t6-side-img { width: 100%; height: 100%; object-fit: cover; }
        .t6-side-placeholder {
          width: 96px; height: 100%; min-height: 80px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .t6-side-placeholder-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-align: center; line-height: 1.3;
          padding: 0 6px;
          position: relative; z-index: 1;
        }
        .t6-side-body { padding: 12px 14px; flex: 1; display: flex; flex-direction: column; }
        .t6-side-badge {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.06em;
          padding: 2px 8px; border-radius: 10px;
          display: inline-block; margin-bottom: 6px;
          align-self: flex-start;
        }
        .t6-side-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 13px; font-weight: 700; line-height: 1.35;
          color: var(--c-dark); flex: 1;
          transition: color 0.15s;
        }
        .t6-side-card:hover .t6-side-title { color: var(--c-terra, #C4603A); }
        .t6-side-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: var(--c-sand); margin-top: 6px;
        }

        /* ══════════════════════════════════════
           SECTIONS PAR CATÉGORIE
        ══════════════════════════════════════ */
        .t6-cats-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 56px 40px 40px;
          display: flex; flex-direction: column; gap: 56px;
        }
        .t6-cat-section {}
        .t6-cat-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .t6-cat-header-left {
          display: flex; align-items: center; gap: 12px;
        }
        .t6-cat-dot {
          width: 10px; height: 10px; border-radius: 50%;
          flex-shrink: 0;
        }
        .t6-cat-name {
          font-family: var(--f-display, Georgia, serif);
          font-size: 24px; font-weight: 700; color: var(--c-dark);
        }
        .t6-cat-count {
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: var(--c-sand);
        }
        .t6-cat-link {
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; font-weight: 600;
          color: var(--c-terra, #C4603A);
          text-decoration: none;
          display: flex; align-items: center; gap: 4px;
          transition: gap 0.15s;
        }
        .t6-cat-link:hover { gap: 8px; }

        /* Grille articles */
        .t6-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .t6-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .t6-grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .t6-grid-3, .t6-grid-2 { grid-template-columns: 1fr; } }

        .t6-art-card {
          background: var(--c-cream);
          border-radius: 10px; overflow: hidden;
          text-decoration: none;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s, transform 0.2s;
          display: flex; flex-direction: column;
        }
        .t6-art-card:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.09);
          transform: translateY(-2px);
        }
        .t6-art-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
        }
        .t6-art-placeholder {
          width: 100%; aspect-ratio: 16/9;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .t6-art-placeholder-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .t6-art-body { padding: 18px 20px 20px; flex: 1; display: flex; flex-direction: column; }
        .t6-art-badge {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.04em;
          padding: 3px 10px; border-radius: 12px;
          display: inline-block; margin-bottom: 10px;
          align-self: flex-start;
        }
        .t6-art-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 17px; font-weight: 700; line-height: 1.3;
          color: var(--c-dark); margin-bottom: 10px; flex: 1;
          transition: color 0.15s;
        }
        .t6-art-card:hover .t6-art-title { color: var(--c-terra, #C4603A); }
        .t6-art-desc {
          font-size: 13px; color: var(--c-mid); line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 12px;
        }
        .t6-art-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: var(--c-sand);
          display: flex; align-items: center; gap: 6px;
        }
        .t6-art-meta-sep { color: var(--c-border); }
      `}} />

      <div className="t6-page">

        {/* ── HERO ── */}
        <div className="t6-hero-wrap">
          <div className="t6-eyebrow">L&apos;information professionnelle de l&apos;immobilier</div>
          <div className="t6-hero-grid">

            {heroArt && (() => {
              const hc = getCatColor(heroArt.category);
              return (
                <div className="t6-hero-main">
                  {heroArt.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={heroArt.imageUrl} alt={heroArt.title} className="t6-hero-img" />
                    : (
                      <div className="t6-hero-placeholder" style={{ background: hc.bg }}>
                        <div className="t6-hero-stripe" />
                        <span className="t6-hero-placeholder-label" style={{ color: hc.text }}>
                          {heroArt.category?.toUpperCase()}
                        </span>
                      </div>
                    )
                  }
                  <div className="t6-hero-body">
                    <div className="t6-hero-pills">
                      {heroArt.category && (
                        <Link
                          href={`/${catSlug(heroArt.category)}`}
                          className="t6-pill"
                          style={{ background: hc.badge, color: hc.badgeText }}
                        >
                          {heroArt.category}
                        </Link>
                      )}
                      <span className="t6-pill" style={{ background: "#E8DDD0", color: "#6B4F3A" }}>
                        À la une
                      </span>
                    </div>
                    <h2 className="t6-hero-title">
                      <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`}>
                        {heroArt.title}
                      </Link>
                    </h2>
                    <p className="t6-hero-desc">
                      {heroArt.metaDescription || excerpt(heroArt.content, 160)}
                    </p>
                    <div className="t6-hero-meta">
                      {(heroArt as Article & { author?: string | null }).author && (
                        <strong>{(heroArt as Article & { author?: string | null }).author}</strong>
                      )}
                      {(heroArt as Article & { author?: string | null }).author && <span className="t6-hero-meta-dot" />}
                      {fmt(heroArt.publishedAt) && <span>{fmt(heroArt.publishedAt)}</span>}
                      {readTime((heroArt as Article & { wordCount?: number | null }).wordCount) && (
                        <>
                          <span className="t6-hero-meta-dot" />
                          <span>{readTime((heroArt as Article & { wordCount?: number | null }).wordCount)} min de lecture</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="t6-hero-side">
              {sideArts.map(a => {
                const sc = getCatColor(a.category);
                return (
                  <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t6-side-card">
                    {a.imageUrl
                      ? (
                        <div className="t6-side-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.imageUrl} alt={a.title} className="t6-side-img" />
                        </div>
                      )
                      : (
                        <div className="t6-side-placeholder" style={{ background: sc.bg }}>
                          <div className="t6-hero-stripe" />
                          <span className="t6-side-placeholder-label" style={{ color: sc.text }}>
                            {a.category?.toUpperCase()}
                          </span>
                        </div>
                      )
                    }
                    <div className="t6-side-body">
                      {a.category && (
                        <span className="t6-side-badge" style={{ background: sc.badge, color: sc.badgeText }}>
                          {a.category}
                        </span>
                      )}
                      <div className="t6-side-title">{a.title}</div>
                      <div className="t6-side-meta">
                        {(a as Article & { author?: string | null }).author && `${(a as Article & { author?: string | null }).author} · `}
                        {readTime((a as Article & { wordCount?: number | null }).wordCount)
                          ? `${readTime((a as Article & { wordCount?: number | null }).wordCount)} min`
                          : fmt(a.publishedAt)
                        }
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTIONS PAR CATÉGORIE (derniers articles par rubrique) ── */}
        {grouped.length > 0 && (
          <div className="t6-cats-wrap">
            {grouped.map((g, gi) => {
              const gc = getCatColor(g.name);
              const arts = g.articles.slice(0, 3);
              const gridClass = arts.length === 1 ? "t6-grid-2" : arts.length === 2 ? "t6-grid-2" : "t6-grid-3";
              return (
                <div key={g.slug} className="t6-cat-section">
                  <div className="t6-cat-header">
                    <div className="t6-cat-header-left">
                      <div className="t6-cat-dot" style={{ background: gc.badge }} />
                      <span className="t6-cat-name">{g.name}</span>
                      <span className="t6-cat-count">{g.articles.length} article{g.articles.length > 1 ? "s" : ""}</span>
                    </div>
                    <Link href={`/${g.slug}`} className="t6-cat-link">
                      Tout voir →
                    </Link>
                  </div>
                  <div className={gridClass}>
                    {arts.map(a => (
                      <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t6-art-card">
                        {a.imageUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={a.imageUrl} alt={a.title} className="t6-art-img" />
                          : (
                            <div className="t6-art-placeholder" style={{ background: gc.bg }}>
                              <div className="t6-hero-stripe" />
                              <span className="t6-art-placeholder-label" style={{ color: gc.text }}>
                                {a.category?.toUpperCase()}
                              </span>
                            </div>
                          )
                        }
                        <div className="t6-art-body">
                          {a.category && (
                            <span className="t6-art-badge" style={{ background: gc.badge, color: gc.badgeText }}>
                              {a.category}
                            </span>
                          )}
                          <div className="t6-art-title">{a.title}</div>
                          <p className="t6-art-desc">{a.metaDescription || excerpt(a.content)}</p>
                          <div className="t6-art-meta">
                            {(a as Article & { author?: string | null }).author && (
                              <strong>{(a as Article & { author?: string | null }).author}</strong>
                            )}
                            {(a as Article & { author?: string | null }).author && <span className="t6-art-meta-sep">·</span>}
                            {readTime((a as Article & { wordCount?: number | null }).wordCount)
                              ? <span>{readTime((a as Article & { wordCount?: number | null }).wordCount)} min</span>
                              : <span>{fmt(a.publishedAt)}</span>
                            }
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── STATS + FOOTER ── */}
        <div style={{ background: "var(--c-dark, #0f1923)", padding: "48px 40px", marginTop: 16 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "center", gap: 80, flexWrap: "wrap", textAlign: "center", marginBottom: 40 }}>
            <div><span style={{ fontFamily: "var(--f-display, Georgia, serif)", fontSize: 44, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1 }}>{totalArticles}+</span><span style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 8, display: "block" }}>Articles publiés</span></div>
            <div><span style={{ fontFamily: "var(--f-display, Georgia, serif)", fontSize: 44, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1 }}>{totalCats}</span><span style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 8, display: "block" }}>Rubriques</span></div>
            <div><span style={{ fontFamily: "var(--f-display, Georgia, serif)", fontSize: 44, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1 }}>100%</span><span style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 8, display: "block" }}>Conseils d&apos;experts</span></div>
          </div>
          <p style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center", fontFamily: "var(--f-heading, sans-serif)", fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
            © {new Date().getFullYear()} Maison &amp; Conseil — Tous vos conseils immobilier, décoration &amp; maison
          </p>
        </div>

      </div>
    </>
  );
}
