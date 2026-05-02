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

export function CategoryPageTheme11({ category, label, articles, total, page, totalPages, seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent }: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t11c { background: #fafaf8; color: #111; font-family: var(--f-body, Georgia, serif); }
        .t11c-w { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        @media (max-width: 768px) { .t11c-w { padding: 0 20px; } }

        /* ── BANDEAU HEADER SOMBRE ── */
        .t11c-banner {
          background: #111; color: #fff;
          padding: 48px 40px 40px;
        }
        .t11c-banner-inner { max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) { .t11c-banner { padding: 36px 20px 32px; } }

        .t11c-breadcrumb {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: rgba(255,255,255,0.35);
          display: flex; gap: 6px; align-items: center; margin-bottom: 28px;
        }
        .t11c-breadcrumb a { color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.15s; }
        .t11c-breadcrumb a:hover { color: #fff; }

        .t11c-tag {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .t11c-tag::before { content: ''; width: 20px; height: 2px; background: var(--c-terra, #b85c3a); display: block; }

        .t11c-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(36px, 6vw, 72px); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1; color: #fff;
          margin-bottom: 20px;
        }
        .t11c-banner-bottom {
          display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
          padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);
        }
        .t11c-count { font-family: var(--f-heading, sans-serif); font-size: 11px; color: rgba(255,255,255,0.4); }
        .t11c-intro { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.7; max-width: 560px; }

        /* ── HERO ARTICLE ── */
        .t11c-hero-wrap { padding: 32px 40px 0; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) { .t11c-hero-wrap { padding: 24px 20px 0; } }

        .t11c-hero {
          display: grid; grid-template-columns: 4fr 3fr;
          background: #fff; border: 1px solid #e8e8e8;
          text-decoration: none; color: inherit;
          transition: border-color 0.2s;
          overflow: hidden;
        }
        .t11c-hero:hover { border-color: #bbb; }
        @media (max-width: 760px) { .t11c-hero { grid-template-columns: 1fr; } }

        .t11c-hero-img-wrap { overflow: hidden; }
        .t11c-hero-img { width: 100%; height: 100%; min-height: 300px; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .t11c-hero:hover .t11c-hero-img { transform: scale(1.03); }
        .t11c-hero-img-empty { width: 100%; min-height: 300px; background: #f0ede8; display: block; }

        .t11c-hero-body {
          padding: 32px 36px;
          display: flex; flex-direction: column; justify-content: space-between; gap: 14px;
          border-left: 1px solid #e8e8e8;
        }
        .t11c-hero-kicker {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); display: flex; align-items: center; gap: 8px;
        }
        .t11c-hero-kicker::before { content: ''; width: 16px; height: 2px; background: currentColor; display: block; }
        .t11c-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(18px, 2vw, 26px); font-weight: 700; line-height: 1.2;
          letter-spacing: -0.02em; color: #111; flex: 1;
        }
        .t11c-hero-desc { font-size: 14px; color: #666; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t11c-hero-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }
        .t11c-hero-cta {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #111; border: 1px solid #ddd; padding: 8px 16px; align-self: flex-start;
          transition: border-color 0.15s, background 0.15s;
        }
        .t11c-hero:hover .t11c-hero-cta { border-color: #111; background: #111; color: #fff; }

        /* ── GRILLE ARTICLES ── */
        .t11c-grid-wrap { padding: 16px 40px 0; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) { .t11c-grid-wrap { padding: 12px 20px 0; } }

        .t11c-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #e0e0e0;
          border: 1px solid #e0e0e0;
        }
        @media (max-width: 860px) { .t11c-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .t11c-grid { grid-template-columns: 1fr; } }

        .t11c-card {
          background: #fff; text-decoration: none; display: flex; flex-direction: column;
          transition: background 0.15s;
        }
        .t11c-card:hover { background: #f8f8f6; }
        .t11c-card-img-wrap { overflow: hidden; }
        .t11c-card-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t11c-card:hover .t11c-card-img { transform: scale(1.05); }
        .t11c-card-img-empty { width: 100%; aspect-ratio: 16/9; background: #f0ede8; display: block; }
        .t11c-card-body { padding: 16px 18px 22px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .t11c-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 15px; font-weight: 700; line-height: 1.3; color: #111; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.15s;
        }
        .t11c-card:hover .t11c-card-title { color: var(--c-terra, #b85c3a); }
        .t11c-card-desc { font-size: 12px; color: #777; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .t11c-card-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }

        /* ── PAGINATION ── */
        .t11c-pagination { display: flex; justify-content: center; gap: 0; padding: 40px 0; }
        .t11c-page-btn {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 40px; height: 40px; padding: 0 10px;
          font-family: var(--f-heading, sans-serif); font-size: 12px; font-weight: 600;
          text-decoration: none; color: #777;
          border: 1px solid #ddd; margin-left: -1px;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .t11c-page-btn:hover { background: #f5f5f3; color: #111; border-color: #bbb; z-index: 1; position: relative; }
        .t11c-page-btn.active { background: #111; color: #fff; border-color: #111; z-index: 1; position: relative; }
        .t11c-page-btn.disabled { opacity: 0.3; pointer-events: none; }

        /* ── SEO ── */
        .t11c-seo-wrap { padding: 48px 40px 64px; max-width: 1200px; margin: 0 auto; border-top: 1px solid #e8e8e8; margin-top: 40px; }
        @media (max-width: 768px) { .t11c-seo-wrap { padding: 36px 20px 48px; } }
        .t11c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: clamp(20px, 2.5vw, 28px); font-weight: 700; letter-spacing: -0.02em; color: #111; margin-bottom: 28px; }
        .t11c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        @media (max-width: 600px) { .t11c-seo-cols { grid-template-columns: 1fr; } }
        .t11c-seo-col-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; color: #111; margin-bottom: 8px; }
        .t11c-seo-col-body { font-size: 14px; color: #666; line-height: 1.7; }
        .t11c-faq-item { border-top: 1px solid #e8e8e8; padding: 18px 0; }
        .t11c-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; color: #111; margin-bottom: 8px; }
        .t11c-faq-a { font-size: 14px; color: #666; line-height: 1.7; }
      `}} />

      <div className="t11c">

        {/* ── BANDEAU SOMBRE ── */}
        <div className="t11c-banner">
          <div className="t11c-banner-inner">
            <div className="t11c-breadcrumb">
              <Link href="/">Accueil</Link>
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
            </div>
            <div className="t11c-tag">{label}</div>
            <h1 className="t11c-h1">{label}</h1>
            <div className="t11c-banner-bottom">
              <span className="t11c-count">{total} article{total > 1 ? "s" : ""}</span>
              {seoIntro && <p className="t11c-intro">{seoIntro}</p>}
            </div>
          </div>
        </div>

        {/* ── HERO ARTICLE ── */}
        {featured && (
          <div className="t11c-hero-wrap">
            <Link href={`/${category}/${featured.slug}`} className="t11c-hero">
              <div className="t11c-hero-img-wrap">
                {featured.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.imageUrl} alt={featured.title} className="t11c-hero-img" />
                  : <div className="t11c-hero-img-empty" />
                }
              </div>
              <div className="t11c-hero-body">
                <div className="t11c-hero-kicker">À la une</div>
                <div className="t11c-hero-title">{featured.title}</div>
                <p className="t11c-hero-desc">{featured.metaDescription || excerpt(featured.content)}</p>
                <div className="t11c-hero-meta">{fmt(featured.publishedAt)}</div>
                <span className="t11c-hero-cta">Lire l&apos;article →</span>
              </div>
            </Link>
          </div>
        )}

        {/* ── GRILLE ── */}
        {rest.length > 0 && (
          <div className="t11c-grid-wrap">
            <div className="t11c-grid">
              {rest.map(a => (
                <Link key={a.id} href={`/${category}/${a.slug}`} className="t11c-card">
                  <div className="t11c-card-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t11c-card-img" />
                      : <div className="t11c-card-img-empty" />
                    }
                  </div>
                  <div className="t11c-card-body">
                    <div className="t11c-card-title">{a.title}</div>
                    {a.metaDescription && <p className="t11c-card-desc">{a.metaDescription}</p>}
                    <div className="t11c-card-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="t11c-pagination">
                <Link href={page > 1 ? `/${category}?page=${page - 1}` : "#"} className={`t11c-page-btn${page <= 1 ? " disabled" : ""}`}>←</Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link key={p} href={`/${category}?page=${p}`} className={`t11c-page-btn${p === page ? " active" : ""}`}>{p}</Link>
                ))}
                <Link href={page < totalPages ? `/${category}?page=${page + 1}` : "#"} className={`t11c-page-btn${page >= totalPages ? " disabled" : ""}`}>→</Link>
              </div>
            )}
          </div>
        )}

        {/* ── SEO ── */}
        {hasSeoContent && (
          <div className="t11c-seo-wrap">
            {seoH2 && <h2 className="t11c-seo-h2">{seoH2}</h2>}
            {(seoCol1Body || seoCol2Body) && (
              <div className="t11c-seo-cols">
                {seoCol1Body && <div><div className="t11c-seo-col-title">{seoCol1Title}</div><p className="t11c-seo-col-body">{seoCol1Body}</p></div>}
                {seoCol2Body && <div><div className="t11c-seo-col-title">{seoCol2Title}</div><p className="t11c-seo-col-body">{seoCol2Body}</p></div>}
              </div>
            )}
            {seoFaq?.map((item, i) => (
              <div key={i} className="t11c-faq-item">
                <div className="t11c-faq-q">{item.q}</div>
                <p className="t11c-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
