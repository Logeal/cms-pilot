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

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null;
};

type CategoryData = {
  slug: string; label: string;
  metaDescription: string | null; seoIntro: string | null;
  description: string | null; heroImage: string | null; bullets: unknown;
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

export function HomePageTheme5({
  expertiseCats, extraCats, categoryHeroImages,
  totalArticles, heroArt, cardArts, moreArts,
  categoriesData = [],
}: Props) {
  const allCats = [...expertiseCats, ...extraCats];

  // Section 1 : hero (1) + sidebar (3) = 4 articles
  const sideArts = cardArts.slice(0, 3);

  // Section 2 : 8 articles suivants
  const gridArts = [...cardArts.slice(3), ...moreArts.slice(0, 5)].slice(0, 8);

  // Section 3 : catégories enrichies
  const showcaseCats = allCats.map(name => {
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    const meta = categoriesData.find(c => c.slug === slug);
    return {
      name, slug,
      description: meta?.description || meta?.seoIntro || meta?.metaDescription || `Retrouvez tous nos conseils et articles sur le thème ${name}.`,
      image: categoryHeroImages[name] || null,
    };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t5-page { background: var(--c-cream); color: var(--c-dark); font-family: var(--f-body, Georgia, serif); }

        /* ══════════════════════════════════════
           SECTION 1 — HERO SPLIT
        ══════════════════════════════════════ */
        .t5-hero-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 32px 40px 0;
        }
        .t5-hero-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--c-sand); margin-bottom: 16px; display: block;
        }
        .t5-hero-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 12px; align-items: stretch;
        }
        @media (max-width: 900px) { .t5-hero-grid { grid-template-columns: 1fr; } }

        /* Grand article */
        .t5-hero-main {
          position: relative; overflow: hidden;
          border-radius: 8px; min-height: 520px;
          display: flex; flex-direction: column; justify-content: flex-end;
          background: var(--c-dark);
        }
        .t5-hero-main-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s;
        }
        .t5-hero-main:hover .t5-hero-main-img { transform: scale(1.03); }
        .t5-hero-main-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.08) 100%);
        }
        .t5-hero-main-body {
          position: relative; z-index: 1;
          padding: 32px 36px;
        }
        .t5-hero-main-cat {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; background: var(--c-terra, #e05a1b);
          padding: 4px 10px; margin-bottom: 16px;
          text-decoration: none; border-radius: 2px;
        }
        .t5-hero-main-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(26px, 3.2vw, 44px); font-weight: 700;
          line-height: 1.1; color: #fff; margin-bottom: 14px;
        }
        .t5-hero-main-title a { color: inherit; text-decoration: none; }
        .t5-hero-main-title a:hover { text-decoration: underline; }
        .t5-hero-main-desc { font-size: 14px; color: rgba(255,255,255,0.72); line-height: 1.6; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .t5-hero-main-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--c-cream); color: var(--c-dark);
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 10px 20px; text-decoration: none; border-radius: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .t5-hero-main-cta:hover { background: var(--c-terra, #e05a1b); color: #fff; }
        .t5-hero-main-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 14px; }

        /* Sidebar 3 articles */
        .t5-hero-side {
          display: flex; flex-direction: column; gap: 12px;
        }
        .t5-side-card {
          background: var(--c-cream-2); border-radius: 8px; overflow: hidden;
          flex: 1; display: flex; flex-direction: column;
          text-decoration: none; transition: box-shadow 0.2s;
          border: 1px solid var(--c-border);
        }
        .t5-side-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); }
        .t5-side-card:hover .t5-side-title { color: var(--c-terra, #e05a1b); }
        .t5-side-img-wrap { aspect-ratio: 16/9; overflow: hidden; }
        .t5-side-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t5-side-card:hover .t5-side-img { transform: scale(1.04); }
        .t5-side-img-empty { aspect-ratio: 16/9; background: var(--c-border); }
        .t5-side-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; }
        .t5-side-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700;
          color: var(--c-terra, #e05a1b);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 5px;
        }
        .t5-side-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 14px; font-weight: 700; line-height: 1.3;
          color: var(--c-dark); transition: color 0.15s; flex: 1;
        }
        .t5-side-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--c-sand); margin-top: 8px; }

        /* ══════════════════════════════════════
           SECTION 2 — DERNIERS ARTICLES
        ══════════════════════════════════════ */
        .t5-latest-wrap { max-width: 1280px; margin: 0 auto; padding: 56px 40px 0; }
        .t5-section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; padding-bottom: 16px;
          border-bottom: 2px solid var(--c-dark);
        }
        .t5-section-title {
          font-family: var(--f-heading, sans-serif);
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-dark);
        }
        .t5-section-count {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: var(--c-sand);
        }

        .t5-latest-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 20px;
        }
        @media (max-width: 1000px) { .t5-latest-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px) { .t5-latest-grid { grid-template-columns: repeat(2, 1fr); } }

        .t5-card {
          display: flex; flex-direction: column;
          text-decoration: none;
        }
        .t5-card-img-wrap {
          aspect-ratio: 16/10; overflow: hidden;
          border-radius: 6px; margin-bottom: 14px;
        }
        .t5-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t5-card:hover .t5-card-img { transform: scale(1.04); }
        .t5-card-img-empty { aspect-ratio: 16/10; background: var(--c-border); border-radius: 6px; margin-bottom: 14px; }

        .t5-card-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700;
          color: var(--c-terra, #e05a1b);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 7px;
        }
        .t5-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 16px; font-weight: 700; line-height: 1.3;
          color: var(--c-dark); margin-bottom: 8px; flex: 1;
          transition: color 0.15s;
        }
        .t5-card:hover .t5-card-title { color: var(--c-terra, #e05a1b); }
        .t5-card-desc {
          font-size: 13px; color: var(--c-mid); line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 10px;
        }
        .t5-card-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--c-sand); }

        /* ══════════════════════════════════════
           SECTION 3 — RUBRIQUES B2B
        ══════════════════════════════════════ */
        .t5-cats-wrap {
          background: var(--c-dark, #111);
          margin-top: 72px; padding: 72px 40px;
        }
        .t5-cats-inner { max-width: 1280px; margin: 0 auto; }
        .t5-cats-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 40px; padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap; gap: 12px;
        }
        .t5-cats-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(28px, 3.5vw, 44px); font-weight: 700;
          color: #fff; line-height: 1;
        }
        .t5-cats-subtitle {
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: rgba(255,255,255,0.35);
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        .t5-cats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) { .t5-cats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t5-cats-grid { grid-template-columns: 1fr; } }

        .t5-cat-card {
          display: flex; flex-direction: column;
          text-decoration: none;
          border-radius: 8px; overflow: hidden;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }
        .t5-cat-card:hover { background: rgba(255,255,255,0.08); border-color: var(--c-terra, #e05a1b); }

        .t5-cat-img-wrap { aspect-ratio: 16/9; overflow: hidden; position: relative; }
        .t5-cat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; opacity: 0.75; }
        .t5-cat-card:hover .t5-cat-img { transform: scale(1.04); opacity: 0.9; }
        .t5-cat-img-empty { aspect-ratio: 16/9; background: rgba(255,255,255,0.06); }

        .t5-cat-body { padding: 22px 24px 24px; flex: 1; display: flex; flex-direction: column; }
        .t5-cat-tag {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--c-terra, #e05a1b);
          margin-bottom: 10px;
        }
        .t5-cat-name {
          font-family: var(--f-display, Georgia, serif);
          font-size: 22px; font-weight: 700; color: #fff;
          margin-bottom: 12px; line-height: 1.15;
          transition: color 0.15s;
        }
        .t5-cat-card:hover .t5-cat-name { color: var(--c-terra, #e05a1b); }
        .t5-cat-desc {
          font-size: 13px; color: rgba(255,255,255,0.55);
          line-height: 1.65; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 20px;
        }
        .t5-cat-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 16px; transition: color 0.15s;
        }
        .t5-cat-card:hover .t5-cat-cta { color: var(--c-terra, #e05a1b); }

        /* ══════════════════════════════════════
           STATS
        ══════════════════════════════════════ */
        .t5-stats {
          background: var(--c-terra, #e05a1b);
          padding: 48px 40px;
        }
        .t5-stats-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; justify-content: center; gap: 96px; flex-wrap: wrap;
        }
        .t5-stat { text-align: center; }
        .t5-stat-n { font-family: var(--f-display, Georgia, serif); font-size: 48px; font-weight: 700; color: #fff; display: block; line-height: 1; }
        .t5-stat-l { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-top: 8px; display: block; }

        .t5-noimg { background: var(--c-border); display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
      `}} />

      <div className="t5-page">

        {/* ── SECTION 1 : HERO ── */}
        <div className="t5-hero-wrap">
          <span className="t5-hero-label">À la une</span>
          <div className="t5-hero-grid">

            {heroArt && (
              <div className="t5-hero-main">
                {heroArt.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={heroArt.imageUrl} alt={heroArt.title} className="t5-hero-main-img" />
                  : <div className="t5-hero-main-img t5-noimg" />
                }
                <div className="t5-hero-main-overlay" />
                <div className="t5-hero-main-body">
                  {heroArt.category && (
                    <Link href={`/${catSlug(heroArt.category)}`} className="t5-hero-main-cat">{heroArt.category}</Link>
                  )}
                  <h2 className="t5-hero-main-title">
                    <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`}>{heroArt.title}</Link>
                  </h2>
                  <p className="t5-hero-main-desc">{heroArt.metaDescription || excerpt(heroArt.content, 140)}</p>
                  <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`} className="t5-hero-main-cta">
                    Lire l&apos;article →
                  </Link>
                  <div className="t5-hero-main-meta">{fmt(heroArt.publishedAt)}</div>
                </div>
              </div>
            )}

            <div className="t5-hero-side">
              {sideArts.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t5-side-card">
                  <div className="t5-side-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t5-side-img" />
                      : <div className="t5-side-img-empty" />
                    }
                  </div>
                  <div className="t5-side-body">
                    {a.category && <div className="t5-side-cat">{a.category}</div>}
                    <div className="t5-side-title">{a.title}</div>
                    <div className="t5-side-meta">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 2 : DERNIERS ARTICLES ── */}
        {gridArts.length > 0 && (
          <div className="t5-latest-wrap">
            <div className="t5-section-head">
              <span className="t5-section-title">Derniers articles</span>
              <span className="t5-section-count">{totalArticles}+ articles publiés</span>
            </div>
            <div className="t5-latest-grid">
              {gridArts.map(a => (
                <article key={a.id} className="t5-card">
                  <div className="t5-card-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t5-card-img" />
                      : <div className="t5-card-img-empty" />
                    }
                  </div>
                  {a.category && <div className="t5-card-cat">{a.category}</div>}
                  <div className="t5-card-title">{a.title}</div>
                  <p className="t5-card-desc">{a.metaDescription || excerpt(a.content)}</p>
                  <div className="t5-card-meta">{fmt(a.publishedAt)}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 3 : RUBRIQUES B2B ── */}
        {showcaseCats.length > 0 && (
          <div className="t5-cats-wrap">
            <div className="t5-cats-inner">
              <div className="t5-cats-head">
                <h2 className="t5-cats-title">Nos rubriques</h2>
                <span className="t5-cats-subtitle">{showcaseCats.length} thématiques · {totalArticles}+ articles</span>
              </div>
              <div className="t5-cats-grid">
                {showcaseCats.map(c => (
                  <Link key={c.slug} href={`/${c.slug}`} className="t5-cat-card">
                    <div className="t5-cat-img-wrap">
                      {c.image
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={c.image} alt={c.name} className="t5-cat-img" />
                        : <div className="t5-cat-img-empty" />
                      }
                    </div>
                    <div className="t5-cat-body">
                      <span className="t5-cat-tag">Rubrique</span>
                      <div className="t5-cat-name">{c.name}</div>
                      <p className="t5-cat-desc">{c.description}</p>
                      <span className="t5-cat-cta">Explorer la rubrique →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        <div className="t5-stats">
          <div className="t5-stats-inner">
            <div className="t5-stat">
              <span className="t5-stat-n">{totalArticles}+</span>
              <span className="t5-stat-l">Articles publiés</span>
            </div>
            <div className="t5-stat">
              <span className="t5-stat-n">{showcaseCats.length}</span>
              <span className="t5-stat-l">Rubriques</span>
            </div>
            <div className="t5-stat">
              <span className="t5-stat-n">100%</span>
              <span className="t5-stat-l">Conseils experts</span>
            </div>
          </div>
        </div>

        <footer style={{ background: "var(--c-dark)", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "28px 40px", fontFamily: "var(--f-heading, sans-serif)", fontSize: "12px", letterSpacing: "0.04em" }}>
          © {new Date().getFullYear()} Maison &amp; Conseil — Conseils d&apos;experts pour tous vos projets maison
        </footer>

      </div>
    </>
  );
}
