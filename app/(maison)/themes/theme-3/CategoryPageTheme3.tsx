import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 140) {
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
  wordCount: number | null;
};

type Props = {
  category: string;
  label: string;
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  seoIntro: string | null;
  seoH2: string | null;
  seoCol1Title: string | null;
  seoCol1Body: string | null;
  seoCol2Title: string | null;
  seoCol2Body: string | null;
  seoFaq: Array<{ q: string; a: string }> | null;
  hasSeoContent: boolean;
};

export function CategoryPageTheme3({
  category,
  label,
  articles,
  total,
  page,
  totalPages,
  seoIntro,
  seoH2,
  seoCol1Title,
  seoCol1Body,
  seoCol2Title,
  seoCol2Body,
  seoFaq,
  hasSeoContent,
}: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t3c-page { background: #fff; color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t3c-header {
          border-bottom: 2px solid #1a1a1a;
          padding: 56px 40px 48px;
          max-width: 1280px; margin: 0 auto;
        }
        .t3c-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #999; margin-bottom: 20px;
        }
        .t3c-breadcrumb a { color: #999; text-decoration: none; }
        .t3c-breadcrumb a:hover { color: #1a1a1a; }
        .t3c-header-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .t3c-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(40px, 6vw, 80px); font-weight: 700;
          line-height: 1; letter-spacing: -0.02em;
        }
        .t3c-header-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 13px; color: #888; flex-shrink: 0;
        }

        /* ACCENT LINE under H1 */
        .t3c-accent-line {
          width: 80px; height: 4px;
          background: var(--c-terra, #b85c3a);
          margin-top: 20px;
        }

        /* FEATURED */
        .t3c-featured {
          max-width: 1280px; margin: 0 auto;
          padding: 48px 40px;
          border-bottom: 1px solid #e8e8e4;
        }
        .t3c-feat-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0;
        }
        @media (max-width: 768px) { .t3c-feat-grid { grid-template-columns: 1fr; } }
        .t3c-feat-img-wrap { aspect-ratio: 16/10; overflow: hidden; border-radius: 8px 0 0 8px; }
        @media (max-width: 768px) { .t3c-feat-img-wrap { border-radius: 8px 8px 0 0; } }
        .t3c-feat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .t3c-feat-grid:hover .t3c-feat-img { transform: scale(1.03); }
        .t3c-feat-text {
          padding: 40px 48px;
          background: #fafaf8;
          display: flex; flex-direction: column; justify-content: center;
          border: 1px solid #e8e8e4; border-left: none;
        }
        @media (max-width: 768px) { .t3c-feat-text { padding: 32px 24px; border-left: 1px solid #e8e8e4; border-top: none; } }
        .t3c-feat-badge {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; background: var(--c-terra, #b85c3a);
          padding: 4px 10px; margin-bottom: 18px; width: fit-content;
        }
        .t3c-feat-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(22px, 2.5vw, 34px); font-weight: 700;
          line-height: 1.2; margin-bottom: 14px;
          color: #1a1a1a;
        }
        .t3c-feat-title a { color: inherit; text-decoration: none; }
        .t3c-feat-title a:hover { text-decoration: underline; }
        .t3c-feat-desc { font-size: 14px; color: #555; line-height: 1.65; margin-bottom: 24px; }
        .t3c-feat-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #1a1a1a; text-decoration: none;
          border-bottom: 2px solid #1a1a1a; padding-bottom: 2px; width: fit-content;
        }
        .t3c-feat-link:hover { color: var(--c-terra, #b85c3a); border-color: var(--c-terra, #b85c3a); }
        .t3c-feat-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #aaa; margin-top: 18px;
        }

        /* GRID */
        .t3c-grid-wrap { max-width: 1280px; margin: 0 auto; padding: 48px 40px; }
        .t3c-grid-head {
          display: flex; align-items: center; gap: 16px; margin-bottom: 32px;
        }
        .t3c-grid-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #1a1a1a; white-space: nowrap;
        }
        .t3c-grid-rule { flex: 1; height: 1px; background: #e8e8e4; }
        .t3c-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px 24px;
        }
        @media (max-width: 900px) { .t3c-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t3c-grid { grid-template-columns: 1fr; } }

        .t3c-card { display: flex; flex-direction: column; }
        .t3c-card-img-wrap { aspect-ratio: 4/3; overflow: hidden; margin-bottom: 14px; border-radius: 8px; }
        .t3c-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t3c-card:hover .t3c-card-img { transform: scale(1.04); }
        .t3c-card-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          color: var(--c-terra, #b85c3a);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .t3c-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 17px; font-weight: 700; line-height: 1.3;
          color: #1a1a1a; margin-bottom: 8px;
        }
        .t3c-card-title a { color: inherit; text-decoration: none; }
        .t3c-card-title a:hover { text-decoration: underline; }
        .t3c-card-desc {
          font-size: 13px; color: #666; line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 10px; flex: 1;
        }
        .t3c-card-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #aaa; }

        /* NOIMG */
        .t3c-noimg { background: #f0ede8; display: flex; align-items: center; justify-content: center; }
        .t3c-noimg-icon { font-size: 28px; opacity: 0.3; }

        /* PAGINATION */
        .t3c-pagination {
          display: flex; justify-content: center; align-items: center; gap: 8px;
          padding: 40px 0;
        }
        .t3c-page-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 40px; height: 40px;
          font-family: var(--f-heading, sans-serif);
          font-size: 13px; font-weight: 600;
          text-decoration: none; color: #1a1a1a;
          border: 1.5px solid #e8e8e4;
          transition: background 0.15s, border-color 0.15s;
        }
        .t3c-page-btn:hover { background: #f5f3f0; border-color: #1a1a1a; }
        .t3c-page-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .t3c-page-btn.disabled { opacity: 0.3; pointer-events: none; }

        /* SEO */
        .t3c-seo { background: #fafaf8; border-top: 2px solid #1a1a1a; padding: 72px 40px; }
        .t3c-seo-inner { max-width: 900px; margin: 0 auto; }
        .t3c-seo-intro { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 40px; }
        .t3c-seo-h2 {
          font-family: var(--f-display, Georgia, serif);
          font-size: 28px; font-weight: 700; margin-bottom: 32px; color: #1a1a1a;
        }
        .t3c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        @media (max-width: 640px) { .t3c-seo-cols { grid-template-columns: 1fr; } }
        .t3c-seo-col-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 19px; font-weight: 700; margin-bottom: 12px; color: #1a1a1a;
        }
        .t3c-seo-col-body { font-size: 14px; color: #555; line-height: 1.7; }
        .t3c-faq-item { border-top: 1px solid #e8e8e4; padding: 20px 0; }
        .t3c-faq-q {
          font-family: var(--f-display, Georgia, serif);
          font-size: 17px; font-weight: 700; margin-bottom: 10px; color: #1a1a1a;
        }
        .t3c-faq-a { font-size: 14px; color: #555; line-height: 1.7; }
      `}} />

      <div className="t3c-page">

        {/* HEADER */}
        <div className="t3c-header">
          <div className="t3c-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span style={{ color: "#1a1a1a" }}>{label}</span>
          </div>
          <div className="t3c-header-top">
            <h1 className="t3c-h1">{label}</h1>
            <div className="t3c-header-meta">{total} article{total > 1 ? "s" : ""}</div>
          </div>
          <div className="t3c-accent-line" />
        </div>

        {/* FEATURED */}
        {featured && (
          <div className="t3c-featured">
            <div className="t3c-feat-grid">
              <div className="t3c-feat-img-wrap">
                {featured.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.imageUrl} alt={featured.title} className="t3c-feat-img" />
                  : <div className="t3c-feat-img t3c-noimg"><span className="t3c-noimg-icon">🏠</span></div>
                }
              </div>
              <div className="t3c-feat-text">
                <span className="t3c-feat-badge">À la une</span>
                <h2 className="t3c-feat-title">
                  <Link href={`/${category}/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="t3c-feat-desc">
                  {featured.metaDescription || excerpt(featured.content, 180)}
                </p>
                <Link href={`/${category}/${featured.slug}`} className="t3c-feat-link">
                  Lire l&apos;article →
                </Link>
                <div className="t3c-feat-meta">{fmt(featured.publishedAt)}</div>
              </div>
            </div>
          </div>
        )}

        {/* GRID */}
        {rest.length > 0 && (
          <div className="t3c-grid-wrap">
            <div className="t3c-grid-head">
              <span className="t3c-grid-label">Tous les articles</span>
              <div className="t3c-grid-rule" />
            </div>
            <div className="t3c-grid">
              {rest.map(a => (
                <article key={a.id} className="t3c-card">
                  <div className="t3c-card-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t3c-card-img" />
                      : <div className="t3c-card-img t3c-noimg"><span className="t3c-noimg-icon">🏠</span></div>
                    }
                  </div>
                  <div className="t3c-card-cat">{a.category}</div>
                  <div className="t3c-card-title">
                    <Link href={`/${category}/${a.slug}`}>{a.title}</Link>
                  </div>
                  <p className="t3c-card-desc">{a.metaDescription || excerpt(a.content)}</p>
                  <div className="t3c-card-meta">{fmt(a.publishedAt)}</div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="t3c-pagination">
                <Link
                  href={page > 1 ? `/${category}?page=${page - 1}` : "#"}
                  className={`t3c-page-btn${page <= 1 ? " disabled" : ""}`}
                >←</Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link
                    key={p}
                    href={`/${category}?page=${p}`}
                    className={`t3c-page-btn${p === page ? " active" : ""}`}
                  >{p}</Link>
                ))}
                <Link
                  href={page < totalPages ? `/${category}?page=${page + 1}` : "#"}
                  className={`t3c-page-btn${page >= totalPages ? " disabled" : ""}`}
                >→</Link>
              </div>
            )}
          </div>
        )}

        {/* SEO */}
        {hasSeoContent && (
          <div className="t3c-seo">
            <div className="t3c-seo-inner">
              {seoIntro && <p className="t3c-seo-intro">{seoIntro}</p>}
              {seoH2 && <h2 className="t3c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t3c-seo-cols">
                  {seoCol1Body && (
                    <div>
                      {seoCol1Title && <div className="t3c-seo-col-title">{seoCol1Title}</div>}
                      <p className="t3c-seo-col-body">{seoCol1Body}</p>
                    </div>
                  )}
                  {seoCol2Body && (
                    <div>
                      {seoCol2Title && <div className="t3c-seo-col-title">{seoCol2Title}</div>}
                      <p className="t3c-seo-col-body">{seoCol2Body}</p>
                    </div>
                  )}
                </div>
              )}
              {seoFaq && seoFaq.length > 0 && seoFaq.map((item, i) => (
                <div key={i} className="t3c-faq-item">
                  <div className="t3c-faq-q">{item.q}</div>
                  <p className="t3c-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
