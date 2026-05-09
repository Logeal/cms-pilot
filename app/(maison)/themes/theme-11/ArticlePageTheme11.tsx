import Link from "next/link";
import { ArticleAISummary } from "../_shared/ArticleAISummary";

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

type Props = { category: string; article: Article; related: Article[]; articleUrl: string };
export function ArticlePageTheme11({ category, article, related, articleUrl }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t11a { background: #FDFCFA; color: #1C1C1E; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t11a-topbar { max-width: 1200px; margin: 0 auto; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .t11a-home { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; text-decoration: none; }
        .t11a-home:hover { color: #1C1C1E; }
        .t11a-breadcrumb { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #bbb; display: flex; gap: 6px; }
        .t11a-breadcrumb a { color: #bbb; text-decoration: none; }
        .t11a-breadcrumb a:hover { color: #1C1C1E; }

        /* Article header */
        .t11a-header { max-width: 1200px; margin: 0 auto; padding: 0 32px 32px; border-bottom: 1px solid #E8E5E0; }
        .t11a-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-terra, #b85c3a); display: flex; align-items: center; gap: 8px; margin-bottom: 20px; text-decoration: none; }
        .t11a-cat::after { content: ''; flex: 1; height: 1px; background: var(--c-terra, #b85c3a); opacity: 0.3; }
        .t11a-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(26px, 4.5vw, 48px); font-weight: 400; line-height: 1.15; letter-spacing: -0.02em; color: #1C1C1E; margin-bottom: 20px; }
        .t11a-intro { font-size: 18px; color: #555; line-height: 1.7; margin-bottom: 20px; }
        .t11a-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #bbb; display: flex; gap: 16px; flex-wrap: wrap; }

        /* Image */
        .t11a-img-wrap { max-width: 1200px; margin: 0 auto; padding: 32px 32px 0; }
        .t11a-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }

        /* Corps */
        .t11a-body { max-width: 860px; margin: 0 auto; padding: 32px 32px 64px; }
        .t11a-body h2 { font-family: var(--f-display, Georgia, serif); font-size: 24px; font-weight: 400; margin: 40px 0 14px; }
        .t11a-body h3 { font-family: var(--f-display, Georgia, serif); font-size: 19px; font-weight: 400; margin: 28px 0 10px; }
        .t11a-body p { font-size: 17px; line-height: 1.8; color: #333; margin-bottom: 22px; }
        .t11a-body ul, .t11a-body ol { padding-left: 24px; margin-bottom: 22px; }
        .t11a-body li { font-size: 17px; line-height: 1.75; color: #333; margin-bottom: 8px; }
        .t11a-body strong { font-weight: 700; }
        .t11a-body a { color: var(--c-terra, #b85c3a); }
        .t11a-body blockquote { border-left: 2px solid var(--c-terra, #b85c3a); padding: 4px 24px; margin: 32px 0; }
        .t11a-body blockquote p { font-size: 20px; font-style: italic; color: #555; }

        /* Related — feed style */
        .t11a-related { max-width: 1200px; margin: 0 auto; padding: 0 32px 64px; border-top: 1px solid #E8E5E0; }
        .t11a-related-label { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #bbb; display: flex; align-items: center; gap: 12px; padding: 32px 0 20px; }
        .t11a-related-label::after { content: ''; flex: 1; height: 1px; background: #E8E5E0; }
        .t11a-rel-item { display: grid; grid-template-columns: 1fr 90px; gap: 14px; padding: 14px 0; border-bottom: 1px solid #F0EDE8; text-decoration: none; }
        .t11a-rel-item:last-child { border-bottom: none; }
        .t11a-rel-item:hover .t11a-rel-title { text-decoration: underline; text-underline-offset: 3px; }
        .t11a-rel-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 5px; display: block; }
        .t11a-rel-title { font-family: var(--f-display, Georgia, serif); font-size: 14px; font-weight: 400; line-height: 1.3; color: #1C1C1E; }
        .t11a-rel-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; margin-top: 4px; display: block; }
        .t11a-rel-img { width: 100%; aspect-ratio: 3/2; object-fit: cover; }
        .t11a-rel-img-empty { width: 100%; aspect-ratio: 3/2; background: #F0EDE8; }

        @media (max-width: 480px) { .t11a-topbar, .t11a-header, .t11a-img-wrap, .t11a-body, .t11a-related { padding-left: 20px; padding-right: 20px; } }
      `}} />

      <div className="t11a">
        <div className="t11a-topbar">
          <Link href="/" className="t11a-home">← Accueil</Link>
          <div className="t11a-breadcrumb">
            <Link href={`/${category}`}>{article.category ?? category}</Link>
          </div>
        </div>

        <header className="t11a-header">
          {article.category && (
            <Link href={`/${category}`} className="t11a-cat">{article.category}</Link>
          )}
          <h1 className="t11a-h1">{article.title}</h1>
          {article.metaDescription && <p className="t11a-intro">{article.metaDescription}</p>}
          <div className="t11a-meta">
            <span>{fmt(article.publishedAt)}</span>
            {readTime && <><span>·</span><span>{readTime} min de lecture</span></>}
          </div>
        </header>

        {article.imageUrl && (
          <div className="t11a-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} className="t11a-img" />
          </div>
        )}

        <div className="t11a-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />

        {related.length > 0 && (
          <div className="t11a-related">
            <span className="t11a-related-label">À lire aussi</span>
            {related.map(a => (
              <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t11a-rel-item">
                <div>
                  {a.category && <span className="t11a-rel-cat">{a.category}</span>}
                  <div className="t11a-rel-title">{a.title}</div>
                  <span className="t11a-rel-date">{fmt(a.publishedAt)}</span>
                </div>
                {a.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={a.imageUrl} alt={a.title} className="t11a-rel-img" />
                  : <div className="t11a-rel-img-empty" />
                }
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
