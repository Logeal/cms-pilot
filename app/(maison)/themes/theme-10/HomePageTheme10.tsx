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

/* ── Layouts par rubrique ──────────────────────────────────────────────── */

function LayoutGrid4({ arts }: { arts: Article[]; cat: string }) {
  return (
    <div className="t10-lay-grid4">
      {arts.map(a => (
        <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t10-card-v">
          <div className="t10-card-v-img-wrap">
            {a.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={a.imageUrl} alt={a.title} className="t10-card-v-img" />
              : <div className="t10-card-v-img-empty" />
            }
          </div>
          <div className="t10-card-v-body">
            <div className="t10-card-v-title">{a.title}</div>
            <div className="t10-card-v-date">{fmt(a.publishedAt)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function LayoutFeaturedList({ arts }: { arts: Article[]; cat: string }) {
  const [main, ...rest] = arts;
  return (
    <div className="t10-lay-fl">
      {main && (
        <Link href={`/${catSlug(main.category)}/${main.slug}`} className="t10-card-big">
          <div className="t10-card-big-img-wrap">
            {main.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={main.imageUrl} alt={main.title} className="t10-card-big-img" />
              : <div className="t10-card-big-img-empty" />
            }
          </div>
          <div className="t10-card-big-body">
            <div className="t10-card-big-title">{main.title}</div>
            <p className="t10-card-big-desc">{main.metaDescription || excerpt(main.content)}</p>
            <div className="t10-card-big-date">{fmt(main.publishedAt)}</div>
          </div>
        </Link>
      )}
      <div className="t10-lay-fl-stack">
        {rest.slice(0, 3).map(a => (
          <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t10-card-row">
            <div className="t10-card-row-img-wrap">
              {a.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={a.imageUrl} alt={a.title} className="t10-card-row-img" />
                : <div className="t10-card-row-img-empty" />
              }
            </div>
            <div className="t10-card-row-body">
              <div className="t10-card-row-title">{a.title}</div>
              <div className="t10-card-row-date">{fmt(a.publishedAt)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LayoutTwoCols({ arts }: { arts: Article[]; cat: string }) {
  return (
    <div className="t10-lay-two">
      {arts.slice(0, 2).map(a => (
        <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t10-card-wide">
          <div className="t10-card-wide-img-wrap">
            {a.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={a.imageUrl} alt={a.title} className="t10-card-wide-img" />
              : <div className="t10-card-wide-img-empty" />
            }
          </div>
          <div className="t10-card-wide-body">
            <div className="t10-card-wide-title">{a.title}</div>
            <p className="t10-card-wide-desc">{a.metaDescription || excerpt(a.content)}</p>
            <div className="t10-card-wide-date">{fmt(a.publishedAt)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function LayoutGrid2({ arts }: { arts: Article[]; cat: string }) {
  return (
    <div className="t10-lay-two2">
      {arts.slice(0, 4).map(a => (
        <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t10-card-med">
          <div className="t10-card-med-img-wrap">
            {a.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={a.imageUrl} alt={a.title} className="t10-card-med-img" />
              : <div className="t10-card-med-img-empty" />
            }
          </div>
          <div className="t10-card-med-body">
            {a.category && <span className="t10-card-med-cat">{a.category}</span>}
            <div className="t10-card-med-title">{a.title}</div>
            {(a.metaDescription) && <p className="t10-card-med-desc">{a.metaDescription}</p>}
            <div className="t10-card-med-date">{fmt(a.publishedAt)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function HomePageTheme10({ home, expertiseCats, extraCats, heroArt, cardArts, moreArts }: Props) {
  const allCats = [...expertiseCats, ...extraCats];
  const allArts = heroArt ? [heroArt, ...cardArts, ...moreArts] : [...cardArts, ...moreArts];

  const featured = allArts[0];
  const secondary = allArts.slice(1, 4);
  const latest = allArts.slice(4, 12);

  const byCat: Record<string, Article[]> = {};
  allArts.forEach(a => {
    if (!a.category) return;
    if (!byCat[a.category]) byCat[a.category] = [];
    if (byCat[a.category].length < 4) byCat[a.category].push(a);
  });
  const catOrder = [
    ...allCats.filter(c => byCat[c]?.length),
    ...Object.keys(byCat).filter(c => !allCats.includes(c)),
  ];

  const layouts = [LayoutGrid4, LayoutFeaturedList, LayoutTwoCols, LayoutGrid2];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .t10 {
          background: #f7f5f2;
          color: #1a1a1a;
          font-family: var(--f-body, Georgia, serif);
        }

        /* ── CONTENEUR ── */
        .t10-wrap { max-width: 1180px; margin: 0 auto; padding: 0 32px; }

        /* ── HERO ── */
        .t10-hero-section { padding: 32px 32px 0; max-width: 1180px; margin: 0 auto; }
        .t10-hero-card {
          border-radius: 20px; overflow: hidden;
          display: grid; grid-template-columns: 3fr 2fr;
          background: #fff;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          text-decoration: none; color: inherit;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .t10-hero-card:hover { box-shadow: 0 8px 48px rgba(0,0,0,0.13); transform: translateY(-2px); }
        @media (max-width: 820px) { .t10-hero-card { grid-template-columns: 1fr; } }
        .t10-hero-img-wrap { overflow: hidden; border-radius: 20px 0 0 20px; }
        @media (max-width: 820px) { .t10-hero-img-wrap { border-radius: 20px 20px 0 0; } }
        .t10-hero-img { width: 100%; height: 100%; min-height: 360px; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .t10-hero-card:hover .t10-hero-img { transform: scale(1.04); }
        .t10-hero-img-empty { width: 100%; min-height: 360px; background: #ede9e3; display: block; }
        .t10-hero-body {
          padding: 36px 32px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .t10-hero-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fdf0ea; color: var(--c-terra, #b85c3a);
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; align-self: flex-start;
        }
        .t10-hero-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--c-terra, #b85c3a); display: block; }
        .t10-hero-cat {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #b0a89a;
        }
        .t10-hero-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(20px, 2.2vw, 30px); font-weight: 700; line-height: 1.2;
          letter-spacing: -0.02em; color: #1a1a1a;
        }
        .t10-hero-desc { font-size: 14px; color: #6b6560; line-height: 1.75; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
        .t10-hero-meta { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; margin-top: auto; }

        /* ── SECONDARY (3 cartes) ── */
        .t10-sec-section { max-width: 1180px; margin: 0 auto; padding: 24px 32px 0; }
        .t10-sec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 640px) { .t10-sec-grid { grid-template-columns: 1fr; } }
        .t10-sec-card {
          border-radius: 16px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10-sec-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.11); transform: translateY(-2px); }
        .t10-sec-img-wrap { overflow: hidden; }
        .t10-sec-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t10-sec-card:hover .t10-sec-img { transform: scale(1.05); }
        .t10-sec-img-empty { width: 100%; aspect-ratio: 16/9; background: #ede9e3; display: block; }
        .t10-sec-body { padding: 16px 18px 20px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
        .t10-sec-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-terra, #b85c3a); }
        .t10-sec-title { font-family: var(--f-display, Georgia, serif); font-size: 15px; font-weight: 700; line-height: 1.3; color: #1a1a1a; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t10-sec-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; }

        /* ── SECTION TITLE ── */
        .t10-section { max-width: 1180px; margin: 0 auto; padding: 40px 32px 0; }
        .t10-section-title {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          color: #b0a89a; margin-bottom: 20px;
        }

        /* ── GRILLE 4 COL (derniers articles) ── */
        .t10-four-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 860px) { .t10-four-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .t10-four-grid { grid-template-columns: 1fr; } }

        /* ── CARD VERTICALE (partagée par plusieurs layouts) ── */
        .t10-card-v {
          border-radius: 14px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 14px rgba(0,0,0,0.055);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10-card-v:hover { box-shadow: 0 5px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .t10-card-v-img-wrap { overflow: hidden; }
        .t10-card-v-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t10-card-v:hover .t10-card-v-img { transform: scale(1.05); }
        .t10-card-v-img-empty { width: 100%; aspect-ratio: 16/9; background: #ede9e3; display: block; }
        .t10-card-v-body { padding: 13px 15px 17px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .t10-card-v-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-terra, #b85c3a); }
        .t10-card-v-title { font-family: var(--f-display, Georgia, serif); font-size: 13px; font-weight: 700; line-height: 1.35; color: #1a1a1a; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t10-card-v-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; }

        /* ── PAR RUBRIQUE (header commun) ── */
        .t10-rubrique-section { max-width: 1180px; margin: 0 auto; padding: 40px 32px 48px; display: flex; flex-direction: column; gap: 48px; }
        .t10-rub-block {}
        .t10-rub-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; }
        .t10-rub-name {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(18px, 2.2vw, 28px); font-weight: 700; letter-spacing: -0.02em; color: #1a1a1a;
        }
        .t10-rub-see-all {
          font-family: var(--f-heading, sans-serif);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--c-terra, #b85c3a); text-decoration: none;
          background: #fdf0ea; padding: 7px 14px; border-radius: 100px;
          white-space: nowrap; transition: background 0.15s;
        }
        .t10-rub-see-all:hover { background: #f9ddd0; }

        /* ── LAYOUT 0 : grille 4 colonnes ── */
        .t10-lay-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 860px) { .t10-lay-grid4 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .t10-lay-grid4 { grid-template-columns: 1fr; } }

        /* ── LAYOUT 1 : grande carte + liste étirée ── */
        .t10-lay-fl { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; align-items: stretch; }
        @media (max-width: 760px) { .t10-lay-fl { grid-template-columns: 1fr; } }
        .t10-card-big {
          border-radius: 16px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10-card-big:hover { box-shadow: 0 6px 30px rgba(0,0,0,0.12); transform: translateY(-2px); }
        .t10-card-big-img-wrap { overflow: hidden; flex-shrink: 0; }
        .t10-card-big-img { width: 100%; aspect-ratio: 3/2; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t10-card-big:hover .t10-card-big-img { transform: scale(1.04); }
        .t10-card-big-img-empty { width: 100%; aspect-ratio: 3/2; background: #ede9e3; display: block; }
        .t10-card-big-body { padding: 20px 22px 24px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .t10-card-big-title { font-family: var(--f-display, Georgia, serif); font-size: clamp(15px, 1.6vw, 20px); font-weight: 700; line-height: 1.25; color: #1a1a1a; }
        .t10-card-big-desc { font-size: 13px; color: #6b6560; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t10-card-big-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; margin-top: auto; }

        /* Stack droite : les cards s'étirent pour remplir toute la hauteur */
        .t10-lay-fl-stack { display: flex; flex-direction: column; gap: 12px; height: 100%; }
        .t10-card-row {
          border-radius: 12px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.055);
          text-decoration: none; display: grid; grid-template-columns: 110px 1fr;
          flex: 1; min-height: 0;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10-card-row:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); transform: translateY(-1px); }
        .t10-card-row-img-wrap { overflow: hidden; border-radius: 12px 0 0 12px; }
        .t10-card-row-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
        .t10-card-row:hover .t10-card-row-img { transform: scale(1.07); }
        .t10-card-row-img-empty { width: 100%; height: 100%; background: #ede9e3; display: block; }
        .t10-card-row-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 7px; justify-content: center; }
        .t10-card-row-title { font-family: var(--f-display, Georgia, serif); font-size: 14px; font-weight: 700; line-height: 1.3; color: #1a1a1a; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s; }
        .t10-card-row:hover .t10-card-row-title { color: var(--c-terra, #b85c3a); }
        .t10-card-row-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; }

        /* ── LAYOUT 2 : 2 grandes colonnes ── */
        .t10-lay-two { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 600px) { .t10-lay-two { grid-template-columns: 1fr; } }
        .t10-card-wide {
          border-radius: 16px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10-card-wide:hover { box-shadow: 0 6px 30px rgba(0,0,0,0.12); transform: translateY(-2px); }
        .t10-card-wide-img-wrap { overflow: hidden; }
        .t10-card-wide-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t10-card-wide:hover .t10-card-wide-img { transform: scale(1.04); }
        .t10-card-wide-img-empty { width: 100%; aspect-ratio: 4/3; background: #ede9e3; display: block; }
        .t10-card-wide-body { padding: 20px 22px 26px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .t10-card-wide-title { font-family: var(--f-display, Georgia, serif); font-size: clamp(15px, 1.8vw, 22px); font-weight: 700; line-height: 1.25; color: #1a1a1a; }
        .t10-card-wide-desc { font-size: 13px; color: #6b6560; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .t10-card-wide-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; margin-top: auto; }

        /* ── LAYOUT 3 : grille 2 colonnes ── */
        .t10-lay-two2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 600px) { .t10-lay-two2 { grid-template-columns: 1fr; } }
        .t10-card-med {
          border-radius: 16px; overflow: hidden; background: #fff;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          text-decoration: none; display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t10-card-med:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.12); transform: translateY(-2px); }
        .t10-card-med-img-wrap { overflow: hidden; }
        .t10-card-med-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .t10-card-med:hover .t10-card-med-img { transform: scale(1.05); }
        .t10-card-med-img-empty { width: 100%; aspect-ratio: 16/9; background: #ede9e3; display: block; }
        .t10-card-med-body { padding: 18px 20px 22px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .t10-card-med-cat { font-family: var(--f-heading, sans-serif); font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-terra, #b85c3a); }
        .t10-card-med-title { font-family: var(--f-display, Georgia, serif); font-size: 17px; font-weight: 700; line-height: 1.3; color: #1a1a1a; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s; }
        .t10-card-med:hover .t10-card-med-title { color: var(--c-terra, #b85c3a); }
        .t10-card-med-desc { font-size: 13px; color: #6b6560; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .t10-card-med-date { font-family: var(--f-heading, sans-serif); font-size: 10px; color: #b0a89a; }

        @media (max-width: 768px) {
          .t10-hero-section, .t10-sec-section, .t10-section, .t10-rubrique-section {
            padding-left: 16px; padding-right: 16px;
          }
        }
      `}} />

      <div className="t10">

        {/* ── HERO ── */}
        {featured && (
          <div className="t10-hero-section">
            <Link href={`/${catSlug(featured.category)}/${featured.slug}`} className="t10-hero-card">
              <div className="t10-hero-img-wrap">
                {featured.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.imageUrl} alt={featured.title} className="t10-hero-img" />
                  : <div className="t10-hero-img-empty" />
                }
              </div>
              <div className="t10-hero-body">
                <span className="t10-hero-pill">À la une</span>
                {featured.category && <span className="t10-hero-cat">{featured.category}</span>}
                <div className="t10-hero-title">{featured.title}</div>
                <p className="t10-hero-desc">{featured.metaDescription || excerpt(featured.content)}</p>
                <div className="t10-hero-meta">{fmt(featured.publishedAt)}</div>
              </div>
            </Link>
          </div>
        )}

        {/* ── 3 ARTICLES SECONDARY ── */}
        {secondary.length > 0 && (
          <div className="t10-sec-section">
            <div className="t10-sec-grid">
              {secondary.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t10-sec-card">
                  <div className="t10-sec-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t10-sec-img" />
                      : <div className="t10-sec-img-empty" />
                    }
                  </div>
                  <div className="t10-sec-body">
                    {a.category && <span className="t10-sec-cat">{a.category}</span>}
                    <div className="t10-sec-title">{a.title}</div>
                    <div className="t10-sec-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── DERNIERS ARTICLES ── */}
        {latest.length > 0 && (
          <div className="t10-section">
            <div className="t10-section-title">Derniers articles</div>
            <div className="t10-four-grid">
              {latest.map(a => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t10-card-v">
                  <div className="t10-card-v-img-wrap">
                    {a.imageUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={a.imageUrl} alt={a.title} className="t10-card-v-img" />
                      : <div className="t10-card-v-img-empty" />
                    }
                  </div>
                  <div className="t10-card-v-body">
                    {a.category && <span className="t10-card-v-cat">{a.category}</span>}
                    <div className="t10-card-v-title">{a.title}</div>
                    <div className="t10-card-v-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── PAR RUBRIQUE (layout en rotation) ── */}
        {catOrder.length > 0 && (
          <div className="t10-rubrique-section">
            {catOrder.map((cat, idx) => {
              const Layout = layouts[idx % layouts.length];
              return (
                <div key={cat} className="t10-rub-block">
                  <div className="t10-rub-head">
                    <span className="t10-rub-name">{cat}</span>
                    <Link href={`/${catSlug(cat)}`} className="t10-rub-see-all">Voir tout →</Link>
                  </div>
                  <Layout arts={byCat[cat]} cat={cat} />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}
