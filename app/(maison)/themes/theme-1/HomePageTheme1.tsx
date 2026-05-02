import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 120) {
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

export function HomePageTheme1({
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
  return (
    <>
      {/* ════════════════════════════════════════
          ZONE 1 — PRÉSENTATION (30%)
      ════════════════════════════════════════ */}
      <section className="ms-hero">
        <div className="ms-wrap">
          <div className="ms-hero-inner">
            <div className="ms-hero-content">
              <p className="ms-eyebrow">{home.heroEyebrow}</p>
              <h1 className="ms-hero-headline">
                {home.heroLine1}<br />
                <em>{home.heroLine2}</em>
              </h1>
              <p className="ms-hero-sub">{home.heroSub}</p>
              <Link href="#articles" className="ms-hero-cta">
                {home.heroCta}
              </Link>

              <div className="ms-reassurance">
                <div className="ms-reass-item">
                  <div className="ms-reass-num">{totalArticles}+</div>
                  <div className="ms-reass-label">Articles de conseil publiés</div>
                </div>
                <div className="ms-reass-item">
                  <div className="ms-reass-num">{totalCats}</div>
                  <div className="ms-reass-label">Domaines d&apos;expertise</div>
                </div>
                <div className="ms-reass-item">
                  <div className="ms-reass-num">100%</div>
                  <div className="ms-reass-label">Contenu rédigé par des experts</div>
                </div>
              </div>
            </div>

            <div className="ms-hero-visual">
              {(heroImageUrl ?? heroArt?.imageUrl) && (
                <img src={heroImageUrl ?? heroArt?.imageUrl ?? ""} alt="Maison & Conseil" />
              )}
              <div className="ms-hero-badges">
                <div className="ms-badge">
                  <span className="ms-badge-icon">🏆</span>
                  <div>
                    <div className="ms-badge-text">Contenu expert</div>
                    <div className="ms-badge-sub">Vérifié par nos spécialistes</div>
                  </div>
                </div>
                <div className="ms-badge">
                  <span className="ms-badge-icon">🔄</span>
                  <div>
                    <div className="ms-badge-text">Mis à jour régulièrement</div>
                    <div className="ms-badge-sub">Conseils toujours actuels</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ZONE 2 — DERNIERS ARTICLES (30%)
      ════════════════════════════════════════ */}
      <section className="ms-section ms-section--white" id="articles">
        <div className="ms-wrap">
          <div className="ms-articles-header">
            <div>
              <p className="ms-eyebrow" style={{ marginBottom: 10 }}>Actualités &amp; conseils</p>
              <h2 className="ms-section-title">Nos derniers articles</h2>
              <div className="ms-divider" />
            </div>
            <Link href="/immobilier" className="ms-see-all">Voir tous les articles</Link>
          </div>

          {heroArt && (
            <Link href={`/${catSlug(heroArt.category)}/${heroArt.slug}`} className="ms-art-featured-card">
              <div className="ms-art-featured-img">
                {heroArt.imageUrl && <img src={heroArt.imageUrl} alt={heroArt.title} />}
              </div>
              <div className="ms-art-featured-body">
                {heroArt.category && <span className="ms-tag ms-tag--filled">{heroArt.category}</span>}
                <h3 className="ms-art-featured-title">{heroArt.title}</h3>
                <p className="ms-art-featured-excerpt">
                  {heroArt.metaDescription ?? excerpt(heroArt.content)}
                </p>
                <div className="ms-art-featured-footer">
                  <span className="ms-date">{fmt(heroArt.publishedAt)}</span>
                  <span className="ms-art-read-more">Lire l&apos;article →</span>
                </div>
              </div>
            </Link>
          )}

          {cardArts.length > 0 && (
            <div className="ms-cards-grid">
              {cardArts.map((a) => (
                <article key={a.id} className="ms-card">
                  <Link href={`/${catSlug(a.category)}/${a.slug}`} className="ms-card-img-wrap">
                    {a.imageUrl && <img src={a.imageUrl} alt={a.title} />}
                  </Link>
                  <div className="ms-card-body">
                    {a.category && <span className="ms-tag ms-tag--green">{a.category}</span>}
                    <h3 className="ms-card-title">
                      <Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link>
                    </h3>
                    <p className="ms-card-excerpt">
                      {a.metaDescription ?? excerpt(a.content)}
                    </p>
                    <span className="ms-date">{fmt(a.publishedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {moreArts.length > 0 && (
            <div className="ms-compact-list">
              {moreArts.map((a) => (
                <div key={a.id} className="ms-compact-item">
                  <div className="ms-compact-img">
                    {a.imageUrl && <img src={a.imageUrl} alt={a.title} />}
                  </div>
                  <div className="ms-compact-body">
                    {a.category && <span className="ms-tag">{a.category}</span>}
                    <p className="ms-compact-title">
                      <Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link>
                    </p>
                    <p className="ms-compact-excerpt">{a.metaDescription ?? excerpt(a.content, 80)}</p>
                    <span className="ms-date">{fmt(a.publishedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          ZONE 3 — EXPERTISE (30%)
      ════════════════════════════════════════ */}
      <section className="ms-expertise-section">
        <div className="ms-expertise-header">
          <div className="ms-wrap">
            <p className="ms-eyebrow" style={{ color: "var(--c-sand)", marginBottom: 12 }}>{home.expertiseEyebrow}</p>
            <h2 className="ms-section-title" style={{ color: "var(--c-cream)", marginBottom: 0 }}>
              {home.expertiseTitle.split("\n").map((line, i) => (
                <span key={i}>{line}{i < home.expertiseTitle.split("\n").length - 1 && <br />}</span>
              ))}
            </h2>
          </div>
        </div>

        {expertiseCats.map((cat, i) => {
          const isLight = i === 1;
          const img = categoryHeroImages[cat];
          return (
            <div key={cat} style={{ maxWidth: 1200, marginLeft: "auto", marginRight: "auto" }}>
              <div className={`ms-exp-split${isLight ? " ms-exp-split--reverse ms-exp-split--light" : ""}`}>
                <div className="ms-exp-split-img">
                  {img && <img src={img} alt={cat} />}
                </div>
                <div className="ms-exp-split-body">
                  <p className="ms-exp-split-eyebrow" style={isLight ? { color: "var(--c-terra)" } : undefined}>
                    {cat}
                  </p>
                  <h3 className="ms-exp-split-title" style={isLight ? { color: "var(--c-dark)" } : undefined}>
                    Tout savoir sur {cat.toLowerCase()}
                  </h3>
                  <p className="ms-exp-split-text" style={isLight ? { color: "var(--c-mid)" } : undefined}>
                    Nos experts décryptent tous les aspects de {cat.toLowerCase()} pour vous aider
                    à prendre les meilleures décisions. Des conseils pratiques, des guides complets
                    et des retours d&apos;expérience concrets à votre disposition.
                  </p>
                  <ul className={`ms-exp-split-list${isLight ? " ms-exp-split-list--dark" : ""}`}>
                    <li>Guides pratiques et conseils d&apos;experts</li>
                    <li>Erreurs à éviter et bonnes pratiques</li>
                    <li>Tendances et actualités du secteur</li>
                    <li>Comparatifs et recommandations</li>
                  </ul>
                  <Link
                    href={`/${catSlug(cat)}`}
                    className={`ms-exp-split-cta${isLight ? " ms-exp-split-cta--dark" : ""}`}
                  >
                    Voir tous nos conseils →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {extraCats.length > 0 && (
        <section style={{ background: "var(--c-cream-2)", width: "100%" }}>
          <div className="ms-wrap" style={{ display: "flex", gap: 40, paddingTop: 72, paddingBottom: 80 }}>
            {extraCats.map((cat) => {
              const img = categoryHeroImages[cat];
              return (
                <div key={cat} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                  <Link href={`/${catSlug(cat)}`} style={{ display: "block", borderRadius: 14, overflow: "hidden", height: 320, position: "relative", marginBottom: 24 }}>
                    {img && <img src={img} alt={cat} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </Link>
                  <span className="ms-tag ms-tag--green" style={{ marginBottom: 10, display: "inline-block" }}>{cat}</span>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: 26, fontWeight: 700, color: "var(--c-dark)", marginBottom: 12 }}>
                    <Link href={`/${catSlug(cat)}`}>Tout savoir sur {cat.toLowerCase()}</Link>
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--c-mid)", lineHeight: 1.65, marginBottom: 16 }}>
                    Guides pratiques, conseils d&apos;experts et retours d&apos;expérience sur {cat.toLowerCase()} — tout ce qu&apos;il faut savoir.
                  </p>
                  <Link href={`/${catSlug(cat)}`} className="ms-cat-duo-cta" style={{ marginTop: "auto" }}>
                    Voir tous nos articles →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="ms-stats-bar">
        <div className="ms-wrap">
          <div className="ms-stats-inner">
            <div className="ms-stat">
              <span className="ms-stat-num">{totalArticles}+</span>
              <span className="ms-stat-label">Articles publiés</span>
            </div>
            <div className="ms-stat-sep" />
            <div className="ms-stat">
              <span className="ms-stat-num">{totalCats}</span>
              <span className="ms-stat-label">Domaines couverts</span>
            </div>
            <div className="ms-stat-sep" />
            <div className="ms-stat">
              <span className="ms-stat-num">100%</span>
              <span className="ms-stat-label">Gratuit &amp; sans pub</span>
            </div>
            <div className="ms-stat-sep" />
            <div className="ms-stat">
              <span className="ms-stat-num">🇫🇷</span>
              <span className="ms-stat-label">Marché français</span>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: "var(--c-dark)", color: "rgba(255,255,255,0.35)", textAlign: "center", padding: "28px 40px", fontFamily: "var(--f-heading, sans-serif)", fontSize: "12px", letterSpacing: "0.04em" }}>
        © {new Date().getFullYear()} Maison &amp; Conseil — Conseils d&apos;experts pour votre maison — Tous droits réservés
      </footer>
    </>
  );
}
