import Link from "next/link";

function fmt(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function excerpt(html: string, max = 130) {
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
  wordCount: number | null;
};

type Props = {
  category: string;
  article: Article;
  related: Article[];
};

export function ArticlePageTheme2({ category, article, related }: Props) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── THEME 2 ARTICLE ── */

        /* Breadcrumb */
        .t2a-breadcrumb {
          background: var(--c-cream-2);
          border-bottom: 1px solid var(--c-border);
          padding: 13px 0;
        }
        .t2a-breadcrumb-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--c-mid);
        }
        .t2a-breadcrumb a {
          color: var(--c-mid);
          text-decoration: none;
          transition: color 0.15s;
        }
        .t2a-breadcrumb a:hover { color: var(--c-green); }
        .t2a-breadcrumb-sep { opacity: 0.35; font-size: 10px; }
        .t2a-breadcrumb-current {
          color: var(--c-dark);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 360px;
        }

        /* En-tête article — 2 colonnes */
        .t2a-header {
          background: var(--c-dark);
          padding: 64px 0 0;
          overflow: hidden;
        }
        .t2a-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 56px;
          align-items: end;
        }
        .t2a-header-text {
          padding-bottom: 56px;
        }
        .t2a-header-cat {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 5px 14px;
          border-radius: 3px;
          text-decoration: none;
          margin-bottom: 22px;
          transition: background 0.15s;
        }
        .t2a-header-cat:hover { background: rgba(255,255,255,0.25); }
        .t2a-h1 {
          font-family: var(--f-display, Georgia, serif);
          font-size: clamp(26px, 3.2vw, 44px);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .t2a-desc {
          font-size: 16px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 560px;
        }
        .t2a-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .t2a-meta-date {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        .t2a-meta-sep { color: rgba(255,255,255,0.2); }
        .t2a-meta-read {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }

        /* Image — ancrée en bas de la colonne */
        .t2a-header-img-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 8px 8px 0 0;
          align-self: end;
        }
        .t2a-header-img {
          width: 100%;
          height: 380px;
          object-fit: cover;
          display: block;
        }

        /* Corps article */
        .t2a-body {
          background: var(--c-cream);
          padding: 64px 0 80px;
        }
        .t2a-body-inner {
          max-width: 920px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .t2a-content {
          font-size: 17px;
          line-height: 1.85;
          color: var(--c-dark);
        }
        .t2a-content h2 {
          font-family: var(--f-display, Georgia, serif);
          font-size: 26px;
          font-weight: 700;
          color: var(--c-dark);
          margin-top: 48px;
          margin-bottom: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--c-border);
        }
        .t2a-content h3 {
          font-size: 19px;
          font-weight: 600;
          color: var(--c-dark);
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .t2a-content p { margin-bottom: 20px; }
        .t2a-content ul, .t2a-content ol { margin: 0 0 20px 20px; }
        .t2a-content li { margin-bottom: 8px; }
        .t2a-content blockquote {
          border-left: 3px solid var(--c-terra);
          margin: 32px 0;
          padding: 4px 0 4px 24px;
          font-style: italic;
          color: var(--c-mid);
          font-size: 18px;
        }
        .t2a-content img { width: 100%; border-radius: 6px; margin: 24px 0; }
        .t2a-content a {
          color: var(--c-green);
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: text-decoration-color 0.15s;
        }
        .t2a-content a:hover { text-decoration-color: var(--c-green); }

        /* Bloc expert */
        .t2a-expert {
          max-width: 920px;
          margin: 48px auto 0;
          padding: 0 40px;
        }
        .t2a-expert-card {
          background: var(--c-dark);
          border-radius: 8px;
          padding: 28px 32px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }
        .t2a-expert-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--c-terra);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
        }
        .t2a-expert-title {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 5px;
        }
        .t2a-expert-text {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .t2a-expert-cta {
          font-size: 12px;
          font-weight: 600;
          color: var(--c-terra);
          text-decoration: none;
        }
        .t2a-expert-cta:hover { text-decoration: underline; }

        /* Articles similaires */
        .t2a-related {
          background: var(--c-cream-2);
          padding: 64px 0 72px;
          border-top: 1px solid var(--c-border);
        }
        .t2a-related-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .t2a-related-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          padding-bottom: 18px;
          border-bottom: 2px solid var(--c-dark);
        }
        .t2a-related-kicker {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--c-terra);
          display: block;
          margin-bottom: 5px;
        }
        .t2a-related-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 20px;
          font-weight: 700;
          color: var(--c-dark);
        }
        .t2a-related-all {
          font-size: 12px;
          font-weight: 600;
          color: var(--c-mid);
          text-decoration: none;
          transition: color 0.15s;
          border-bottom: 1px solid var(--c-border);
          padding-bottom: 2px;
        }
        .t2a-related-all:hover { color: var(--c-green); border-bottom-color: var(--c-green); }
        .t2a-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .t2a-related-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          background: var(--c-cream);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--c-border);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .t2a-related-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.09);
        }
        .t2a-related-img-wrap {
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: var(--c-border);
          flex-shrink: 0;
        }
        .t2a-related-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s;
        }
        .t2a-related-card:hover .t2a-related-img { transform: scale(1.04); }
        .t2a-related-body {
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .t2a-related-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .t2a-related-cat {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          background: var(--c-green);
          padding: 3px 8px;
          border-radius: 2px;
        }
        .t2a-related-date {
          font-size: 11px;
          color: var(--c-mid);
        }
        .t2a-related-art-title {
          font-family: var(--f-display, Georgia, serif);
          font-size: 16px;
          font-weight: 700;
          color: var(--c-dark);
          line-height: 1.35;
          margin-bottom: 10px;
        }
        .t2a-related-excerpt {
          font-size: 13px;
          color: var(--c-mid);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        @media (max-width: 900px) {
          .t2a-header-inner { grid-template-columns: 1fr; gap: 32px; }
          .t2a-header-img-wrap { border-radius: 8px; }
          .t2a-header-img { height: 260px; }
          .t2a-header-text { padding-bottom: 0; }
          .t2a-header { padding-bottom: 48px; }
        }
        @media (max-width: 768px) {
          .t2a-breadcrumb-inner, .t2a-header-inner, .t2a-body-inner, .t2a-expert, .t2a-related-inner { padding: 0 20px; }
          .t2a-h1 { font-size: 26px; }
          .t2a-desc { font-size: 15px; }
          .t2a-content { font-size: 16px; }
          .t2a-expert-card { flex-direction: column; padding: 24px; }
          .t2a-related-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}} />

      {/* Breadcrumb */}
      <div className="t2a-breadcrumb">
        <div className="t2a-breadcrumb-inner">
          <Link href="/">Accueil</Link>
          <span className="t2a-breadcrumb-sep">›</span>
          {article.category && (
            <>
              <Link href={`/${category}`}>{article.category}</Link>
              <span className="t2a-breadcrumb-sep">›</span>
            </>
          )}
          <span className="t2a-breadcrumb-current">
            {article.title.length > 55 ? article.title.slice(0, 55) + "…" : article.title}
          </span>
        </div>
      </div>

      {/* En-tête : texte gauche + image droite */}
      <div className="t2a-header">
        <div className="t2a-header-inner">
          <div className="t2a-header-text">
            {article.category && (
              <Link href={`/${category}`} className="t2a-header-cat">
                {article.category}
              </Link>
            )}
            <h1 className="t2a-h1">{article.title}</h1>
            {article.metaDescription && (
              <p className="t2a-desc">{article.metaDescription}</p>
            )}
            <div className="t2a-meta">
              {article.publishedAt && (
                <span className="t2a-meta-date">{fmt(article.publishedAt)}</span>
              )}
              {article.wordCount && (
                <>
                  <span className="t2a-meta-sep">·</span>
                  <span className="t2a-meta-read">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <circle cx="6" cy="6" r="5"/>
                      <path d="M6 3.5v2.5l1.5 1.5"/>
                    </svg>
                    {Math.ceil(article.wordCount / 200)} min de lecture
                  </span>
                </>
              )}
            </div>
          </div>

          {article.imageUrl && (
            <div className="t2a-header-img-wrap">
              <img src={article.imageUrl} alt={article.title} className="t2a-header-img" />
            </div>
          )}
        </div>
      </div>

      {/* Corps */}
      <div className="t2a-body">
        <div className="t2a-body-inner">
          <div className="t2a-content" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className="t2a-expert">
          <div className="t2a-expert-card">
            <div className="t2a-expert-icon">✍️</div>
            <div>
              <div className="t2a-expert-title">Contenu expert vérifié</div>
              <p className="t2a-expert-text">
                Cet article a été rédigé et relu par notre équipe d&apos;experts du secteur.
                Pour toute question, notre équipe est disponible.
              </p>
              <Link href="/contact" className="t2a-expert-cta">Contacter nos experts →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Articles similaires */}
      {related.length > 0 && (
        <section className="t2a-related">
          <div className="t2a-related-inner">
            <div className="t2a-related-head">
              <div>
                <span className="t2a-related-kicker">Dans la même rubrique</span>
                <div className="t2a-related-title">Ces articles pourraient vous intéresser</div>
              </div>
              <Link href={`/${category}`} className="t2a-related-all">Voir tous les articles →</Link>
            </div>
            <div className="t2a-related-grid">
              {related.map((a) => (
                <Link key={a.id} href={`/${catSlug(a.category)}/${a.slug}`} className="t2a-related-card">
                  <div className="t2a-related-img-wrap">
                    {a.imageUrl && (
                      <img src={a.imageUrl} alt={a.title} className="t2a-related-img" />
                    )}
                  </div>
                  <div className="t2a-related-body">
                    <div className="t2a-related-meta">
                      {a.category && <span className="t2a-related-cat">{a.category}</span>}
                      <span className="t2a-related-date">{fmt(a.publishedAt)}</span>
                    </div>
                    <div className="t2a-related-art-title">{a.title}</div>
                    <div className="t2a-related-excerpt">
                      {a.metaDescription ?? excerpt(a.content)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
