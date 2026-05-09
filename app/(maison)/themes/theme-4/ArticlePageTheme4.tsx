import Link from "next/link";
import { ArticleAISummary } from "../_shared/ArticleAISummary";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
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
export function ArticlePageTheme4({ category, article, related, articleUrl }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t4a-page { background: var(--c-cream-2, #f4f4f2); color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t4a-header { background: var(--c-dark, #0f1923); padding: 40px 40px 48px; }
        .t4a-header-inner { max-width: 1000px; margin: 0 auto; }
        .t4a-breadcrumb { display: flex; align-items: center; gap: 8px; font-family: var(--f-heading, sans-serif); font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.06em; margin-bottom: 28px; }
        .t4a-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; }
        .t4a-breadcrumb a:hover { color: rgba(255,255,255,0.7); }

        .t4a-cat {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #fff; background: var(--c-terra, #b85c3a);
          padding: 5px 12px; margin-bottom: 20px;
          text-decoration: none;
        }
        .t4a-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(28px, 4vw, 52px); font-weight: 700;
          line-height: 1.1; letter-spacing: -0.02em; color: #fff;
          margin-bottom: 20px;
        }
        .t4a-accent { width: 40px; height: 3px; background: var(--c-terra, #b85c3a); margin-bottom: 20px; }
        .t4a-intro { font-size: 17px; color: rgba(255,255,255,0.65); line-height: 1.65; margin-bottom: 24px; }
        .t4a-meta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; font-family: var(--f-heading, sans-serif); font-size: 12px; color: rgba(255,255,255,0.35); }
        .t4a-meta-sep { width: 3px; height: 3px; background: rgba(255,255,255,0.2); border-radius: 50%; }

        /* HERO IMG */
        .t4a-img-wrap { max-width: 1000px; margin: -24px auto 0; padding: 0 40px; position: relative; z-index: 1; }
        .t4a-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 10px; display: block; box-shadow: 0 8px 40px rgba(0,0,0,0.15); }

        /* BODY */
        .t4a-body-wrap { max-width: 1000px; margin: 0 auto; padding: 48px 40px 64px; }
        .t4a-content { font-size: 17px; line-height: 1.8; color: #2a2a2a; background: #fff; border-radius: 10px; padding: 48px 52px; }
        @media (max-width: 640px) { .t4a-content { padding: 32px 24px; } }
        .t4a-content h2 { font-family: var(--f-display, Georgia, serif); font-size: 24px; font-weight: 700; margin: 44px 0 14px; color: #1a1a1a; border-left: 3px solid var(--c-terra, #b85c3a); padding-left: 16px; }
        .t4a-content h3 { font-family: var(--f-display, Georgia, serif); font-size: 19px; font-weight: 700; margin: 32px 0 10px; }
        .t4a-content p { margin-bottom: 20px; }
        .t4a-content ul, .t4a-content ol { margin: 0 0 20px 24px; }
        .t4a-content li { margin-bottom: 7px; }
        .t4a-content strong { font-weight: 700; }
        .t4a-content a { color: var(--c-terra, #b85c3a); text-decoration: underline; }
        .t4a-content blockquote { border-left: 3px solid var(--c-terra, #b85c3a); padding: 14px 20px; margin: 24px 0; background: #f8f6f3; font-style: italic; font-size: 17px; color: #444; border-radius: 0 6px 6px 0; }

        /* RELATED */
        .t4a-related { background: var(--c-dark, #0f1923); padding: 64px 40px; }
        .t4a-related-inner { max-width: 1280px; margin: 0 auto; }
        .t4a-related-head { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
        .t4a-related-label { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.4); white-space: nowrap; }
        .t4a-related-rule { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

        .t4a-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 900px) { .t4a-related-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t4a-related-grid { grid-template-columns: 1fr; } }

        .t4a-rel-card { background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; }
        .t4a-rel-img-wrap { aspect-ratio: 16/10; overflow: hidden; border-radius: 0; }
        .t4a-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t4a-rel-card:hover .t4a-rel-img { transform: scale(1.04); }
        .t4a-rel-body { padding: 16px 18px; flex: 1; display: flex; flex-direction: column; }
        .t4a-rel-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; color: var(--c-terra, #b85c3a); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 7px; display: block; text-decoration: none; }
        .t4a-rel-title { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; line-height: 1.3; color: #fff; margin-bottom: 7px; flex: 1; }
        .t4a-rel-title a { color: inherit; text-decoration: none; }
        .t4a-rel-title a:hover { text-decoration: underline; }
        .t4a-rel-desc { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
        .t4a-rel-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(255,255,255,0.25); }

        .t4a-noimg { background: var(--c-dark, #1e2a36); }
        /* Tableaux dans le contenu d'article */
        .t4a-content table { width: 100%; border-collapse: collapse; margin: 32px 0; font-size: 15px; line-height: 1.55; border: 1px solid #e5e2db; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .t4a-content table thead { background: #1a1a1a; }
        .t4a-content table thead th { padding: 13px 16px; text-align: left; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; border: none; }
        .t4a-content table tbody td { padding: 12px 16px; border-bottom: 1px solid #eceae3; vertical-align: top; }
        .t4a-content table tbody tr:last-child td { border-bottom: none; }
        .t4a-content table tbody tr:nth-child(even) { background: #faf8f3; }
        .t4a-content table tbody tr:hover { background: #f3f0e8; }
        .t4a-content table p { margin: 0; }
        @media (max-width: 640px) { .t4a-content table { font-size: 13.5px; display: block; overflow-x: auto; } }
      `}} />

      <div className="t4a-page">
        <div className="t4a-header">
          <div className="t4a-header-inner">
            <div className="t4a-breadcrumb">
              <Link href="/">Accueil</Link>
              {article.category && <><span>›</span><Link href={`/${catSlug(article.category)}`}>{article.category}</Link></>}
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.title}</span>
            </div>
            {article.category && (
              <Link href={`/${catSlug(article.category)}`} className="t4a-cat">{article.category}</Link>
            )}
            <h1 className="t4a-h1">{article.title}</h1>
            <div className="t4a-accent" />
            {article.metaDescription && <p className="t4a-intro">{article.metaDescription}</p>}
            <div className="t4a-meta">
              <span>{fmt(article.publishedAt)}</span>
              {readTime && <><span className="t4a-meta-sep" /><span>{readTime} min de lecture</span></>}
            </div>
          </div>
        </div>

        {article.imageUrl && (
          <div className="t4a-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} className="t4a-img" />
          </div>
        )}

        <div className="t4a-body-wrap">
          <div className="t4a-content" dangerouslySetInnerHTML={{ __html: article.content }} />
          <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />
        </div>

        {related.length > 0 && (
          <section className="t4a-related">
            <div className="t4a-related-inner">
              <div className="t4a-related-head">
                <span className="t4a-related-label">Dans la même rubrique</span>
                <div className="t4a-related-rule" />
              </div>
              <div className="t4a-related-grid">
                {related.map(a => (
                  <article key={a.id} className="t4a-rel-card">
                    <div className="t4a-rel-img-wrap">
                      {a.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.imageUrl} alt={a.title} className="t4a-rel-img" />
                        : <div className="t4a-rel-img t4a-noimg" />
                      }
                    </div>
                    <div className="t4a-rel-body">
                      {a.category && <Link href={`/${catSlug(a.category)}`} className="t4a-rel-cat">{a.category}</Link>}
                      <div className="t4a-rel-title"><Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link></div>
                      <p className="t4a-rel-desc">{a.metaDescription || excerpt(a.content)}</p>
                      <div className="t4a-rel-meta">{fmt(a.publishedAt)}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
