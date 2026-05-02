import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 160) {
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

type CategoryData = {
  slug: string; label: string;
  metaDescription: string | null; seoIntro: string | null;
  description: string | null; heroImage: string | null;
  bullets: unknown;
};

type Props = {
  home: HomeContent; heroImageUrl: string | null;
  expertiseCats: string[]; extraCats: string[];
  categoryHeroImages: Record<string, string>;
  totalArticles: number; totalCats: number;
  heroArt: Article | undefined; cardArts: Article[]; moreArts: Article[];
  categoriesData?: CategoryData[];
};

export function HomePageTheme9({ home, expertiseCats, extraCats, totalArticles, totalCats, heroArt, cardArts, moreArts, categoriesData = [], categoryHeroImages = {} }: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const allArts = heroArt ? [heroArt, ...cardArts, ...moreArts] : [...cardArts, ...moreArts];

  // Section 1 : 6 derniers articles
  const latestArts = allArts.slice(0, 6);

  // Section 2 : 2 derniers articles par catégorie
  const byCat: Record<string, Article[]> = {};
  for (const a of allArts) {
    if (!a.category) continue;
    if (!byCat[a.category]) byCat[a.category] = [];
    if (byCat[a.category].length < 2) byCat[a.category].push(a);
  }
  const allArticleCats = [...new Set(allArts.map(a => a.category).filter(Boolean))] as string[];
  const catOrder = allArticleCats.sort((a, b) => {
    const ia = allCats.indexOf(a); const ib = allCats.indexOf(b);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1; if (ib === -1) return -1;
    return ia - ib;
  });
  const showCats = catOrder.filter(c => byCat[c]?.length > 0);

  // Section 3 : catégories du menu avec contenu
  const menuCats = allCats.map(name => {
    const slug = catSlug(name);
    const meta = categoriesData.find(c => c.slug === slug);
    const image = meta?.heroImage || categoryHeroImages[slug] || null;
    const description = meta?.description || meta?.seoIntro || meta?.metaDescription || null;
    return { name, slug, image, description };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .t9 {
          background: #fff;
          color: #111;
          font-family: var(--f-body, Georgia, serif);
        }

        /* ── SECTION COMMUNE ── */
        .t9-section {
          max-width: 1100px; margin: 0 auto;
          padding: 56px 40px;
          border-bottom: 1px solid #e8e8e8;
        }
        .t9-section-head {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: 32px; gap: 16px;
        }
        .t9-section-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 22px; font-weight: 700; letter-spacing: -0.01em; color: #111;
        }
        .t9-section-link {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); text-decoration: none;
          transition: opacity 0.15s;
        }
        .t9-section-link:hover { opacity: 0.7; }

        /* ── SECTION 1 : DERNIERS ARTICLES ── */

        /* Ligne hero : 1 grand + 2 empilés */
        .t9-latest-hero {
          display: grid; grid-template-columns: 3fr 2fr;
          gap: 0; margin-bottom: 1px;
          background: #e8e8e8;
        }
        @media (max-width: 760px) { .t9-latest-hero { grid-template-columns: 1fr; } }

        /* Grande carte */
        .t9-card-featured {
          text-decoration: none; display: flex; flex-direction: column;
          background: #fff; padding: 0 1px 1px 0;
        }
        .t9-card-featured-img {
          width: 100%; aspect-ratio: 3/2; object-fit: cover; display: block;
          transition: opacity 0.2s;
        }
        .t9-card-featured:hover .t9-card-featured-img { opacity: 0.9; }
        .t9-card-featured-img-empty {
          width: 100%; aspect-ratio: 3/2; background: #f0ece6; display: block;
        }
        .t9-card-featured-body {
          padding: 24px 28px 28px; flex: 1; display: flex; flex-direction: column;
        }
        .t9-card-featured-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 10px;
        }
        .t9-card-featured-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(20px, 2vw, 26px); font-weight: 700;
          line-height: 1.2; color: #111; flex: 1;
          transition: color 0.15s;
        }
        .t9-card-featured:hover .t9-card-featured-title { color: var(--c-terra, #b85c3a); }
        .t9-card-featured-desc {
          font-size: 14px; color: #666; line-height: 1.65; margin-top: 10px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9-card-featured-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #bbb; margin-top: 14px;
        }

        /* Colonne droite : 2 cartes empilées */
        .t9-latest-stack { display: flex; flex-direction: column; gap: 1px; background: #e8e8e8; }
        .t9-card-stacked {
          text-decoration: none; display: flex; gap: 0; flex: 1;
          background: #fff; flex-direction: column;
        }
        .t9-card-stacked-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
          transition: opacity 0.2s;
        }
        .t9-card-stacked:hover .t9-card-stacked-img { opacity: 0.88; }
        .t9-card-stacked-img-empty {
          width: 100%; aspect-ratio: 16/9; background: #f0ece6; display: block;
        }
        .t9-card-stacked-body {
          padding: 16px 20px 20px; flex: 1; display: flex; flex-direction: column;
        }
        .t9-card-stacked-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 7px;
        }
        .t9-card-stacked-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(14px, 1.3vw, 17px); font-weight: 700;
          line-height: 1.3; color: #111; flex: 1;
          transition: color 0.15s;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9-card-stacked:hover .t9-card-stacked-title { color: var(--c-terra, #b85c3a); }
        .t9-card-stacked-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #bbb; margin-top: 8px;
        }

        /* Rangée basse : 3 cartes verticales */
        .t9-latest-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #e8e8e8; margin-top: 1px;
        }
        @media (max-width: 600px) { .t9-latest-row { grid-template-columns: 1fr; } }

        .t9-card-row {
          text-decoration: none; display: flex; flex-direction: column;
          background: #fff;
        }
        .t9-card-row-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
          transition: opacity 0.2s;
        }
        .t9-card-row:hover .t9-card-row-img { opacity: 0.88; }
        .t9-card-row-img-empty {
          width: 100%; aspect-ratio: 16/9; background: #f0ece6; display: block;
        }
        .t9-card-row-body { padding: 16px 20px 20px; flex: 1; display: flex; flex-direction: column; }
        .t9-card-row-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 7px;
        }
        .t9-card-row-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(14px, 1.2vw, 16px); font-weight: 700; line-height: 1.3; color: #111; flex: 1;
          transition: color 0.15s;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9-card-row:hover .t9-card-row-title { color: var(--c-terra, #b85c3a); }
        .t9-card-row-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #bbb; margin-top: 10px;
        }

        /* ── SECTION 2 : PAR CATÉGORIE ── */
        .t9-bycat-block {
          margin-bottom: 40px;
        }
        .t9-bycat-block:last-child { margin-bottom: 0; }
        .t9-bycat-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; padding-bottom: 12px;
          border-bottom: 2px solid #111;
          gap: 12px;
        }
        .t9-bycat-name {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: #111;
        }
        .t9-bycat-more {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); text-decoration: none;
          transition: opacity 0.15s;
        }
        .t9-bycat-more:hover { opacity: 0.7; }
        .t9-bycat-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
        }
        @media (max-width: 560px) { .t9-bycat-grid { grid-template-columns: 1fr; } }

        .t9-bycat-card {
          text-decoration: none; display: flex; flex-direction: column;
        }
        .t9-bycat-card-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
          margin-bottom: 14px;
          transition: opacity 0.2s;
        }
        .t9-bycat-card:hover .t9-bycat-card-img { opacity: 0.85; }
        .t9-bycat-card-img-empty {
          width: 100%; aspect-ratio: 16/9; background: #f0ece6; display: block; margin-bottom: 14px;
        }
        .t9-bycat-card-body { flex: 1; }
        .t9-bycat-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(15px, 1.3vw, 17px); font-weight: 700; line-height: 1.3; color: #111;
          transition: color 0.15s;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9-bycat-card:hover .t9-bycat-card-title { color: var(--c-terra, #b85c3a); }
        .t9-bycat-card-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #bbb; margin-top: 8px;
        }

        /* ── SECTION 3 : MISE EN AVANT CATÉGORIES ── */
        .t9-cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .t9-cat-tile {
          position: relative; overflow: hidden;
          text-decoration: none; display: block;
          aspect-ratio: 4/3; background: #111;
        }
        .t9-cat-tile-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          opacity: 0.75;
          transition: transform 0.4s ease, opacity 0.3s;
        }
        .t9-cat-tile:hover .t9-cat-tile-img { transform: scale(1.04); opacity: 0.6; }
        .t9-cat-tile-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 60%);
        }
        .t9-cat-tile-body {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 22px; z-index: 1;
        }
        .t9-cat-tile-name {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(18px, 2vw, 24px); font-weight: 700;
          color: #fff; line-height: 1.2; margin-bottom: 6px;
        }
        .t9-cat-tile-desc {
          font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9-cat-tile-cta {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-top: 10px; display: block;
          transition: color 0.15s;
        }
        .t9-cat-tile:hover .t9-cat-tile-cta { color: #fff; }

        /* ── FOOTER ── */
        .t9-footer {
          padding: 28px 40px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          max-width: 1100px; margin: 0 auto;
        }
        .t9-footer-brand {
          font-family: var(--f-display, Georgia, serif);
          font-size: 16px; font-weight: 700; letter-spacing: -0.015em;
          color: #111; text-decoration: none;
        }
        .t9-footer-copy {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #bbb;
        }

        @media (max-width: 768px) {
          .t9-section { padding: 40px 20px; }
          .t9-footer { padding: 24px 20px; }
        }
      `}} />

      <div className="t9">

        {/* ── SECTION 1 : DERNIERS ARTICLES ── */}
        {latestArts.length > 0 && (
          <section className="t9-section">
            <div className="t9-section-head">
              <span className="t9-section-title">Derniers articles</span>
            </div>

            {/* Ligne hero : article featured + 2 empilés */}
            <div className="t9-latest-hero">
              {latestArts[0] && (
                <Link href={`/${catSlug(latestArts[0].category)}/${latestArts[0].slug}`} className="t9-card-featured">
                  {latestArts[0].imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={latestArts[0].imageUrl} alt={latestArts[0].title} className="t9-card-featured-img" />
                    : <div className="t9-card-featured-img-empty" />
                  }
                  <div className="t9-card-featured-body">
                    {latestArts[0].category && <span className="t9-card-featured-cat">{latestArts[0].category}</span>}
                    <div className="t9-card-featured-title">{latestArts[0].title}</div>
                    <p className="t9-card-featured-desc">{latestArts[0].metaDescription || excerpt(latestArts[0].content)}</p>
                    <div className="t9-card-featured-date">{fmt(latestArts[0].publishedAt)}</div>
                  </div>
                </Link>
              )}
              <div className="t9-latest-stack">
                {latestArts.slice(1, 3).map(a => (
                  <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t9-card-stacked">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t9-card-stacked-img" />
                      : <div className="t9-card-stacked-img-empty" />
                    }
                    <div className="t9-card-stacked-body">
                      {a.category && <span className="t9-card-stacked-cat">{a.category}</span>}
                      <div className="t9-card-stacked-title">{a.title}</div>
                      <div className="t9-card-stacked-date">{fmt(a.publishedAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rangée basse : 3 cartes verticales */}
            {latestArts.length > 3 && (
              <div className="t9-latest-row">
                {latestArts.slice(3, 6).map(a => (
                  <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t9-card-row">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t9-card-row-img" />
                      : <div className="t9-card-row-img-empty" />
                    }
                    <div className="t9-card-row-body">
                      {a.category && <span className="t9-card-row-cat">{a.category}</span>}
                      <div className="t9-card-row-title">{a.title}</div>
                      <div className="t9-card-row-date">{fmt(a.publishedAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── SECTION 2 : 2 DERNIERS PAR CATÉGORIE ── */}
        {showCats.length > 0 && (
          <section className="t9-section">
            <div className="t9-section-head">
              <span className="t9-section-title">Par rubrique</span>
            </div>
            {showCats.map(cat => (
              <div key={cat} className="t9-bycat-block">
                <div className="t9-bycat-head">
                  <span className="t9-bycat-name">{cat}</span>
                  <Link href={`/${catSlug(cat)}`} className="t9-bycat-more">Voir tout →</Link>
                </div>
                <div className="t9-bycat-grid">
                  {byCat[cat].map(a => (
                    <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t9-bycat-card">
                      {a.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.imageUrl} alt={a.title} className="t9-bycat-card-img" />
                        : <div className="t9-bycat-card-img-empty" />
                      }
                      <div className="t9-bycat-card-title">{a.title}</div>
                      <div className="t9-bycat-card-date">{fmt(a.publishedAt)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── SECTION 3 : MISE EN AVANT DES CATÉGORIES ── */}
        {menuCats.length > 0 && (
          <section className="t9-section">
            <div className="t9-section-head">
              <span className="t9-section-title">Nos rubriques</span>
            </div>
            <div className="t9-cat-grid">
              {menuCats.map(c => (
                <Link key={c.slug} href={`/${c.slug}`} className="t9-cat-tile">
                  {c.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={c.image} alt={c.name} className="t9-cat-tile-img" />
                    : <div style={{ position: "absolute", inset: 0, background: "#1a1a1a" }} />
                  }
                  <div className="t9-cat-tile-overlay" />
                  <div className="t9-cat-tile-body">
                    <div className="t9-cat-tile-name">{c.name}</div>
                    {c.description && <p className="t9-cat-tile-desc">{c.description}</p>}
                    <span className="t9-cat-tile-cta">Explorer →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer className="t9-footer">
          <Link href="/" className="t9-footer-brand">{home.heroLine1} {home.heroLine2}</Link>
          <span className="t9-footer-copy">© {new Date().getFullYear()} — {totalArticles} articles · {totalCats} rubriques</span>
        </footer>

      </div>
    </>
  );
}
