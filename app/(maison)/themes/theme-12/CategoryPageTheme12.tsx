import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function excerpt(html: string, max = 150) {
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

export function CategoryPageTheme12({ category, label, articles, total, page, totalPages, seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent }: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t12c { background: #0A0A0A; color: #F0EDE8; font-family: var(--f-body, Georgia, serif); min-height: 100vh; }

        .t12c-header { padding: 28px 48px; border-bottom: 1px solid rgba(201,169,110,0.15); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .t12c-header-left { display: flex; align-items: center; gap: 16px; }
        .t12c-back { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(201,169,110,0.5); text-decoration: none; }
        .t12c-back:hover { color: #C9A96E; }
        .t12c-sep { color: rgba(201,169,110,0.2); }
        .t12c-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(20px, 3vw, 36px); font-weight: 400; letter-spacing: 0.04em; text-transform: uppercase; color: #F0EDE8; }
        .t12c-count { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(240,237,232,0.25); }

        .t12c-intro { font-size: 14px; color: rgba(240,237,232,0.45); line-height: 1.7; padding: 20px 48px; border-bottom: 1px solid rgba(201,169,110,0.1); max-width: 700px; }

        /* Featured */
        .t12c-featured { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid rgba(201,169,110,0.1); }
        @media (max-width: 768px) { .t12c-featured { grid-template-columns: 1fr; } }
        .t12c-feat-img { width: 100%; height: 100%; min-height: 320px; object-fit: cover; }
        .t12c-feat-img-empty { min-height: 320px; background: #1A1A1A; }
        .t12c-feat-body { padding: 40px 48px; display: flex; flex-direction: column; justify-content: space-between; }
        .t12c-feat-kicker { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A96E; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .t12c-feat-kicker::before { content: ''; width: 24px; height: 1px; background: #C9A96E; }
        .t12c-feat-title { font-family: var(--f-display, Georgia, serif); font-size: clamp(20px, 2.5vw, 32px); font-weight: 400; line-height: 1.2; color: #F0EDE8; margin-bottom: 14px; }
        .t12c-feat-title a { color: inherit; text-decoration: none; }
        .t12c-feat-title a:hover { color: #C9A96E; }
        .t12c-feat-desc { font-size: 14px; color: rgba(240,237,232,0.5); line-height: 1.65; margin-bottom: 24px; }
        .t12c-feat-cta { display: inline-flex; align-items: center; gap: 8px; font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A96E; text-decoration: none; border-bottom: 1px solid rgba(201,169,110,0.3); padding-bottom: 3px; width: fit-content; }
        .t12c-feat-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(240,237,232,0.25); margin-top: 16px; }

        /* Grille */
        .t12c-grid-wrap { padding: 40px 48px 56px; }
        .t12c-grid-label { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A96E; display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .t12c-grid-label::after { content: ''; flex: 1; height: 1px; background: rgba(201,169,110,0.15); }
        .t12c-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 900px) { .t12c-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .t12c-grid { grid-template-columns: 1fr; } }
        .t12c-card { text-decoration: none; display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid rgba(201,169,110,0.08); padding-bottom: 20px; }
        .t12c-card:hover .t12c-card-title { color: #C9A96E; }
        .t12c-card-img { width: 100%; aspect-ratio: 3/2; object-fit: cover; }
        .t12c-card-img-empty { width: 100%; aspect-ratio: 3/2; background: #1A1A1A; }
        .t12c-card-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 400; line-height: 1.3; color: #F0EDE8; transition: color 0.2s; }
        .t12c-card-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(240,237,232,0.25); }

        .t12c-pagination { display: flex; justify-content: center; gap: 4px; padding: 24px 0; }
        .t12c-page-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 36px; height: 36px; font-family: var(--f-heading, sans-serif); font-size: 12px; font-weight: 600; text-decoration: none; color: rgba(240,237,232,0.4); border: 1px solid rgba(201,169,110,0.15); padding: 0 8px; transition: border-color 0.15s, color 0.15s; }
        .t12c-page-btn:hover, .t12c-page-btn.active { border-color: #C9A96E; color: #C9A96E; }
        .t12c-page-btn.disabled { opacity: 0.2; pointer-events: none; }

        .t12c-seo { padding: 40px 48px; border-top: 1px solid rgba(201,169,110,0.1); }
        .t12c-seo-inner { max-width: 900px; }
        .t12c-seo-intro { font-size: 14px; color: rgba(240,237,232,0.45); line-height: 1.7; margin-bottom: 28px; }
        .t12c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 400; color: #F0EDE8; margin-bottom: 20px; }
        .t12c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px; }
        @media (max-width: 600px) { .t12c-seo-cols { grid-template-columns: 1fr; } }
        .t12c-seo-col-title { font-size: 14px; font-weight: 400; color: #F0EDE8; margin-bottom: 8px; font-family: var(--f-display, Georgia, serif); }
        .t12c-seo-col-body { font-size: 13px; color: rgba(240,237,232,0.45); line-height: 1.7; }
        .t12c-faq-item { border-top: 1px solid rgba(201,169,110,0.08); padding: 14px 0; }
        .t12c-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 14px; font-weight: 400; color: #F0EDE8; margin-bottom: 6px; }
        .t12c-faq-a { font-size: 13px; color: rgba(240,237,232,0.45); line-height: 1.7; }

        @media (max-width: 768px) { .t12c-header, .t12c-intro, .t12c-feat-body, .t12c-grid-wrap, .t12c-seo { padding-left: 20px; padding-right: 20px; } }
      `}} />

      <div className="t12c">
        <div className="t12c-header">
          <div className="t12c-header-left">
            <Link href="/" className="t12c-back">← Accueil</Link>
            <span className="t12c-sep">/</span>
            <h1 className="t12c-h1">{label}</h1>
          </div>
          <span className="t12c-count">{total} article{total > 1 ? "s" : ""}</span>
        </div>
        {seoIntro && <p className="t12c-intro">{seoIntro}</p>}

        {featured && (
          <div className="t12c-featured">
            <div>
              {featured.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={featured.imageUrl} alt={featured.title} className="t12c-feat-img" />
                : <div className="t12c-feat-img-empty" />
              }
            </div>
            <div className="t12c-feat-body">
              <div>
                <div className="t12c-feat-kicker">À la une</div>
                <div className="t12c-feat-title">
                  <Link href={`/${category}/${featured.slug}`}>{featured.title}</Link>
                </div>
                <div className="t12c-feat-desc">{featured.metaDescription || excerpt(featured.content, 200)}</div>
                <Link href={`/${category}/${featured.slug}`} className="t12c-feat-cta">Lire l&apos;article →</Link>
              </div>
              <div className="t12c-feat-date">{fmt(featured.publishedAt)}</div>
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="t12c-grid-wrap">
            <div className="t12c-grid-label">Tous les articles</div>
            <div className="t12c-grid">
              {rest.map(a => (
                <Link key={a.id} href={`/${category}/${a.slug}`} className="t12c-card">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t12c-card-img" />
                    : <div className="t12c-card-img-empty" />
                  }
                  <div className="t12c-card-title">{a.title}</div>
                  <div className="t12c-card-date">{fmt(a.publishedAt)}</div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="t12c-pagination">
                <Link href={page > 1 ? `/${category}?page=${page - 1}` : "#"} className={`t12c-page-btn${page <= 1 ? " disabled" : ""}`}>←</Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link key={p} href={`/${category}?page=${p}`} className={`t12c-page-btn${p === page ? " active" : ""}`}>{p}</Link>
                ))}
                <Link href={page < totalPages ? `/${category}?page=${page + 1}` : "#"} className={`t12c-page-btn${page >= totalPages ? " disabled" : ""}`}>→</Link>
              </div>
            )}
          </div>
        )}

        {hasSeoContent && (
          <div className="t12c-seo">
            <div className="t12c-seo-inner">
              {seoH2 && <h2 className="t12c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t12c-seo-cols">
                  {seoCol1Body && <div><div className="t12c-seo-col-title">{seoCol1Title}</div><p className="t12c-seo-col-body">{seoCol1Body}</p></div>}
                  {seoCol2Body && <div><div className="t12c-seo-col-title">{seoCol2Title}</div><p className="t12c-seo-col-body">{seoCol2Body}</p></div>}
                </div>
              )}
              {seoFaq?.map((item, i) => (
                <div key={i} className="t12c-faq-item">
                  <div className="t12c-faq-q">{item.q}</div>
                  <p className="t12c-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
