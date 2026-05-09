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
export function ArticlePageTheme7({ category, article, related, articleUrl }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t7a { background: #FAFAF8; color: #111; font-family: var(--f-body, 'Times New Roman', Georgia, serif); }

        /* FIL D'ARIANE */
        .t7a-breadcrumb-wrap { max-width: 1280px; margin: 0 auto; padding: 16px 40px; }
        .t7a-breadcrumb { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #999; display: flex; gap: 6px; align-items: center; }
        .t7a-breadcrumb a { color: #999; text-decoration: none; }
        .t7a-breadcrumb a:hover { color: #111; }

        /* HERO article */
        .t7a-hero { border-bottom: 2px solid #111; }
        .t7a-hero-inner { max-width: 1280px; margin: 0 auto; padding: 28px 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        @media (max-width: 768px) { .t7a-hero-inner { grid-template-columns: 1fr; } }

        .t7a-hero-body { padding-right: 40px; display: flex; flex-direction: column; justify-content: space-between; }
        .t7a-cat { display: inline-block; font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 12px; text-decoration: none; }
        .t7a-cat::after { content: ''; display: block; height: 2px; background: var(--c-terra, #b85c3a); margin-top: 6px; }
        .t7a-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(26px, 3.5vw, 48px); font-weight: 900; line-height: 1.05; letter-spacing: -0.02em; color: #111; margin-bottom: 16px; }
        .t7a-intro { font-size: 16px; color: #444; line-height: 1.65; margin-bottom: 24px; }
        .t7a-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #999; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .t7a-meta-sep { color: #ddd; }

        .t7a-hero-img { width: 100%; height: 100%; min-height: 320px; object-fit: cover; }
        .t7a-hero-img-empty { min-height: 320px; background: #e8e5e0; }

        /* CONTENU */
        .t7a-content-wrap { max-width: 1280px; margin: 0 auto; padding: 40px 40px; display: grid; grid-template-columns: 1fr 280px; gap: 48px; }
        @media (max-width: 900px) { .t7a-content-wrap { grid-template-columns: 1fr; } }

        .t7a-article-body { max-width: 720px; }
        .t7a-article-body h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 900; margin: 32px 0 12px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
        .t7a-article-body h3 { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 700; margin: 24px 0 10px; }
        .t7a-article-body p { font-size: 16px; line-height: 1.75; color: #333; margin-bottom: 20px; }
        .t7a-article-body ul, .t7a-article-body ol { padding-left: 24px; margin-bottom: 20px; }
        .t7a-article-body li { font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 8px; }
        .t7a-article-body strong { font-weight: 700; }
        .t7a-article-body a { color: var(--c-terra, #b85c3a); }
        .t7a-article-body blockquote { border-left: 4px solid #111; padding: 12px 20px; margin: 24px 0; background: #f5f5f2; }
        .t7a-article-body blockquote p { font-size: 18px; font-style: italic; color: #111; margin: 0; }

        /* Sidebar */
        .t7a-sidebar {}
        .t7a-sidebar-head { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 900; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 16px; }
        .t7a-related-item { display: block; text-decoration: none; border-bottom: 1px solid #ddd; padding: 14px 0; transition: background 0.12s; }
        .t7a-related-item:hover .t7a-related-title { color: var(--c-terra, #b85c3a); }
        .t7a-related-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; margin-bottom: 8px; }
        .t7a-related-img-empty { width: 100%; aspect-ratio: 16/9; background: #ece9e4; margin-bottom: 8px; }
        .t7a-related-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 4px; }
        .t7a-related-title { font-family: var(--f-display, Georgia, serif); font-size: 14px; font-weight: 700; line-height: 1.3; color: #111; margin-bottom: 4px; transition: color 0.15s; }
        .t7a-related-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }

        @media (max-width: 768px) { .t7a-masthead, .t7a-hero-inner, .t7a-content-wrap { padding-left: 20px; padding-right: 20px; } }
      `}} />

      <div className="t7a">
        <div className="t7a-breadcrumb-wrap">
          <div className="t7a-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <Link href={`/${category}`}>{article.category ?? category}</Link>
            <span>›</span>
            <span style={{ color: "#111" }}>{article.title}</span>
          </div>
        </div>

        <div className="t7a-hero">
          <div className="t7a-hero-inner">
            <div className="t7a-hero-body">
              {article.category && (
                <Link href={`/${category}`} className="t7a-cat">{article.category}</Link>
              )}
              <h1 className="t7a-h1">{article.title}</h1>
              {article.metaDescription && <p className="t7a-intro">{article.metaDescription}</p>}
              <div className="t7a-meta">
                <span>{fmt(article.publishedAt)}</span>
                {readTime && <><span className="t7a-meta-sep">—</span><span>{readTime} min de lecture</span></>}
              </div>
            </div>
            <div>
              {article.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={article.imageUrl} alt={article.title} className="t7a-hero-img" />
                : <div className="t7a-hero-img-empty" />
              }
            </div>
          </div>
        </div>

        <div className="t7a-content-wrap">
          <div style={{ maxWidth: 720, gridColumn: 1 }}>
            <div className="t7a-article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
            <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />
          </div>

          {related.length > 0 && (
            <aside className="t7a-sidebar">
              <div className="t7a-sidebar-head">À lire aussi</div>
              {related.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t7a-related-item">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t7a-related-img" />
                    : <div className="t7a-related-img-empty" />
                  }
                  {a.category && <div className="t7a-related-cat">{a.category}</div>}
                  <div className="t7a-related-title">{a.title}</div>
                  <div className="t7a-related-date">{fmt(a.publishedAt)}</div>
                </Link>
              ))}
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
