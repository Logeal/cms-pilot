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
  id: string;
  title: string;
  slug: string;
  category: string | null;
  imageUrl: string | null;
  metaDescription: string | null;
  content: string;
  publishedAt: Date | null;
  wordCount: number | null;
};

type Props = {
  category: string;
  article: Article;
  related: Article[];
  articleUrl: string;
};
export function ArticlePageTheme3({ category, article, related, articleUrl }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t3a-page { background: #fff; color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* BREADCRUMB */
        .t3a-breadcrumb {
          border-bottom: 1px solid #e8e8e4;
          padding: 14px 40px;
        }
        .t3a-breadcrumb-inner {
          max-width: 860px; margin: 0 auto;
          display: flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #999;
          letter-spacing: 0.06em;
        }
        .t3a-breadcrumb-inner a { color: #999; text-decoration: none; }
        .t3a-breadcrumb-inner a:hover { color: #1a1a1a; }

        /* ARTICLE HEADER */
        .t3a-header { max-width: 860px; margin: 0 auto; padding: 56px 40px 40px; }

        .t3a-header-cat {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #fff; background: var(--c-terra, #b85c3a);
          padding: 5px 12px; margin-bottom: 24px;
          text-decoration: none;
        }
        .t3a-header-cat:hover { opacity: 0.85; }

        .t3a-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(30px, 4.5vw, 56px); font-weight: 700;
          line-height: 1.1; letter-spacing: -0.02em;
          color: #1a1a1a; margin-bottom: 24px;
        }

        /* Accent underline on H1 */
        .t3a-h1-underline {
          width: 60px; height: 4px;
          background: var(--c-terra, #b85c3a);
          margin-bottom: 28px;
        }

        .t3a-intro {
          font-size: 18px; color: #444; line-height: 1.65;
          font-style: italic; margin-bottom: 28px;
          border-left: 3px solid var(--c-terra, #b85c3a);
          padding-left: 20px;
        }

        .t3a-meta {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: #888;
          padding-bottom: 32px;
          border-bottom: 1px solid #e8e8e4;
        }
        .t3a-meta-sep { width: 3px; height: 3px; background: #ccc; border-radius: 50%; }

        /* HERO IMAGE — full width within container */
        .t3a-img-wrap {
          max-width: 860px; margin: 0 auto;
          padding: 0 40px 48px;
        }
        .t3a-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover;
          display: block; border-radius: 8px;
        }
        .t3a-img-caption {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #aaa;
          margin-top: 8px; text-align: right;
        }

        /* BODY */
        .t3a-body { max-width: 860px; margin: 0 auto; padding: 0 40px 64px; }
        .t3a-content {
          font-size: 17px; line-height: 1.8; color: #2a2a2a;
        }
        .t3a-content h2 {
          font-family: var(--f-display, Georgia, serif);
          font-size: 26px; font-weight: 700; margin: 48px 0 16px;
          padding-bottom: 10px; border-bottom: 1px solid #e8e8e4;
        }
        .t3a-content h3 {
          font-family: var(--f-display, Georgia, serif);
          font-size: 20px; font-weight: 700; margin: 36px 0 12px;
        }
        .t3a-content p { margin-bottom: 22px; }
        .t3a-content ul, .t3a-content ol { margin: 0 0 22px 24px; }
        .t3a-content li { margin-bottom: 8px; }
        .t3a-content strong { font-weight: 700; }
        .t3a-content a { color: var(--c-terra, #b85c3a); text-decoration: underline; }
        .t3a-content blockquote {
          border-left: 3px solid var(--c-terra, #b85c3a);
          padding: 16px 24px; margin: 28px 0;
          background: #fafaf8; font-style: italic;
          font-size: 18px; color: #444;
        }

        /* EXPERT BLOCK */
        .t3a-expert {
          max-width: 860px; margin: 0 auto 64px;
          padding: 32px 40px;
          background: #fafaf8;
          border: 1.5px solid #1a1a1a;
        }
        .t3a-expert-head {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 12px;
        }
        .t3a-expert-text {
          font-size: 15px; color: #555; line-height: 1.65;
        }

        /* RELATED */
        .t3a-related {
          background: #fafaf8;
          border-top: 2px solid #1a1a1a;
          padding: 64px 40px;
        }
        .t3a-related-inner { max-width: 1280px; margin: 0 auto; }
        .t3a-related-head {
          display: flex; align-items: center; gap: 16px; margin-bottom: 40px;
        }
        .t3a-related-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #1a1a1a; white-space: nowrap;
        }
        .t3a-related-rule { flex: 1; height: 1px; background: #1a1a1a; }
        .t3a-related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px 24px;
        }
        @media (max-width: 900px) { .t3a-related-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t3a-related-grid { grid-template-columns: 1fr; } }

        .t3a-rel-card { display: flex; flex-direction: column; }
        .t3a-rel-img-wrap { aspect-ratio: 16/10; overflow: hidden; margin-bottom: 14px; border-radius: 8px; }
        .t3a-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t3a-rel-card:hover .t3a-rel-img { transform: scale(1.04); }
        .t3a-rel-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          color: var(--c-terra, #b85c3a);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 8px; display: block; text-decoration: none;
        }
        .t3a-rel-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 17px; font-weight: 700; line-height: 1.3;
          color: #1a1a1a; margin-bottom: 8px;
        }
        .t3a-rel-title a { color: inherit; text-decoration: none; }
        .t3a-rel-title a:hover { text-decoration: underline; }
        .t3a-rel-desc {
          font-size: 13px; color: #666; line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
          flex: 1;
        }
        .t3a-rel-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #aaa; margin-top: 10px; }

        .t3a-noimg { background: #f0ede8; display: flex; align-items: center; justify-content: center; }
        .t3a-noimg-icon { font-size: 32px; opacity: 0.3; }
      `}} />

      <div className="t3a-page">

        {/* BREADCRUMB */}
        <div className="t3a-breadcrumb">
          <div className="t3a-breadcrumb-inner">
            <Link href="/">Accueil</Link>
            {article.category && (
              <>
                <span>›</span>
                <Link href={`/${catSlug(article.category)}`}>{article.category}</Link>
              </>
            )}
            <span>›</span>
            <span style={{ color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {article.title}
            </span>
          </div>
        </div>

        {/* ARTICLE HEADER */}
        <header className="t3a-header">
          {article.category && (
            <Link href={`/${catSlug(article.category)}`} className="t3a-header-cat">
              {article.category}
            </Link>
          )}
          <h1 className="t3a-h1">{article.title}</h1>
          <div className="t3a-h1-underline" />
          {article.metaDescription && (
            <p className="t3a-intro">{article.metaDescription}</p>
          )}
          <div className="t3a-meta">
            <span>{fmt(article.publishedAt)}</span>
            {readTime && (
              <>
                <span className="t3a-meta-sep" />
                <span>{readTime} min de lecture</span>
              </>
            )}
          </div>
        </header>

        {/* HERO IMAGE */}
        {article.imageUrl && (
          <div className="t3a-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} className="t3a-img" />
            {article.category && (
              <div className="t3a-img-caption">{article.category}</div>
            )}
          </div>
        )}

        {/* BODY */}
        <div className="t3a-body">
          <div
            className="t3a-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />
        </div>

        {/* EXPERT BLOCK */}
        <div className="t3a-expert">
          <div className="t3a-expert-head">Conseil d&apos;expert</div>
          <p className="t3a-expert-text">
            Cet article a été rédigé par nos experts pour vous aider à prendre les meilleures décisions.
            Consultez nos autres guides dans la rubrique{" "}
            {article.category && (
              <Link href={`/${catSlug(article.category)}`} style={{ color: "var(--c-terra, #b85c3a)" }}>
                {article.category}
              </Link>
            )}.
          </p>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="t3a-related">
            <div className="t3a-related-inner">
              <div className="t3a-related-head">
                <span className="t3a-related-label">Dans la même rubrique</span>
                <div className="t3a-related-rule" />
              </div>
              <div className="t3a-related-grid">
                {related.map(a => (
                  <article key={a.id} className="t3a-rel-card">
                    <div className="t3a-rel-img-wrap">
                      {a.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.imageUrl} alt={a.title} className="t3a-rel-img" />
                        : <div className="t3a-rel-img t3a-noimg"><span className="t3a-noimg-icon">🏠</span></div>
                      }
                    </div>
                    {a.category && (
                      <Link href={`/${catSlug(a.category)}`} className="t3a-rel-cat">{a.category}</Link>
                    )}
                    <div className="t3a-rel-title">
                      <Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link>
                    </div>
                    <p className="t3a-rel-desc">{a.metaDescription || excerpt(a.content)}</p>
                    <div className="t3a-rel-meta">{fmt(a.publishedAt)}</div>
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
