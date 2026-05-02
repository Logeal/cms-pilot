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
  publishedAt: Date | null;
};

type HomeContent = {
  heroEyebrow: string; heroLine1: string; heroLine2: string;
  heroSub: string; heroCta: string;
  expertiseEyebrow: string; expertiseTitle: string;
};

type CategoryData = { slug: string; label: string; metaDescription: string | null; seoIntro: string | null; description: string | null; heroImage: string | null; bullets: unknown };

type Props = {
  home: HomeContent; heroImageUrl: string | null;
  expertiseCats: string[]; extraCats: string[];
  categoryHeroImages: Record<string, string>;
  totalArticles: number; totalCats: number;
  heroArt: Article | undefined; cardArts: Article[]; moreArts: Article[];
  categoriesData?: CategoryData[];
};

export function HomePageTheme11({ expertiseCats, extraCats, heroArt, cardArts, moreArts }: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const allArts = heroArt ? [heroArt, ...cardArts, ...moreArts] : [...cardArts, ...moreArts];

  // Articles par section
  const hero = allArts[0];
  const spotlight = allArts.slice(1, 4);   // 3 cartes sous le hero
  const latest = allArts.slice(4, 10);     // 6 articles récents

  // Grouper par catégorie
  const byCat: Record<string, Article[]> = {};
  allArts.forEach(a => {
    if (!a.category) return;
    if (!byCat[a.category]) byCat[a.category] = [];
    if (byCat[a.category].length < 5) byCat[a.category].push(a);
  });
  const catOrder = [
    ...allCats.filter(c => byCat[c]?.length),
    ...Object.keys(byCat).filter(c => !allCats.includes(c)),
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t11 { background: #fafaf8; color: #111; font-family: var(--f-body, Georgia, serif); }

        /* ── CONTENEUR ── */
        .t11-w { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        @media (max-width: 768px) { .t11-w { padding: 0 20px; } }

        /* ═══════════════════════════════════
           HERO — image droite, texte gauche
        ═══════════════════════════════════ */
        .t11-hero-section { padding: 48px 0 0; max-width: 1200px; margin: 0 auto; padding-left: 40px; padding-right: 40px; }
        @media (max-width: 768px) { .t11-hero-section { padding-left: 20px; padding-right: 20px; } }
        .t11-hero {
          display: grid; grid-template-columns: 5fr 4fr;
          min-height: 480px; overflow: hidden;
        }
        @media (max-width: 860px) { .t11-hero { grid-template-columns: 1fr; } }

        .t11-hero-left {
          background: #111; color: #fff;
          padding: 52px 56px;
          display: flex; flex-direction: column; justify-content: space-between;
          text-decoration: none; color: inherit;
          transition: background 0.2s;
        }
        .t11-hero-left:hover { background: #1a1a1a; }

        .t11-hero-tag {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a);
          display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
        }
        .t11-hero-tag::before { content: ''; width: 24px; height: 2px; background: var(--c-terra, #b85c3a); display: block; }

        .t11-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(26px, 3.2vw, 46px); font-weight: 700;
          line-height: 1.12; letter-spacing: -0.025em; color: #fff;
          margin-bottom: 20px; flex: 1;
        }
        .t11-hero-desc { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 28px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        .t11-hero-bottom { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .t11-hero-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: rgba(255,255,255,0.35); }
        .t11-hero-cta {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; border: 1px solid rgba(255,255,255,0.25);
          padding: 8px 16px; transition: border-color 0.15s, background 0.15s;
        }
        .t11-hero-left:hover .t11-hero-cta { border-color: #fff; background: rgba(255,255,255,0.08); }

        .t11-hero-right { overflow: hidden; position: relative; }
        .t11-hero-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; }
        .t11-hero-section:hover .t11-hero-img { transform: scale(1.04); }
        .t11-hero-img-empty { width: 100%; height: 100%; min-height: 320px; background: #e8e5e0; display: block; }

        /* ═══════════════════════════════════
           SPOTLIGHT — 3 cartes sous le hero
        ═══════════════════════════════════ */
        .t11-spotlight-section { padding: 16px 40px 0; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) { .t11-spotlight-section { padding-left: 20px; padding-right: 20px; } }
        .t11-spotlight {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; background: #ddd;
          border-top: 2px solid #ddd;
        }
        @media (max-width: 640px) { .t11-spotlight { grid-template-columns: 1fr; } }

        .t11-spot-card {
          background: #fff; text-decoration: none; display: flex; flex-direction: column;
          padding: 22px 24px;
          transition: background 0.15s;
        }
        .t11-spot-card:hover { background: #f5f5f3; }
        .t11-spot-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-terra, #b85c3a); margin-bottom: 8px; }
        .t11-spot-title { font-family: var(--f-display, Georgia, serif); font-size: 16px; font-weight: 700; line-height: 1.3; color: #111; flex: 1; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s; }
        .t11-spot-card:hover .t11-spot-title { color: var(--c-terra, #b85c3a); }
        .t11-spot-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #aaa; }

        /* ═══════════════════════════════════
           SECTION LABEL
        ═══════════════════════════════════ */
        .t11-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: #aaa; padding: 36px 0 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .t11-label::after { content: ''; flex: 1; height: 1px; background: #e8e8e8; }

        /* ═══════════════════════════════════
           LATEST — grille 3 colonnes
        ═══════════════════════════════════ */
        .t11-latest-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; background: #e8e8e8;
          border: 1px solid #e8e8e8;
        }
        @media (max-width: 860px) { .t11-latest-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .t11-latest-grid { grid-template-columns: 1fr; } }

        .t11-latest-card {
          background: #fff; text-decoration: none; display: flex; flex-direction: column;
          transition: background 0.15s;
        }
        .t11-latest-card:hover { background: #f8f8f6; }
        .t11-lc-img-wrap { overflow: hidden; }
        .t11-lc-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t11-latest-card:hover .t11-lc-img { transform: scale(1.05); }
        .t11-lc-img-empty { width: 100%; aspect-ratio: 16/9; background: #f0ede8; display: block; }
        .t11-lc-body { padding: 16px 18px 20px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
        .t11-lc-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-terra, #b85c3a); }
        .t11-lc-title { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; line-height: 1.3; color: #111; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s; }
        .t11-latest-card:hover .t11-lc-title { color: var(--c-terra, #b85c3a); }
        .t11-lc-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }

        /* ═══════════════════════════════════
           PAR CATÉGORIE — titre XXL + scroll horizontal
        ═══════════════════════════════════ */
        .t11-byrub-section { padding: 56px 0 0; max-width: 1200px; margin: 0 auto; }
        .t11-rub-block { margin-bottom: 56px; }

        .t11-rub-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; padding: 0 40px; margin-bottom: 20px;
          border-left: 4px solid var(--c-terra, #b85c3a); padding-left: 20px;
        }
        @media (max-width: 768px) { .t11-rub-head { padding-left: 16px; padding-right: 20px; } }

        .t11-rub-name {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(28px, 4vw, 52px); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1; color: #111;
        }
        .t11-rub-link {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #aaa; text-decoration: none; white-space: nowrap;
          transition: color 0.15s; padding-bottom: 4px;
        }
        .t11-rub-link:hover { color: #111; }

        /* Scroll horizontal */
        .t11-rub-scroll-wrap {
          overflow-x: auto; scrollbar-width: none;
          padding: 0 40px;
        }
        .t11-rub-scroll-wrap::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) { .t11-rub-scroll-wrap { padding: 0 20px; } }

        .t11-rub-row {
          display: flex; gap: 16px;
          width: max-content;
        }

        .t11-rub-card {
          width: 260px; flex-shrink: 0;
          text-decoration: none; display: flex; flex-direction: column;
          background: #fff;
          border: 1px solid #e8e8e8;
          transition: border-color 0.2s, transform 0.2s;
        }
        .t11-rub-card:hover { border-color: #bbb; transform: translateY(-2px); }
        .t11-rc-img-wrap { overflow: hidden; }
        .t11-rc-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t11-rub-card:hover .t11-rc-img { transform: scale(1.05); }
        .t11-rc-img-empty { width: 100%; aspect-ratio: 4/3; background: #f0ede8; display: block; }
        .t11-rc-body { padding: 14px 16px 18px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
        .t11-rc-title { font-family: var(--f-display, Georgia, serif); font-size: 14px; font-weight: 700; line-height: 1.3; color: #111; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s; }
        .t11-rub-card:hover .t11-rc-title { color: var(--c-terra, #b85c3a); }
        .t11-rc-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #bbb; }
      `}} />

      <div className="t11">

        {/* ═══ HERO ═══ */}
        {hero && (
          <div className="t11-hero-section">
            <div className="t11-hero">
              <Link href={`/${catSlug(hero.category)}/${hero.slug}`} className="t11-hero-left">
                <div>
                  <div className="t11-hero-tag">À la une{hero.category ? ` — ${hero.category}` : ""}</div>
                  <div className="t11-hero-title">{hero.title}</div>
                  <p className="t11-hero-desc">{hero.metaDescription || excerpt(hero.content)}</p>
                </div>
                <div className="t11-hero-bottom">
                  <span className="t11-hero-date">{fmt(hero.publishedAt)}</span>
                  <span className="t11-hero-cta">Lire l&apos;article →</span>
                </div>
              </Link>
              <div className="t11-hero-right">
                {hero.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={hero.imageUrl} alt={hero.title} className="t11-hero-img" />
                  : <div className="t11-hero-img-empty" />
                }
              </div>
            </div>
          </div>
        )}

        {/* ═══ SPOTLIGHT (3 cartes) ═══ */}
        {spotlight.length > 0 && (
          <div className="t11-spotlight-section">
            <div className="t11-spotlight">
              {spotlight.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t11-spot-card">
                  {a.category && <span className="t11-spot-cat">{a.category}</span>}
                  <div className="t11-spot-title">{a.title}</div>
                  <div className="t11-spot-date">{fmt(a.publishedAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ DERNIERS ARTICLES (grille 3 col) ═══ */}
        {latest.length > 0 && (
          <div className="t11-w">
            <div className="t11-label">Derniers articles</div>
            <div className="t11-latest-grid">
              {latest.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t11-latest-card">
                  <div className="t11-lc-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t11-lc-img" />
                      : <div className="t11-lc-img-empty" />
                    }
                  </div>
                  <div className="t11-lc-body">
                    {a.category && <span className="t11-lc-cat">{a.category}</span>}
                    <div className="t11-lc-title">{a.title}</div>
                    <div className="t11-lc-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PAR CATÉGORIE (scroll horizontal) ═══ */}
        {catOrder.length > 0 && (
          <div className="t11-byrub-section">
            {catOrder.map(cat => (
              <div key={cat} className="t11-rub-block">
                <div className="t11-rub-head">
                  <span className="t11-rub-name">{cat}</span>
                  <Link href={`/${catSlug(cat)}`} className="t11-rub-link">Voir tout →</Link>
                </div>
                <div className="t11-rub-scroll-wrap">
                  <div className="t11-rub-row">
                    {byCat[cat].map(a => (
                      <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t11-rub-card">
                        <div className="t11-rc-img-wrap">
                          {a.imageUrl
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={a.imageUrl} alt={a.title} className="t11-rc-img" />
                            : <div className="t11-rc-img-empty" />
                          }
                        </div>
                        <div className="t11-rc-body">
                          <div className="t11-rc-title">{a.title}</div>
                          <div className="t11-rc-date">{fmt(a.publishedAt)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
