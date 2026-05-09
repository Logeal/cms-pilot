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

const CAT_COLORS: Record<number, { bg: string; text: string; badge: string; badgeText: string }> = {
  0: { bg: "#E8DDD0", text: "#8B6F5A", badge: "#D4B896", badgeText: "#6B4F3A" },
  1: { bg: "#C8D8C8", text: "#4A6B4A", badge: "#9EBF9E", badgeText: "#3A5A3A" },
  2: { bg: "#C8C0D8", text: "#5A4A6B", badge: "#A89EBF", badgeText: "#4A3A5A" },
  3: { bg: "#BDD0D8", text: "#3A5A6B", badge: "#8BB4C0", badgeText: "#2A4A5A" },
  4: { bg: "#D8C0C0", text: "#6B3A3A", badge: "#C89898", badgeText: "#5A2A2A" },
  5: { bg: "#C8D0C0", text: "#4A5A3A", badge: "#9AB49A", badgeText: "#3A4A2A" },
};

function getCatColor(name: string | null | undefined) {
  if (!name) return CAT_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 6;
  return CAT_COLORS[h];
}

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null; wordCount: number | null;
  author?: string | null;
};

type Props = { category: string; article: Article; related: Article[]; articleUrl: string };
export function ArticlePageTheme6({ category, article, related, articleUrl }: Props) {
  const readTime = article.wordCount ? Math.ceil(article.wordCount / 200) : null;
  const cc = getCatColor(article.category);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t6a-page { background: var(--c-bg, #FAF8F4); color: #1C1C1A; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t6a-header { background: #fff; border-bottom: 1px solid #EDE9E3; padding: 40px 40px 36px; }
        .t6a-header-inner { max-width: 800px; margin: 0 auto; }
        .t6a-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #aaa;
          letter-spacing: 0.05em; margin-bottom: 20px; text-transform: uppercase;
        }
        .t6a-breadcrumb a { color: #aaa; text-decoration: none; }
        .t6a-breadcrumb a:hover { color: var(--c-terra, #C4603A); }
        .t6a-badge {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          padding: 4px 14px; border-radius: 20px;
          margin-bottom: 18px; text-decoration: none;
        }
        .t6a-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(24px, 3.5vw, 42px);
          font-weight: 700; line-height: 1.15;
          letter-spacing: -0.02em; color: #1C1C1A;
          margin-bottom: 18px;
        }
        .t6a-intro {
          font-size: 17px; color: #777; line-height: 1.7;
          margin-bottom: 20px;
        }
        .t6a-meta {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: #aaa;
        }
        .t6a-meta strong { color: #666; }
        .t6a-meta-dot { width: 3px; height: 3px; background: #ddd; border-radius: 50%; display: inline-block; }

        /* HERO IMAGE */
        .t6a-img-wrap { max-width: 900px; margin: 32px auto 0; padding: 0 40px; }
        .t6a-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; display: block; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

        /* BODY */
        .t6a-body-wrap { max-width: 800px; margin: 0 auto; padding: 40px 40px 64px; }
        .t6a-content {
          font-size: 17px; line-height: 1.85; color: #2a2a2a;
          background: #fff; border-radius: 12px;
          padding: 48px 56px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
        }
        @media (max-width: 640px) { .t6a-content { padding: 28px 20px; } }
        .t6a-content h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 700; margin: 40px 0 14px; color: #1C1C1A; border-left: 3px solid var(--c-terra, #C4603A); padding-left: 14px; }
        .t6a-content h3 { font-family: var(--f-display, Georgia, serif); font-size: 18px; font-weight: 700; margin: 28px 0 10px; color: #1C1C1A; }
        .t6a-content p { margin-bottom: 20px; }
        .t6a-content ul, .t6a-content ol { margin: 0 0 20px 24px; }
        .t6a-content li { margin-bottom: 7px; }
        .t6a-content strong { font-weight: 700; }
        .t6a-content a { color: var(--c-terra, #C4603A); text-decoration: underline; }
        .t6a-content blockquote { border-left: 3px solid var(--c-terra, #C4603A); padding: 14px 20px; margin: 24px 0; background: var(--c-bg, #FAF8F4); font-style: italic; color: #555; border-radius: 0 8px 8px 0; }

        /* RELATED */
        .t6a-related { background: #fff; border-top: 1px solid #EDE9E3; padding: 56px 40px; }
        .t6a-related-inner { max-width: 1200px; margin: 0 auto; }
        .t6a-related-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 28px;
        }
        .t6a-related-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #aaa;
        }
        .t6a-related-rule { flex: 1; height: 1px; background: #EDE9E3; }
        .t6a-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .t6a-related-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t6a-related-grid { grid-template-columns: 1fr; } }

        .t6a-rel-card {
          background: var(--c-bg, #FAF8F4); border-radius: 10px; overflow: hidden;
          border: 1px solid #EDE9E3; display: flex; flex-direction: column;
          text-decoration: none;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t6a-rel-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .t6a-rel-img-wrap { aspect-ratio: 16/10; overflow: hidden; }
        .t6a-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t6a-rel-card:hover .t6a-rel-img { transform: scale(1.04); }
        .t6a-rel-placeholder {
          aspect-ratio: 16/10;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .t6a-stripe {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -45deg, transparent, transparent 8px,
            rgba(255,255,255,0.18) 8px, rgba(255,255,255,0.18) 9px
          );
        }
        .t6a-rel-placeholder-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .t6a-rel-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; }
        .t6a-rel-badge {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700;
          padding: 2px 8px; border-radius: 10px;
          display: inline-block; margin-bottom: 7px; align-self: flex-start;
        }
        .t6a-rel-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 14px; font-weight: 700; line-height: 1.3;
          color: #1C1C1A; margin-bottom: 7px; flex: 1;
          transition: color 0.15s;
        }
        .t6a-rel-card:hover .t6a-rel-title { color: var(--c-terra, #C4603A); }
        .t6a-rel-desc {
          font-size: 12px; color: #888; line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 8px;
        }
        .t6a-rel-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }
      `}} />

      <div className="t6a-page">
        <div className="t6a-header">
          <div className="t6a-header-inner">
            <div className="t6a-breadcrumb">
              <Link href="/">Accueil</Link>
              {article.category && (
                <><span>›</span><Link href={`/${catSlug(article.category)}`}>{article.category}</Link></>
              )}
              <span>›</span>
              <span style={{ color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {article.title}
              </span>
            </div>
            {article.category && (
              <Link href={`/${catSlug(article.category)}`} className="t6a-badge" style={{ background: cc.badge, color: cc.badgeText }}>
                {article.category}
              </Link>
            )}
            <h1 className="t6a-h1">{article.title}</h1>
            {article.metaDescription && <p className="t6a-intro">{article.metaDescription}</p>}
            <div className="t6a-meta">
              {(article as Article & { author?: string | null }).author && (
                <strong>{(article as Article & { author?: string | null }).author}</strong>
              )}
              {(article as Article & { author?: string | null }).author && <span className="t6a-meta-dot" />}
              <span>{fmt(article.publishedAt)}</span>
              {readTime && (
                <><span className="t6a-meta-dot" /><span>{readTime} min de lecture</span></>
              )}
            </div>
          </div>
        </div>

        {article.imageUrl && (
          <div className="t6a-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} className="t6a-img" />
          </div>
        )}

        <div className="t6a-body-wrap">
          <div className="t6a-content" dangerouslySetInnerHTML={{ __html: article.content }} />
          <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />
        </div>

        {related.length > 0 && (
          <section className="t6a-related">
            <div className="t6a-related-inner">
              <div className="t6a-related-head">
                <span className="t6a-related-label">Dans la même rubrique</span>
                <div className="t6a-related-rule" />
              </div>
              <div className="t6a-related-grid">
                {related.map(a => {
                  const rc = getCatColor(a.category);
                  return (
                    <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t6a-rel-card">
                      <div className="t6a-rel-img-wrap">
                        {a.imageUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={a.imageUrl} alt={a.title} className="t6a-rel-img" />
                          : (
                            <div className="t6a-rel-placeholder" style={{ background: rc.bg }}>
                              <div className="t6a-stripe" />
                              <span className="t6a-rel-placeholder-label" style={{ color: rc.text }}>
                                {a.category?.toUpperCase()}
                              </span>
                            </div>
                          )
                        }
                      </div>
                      <div className="t6a-rel-body">
                        {a.category && (
                          <span className="t6a-rel-badge" style={{ background: rc.badge, color: rc.badgeText }}>
                            {a.category}
                          </span>
                        )}
                        <div className="t6a-rel-title">{a.title}</div>
                        <p className="t6a-rel-desc">{a.metaDescription || excerpt(a.content)}</p>
                        <div className="t6a-rel-meta">{fmt(a.publishedAt)}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
