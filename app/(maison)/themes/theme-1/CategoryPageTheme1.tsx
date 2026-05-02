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

export function CategoryPageTheme1({
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
  return (
    <>
      <div className="ms-cat-intro">
        <div className="ms-wrap">
          <p className="ms-cat-breadcrumb">
            <Link href="/">Accueil</Link> / {label}
          </p>
          <span className="ms-tag ms-tag--green" style={{ marginBottom: 14 }}>{label}</span>
          <h1 className="ms-cat-h1">{label}</h1>
          <p className="ms-cat-desc">
            {seoIntro ?? `Conseils et guides pratiques sur le thème ${label}, par nos experts.`}
          </p>
        </div>
      </div>

      <section className="ms-section ms-section--cream">
        <div className="ms-wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
            <p style={{ fontSize: 14, color: "var(--c-mid)" }}>{total} article{total > 1 ? "s" : ""} dans cette rubrique</p>
            {totalPages > 1 && <p style={{ fontSize: 13, color: "var(--c-mid)" }}>Page {page} / {totalPages}</p>}
          </div>

          <div className="ms-cat-grid">
            {articles.map((a) => (
              <article key={a.id} className="ms-cat-card">
                <div className="ms-cat-card-img">
                  {a.imageUrl && <img src={a.imageUrl} alt={a.title} />}
                </div>
                <div className="ms-cat-card-body">
                  {a.category && <span className="ms-tag ms-tag--green">{a.category}</span>}
                  <h2 className="ms-cat-card-title">
                    <Link href={`/${category}/${a.slug}`}>{a.title}</Link>
                  </h2>
                  {a.metaDescription && (
                    <p className="ms-cat-card-excerpt">{a.metaDescription}</p>
                  )}
                  <span className="ms-date">{fmt(a.publishedAt)}</span>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="ms-pagination">
              {page > 1 && <Link href={`/${category}?page=${page - 1}`} className="ms-page-btn">←</Link>}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/${category}?page=${p}`} className={`ms-page-btn${p === page ? " active" : ""}`}>
                  {p}
                </Link>
              ))}
              {page < totalPages && <Link href={`/${category}?page=${page + 1}`} className="ms-page-btn">→</Link>}
            </div>
          )}
        </div>
      </section>

      <section className="ms-cat-seo">
        <div className="ms-wrap">
          {hasSeoContent ? (
            <div className="ms-cat-seo-inner">
              <div>
                <h2>{seoH2 ?? `Tout savoir sur ${label}`}</h2>
                <div className="ms-divider" />
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
                <div className="ms-divider" />
                <h3>{seoCol2Title ?? "Ce qu'il faut savoir"}</h3>
                <p>{seoCol2Body ?? `Le domaine de ${label} est vaste et en constante évolution.`}</p>
                {seoFaq && seoFaq.map((item, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3 style={{ marginTop: 16 }}>{item.q}</h3>
                    <p>{item.a}</p>
                  </div>
                ))}
                {!seoFaq && (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <h3>Comment choisir le bon professionnel ?</h3>
                      <p>Vérifiez les certifications, lisez les avis clients et demandez toujours plusieurs devis.</p>
                    </div>
                    <div>
                      <h3>Quel budget prévoir ?</h3>
                      <p>Les coûts varient fortement selon le projet. Nos articles détaillent les fourchettes de prix.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="ms-cat-seo-placeholder">
              <p>Le contenu de cette rubrique arrive bientôt.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
