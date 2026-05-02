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

export function CategoryPageTheme7({ category, label, articles, total, page, totalPages, seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent }: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t7c { background: #FAFAF8; color: #111; font-family: var(--f-body, 'Times New Roman', Georgia, serif); }

        .t7c-header { border-bottom: 4px solid #111; padding: 24px 40px 0; }
        .t7c-header-inner { max-width: 1280px; margin: 0 auto; }
        .t7c-breadcrumb { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #999; margin-bottom: 12px; display: flex; gap: 6px; align-items: center; }
        .t7c-breadcrumb a { color: #999; text-decoration: none; }
        .t7c-breadcrumb a:hover { color: #111; }
        .t7c-header-row { display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 16px; gap: 16px; }
        .t7c-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(32px, 5vw, 60px); font-weight: 900; letter-spacing: -0.03em; line-height: 1; }
        .t7c-count { font-family: var(--f-heading, sans-serif); font-size: 12px; color: #999; flex-shrink: 0; }

        /* Featured — disposition journal */
        .t7c-featured { max-width: 1280px; margin: 0 auto; padding: 28px 40px 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-bottom: 2px solid #111; }
        @media (max-width: 768px) { .t7c-featured { grid-template-columns: 1fr; } }
        .t7c-feat-body { padding-right: 32px; display: flex; flex-direction: column; justify-content: space-between; }
        .t7c-feat-kicker { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: var(--c-terra, #b85c3a); display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .t7c-feat-kicker::after { content: ''; flex: 1; height: 1px; background: var(--c-terra, #b85c3a); }
        .t7c-feat-title { font-family: var(--f-display, Georgia, serif); font-size: clamp(22px, 3vw, 38px); font-weight: 900; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 16px; }
        .t7c-feat-title a { color: inherit; text-decoration: none; }
        .t7c-feat-title a:hover { color: var(--c-terra, #b85c3a); }
        .t7c-feat-desc { font-size: 14px; color: #444; line-height: 1.65; margin-bottom: 16px; }
        .t7c-feat-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #999; }
        .t7c-feat-img { width: 100%; height: 100%; min-height: 280px; object-fit: cover; }
        .t7c-feat-img-empty { min-height: 280px; background: #e8e5e0; }

        /* Grille reste */
        .t7c-grid-wrap { max-width: 1280px; margin: 0 auto; padding: 40px 40px 56px; }
        .t7c-grid-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
        .t7c-grid-label { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 900; border-bottom: 3px solid #111; padding-bottom: 10px; }
        .t7c-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .t7c-grid { grid-template-columns: repeat(2, 1fr); } }

        .t7c-item { background: #fff; border-radius: 8px; overflow: hidden; text-decoration: none; display: flex; flex-direction: column; box-shadow: 0 1px 8px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; }
        .t7c-item:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
        .t7c-item-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .t7c-item-img-empty { width: 100%; aspect-ratio: 4/3; background: #ece9e4; }
        .t7c-item-body { padding: 14px 16px 18px; flex: 1; display: flex; flex-direction: column; }
        .t7c-item-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 6px; }
        .t7c-item-title { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; line-height: 1.25; color: #111; flex: 1; margin-bottom: 8px; transition: color 0.15s; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t7c-item:hover .t7c-item-title { color: var(--c-terra, #b85c3a); }
        .t7c-item-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }

        /* Pagination */
        .t7c-pagination { display: flex; justify-content: center; gap: 4px; padding: 32px 0; }
        .t7c-page-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 36px; height: 36px; padding: 0 8px; font-family: var(--f-heading, sans-serif); font-size: 13px; font-weight: 700; text-decoration: none; color: #111; border: 2px solid #111; transition: background 0.15s; }
        .t7c-page-btn:hover { background: #111; color: #fff; }
        .t7c-page-btn.active { background: #111; color: #fff; }
        .t7c-page-btn.disabled { opacity: 0.3; pointer-events: none; }

        /* SEO */
        .t7c-seo { border-top: 2px solid #111; padding: 48px 40px; }
        .t7c-seo-inner { max-width: 900px; margin: 0 auto; }
        .t7c-seo-intro { font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 32px; }
        .t7c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: 24px; font-weight: 900; margin-bottom: 24px; }
        .t7c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        @media (max-width: 640px) { .t7c-seo-cols { grid-template-columns: 1fr; } }
        .t7c-seo-col-title { font-family: var(--f-display, Georgia, serif); font-size: 17px; font-weight: 700; margin-bottom: 8px; }
        .t7c-seo-col-body { font-size: 14px; color: #555; line-height: 1.7; }
        .t7c-faq-item { border-top: 1px solid #ddd; padding: 16px 0; }
        .t7c-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; margin-bottom: 6px; }
        .t7c-faq-a { font-size: 13px; color: #555; line-height: 1.7; }

        @media (max-width: 768px) { .t7c-header, .t7c-featured, .t7c-grid-wrap, .t7c-seo { padding-left: 20px; padding-right: 20px; } }
      `}} />

      <div className="t7c">
        <div className="t7c-header">
          <div className="t7c-header-inner">
            <div className="t7c-breadcrumb">
              <Link href="/">Accueil</Link><span>›</span>
              <span style={{ color: "#111" }}>{label}</span>
            </div>
            <div className="t7c-header-row">
              <h1 className="t7c-h1">{label}</h1>
              <span className="t7c-count">{total} article{total > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {featured && (
          <div className="t7c-featured">
            <div className="t7c-feat-body">
              <div>
                <div className="t7c-feat-kicker">À la une</div>
                <h2 className="t7c-feat-title"><Link href={`/${category}/${featured.slug}`}>{featured.title}</Link></h2>
                <p className="t7c-feat-desc">{featured.metaDescription || excerpt(featured.content, 200)}</p>
              </div>
              <div className="t7c-feat-meta">{fmt(featured.publishedAt)}</div>
            </div>
            <div>
              {featured.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={featured.imageUrl} alt={featured.title} className="t7c-feat-img" />
                : <div className="t7c-feat-img-empty" />
              }
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="t7c-grid-wrap">
            <div className="t7c-grid-head">
              <span className="t7c-grid-label">Tous les articles</span>
            </div>
            <div className="t7c-grid">
              {rest.map(a => (
                <Link key={a.id} href={`/${category}/${a.slug}`} className="t7c-item">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t7c-item-img" />
                    : <div className="t7c-item-img-empty" />
                  }
                  <div className="t7c-item-body">
                    {a.category && <div className="t7c-item-cat">{a.category}</div>}
                    <div className="t7c-item-title">{a.title}</div>
                    <div className="t7c-item-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="t7c-pagination">
                <Link href={page > 1 ? `/${category}?page=${page - 1}` : "#"} className={`t7c-page-btn${page <= 1 ? " disabled" : ""}`}>←</Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link key={p} href={`/${category}?page=${p}`} className={`t7c-page-btn${p === page ? " active" : ""}`}>{p}</Link>
                ))}
                <Link href={page < totalPages ? `/${category}?page=${page + 1}` : "#"} className={`t7c-page-btn${page >= totalPages ? " disabled" : ""}`}>→</Link>
              </div>
            )}
          </div>
        )}

        {hasSeoContent && (
          <div className="t7c-seo">
            <div className="t7c-seo-inner">
              {seoIntro && <p className="t7c-seo-intro">{seoIntro}</p>}
              {seoH2 && <h2 className="t7c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t7c-seo-cols">
                  {seoCol1Body && <div><div className="t7c-seo-col-title">{seoCol1Title}</div><p className="t7c-seo-col-body">{seoCol1Body}</p></div>}
                  {seoCol2Body && <div><div className="t7c-seo-col-title">{seoCol2Title}</div><p className="t7c-seo-col-body">{seoCol2Body}</p></div>}
                </div>
              )}
              {seoFaq?.map((item, i) => (
                <div key={i} className="t7c-faq-item">
                  <div className="t7c-faq-q">{item.q}</div>
                  <p className="t7c-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
