import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 110) {
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
};

type Props = {
  home: {
    heroEyebrow: string;
    heroLine1: string;
    heroLine2: string;
    heroSub: string;
    heroCta: string;
    expertiseEyebrow: string;
    expertiseTitle: string;
  };
  heroImageUrl: string | null;
  expertiseCats: string[];
  extraCats: string[];
  categoryHeroImages: Record<string, string>;
  totalArticles: number;
  totalCats: number;
  heroArt: Article | undefined;
  cardArts: Article[];
  moreArts: Article[];
};

export function HomePageTheme2({
  home,
  heroImageUrl,
  expertiseCats,
  extraCats,
  categoryHeroImages,
  totalArticles,
  totalCats,
  heroArt,
  cardArts,
  moreArts,
}: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const featuredImg = heroImageUrl ?? heroArt?.imageUrl ?? null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ═══════════════════════════════
           THEME 2 — HOMEPAGE
        ═══════════════════════════════ */

        /* ── 1. HERO plein écran ── */
        .t2-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          background: var(--c-dark);
        }
        .t2-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0.45;
        }
        .t2-hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.15) 40%,
            rgba(0,0,0,0.75) 75%,
            rgba(0,0,0,0.92) 100%
          );
        }
        .t2-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px 72px;
          width: 100%;
          box-sizing: border-box;
        }
        .t2-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--c-terra);
          margin-bottom: 20px;
        }
        .t2-hero-kicker::before {
          content: '';
          display: block;
          width: 32px;
          height: 2px;
          background: var(--c-terra);
        }
        .t2-hero-headline {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(42px, 5.5vw, 80px);
          font-weight: 700;
          line-height: 1.04;
          color: #fff;
          margin: 0 0 24px;
          max-width: 860px;
        }
        .t2-hero-headline em {
          font-style: italic;
          color: var(--c-terra);
        }
        .t2-hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 48px;
        }
        .t2-hero-sub {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,255,255,0.62);
          max-width: 540px;
          margin: 0;
        }
        .t2-hero-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 20px;
          flex-shrink: 0;
        }
        .t2-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          background: #fff;
          color: var(--c-dark);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 4px;
          white-space: nowrap;
          transition: background 0.2s, color 0.2s;
        }
        .t2-hero-cta:hover {
          background: var(--c-terra);
          color: #fff;
        }
        .t2-hero-stats {
          display: flex;
          gap: 32px;
        }
        .t2-hero-stat {}
        .t2-hero-stat-num {
          font-family: var(--f-display, Georgia, serif);
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          display: block;
          margin-bottom: 3px;
          text-align: right;
        }
        .t2-hero-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.04em;
          text-align: right;
          display: block;
        }

        /* Nav catégories */
        .t2-catnav {
          background: var(--c-dark);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .t2-catnav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .t2-catnav-inner::-webkit-scrollbar { display: none; }
        .t2-catnav-link {
          display: block;
          padding: 15px 18px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          margin-bottom: -1px;
        }
        .t2-catnav-link:hover {
          color: #fff;
          border-bottom-color: var(--c-terra);
        }

        /* ── 2. GRILLE ARTICLES ── */
        .t2-articles {
          background: var(--c-cream);
          padding: 72px 0 80px;
        }
        .t2-articles-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .t2-block-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
        }
        .t2-block-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-dark);
        }
        .t2-block-link {
          font-size: 12px;
          font-weight: 600;
          color: var(--c-mid);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color 0.15s;
        }
        .t2-block-link:hover { color: var(--c-green); }

        /* ── Article vedette horizontal ── */
        .t2-featured-h {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 0;
          text-decoration: none;
          overflow: hidden;
          border-radius: 8px;
          background: var(--c-dark);
          margin-bottom: 40px;
          min-height: 340px;
        }
        .t2-featured-h-img-wrap {
          position: relative;
          overflow: hidden;
        }
        .t2-featured-h-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          min-height: 340px;
          opacity: 0.9;
          transition: opacity 0.3s, transform 0.5s;
        }
        .t2-featured-h:hover .t2-featured-h-img { opacity: 1; transform: scale(1.03); }
        .t2-featured-h-body {
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--c-dark);
        }
        .t2-featured-h-cat {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--c-terra);
          margin-bottom: 16px;
        }
        .t2-featured-h-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(22px, 2.2vw, 30px);
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .t2-featured-h-excerpt {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin-bottom: 24px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .t2-featured-h-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .t2-featured-h-date {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }
        .t2-featured-h-read {
          font-size: 13px;
          font-weight: 600;
          color: var(--c-terra);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ── Grille 3 colonnes ── */
        .t2-grid3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }
        .t2-art-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          overflow: hidden;
          border-radius: 6px;
          background: var(--c-cream);
          border: 1px solid var(--c-border);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t2-art-card:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .t2-art-card-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: var(--c-border);
          flex-shrink: 0;
        }
        .t2-art-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s;
        }
        .t2-art-card:hover .t2-art-card-img { transform: scale(1.04); }
        .t2-art-card-body {
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .t2-art-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .t2-art-card-cat {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          background: var(--c-green);
          padding: 3px 8px;
          border-radius: 2px;
          white-space: nowrap;
        }
        .t2-art-card-date {
          font-size: 11px;
          color: var(--c-mid);
        }
        .t2-art-card-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 17px;
          font-weight: 700;
          color: var(--c-dark);
          line-height: 1.35;
          margin-bottom: 10px;
        }
        .t2-art-card-excerpt {
          font-size: 13px;
          color: var(--c-mid);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        /* ── 3. RUBRIQUES ── */
        .t2-rubriques {
          background: var(--c-dark);
          padding: 80px 0;
        }
        .t2-rubriques-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .t2-rub-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
        }
        .t2-rub-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--c-terra);
          display: block;
          margin-bottom: 10px;
        }
        .t2-rub-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }
        .t2-rub-all {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }
        .t2-rub-all:hover { color: rgba(255,255,255,0.8); }

        /* Grille rubriques : 1 grande + petites */
        .t2-rub-grid {
          display: grid;
          gap: 2px;
        }
        /* 3 cats : 1 grande + 2 petites */
        .t2-rub-grid--3 {
          grid-template-columns: 1.6fr 1fr 1fr;
          grid-template-rows: 360px;
        }
        /* 5 cats : 1 grande sur 2 lignes à gauche + 4 petites à droite */
        .t2-rub-grid--5 {
          grid-template-columns: 1.4fr 1fr 1fr;
          grid-template-rows: 200px 200px;
        }
        .t2-rub-tile {
          position: relative;
          display: block;
          text-decoration: none;
          overflow: hidden;
          background: var(--c-mid);
        }
        .t2-rub-tile--big {
          grid-row: span 2;
        }
        .t2-rub-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.55);
          transition: filter 0.35s, transform 0.5s;
        }
        .t2-rub-tile:hover .t2-rub-tile-img {
          filter: brightness(0.7);
          transform: scale(1.04);
        }
        .t2-rub-tile-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%);
        }
        .t2-rub-tile-body {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 22px 20px;
        }
        .t2-rub-tile--big .t2-rub-tile-body {
          padding: 28px 24px;
        }
        .t2-rub-tile-num {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 5px;
        }
        .t2-rub-tile-name {
          font-family: var(--f-display, Georgia, serif);
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }
        .t2-rub-tile--big .t2-rub-tile-name {
          font-size: clamp(22px, 2.5vw, 30px);
        }
        .t2-rub-tile-cta {
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.15s;
        }
        .t2-rub-tile:hover .t2-rub-tile-cta { color: var(--c-terra); }

        /* ── 4. STATS ── */
        .t2-stats {
          background: var(--c-cream-2);
          padding: 48px 0;
          border-top: 1px solid var(--c-border);
        }
        .t2-stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          text-align: center;
        }
        .t2-stat-item {
          padding: 0 24px;
          border-right: 1px solid var(--c-border);
        }
        .t2-stat-item:last-child { border-right: none; }
        .t2-stat-num {
          font-family: var(--f-display, Georgia, serif);
          font-size: 36px;
          font-weight: 700;
          color: var(--c-dark);
          display: block;
          line-height: 1;
          margin-bottom: 6px;
        }
        .t2-stat-label {
          font-size: 12px;
          color: var(--c-mid);
          letter-spacing: 0.03em;
        }

        /* ── MOBILE ── */
        @media (max-width: 1024px) {
          .t2-rub-grid--5 { grid-template-columns: 1fr 1fr; grid-template-rows: 200px 200px 200px; }
          .t2-rub-tile--big { grid-row: span 1; }
        }
        @media (max-width: 768px) {
          .t2-hero { min-height: 75vh; }
          .t2-hero-content { padding: 0 20px 48px; }
          .t2-hero-headline { font-size: 38px; }
          .t2-hero-bottom { flex-direction: column; align-items: flex-start; gap: 24px; }
          .t2-hero-right { align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
          .t2-hero-stat-num, .t2-hero-stat-label { text-align: left; }
          .t2-catnav-inner { padding: 0 20px; }
          .t2-articles { padding: 48px 0 56px; }
          .t2-articles-inner, .t2-rubriques-inner, .t2-stats-inner { padding: 0 20px; }
          .t2-featured-h { grid-template-columns: 1fr; }
          .t2-featured-h-img { min-height: 220px; }
          .t2-featured-h-body { padding: 28px 24px 32px; }
          .t2-grid3 { grid-template-columns: 1fr 1fr; gap: 16px; }
          .t2-rub-grid--3, .t2-rub-grid--5 { grid-template-columns: 1fr; grid-template-rows: auto; }
          .t2-rub-tile { height: 200px; }
          .t2-rub-tile--big { grid-row: span 1; }
          .t2-stats-inner { grid-template-columns: 1fr 1fr; gap: 24px 0; }
          .t2-stat-item { border-right: none; border-bottom: 1px solid var(--c-border); padding: 20px 0; }
          .t2-stat-item:nth-child(2n) { }
        }
        @media (max-width: 480px) {
          .t2-grid3 { grid-template-columns: 1fr; }
          .t2-hero-headline { font-size: 30px; }
        }
      `}} />

      {/* ══════════════════════════════
          1. HERO PLEIN ÉCRAN
      ══════════════════════════════ */}
      <section className="t2-hero">
        {featuredImg && (
          <img src={featuredImg} alt="" className="t2-hero-bg" />
        )}
        <div className="t2-hero-gradient" />
        <div className="t2-hero-content">
          <span className="t2-hero-kicker">{home.heroEyebrow}</span>
          <h1 className="t2-hero-headline">
            {home.heroLine1}<br />
            <em>{home.heroLine2}</em>
          </h1>
          <div className="t2-hero-bottom">
            <p className="t2-hero-sub">{home.heroSub}</p>
            <div className="t2-hero-right">
              <Link href="#articles" className="t2-hero-cta">
                {home.heroCta}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path d="M2.5 7.5h10M8.5 4l3.5 3.5L8.5 11"/>
                </svg>
              </Link>
              <div className="t2-hero-stats">
                <div className="t2-hero-stat">
                  <span className="t2-hero-stat-num">{totalArticles}+</span>
                  <span className="t2-hero-stat-label">Articles</span>
                </div>
                <div className="t2-hero-stat">
                  <span className="t2-hero-stat-num">{totalCats}</span>
                  <span className="t2-hero-stat-label">Rubriques</span>
                </div>
                <div className="t2-hero-stat">
                  <span className="t2-hero-stat-num">100%</span>
                  <span className="t2-hero-stat-label">Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          2. GRILLE ARTICLES
      ══════════════════════════════ */}
      <section className="t2-articles" id="articles">
        <div className="t2-articles-inner">
          <div className="t2-block-head">
            <span className="t2-block-title">Derniers articles</span>
            <Link href="/" className="t2-block-link">Tout voir →</Link>
          </div>

          {/* Article vedette — horizontal pleine largeur */}
          {heroArt && (
            <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`} className="t2-featured-h">
              <div className="t2-featured-h-img-wrap">
                {heroArt.imageUrl
                  ? <img src={heroArt.imageUrl} alt={heroArt.title} className="t2-featured-h-img" />
                  : <div className="t2-featured-h-img" style={{ background: "var(--c-mid)" }} />
                }
              </div>
              <div className="t2-featured-h-body">
                {heroArt.category && <span className="t2-featured-h-cat">{heroArt.category}</span>}
                <div className="t2-featured-h-title">{heroArt.title}</div>
                <div className="t2-featured-h-excerpt">
                  {heroArt.metaDescription ?? excerpt(heroArt.content, 200)}
                </div>
                <div className="t2-featured-h-footer">
                  <span className="t2-featured-h-date">{fmt(heroArt.publishedAt)}</span>
                  <span className="t2-featured-h-read">
                    Lire l&apos;article
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"/>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grille 3 colonnes — articles 2 à 10 */}
          {[...cardArts, ...moreArts].length > 0 && (
            <>
              <div className="t2-grid3">
                {[...cardArts, ...moreArts].slice(0, 3).map((a) => (
                  <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t2-art-card">
                    <div className="t2-art-card-img-wrap">
                      {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="t2-art-card-img" />}
                    </div>
                    <div className="t2-art-card-body">
                      <div className="t2-art-card-meta">
                        {a.category && <span className="t2-art-card-cat">{a.category}</span>}
                        <span className="t2-art-card-date">{fmt(a.publishedAt)}</span>
                      </div>
                      <div className="t2-art-card-title">{a.title}</div>
                      <div className="t2-art-card-excerpt">
                        {a.metaDescription ?? excerpt(a.content, 140)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="t2-grid3">
                {[...cardArts, ...moreArts].slice(3, 6).map((a) => (
                  <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t2-art-card">
                    <div className="t2-art-card-img-wrap">
                      {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="t2-art-card-img" />}
                    </div>
                    <div className="t2-art-card-body">
                      <div className="t2-art-card-meta">
                        {a.category && <span className="t2-art-card-cat">{a.category}</span>}
                        <span className="t2-art-card-date">{fmt(a.publishedAt)}</span>
                      </div>
                      <div className="t2-art-card-title">{a.title}</div>
                      <div className="t2-art-card-excerpt">
                        {a.metaDescription ?? excerpt(a.content, 140)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {[...cardArts, ...moreArts].slice(6, 9).length > 0 && (
                <div className="t2-grid3">
                  {[...cardArts, ...moreArts].slice(6, 9).map((a) => (
                    <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t2-art-card">
                      <div className="t2-art-card-img-wrap">
                        {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="t2-art-card-img" />}
                      </div>
                      <div className="t2-art-card-body">
                        <div className="t2-art-card-meta">
                          {a.category && <span className="t2-art-card-cat">{a.category}</span>}
                          <span className="t2-art-card-date">{fmt(a.publishedAt)}</span>
                        </div>
                        <div className="t2-art-card-title">{a.title}</div>
                        <div className="t2-art-card-excerpt">
                          {a.metaDescription ?? excerpt(a.content, 140)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          3. RUBRIQUES
      ══════════════════════════════ */}
      {allCats.length > 0 && (
        <section className="t2-rubriques">
          <div className="t2-rubriques-inner">
            <div className="t2-rub-head">
              <div>
                <span className="t2-rub-eyebrow">{home.expertiseEyebrow}</span>
                <div className="t2-rub-title">
                  {home.expertiseTitle.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
              <Link href="/" className="t2-rub-all">Explorer toutes les rubriques →</Link>
            </div>

            <div className={`t2-rub-grid t2-rub-grid--${allCats.length >= 5 ? "5" : "3"}`}>
              {allCats.slice(0, allCats.length >= 5 ? 5 : 3).map((cat, i) => {
                const img = categoryHeroImages[cat];
                const isBig = allCats.length >= 5 ? i === 0 : false;
                return (
                  <Link
                    key={cat}
                    href={`/${catSlug(cat)}`}
                    className={`t2-rub-tile${isBig ? " t2-rub-tile--big" : ""}`}
                  >
                    {img
                      ? <img src={img} alt={cat} className="t2-rub-tile-img" />
                      : <div className="t2-rub-tile-img" style={{ background: "var(--c-mid)" }} />
                    }
                    <div className="t2-rub-tile-overlay" />
                    <div className="t2-rub-tile-body">
                      <span className="t2-rub-tile-num">0{i + 1}</span>
                      <div className="t2-rub-tile-name">{cat}</div>
                      <div className="t2-rub-tile-cta">
                        Explorer
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M2 6h8M7 3l3 3-3 3"/>
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════
          4. STATS
      ══════════════════════════════ */}
      <div className="t2-stats">
        <div className="t2-stats-inner">
          <div className="t2-stat-item">
            <span className="t2-stat-num">{totalArticles}+</span>
            <span className="t2-stat-label">Articles publiés</span>
          </div>
          <div className="t2-stat-item">
            <span className="t2-stat-num">{totalCats}</span>
            <span className="t2-stat-label">Domaines couverts</span>
          </div>
          <div className="t2-stat-item">
            <span className="t2-stat-num">100%</span>
            <span className="t2-stat-label">Gratuit &amp; sans pub</span>
          </div>
          <div className="t2-stat-item">
            <span className="t2-stat-num">🇫🇷</span>
            <span className="t2-stat-label">Marché français</span>
          </div>
        </div>
      </div>

      <footer style={{ background: "var(--c-dark)", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "28px 40px", fontFamily: "var(--f-heading, sans-serif)", fontSize: "12px", letterSpacing: "0.04em" }}>
        © {new Date().getFullYear()} Maison &amp; Conseil — Décoration, immobilier, jardin &amp; maison
      </footer>
    </>
  );
}
