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
export function ArticlePageTheme9({ category, article, related }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t9a { background: #fff; color: #111; font-family: var(--f-body, Georgia, serif); }

        /* ── FIL D'ARIANE ── */
        .t9a-breadcrumb-wrap {
          max-width: 1100px; margin: 0 auto;
          padding: 20px 40px;
          border-bottom: 1px solid #e8e8e8;
        }
        .t9a-breadcrumb {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #bbb;
          display: flex; gap: 6px; align-items: center; flex-wrap: wrap;
        }
        .t9a-breadcrumb a { color: #bbb; text-decoration: none; transition: color 0.15s; }
        .t9a-breadcrumb a:hover { color: #111; }

        /* ── HEADER ARTICLE ── */
        .t9a-header {
          max-width: 1100px; margin: 0 auto;
          padding: 40px 40px 36px;
          border-bottom: 1px solid #e8e8e8;
        }
        .t9a-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .t9a-cat::after { content: ''; display: block; width: 24px; height: 1px; background: currentColor; }
        .t9a-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(26px, 3.5vw, 48px); font-weight: 700;
          line-height: 1.1; letter-spacing: -0.02em; color: #111;
          margin-bottom: 20px; max-width: 820px;
        }
        .t9a-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #bbb;
          display: flex; gap: 14px; align-items: center; flex-wrap: wrap;
        }
        .t9a-meta-sep { color: #ddd; }

        /* ── IMAGE ── */
        .t9a-img-wrap {
          max-width: 1100px; margin: 0 auto;
          padding: 32px 40px 0;
        }
        .t9a-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
        }
        .t9a-img-empty {
          width: 100%; aspect-ratio: 16/9; background: #f0ece6; display: block;
        }

        /* ── INTRO ── */
        .t9a-intro {
          max-width: 740px; margin: 0 auto;
          padding: 32px 40px 0;
        }
        .t9a-intro-text {
          font-size: 18px; color: #444; line-height: 1.75;
          padding-bottom: 28px; border-bottom: 1px solid #e8e8e8;
        }

        /* ── CORPS ── */
        .t9a-body {
          max-width: 740px; margin: 0 auto;
          padding: 36px 40px 64px;
        }
        .t9a-body h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 700; margin: 40px 0 14px; color: #111; }
        .t9a-body h3 { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 700; margin: 28px 0 10px; color: #111; }
        .t9a-body p { font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px; }
        .t9a-body ul, .t9a-body ol { padding-left: 24px; margin-bottom: 20px; }
        .t9a-body li { font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 8px; }
        .t9a-body strong { font-weight: 700; }
        .t9a-body a { color: var(--c-terra, #b85c3a); }
        .t9a-body blockquote { border-left: 3px solid #e8e8e8; padding: 4px 24px; margin: 28px 0; }
        .t9a-body blockquote p { font-size: 18px; font-style: italic; color: #555; margin: 0; }

        /* ── RELATED ── */
        .t9a-related {
          max-width: 1100px; margin: 0 auto;
          padding: 0 40px 56px;
          border-top: 1px solid #e8e8e8;
        }
        .t9a-related-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: #bbb; display: block; padding: 32px 0 24px;
        }
        .t9a-related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #e8e8e8;
          border: 1px solid #e8e8e8;
        }
        @media (max-width: 640px) { .t9a-related-grid { grid-template-columns: 1fr; } }

        .t9a-rel-card {
          text-decoration: none; display: flex; flex-direction: column;
          background: #fff;
        }
        .t9a-rel-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
          transition: opacity 0.2s;
        }
        .t9a-rel-card:hover .t9a-rel-img { opacity: 0.88; }
        .t9a-rel-img-empty {
          width: 100%; aspect-ratio: 16/9; background: #f0ece6; display: block;
        }
        .t9a-rel-body { padding: 16px 18px 20px; flex: 1; display: flex; flex-direction: column; }
        .t9a-rel-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 7px;
        }
        .t9a-rel-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 15px; font-weight: 700; line-height: 1.3; color: #111; flex: 1;
          transition: color 0.15s;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t9a-rel-card:hover .t9a-rel-title { color: var(--c-terra, #b85c3a); }
        .t9a-rel-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #bbb; margin-top: 8px;
        }

        @media (max-width: 768px) {
          .t9a-breadcrumb-wrap, .t9a-header, .t9a-img-wrap, .t9a-intro, .t9a-body, .t9a-related {
            padding-left: 20px; padding-right: 20px;
          }
        }
      `}} />

      <div className="t9a">

        {/* ── FIL D'ARIANE ── */}
        <div className="t9a-breadcrumb-wrap">
          <div className="t9a-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <Link href={`/${category}`}>{article.category ?? category}</Link>
            <span>›</span>
            <span style={{ color: "#111" }}>{article.title}</span>
          </div>
        </div>

        {/* ── HEADER ── */}
        <header className="t9a-header">
          {article.category && (
            <Link href={`/${category}`} className="t9a-cat">{article.category}</Link>
          )}
          <h1 className="t9a-h1">{article.title}</h1>
          <div className="t9a-meta">
            <span>{fmt(article.publishedAt)}</span>
            {readTime && <><span className="t9a-meta-sep">·</span><span>{readTime} min de lecture</span></>}
          </div>
        </header>

        {/* ── IMAGE ── */}
        <div className="t9a-img-wrap">
          {article.imageUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={article.imageUrl} alt={article.title} className="t9a-img" />
            : <div className="t9a-img-empty" />
          }
        </div>

        {/* ── INTRO ── */}
        {article.metaDescription && (
          <div className="t9a-intro">
            <p className="t9a-intro-text">{article.metaDescription}</p>
          </div>
        )}

        {/* ── CORPS ── */}
        <div className="t9a-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <div className="t9a-related">
            <span className="t9a-related-label">Dans la même rubrique</span>
            <div className="t9a-related-grid">
              {related.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t9a-rel-card">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t9a-rel-img" />
                    : <div className="t9a-rel-img-empty" />
                  }
                  <div className="t9a-rel-body">
                    {a.category && <span className="t9a-rel-cat">{a.category}</span>}
                    <div className="t9a-rel-title">{a.title}</div>
                    <div className="t9a-rel-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
