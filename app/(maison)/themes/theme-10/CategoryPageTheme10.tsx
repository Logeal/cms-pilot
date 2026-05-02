import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
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

type Props = {
  category: string; label: string; articles: Article[];
  total: number; page: number; totalPages: number;
  seoIntro: string | null; seoH2: string | null;
  seoCol1Title: string | null; seoCol1Body: string | null;
  seoCol2Title: string | null; seoCol2Body: string | null;
  seoFaq: Array<{ q: string; a: string }> | null;
  hasSeoContent: boolean;
};

export function CategoryPageTheme10({ category, label, articles, total, page, totalPages, seoIntro, seoH2, seoCol1Title, seoCol1Body, seoCol2Title, seoCol2Body, seoFaq, hasSeoContent }: Props) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t10c { background: #f7f5f2; color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* ── HEADER ── */
        .t10c-header-wrap { max-width: 1180px; margin: 0 auto; padding: 36px 32px 0; }
        .t10c-breadcrumb {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #b0a89a;
          display: flex; gap: 6px; align-items: center; margin-bottom: 24px;
        }
        .t10c-breadcrumb a { color: #b0a89a; text-decoration: none; transition: color 0.15s; }
        .t10c-breadcrumb a:hover { color: #1a1a1a; }
        .t10c-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fdf0ea; color: var(--c-terra, #b85c3a);
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 14px;
        }
        .t10c-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--c-terra, #b85c3a); display: block; }
        .t10c-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(32px, 5vw, 60px); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1; color: #1a1a1a;
          margin-bottom: 10px;
        }
        .t10c-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #b0a89a; margin-bottom: 6px;
        }
        .t10c-intro { font-size: 15px; color: #6b6560; line-height: 1.7; max-width: 600px; margin-top: 14px; }

        /* ── HERO CARD ── */
        .t10c-hero-wrap { max-width: 1180px; margin: 0 auto; padding: 28px 32px 0; }
        .t10c-hero {
          border-radius: 20px; overflow: hidden; background: #fff;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          display: grid; grid-template-columns: 3fr 2fr;
          text-decoration: none; color: inherit;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .t10c-hero:hover { box-shadow: 0 8px 48px rgba(0,0,0,0.13); transform: translateY(-2px); }
        @media (max-width: 820px) { .t10c-hero { grid-template-columns: 1fr; } }
        .t10c-hero-img-wrap { overflow: hidden; border-radius: 20px 0 0 20px; }
        @media (max-width: 820px) { .t10c-hero-img-wrap { border-radius: 20px 20px 0 0; } }
        .t10c-hero-img { width: 100%; height: 100%; min-height: 320px; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .t10c-hero:hover .t10c-hero-img { transform: scale(1.04); }
        .t10c-hero-img-empty { width: 100%; min-height: 320px; background: #ede9e3; display: block; }
        .t10c-hero-body { padding: 32px 28px; display: flex; flex-direction: column; gap: 12px; }
        .t10c-hero-kicker {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); display: flex; align-items: center; gap: 8px;
        }
        .t10c-hero-kicker::before { content: ''; width: 16px; height: 2px; background: currentColor; display: block; }
        .t10c-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(18px, 2vw, 28px); font-weight: 700; line-height: 1.2;
          letter-spacing: -0.02em; color: #1a1a1a;
        }
        .t10c-hero-desc { font-size: 14px; color: #6b6560; line-height: 1.75; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .t10c-hero-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; margin-top: auto; }
        .t10c-hero-cta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          color: var(--c-terra, #b85c3a);
        }

        /* ── GRILLE ARTICLES ── */
        .t10c-grid-wrap { max-width: 1180px; margin: 0 auto; padding: 20px 32px 0; }
        .t10c-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 860px) { .t10c-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .t10c-grid { grid-template-columns: 1fr; } }

        .t10c-card {
          border-radius: 16px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10c-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.11); transform: translateY(-2px); }
        .t10c-card-img-wrap { overflow: hidden; }
        .t10c-card-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t10c-card:hover .t10c-card-img { transform: scale(1.05); }
        .t10c-card-img-empty { width: 100%; aspect-ratio: 16/9; background: #ede9e3; display: block; }
        .t10c-card-body { padding: 16px 18px 20px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
        .t10c-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 15px; font-weight: 700; line-height: 1.3; color: #1a1a1a; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.15s;
        }
        .t10c-card:hover .t10c-card-title { color: var(--c-terra, #b85c3a); }
        .t10c-card-desc { font-size: 12px; color: #6b6560; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .t10c-card-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; }

        /* ── PAGINATION ── */
        .t10c-pagination { display: flex; justify-content: center; gap: 8px; padding: 36px 0; }
        .t10c-page-btn {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 40px; height: 40px; padding: 0 10px;
          font-family: var(--f-heading, sans-serif); font-size: 12px; font-weight: 600;
          text-decoration: none; color: #6b6560;
          background: #fff; border-radius: 100px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transition: box-shadow 0.15s, background 0.15s, color 0.15s;
        }
        .t10c-page-btn:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); color: #1a1a1a; }
        .t10c-page-btn.active { background: var(--c-terra, #b85c3a); color: #fff; box-shadow: 0 4px 16px rgba(184,92,58,0.3); }
        .t10c-page-btn.disabled { opacity: 0.3; pointer-events: none; }

        /* ── SEO ── */
        .t10c-seo-wrap { max-width: 1180px; margin: 0 auto; padding: 40px 32px 56px; }
        .t10c-seo-card {
          background: #fff; border-radius: 20px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06);
          padding: 36px 40px;
        }
        .t10c-seo-h2 { font-family: var(--f-display, Georgia, serif); font-size: clamp(20px, 2.5vw, 28px); font-weight: 700; letter-spacing: -0.02em; color: #1a1a1a; margin-bottom: 24px; }
        .t10c-seo-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px; }
        @media (max-width: 600px) { .t10c-seo-cols { grid-template-columns: 1fr; } }
        .t10c-seo-col-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
        .t10c-seo-col-body { font-size: 14px; color: #6b6560; line-height: 1.7; }
        .t10c-faq-item { border-top: 1px solid #ede9e3; padding: 18px 0; }
        .t10c-faq-q { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
        .t10c-faq-a { font-size: 14px; color: #6b6560; line-height: 1.7; }

        @media (max-width: 768px) {
          .t10c-header-wrap, .t10c-hero-wrap, .t10c-grid-wrap, .t10c-seo-wrap {
            padding-left: 16px; padding-right: 16px;
          }
          .t10c-seo-card { padding: 24px 20px; }
        }
      `}} />

      <div className="t10c">

        {/* ── HEADER ── */}
        <div className="t10c-header-wrap">
          <div className="t10c-breadcrumb">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span style={{ color: "#1a1a1a" }}>{label}</span>
          </div>
          <span className="t10c-pill">{label}</span>
          <h1 className="t10c-h1">{label}</h1>
          <div className="t10c-meta">{total} article{total > 1 ? "s" : ""}</div>
          {seoIntro && <p className="t10c-intro">{seoIntro}</p>}
        </div>

        {/* ── ARTICLE À LA UNE ── */}
        {featured && (
          <div className="t10c-hero-wrap">
            <Link href={`/${category}/${featured.slug}`} className="t10c-hero">
              <div className="t10c-hero-img-wrap">
                {featured.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.imageUrl} alt={featured.title} className="t10c-hero-img" />
                  : <div className="t10c-hero-img-empty" />
                }
              </div>
              <div className="t10c-hero-body">
                <div className="t10c-hero-kicker">À la une</div>
                <div className="t10c-hero-title">{featured.title}</div>
                <p className="t10c-hero-desc">{featured.metaDescription || excerpt(featured.content)}</p>
                <div className="t10c-hero-date">{fmt(featured.publishedAt)}</div>
                <span className="t10c-hero-cta">Lire l&apos;article →</span>
              </div>
            </Link>
          </div>
        )}

        {/* ── GRILLE ── */}
        {rest.length > 0 && (
          <div className="t10c-grid-wrap">
            <div className="t10c-grid">
              {rest.map(a => (
                <Link key={a.id} href={`/${category}/${a.slug}`} className="t10c-card">
                  <div className="t10c-card-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t10c-card-img" />
                      : <div className="t10c-card-img-empty" />
                    }
                  </div>
                  <div className="t10c-card-body">
                    <div className="t10c-card-title">{a.title}</div>
                    {a.metaDescription && <p className="t10c-card-desc">{a.metaDescription}</p>}
                    <div className="t10c-card-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="t10c-pagination">
                <Link href={page > 1 ? `/${category}?page=${page - 1}` : "#"} className={`t10c-page-btn${page <= 1 ? " disabled" : ""}`}>←</Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link key={p} href={`/${category}?page=${p}`} className={`t10c-page-btn${p === page ? " active" : ""}`}>{p}</Link>
                ))}
                <Link href={page < totalPages ? `/${category}?page=${page + 1}` : "#"} className={`t10c-page-btn${page >= totalPages ? " disabled" : ""}`}>→</Link>
              </div>
            )}
          </div>
        )}

        {/* ── SEO ── */}
        {hasSeoContent && (
          <div className="t10c-seo-wrap">
            <div className="t10c-seo-card">
              {seoH2 && <h2 className="t10c-seo-h2">{seoH2}</h2>}
              {(seoCol1Body || seoCol2Body) && (
                <div className="t10c-seo-cols">
                  {seoCol1Body && <div><div className="t10c-seo-col-title">{seoCol1Title}</div><p className="t10c-seo-col-body">{seoCol1Body}</p></div>}
                  {seoCol2Body && <div><div className="t10c-seo-col-title">{seoCol2Title}</div><p className="t10c-seo-col-body">{seoCol2Body}</p></div>}
                </div>
              )}
              {seoFaq?.map((item, i) => (
                <div key={i} className="t10c-faq-item">
                  <div className="t10c-faq-q">{item.q}</div>
                  <p className="t10c-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
