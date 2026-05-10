"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: string;
  createdAt: string;
  imageUrl: string | null;
  keyword: string | null;
  site: { name: string; url: string };
}

interface Category {
  id: string;
  label: string;
  slug: string;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  published: "Publié",
  scheduled: "Planifié",
  duplicate: "Problème doublon",
};

const STRINGS = {
  pageTitle:           { fr: "Articles",                                en: "Articles" },
  searchPlaceholder:   { fr: "Rechercher…",                             en: "Search…" },
  allStatuses:         { fr: "Tous les statuts",                        en: "All statuses" },
  allCategories:       { fr: "Toutes catégories",                       en: "All categories" },
  allSites:            { fr: "Tous les sites",                          en: "All sites" },
  reset:               { fr: "Réinitialiser",                           en: "Reset" },
  doublons:            { fr: "Doublons",                                en: "Duplicates" },
  imageMissing:        { fr: "Image manquante",                         en: "Missing image" },
  allArticles:         { fr: "Tous les articles",                       en: "All articles" },
  newArticle:          { fr: "Nouvel article",                          en: "New article" },
  colTitle:            { fr: "Titre",                                   en: "Title" },
  colKeyword:          { fr: "Mot-clé principal",                       en: "Main keyword" },
  colCategory:         { fr: "Catégorie",                               en: "Category" },
  colStatus:           { fr: "Statut",                                  en: "Status" },
  colDate:             { fr: "Date",                                    en: "Date" },
  colImageUrl:         { fr: "URL image à la une",                      en: "Featured image URL" },
  loading:             { fr: "Chargement…",                             en: "Loading…" },
  emptyAll:            { fr: "Aucun article trouvé",                    en: "No articles found" },
  emptyMissing:        { fr: "Tous les articles ont une image à la une 🎉", en: "All articles have a featured image 🎉" },
  publish:             { fr: "Publier",                                 en: "Publish" },
  edit:                { fr: "Éditer",                                  en: "Edit" },
  del:                 { fr: "Suppr.",                                  en: "Del." },
  save:                { fr: "Sauver",                                  en: "Save" },
  saving:              { fr: "…",                                       en: "…" },
  statusDraft:         { fr: "Brouillon",                               en: "Draft" },
  statusPublished:     { fr: "Publié",                                  en: "Published" },
  statusScheduled:     { fr: "Planifié",                                en: "Scheduled" },
  statusDuplicate:     { fr: "Problème doublon",                        en: "Duplicate issue" },
  noCategory:          { fr: "— ajouter",                               en: "— add" },
  langButton:          { fr: "EN",                                      en: "FR" },
  langTooltip:         { fr: "Switch to English",                       en: "Passer en français" },
} as const;

function statusLabel(status: string, lang: "fr" | "en"): string {
  switch (status) {
    case "draft": return lang === "fr" ? "Brouillon" : "Draft";
    case "published": return lang === "fr" ? "Publié" : "Published";
    case "scheduled": return lang === "fr" ? "Planifié" : "Scheduled";
    case "duplicate": return lang === "fr" ? "Problème doublon" : "Duplicate issue";
    default: return status;
  }
}

const STATUS_COLORS: Record<string, string> = {
  draft: "badge badge-draft",
  published: "badge badge-published",
  scheduled: "badge badge-scheduled",
  duplicate: "badge badge-duplicate",
};

interface DuplicateGroup {
  key: string;
  reason: "title" | "slug";
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
    publishedAt: string | null;
    site: { name: string; url: string };
  }>;
}

