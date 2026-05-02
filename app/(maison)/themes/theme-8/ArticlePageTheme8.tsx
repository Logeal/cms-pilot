import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 130) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null; wordCount: number | null;
};

type Props = { category: string; article: Article; related: Article[] };

export function ArticlePageTheme8({ category, article, related }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t8a { background: #fff; color: #111; font-family: var(--f-body, Georgia, serif); }

        /* NAV */
        .t8a-nav { max-width: 900px; margin: 0 auto; padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #e8e8e8; }
        .t8a-nav-brand { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #111; text-decoration: none; }
        .t8a-breadcrumb { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #bbb; display: flex; gap: 6px; }
        .t8a-breadcrumb a { color: #bbb; text-decoration: none; }
        .t8a-breadcrumb a:hover { color: #111; }

        /* HEADER article */
        .t8a-header { max-width: 900px; margin: 0 auto; padding: 64px 40px 48px; border-bottom: 1px solid #e8e8e8; }
        .t8a-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-terra, #b85c3a); display: block; margin-bottom: 20px; text-decoration: none; }
        .t8a-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(28px, 4.5vw, 56px); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; color: #111; margin-bottom: 24px; }
        .t8a-intro { font-size: 18px; color: #555; line-height: 1.7; max-width: 900px; margin-bottom: 28px; }
        .t8a-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #bbb; display: flex; gap: 16px; flex-wrap: wrap; }

        /* Image */
        .t8a-img-wrap { max-width: 900px; margin: 0 auto; padding: 0 40px 48px; }
        .t8a-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }

        /* CORPS */
        .t8a-body { max-width: 900px; margin: 0 auto; padding: 0 40px 64px; }
        .t8a-body h2 { font-family: var(--f-display, Georgia, serif); font-size: 24px; font-weight: 400; margin: 40px 0 14px; }
        .t8a-body h3 { font-family: var(--f-display, Georgia, serif); font-size: 19px; font-weight: 400; margin: 28px 0 10px; }
        .t8a-body p { font-size: 17px; line-height: 1.8; color: #333; margin-bottom: 22px; }
        .t8a-body ul, .t8a-body ol { padding-left: 24px; margin-bottom: 22px; }
        .t8a-body li { font-size: 17px; line-height: 1.75; color: #333; margin-bottom: 8px; }
        .t8a-body strong { font-weight: 700; }
        .t8a-body a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
        .t8a-body blockquote { border-left: 2px solid #111; padding: 4px 24px; margin: 32px 0; }
        .t8a-body blockquote p { font-size: 20px; font-style: italic; color: #555; }

        /* RELATED */
        .t8a-related { max-width: 900px; margin: 0 auto; padding: 0 40px 64px; border-top: 1px solid #e8e8e8; }
        .t8a-related-label { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #bbb; display: block; padding: 40px 0 28px; }
        .t8a-related-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 640px) { .t8a-related-list { grid-template-columns: 1fr; } }
        .t8a-related-item { text-decoration: none; display: block; }
        .t8a-related-item:hover .t8a-related-item-title { text-decoration: underline; text-underline-offset: 3px; }
        .t8a-related-item-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 6px; display: block; }
        .t8a-related-item-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 400; line-height: 1.3; color: #111; margin-bottom: 6px; }
        .t8a-related-item-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; display: block; }

        @media (max-width: 768px) { .t8a-nav, .t8a-header, .t8a-img-wrap, .t8a-body, .t8a-related { padding-left: 20px; padding-right: 20px; } }
      `}} />

      <div className="t8a">
        <nav className="t8a-nav">
          <Link href="/" className="t8a-nav-brand">Accueil</Link>
          <div className="t8a-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <Link href={`/${category}`}>{article.category ?? category}</Link>
          </div>
        </nav>

        <header className="t8a-header">
          {article.category && (
            <Link href={`/${category}`} className="t8a-cat">{article.category}</Link>
          )}
          <h1 className="t8a-h1">{article.title}</h1>
          {article.metaDescription && <p className="t8a-intro">{article.metaDescription}</p>}
          <div className="t8a-meta">
            <span>{fmt(article.publishedAt)}</span>
            {readTime && <><span>—</span><span>{readTime} min de lecture</span></>}
          </div>
        </header>

        {article.imageUrl && (
          <div className="t8a-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} className="t8a-img" />
          </div>
        )}

        <div className="t8a-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        {related.length > 0 && (
          <div className="t8a-related">
            <span className="t8a-related-label">À lire aussi</span>
            <div className="t8a-related-list">
              {related.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t8a-related-item">
                  {a.category && <span className="t8a-related-item-cat">{a.category}</span>}
                  <div className="t8a-related-item-title">{a.title}</div>
                  <span className="t8a-related-item-date">{fmt(a.publishedAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
