import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function excerpt(html: string, max = 160) {
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

export function CategoryPageTheme8({ category, label, articles, total, page, totalPages, seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent }: Props) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t8c { background: #fff; color: #111; font-family: var(--f-body, Georgia, serif); }

        .t8c-header { max-width: 900px; margin: 0 auto; padding: 56px 40px 40px; border-bottom: 1px solid #e8e8e8; }
        .t8c-breadcrumb { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #bbb; display: flex; gap: 6px; margin-bottom: 24px; }
        .t8c-breadcrumb a { color: #bbb; text-decoration: none; }
        .t8c-breadcrumb a:hover { color: #111; }
        .t8c-label { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-terra, #b85c3a); display: block; margin-bottom: 12px; }
        .t8c-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(36px, 6vw, 72px); font-weight: 400; line-height: 1; letter-spacing: -0.02em; margin-bottom: 16px; }
        .t8c-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #bbb; }
        .t8c-intro { font-size: 16px; color: #555; line-height: 1.7; max-width: 600px; margin-top: 20px; }

        .t8c-list { max-width: 900px; margin: 0 auto; padding: 0 40px 64px; }
        .t8c-item { display: grid; grid-template-columns: 48px 1fr 160px; gap: 24px; padding: 28px 0; border-bottom: 1px solid #e8e8e8; text-decoration: none; align-items: center; }
        .t8c-item:hover .t8c-item-title { text-decoration: underline; text-underline-offset: 3px; }
        @media (max-width: 600px) { .t8c-item { grid-template-columns: 32px 1fr; } .t8c-item-thumb { display: none; } }
        .t8c-item-num { font-family: var(--f-display, Georgia, serif); font-size: 13px; color: #ddd; padding-top: 2px; text-align: right; }
        .t8c-item-body {}
        .t8c-item-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 6px; display: block; }
        .t8c-item-title { font-family: var(--f-display, Georgia, serif); font-size: clamp(18px, 2vw, 24px); font-weight: 400; line-height: 1.25; color: #111; margin-bottom: 8px; }
        .t8c-item-desc { font-size: 14px; color: #777; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; }
        .t8c-item-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }
        .t8c-item-thumb { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 6px; display: block; }
        .t8c-item-thumb-empty { width: 100%; aspect-ratio: 4/3; background: #f0ece6; border-radius: 6px; display: block; }

        .t8c-pagination { display: flex; justify-content: center; gap: 8px; padding: 32px 0; }
        .t8c-page-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 36px; height: 36px; padding: 0 8px; font-family: var(--f-heading, sans-serif); font-size: 12px; font-weight: 600; text-decoration: none; color: #111; border: 1px solid #e8e8e8; transition: border-color 0.15s; }
        .t8c-page-btn:hover { border-color: #111; }
        .t8c-page-btn.active { background: #111; color: #fff; border-color: #111; }
        .t8c-page-btn.disabled { opacity: 0.3; pointer-events: none; }

        .t8c-seo { border-top: 1px solid #e8e8e8; padding: 48px 40px; }
        .t8c-seo-inner { max-width: 900px; margin: 0 auto; }
        .t8c-seo-intro { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 32px; }
        .t8c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: 26px; font-weight: 400; margin-bottom: 28px; }
        .t8c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; margin-bottom: 36px; }
        @media (max-width: 640px) { .t8c-seo-cols { grid-template-columns: 1fr; } }
        .t8c-seo-col-title { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 400; margin-bottom: 10px; }
        .t8c-seo-col-body { font-size: 14px; color: #555; line-height: 1.7; }
        .t8c-faq-item { border-top: 1px solid #e8e8e8; padding: 18px 0; }
        .t8c-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 400; margin-bottom: 8px; }
        .t8c-faq-a { font-size: 14px; color: #555; line-height: 1.7; }

        @media (max-width: 768px) { .t8c-header, .t8c-list, .t8c-seo { padding-left: 20px; padding-right: 20px; } }
      `}} />

      <div className="t8c">
        <div className="t8c-header">
          <div className="t8c-breadcrumb">
            <Link href="/">Accueil</Link><span>›</span>
            <span style={{ color: "#111" }}>{label}</span>
          </div>
          <span className="t8c-label">{label}</span>
          <h1 className="t8c-h1">{label}</h1>
          <div className="t8c-meta">{total} article{total > 1 ? "s" : ""}</div>
          {seoIntro && <p className="t8c-intro">{seoIntro}</p>}
        </div>

        <div className="t8c-list">
          {articles.map((a, i) => (
            <Link key={a.id} href={`/${category}/${a.slug}`} className="t8c-item">
              <span className="t8c-item-num">{String((page - 1) * 20 + i + 1).padStart(2, "0")}</span>
              <div className="t8c-item-body">
                {a.category && <span className="t8c-item-cat">{a.category}</span>}
                <div className="t8c-item-title">{a.title}</div>
                <div className="t8c-item-desc">{a.metaDescription || excerpt(a.content)}</div>
                <div className="t8c-item-date">{fmt(a.publishedAt)}</div>
              </div>
              {a.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={a.imageUrl} alt={a.title} className="t8c-item-thumb" />
                : <div className="t8c-item-thumb-empty" />
              }
            </Link>
          ))}
          {totalPages > 1 && (
            <div className="t8c-pagination">
              <Link href={page > 1 ? `/${category}?page=${page - 1}` : "#"} className={`t8c-page-btn${page <= 1 ? " disabled" : ""}`}>←</Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/${category}?page=${p}`} className={`t8c-page-btn${p === page ? " active" : ""}`}>{p}</Link>
              ))}
              <Link href={page < totalPages ? `/${category}?page=${page + 1}` : "#"} className={`t8c-page-btn${page >= totalPages ? " disabled" : ""}`}>→</Link>
            </div>
          )}
        </div>

        {hasSeoContent && (
          <div className="t8c-seo">
            <div className="t8c-seo-inner">
              {seoH2 && <h2 className="t8c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t8c-seo-cols">
                  {seoCol1Body && <div><div className="t8c-seo-col-title">{seoCol1Title}</div><p className="t8c-seo-col-body">{seoCol1Body}</p></div>}
                  {seoCol2Body && <div><div className="t8c-seo-col-title">{seoCol2Title}</div><p className="t8c-seo-col-body">{seoCol2Body}</p></div>}
                </div>
              )}
              {seoFaq?.map((item, i) => (
                <div key={i} className="t8c-faq-item">
                  <div className="t8c-faq-q">{item.q}</div>
                  <p className="t8c-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