type SortKey = "title" | "keyword" | "category" | "status" | "createdAt";
type SortDir = "asc" | "desc";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles]     = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  // Filtres
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [siteFilter, setSiteFilter]       = useState("all");

  // Tri
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const PAGE_SIZE = 50;
  const [page, setPage] = useState(1);

  // Modal création
  const [showModal, setShowModal]   = useState(false);
  const [newTitle, setNewTitle]     = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus]   = useState("draft");
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Confirm suppression
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // article id

  // Duplicates
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [resolvingDuplicates, setResolvingDuplicates] = useState(false);
  const [confirmAutoFix, setConfirmAutoFix] = useState(false);

  // Selection + inline category edit
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [bulkCatValue, setBulkCatValue] = useState("");

  // Image manquante mode
  const [imageMissingMode, setImageMissingMode] = useState(false);
  const [imageDrafts, setImageDrafts] = useState<Record<string, string>>({});
  const [savingImage, setSavingImage] = useState<string | null>(null);

  // Role + i18n
  const [role, setRole] = useState<"admin" | "worker" | null>(null);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const isWorker = role === "worker";
  const t = (key: keyof typeof STRINGS) => STRINGS[key]?.[lang] ?? key;

  // Hydrate language preference from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("cms_lang");
    if (saved === "fr" || saved === "en") setLang(saved);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("cms_lang", lang);
  }, [lang]);

  // Fetch current role; force image-missing mode for workers
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then((data: { role?: "admin" | "worker" } | null) => {
        if (!data?.role) { setRole("admin"); return; }
        setRole(data.role);
        if (data.role === "worker") setImageMissingMode(true);
      })
      .catch(() => setRole("admin"));
  }, []);

  async function load() {
    const requests: Promise<Response>[] = [fetch("/api/articles")];
    // Workers don't need /api/categories (admin-only) and the bulk-edit
    // dropdown they can't use anyway.
    if (!isWorker) requests.push(fetch("/api/categories"));
    const responses = await Promise.all(requests);
    setArticles(await responses[0].json());
    if (responses[1]) setCategories(await responses[1].json());
    setLoading(false);
  }

  useEffect(() => { if (role) load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [role]);

  useEffect(() => {
    if (showModal) setTimeout(() => titleInputRef.current?.focus(), 50);
    else { setNewTitle(""); setNewCategory(""); setNewStatus("draft"); setCreateError(""); }
  }, [showModal]);

  async function deleteArticle(id: string) {
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    load();
  }

  async function openDuplicates() {
    setShowDuplicates(true);
    setLoadingDuplicates(true);
    const res = await fetch("/api/admin/articles/duplicates");
    const data = await res.json();
    setDuplicateGroups(data.groups ?? []);
    setLoadingDuplicates(false);
  }

  async function autoFixDuplicates() {
    setResolvingDuplicates(true);
    await fetch("/api/admin/articles/duplicates", { method: "POST" });
    setResolvingDuplicates(false);
    setConfirmAutoFix(false);
    const res = await fetch("/api/admin/articles/duplicates");
    const data = await res.json();
    setDuplicateGroups(data.groups ?? []);
    load();
  }

  async function deleteFromGroup(id: string) {
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setDuplicateGroups(prev =>
      prev
        .map(g => ({ ...g, articles: g.articles.filter(a => a.id !== id) }))
        .filter(g => g.articles.length > 1),
    );
    load();
  }

  async function saveImageUrl(id: string) {
    const draft = (imageDrafts[id] ?? "").trim();
    setSavingImage(id);
    const res = await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: draft }),
    });
    setSavingImage(null);
    if (!res.ok) { alert("Erreur lors de la sauvegarde de l'image."); return; }
    setArticles(prev => prev.map(a => a.id === id ? { ...a, imageUrl: draft || null } : a));
    setImageDrafts(prev => { const next = { ...prev }; delete next[id]; return next; });
  }

  function toggleImageMissingMode() {
    setImageMissingMode(m => !m);
    setPage(1);
    setSelected(new Set());
  }

  async function updateCategory(id: string, category: string) {
    await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: category || null }),
    });
    setArticles(prev => prev.map(a => a.id === id ? { ...a, category: category || null } : a));
    setEditingCatId(null);
  }

  async function bulkUpdateCategory() {
    await Promise.all([...selected].map(id =>
      fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: bulkCatValue || null }),
      })
    ));
    setArticles(prev => prev.map(a => selected.has(a.id) ? { ...a, category: bulkCatValue || null } : a));
    setSelected(new Set());
    setBulkCatValue("");
  }

  async function bulkDelete() {
    await Promise.all([...selected].map(id => fetch(`/api/articles/${id}`, { method: "DELETE" })));
    setArticles(prev => prev.filter(a => !selected.has(a.id)));
    setSelected(new Set());
  }

  async function bulkPublish() {
    await Promise.all([...selected].map(id =>
      fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      })
    ));
    setArticles(prev => prev.map(a => selected.has(a.id) ? { ...a, status: "published" } : a));
    setSelected(new Set());
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(a => a.id)));
  }

  async function createArticle() {
    if (!newTitle.trim()) { setCreateError("Le titre est requis."); return; }
    setCreating(true);
    setCreateError("");
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), category: newCategory || undefined, status: newStatus }),
    });
    setCreating(false);
    if (!res.ok) { setCreateError("Erreur lors de la création."); return; }
    const article = await res.json();
    router.push(`/admin/articles/${article.id}`);
  }

  // Sites uniques pour le filtre
  const uniqueSites = Array.from(new Set(articles.map(a => a.site.name)));

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = articles
    .filter(a => {
      if (imageMissingMode && a.imageUrl && a.imageUrl.trim() !== "") return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.title.toLowerCase().includes(q)
          && !a.site.name.toLowerCase().includes(q)
          && !(a.keyword?.toLowerCase().includes(q))) return false;
      }
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (categoryFilter !== "all" && (a.category ?? "") !== categoryFilter) return false;
      if (siteFilter !== "all" && a.site.name !== siteFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let va: string, vb: string;
      if (sortKey === "createdAt") { va = a.createdAt; vb = b.createdAt; }
      else if (sortKey === "keyword")  { va = a.keyword ?? ""; vb = b.keyword ?? ""; }
      else if (sortKey === "category") { va = a.category ?? ""; vb = b.category ?? ""; }
      else if (sortKey === "status") { va = a.status; vb = b.status; }
      else { va = a.title; vb = b.title; }
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters = [statusFilter !== "all", categoryFilter !== "all", siteFilter !== "all"].filter(Boolean).length;

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ opacity: 0.25, fontSize: 10, marginLeft: 4 }}>↕</span>;
    return <span style={{ fontSize: 10, marginLeft: 4, color: "var(--accent)" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div style={{ padding: "28px 28px", overflowY: "auto", flex: 1 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{t("pageTitle")}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            {filtered.length} / {articles.length} article{articles.length !== 1 ? "s" : ""}
            {activeFilters > 0 && !isWorker && <span style={{ marginLeft: 6, color: "var(--accent-light)" }}>({activeFilters} filtre{activeFilters > 1 ? "s" : ""})</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!isWorker && (
            <button
              onClick={openDuplicates}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 14px", borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)", color: "var(--text-secondary)",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {t("doublons")}
            </button>
          )}
          <button
            onClick={isWorker ? undefined : toggleImageMissingMode}
            disabled={isWorker}
            title={isWorker ? "Mode worker — accès limité aux images manquantes" : undefined}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 14px", borderRadius: 8,
              border: `1px solid ${imageMissingMode ? "var(--accent)" : "var(--border)"}`,
              background: imageMissingMode ? "var(--accent-bg)" : "var(--bg-secondary)",
              color: imageMissingMode ? "var(--accent-light)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: 600,
              cursor: isWorker ? "default" : "pointer",
              opacity: isWorker ? 0.85 : 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            {imageMissingMode && !isWorker ? t("allArticles") : t("imageMissing")}
          </button>
          <button
            onClick={() => setLang(l => l === "fr" ? "en" : "fr")}
            title={t("langTooltip")}
            aria-label={t("langTooltip")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 12px", borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)", color: "var(--text-secondary)",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "ui-monospace, monospace", letterSpacing: 0.5,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {t("langButton")}
          </button>
          {!isWorker && (
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 8, border: "none",
                background: "var(--accent)", color: "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t("newArticle")}
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder={t("searchPlaceholder")}
          style={{
            flex: "1 1 200px", maxWidth: 320, padding: "8px 12px", borderRadius: 8,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            color: "var(--text-primary)", fontSize: 13, outline: "none",
          }}
        />
        {!isWorker && (
          <>
            <Select value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }}>
              <option value="all">{t("allStatuses")}</option>
              <option value="draft">{statusLabel("draft", lang)}</option>
              <option value="published">{statusLabel("published", lang)}</option>
              <option value="scheduled">{statusLabel("scheduled", lang)}</option>
              <option value="duplicate">{statusLabel("duplicate", lang)}</option>
            </Select>
            <Select value={categoryFilter} onChange={v => { setCategoryFilter(v); setPage(1); }}>
              <option value="all">{t("allCategories")}</option>
              <option value="">{lang === "fr" ? "Sans catégorie" : "No category"}</option>
              {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
            </Select>
            {uniqueSites.length > 1 && (
              <Select value={siteFilter} onChange={v => { setSiteFilter(v); setPage(1); }}>
                <option value="all">{t("allSites")}</option>
                {uniqueSites.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            )}
            {activeFilters > 0 && (
              <button
                onClick={() => { setStatusFilter("all"); setCategoryFilter("all"); setSiteFilter("all"); setSearch(""); setPage(1); }}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer" }}
              >
                {t("reset")}
              </button>
            )}
          </>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
          padding: "10px 16px", background: "var(--accent-bg)", border: "1px solid var(--accent)",
          borderRadius: 10, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-light)", whiteSpace: "nowrap" }}>
            {selected.size} article{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, flexWrap: "wrap" }}>
            <select
              value={bulkCatValue}
              onChange={e => setBulkCatValue(e.target.value)}
              style={{
                padding: "6px 10px", borderRadius: 7,
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 12, outline: "none", cursor: "pointer",
              }}
            >
              <option value="">— Sans catégorie —</option>
              {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
            </select>
            <button
              onClick={bulkUpdateCategory}
              style={{
                padding: "6px 14px", borderRadius: 7, border: "none",
                background: "var(--accent)", color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              Changer la catégorie
            </button>
            <button
              onClick={bulkPublish}
              style={{
                padding: "6px 14px", borderRadius: 7, border: "none",
                background: "#16a34a", color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              Publier
            </button>
            <button
              onClick={bulkDelete}
              style={{
                padding: "6px 14px", borderRadius: 7, border: "1px solid var(--danger)",
                background: "transparent", color: "var(--danger)",
                fontSize: 12, cursor: "pointer",
              }}
            >
              Supprimer
            </button>
          </div>
          <button
            onClick={() => setSelected(new Set())}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}
          >×</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {!isWorker && (
                <th style={{ padding: "12px 16px", width: 36 }}>
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    ref={el => { if (el) el.indeterminate = selected.size > 0 && selected.size < filtered.length; }}
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
              )}
              {([
                { key: "title",     label: t("colTitle") },
                { key: "keyword",   label: t("colKeyword") },
                { key: "category",  label: t("colCategory") },
                { key: "status",    label: t("colStatus") },
                { key: "createdAt", label: t("colDate") },
              ] as { key: SortKey; label: string }[]).map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, color: sortKey === col.key ? "var(--accent-light)" : "var(--text-muted)",
                    fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5,
                    cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
                  }}
                >
                  {col.label}<SortIcon col={col.key} />
                </th>
              ))}
              {imageMissingMode && (
                <th style={{
                  padding: "12px 16px", textAlign: "left",
                  fontSize: 11, color: "var(--text-muted)",
                  fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5,
                  whiteSpace: "nowrap",
                }}>
                  {t("colImageUrl")}
                </th>
              )}
              {!isWorker && <th style={{ padding: "12px 16px" }} />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={isWorker ? (imageMissingMode ? 6 : 5) : (imageMissingMode ? 8 : 7)} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>{t("loading")}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={isWorker ? (imageMissingMode ? 6 : 5) : (imageMissingMode ? 8 : 7)} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                {imageMissingMode ? t("emptyMissing") : t("emptyAll")}
              </td></tr>
            ) : paginated.map(a => (
              <tr
                key={a.id}
                style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s", background: selected.has(a.id) ? "var(--accent-bg)" : undefined }}
                onMouseEnter={e => { if (!selected.has(a.id)) e.currentTarget.style.background = "var(--bg-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = selected.has(a.id) ? "var(--accent-bg)" : "transparent"; }}
              >
                {!isWorker && (
                  <td style={{ padding: "12px 16px" }}>
                    <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} style={{ cursor: "pointer" }} />
                  </td>
                )}
                <td style={{ padding: "12px 16px" }}>
                  {isWorker ? (
                    <span style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: 13 }}>{a.title}</span>
                  ) : (
                    <Link href={`/admin/articles/${a.id}`} style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500, fontSize: 13 }}>
                      {a.title}
                    </Link>
                  )}
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>/{a.slug}</div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>
                  {a.keyword
                    ? <span style={{ color: "var(--text-primary)" }}>{a.keyword}</span>
                    : <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>—</span>}
                </td>
                <td style={{ padding: "8px 16px", fontSize: 13 }}>
                  {!isWorker && editingCatId === a.id ? (
                    <select
                      autoFocus
                      value={a.category ?? ""}
                      onChange={e => updateCategory(a.id, e.target.value)}
                      onBlur={() => setEditingCatId(null)}
                      style={{
                        padding: "4px 8px", borderRadius: 6,
                        background: "var(--bg-primary)", border: "1px solid var(--accent)",
                        color: "var(--text-primary)", fontSize: 12, outline: "none", cursor: "pointer",
                      }}
                    >
                      <option value="">— Sans catégorie —</option>
                      {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                    </select>
                  ) : (
                    <span
                      onClick={isWorker ? undefined : () => setEditingCatId(a.id)}
                      title={isWorker ? undefined : "Cliquer pour modifier"}
                      style={{ cursor: isWorker ? "default" : "pointer" }}
                    >
                      {a.category
                        ? <span style={{ padding: "2px 8px", borderRadius: 20, background: "var(--bg-tertiary)", border: "1px solid var(--border)", fontSize: 11 }}>{a.category}</span>
                        : <span style={{ color: "var(--border)", fontSize: 12 }}>{t("noCategory")}</span>
                      }
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={STATUS_COLORS[a.status] ?? "badge badge-draft"}>
                    {statusLabel(a.status, lang)}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {new Date(a.createdAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                </td>
                {imageMissingMode && (
                  <td style={{ padding: "8px 16px", minWidth: 320 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="url"
                        value={imageDrafts[a.id] ?? a.imageUrl ?? ""}
                        onChange={e => setImageDrafts(prev => ({ ...prev, [a.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === "Enter") saveImageUrl(a.id); }}
                        placeholder="https://…"
                        style={{
                          flex: 1, padding: "6px 10px", borderRadius: 6,
                          background: "var(--bg-primary)", border: "1px solid var(--border)",
                          color: "var(--text-primary)", fontSize: 12, outline: "none",
                          fontFamily: "inherit",
                        }}
                      />
                      <button
                        onClick={() => saveImageUrl(a.id)}
                        disabled={savingImage === a.id || !(imageDrafts[a.id] ?? "").trim()}
                        style={{
                          padding: "6px 12px", borderRadius: 6, border: "none",
                          background: (imageDrafts[a.id] ?? "").trim() ? "var(--accent)" : "var(--border)",
                          color: (imageDrafts[a.id] ?? "").trim() ? "#fff" : "var(--text-muted)",
                          fontSize: 12, fontWeight: 600,
                          cursor: (imageDrafts[a.id] ?? "").trim() ? "pointer" : "default",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {savingImage === a.id ? t("saving") : t("save")}
                      </button>
                    </div>
                  </td>
                )}
                {!isWorker && (
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    {a.status !== "published" && a.status !== "duplicate" && (
                      <button onClick={async () => {
                        const res = await fetch(`/api/articles/${a.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "published" }),
                        });
                        if (res.status === 409) {
                          alert("Un article publié porte déjà ce titre — publication bloquée.");
                          setArticles(prev => prev.map(x => x.id === a.id ? { ...x, status: "duplicate" } : x));
                          return;
                        }
                        setArticles(prev => prev.map(x => x.id === a.id ? { ...x, status: "published" } : x));
                      }} style={{
                        padding: "4px 10px", borderRadius: 6, background: "#16a34a",
                        border: "none", color: "#fff",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>
                        {t("publish")}
                      </button>
                    )}
                    <Link href={`/admin/articles/${a.id}`} style={{
                      padding: "4px 10px", borderRadius: 6, background: "var(--bg-tertiary)",
                      border: "1px solid var(--border)", color: "var(--text-secondary)",
                      fontSize: 12, textDecoration: "none",
                    }}>
                      {t("edit")}
                    </Link>
                    <button onClick={() => setConfirmDelete(a.id)} style={{
                      padding: "4px 10px", borderRadius: 6, background: "none",
                      border: "1px solid transparent", color: "var(--danger)",
                      fontSize: 12, cursor: "pointer",
                    }}>
                      {t("del")}
                    </button>
                  </div>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length} articles
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                color: page === 1 ? "var(--text-muted)" : "var(--text-primary)",
                cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1,
              }}
            >← Précédent</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`d${i}`} style={{ padding: "6px 4px", fontSize: 12, color: "var(--text-muted)" }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    style={{
                      width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: page === p ? "var(--accent)" : "var(--bg-secondary)",
                      border: `1px solid ${page === p ? "var(--accent)" : "var(--border)"}`,
                      color: page === p ? "#fff" : "var(--text-primary)",
                      cursor: "pointer",
                    }}
                  >{p}</button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                color: page === totalPages ? "var(--text-muted)" : "var(--text-primary)",
                cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1,
              }}
            >Suivant →</button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDelete !== null}
        title="Supprimer l'article"
        message="Cette action est irréversible. L'article sera définitivement supprimé."
        confirmLabel="Supprimer"
        onConfirm={() => { if (confirmDelete) deleteArticle(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />

      <ConfirmModal
        open={confirmAutoFix}
        title="Auto-corriger les doublons"
        message={`${duplicateGroups.length} groupe${duplicateGroups.length > 1 ? "s" : ""} de doublons. Pour chaque groupe, on garde l'article publié (ou le plus ancien si tous ont le même statut) et on supprime les autres. Action irréversible.`}
        confirmLabel="Auto-corriger"
        onConfirm={autoFixDuplicates}
        onCancel={() => setConfirmAutoFix(false)}
      />

      {/* Duplicates modal */}
      {showDuplicates && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowDuplicates(false); }}
        >
          <div style={{
            background: "var(--bg-primary)", border: "1px solid var(--border)",
            borderRadius: 14, width: "100%", maxWidth: 820, maxHeight: "85vh",
            display: "flex", flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Articles en doublon</h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Détection par titre normalisé ou slug identique (au sein d'un même site).
                </p>
              </div>
              <button onClick={() => setShowDuplicates(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 2 }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {loadingDuplicates ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>Analyse en cours…</p>
              ) : duplicateGroups.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>
                  Aucun doublon détecté.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {duplicateGroups.map((g, gi) => (
                    <div key={gi} style={{
                      border: "1px solid var(--border)", borderRadius: 10,
                      background: "var(--bg-secondary)", overflow: "hidden",
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderBottom: "1px solid var(--border)",
                        background: "var(--bg-tertiary)",
                      }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {g.reason === "title" ? "Même titre" : "Même slug"} · {g.articles.length} articles
                        </span>
                      </div>
                      {g.articles.map(a => (
                        <div key={a.id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", borderTop: "1px solid var(--border)", gap: 12,
                        }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <Link href={`/admin/articles/${a.id}`} style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                              {a.title}
                            </Link>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                              /{a.slug} · {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <span className={STATUS_COLORS[a.status] ?? "badge badge-draft"}>
                            {STATUS_LABELS[a.status] ?? a.status}
                          </span>
                          <button
                            onClick={() => deleteFromGroup(a.id)}
                            style={{
                              padding: "4px 10px", borderRadius: 6, background: "none",
                              border: "1px solid var(--danger)", color: "var(--danger)",
                              fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
                            }}
                          >
                            Suppr.
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {duplicateGroups.length === 0
                  ? "—"
                  : `${duplicateGroups.length} groupe${duplicateGroups.length > 1 ? "s" : ""} · ${duplicateGroups.reduce((n, g) => n + g.articles.length - 1, 0)} suppression${duplicateGroups.reduce((n, g) => n + g.articles.length - 1, 0) > 1 ? "s" : ""} prévue${duplicateGroups.reduce((n, g) => n + g.articles.length - 1, 0) > 1 ? "s" : ""}`}
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowDuplicates(false)}
                  style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}
                >
                  Fermer
                </button>
                <button
                  onClick={() => setConfirmAutoFix(true)}
                  disabled={duplicateGroups.length === 0 || resolvingDuplicates}
                  style={{
                    padding: "9px 18px", borderRadius: 8, border: "none",
                    background: duplicateGroups.length === 0 ? "var(--border)" : "var(--accent)",
                    color: duplicateGroups.length === 0 ? "var(--text-muted)" : "#fff",
                    fontSize: 13, fontWeight: 600,
                    cursor: duplicateGroups.length === 0 ? "default" : "pointer",
                  }}
                >
                  {resolvingDuplicates ? "Suppression…" : "Auto-corriger les doublons"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal création */}
      {showModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            background: "var(--bg-primary)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "28px 28px", width: "100%", maxWidth: 460,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Nouvel article</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 2 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Titre</label>
                <input
                  ref={titleInputRef}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createArticle()}
                  placeholder="Ex: Comment choisir son parquet…"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Catégorie</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={inputStyle}>
                  <option value="">Sans catégorie</option>
                  {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Statut initial</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={inputStyle}>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>

            {createError && (
              <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 12 }}>{createError}</p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}
              >
                Annuler
              </button>
              <button
                onClick={createArticle}
                disabled={creating || !newTitle.trim()}
                style={{
                  padding: "9px 18px", borderRadius: 8, border: "none",
                  background: newTitle.trim() ? "var(--accent)" : "var(--border)",
                  color: newTitle.trim() ? "#fff" : "var(--text-muted)",
                  fontSize: 13, fontWeight: 600, cursor: newTitle.trim() ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: 7,
                }}
              >
                {creating ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Création…
                  </>
                ) : "Créer et éditer →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: "8px 12px", borderRadius: 8,
        background: "var(--bg-secondary)", border: "1px solid var(--border)",
        color: "var(--text-secondary)", fontSize: 13, outline: "none", cursor: "pointer",
      }}
    >
      {children}
    </select>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "var(--text-muted)", textTransform: "uppercase",
  letterSpacing: "0.08em", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  background: "var(--bg-secondary)", border: "1px solid var(--border)",
  color: "var(--text-primary)", fontSize: 13, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
};
