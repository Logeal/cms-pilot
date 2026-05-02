import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function excerpt(html: string, max = 130) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null; wordCount?: number | null;
};

type Props = {
  category: string; label: string;
  articles: Article[];
  total: number; page: number; totalPages: number;
  seoIntro: string | null; seoH2: string | null;
  seoCol1Title: string | null; seoCol1Body: string | null;
  seoCol2Title: string | null; seoCol2Body: string | null;
  seoFaq: Array<{ q: string; a: string }> | null;
  hasSeoContent: boolean;
};

export function CategoryPageTheme5({
  category, label, articles, page, totalPages,
  seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent,
}: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t5c-page { background: #f5f5f3; color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t5c-header { background: var(--c-dark, #0f1923); padding: 56px 40px 60px; }
        .t5c-header-inner { max-width: 1200px; margin: 0 auto; }
        .t5c-breadcrumb { display: flex; align-items: center; gap: 8px; font-family: var(--f-heading, sans-serif); font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.06em; margin-bottom: 28px; text-transform: uppercase; }
        .t5c-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; }
        .t5c-breadcrumb a:hover { color: rgba(255,255,255,0.7); }
        .t5c-tag { display: inline-block; font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; background: var(--c-terra, #b85c3a); color: #fff; padding: 4px 12px; margin-bottom: 18px; }
        .t5c-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(32px, 5vw, 58px); font-weight: 700; color: #fff; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 18px; }
        .t5c-accent { width: 48px; height: 3px; background: var(--c-terra, #b85c3a); margin-bottom: 18px; }
        .t5c-intro { font-size: 16px; color: rgba(255,255,255,0.55); line-height: 1.65; max-width: 640px; }

        /* FEATURED */
        .t5c-featured-wrap { max-width: 1200px; margin: -28px auto 0; padding: 0 40px; position: relative; z-index: 2; }
        .t5c-featured { display: grid; grid-template-columns: 1fr 1fr; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 4px 32px rgba(0,0,0,0.10); }
        @media (max-width: 720px) { .t5c-featured { grid-template-columns: 1fr; } }
        .t5c-feat-img-wrap { aspect-ratio: 4/3; overflow: hidden; }
        .t5c-feat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .t5c-featured:hover .t5c-feat-img { transform: scale(1.04); }
        .t5c-feat-noimg { width: 100%; height: 100%; background: var(--c-dark, #0f1923); min-height: 260px; }
        .t5c-feat-body { padding: 36px 36px 32px; display: flex; flex-direction: column; justify-content: center; }
        .t5c-feat-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 12px; }
        .t5c-feat-title { font-family: var(--f-display, Georgia, serif); font-size: clamp(20px, 2.5vw, 28px); font-weight: 700; line-height: 1.2; color: #1a1a1a; margin-bottom: 12px; }
        .t5c-feat-title a { color: inherit; text-decoration: none; }
        .t5c-feat-title a:hover { color: var(--c-terra, #b85c3a); }
        .t5c-feat-desc { font-size: 15px; color: #555; line-height: 1.65; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t5c-feat-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #999; }

        /* GRID */
        .t5c-grid-wrap { max-width: 1200px; margin: 0 auto; padding: 48px 40px 64px; }
        .t5c-grid-head { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .t5c-grid-label { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #888; white-space: nowrap; }
        .t5c-grid-rule { flex: 1; height: 1px; background: #ddd; }
        .t5c-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .t5c-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t5c-grid { grid-template-columns: 1fr; } }

        .t5c-card { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #e8e8e6; display: flex; flex-direction: column; transition: box-shadow 0.2s, transform 0.2s; }
        .t5c-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
        .t5c-card-img-wrap { aspect-ratio: 16/10; overflow: hidden; }
        .t5c-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t5c-card:hover .t5c-card-img { transform: scale(1.04); }
        .t5c-card-noimg { width: 100%; height: 100%; background: var(--c-dark, #0f1923); min-height: 120px; }
        .t5c-card-body { padding: 18px 20px 16px; flex: 1; display: flex; flex-direction: column; }
        .t5c-card-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 8px; display: block; text-decoration: none; }
        .t5c-card-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; line-height: 1.3; color: #1a1a1a; margin-bottom: 8px; flex: 1; }
        .t5c-card-title a { color: inherit; text-decoration: none; }
        .t5c-card-title a:hover { color: var(--c-terra, #b85c3a); }
        .t5c-card-desc { font-size: 13px; color: #666; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
        .t5c-card-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #aaa; }

        /* PAGINATION */
        .t5c-pager { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 40px 64px; }
        .t5c-pager a, .t5c-pager span { font-family: var(--f-heading, sans-serif); font-size: 13px; padding: 8px 16px; border-radius: 6px; text-decoration: none; }
        .t5c-pager a { background: #fff; border: 1px solid #ddd; color: #333; }
        .t5c-pager a:hover { background: var(--c-dark, #0f1923); color: #fff; border-color: var(--c-dark, #0f1923); }
        .t5c-pager span { background: var(--c-terra, #b85c3a); color: #fff; border: 1px solid transparent; font-weight: 700; }

        /* SEO */
        .t5c-seo { max-width: 1200px; margin: 0 auto; padding: 0 40px 80px; }
        .t5c-seo-box { background: #fff; border-radius: 10px; padding: 40px 48px; border: 1px solid #e8e8e6; }
        .t5c-seo-intro { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 32px; }
        .t5c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; border-left: 3px solid var(--c-terra, #b85c3a); padding-left: 14px; }
        .t5c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        @media (max-width: 720px) { .t5c-seo-cols { grid-template-columns: 1fr; } }
        .t5c-seo-col-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
        .t5c-seo-col-body { font-size: 14px; line-height: 1.75; color: #555; }
        .t5c-seo-faq { margin-top: 32px; }
        .t5c-seo-faq-item { border-top: 1px solid #eee; padding: 18px 0; }
        .t5c-seo-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
        .t5c-seo-faq-a { font-size: 14px; line-height: 1.7; color: #555; }
      `}} />

      <div className="t5c-page">
        <div className="t5c-header">
          <div className="t5c-header-inner">
            <div className="t5c-breadcrumb">
              <Link href="/">Accueil</Link>
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
            </div>
            <div className="t5c-tag">Rubrique</div>
            <h1 className="t5c-h1">{label}</h1>
            <div className="t5c-accent" />
            {seoIntro && <p className="t5c-intro">{seoIntro}</p>}
          </div>
        </div>

        {featured && (
          <div className="t5c-featured-wrap">
            <article className="t5c-featured">
              <div className="t5c-feat-img-wrap">
                {featured.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.imageUrl} alt={featured.title} className="t5c-feat-img" />
                  : <div className="t5c-feat-noimg" />
                }
              </div>
              <div className="t5c-feat-body">
                <div className="t5c-feat-cat">{label}</div>
                <div className="t5c-feat-title">
                  <Link href={`/${category}/${featured.slug}`}>{featured.title}</Link>
                </div>
                <p className="t5c-feat-desc">{featured.metaDescription || excerpt(featured.content)}</p>
                <div className="t5c-feat-meta">{fmt(featured.publishedAt)}</div>
              </div>
            </article>
          </div>
        )}

        <div className="t5c-grid-wrap">
          {rest.length > 0 && (
            <>
              <div className="t5c-grid-head">
                <span className="t5c-grid-label">Tous les articles</span>
                <div className="t5c-grid-rule" />
              </div>
              <div className="t5c-grid">
                {rest.map(a => (
                  <article key={a.id} className="t5c-card">
                    <div className="t5c-card-img-wrap">
                      {a.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.imageUrl} alt={a.title} className="t5c-card-img" />
                        : <div className="t5c-card-noimg" />
                      }
                    </div>
                    <div className="t5c-card-body">
                      <Link href={`/${category}`} className="t5c-card-cat">{label}</Link>
                      <div className="t5c-card-title"><Link href={`/${category}/${a.slug}`}>{a.title}</Link></div>
                      <p className="t5c-card-desc">{a.metaDescription || excerpt(a.content)}</p>
                      <div className="t5c-card-meta">{fmt(a.publishedAt)}</div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="t5c-pager">
            {page > 1 && <Link href={`/${category}?page=${page - 1}`}>← Précédent</Link>}
            <span>{page} / {totalPages}</span>
            {page < totalPages && <Link href={`/${category}?page=${page + 1}`}>Suivant →</Link>}
          </div>
        )}

        {hasSeoContent && (
          <div className="t5c-seo">
            <div className="t5c-seo-box">
              {seoIntro && <p className="t5c-seo-intro">{seoIntro}</p>}
              {seoH2 && <h2 className="t5c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t5c-seo-cols">
                  {seoCol1Body && (
                    <div>
                      {seoCol1Title && <div className="t5c-seo-col-title">{seoCol1Title}</div>}
                      <p className="t5c-seo-col-body">{seoCol1Body}</p>
                    </div>
                  )}
                  {seoCol2Body && (
                    <div>
                      {seoCol2Title && <div className="t5c-seo-col-title">{seoCol2Title}</div>}
                      <p className="t5c-seo-col-body">{seoCol2Body}</p>
                    </div>
                  )}
                </div>
              )}
              {seoFaq && seoFaq.length > 0 && (
                <div className="t5c-seo-faq">
                  {seoFaq.map((item, i) => (
                    <div key={i} className="t5c-seo-faq-item">
                      <div className="t5c-seo-faq-q">{item.q}</div>
                      <p className="t5c-seo-faq-a">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
