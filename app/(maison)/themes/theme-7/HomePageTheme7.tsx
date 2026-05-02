import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 110) {
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

export function HomePageTheme7({
  home, expertiseCats, extraCats, totalArticles, totalCats,
  heroArt, cardArts, moreArts, categoriesData = [], categoryHeroImages = {},
}: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const allArts = [heroArt, ...cardArts, ...moreArts].filter(Boolean) as Article[];

  // Hero : 1 grand + 5 en grille
  const gridArts = cardArts.slice(0, 5);

  // Sections par catégorie
  const allArticleCats = [...new Set(allArts.map(a => a.category).filter(Boolean))] as string[];
  const catOrder = allArticleCats.sort((a, b) => {
    const ia = allCats.indexOf(a); const ib = allCats.indexOf(b);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1; if (ib === -1) return -1;
    return ia - ib;
  });
  const grouped = catOrder.map(name => ({
    name, slug: catSlug(name),
    articles: allArts.filter(a => a.category === name),
  })).filter(g => g.articles.length > 0);

  // Rubriques éditoriales
  const showcaseCats = allCats.map(name => {
    const slug = catSlug(name);
    const meta = categoriesData.find(c => c.slug === slug);
    return {
      name, slug,
      description: meta?.description || meta?.seoIntro || meta?.metaDescription || null,
      image: meta?.heroImage || categoryHeroImages[slug] || null,
      bullets: Array.isArray(meta?.bullets) ? meta.bullets as string[] : null,
    };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t7 { background: #fafaf8; color: #1a1a1a; font-family: var(--f-body, Georgia, serif); }

        /* ════════════════════════════════
           HERO PLEIN ÉCRAN
        ════════════════════════════════ */
        .t7-hero {
          position: relative; width: 100%;
          aspect-ratio: 21/9; min-height: 420px; max-height: 640px;
          overflow: hidden; display: flex; align-items: flex-end;
          background: #111;
        }
        .t7-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
        .t7-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 35%, rgba(0,0,0,0.1) 80%);
        }
        .t7-hero-content {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto; width: 100%;
          padding: 0 48px 52px;
        }
        .t7-hero-tag {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          background: var(--c-terra, #c0563a); color: #fff;
          padding: 5px 12px; border-radius: 2px;
          margin-bottom: 18px; text-decoration: none;
        }
        .t7-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(28px, 4vw, 58px);
          font-weight: 800; line-height: 1.08;
          letter-spacing: -0.02em; color: #fff;
          max-width: 860px; margin-bottom: 18px;
        }
        .t7-hero-title a { color: inherit; text-decoration: none; }
        .t7-hero-title a:hover { color: rgba(255,255,255,0.8); }
        .t7-hero-desc {
          font-size: 16px; color: rgba(255,255,255,0.72); line-height: 1.6;
          max-width: 600px; margin-bottom: 24px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t7-hero-meta {
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: rgba(255,255,255,0.45);
          display: flex; align-items: center; gap: 10px;
        }
        .t7-hero-meta-sep { color: rgba(255,255,255,0.25); }

        /* ════════════════════════════════
           GRILLE 5 ARTICLES SOUS LE HERO
        ════════════════════════════════ */
        .t7-grid-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 0 40px;
          margin-top: -40px; position: relative; z-index: 2;
        }
        .t7-grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        @media (max-width: 1100px) { .t7-grid-5 { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px) { .t7-grid-5 { grid-template-columns: repeat(2, 1fr); } }

        .t7-card {
          background: #fff;
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          text-decoration: none;
          display: flex; flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .t7-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.11); }
        .t7-card-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .t7-card-img-empty { width: 100%; aspect-ratio: 4/3; background: #ede9e3; }
        .t7-card-body { padding: 14px 16px 18px; flex: 1; display: flex; flex-direction: column; }
        .t7-card-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--c-terra, #c0563a); margin-bottom: 7px;
        }
        .t7-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 14px; font-weight: 700; line-height: 1.32;
          color: #1a1a1a; flex: 1;
          transition: color 0.15s;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t7-card:hover .t7-card-title { color: var(--c-terra, #c0563a); }
        .t7-card-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: #a09880; margin-top: 8px;
        }

        /* ════════════════════════════════
           SÉPARATEUR SECTION
        ════════════════════════════════ */
        .t7-section-head {
          max-width: 1280px; margin: 0 auto;
          padding: 52px 40px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .t7-section-left { display: flex; align-items: center; gap: 14px; }
        .t7-section-bar {
          width: 4px; height: 28px; border-radius: 2px;
          background: var(--c-terra, #c0563a);
        }
        .t7-section-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 22px; font-weight: 800;
          letter-spacing: -0.01em; color: #1a1a1a;
        }
        .t7-section-count {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; color: #a09880;
        }
        .t7-section-link {
          font-family: var(--f-heading, sans-serif);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--c-terra, #c0563a); text-decoration: none;
          display: flex; align-items: center; gap: 5px;
          transition: gap 0.15s;
        }
        .t7-section-link:hover { gap: 9px; }

        /* ════════════════════════════════
           GRILLE ARTICLES PAR CAT
        ════════════════════════════════ */
        .t7-cat-grid {
          max-width: 1280px; margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1000px) { .t7-cat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .t7-cat-grid { grid-template-columns: 1fr; } }

        .t7-cat-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          box-shadow: 0 1px 10px rgba(0,0,0,0.06);
          text-decoration: none; display: flex; flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .t7-cat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(0,0,0,0.1); }
        .t7-cat-card-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .t7-cat-card-img-empty { width: 100%; aspect-ratio: 16/9; background: #ede9e3; }
        .t7-cat-card-body { padding: 16px 18px 20px; flex: 1; display: flex; flex-direction: column; }
        .t7-cat-card-tag {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--c-terra, #c0563a); margin-bottom: 8px;
        }
        .t7-cat-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 16px; font-weight: 700; line-height: 1.3;
          color: #1a1a1a; flex: 1; margin-bottom: 8px;
          transition: color 0.15s;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .t7-cat-card:hover .t7-cat-card-title { color: var(--c-terra, #c0563a); }
        .t7-cat-card-desc {
          font-size: 12px; color: #6e6657; line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 10px;
        }
        .t7-cat-card-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #a09880; }

        /* ════════════════════════════════
           BLOCS ÉDITORIAUX RUBRIQUES
        ════════════════════════════════ */
        .t7-rubrics-head {
          max-width: 1280px; margin: 0 auto;
          padding: 64px 40px 32px;
          display: flex; align-items: center; gap: 20px;
        }
        .t7-rubrics-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 22px; font-weight: 800;
          letter-spacing: -0.01em; color: #1a1a1a;
          white-space: nowrap;
        }
        .t7-rubrics-rule { flex: 1; height: 1px; background: #e0dcd6; }

        .t7-rubric {
          display: flex; align-items: stretch;
          max-width: 1280px; margin: 0 auto 2px;
          min-height: 400px;
        }
        .t7-rubric:nth-child(even) { flex-direction: row-reverse; }

        .t7-rubric-img {
          flex: 0 0 50%; position: relative; overflow: hidden;
          background: #ddd8d0;
        }
        .t7-rubric-img img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s ease;
        }
        .t7-rubric:hover .t7-rubric-img img { transform: scale(1.04); }
        .t7-rubric-img-num {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--f-display, Georgia, serif);
          font-size: 120px; font-weight: 800;
          color: rgba(255,255,255,0.15); line-height: 1;
          pointer-events: none;
        }

        .t7-rubric-body {
          flex: 0 0 50%;
          display: flex; flex-direction: column; justify-content: center;
          padding: 52px 60px;
          background: #fff;
        }
        .t7-rubric:nth-child(even) .t7-rubric-body { background: #fafaf8; }

        .t7-rubric-tag {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-terra, #c0563a); margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .t7-rubric-tag::after { content: ''; flex: 0 0 32px; height: 2px; background: var(--c-terra, #c0563a); }

        .t7-rubric-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(26px, 2.8vw, 38px);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -0.02em; color: #1a1a1a;
          margin-bottom: 16px;
        }
        .t7-rubric-desc {
          font-size: 15px; color: #5a5448; line-height: 1.75;
          margin-bottom: 24px; max-width: 440px;
        }
        .t7-rubric-bullets { list-style: none; margin-bottom: 32px; }
        .t7-rubric-bullet {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 13px; color: #1a1a1a; line-height: 1.5;
          padding: 9px 0; border-bottom: 1px solid #ede9e3;
        }
        .t7-rubric-bullet:last-child { border-bottom: none; }
        .t7-rubric-bullet::before {
          content: ''; flex-shrink: 0;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--c-terra, #c0563a);
          margin-top: 7px;
        }
        .t7-rubric-cta {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #fff; background: #1a1a1a;
          padding: 14px 28px; border-radius: 6px;
          text-decoration: none; align-self: flex-start;
          transition: background 0.2s;
        }
        .t7-rubric-cta:hover { background: var(--c-terra, #c0563a); }

        @media (max-width: 900px) {
          .t7-rubric, .t7-rubric:nth-child(even) { flex-direction: column; }
          .t7-rubric-img { flex: none; height: 260px; }
          .t7-rubric-body { padding: 36px 28px; }
        }

        /* ════════════════════════════════
           STATS BANDE
        ════════════════════════════════ */
        .t7-stats {
          background: #1a1a1a;
          padding: 52px 40px; margin-top: 80px;
        }
        .t7-stats-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: center;
          gap: 80px; flex-wrap: wrap; text-align: center;
        }
        .t7-stat-n {
          font-family: var(--f-display, Georgia, serif);
          font-size: 52px; font-weight: 800;
          color: #fff; display: block; line-height: 1;
        }
        .t7-stat-l {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); display: block; margin-top: 8px;
        }

        /* ════════════════════════════════
           FOOTER
        ════════════════════════════════ */
        .t7-footer {
          background: #1a1a1a;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 24px 40px;
          text-align: center;
          font-family: var(--f-heading, sans-serif);
          font-size: 12px; color: rgba(255,255,255,0.25);
          letter-spacing: 0.04em;
        }

        @media (max-width: 768px) {
          .t7-hero-content { padding: 0 24px 36px; }
          .t7-grid-wrap { padding: 0 16px; }
          .t7-section-head, .t7-cat-grid { padding-left: 16px; padding-right: 16px; }
          .t7-rubrics-head { padding-left: 16px; padding-right: 16px; }
        }
      `}} />

      <div className="t7">

        {/* ── HERO ── */}
        {heroArt && (
          <div className="t7-hero">
            {heroArt.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={heroArt.imageUrl} alt={heroArt.title} className="t7-hero-img" />
              : null
            }
            <div className="t7-hero-overlay" />
            <div className="t7-hero-content">
              {heroArt.category && (
                <Link href={`/${catSlug(heroArt.category)}`} className="t7-hero-tag">
                  {heroArt.category}
                </Link>
              )}
              <h1 className="t7-hero-title">
                <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`}>
                  {heroArt.title}
                </Link>
              </h1>
              <p className="t7-hero-desc">{heroArt.metaDescription || excerpt(heroArt.content, 180)}</p>
              <div className="t7-hero-meta">
                <span>{fmt(heroArt.publishedAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── GRILLE 5 ARTICLES ── */}
        {gridArts.length > 0 && (
          <div className="t7-grid-wrap">
            <div className="t7-grid-5">
              {gridArts.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t7-card">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t7-card-img" />
                    : <div className="t7-card-img-empty" />
                  }
                  <div className="t7-card-body">
                    {a.category && <div className="t7-card-cat">{a.category}</div>}
                    <div className="t7-card-title">{a.title}</div>
                    <div className="t7-card-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTIONS PAR CATÉGORIE ── */}
        {grouped.map(g => (
          <div key={g.slug}>
            <div className="t7-section-head">
              <div className="t7-section-left">
                <div className="t7-section-bar" />
                <span className="t7-section-title">{g.name}</span>
                <span className="t7-section-count">{g.articles.length} article{g.articles.length > 1 ? "s" : ""}</span>
              </div>
              <Link href={`/${g.slug}`} className="t7-section-link">Tout voir →</Link>
            </div>
            <div className="t7-cat-grid">
              {g.articles.slice(0, 4).map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t7-cat-card">
                  {a.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.imageUrl} alt={a.title} className="t7-cat-card-img" />
                    : <div className="t7-cat-card-img-empty" />
                  }
                  <div className="t7-cat-card-body">
                    {a.category && <div className="t7-cat-card-tag">{a.category}</div>}
                    <div className="t7-cat-card-title">{a.title}</div>
                    <p className="t7-cat-card-desc">{a.metaDescription || excerpt(a.content)}</p>
                    <div className="t7-cat-card-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* ── BLOCS ÉDITORIAUX RUBRIQUES ── */}
        {showcaseCats.length > 0 && (
          <>
            <div className="t7-rubrics-head">
              <span className="t7-rubrics-title">Nos rubriques</span>
              <div className="t7-rubrics-rule" />
            </div>
            {showcaseCats.map((c, i) => {
              const bullets: string[] = c.bullets ?? [
                "Guides pratiques et conseils d'experts",
                "Erreurs à éviter et bonnes pratiques",
                "Tendances et actualités du secteur",
                "Comparatifs et recommandations",
              ];
              return (
                <div key={c.slug} className="t7-rubric">
                  <div className="t7-rubric-img">
                    {c.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.image} alt={c.name} />
                      : <div className="t7-rubric-img-num">0{i + 1}</div>
                    }
                  </div>
                  <div className="t7-rubric-body">
                    <span className="t7-rubric-tag">{c.name}</span>
                    <h2 className="t7-rubric-title">Tout savoir sur<br />{c.name.toLowerCase()}</h2>
                    <p className="t7-rubric-desc">
                      {c.description || `Nos experts décryptent tous les aspects de ${c.name.toLowerCase()} pour vous aider à prendre les meilleures décisions.`}
                    </p>
                    <ul className="t7-rubric-bullets">
                      {bullets.map(b => <li key={b} className="t7-rubric-bullet">{b}</li>)}
                    </ul>
                    <Link href={`/${c.slug}`} className="t7-rubric-cta">
                      Explorer la rubrique →
                    </Link>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ── STATS ── */}
        <div className="t7-stats">
          <div className="t7-stats-inner">
            <div>
              <span className="t7-stat-n">{totalArticles}+</span>
              <span className="t7-stat-l">Articles publiés</span>
            </div>
            <div>
              <span className="t7-stat-n">{totalCats}</span>
              <span className="t7-stat-l">Rubriques</span>
            </div>
            <div>
              <span className="t7-stat-n">100%</span>
              <span className="t7-stat-l">Conseils d&apos;experts</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="t7-footer">
          © {new Date().getFullYear()} Maison &amp; Conseil — Tous vos conseils immobilier, décoration, jardin et maison
        </footer>

      </div>
    </>
  );
}
