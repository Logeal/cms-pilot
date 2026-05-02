import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  imageUrl: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
};

type Props = {
  category: string;
  label: string;
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  seoIntro: string | null;
  seoH2: string | null;
  seoCol1Title: string | null;
  seoCol1Body: string | null;
  seoCol2Title: string | null;
  seoCol2Body: string | null;
  seoFaq: Array<{ q: string; a: string }> | null;
  hasSeoContent: boolean;
};

export function CategoryPageTheme2({
  category,
  label,
  articles,
  total,
  page,
  totalPages,
  seoIntro,
  seoH2,
  seoCol1Title,
  seoCol1Body,
  seoCol2Title,
  seoCol2Body,
  seoFaq,
  hasSeoContent,
}: Props) {
  const pinned = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── THEME 2 CATEGORY ── */

        .t2c-header {
          background: var(--c-dark);
          padding: 56px 0 48px;
          position: relative;
          overflow: hidden;
        }
        .t2c-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--c-terra);
        }
        .t2c-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .t2c-breadcrumb {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .t2c-breadcrumb a {
          color: rgba(255,255,255,0.4);
          text-decoration: none;
        }
        .t2c-breadcrumb a:hover { color: rgba(255,255,255,0.7); }
        .t2c-breadcrumb-sep { opacity: 0.3; }
        .t2c-label-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .t2c-line {
          width: 40px;
          height: 3px;
          background: var(--c-terra);
          flex-shrink: 0;
        }
        .t2c-cat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--c-terra);
        }
        .t2c-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 700;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 16px;
        }
        .t2c-desc {
          font-size: 16px;
          color: rgba(255,255,255,0.55);
          line-height: 1.65;
          max-width: 600px;
          margin-bottom: 28px;
        }
        .t2c-count {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.04em;
        }

        /* Article épinglé — pleine largeur */
        .t2c-pinned-section {
          background: var(--c-cream-2);
          padding: 48px 0;
        }
        .t2c-pinned-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .t2c-pinned-card {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 0;
          border-radius: 10px;
          overflow: hidden;
          background: var(--c-cream);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          text-decoration: none;
          transition: box-shadow 0.2s;
        }
        .t2c-pinned-card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.14); }
        .t2c-pinned-img {
          width: 100%;
          height: 360px;
          object-fit: cover;
          display: block;
        }
        .t2c-pinned-body {
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .t2c-pinned-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--c-terra);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .t2c-pinned-badge::before {
          content: '';
          display: block;
          width: 24px;
          height: 2px;
          background: var(--c-terra);
        }
        .t2c-pinned-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 700;
          color: var(--c-dark);
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .t2c-pinned-excerpt {
          font-size: 14px;
          color: var(--c-mid);
          line-height: 1.7;
          margin-bottom: 28px;
          flex: 1;
        }
        .t2c-pinned-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .t2c-pinned-date {
          font-size: 12px;
          color: var(--c-mid);
        }
        .t2c-pinned-read {
          font-size: 13px;
          font-weight: 600;
          color: var(--c-green);
        }

        /* Grille d'articles */
        .t2c-grid-section {
          background: var(--c-cream);
          padding: 56px 0;
        }
        .t2c-grid-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .t2c-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }
        .t2c-grid-item {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 0;
          background: var(--c-cream-2);
          text-decoration: none;
          overflow: hidden;
          border-radius: 6px;
          border: 1px solid var(--c-border);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .t2c-grid-item:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .t2c-grid-img {
          width: 160px;
          height: 100%;
          min-height: 140px;
          object-fit: cover;
          display: block;
          flex-shrink: 0;
        }
        .t2c-grid-img-placeholder {
          width: 160px;
          min-height: 140px;
          background: var(--c-border);
          flex-shrink: 0;
        }
        .t2c-grid-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }
        .t2c-grid-cat {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-green);
          margin-bottom: 7px;
          display: block;
        }
        .t2c-grid-title {
          font-family: var(--f-heading, system-ui, sans-serif);
          font-size: 15px;
          font-weight: 600;
          color: var(--c-dark);
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .t2c-grid-excerpt {
          font-size: 12px;
          color: var(--c-mid);
          line-height: 1.55;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .t2c-grid-date {
          font-size: 11px;
          color: var(--c-mid);
          margin-top: auto;
        }

        /* Pagination */
        .t2c-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .t2c-page-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          color: var(--c-dark);
          background: var(--c-cream-2);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .t2c-page-btn:hover { background: var(--c-green); color: #fff; }
        .t2c-page-btn.active { background: var(--c-dark); color: #fff; font-weight: 700; }

        /* Section SEO */
        .t2c-seo {
          background: var(--c-dark);
          padding: 72px 0;
        }
        .t2c-seo-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }
        .t2c-seo h2 {
          font-family: var(--f-display, Georgia, serif);
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }
        .t2c-seo-divider {
          width: 40px;
          height: 2px;
          background: var(--c-terra);
          margin-bottom: 24px;
        }
        .t2c-seo h3 {
          font-family: var(--f-heading, system-ui, sans-serif);
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          margin-bottom: 10px;
          margin-top: 24px;
        }
        .t2c-seo p {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin-bottom: 14px;
        }
        .t2c-seo ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .t2c-seo ul li {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          padding-left: 16px;
          position: relative;
        }
        .t2c-seo ul li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--c-terra);
          font-size: 11px;
        }
        .t2c-seo-placeholder {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .t2c-header-inner, .t2c-pinned-inner, .t2c-grid-inner, .t2c-seo-inner, .t2c-seo-placeholder { padding: 0 20px; }
          .t2c-h1 { font-size: 32px; }
          .t2c-pinned-card { grid-template-columns: 1fr; }
          .t2c-pinned-img { height: 220px; }
          .t2c-pinned-body { padding: 28px 24px; }
          .t2c-grid { grid-template-columns: 1fr; gap: 14px; }
          .t2c-seo-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 480px) {
          .t2c-grid-item { grid-template-columns: 1fr; }
          .t2c-grid-img, .t2c-grid-img-placeholder { width: 100%; height: 180px; }
        }
      `}} />

      {/* En-tête sombre */}
      <div className="t2c-header">
        <div className="t2c-header-inner">
          <div className="t2c-breadcrumb">
            <Link href="/">Accueil</Link>
            <span className="t2c-breadcrumb-sep">/</span>
            <span>{label}</span>
          </div>
          <div className="t2c-label-row">
            <div className="t2c-line" />
            <span className="t2c-cat-label">{label}</span>
          </div>
          <h1 className="t2c-h1">{label}</h1>
          <p className="t2c-desc">
            {seoIntro ?? `Conseils et guides pratiques sur le thème ${label}, par nos experts.`}
          </p>
          <span className="t2c-count">{total} article{total > 1 ? "s" : ""} disponibles</span>
        </div>
      </div>

      {/* Article épinglé */}
      {pinned && (
        <section className="t2c-pinned-section">
          <div className="t2c-pinned-inner">
            <Link href={`/${category}/${pinned.slug}`} className="t2c-pinned-card">
              {pinned.imageUrl
                ? <img src={pinned.imageUrl} alt={pinned.title} className="t2c-pinned-img" />
                : <div className="t2c-pinned-img" style={{ background: "var(--c-border)" }} />
              }
              <div className="t2c-pinned-body">
                <span className="t2c-pinned-badge">À la une</span>
                <div className="t2c-pinned-title">{pinned.title}</div>
                {pinned.metaDescription && (
                  <p className="t2c-pinned-excerpt">{pinned.metaDescription}</p>
                )}
                <div className="t2c-pinned-footer">
                  <span className="t2c-pinned-date">{fmt(pinned.publishedAt)}</span>
                  <span className="t2c-pinned-read">Lire l&apos;article →</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grille articles */}
      {rest.length > 0 && (
        <section className="t2c-grid-section">
          <div className="t2c-grid-inner">
            <div className="t2c-grid">
              {rest.map((a) => (
                <Link key={a.id} href={`/${category}/${a.slug}`} className="t2c-grid-item">
                  {a.imageUrl
                    ? <img src={a.imageUrl} alt={a.title} className="t2c-grid-img" />
                    : <div className="t2c-grid-img-placeholder" />
                  }
                  <div className="t2c-grid-body">
                    {a.category && <span className="t2c-grid-cat">{a.category}</span>}
                    <div className="t2c-grid-title">{a.title}</div>
                    {a.metaDescription && (
                      <div className="t2c-grid-excerpt">{a.metaDescription}</div>
                    )}
                    <div className="t2c-grid-date">{fmt(a.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="t2c-pagination">
                {page > 1 && (
                  <Link href={`/${category}?page=${page - 1}`} className="t2c-page-btn">←</Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/${category}?page=${p}`}
                    className={`t2c-page-btn${p === page ? " active" : ""}`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link href={`/${category}?page=${page + 1}`} className="t2c-page-btn">→</Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section SEO sombre */}
      <section className="t2c-seo">
        {hasSeoContent ? (
          <div className="t2c-seo-inner">
            <div>
              <h2>{seoH2 ?? `Tout savoir sur ${label}`}</h2>
              <div className="t2c-seo-divider" />
              <h3>{seoCol1Title ?? "Conseils essentiels"}</h3>
              <p>{seoCol1Body ?? `Nos experts analysent toutes les facettes de ${label}.`}</p>
              <h3>Nos recommandations clés</h3>
              <ul>
                <li>Toujours comparer plusieurs options avant de décider</li>
                <li>Privilégier la qualité sur le long terme</li>
                <li>S&apos;appuyer sur des professionnels certifiés</li>
                <li>Planifier et budgétiser en amont</li>
                <li>Suivre les réglementations en vigueur</li>
              </ul>
            </div>
            <div>
              <h2>Questions fréquentes</h2>
              <div className="t2c-seo-divider" />
              <h3>{seoCol2Title ?? "Ce qu'il faut savoir"}</h3>
              <p>{seoCol2Body ?? `Le domaine de ${label} est vaste et en constante évolution.`}</p>
              {seoFaq && seoFaq.map((item, i) => (
                <div key={i}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))}
              {!seoFaq && (
                <>
                  <h3>Comment choisir le bon professionnel ?</h3>
                  <p>Vérifiez les certifications, lisez les avis clients et demandez toujours plusieurs devis.</p>
                  <h3>Quel budget prévoir ?</h3>
                  <p>Les coûts varient fortement selon le projet. Nos articles détaillent les fourchettes de prix.</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="t2c-seo-placeholder">
            <p>Le contenu de cette rubrique arrive bientôt.</p>
          </div>
        )}
      </section>
    </>
  );
}
