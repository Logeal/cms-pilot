import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function excerpt(html: string, max = 130) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

function readTime(wc: number | null | undefined) {
  if (!wc) return null;
  return Math.ceil(wc / 200);
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
  publishedAt: Date | null; wordCount?: number | null;
  author?: string | null;
};

type Props = {
  category: string; label: string;
  articles: Article[];
  total: number; page: number; totalPages: number;
  seoIntro: string | null; seoH2: string | null;
  seoCol1Title: string | null; seoCol1Body: string | null;
  seoCol2Title: string | null; seoCol2Body: string | null;
  seoFaq: Array<{ q: string; a: string }> | null;
  hasSeoContent: boolean;
};

export function CategoryPageTheme6({
  category, label, articles, page, totalPages,
  seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent,
}: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);
  const cc = getCatColor(label);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t6c-page { background: var(--c-bg, #FAF8F4); color: #1C1C1A; font-family: var(--f-body, Georgia, serif); }

        /* HEADER */
        .t6c-header {
          background: #fff;
          border-bottom: 1px solid #EDE9E3;
          padding: 40px 40px 36px;
        }
        .t6c-header-inner { max-width: 1200px; margin: 0 auto; }
        .t6c-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #aaa;
          letter-spacing: 0.05em; margin-bottom: 20px;
          text-transform: uppercase;
        }
        .t6c-breadcrumb a { color: #aaa; text-decoration: none; }
        .t6c-breadcrumb a:hover { color: var(--c-terra, #C4603A); }
        .t6c-badge {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          padding: 4px 14px; border-radius: 20px;
          margin-bottom: 16px;
        }
        .t6c-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 700; color: #1C1C1A;
          line-height: 1.1; letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        .t6c-intro { font-size: 16px; color: #888; line-height: 1.65; max-width: 640px; }

        /* FEATURED */
        .t6c-featured-wrap { max-width: 1200px; margin: 32px auto 0; padding: 0 40px; }
        .t6c-featured {
          background: #fff;
          border-radius: 12px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          display: grid; grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 720px) { .t6c-featured { grid-template-columns: 1fr; } }
        .t6c-feat-img-wrap { overflow: hidden; }
        .t6c-feat-img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 240px; }
        .t6c-feat-placeholder {
          width: 100%; min-height: 280px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .t6c-stripe {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -45deg, transparent, transparent 8px,
            rgba(255,255,255,0.18) 8px, rgba(255,255,255,0.18) 9px
          );
        }
        .t6c-feat-placeholder-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .t6c-feat-body { padding: 36px 40px; display: flex; flex-direction: column; justify-content: center; }
        .t6c-feat-badge {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 12px;
          margin-bottom: 14px; align-self: flex-start;
        }
        .t6c-feat-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(20px, 2.4vw, 30px);
          font-weight: 700; line-height: 1.2; color: #1C1C1A;
          margin-bottom: 12px;
        }
        .t6c-feat-title a { color: inherit; text-decoration: none; }
        .t6c-feat-title a:hover { color: var(--c-terra, #C4603A); }
        .t6c-feat-desc {
          font-size: 15px; color: #666; line-height: 1.65;
          margin-bottom: 16px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t6c-feat-meta { font-family: var(--f-heading, sans-serif); font-size: 12px; color: #aaa; }

        /* GRID */
        .t6c-grid-wrap { max-width: 1200px; margin: 0 auto; padding: 40px 40px 64px; }
        .t6c-grid-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 28px;
        }
        .t6c-grid-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #aaa;
        }
        .t6c-grid-rule { flex: 1; height: 1px; background: #EDE9E3; }
        .t6c-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        @media (max-width: 900px) { .t6c-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t6c-grid { grid-template-columns: 1fr; } }

        .t6c-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
          display: flex; flex-direction: column;
          text-decoration: none;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t6c-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
        .t6c-card-img-wrap { aspect-ratio: 16/10; overflow: hidden; }
        .t6c-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t6c-card:hover .t6c-card-img { transform: scale(1.04); }
        .t6c-card-placeholder {
          aspect-ratio: 16/10;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .t6c-card-placeholder-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .t6c-card-body { padding: 16px 18px 18px; flex: 1; display: flex; flex-direction: column; }
        .t6c-card-badge {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 12px;
          display: inline-block; margin-bottom: 9px; align-self: flex-start;
        }
        .t6c-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 16px; font-weight: 700; line-height: 1.3;
          color: #1C1C1A; margin-bottom: 8px; flex: 1;
          transition: color 0.15s;
        }
        .t6c-card:hover .t6c-card-title { color: var(--c-terra, #C4603A); }
        .t6c-card-desc {
          font-size: 13px; color: #777; line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 10px;
        }
        .t6c-card-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: #aaa; }

        /* PAGINATION */
        .t6c-pager { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 40px 64px; }
        .t6c-pager a, .t6c-pager span { font-family: var(--f-heading, sans-serif); font-size: 13px; padding: 8px 16px; border-radius: 8px; text-decoration: none; }
        .t6c-pager a { background: #fff; border: 1px solid #EDE9E3; color: #555; transition: background 0.15s; }
        .t6c-pager a:hover { background: var(--c-terra, #C4603A); color: #fff; border-color: transparent; }
        .t6c-pager span { background: var(--c-terra, #C4603A); color: #fff; font-weight: 700; }

        /* SEO */
        .t6c-seo { max-width: 1200px; margin: 0 auto; padding: 0 40px 80px; }
        .t6c-seo-box { background: #fff; border-radius: 12px; padding: 40px 48px; border: 1px solid #EDE9E3; }
        .t6c-seo-intro { font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 32px; }
        .t6c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: 22px; font-weight: 700; color: #1C1C1A; margin-bottom: 20px; border-left: 3px solid var(--c-terra, #C4603A); padding-left: 14px; }
        .t6c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        @media (max-width: 720px) { .t6c-seo-cols { grid-template-columns: 1fr; } }
        .t6c-seo-col-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; color: #1C1C1A; margin-bottom: 10px; }
        .t6c-seo-col-body { font-size: 14px; line-height: 1.75; color: #666; }
        .t6c-seo-faq { margin-top: 32px; }
        .t6c-seo-faq-item { border-top: 1px solid #EDE9E3; padding: 18px 0; }
        .t6c-seo-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; color: #1C1C1A; margin-bottom: 8px; }
        .t6c-seo-faq-a { font-size: 14px; line-height: 1.7; color: #666; }
      `}} />

      <div className="t6c-page">
        <div className="t6c-header">
          <div className="t6c-header-inner">
            <div className="t6c-breadcrumb">
              <Link href="/">Accueil</Link>
              <span>›</span>
              <span style={{ color: "#555" }}>{label}</span>
            </div>
            <div className="t6c-badge" style={{ background: cc.badge, color: cc.badgeText }}>Rubrique</div>
            <h1 className="t6c-h1">{label}</h1>
            {seoIntro && <p className="t6c-intro">{seoIntro}</p>}
          </div>
        </div>

        {featured && (
          <div className="t6c-featured-wrap">
            <article className="t6c-featured">
              <div className="t6c-feat-img-wrap">
                {featured.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.imageUrl} alt={featured.title} className="t6c-feat-img" />
                  : (
                    <div className="t6c-feat-placeholder" style={{ background: cc.bg }}>
                      <div className="t6c-stripe" />
                      <span className="t6c-feat-placeholder-label" style={{ color: cc.text }}>{label.toUpperCase()}</span>
                    </div>
                  )
                }
              </div>
              <div className="t6c-feat-body">
                <span className="t6c-feat-badge" style={{ background: cc.badge, color: cc.badgeText }}>{label}</span>
                <div className="t6c-feat-title">
                  <Link href={`/${category}/${featured.slug}`}>{featured.title}</Link>
                </div>
                <p className="t6c-feat-desc">{featured.metaDescription || excerpt(featured.content)}</p>
                <div className="t6c-feat-meta">
                  {(featured as Article & { author?: string | null }).author && `${(featured as Article & { author?: string | null }).author} · `}
                  {readTime((featured as Article & { wordCount?: number | null }).wordCount)
                    ? `${readTime((featured as Article & { wordCount?: number | null }).wordCount)} min`
                    : fmt(featured.publishedAt)
                  }
                </div>
              </div>
            </article>
          </div>
        )}

        <div className="t6c-grid-wrap">
          {rest.length > 0 && (
            <>
              <div className="t6c-grid-head">
                <span className="t6c-grid-label">Tous les articles</span>
                <div className="t6c-grid-rule" />
              </div>
              <div className="t6c-grid">
                {rest.map(a => (
                  <Link key={a.id} href={`/${category}/${a.slug}`} className="t6c-card">
                    <div className="t6c-card-img-wrap">
                      {a.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.imageUrl} alt={a.title} className="t6c-card-img" />
                        : (
                          <div className="t6c-card-placeholder" style={{ background: cc.bg }}>
                            <div className="t6c-stripe" />
                            <span className="t6c-card-placeholder-label" style={{ color: cc.text }}>{label.toUpperCase()}</span>
                          </div>
                        )
                      }
                    </div>
                    <div className="t6c-card-body">
                      <span className="t6c-card-badge" style={{ background: cc.badge, color: cc.badgeText }}>{label}</span>
                      <div className="t6c-card-title">{a.title}</div>
                      <p className="t6c-card-desc">{a.metaDescription || excerpt(a.content)}</p>
                      <div className="t6c-card-meta">
                        {(a as Article & { author?: string | null }).author && `${(a as Article & { author?: string | null }).author} · `}
                        {readTime((a as Article & { wordCount?: number | null }).wordCount)
                          ? `${readTime((a as Article & { wordCount?: number | null }).wordCount)} min`
                          : fmt(a.publishedAt)
                        }
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="t6c-pager">
            {page > 1 && <Link href={`/${category}?page=${page - 1}`}>← Précédent</Link>}
            <span>{page} / {totalPages}</span>
            {page < totalPages && <Link href={`/${category}?page=${page + 1}`}>Suivant →</Link>}
          </div>
        )}

        {hasSeoContent && (
          <div className="t6c-seo">
            <div className="t6c-seo-box">
              {seoIntro && <p className="t6c-seo-intro">{seoIntro}</p>}
              {seoH2 && <h2 className="t6c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t6c-seo-cols">
                  {seoCol1Body && (
                    <div>
                      {seoCol1Title && <div className="t6c-seo-col-title">{seoCol1Title}</div>}
                      <p className="t6c-seo-col-body">{seoCol1Body}</p>
                    </div>
                  )}
                  {seoCol2Body && (
                    <div>
                      {seoCol2Title && <div className="t6c-seo-col-title">{seoCol2Title}</div>}
                      <p className="t6c-seo-col-body">{seoCol2Body}</p>
                    </div>
                  )}
                </div>
              )}
              {seoFaq && seoFaq.length > 0 && (
                <div className="t6c-seo-faq">
                  {seoFaq.map((item, i) => (
                    <div key={i} className="t6c-seo-faq-item">
                      <div className="t6c-seo-faq-q">{item.q}</div>
                      <p className="t6c-seo-faq-a">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
