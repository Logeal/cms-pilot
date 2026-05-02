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

export function CategoryPageTheme4({ category, label, articles, total, page, totalPages, seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent }: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t4c-page { background: var(--c-cream-2, #f4f4f2); color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t4c-header {
          background: var(--c-dark, #0f1923); padding: 48px 40px 40px;
        }
        .t4c-header-inner { max-width: 1280px; margin: 0 auto; }
        .t4c-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: rgba(255,255,255,0.35);
          letter-spacing: 0.06em; margin-bottom: 24px;
        }
        .t4c-breadcrumb a { color: rgba(255,255,255,0.35); text-decoration: none; }
        .t4c-breadcrumb a:hover { color: rgba(255,255,255,0.7); }
        .t4c-header-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .t4c-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(36px, 6vw, 72px); font-weight: 700;
          line-height: 1; letter-spacing: -0.02em; color: #fff;
        }
        .t4c-header-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: rgba(255,255,255,0.4); flex-shrink: 0;
        }
        .t4c-accent { width: 48px; height: 3px; background: var(--c-terra, #b85c3a); margin-top: 18px; }

        /* FEATURED */
        .t4c-featured { max-width: 1280px; margin: 0 auto; padding: 32px 40px; }
        .t4c-feat-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          display: grid; grid-template-columns: 1fr 1fr;
          border: 1px solid var(--c-border, #e0deda);
        }
        @media (max-width: 768px) { .t4c-feat-card { grid-template-columns: 1fr; } }
        .t4c-feat-img-wrap { overflow: hidden; }
        .t4c-feat-img { width: 100%; height: 100%; min-height: 300px; object-fit: cover; transition: transform 0.4s; }
        .t4c-feat-card:hover .t4c-feat-img { transform: scale(1.03); }
        .t4c-feat-body { padding: 40px 44px; display: flex; flex-direction: column; justify-content: center; }
        .t4c-feat-badge {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; background: var(--c-terra, #b85c3a);
          padding: 4px 10px; margin-bottom: 18px; width: fit-content;
        }
        .t4c-feat-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(20px, 2.2vw, 30px); font-weight: 700; line-height: 1.2;
          color: #1a1a1a; margin-bottom: 14px;
        }
        .t4c-feat-title a { color: inherit; text-decoration: none; }
        .t4c-feat-title a:hover { text-decoration: underline; }
        .t4c-feat-desc { font-size: 14px; color: #555; line-height: 1.65; margin-bottom: 24px; }
        .t4c-feat-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #1a1a1a; text-decoration: none;
          border-bottom: 2px solid #1a1a1a; padding-bottom: 2px; width: fit-content;
        }
        .t4c-feat-cta:hover { color: var(--c-terra, #b85c3a); border-color: var(--c-terra, #b85c3a); }
        .t4c-feat-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #aaa; margin-top: 16px; }

        /* CARDS GRID */
        .t4c-list-wrap { max-width: 1280px; margin: 0 auto; padding: 0 40px 56px; }
        .t4c-list-head { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .t4c-list-label { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #1a1a1a; white-space: nowrap; }
        .t4c-list-rule { flex: 1; height: 1px; background: var(--c-border, #e0deda); }

        .t4c-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .t4c-list { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t4c-list { grid-template-columns: 1fr; } }

        .t4c-list-item {
          background: #fff; border-radius: 10px; overflow: hidden;
          border: 1px solid var(--c-border, #e8e5e0);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s;
        }
        .t4c-list-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .t4c-list-item:hover .t4c-list-item-title { color: var(--c-terra, #b85c3a); }
        .t4c-list-item-img-wrap { aspect-ratio: 16/10; overflow: hidden; }
        .t4c-list-item-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; display: block; }
        .t4c-list-item:hover .t4c-list-item-img { transform: scale(1.04); }
        .t4c-list-item-img-empty { aspect-ratio: 16/10; background: #ece9e4; }
        .t4c-list-item-body { padding: 18px 20px 20px; display: flex; flex-direction: column; flex: 1; }
        .t4c-list-item-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; color: var(--c-terra, #b85c3a); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .t4c-list-item-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; line-height: 1.3; color: #1a1a1a; transition: color 0.15s; margin-bottom: 8px; flex: 1; }
        .t4c-list-item-desc { font-size: 13px; color: #888; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
        .t4c-list-item-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }

        /* PAGINATION */
        .t4c-pagination { display: flex; justify-content: center; gap: 8px; padding: 40px 0; }
        .t4c-page-btn { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; font-family: var(--f-heading, sans-serif); font-size: 13px; font-weight: 600; text-decoration: none; color: #1a1a1a; border: 1.5px solid var(--c-border, #e0deda); border-radius: 6px; transition: background 0.15s; background: #fff; }
        .t4c-page-btn:hover { background: #f5f3f0; border-color: #1a1a1a; }
        .t4c-page-btn.active { background: var(--c-dark, #0f1923); color: #fff; border-color: var(--c-dark, #0f1923); }
        .t4c-page-btn.disabled { opacity: 0.3; pointer-events: none; }

        /* SEO */
        .t4c-seo { background: #fff; border-top: 1px solid var(--c-border, #e0deda); padding: 64px 40px; }
        .t4c-seo-inner { max-width: 900px; margin: 0 auto; }
        .t4c-seo-intro { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 36px; }
        .t4c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: 26px; font-weight: 700; margin-bottom: 28px; }
        .t4c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; margin-bottom: 36px; }
        @media (max-width: 640px) { .t4c-seo-cols { grid-template-columns: 1fr; } }
        .t4c-seo-col-title { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .t4c-seo-col-body { font-size: 14px; color: #555; line-height: 1.7; }
        .t4c-faq-item { border-top: 1px solid var(--c-border, #e8e5e0); padding: 18px 0; }
        .t4c-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .t4c-faq-a { font-size: 14px; color: #555; line-height: 1.7; }

        .t4c-noimg { background: #ece9e4; display: flex; align-items: center; justify-content: center; }
      `}} />

      <div className="t4c-page">
        <div className="t4c-header">
          <div className="t4c-header-inner">
            <div className="t4c-breadcrumb">
              <Link href="/">Accueil</Link><span>›</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
            </div>
            <div className="t4c-header-row">
              <div>
                <h1 className="t4c-h1">{label}</h1>
                <div className="t4c-accent" />
              </div>
              <div className="t4c-header-meta">{total} article{total > 1 ? "s" : ""}</div>
            </div>
          </div>
        </div>

        {featured && (
          <div className="t4c-featured">
            <div className="t4c-feat-card">
              <div className="t4c-feat-img-wrap">
                {featured.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.imageUrl} alt={featured.title} className="t4c-feat-img" />
                  : <div className="t4c-feat-img t4c-noimg" style={{ minHeight: 300 }} />
                }
              </div>
              <div className="t4c-feat-body">
                <span className="t4c-feat-badge">À la une</span>
                <h2 className="t4c-feat-title"><Link href={`/${category}/${featured.slug}`}>{featured.title}</Link></h2>
                <p className="t4c-feat-desc">{featured.metaDescription || excerpt(featured.content, 180)}</p>
                <Link href={`/${category}/${featured.slug}`} className="t4c-feat-cta">Lire l&apos;article →</Link>
                <div className="t4c-feat-meta">{fmt(featured.publishedAt)}</div>
              </div>
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="t4c-list-wrap">
            <div className="t4c-list-head">
              <span className="t4c-list-label">Tous les articles</span>
              <div className="t4c-list-rule" />
            </div>
            <div className="t4c-list">
              {rest.map(a => (
                <Link key={a.id} href={`/${category}/${a.slug}`} className="t4c-list-item">
                  <div className="t4c-list-item-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t4c-list-item-img" />
                      : <div className="t4c-list-item-img-empty" />
                    }
                  </div>
                  <div className="t4c-list-item-body">
                    {a.category && <span className="t4c-list-item-cat">{a.category}</span>}
                    <div className="t4c-list-item-title">{a.title}</div>
                    <div className="t4c-list-item-desc">{a.metaDescription || excerpt(a.content)}</div>
                    <div className="t4c-list-item-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="t4c-pagination">
                <Link href={page > 1 ? `/${category}?page=${page - 1}` : "#"} className={`t4c-page-btn${page <= 1 ? " disabled" : ""}`}>←</Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link key={p} href={`/${category}?page=${p}`} className={`t4c-page-btn${p === page ? " active" : ""}`}>{p}</Link>
                ))}
                <Link href={page < totalPages ? `/${category}?page=${page + 1}` : "#"} className={`t4c-page-btn${page >= totalPages ? " disabled" : ""}`}>→</Link>
              </div>
            )}
          </div>
        )}

        {hasSeoContent && (
          <div className="t4c-seo">
            <div className="t4c-seo-inner">
              {seoIntro && <p className="t4c-seo-intro">{seoIntro}</p>}
              {seoH2 && <h2 className="t4c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t4c-seo-cols">
                  {seoCol1Body && <div><div className="t4c-seo-col-title">{seoCol1Title}</div><p className="t4c-seo-col-body">{seoCol1Body}</p></div>}
                  {seoCol2Body && <div><div className="t4c-seo-col-title">{seoCol2Title}</div><p className="t4c-seo-col-body">{seoCol2Body}</p></div>}
                </div>
              )}
              {seoFaq?.map((item, i) => (
                <div key={i} className="t4c-faq-item">
                  <div className="t4c-faq-q">{item.q}</div>
                  <p className="t4c-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
