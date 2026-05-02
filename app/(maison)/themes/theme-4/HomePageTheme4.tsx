import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
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
  slug: string;
  label: string;
  metaDescription: string | null;
  seoIntro: string | null;
  description: string | null;
  heroImage: string | null;
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

export function HomePageTheme4({ home, expertiseCats, extraCats, totalArticles, totalCats, heroArt, cardArts, moreArts, categoriesData = [], categoryHeroImages = {} }: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const featured = heroArt ? [heroArt, ...cardArts.slice(0, 5)] : cardArts.slice(0, 6);
  const bigArt = featured[0];
  const listArts = featured.slice(1);
  // cardArts = 10 articles, les 5 premiers sont dans listArts → les 5 restants + 5 de moreArts = 10
  const latestArts = [...cardArts.slice(5), ...moreArts.slice(0, 5)].slice(0, 10);
  // Toutes les catégories avec données enrichies + image héro
  const showcaseCats = allCats.map(name => {
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
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
        .t4-page { background: var(--c-cream-2, #f4f4f2); color: var(--c-dark); font-family: var(--f-body, Georgia, serif); }

        /* ══════════════════════════════════════
           SECTION PRINCIPALE — spotlight + liste
        ══════════════════════════════════════ */
        .t4-spotlight-wrap {
          max-width: 1280px; margin: 0 auto; padding: 40px 40px 0;
        }
        .t4-spotlight-head {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .t4-spotlight-label {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-dark); white-space: nowrap;
        }
        .t4-spotlight-rule { flex: 1; height: 1px; background: var(--c-border, #d8d5d0); }
        .t4-spotlight-count {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: var(--c-sand); white-space: nowrap;
        }

        .t4-spotlight {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1px;
          background: var(--c-border, #d8d5d0);
          border: 1px solid var(--c-border, #d8d5d0);
          border-radius: 10px;
          overflow: hidden;
        }
        @media (max-width: 900px) { .t4-spotlight { grid-template-columns: 1fr; } }

        /* Grand article — image + overlay */
        .t4-big {
          position: relative; overflow: hidden;
          min-height: 520px; display: flex; flex-direction: column; justify-content: flex-end;
          background: var(--c-dark);
        }
        .t4-big-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .t4-big-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,16,24,0.88) 40%, rgba(10,16,24,0.1) 100%);
        }
        .t4-big-body { position: relative; z-index: 1; padding: 36px 36px; }
        .t4-big-cat {
          display: inline-block;
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #fff; background: var(--c-terra, #b85c3a);
          padding: 4px 10px; margin-bottom: 16px;
          text-decoration: none;
        }
        .t4-big-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(24px, 2.8vw, 38px); font-weight: 700;
          line-height: 1.15; color: #fff; margin-bottom: 12px;
        }
        .t4-big-title a { color: inherit; text-decoration: none; }
        .t4-big-title a:hover { text-decoration: underline; }
        .t4-big-desc { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t4-big-meta { font-family: var(--f-heading, sans-serif); font-size: 11px; color: rgba(255,255,255,0.4); }
        .t4-big-noimg { background: var(--c-dark, #0f1923); }

        /* Liste 5 articles */
        .t4-list-panel {
          background: var(--c-cream);
          display: flex; flex-direction: column;
        }
        .t4-list-item {
          flex: 0 0 20%; display: flex; flex-direction: column; justify-content: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--c-border);
          text-decoration: none;
          transition: background 0.12s;
          position: relative;
        }
        .t4-list-item:last-child { border-bottom: none; }
        .t4-list-item:hover { background: var(--c-cream-2); }
        .t4-list-item:hover .t4-list-title { color: var(--c-terra, #b85c3a); }

        .t4-list-top {
          display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
        }
        .t4-list-num {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          color: var(--c-border); flex-shrink: 0;
        }
        .t4-list-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700;
          color: var(--c-terra, #b85c3a);
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .t4-list-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 15px; font-weight: 700; line-height: 1.3;
          color: var(--c-dark); margin-bottom: 6px;
          transition: color 0.15s;
        }
        .t4-list-desc {
          font-size: 12px; color: var(--c-mid); line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .t4-list-date {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; color: var(--c-sand); margin-top: 8px;
        }
        .t4-list-arrow {
          position: absolute; right: 20px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; color: var(--c-border);
          transition: color 0.15s;
        }
        .t4-list-item:hover .t4-list-arrow { color: var(--c-terra, #b85c3a); }

        /* ══════════════════════════════════════
           DERNIERS ARTICLES — grille 5 colonnes
        ══════════════════════════════════════ */
        .t4-latest-wrap { max-width: 1280px; margin: 0 auto; padding: 56px 40px 0; }
        .t4-latest-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .t4-latest-title { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-dark); }
        .t4-latest-count { font-family: var(--f-heading, sans-serif); font-size: 11px; color: var(--c-sand); }

        .t4-latest-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        @media (max-width: 1100px) { .t4-latest-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px) { .t4-latest-grid { grid-template-columns: repeat(2, 1fr); } }

        .t4-latest-card {
          background: var(--c-cream); border-radius: 8px; overflow: hidden;
          border: 1px solid var(--c-border, #e8e5e0);
          display: flex; flex-direction: column;
          text-decoration: none;
          transition: box-shadow 0.2s;
        }
        .t4-latest-card:hover { box-shadow: 0 3px 16px rgba(0,0,0,0.08); }
        .t4-latest-card:hover .t4-latest-card-title { color: var(--c-terra, #b85c3a); }

        .t4-latest-card-img-wrap { aspect-ratio: 4/3; overflow: hidden; }
        .t4-latest-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .t4-latest-card:hover .t4-latest-card-img { transform: scale(1.05); }
        .t4-latest-card-img-empty { aspect-ratio: 4/3; background: var(--c-cream-2); }

        .t4-latest-card-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; }
        .t4-latest-card-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; color: var(--c-terra, #b85c3a); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
        .t4-latest-card-title { font-family: var(--f-display, Georgia, serif); font-size: 13px; font-weight: 700; line-height: 1.35; color: var(--c-dark); transition: color 0.15s; margin-bottom: 6px; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t4-latest-card-desc { font-size: 11px; color: var(--c-mid); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; }
        .t4-latest-card-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: var(--c-sand); }

        /* ══════════════════════════════════════
           NOS RUBRIQUES — sections éditoriales alternées
        ══════════════════════════════════════ */
        .t4-rubrics { margin-top: 64px; }
        .t4-rubrics-head { max-width: 1280px; margin: 0 auto; padding: 0 40px 28px; display: flex; align-items: center; gap: 16px; }
        .t4-rubrics-label { font-family: var(--f-heading, sans-serif); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-dark); white-space: nowrap; }
        .t4-rubrics-rule { flex: 1; height: 1px; background: var(--c-border, #d8d5d0); }

        .t4-editorial-list { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
        .t4-editorial { display: flex; min-height: 460px; }
        .t4-editorial:nth-child(even) { flex-direction: row-reverse; }
        .t4-editorial-img-wrap { flex: 0 0 50%; position: relative; overflow: hidden; background: var(--c-sand-light, #e8e0d4); }
        .t4-editorial-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .t4-editorial:hover .t4-editorial-img { transform: scale(1.03); }
        .t4-editorial-img-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: var(--c-sand-light, #ede8e0); }
        .t4-editorial-img-placeholder-num { font-family: var(--f-display, Georgia, serif); font-size: 120px; font-weight: 700; color: var(--c-border, #d8d5d0); line-height: 1; }

        .t4-editorial-body {
          flex: 0 0 50%; display: flex; flex-direction: column; justify-content: center;
          padding: 56px 64px;
          background: var(--c-cream, #faf8f4);
        }
        .t4-editorial:nth-child(odd) .t4-editorial-body { background: var(--c-cream, #faf8f4); }
        .t4-editorial:nth-child(even) .t4-editorial-body { background: var(--c-bg, #fff); }

        .t4-editorial-eyebrow {
          font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); margin-bottom: 14px;
        }
        .t4-editorial-title {
          font-family: var(--f-display, Georgia, serif); font-size: 36px; font-weight: 700;
          color: var(--c-dark); line-height: 1.15; margin-bottom: 18px;
        }
        .t4-editorial-desc {
          font-size: 15px; color: var(--c-mid); line-height: 1.75;
          max-width: 460px; margin-bottom: 24px;
        }
        .t4-editorial-bullets { list-style: none; margin-bottom: 32px; display: flex; flex-direction: column; gap: 0; }
        .t4-editorial-bullet {
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; color: var(--c-dark);
          padding: 10px 0; border-bottom: 1px solid var(--c-border, #e8e5e0);
        }
        .t4-editorial-bullet::before {
          content: ""; width: 6px; height: 6px; border-radius: 50%;
          background: var(--c-terra, #b85c3a); flex-shrink: 0;
        }
        .t4-editorial-cta {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-heading, sans-serif); font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; background: var(--c-dark);
          padding: 14px 28px; border-radius: 4px; text-decoration: none;
          transition: background 0.2s; align-self: flex-start;
        }
        .t4-editorial-cta:hover { background: var(--c-terra, #b85c3a); }

        @media (max-width: 900px) {
          .t4-editorial, .t4-editorial:nth-child(even) { flex-direction: column; }
          .t4-editorial-img-wrap { flex: none; height: 260px; }
          .t4-editorial-body { padding: 36px 28px; }
          .t4-editorial-title { font-size: 28px; }
        }

        /* ══════════════════════════════════════
           RUBRIQUES BAR
        ══════════════════════════════════════ */
        .t4-cats-bar { background: var(--c-dark, #0f1923); padding: 28px 40px; margin-top: 56px; }
        .t4-cats-bar-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .t4-cats-bar-label { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-right: 8px; white-space: nowrap; }
        .t4-cat-pill { display: inline-block; text-decoration: none; font-family: var(--f-heading, sans-serif); font-size: 12px; font-weight: 600; color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 100px; padding: 6px 16px; transition: background 0.15s, color 0.15s, border-color 0.15s; }
        .t4-cat-pill:hover { background: var(--c-terra, #b85c3a); border-color: var(--c-terra, #b85c3a); color: #fff; }

        /* ══════════════════════════════════════
           STATS
        ══════════════════════════════════════ */
        .t4-stats { background: var(--c-cream-2, #f4f4f2); padding: 48px 40px; border-top: 1px solid var(--c-border, #e0deda); }
        .t4-stats-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 80px; flex-wrap: wrap; }
        .t4-stat { text-align: center; }
        .t4-stat-n { font-family: var(--f-display, Georgia, serif); font-size: 44px; font-weight: 700; color: var(--c-dark, #0f1923); display: block; line-height: 1; }
        .t4-stat-l { font-family: var(--f-heading, sans-serif); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-sand); margin-top: 8px; display: block; }

        /* ══════════════════════════════════════
           FOOTER
        ══════════════════════════════════════ */
        .t4-footer { background: var(--c-dark, #0f1923); color: rgba(255,255,255,0.35); text-align: center; padding: 28px 40px; font-family: var(--f-heading, sans-serif); font-size: 12px; }

        .t4-noimg { background: var(--c-cream-2); display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
        .t4-noimg-icon { font-size: 24px; opacity: 0.2; }
      `}} />

      <div className="t4-page">

        {/* ── SPOTLIGHT : 1 grand + 5 en liste ── */}
        <div className="t4-spotlight-wrap">
          <div className="t4-spotlight-head">
            <span className="t4-spotlight-label">Sélection de la rédaction</span>
            <div className="t4-spotlight-rule" />
            <span className="t4-spotlight-count">6 articles</span>
          </div>
          <div className="t4-spotlight">

            {/* Grand article */}
            {bigArt && (
              <div className="t4-big">
                {bigArt.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={bigArt.imageUrl} alt={bigArt.title} className="t4-big-img" />
                  : <div className="t4-big-img t4-big-noimg" />
                }
                <div className="t4-big-overlay" />
                <div className="t4-big-body">
                  {bigArt.category && (
                    <Link href={`/${catSlug(bigArt.category)}`} className="t4-big-cat">{bigArt.category}</Link>
                  )}
                  <h2 className="t4-big-title">
                    <Link href={`/${catSlug(bigArt.category)}/${bigArt.slug}`}>{bigArt.title}</Link>
                  </h2>
                  <p className="t4-big-desc">{bigArt.metaDescription || excerpt(bigArt.content, 160)}</p>
                  <div className="t4-big-meta">{fmt(bigArt.publishedAt)}</div>
                </div>
              </div>
            )}

            {/* Liste 5 articles */}
            <div className="t4-list-panel">
              {listArts.map((a, i) => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t4-list-item">
                  <div className="t4-list-top">
                    <span className="t4-list-num">0{i + 2}</span>
                    {a.category && <span className="t4-list-cat">{a.category}</span>}
                  </div>
                  <div className="t4-list-title">{a.title}</div>
                  <div className="t4-list-desc">{a.metaDescription || excerpt(a.content)}</div>
                  <div className="t4-list-date">{fmt(a.publishedAt)}</div>
                  <span className="t4-list-arrow">→</span>
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* ── DERNIERS ARTICLES — 10 cards ── */}
        {latestArts.length > 0 && (
          <div className="t4-latest-wrap">
            <div className="t4-latest-head">
              <span className="t4-latest-title">Derniers articles</span>
              <span className="t4-latest-count">{latestArts.length} articles</span>
            </div>
            <div className="t4-latest-grid">
              {latestArts.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t4-latest-card">
                  <div className="t4-latest-card-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t4-latest-card-img" />
                      : <div className="t4-latest-card-img-empty" />
                    }
                  </div>
                  <div className="t4-latest-card-body">
                    {a.category && <div className="t4-latest-card-cat">{a.category}</div>}
                    <div className="t4-latest-card-title">{a.title}</div>
                    <div className="t4-latest-card-desc">{a.metaDescription || excerpt(a.content, 80)}</div>
                    <div className="t4-latest-card-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── NOS RUBRIQUES — sections éditoriales ── */}
        {showcaseCats.length > 0 && (
          <section className="t4-rubrics">
            <div className="t4-rubrics-head">
              <span className="t4-rubrics-label">Nos rubriques</span>
              <div className="t4-rubrics-rule" />
            </div>
            <div className="t4-editorial-list">
            {showcaseCats.map((c, i) => {
              const bullets: string[] = c.bullets ?? [
                `Guides pratiques et conseils d'experts`,
                `Erreurs à éviter et bonnes pratiques`,
                `Tendances et actualités du secteur`,
                `Comparatifs et recommandations`,
              ];
              return (
                <div key={c.slug} className="t4-editorial">
                  <div className="t4-editorial-img-wrap">
                    {c.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.image} alt={c.name} className="t4-editorial-img" />
                      : <div className="t4-editorial-img-placeholder">
                          <span className="t4-editorial-img-placeholder-num">0{i + 1}</span>
                        </div>
                    }
                  </div>
                  <div className="t4-editorial-body">
                    <span className="t4-editorial-eyebrow">{c.name}</span>
                    <h2 className="t4-editorial-title">Tout savoir sur<br />{c.name.toLowerCase()}</h2>
                    <p className="t4-editorial-desc">
                      {c.description
                        ? c.description
                        : `Nos experts décryptent tous les aspects de ${c.name.toLowerCase()} pour vous aider à prendre les meilleures décisions. Des conseils pratiques, des guides complets et des retours d'expérience concrets à votre disposition.`
                      }
                    </p>
                    <ul className="t4-editorial-bullets">
                      {bullets.map(b => <li key={b} className="t4-editorial-bullet">{b}</li>)}
                    </ul>
                    <Link href={`/${c.slug}`} className="t4-editorial-cta">
                      Voir tous nos conseils →
                    </Link>
                  </div>
                </div>
              );
            })}
            </div>
          </section>
        )}


        {/* ── STATS ── */}
        <div className="t4-stats">
          <div className="t4-stats-inner">
            <div className="t4-stat">
              <span className="t4-stat-n">{totalArticles}+</span>
              <span className="t4-stat-l">Articles publiés</span>
            </div>
            <div className="t4-stat">
              <span className="t4-stat-n">{totalCats}</span>
              <span className="t4-stat-l">Rubriques</span>
            </div>
            <div className="t4-stat">
              <span className="t4-stat-n">100%</span>
              <span className="t4-stat-l">Conseils d&apos;experts</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="t4-footer">
          © {new Date().getFullYear()} Maison &amp; Conseil — Tous vos conseils immobilier, décoration, jardin et maison
        </footer>

      </div>
    </>
  );
}
