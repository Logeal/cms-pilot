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
export function ArticlePageTheme12({ category, article, related, articleUrl }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t12a { background: #0A0A0A; color: #F0EDE8; font-family: var(--f-body, Georgia, serif); min-height: 100vh; }

        .t12a-topbar { padding: 20px 48px; border-bottom: 1px solid rgba(201,169,110,0.12); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .t12a-back { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(201,169,110,0.45); text-decoration: none; }
        .t12a-back:hover { color: #C9A96E; }
        .t12a-breadcrumb { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(240,237,232,0.25); display: flex; gap: 8px; letter-spacing: 0.06em; }
        .t12a-breadcrumb a { color: rgba(240,237,232,0.25); text-decoration: none; }
        .t12a-breadcrumb a:hover { color: #C9A96E; }

        /* Hero image plein format */
        .t12a-hero { position: relative; height: 72vh; min-height: 400px; overflow: hidden; }
        .t12a-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .t12a-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.05) 100%); }
        .t12a-hero-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 0 48px 48px; max-width: 900px; z-index: 1; }
        .t12a-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A96E; display: flex; align-items: center; gap: 12px; margin-bottom: 18px; text-decoration: none; }
        .t12a-cat::before { content: ''; width: 24px; height: 1px; background: #C9A96E; }
        .t12a-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(24px, 4vw, 52px); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; color: #F0EDE8; margin-bottom: 16px; }
        .t12a-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(240,237,232,0.3); display: flex; gap: 14px; flex-wrap: wrap; letter-spacing: 0.04em; }
        .t12a-meta-dot { color: rgba(201,169,110,0.3); }

        /* Intro + corps */
        .t12a-content { max-width: 800px; margin: 0 auto; padding: 48px 48px 80px; }
        .t12a-intro { font-size: 18px; color: rgba(240,237,232,0.65); line-height: 1.7; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid rgba(201,169,110,0.1); }
        .t12a-body {}
        .t12a-body h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 400; color: #F0EDE8; margin: 40px 0 14px; }
        .t12a-body h2::before { content: '— '; color: #C9A96E; }
        .t12a-body h3 { font-family: var(--f-display, Georgia, serif); font-size: 17px; font-weight: 400; color: rgba(240,237,232,0.8); margin: 28px 0 10px; }
        .t12a-body p { font-size: 17px; line-height: 1.82; color: rgba(240,237,232,0.6); margin-bottom: 22px; }
        .t12a-body ul, .t12a-body ol { padding-left: 24px; margin-bottom: 22px; }
        .t12a-body li { font-size: 16px; line-height: 1.75; color: rgba(240,237,232,0.6); margin-bottom: 8px; }
        .t12a-body strong { color: #F0EDE8; font-weight: 700; }
        .t12a-body a { color: #C9A96E; }
        .t12a-body blockquote { border-left: 2px solid #C9A96E; padding: 8px 24px; margin: 32px 0; }
        .t12a-body blockquote p { font-size: 19px; font-style: italic; color: rgba(240,237,232,0.75); margin: 0; }

        /* Related */
        .t12a-related { border-top: 1px solid rgba(201,169,110,0.1); padding: 48px 48px 64px; }
        .t12a-related-label { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A96E; display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .t12a-related-label::after { content: ''; flex: 1; height: 1px; background: rgba(201,169,110,0.15); }
        .t12a-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 900px; }
        @media (max-width: 700px) { .t12a-related-grid { grid-template-columns: 1fr 1fr; } }
        .t12a-rel-item { text-decoration: none; display: flex; flex-direction: column; gap: 8px; }
        .t12a-rel-item:hover .t12a-rel-title { color: #C9A96E; }
        .t12a-rel-img { width: 100%; aspect-ratio: 3/2; object-fit: cover; }
        .t12a-rel-img-empty { width: 100%; aspect-ratio: 3/2; background: #1A1A1A; }
        .t12a-rel-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #C9A96E; }
        .t12a-rel-title { font-family: var(--f-display, Georgia, serif); font-size: 14px; font-weight: 400; line-height: 1.3; color: #F0EDE8; transition: color 0.2s; }
        .t12a-rel-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(240,237,232,0.2); }

        @media (max-width: 768px) { .t12a-topbar, .t12a-hero-body, .t12a-content, .t12a-related { padding-left: 20px; padding-right: 20px; } }
        /* Tableaux dans le contenu d'article */
        .t12a-body table { width: 100%; border-collapse: collapse; margin: 32px 0; font-size: 15px; line-height: 1.55; border: 1px solid #e5e2db; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .t12a-body table thead { background: #1a1a1a; }
        .t12a-body table thead th { padding: 13px 16px; text-align: left; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; border: none; }
        .t12a-body table tbody td { padding: 12px 16px; border-bottom: 1px solid #eceae3; vertical-align: top; }
        .t12a-body table tbody tr:last-child td { border-bottom: none; }
        .t12a-body table tbody tr:nth-child(even) { background: #faf8f3; }
        .t12a-body table tbody tr:hover { background: #f3f0e8; }
        .t12a-body table p { margin: 0; }
        @media (max-width: 640px) { .t12a-body table { font-size: 13.5px; display: block; overflow-x: auto; } }
      `}} />

      <div className="t12a">
        <div className="t12a-topbar">
          <Link href="/" className="t12a-back">← Accueil</Link>
          <div className="t12a-breadcrumb">
            <Link href={`/${category}`}>{article.category ?? category}</Link>
            <span className="t12a-meta-dot">·</span>
            <span>Article</span>
          </div>
        </div>

        <div className="t12a-hero">
          {article.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.imageUrl} alt={article.title} className="t12a-hero-img" />
          )}
          <div className="t12a-hero-overlay" />
          <div className="t12a-hero-body">
            {article.category && (
              <Link href={`/${category}`} className="t12a-cat">{article.category}</Link>
            )}
            <h1 className="t12a-h1">{article.title}</h1>
            <div className="t12a-meta">
              <span>{fmt(article.publishedAt)}</span>
              {readTime && <><span className="t12a-meta-dot">·</span><span>{readTime} min de lecture</span></>}
            </div>
          </div>
        </div>

        <div className="t12a-content">
          {article.metaDescription && <p className="t12a-intro">{article.metaDescription}</p>}
          <div className="t12a-body" dangerouslySetInnerHTML={{ __html: article.content }} />
          <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />
        </div>

        {related.length > 0 && (
          <div className="t12a-related">
            <div className="t12a-related-label">Dans la même veine</div>
            <div className="t12a-related-grid">
              {related.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t12a-rel-item">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t12a-rel-img" />
                    : <div className="t12a-rel-img-empty" />
                  }
                  {a.category && <div className="t12a-rel-cat">{a.category}</div>}
                  <div className="t12a-rel-title">{a.title}</div>
                  <div className="t12a-rel-date">{fmt(a.publishedAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
