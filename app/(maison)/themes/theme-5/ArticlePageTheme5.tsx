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
export function ArticlePageTheme5({ category, article, related, articleUrl }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t5a-page { background: #f5f5f3; color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t5a-header { background: var(--c-dark, #0f1923); padding: 48px 40px 56px; }
        .t5a-header-inner { max-width: 1000px; margin: 0 auto; }
        .t5a-breadcrumb { display: flex; align-items: center; gap: 8px; font-family: var(--f-heading, sans-serif); font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.06em; margin-bottom: 28px; text-transform: uppercase; }
        .t5a-breadcrumb a { color: rgba(255,255,255,0.3); text-decoration: none; }
        .t5a-breadcrumb a:hover { color: rgba(255,255,255,0.7); }
        .t5a-tag { display: inline-block; font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; background: var(--c-terra, #b85c3a); color: #fff; padding: 4px 12px; margin-bottom: 20px; text-decoration: none; }
        .t5a-h1 { font-family: var(--f-display, Georgia, serif); font-size: clamp(26px, 4vw, 48px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: #fff; margin-bottom: 20px; }
        .t5a-accent { width: 44px; height: 3px; background: var(--c-terra, #b85c3a); margin-bottom: 20px; }
        .t5a-intro { font-size: 17px; color: rgba(255,255,255,0.6); line-height: 1.65; margin-bottom: 24px; }
        .t5a-meta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; font-family: var(--f-heading, sans-serif); font-size: 12px; color: rgba(255,255,255,0.35); }
        .t5a-meta-sep { width: 3px; height: 3px; background: rgba(255,255,255,0.2); border-radius: 50%; }

        /* HERO IMAGE */
        .t5a-img-wrap { max-width: 1000px; margin: -24px auto 0; padding: 0 40px; position: relative; z-index: 1; }
        .t5a-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; display: block; box-shadow: 0 8px 40px rgba(0,0,0,0.12); }

        /* BODY */
        .t5a-body-wrap { max-width: 1000px; margin: 0 auto; padding: 48px 40px 64px; }
        .t5a-content { font-size: 17px; line-height: 1.8; color: #2a2a2a; background: #fff; border-radius: 12px; padding: 52px 56px; border: 1px solid #e8e8e6; }
        @media (max-width: 640px) { .t5a-content { padding: 32px 24px; } }
        .t5a-content h2 { font-family: var(--f-display, Georgia, serif); font-size: 24px; font-weight: 700; margin: 44px 0 14px; color: #1a1a1a; border-left: 3px solid var(--c-terra, #b85c3a); padding-left: 16px; }
        .t5a-content h3 { font-family: var(--f-display, Georgia, serif); font-size: 19px; font-weight: 700; margin: 32px 0 10px; }
        .t5a-content p { margin-bottom: 20px; }
        .t5a-content ul, .t5a-content ol { margin: 0 0 20px 24px; }
        .t5a-content li { margin-bottom: 7px; }
        .t5a-content strong { font-weight: 700; }
        .t5a-content a { color: var(--c-terra, #b85c3a); text-decoration: underline; }
        .t5a-content blockquote { border-left: 3px solid var(--c-terra, #b85c3a); padding: 14px 20px; margin: 24px 0; background: #f8f6f3; font-style: italic; font-size: 17px; color: #444; border-radius: 0 6px 6px 0; }

        /* RELATED */
        .t5a-related { background: var(--c-dark, #0f1923); padding: 64px 40px; }
        .t5a-related-inner { max-width: 1200px; margin: 0 auto; }
        .t5a-related-head { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
        .t5a-related-label { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.4); white-space: nowrap; }
        .t5a-related-rule { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

        .t5a-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .t5a-related-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t5a-related-grid { grid-template-columns: 1fr; } }

        .t5a-rel-card { background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; transition: background 0.2s; }
        .t5a-rel-card:hover { background: rgba(255,255,255,0.08); }
        .t5a-rel-img-wrap { aspect-ratio: 16/10; overflow: hidden; }
        .t5a-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t5a-rel-card:hover .t5a-rel-img { transform: scale(1.04); }
        .t5a-rel-noimg { width: 100%; height: 100%; background: rgba(255,255,255,0.04); min-height: 100px; }
        .t5a-rel-body { padding: 16px 20px; flex: 1; display: flex; flex-direction: column; }
        .t5a-rel-cat { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; color: var(--c-terra, #b85c3a); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 7px; display: block; text-decoration: none; }
        .t5a-rel-title { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; line-height: 1.3; color: #fff; margin-bottom: 7px; flex: 1; }
        .t5a-rel-title a { color: inherit; text-decoration: none; }
        .t5a-rel-title a:hover { text-decoration: underline; }
        .t5a-rel-desc { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
        .t5a-rel-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(255,255,255,0.25); }
        /* Tableaux dans le contenu d'article */
        .t5a-content table { width: 100%; border-collapse: collapse; margin: 32px 0; font-size: 15px; line-height: 1.55; border: 1px solid #e5e2db; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .t5a-content table thead { background: #1a1a1a; }
        .t5a-content table thead th { padding: 13px 16px; text-align: left; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; border: none; }
        .t5a-content table tbody td { padding: 12px 16px; border-bottom: 1px solid #eceae3; vertical-align: top; }
        .t5a-content table tbody tr:last-child td { border-bottom: none; }
        .t5a-content table tbody tr:nth-child(even) { background: #faf8f3; }
        .t5a-content table tbody tr:hover { background: #f3f0e8; }
        .t5a-content table p { margin: 0; }
        @media (max-width: 640px) { .t5a-content table { font-size: 13.5px; display: block; overflow-x: auto; } }
      `}} />

      <div className="t5a-page">
        <div className="t5a-header">
          <div className="t5a-header-inner">
            <div className="t5a-breadcrumb">
              <Link href="/">Accueil</Link>
              {article.category && <><span>›</span><Link href={`/${catSlug(article.category)}`}>{article.category}</Link></>}
              <span>›</span>
              <span style={{ color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.title}</span>
            </div>
            {article.category && (
              <Link href={`/${catSlug(article.category)}`} className="t5a-tag">{article.category}</Link>
            )}
            <h1 className="t5a-h1">{article.title}</h1>
            <div className="t5a-accent" />
            {article.metaDescription && <p className="t5a-intro">{article.metaDescription}</p>}
            <div className="t5a-meta">
              <span>{fmt(article.publishedAt)}</span>
              {readTime && <><span className="t5a-meta-sep" /><span>{readTime} min de lecture</span></>}
            </div>
          </div>
        </div>

        {article.imageUrl && (
          <div className="t5a-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} className="t5a-img" />
          </div>
        )}

        <div className="t5a-body-wrap">
          <div className="t5a-content" dangerouslySetInnerHTML={{ __html: article.content }} />
          <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />
        </div>

        {related.length > 0 && (
          <section className="t5a-related">
            <div className="t5a-related-inner">
              <div className="t5a-related-head">
                <span className="t5a-related-label">Dans la même rubrique</span>
                <div className="t5a-related-rule" />
              </div>
              <div className="t5a-related-grid">
                {related.map(a => (
                  <article key={a.id} className="t5a-rel-card">
                    <div className="t5a-rel-img-wrap">
                      {a.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.imageUrl} alt={a.title} className="t5a-rel-img" />
                        : <div className="t5a-rel-noimg" />
                      }
                    </div>
                    <div className="t5a-rel-body">
                      {a.category && <Link href={`/${catSlug(a.category)}`} className="t5a-rel-cat">{a.category}</Link>}
                      <div className="t5a-rel-title"><Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link></div>
                      <p className="t5a-rel-desc">{a.metaDescription || excerpt(a.content)}</p>
                      <div className="t5a-rel-meta">{fmt(a.publishedAt)}</div>
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
