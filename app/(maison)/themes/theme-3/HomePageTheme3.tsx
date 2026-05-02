import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 120) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  imageUrl: string | null;
  metaDescription: string | null;
  content: string;
  publishedAt: Date | null;
};

type HomeContent = {
  heroEyebrow: string;
  heroLine1: string;
  heroLine2: string;
  heroSub: string;
  heroCta: string;
  expertiseEyebrow: string;
  expertiseTitle: string;
};

type CategoryData = {
  slug: string;
  label: string | null;
  metaDescription: string | null;
  seoIntro: string | null;
  description: string | null;
  heroImage: string | null;
  bullets: unknown;
};

type Props = {
  home: HomeContent;
  heroImageUrl: string | null;
  expertiseCats: string[];
  extraCats: string[];
  categoryHeroImages: Record<string, string>;
  totalArticles: number;
  totalCats: number;
  heroArt: Article | undefined;
  cardArts: Article[];
  moreArts: Article[];
  categoriesData?: CategoryData[];
};

export function HomePageTheme3({
  home,
  expertiseCats,
  extraCats,
  categoryHeroImages,
  totalArticles,
  totalCats,
  heroArt,
  cardArts,
  moreArts,
  categoriesData = [],
}: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  // All 10 cardArts in grid, 5 altArts in alternating
  const gridArts = cardArts.slice(0, 10);
  const altArts = moreArts.slice(0, 5);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .t3-page { background: var(--c-cream); color: var(--c-dark); font-family: var(--f-body, Georgia, serif); }

        /* ── FEATURED HERO — full-width card ── */
        .t3-featured {
          max-width: 1280px; margin: 0 auto;
          padding: 40px 40px 0;
        }
        .t3-featured-card {
          display: grid; grid-template-columns: 55% 45%;
          border: 1.5px solid var(--c-border);
          border-radius: 12px; overflow: hidden;
          min-height: 460px;
        }
        @media (max-width: 860px) { .t3-featured-card { grid-template-columns: 1fr; min-height: auto; } }

        .t3-featured-img-wrap { position: relative; overflow: hidden; }
        .t3-featured-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s;
          border-radius: 0;
        }
        .t3-featured-card:hover .t3-featured-img { transform: scale(1.03); }

        .t3-featured-body {
          padding: 48px 52px;
          display: flex; flex-direction: column; justify-content: center;
          background: var(--c-cream-2);
        }
        @media (max-width: 860px) { .t3-featured-body { padding: 32px 28px; } }

        .t3-featured-eyebrow {
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .t3-featured-badge {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #fff; background: var(--c-terra, #b85c3a);
          padding: 5px 12px;
        }
        .t3-featured-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--c-sand);
        }

        .t3-featured-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(24px, 2.8vw, 38px); font-weight: 700;
          line-height: 1.15; color: var(--c-dark); margin-bottom: 18px;
        }
        .t3-featured-title a { color: inherit; text-decoration: none; }
        .t3-featured-title a:hover { text-decoration: underline; }

        .t3-featured-desc {
          font-size: 15px; color: var(--c-mid); line-height: 1.65;
          margin-bottom: 32px;
          display: -webkit-box; -webkit-line-clamp: 4;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        .t3-featured-cta {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--c-dark); text-decoration: none;
          border-bottom: 2px solid var(--c-dark); padding-bottom: 3px;
          width: fit-content;
        }
        .t3-featured-cta:hover { color: var(--c-terra, #b85c3a); border-color: var(--c-terra, #b85c3a); }

        .t3-featured-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: var(--c-sand); margin-top: 24px;
        }

        /* ── SECTION HEADER ── */
        .t3-section-wrap { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
        .t3-section-head {
          display: flex; align-items: center; gap: 16px;
          padding: 56px 0 32px;
        }
        .t3-section-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-dark); white-space: nowrap;
        }
        .t3-section-rule { flex: 1; height: 1px; background: var(--c-border); }

        /* ── GRID 5 colonnes ── */
        .t3-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 28px 20px;
        }
        @media (max-width: 1100px) { .t3-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px) { .t3-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 420px) { .t3-grid { grid-template-columns: 1fr; } }

        .t3-card { display: flex; flex-direction: column; }
        .t3-card-img-wrap {
          aspect-ratio: 4/3; overflow: hidden;
          margin-bottom: 14px; border-radius: 8px;
        }
        .t3-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t3-card:hover .t3-card-img { transform: scale(1.05); }
        .t3-card-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          color: var(--c-terra, #b85c3a);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 7px; display: block; text-decoration: none;
        }
        .t3-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 15px; font-weight: 700; line-height: 1.35;
          color: var(--c-dark); margin-bottom: 7px;
        }
        .t3-card-title a { color: inherit; text-decoration: none; }
        .t3-card-title a:hover { text-decoration: underline; }
        .t3-card-desc {
          font-size: 12px; color: var(--c-mid); line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 8px; flex: 1;
        }
        .t3-card-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: var(--c-sand);
        }

        /* ── ALTERNATING ROWS ── */
        .t3-alt-wrap {
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
        }
        .t3-alt-list {
          display: flex; flex-direction: column; gap: 24px;
        }
        .t3-alt-item {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; border: none;
          border-radius: 10px; overflow: hidden;
          background: var(--c-cream-2);
        }
        .t3-alt-item:nth-child(even) { grid-template-columns: 1fr 1fr; }
        .t3-alt-item:nth-child(even) .t3-alt-img-wrap { order: 2; }
        .t3-alt-item:nth-child(even) .t3-alt-text { order: 1; }
        @media (max-width: 760px) {
          .t3-alt-item,
          .t3-alt-item:nth-child(even) { grid-template-columns: 1fr; }
          .t3-alt-item:nth-child(even) .t3-alt-img-wrap { order: 0; }
          .t3-alt-item:nth-child(even) .t3-alt-text { order: 0; }
        }

        .t3-alt-img-wrap { overflow: hidden; border-radius: 8px; }
        .t3-alt-img {
          width: 100%; height: 100%; min-height: 280px;
          object-fit: cover; transition: transform 0.4s;
          display: block;
        }
        .t3-alt-item:hover .t3-alt-img { transform: scale(1.03); }

        .t3-alt-text {
          padding: 48px 56px;
          display: flex; flex-direction: column; justify-content: center;
        }
        @media (max-width: 900px) { .t3-alt-text { padding: 32px 24px; } }

        .t3-alt-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          color: var(--c-terra, #b85c3a);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 14px; display: block; text-decoration: none;
        }
        .t3-alt-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(20px, 2vw, 28px); font-weight: 700; line-height: 1.2;
          color: var(--c-dark); margin-bottom: 16px;
        }
        .t3-alt-title a { color: inherit; text-decoration: none; }
        .t3-alt-title a:hover { text-decoration: underline; }
        .t3-alt-desc {
          font-size: 14px; color: var(--c-mid); line-height: 1.7;
          margin-bottom: 24px;
        }
        .t3-alt-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--c-dark); text-decoration: none;
          border-bottom: 2px solid var(--c-dark); padding-bottom: 2px;
          width: fit-content;
        }
        .t3-alt-link:hover { color: var(--c-terra, #b85c3a); border-color: var(--c-terra, #b85c3a); }
        .t3-alt-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: var(--c-sand); margin-top: 20px; }

        /* ── RUBRIQUES ── pills discrets ── */
        .t3-cats-section {
          background: var(--c-cream-2);
          border-top: 1px solid var(--c-border);
          border-bottom: 1px solid var(--c-border);
          padding: 32px 40px;
        }
        .t3-cats-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .t3-cats-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--c-sand); white-space: nowrap; margin-right: 8px;
        }
        .t3-cat-pill {
          display: inline-block; text-decoration: none;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; font-weight: 600;
          color: var(--c-dark);
          border: 1px solid var(--c-border);
          border-radius: 100px;
          padding: 7px 16px;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .t3-cat-pill:hover {
          background: var(--c-dark); border-color: var(--c-dark); color: var(--c-cream);
        }

        /* ── STATS BAR ── */
        .t3-stats {
          background: var(--c-terra, #b85c3a);
          color: #fff; padding: 48px 40px;
        }
        .t3-stats-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; justify-content: center; gap: 96px;
          flex-wrap: wrap;
        }
        .t3-stat { text-align: center; }
        .t3-stat-n {
          font-family: var(--f-display, Georgia, serif);
          font-size: 52px; font-weight: 700; display: block; line-height: 1;
        }
        .t3-stat-l {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          opacity: 0.75; margin-top: 8px; display: block;
        }

        /* ── FOOTER ── */
        .t3-footer {
          background: var(--c-dark); color: rgba(255,255,255,0.4);
          text-align: center; padding: 32px 40px;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px;
        }

        /* ── NOIMG ── */
        .t3-noimg {
          background: var(--c-cream-2);
          display: flex; align-items: center; justify-content: center;
          width: 100%; height: 100%;
        }
        .t3-noimg-icon { font-size: 28px; opacity: 0.25; }
      `}} />

      <div className="t3-page">

        {/* ── ARTICLE À LA UNE ── */}
        {heroArt && (
          <div className="t3-featured">
            <div className="t3-featured-card">
              <div className="t3-featured-img-wrap">
                {heroArt.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={heroArt.imageUrl} alt={heroArt.title} className="t3-featured-img" />
                  : <div className="t3-noimg" style={{ minHeight: 460 }}><span className="t3-noimg-icon">🏠</span></div>
                }
              </div>
              <div className="t3-featured-body">
                <div className="t3-featured-eyebrow">
                  {heroArt.category && (
                    <Link href={`/${catSlug(heroArt.category)}`} className="t3-featured-badge">
                      {heroArt.category}
                    </Link>
                  )}
                  <span className="t3-featured-label">Article à la une</span>
                </div>
                <h2 className="t3-featured-title">
                  <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`}>{heroArt.title}</Link>
                </h2>
                {(heroArt.metaDescription || heroArt.content) && (
                  <p className="t3-featured-desc">
                    {heroArt.metaDescription || excerpt(heroArt.content, 220)}
                  </p>
                )}
                <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`} className="t3-featured-cta">
                  Lire l&apos;article →
                </Link>
                <div className="t3-featured-meta">{fmt(heroArt.publishedAt)}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── DERNIERS ARTICLES (10) ── */}
        {gridArts.length > 0 && (
          <div className="t3-section-wrap">
            <div className="t3-section-head">
              <span className="t3-section-label">Derniers articles</span>
              <div className="t3-section-rule" />
            </div>
            <div className="t3-grid">
              {gridArts.map(a => (
                <article key={a.id} className="t3-card">
                  <div className="t3-card-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t3-card-img" />
                      : <div className="t3-noimg" style={{ height: "100%" }}><span className="t3-noimg-icon">🏠</span></div>
                    }
                  </div>
                  {a.category && (
                    <Link href={`/${catSlug(a.category)}`} className="t3-card-cat">{a.category}</Link>
                  )}
                  <div className="t3-card-title">
                    <Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link>
                  </div>
                  <p className="t3-card-desc">
                    {a.metaDescription || excerpt(a.content)}
                  </p>
                  <div className="t3-card-meta">{fmt(a.publishedAt)}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ── À LIRE AUSSI (max 1200px, alternées) ── */}
        {altArts.length > 0 && (
          <div className="t3-section-wrap" style={{ paddingTop: 0 }}>
            <div className="t3-section-head">
              <span className="t3-section-label">À lire aussi</span>
              <div className="t3-section-rule" />
            </div>
            <div className="t3-alt-wrap" style={{ padding: 0 }}>
              <div className="t3-alt-list">
                {altArts.map(a => (
                  <article key={a.id} className="t3-alt-item">
                    <div className="t3-alt-img-wrap">
                      {a.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.imageUrl} alt={a.title} className="t3-alt-img" />
                        : <div className="t3-noimg" style={{ minHeight: 280 }} />
                      }
                    </div>
                    <div className="t3-alt-text">
                      {a.category && (
                        <Link href={`/${catSlug(a.category)}`} className="t3-alt-cat">{a.category}</Link>
                      )}
                      <h2 className="t3-alt-title">
                        <Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link>
                      </h2>
                      <p className="t3-alt-desc">
                        {a.metaDescription || excerpt(a.content, 240)}
                      </p>
                      <Link href={`/${catSlug(a.category)}/${a.slug}`} className="t3-alt-link">
                        Lire l&apos;article →
                      </Link>
                      <div className="t3-alt-meta">{fmt(a.publishedAt)}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NOS RUBRIQUES ── */}
        {allCats.length > 0 && (
          <div style={{ background: "var(--c-cream-2)", borderTop: "1px solid var(--c-border)", borderBottom: "1px solid var(--c-border)", padding: "48px 40px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <span style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-dark)", whiteSpace: "nowrap" }}>Nos rubriques</span>
                <div style={{ flex: 1, height: 1, background: "var(--c-border)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(allCats.length, 4)}, 1fr)`, gap: 20 }}>
                {allCats.map((c, i) => {
                  const slug = catSlug(c);
                  const meta = categoriesData.find(d => d.slug === slug);
                  const desc = meta?.description || meta?.seoIntro || meta?.metaDescription;
                  return (
                    <Link key={c} href={`/${slug}`} style={{ textDecoration: "none", borderRadius: 10, border: "1.5px solid var(--c-border)", padding: "24px 20px", background: "var(--c-cream)", display: "flex", flexDirection: "column", gap: 10, transition: "border-color 0.15s" }}>
                      <span style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 10, fontWeight: 700, color: "var(--c-terra, #b85c3a)", letterSpacing: "0.1em", textTransform: "uppercase" }}>0{i + 1}</span>
                      <span style={{ fontFamily: "var(--f-display, Georgia, serif)", fontSize: 22, fontWeight: 700, color: "var(--c-dark)", lineHeight: 1.2 }}>{c}</span>
                      {desc && <span style={{ fontFamily: "var(--f-body, Georgia, serif)", fontSize: 13, color: "var(--c-mid)", lineHeight: 1.5 }}>{desc}</span>}
                      <span style={{ fontFamily: "var(--f-heading, sans-serif)", fontSize: 11, color: "var(--c-sand)" }}>Voir tous les articles →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        <div className="t3-stats">
          <div className="t3-stats-inner">
            <div className="t3-stat">
              <span className="t3-stat-n">{totalArticles}+</span>
              <span className="t3-stat-l">Articles publiés</span>
            </div>
            <div className="t3-stat">
              <span className="t3-stat-n">{totalCats}</span>
              <span className="t3-stat-l">Rubriques</span>
            </div>
            <div className="t3-stat">
              <span className="t3-stat-n">100%</span>
              <span className="t3-stat-l">Conseils d&apos;experts</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="t3-footer">
          © {new Date().getFullYear()} Maison &amp; Conseil — Tous droits réservés
        </footer>

      </div>
    </>
  );
}
