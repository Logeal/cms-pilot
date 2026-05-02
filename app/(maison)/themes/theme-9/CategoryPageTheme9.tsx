import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function excerpt(html: string, max = 140) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null; wordCount: number | null;
};

type Props = {
  category: string; label: string; articles: Article[];
  total: number; page: number; totalPages: number;
  seoIntro: string | null; seoH2: string | null;
  seoCol1Title: string | null; seoCol1Body: string | null;
  seoCol2Title: string | null; seoCol2Body: string | null;
  seoFaq: Array<{ q: string; a: string }> | null;
  hasSeoContent: boolean;
};

export function CategoryPageTheme9({ category, label, articles, total, page, totalPages, seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent }: Props) {
  const hero = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t9c { background: #fff; color: #111; font-family: var(--f-body, Georgia, serif); }

        /* ── HEADER ── */
        .t9c-header {
          max-width: 1100px; margin: 0 auto;
          padding: 32px 40px 40px;
          border-bottom: 1px solid #e8e8e8;
        }
        .t9c-breadcrumb {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #bbb;
          display: flex; gap: 6px; align-items: center;
          margin-bottom: 20px;
        }
        .t9c-breadcrumb a { color: #bbb; text-decoration: none; transition: color 0.15s; }
        .t9c-breadcrumb a:hover { color: #111; }

        .t9c-header-body {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .t9c-cat-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 10px; display: block;
        }
        .t9c-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(32px, 5vw, 56px); font-weight: 700;
          line-height: 1.05; letter-spacing: -0.025em; color: #111;
        }
        .t9c-h1-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #bbb; flex-shrink: 0;
        }
        .t9c-seo-intro-head {
          font-size: 15px; color: #666; line-height: 1.7;
          max-width: 640px; margin-top: 16px;
        }

        /* ── HERO ARTICLE ── */
        .t9c-hero {
          max-width: 1100px; margin: 0 auto;
          padding: 40px 40px 0;
        }
        .t9c-hero-card {
          text-decoration: none; display: grid;
          grid-template-columns: 55fr 45fr;
          border: 1px solid #e8e8e8;
          background: #fff;
        }
        @media (max-width: 760px) { .t9c-hero-card { grid-template-columns: 1fr; } }

        .t9c-hero-img-side { overflow: hidden; min-height: 360px; position: relative; }
        .t9c-hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .t9c-hero-card:hover .t9c-hero-img { transform: scale(1.03); }
        .t9c-hero-img-empty { position: absolute; inset: 0; background: #f0ece6; }

        .t9c-hero-body {
          padding: 36px 36px 36px 32px;
          display: flex; flex-direction: column; justify-content: center;
          border-left: 1px solid #e8e8e8;
        }
        @media (max-width: 760px) { .t9c-hero-body { border-left: none; border-top: 1px solid #e8e8e8; padding: 24px; } }

        .t9c-hero-kicker {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a);
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .t9c-hero-kicker::after { content: ''; display: block; width: 24px; height: 1px; background: currentColor; }
        .t9c-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(20px, 2.2vw, 30px); font-weight: 700;
          line-height: 1.15; color: #111; margin-bottom: 14px;
          transition: color 0.15s;
        }
        .t9c-hero-card:hover .t9c-hero-title { color: var(--c-terra, #b85c3a); }
        .t9c-hero-desc {
          font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 20px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9c-hero-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #bbb;
        }
        .t9c-hero-read {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #111; text-decoration: none;
          border-bottom: 1.5px solid #111; padding-bottom: 2px;
          margin-top: 20px; align-self: flex-start;
          transition: color 0.15s, border-color 0.15s;
        }
        .t9c-hero-card:hover .t9c-hero-read { color: var(--c-terra, #b85c3a); border-color: var(--c-terra, #b85c3a); }

        /* ── GRILLE ARTICLES ── */
        .t9c-grid-section {
          max-width: 1100px; margin: 0 auto;
          padding: 32px 40px 48px;
        }
        .t9c-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #e8e8e8;
          border: 1px solid #e8e8e8;
          margin-top: 32px;
        }
        @media (max-width: 860px) { .t9c-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .t9c-grid { grid-template-columns: 1fr; } }

        .t9c-card {
          text-decoration: none; display: flex; flex-direction: column;
          background: #fff;
        }
        .t9c-card-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
          transition: opacity 0.2s;
        }
        .t9c-card:hover .t9c-card-img { opacity: 0.88; }
        .t9c-card-img-empty {
          width: 100%; aspect-ratio: 16/9; background: #f0ece6; display: block;
        }
        .t9c-card-body {
          padding: 18px 20px 22px; flex: 1; display: flex; flex-direction: column;
        }
        .t9c-card-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 8px;
        }
        .t9c-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(14px, 1.3vw, 17px); font-weight: 700;
          line-height: 1.3; color: #111; flex: 1;
          transition: color 0.15s;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9c-card:hover .t9c-card-title { color: var(--c-terra, #b85c3a); }
        .t9c-card-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #bbb; margin-top: 10px;
        }

        /* ── PAGINATION ── */
        .t9c-pagination {
          display: flex; justify-content: center; gap: 4px;
          padding: 36px 0 0;
        }
        .t9c-page-btn {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 36px; height: 36px; padding: 0 8px;
          font-family: var(--f-heading, sans-serif); font-size: 12px; font-weight: 600;
          text-decoration: none; color: #111;
          border: 1px solid #e8e8e8;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .t9c-page-btn:hover { border-color: #111; }
        .t9c-page-btn.active { background: #111; color: #fff; border-color: #111; }
        .t9c-page-btn.disabled { opacity: 0.3; pointer-events: none; }

        /* ── SEO ── */
        .t9c-seo {
          max-width: 1100px; margin: 0 auto;
          padding: 48px 40px;
          border-top: 1px solid #e8e8e8;
        }
        .t9c-seo-intro { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 32px; }
        .t9c-seo-h2 {
          font-family: var(--f-display, Georgia, serif);
          font-size: 24px; font-weight: 700; margin-bottom: 24px;
        }
        .t9c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        @media (max-width: 640px) { .t9c-seo-cols { grid-template-columns: 1fr; } }
        .t9c-seo-col-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 16px; font-weight: 700; margin-bottom: 8px;
        }
        .t9c-seo-col-body { font-size: 14px; color: #555; line-height: 1.7; }
        .t9c-faq-item { border-top: 1px solid #e8e8e8; padding: 18px 0; }
        .t9c-faq-q {
          font-family: var(--f-display, Georgia, serif);
          font-size: 15px; font-weight: 700; margin-bottom: 6px;
        }
        .t9c-faq-a { font-size: 14px; color: #555; line-height: 1.7; }

        @media (max-width: 768px) {
          .t9c-header, .t9c-hero, .t9c-grid-section, .t9c-seo { padding-left: 20px; padding-right: 20px; }
        }
      `}} />

      <div className="t9c">

        {/* ── HEADER ── */}
        <div className="t9c-header">
          <div className="t9c-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span style={{ color: "#111" }}>{label}</span>
          </div>
          <div>
            <span className="t9c-cat-label">{label}</span>
            <div className="t9c-header-body">
              <h1 className="t9c-h1">{label}</h1>
              <span className="t9c-h1-meta">{total} article{total > 1 ? "s" : ""}</span>
            </div>
            {seoIntro && <p className="t9c-seo-intro-head">{seoIntro}</p>}
          </div>
        </div>

        {/* ── HERO ARTICLE (1er de la page) ── */}
        {hero && (
          <div className="t9c-hero">
            <Link href={`/${category}/${hero.slug}`} className="t9c-hero-card">
              <div className="t9c-hero-img-side">
                {hero.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={hero.imageUrl} alt={hero.title} className="t9c-hero-img" />
                  : <div className="t9c-hero-img-empty" />
                }
              </div>
              <div className="t9c-hero-body">
                <div className="t9c-hero-kicker">À la une</div>
                <div className="t9c-hero-title">{hero.title}</div>
                <p className="t9c-hero-desc">{hero.metaDescription || excerpt(hero.content, 200)}</p>
                <div className="t9c-hero-date">{fmt(hero.publishedAt)}</div>
                <span className="t9c-hero-read">Lire l&apos;article →</span>
              </div>
            </Link>
          </div>
        )}

        {/* ── GRILLE ── */}
        {rest.length > 0 && (
          <div className="t9c-grid-section">
            <div className="t9c-grid">
              {rest.map(a => (
                <Link key={a.id} href={`/${category}/${a.slug}`} className="t9c-card">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t9c-card-img" />
                    : <div className="t9c-card-img-empty" />
                  }
                  <div className="t9c-card-body">
                    {a.category && <span className="t9c-card-cat">{a.category}</span>}
                    <div className="t9c-card-title">{a.title}</div>
                    <div className="t9c-card-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="t9c-pagination">
                <Link href={page > 1 ? `/${category}?page=${page - 1}` : "#"} className={`t9c-page-btn${page <= 1 ? " disabled" : ""}`}>←</Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link key={p} href={`/${category}?page=${p}`} className={`t9c-page-btn${p === page ? " active" : ""}`}>{p}</Link>
                ))}
                <Link href={page < totalPages ? `/${category}?page=${page + 1}` : "#"} className={`t9c-page-btn${page >= totalPages ? " disabled" : ""}`}>→</Link>
              </div>
            )}
          </div>
        )}

        {/* ── SEO ── */}
        {hasSeoContent && (
          <div className="t9c-seo">
            {seoH2 && <h2 className="t9c-seo-h2">{seoH2}</h2>}
            {(seoCol1Body || seoCol2Body) && (
              <div className="t9c-seo-cols">
                {seoCol1Body && <div><div className="t9c-seo-col-title">{seoCol1Title}</div><p className="t9c-seo-col-body">{seoCol1Body}</p></div>}
                {seoCol2Body && <div><div className="t9c-seo-col-title">{seoCol2Title}</div><p className="t9c-seo-col-body">{seoCol2Body}</p></div>}
              </div>
            )}
            {seoFaq?.map((item, i) => (
              <div key={i} className="t9c-faq-item">
                <div className="t9c-faq-q">{item.q}</div>
                <p className="t9c-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
