import Link from "next/link";
import { ArticleAISummary } from "../_shared/ArticleAISummary";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  imageUrl: string | null;
  imageAttribution: string | null;
  metaDescription: string | null;
  content: string;
  publishedAt: Date | null;
  wordCount: number | null;
};

type Props = {
  category: string;
  article: Article;
  related: Article[];
  articleUrl: string;
};

export function ArticlePageTheme1({ category, article, related, articleUrl }: Props) {
  return (
    <>
      <div className="ms-art-header">
        <div className="ms-wrap">
          <p className="ms-art-breadcrumb">
            <Link href="/">Accueil</Link>
            {article.category && (
              <> / <Link href={`/${category}`}>{article.category}</Link></>
            )}
            {" "}/&nbsp;{article.title.length > 50 ? article.title.slice(0, 50) + "…" : article.title}
          </p>

          <div className="ms-art-header-body">
            <div className="ms-art-header-text">
              {article.category && (
                <span className="ms-tag ms-tag--filled" style={{ marginBottom: 20 }}>
                  {article.category}
                </span>
              )}
              <h1 className="ms-art-h1">{article.title}</h1>
              {article.metaDescription && (
                <p className="ms-art-desc">{article.metaDescription}</p>
              )}
              <div className="ms-art-meta-row">
                {article.publishedAt && (
                  <span className="ms-art-meta-item">{fmt(article.publishedAt)}</span>
                )}
                {article.wordCount && (
                  <>
                    <span className="ms-art-meta-sep">·</span>
                    <span className="ms-art-meta-item">{Math.ceil(article.wordCount / 200)} min de lecture</span>
                  </>
                )}
              </div>
            </div>

            {article.imageUrl && (
              <div className="ms-art-header-img">
                <img src={article.imageUrl} alt={article.title} />
                {article.imageAttribution && (() => {
                  try {
                    const a = JSON.parse(article.imageAttribution) as { name: string; link: string };
                    return (
                      <p style={{ fontSize: 11, color: "var(--c-sand)", marginTop: 6, textAlign: "right" }}>
                        Photo : <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--c-sand)" }}>{a.name}</a> / <a href="https://unsplash.com?utm_source=pilot_cms&utm_medium=referral" target="_blank" rel="noopener noreferrer" style={{ color: "var(--c-sand)" }}>Unsplash</a>
                      </p>
                    );
                  } catch { return null; }
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--c-white)" }}>
        <div className="ms-art-layout">
          <div
            className="ms-art-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <aside className="ms-art-sidebar">
            <div className="ms-sidebar-block">
              <p className="ms-sidebar-block-title">Notre expertise</p>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--c-mid)" }}>
                Ce contenu est rédigé et vérifié par nos experts du secteur.
                Des questions ? Contactez notre équipe.
              </p>
              <Link href="/contact" className="ms-sidebar-cta">
                Nous contacter →
              </Link>
            </div>
          </aside>
        </div>
        <div className="ms-wrap">
          <ArticleAISummary articleTitle={article.title} articleUrl={articleUrl} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="ms-art-related">
          <div className="ms-wrap">
            <p className="ms-eyebrow" style={{ marginBottom: 10 }}>Dans la même rubrique</p>
            <h2 className="ms-section-title">Ces articles pourraient vous intéresser</h2>
            <div className="ms-divider" />
            <div className="ms-art-related-grid">
              {related.map((a) => (
                <article key={a.id} className="ms-cat-card">
                  <div className="ms-cat-card-img">
                    {a.imageUrl && <img src={a.imageUrl} alt={a.title} />}
                  </div>
                  <div className="ms-cat-card-body">
                    {a.category && <span className="ms-tag ms-tag--green">{a.category}</span>}
                    <h3 className="ms-cat-card-title">
                      <Link href={`/${catSlug(a.category)}/${a.slug}`}>{a.title}</Link>
                    </h3>
                    {a.metaDescription && (
                      <p className="ms-cat-card-excerpt">{a.metaDescription}</p>
                    )}
                    <span className="ms-date">{fmt(a.publishedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
