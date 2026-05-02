import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 160) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

type Article = {
  id: string; title: string; slug: string;
  category: string | null; imageUrl: string | null;
  metaDescription: string | null; content: string;
  publishedAt: Date | null;
};

type HomeContent = {
  heroEyebrow: string; heroLine1: string; heroLine2: string;
  heroSub: string; heroCta: string;
  expertiseEyebrow: string; expertiseTitle: string;
};

type CategoryData = {
  slug: string; label: string;
  metaDescription: string | null; seoIntro: string | null;
  description: string | null; heroImage: string | null;
  bullets: unknown;
};

type Props = {
  home: HomeContent; heroImageUrl: string | null;
  expertiseCats: string[]; extraCats: string[];
  categoryHeroImages: Record<string, string>;
  totalArticles: number; totalCats: number;
  heroArt: Article | undefined; cardArts: Article[]; moreArts: Article[];
  categoriesData?: CategoryData[];
};

export function HomePageTheme8({ home, expertiseCats, extraCats, totalArticles, totalCats, heroArt, cardArts, categoriesData = [], categoryHeroImages = {} }: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const heroArticle = heroArt;
  const listArts = cardArts.slice(0, 8);

  const showcaseCats = allCats.map(name => {
    const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
    const meta = categoriesData.find(c => c.slug === slug);
    return {
      name, slug,
      description: meta?.description || meta?.seoIntro || meta?.metaDescription || null,
      image: meta?.heroImage || categoryHeroImages[slug] || null,
    };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .t8 {
          background: var(--c-cream);
          color: var(--c-dark);
          font-family: var(--f-body, Georgia, 'Times New Roman', serif);
        }

        /* ── NAV ── */
        .t8-nav {
          max-width: 900px; margin: 0 auto;
          padding: 32px 40px 0;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
        }
        .t8-nav-brand {
          font-family: var(--f-display, Georgia, serif);
          font-size: 15px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--c-dark); text-decoration: none;
        }
        .t8-nav-cats {
          display: flex; gap: 24px; flex-wrap: wrap;
        }
        .t8-nav-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--c-sand); text-decoration: none; transition: color 0.15s;
        }
        .t8-nav-cat:hover { color: var(--c-dark); }

        /* ── HERO ── */
        .t8-hero {
          max-width: 900px; margin: 0 auto;
          padding: 64px 40px 48px;
          border-bottom: 1px solid var(--c-border);
        }
        .t8-hero-eyebrow {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-sand); margin-bottom: 24px; display: block;
        }
        .t8-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(32px, 5vw, 68px); font-weight: 400;
          line-height: 1.1; letter-spacing: -0.02em; color: var(--c-dark);
          margin-bottom: 28px;
        }
        .t8-hero-title a { color: inherit; text-decoration: none; }
        .t8-hero-title a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
        .t8-hero-desc {
          font-size: 18px; color: var(--c-mid); line-height: 1.75;
          max-width: 600px; margin-bottom: 28px;
        }
        .t8-hero-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: var(--c-sand); display: flex; gap: 16px; align-items: center;
          margin-bottom: 28px;
        }
        .t8-hero-cat {
          font-weight: 700; color: var(--c-dark); text-transform: uppercase; letter-spacing: 0.1em;
          text-decoration: none;
        }
        .t8-hero-cat:hover { text-decoration: underline; }
        .t8-hero-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; border-radius: 6px; }
        .t8-hero-img-empty { width: 100%; aspect-ratio: 16/9; background: var(--c-cream-2); display: block; border-radius: 6px; }

        /* ── STATS bar ── */
        .t8-stats {
          max-width: 900px; margin: 0 auto;
          padding: 24px 40px;
          display: flex; gap: 48px; border-bottom: 1px solid #e8e8e8;
          flex-wrap: wrap;
        }
        .t8-stat { display: flex; flex-direction: column; }
        .t8-stat-n {
          font-family: var(--f-display, Georgia, serif);
          font-size: 28px; font-weight: 400; color: var(--c-dark); line-height: 1;
        }
        .t8-stat-l {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--c-sand); margin-top: 4px;
        }

        /* ── LISTE principale ── */
        .t8-list {
          max-width: 900px; margin: 0 auto; padding: 0 40px;
        }
        .t8-list-item {
          display: grid;
          grid-template-columns: 48px 1fr 180px;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid var(--c-border);
          text-decoration: none;
          align-items: center;
          transition: background 0.1s;
        }
        @media (max-width: 600px) { .t8-list-item { grid-template-columns: 32px 1fr; } .t8-list-item-thumb { display: none; } }
        .t8-list-item:hover .t8-list-item-title { text-decoration: underline; text-underline-offset: 3px; }

        .t8-list-item-num {
          font-family: var(--f-display, Georgia, serif);
          font-size: 13px; color: var(--c-border); font-weight: 400;
          padding-top: 4px; text-align: right;
        }
        .t8-list-item-body {}
        .t8-list-item-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 8px; display: block;
        }
        .t8-list-item-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(17px, 2vw, 22px); font-weight: 400;
          line-height: 1.3; color: var(--c-dark); margin-bottom: 10px;
        }
        .t8-list-item-desc {
          font-size: 14px; color: var(--c-mid); line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 10px;
        }
        .t8-list-item-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: var(--c-sand); display: flex; gap: 12px; align-items: center;
        }
        .t8-list-item-thumb { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; border-radius: 6px; }
        .t8-list-item-thumb-empty { width: 100%; aspect-ratio: 4/3; background: var(--c-cream-2); display: block; border-radius: 6px; }

        /* ── RUBRIQUES bento ── */
        .t8-cats {
          max-width: 900px; margin: 0 auto;
          padding: 56px 40px 48px;
          border-top: 1px solid var(--c-border);
        }
        .t8-cats-label { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-sand); margin-bottom: 24px; display: block; }
        .t8-bento { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .t8-bento-first { grid-column: 1 / -1; }
        @media (max-width: 600px) { .t8-bento { grid-template-columns: 1fr; } .t8-bento-first { grid-column: auto; } }

        .t8-cat-tile {
          position: relative; overflow: hidden;
          border-radius: 8px; display: block; text-decoration: none;
          background: var(--c-dark);
        }
        .t8-bento-first .t8-cat-tile { aspect-ratio: 21/9; }
        .t8-cat-tile:not(.t8-tile-sm) { aspect-ratio: 4/3; }
        .t8-cat-tile-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease; opacity: 0.65;
        }
        .t8-cat-tile:hover .t8-cat-tile-img { transform: scale(1.04); }
        .t8-cat-tile-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.05) 100%);
        }
        .t8-cat-tile-body {
          position: relative; z-index: 1;
          padding: 28px 32px;
          display: flex; flex-direction: column; justify-content: flex-end;
          height: 100%;
        }
        .t8-cat-tile-num { font-family: var(--f-heading, sans-serif); font-size: 10px; letter-spacing: 0.12em; color: rgba(255,255,255,0.4); margin-bottom: 8px; display: block; }
        .t8-cat-tile-name {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(22px, 3vw, 36px); font-weight: 400;
          color: #fff; line-height: 1.1; margin-bottom: 10px;
        }
        .t8-bento-first .t8-cat-tile-name { font-size: clamp(26px, 4vw, 48px); }
        .t8-cat-tile-desc {
          font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.6;
          margin-bottom: 14px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          max-width: 480px;
        }
        .t8-cat-tile-cta {
          font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: flex; align-items: center; gap: 6px;
          transition: color 0.15s, gap 0.15s;
        }
        .t8-cat-tile:hover .t8-cat-tile-cta { color: #fff; gap: 10px; }

        /* ── FOOTER ── */
        .t8-footer {
          max-width: 900px; margin: 0 auto;
          padding: 32px 40px;
          border-top: 1px solid var(--c-border);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .t8-footer-brand { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--c-dark); text-decoration: none; }
        .t8-footer-copy { font-family: var(--f-heading, sans-serif); font-size: 11px; color: var(--c-sand); }

        @media (max-width: 768px) {
          .t8-nav, .t8-hero, .t8-stats, .t8-list, .t8-secondary, .t8-cats, .t8-footer { padding-left: 20px; padding-right: 20px; }
        }
      `}} />

      <div className="t8">
        {/* ── HERO ── */}
        {heroArticle && (
          <section className="t8-hero">
            <span className="t8-hero-eyebrow">{home.heroEyebrow}</span>
            <h1 className="t8-hero-title">
              <Link href={`/${catSlug(heroArticle.category)}/${heroArticle.slug}`}>{heroArticle.title}</Link>
            </h1>
            <p className="t8-hero-desc">{heroArticle.metaDescription || excerpt(heroArticle.content, 200)}</p>
            <div className="t8-hero-meta">
              {heroArticle.category && (
                <Link href={`/${catSlug(heroArticle.category)}`} className="t8-hero-cat">{heroArticle.category}</Link>
              )}
              <span>—</span>
              <span>{fmt(heroArticle.publishedAt)}</span>
            </div>
            {heroArticle.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={heroArticle.imageUrl} alt={heroArticle.title} className="t8-hero-img" />
              : <div className="t8-hero-img-empty" />
            }
          </section>
        )}

        {/* ── STATS ── */}
        <div className="t8-stats">
          <div className="t8-stat">
            <span className="t8-stat-n">{totalArticles}</span>
            <span className="t8-stat-l">Articles</span>
          </div>
          <div className="t8-stat">
            <span className="t8-stat-n">{totalCats}</span>
            <span className="t8-stat-l">Rubriques</span>
          </div>
          <div className="t8-stat">
            <span className="t8-stat-n">100%</span>
            <span className="t8-stat-l">Expert</span>
          </div>
        </div>

        {/* ── LISTE ── */}
        <section className="t8-list">
          {listArts.map((a, i) => (
            <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t8-list-item">
              <span className="t8-list-item-num">{String(i + 1).padStart(2, "0")}</span>
              <div className="t8-list-item-body">
                {a.category && <span className="t8-list-item-cat">{a.category}</span>}
                <div className="t8-list-item-title">{a.title}</div>
                <div className="t8-list-item-desc">{a.metaDescription || excerpt(a.content)}</div>
                <div className="t8-list-item-meta">
                  <span>{fmt(a.publishedAt)}</span>
                </div>
              </div>
              {a.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={a.imageUrl} alt={a.title} className="t8-list-item-thumb" />
                : <div className="t8-list-item-thumb-empty" />
              }
            </Link>
          ))}
        </section>

        {/* ── RUBRIQUES bento ── */}
        {showcaseCats.length > 0 && (
          <section className="t8-cats">
            <span className="t8-cats-label">Nos rubriques</span>
            <div className="t8-bento">
              {showcaseCats.map((c, i) => (
                <div key={c.slug} className={i === 0 ? "t8-bento-first" : ""}>
                  <Link href={`/${c.slug}`} className="t8-cat-tile">
                    {c.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.image} alt={c.name} className="t8-cat-tile-img" />
                      : <div style={{ position: "absolute", inset: 0, background: `hsl(${i * 47 + 20}, 18%, 28%)` }} />
                    }
                    <div className="t8-cat-tile-overlay" />
                    <div className="t8-cat-tile-body">
                      <span className="t8-cat-tile-num">{String(i + 1).padStart(2, "0")}</span>
                      <div className="t8-cat-tile-name">{c.name}</div>
                      {c.description && <p className="t8-cat-tile-desc">{c.description}</p>}
                      <span className="t8-cat-tile-cta">Explorer →</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer className="t8-footer">
          <Link href="/" className="t8-footer-brand">{home.heroEyebrow}</Link>
          <span className="t8-footer-copy">© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </>
  );
}
