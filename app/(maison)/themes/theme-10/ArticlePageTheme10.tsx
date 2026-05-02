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

export function ArticlePageTheme10({ category, article, related }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t10a { background: #f7f5f2; color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* ── BREADCRUMB ── */
        .t10a-breadcrumb-wrap { max-width: 1000px; margin: 0 auto; padding: 28px 32px 0; }
        .t10a-breadcrumb {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #b0a89a;
          display: flex; gap: 6px; align-items: center; flex-wrap: wrap;
        }
        .t10a-breadcrumb a { color: #b0a89a; text-decoration: none; transition: color 0.15s; }
        .t10a-breadcrumb a:hover { color: #1a1a1a; }

        /* ── HEADER ── */
        .t10a-header-wrap { max-width: 1000px; margin: 0 auto; padding: 20px 32px 0; }
        .t10a-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fdf0ea; color: var(--c-terra, #b85c3a);
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; text-decoration: none;
          margin-bottom: 16px; transition: background 0.15s;
        }
        .t10a-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--c-terra, #b85c3a); display: block; }
        .t10a-pill:hover { background: #f9ddd0; }
        .t10a-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.15;
          letter-spacing: -0.025em; color: #1a1a1a; margin-bottom: 16px;
        }
        .t10a-intro { font-size: 17px; color: #6b6560; line-height: 1.75; margin-bottom: 18px; }
        .t10a-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #b0a89a;
          display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
        }
        .t10a-meta-sep { color: #d8d3cc; }

        /* ── IMAGE ── */
        .t10a-img-wrap { max-width: 1000px; margin: 0 auto; padding: 24px 32px 0; }
        .t10a-img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
          border-radius: 20px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.1);
        }
        .t10a-img-empty {
          width: 100%; aspect-ratio: 16/9; background: #ede9e3; display: block;
          border-radius: 20px;
        }

        /* ── CORPS ── */
        .t10a-body-wrap { max-width: 1000px; margin: 0 auto; padding: 32px 32px 0; }
        .t10a-body-card {
          background: #fff; border-radius: 20px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06);
          padding: 40px 48px;
        }
        @media (max-width: 600px) { .t10a-body-card { padding: 24px 20px; } }
        .t10a-body h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 36px 0 12px; }
        .t10a-body h3 { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 700; color: #1a1a1a; margin: 24px 0 10px; }
        .t10a-body p { font-size: 16px; line-height: 1.85; color: #3d3935; margin-bottom: 20px; }
        .t10a-body ul, .t10a-body ol { padding-left: 22px; margin-bottom: 20px; }
        .t10a-body li { font-size: 16px; line-height: 1.75; color: #3d3935; margin-bottom: 7px; }
        .t10a-body strong { font-weight: 700; color: #1a1a1a; }
        .t10a-body a { color: var(--c-terra, #b85c3a); }
        .t10a-body blockquote {
          border-left: 3px solid #fdf0ea; padding: 8px 24px; margin: 28px 0;
          background: #fdf9f7; border-radius: 0 12px 12px 0;
        }
        .t10a-body blockquote p { font-size: 18px; font-style: italic; color: #6b6560; margin: 0; }

        /* ── RELATED ── */
        .t10a-related-wrap { max-width: 1000px; margin: 0 auto; padding: 32px 32px 56px; }
        .t10a-related-title {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          color: #b0a89a; margin-bottom: 18px;
        }
        .t10a-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 640px) { .t10a-related-grid { grid-template-columns: 1fr; } }

        .t10a-rel-card {
          border-radius: 14px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 14px rgba(0,0,0,0.055);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10a-rel-card:hover { box-shadow: 0 5px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .t10a-rel-img-wrap { overflow: hidden; }
        .t10a-rel-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t10a-rel-card:hover .t10a-rel-img { transform: scale(1.05); }
        .t10a-rel-img-empty { width: 100%; aspect-ratio: 16/9; background: #ede9e3; display: block; }
        .t10a-rel-body { padding: 14px 16px 18px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .t10a-rel-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-terra, #b85c3a); }
        .t10a-rel-title { font-family: var(--f-display, Georgia, serif); font-size: 13px; font-weight: 700; line-height: 1.3; color: #1a1a1a; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s; }
        .t10a-rel-card:hover .t10a-rel-title { color: var(--c-terra, #b85c3a); }
        .t10a-rel-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; }

        @media (max-width: 768px) {
          .t10a-breadcrumb-wrap, .t10a-header-wrap, .t10a-img-wrap,
          .t10a-body-wrap, .t10a-related-wrap { padding-left: 16px; padding-right: 16px; }
        }
      `}} />

      <div className="t10a">

        {/* ── BREADCRUMB ── */}
        <div className="t10a-breadcrumb-wrap">
          <div className="t10a-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <Link href={`/${category}`}>{article.category ?? category}</Link>
            <span>›</span>
            <span style={{ color: "#1a1a1a" }}>{article.title}</span>
          </div>
        </div>

        {/* ── HEADER ── */}
        <div className="t10a-header-wrap">
          {article.category && (
            <Link href={`/${category}`} className="t10a-pill">{article.category}</Link>
          )}
          <h1 className="t10a-h1">{article.title}</h1>
          {article.metaDescription && <p className="t10a-intro">{article.metaDescription}</p>}
          <div className="t10a-meta">
            <span>{fmt(article.publishedAt)}</span>
            {readTime && <><span className="t10a-meta-sep">·</span><span>{readTime} min de lecture</span></>}
          </div>
        </div>

        {/* ── IMAGE ── */}
        <div className="t10a-img-wrap">
          {article.imageUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={article.imageUrl} alt={article.title} className="t10a-img" />
            : <div className="t10a-img-empty" />
          }
        </div>

        {/* ── CORPS ── */}
        <div className="t10a-body-wrap">
          <div className="t10a-body-card">
            <div className="t10a-body" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <div className="t10a-related-wrap">
            <div className="t10a-related-title">Dans la même rubrique</div>
            <div className="t10a-related-grid">
              {related.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t10a-rel-card">
                  <div className="t10a-rel-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t10a-rel-img" />
                      : <div className="t10a-rel-img-empty" />
                    }
                  </div>
                  <div className="t10a-rel-body">
                    {a.category && <span className="t10a-rel-cat">{a.category}</span>}
                    <div className="t10a-rel-title">{a.title}</div>
                    <div className="t10a-rel-date">{fmt(a.publishedAt)}</div>
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
