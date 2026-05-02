"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  category: string | null;
  status: string;
  imageUrl: string | null;
  publishedAt: string | null;
  subject: string | null;
  keyword: string | null;
  wordCount: number | null;
  generationLog: unknown;
  siteId: string;
  site: { id: string; name: string; url: string; categories: string[] };
}

function fmtBtn(active: boolean): React.CSSProperties {
  return {
    padding: "4px 7px", borderRadius: 6, border: "none", cursor: "pointer",
    background: active ? "var(--accent-bg)" : "transparent",
    color: active ? "var(--accent-light)" : "var(--text-muted)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.1s, color 0.1s",
  };
}

const panelInputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", borderRadius: 7,
  background: "var(--bg-secondary)", border: "1px solid var(--border)",
  color: "var(--text-primary)", fontSize: 13, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block", fontSize: 11, color: "var(--text-muted)",
        marginBottom: 5, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [tab, setTab] = useState<"preview" | "html">("preview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Toolbar flottante
  const [toolbar, setToolbar] = useState<{ x: number; y: number } | null>(null);
  const [linkMode, setLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNofollow, setLinkNofollow] = useState(false);
  const savedRangeRef = useRef<Range | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const linkModeRef = useRef(false);

  // Barre de formatage fixe
  const [activeBlock, setActiveBlock] = useState("p"); // tag du bloc courant
  const [imgPanel, setImgPanel] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const savedRangeForImg = useRef<Range | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${id}`).then(r => r.json()).then(setArticle);
  }, [id]);

  // Injecte le contenu dans le contenteditable :
  // - au chargement initial de l'article (article.id change)
  // - quand on revient sur l'onglet preview
  const articleIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!previewRef.current || tab !== "preview" || !article) return;
    // Injecte seulement si on vient de charger l'article OU si on switche d'onglet
    if (articleIdRef.current !== article.id || tab === "preview") {
      previewRef.current.innerHTML = article.content;
      articleIdRef.current = article.id;
    }
  }, [tab, article?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof Article>(key: K, value: Article[K]) {
    setArticle(a => a ? { ...a, [key]: value } : a);
  }

  async function save() {
    if (!article) return;
    setSaving(true);
    if (previewRef.current && tab === "preview") {
      article.content = previewRef.current.innerHTML;
    }
    await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // ── Toolbar helpers ──
  const handleSelectionChange = useCallback(() => {
    if (tab !== "preview") return;
    // Si on est en mode saisie de lien, on ne touche pas à la toolbar
    if (linkModeRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setToolbar(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!previewRef.current?.contains(range.commonAncestorContainer)) {
      setToolbar(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    setToolbar({ x: rect.left + rect.width / 2, y: rect.top - 8 });
  }, [tab]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  useEffect(() => { linkModeRef.current = linkMode; }, [linkMode]);

  function exec(cmd: string, value?: string) {
    previewRef.current?.focus();
    document.execCommand(cmd, false, value);
    if (previewRef.current) set("content", previewRef.current.innerHTML);
  }

  function formatBlock(tag: string) {
    previewRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    setActiveBlock(tag);
    if (previewRef.current) set("content", previewRef.current.innerHTML);
  }

  function detectActiveBlock() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    let node: Node | null = sel.getRangeAt(0).startContainer;
    while (node && node !== previewRef.current) {
      if (node.nodeType === 1) {
        const tag = (node as Element).tagName.toLowerCase();
        if (["h2","h3","h4","h5","blockquote","p","li"].includes(tag)) {
          setActiveBlock(tag);
          return;
        }
      }
      node = node.parentNode;
    }
    setActiveBlock("p");
  }

  function insertImage() {
    if (!imgUrl.trim()) return;
    const sel = window.getSelection();
    if (savedRangeForImg.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeForImg.current);
    }
    previewRef.current?.focus();
    const alt = imgAlt.trim() || "";
    document.execCommand("insertHTML", false,
      `<figure style="margin:1.5em 0;text-align:center"><img src="${imgUrl.trim()}" alt="${alt}" style="max-width:100%;border-radius:8px" />${alt ? `<figcaption style="font-size:13px;color:#888;margin-top:6px">${alt}</figcaption>` : ""}</figure>`
    );
    if (previewRef.current) set("content", previewRef.current.innerHTML);
    setImgPanel(false);
    setImgUrl("");
    setImgAlt("");
  }

  function closeLinkMode() {
    linkModeRef.current = false;
    setLinkMode(false);
    setLinkUrl("");
    setToolbar(null);
  }

  function insertLink() {
    if (!linkUrl.trim()) return;
    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
    previewRef.current?.focus();
    const rel = linkNofollow ? ' rel="nofollow"' : '';
    const selectedText = savedRangeRef.current ? savedRangeRef.current.toString() : "";
    document.execCommand("insertHTML", false, `<a href="${linkUrl}"${rel}>${selectedText}</a>`);
    if (previewRef.current) set("content", previewRef.current.innerHTML);
    closeLinkMode();
  }

  async function refreshImage() {
    const query = article?.keyword ?? article?.subject ?? article?.title ?? "nature";
    const url = `https://source.unsplash.com/800x450/?${encodeURIComponent(query)}&sig=${Date.now()}`;
    set("imageUrl", url);
  }

  if (!article) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
        Chargement…
      </div>
    );
  }

  function tbBtn(): React.CSSProperties {
    return {
      background: "none", border: "none", cursor: "pointer",
      color: "#fff", padding: "4px 7px", borderRadius: 5,
      display: "flex", alignItems: "center", justifyContent: "center",
      lineHeight: 1,
    };
  }

  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "7px 10px", borderRadius: 7,
    background: "var(--input-bg)", border: "1px solid var(--border)",
    color: "var(--text-primary)", fontSize: 13, outline: "none",
    fontFamily: "inherit", cursor: "pointer", appearance: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── TOOLBAR FLOTTANTE ── */}
      {toolbar && tab === "preview" && (
        <div
          ref={toolbarRef}
          style={{
            position: "fixed",
            left: toolbar.x,
            top: toolbar.y,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
            background: "#1e1e1e",
            borderRadius: 8,
            padding: "4px 6px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            userSelect: "none",
          }}
          onMouseDown={e => e.preventDefault()}
        >
          {!linkMode ? (
            <>
              {/* Gras */}
              <button onClick={() => exec("bold")} title="Gras" style={tbBtn()}>
                <strong style={{ fontSize: 13 }}>B</strong>
              </button>
              {/* Italique */}
              <button onClick={() => exec("italic")} title="Italique" style={tbBtn()}>
                <em style={{ fontSize: 13 }}>I</em>
              </button>
              {/* Souligné */}
              <button onClick={() => exec("underline")} title="Souligné" style={tbBtn()}>
                <span style={{ fontSize: 13, textDecoration: "underline" }}>U</span>
              </button>
              {/* Barré */}
              <button onClick={() => exec("strikeThrough")} title="Barré" style={tbBtn()}>
                <span style={{ fontSize: 13, textDecoration: "line-through" }}>S</span>
              </button>
              <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)", margin: "0 3px" }} />
              {/* Lien */}
              <button
                onMouseDown={e => {
                  e.preventDefault();
                  const sel = window.getSelection();
                  if (sel?.rangeCount) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
                  linkModeRef.current = true;
                  setLinkMode(true);
                  setLinkUrl("");
                  setLinkNofollow(false);
                }}
                title="Insérer un lien"
                style={tbBtn()}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </button>
              {/* Supprimer lien */}
              <button onClick={() => exec("unlink")} title="Supprimer le lien" style={tbBtn()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  <line x1="2" y1="2" x2="22" y2="22"/>
                </svg>
              </button>
              <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)", margin: "0 3px" }} />
              {/* Effacer format */}
              <button onClick={() => exec("removeFormat")} title="Effacer la mise en forme" style={tbBtn()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/><line x1="3" y1="3" x2="21" y2="21"/>
                </svg>
              </button>
            </>
          ) : (
            /* Mode saisie de lien */
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 4px" }}>
              <input
                autoFocus
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") insertLink(); if (e.key === "Escape") setLinkMode(false); }}
                placeholder="https://..."
                style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 5, padding: "4px 8px", color: "#fff", fontSize: 12,
                  outline: "none", width: 220, fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => setLinkNofollow(v => !v)}
                title={linkNofollow ? "Nofollow activé" : "Dofollow (défaut)"}
                style={{
                  ...tbBtn(),
                  background: linkNofollow ? "rgba(239,68,68,0.3)" : "transparent",
                  border: `1px solid ${linkNofollow ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: 5, padding: "3px 7px", fontSize: 10, fontWeight: 700,
                  color: linkNofollow ? "#fca5a5" : "rgba(255,255,255,0.5)",
                }}
              >
                {linkNofollow ? "nofollow" : "dofollow"}
              </button>
              <button onMouseDown={e => { e.preventDefault(); insertLink(); }} style={{ ...tbBtn(), background: "var(--accent)", borderRadius: 5, padding: "3px 8px", fontSize: 12, fontWeight: 600 }}>
                OK
              </button>
              <button onMouseDown={e => { e.preventDefault(); closeLinkMode(); }} style={{ ...tbBtn(), fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div style={{
        height: 56, flexShrink: 0,
        display: "flex", alignItems: "center", gap: 10,
        padding: "0 20px",
        background: "var(--topbar-bg)",
        borderBottom: "1px solid var(--border)",
      }}>
        <button onClick={() => router.push("/admin/articles")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
          </svg>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {article.title || "Sans titre"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{article.site?.name}</div>
        </div>

        <select
          value={article.status}
          onChange={e => set("status", e.target.value)}
          style={{ ...selectStyle, width: "auto", paddingRight: 28, minWidth: 110, fontSize: 12 }}
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="scheduled">Planifié</option>
        </select>

        {saved && <span style={{ fontSize: 12, color: "var(--success)", flexShrink: 0 }}>Enregistré ✓</span>}

        <button onClick={save} disabled={saving}
          style={{
            padding: "7px 16px", borderRadius: 7, background: "var(--accent)",
            border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, flexShrink: 0,
          }}>
          {saving ? "…" : "Enregistrer"}
        </button>

        <button
          onClick={async () => {
            set("status", "published");
            article.status = "published";
            await save();
          }}
          style={{
            padding: "7px 16px", borderRadius: 7,
            background: "var(--success)", border: "none",
            color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, flexShrink: 0,
            display: "flex", alignItems: "center", gap: 6,
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Publier
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── LEFT PANEL 380px ── */}
        <div style={{
          width: 380, flexShrink: 0,
          borderRight: "1px solid var(--border)",
          overflowY: "auto",
          padding: "16px 18px",
          background: "var(--bg-secondary)",
        }}>

          {/* Titre H1 */}
          <Field label="Titre H1">
            <textarea
              className="cms-input"
              value={article.title}
              onChange={e => set("title", e.target.value)}
              rows={2}
              placeholder="Titre de l'article"
              style={{ resize: "vertical", fontWeight: 600, fontSize: 14 }}
            />
          </Field>

          {/* Introduction */}
          <Field label="Introduction">
            <textarea
              className="cms-input"
              value={article.metaDescription ?? ""}
              onChange={e => set("metaDescription", e.target.value || null)}
              rows={3}
              placeholder="Introduction de l'article (visible sous le titre)"
              style={{ resize: "vertical" }}
            />
          </Field>

          <div style={{ height: 1, background: "var(--border)", margin: "4px 0 18px" }} />

          {/* Image à la une */}
          <Field label="Image à la une">
            <div style={{ position: "relative", marginBottom: 8 }}>
              {article.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt=""
                  style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, display: "block", border: "1px solid var(--border)" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: 150, borderRadius: 8,
                  background: "var(--bg-tertiary)", border: "1px dashed var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)", fontSize: 12,
                }}>
                  Aucune image
                </div>
              )}
              <button onClick={refreshImage} title="Nouvelle image Unsplash"
                style={{
                  position: "absolute", top: 8, right: 8,
                  background: "rgba(0,0,0,0.55)", border: "none", borderRadius: 6,
                  color: "#fff", cursor: "pointer", padding: "5px 7px",
                  display: "flex", alignItems: "center", gap: 4, fontSize: 11,
                }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Unsplash
              </button>
            </div>
            <input
              className="cms-input"
              value={article.imageUrl ?? ""}
              onChange={e => set("imageUrl", e.target.value || null)}
              placeholder="https://images.unsplash.com/…"
            />
          </Field>

          {/* Sujet */}
          <Field label="Sujet">
            <input
              className="cms-input"
              value={article.subject ?? ""}
              onChange={e => set("subject", e.target.value || null)}
              placeholder="Ex: Les nouvelles règles de l'assurance auto…"
            />
          </Field>

          {/* Mot-clé */}
          <Field label="Mot-clé principal">
            <input
              className="cms-input"
              value={article.keyword ?? ""}
              onChange={e => set("keyword", e.target.value || null)}
              placeholder="Ex: assurance auto senior"
            />
          </Field>

          {/* Catégorie */}
          <Field label="Catégorie">
            <input
              className="cms-input"
              value={article.category ?? ""}
              onChange={e => set("category", e.target.value || null)}
              placeholder="Ex: Assurance"
            />
          </Field>

          <div style={{ height: 1, background: "var(--border)", margin: "18px 0" }} />

          {/* Meta titre */}
          <Field label="Meta titre">
            <input
              className="cms-input"
              value={article.metaTitle ?? ""}
              onChange={e => set("metaTitle", e.target.value || null)}
              placeholder="Titre SEO (60 car. max)"
              maxLength={80}
            />
            {article.metaTitle && (
              <div style={{ fontSize: 10, color: article.metaTitle.length > 60 ? "var(--danger)" : "var(--text-muted)", marginTop: 3 }}>
                {article.metaTitle.length} / 60 caractères
              </div>
            )}
          </Field>

          {/* Meta description */}
          <Field label="Meta description">
            <textarea
              className="cms-input"
              value={article.metaDescription ?? ""}
              onChange={e => set("metaDescription", e.target.value || null)}
              rows={3}
              placeholder="Description SEO (160 car. max)"
              maxLength={200}
              style={{ resize: "vertical" }}
            />
            {article.metaDescription && (
              <div style={{ fontSize: 10, color: article.metaDescription.length > 160 ? "var(--danger)" : "var(--text-muted)", marginTop: 3 }}>
                {article.metaDescription.length} / 160 caractères
              </div>
            )}
          </Field>

          {/* Slug */}
          <Field label="Slug">
            <input
              className="cms-input"
              value={article.slug}
              onChange={e => set("slug", e.target.value)}
              placeholder="mon-article-slug"
              style={{ fontFamily: "monospace", fontSize: 12 }}
            />
          </Field>

        </div>

        {/* ── RIGHT EDITOR ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "center",
            padding: "0 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--topbar-bg)",
            flexShrink: 0,
          }}>
            {(["preview", "html"] as const).map(t => (
              <button key={t} className={`tab-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {t === "preview" ? "Aperçu" : "HTML"}
              </button>
            ))}
            <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>
              {article.content
                ? `~${article.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length} mots`
                : ""}
            </div>
          </div>

          {/* Barre de formatage — visible uniquement en mode aperçu */}
          {tab === "preview" && (
            <div style={{
              display: "flex", alignItems: "center", gap: 2,
              padding: "6px 16px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              flexShrink: 0, flexWrap: "wrap",
            }}>
              {/* Blocs */}
              {([
                { tag: "p",           label: "¶",   title: "Paragraphe" },
                { tag: "h2",          label: "H2",  title: "Titre H2" },
                { tag: "h3",          label: "H3",  title: "Titre H3" },
                { tag: "h4",          label: "H4",  title: "Titre H4" },
                { tag: "blockquote",  label: "❝",   title: "Citation" },
              ] as { tag: string; label: string; title: string }[]).map(b => (
                <button
                  key={b.tag}
                  title={b.title}
                  onMouseDown={e => { e.preventDefault(); formatBlock(b.tag); }}
                  style={{
                    padding: "4px 9px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: b.tag.startsWith("h") ? 11 : 13, fontWeight: 700,
                    background: activeBlock === b.tag ? "var(--accent-bg)" : "transparent",
                    color: activeBlock === b.tag ? "var(--accent-light)" : "var(--text-muted)",
                    transition: "background 0.1s, color 0.1s",
                  }}
                >
                  {b.label}
                </button>
              ))}

              <div style={{ width: 1, height: 18, background: "var(--border)", margin: "0 4px" }} />

              {/* Listes */}
              <button title="Liste à puces" onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }}
                style={fmtBtn(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
                  <circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/>
                </svg>
              </button>
              <button title="Liste numérotée" onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }}
                style={fmtBtn(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
                  <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
                </svg>
              </button>

              <div style={{ width: 1, height: 18, background: "var(--border)", margin: "0 4px" }} />

              {/* Image */}
              <div style={{ position: "relative" }}>
                <button
                  title="Insérer une image"
                  onMouseDown={e => {
                    e.preventDefault();
                    const sel = window.getSelection();
                    if (sel?.rangeCount) savedRangeForImg.current = sel.getRangeAt(0).cloneRange();
                    setImgPanel(v => !v);
                    setImgUrl("");
                    setImgAlt("");
                  }}
                  style={{
                    ...fmtBtn(imgPanel),
                    background: imgPanel ? "var(--accent-bg)" : "transparent",
                    color: imgPanel ? "var(--accent-light)" : "var(--text-muted)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
                  </svg>
                </button>

                {imgPanel && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100,
                    background: "var(--bg-primary)", border: "1px solid var(--border)",
                    borderRadius: 10, padding: "14px 16px", width: 320,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                      Insérer une image
                    </div>
                    <input
                      autoFocus
                      value={imgUrl}
                      onChange={e => setImgUrl(e.target.value)}
                      placeholder="URL de l'image…"
                      style={panelInputStyle}
                    />
                    <input
                      value={imgAlt}
                      onChange={e => setImgAlt(e.target.value)}
                      placeholder="Légende / texte alternatif (optionnel)"
                      style={{ ...panelInputStyle, marginTop: 8 }}
                      onKeyDown={e => e.key === "Enter" && insertImage()}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button
                        onMouseDown={e => { e.preventDefault(); insertImage(); }}
                        disabled={!imgUrl.trim()}
                        style={{
                          flex: 1, padding: "7px 0", borderRadius: 7, border: "none",
                          background: imgUrl.trim() ? "var(--accent)" : "var(--border)",
                          color: imgUrl.trim() ? "#fff" : "var(--text-muted)",
                          fontSize: 12, fontWeight: 600, cursor: imgUrl.trim() ? "pointer" : "default",
                        }}
                      >
                        Insérer
                      </button>
                      <button
                        onMouseDown={e => { e.preventDefault(); setImgPanel(false); }}
                        style={{ padding: "7px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer" }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Trait horizontal */}
              <button title="Séparateur horizontal" onMouseDown={e => { e.preventDefault(); exec("insertHorizontalRule"); }}
                style={fmtBtn(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                </svg>
              </button>
            </div>
          )}

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>

            {tab === "preview" && (
              <div
                ref={previewRef}
                contentEditable
                suppressContentEditableWarning
                className="article-preview"
                onInput={e => {
                  const html = (e.currentTarget as HTMLDivElement).innerHTML;
                  setArticle(a => a ? { ...a, content: html } : a);
                }}
                onKeyUp={detectActiveBlock}
                onClick={detectActiveBlock}
                style={{
                  width: "100%", minHeight: 400, outline: "none",
                  color: "var(--text-primary)", fontSize: 15, lineHeight: 1.75,
                  background: "var(--input-bg)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "14px 40px",
                  display: "block",
                  caretColor: "var(--accent)",
                }}
              />
            )}

            {tab === "html" && (
              <textarea
                value={article.content}
                onChange={e => {
                  set("content", e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                ref={el => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
                style={{
                  width: "100%", height: "auto",
                  background: "var(--input-bg)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "14px 16px",
                  color: "var(--text-primary)", fontSize: 12,
                  fontFamily: "monospace", lineHeight: 1.6,
                  outline: "none", resize: "none", overflow: "hidden",
                  display: "block",
                }}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
