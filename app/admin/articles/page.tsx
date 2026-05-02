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
};

const STATUS_COLORS: Record<string, string> = {
  draft: "badge badge-draft",
  published: "badge badge-published",
  scheduled: "badge badge-scheduled",
};

type SortKey = "title" | "site" | "category" | "status" | "createdAt";
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

  async function load() {
    const [artRes, catRes] = await Promise.all([
      fetch("/api/articles"),
      fetch("/api/categories"),
    ]);
    setArticles(await artRes.json());
    setCategories(await catRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (showModal) setTimeout(() => titleInputRef.current?.focus(), 50);
    else { setNewTitle(""); setNewCategory(""); setNewStatus("draft"); setCreateError(""); }
  }, [showModal]);

  async function deleteArticle(id: string) {
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    load();
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
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.site.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (categoryFilter !== "all" && (a.category ?? "") !== categoryFilter) return false;
      if (siteFilter !== "all" && a.site.name !== siteFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let va: string, vb: string;
      if (sortKey === "createdAt") { va = a.createdAt; vb = b.createdAt; }
      else if (sortKey === "site")  { va = a.site.name; vb = b.site.name; }
      else if (sortKey === "category") { va = a.category ?? ""; vb = b.category ?? ""; }
      else if (sortKey === "status") { va = a.status; vb = b.status; }
      else { va = a.title; vb = b.title; }
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

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
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Articles</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            {filtered.length} / {articles.length} article{articles.length !== 1 ? "s" : ""}
            {activeFilters > 0 && <span style={{ marginLeft: 6, color: "var(--accent-light)" }}>({activeFilters} filtre{activeFilters > 1 ? "s" : ""})</span>}
          </p>
        </div>
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
          Nouvel article
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher…"
          style={{
            flex: "1 1 200px", maxWidth: 320, padding: "8px 12px", borderRadius: 8,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            color: "var(--text-primary)", fontSize: 13, outline: "none",
          }}
        />
        <Select value={statusFilter} onChange={setStatusFilter}>
          <option value="all">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="scheduled">Planifié</option>
        </Select>
        <Select value={categoryFilter} onChange={setCategoryFilter}>
          <option value="all">Toutes catégories</option>
          <option value="">Sans catégorie</option>
          {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
        </Select>
        {uniqueSites.length > 1 && (
          <Select value={siteFilter} onChange={setSiteFilter}>
            <option value="all">Tous les sites</option>
            {uniqueSites.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        )}
        {activeFilters > 0 && (
          <button
            onClick={() => { setStatusFilter("all"); setCategoryFilter("all"); setSiteFilter("all"); setSearch(""); }}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer" }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {([
                { key: "title",     label: "Titre" },
                { key: "site",      label: "Site" },
                { key: "category",  label: "Catégorie" },
                { key: "status",    label: "Statut" },
                { key: "createdAt", label: "Date" },
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
              <th style={{ padding: "12px 16px" }} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>Chargement…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Aucun article trouvé</td></tr>
            ) : filtered.map(a => (
              <tr
                key={a.id}
                style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 16px" }}>
                  <Link href={`/admin/articles/${a.id}`} style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500, fontSize: 13 }}>
                    {a.title}
                  </Link>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>/{a.slug}</div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{a.site.name}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-muted)" }}>
                  {a.category
                    ? <span style={{ padding: "2px 8px", borderRadius: 20, background: "var(--bg-tertiary)", border: "1px solid var(--border)", fontSize: 11 }}>{a.category}</span>
                    : <span style={{ color: "var(--border)" }}>—</span>
                  }
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={STATUS_COLORS[a.status] ?? "badge badge-draft"}>
                    {STATUS_LABELS[a.status] ?? a.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <Link href={`/admin/articles/${a.id}`} style={{
                      padding: "4px 10px", borderRadius: 6, background: "var(--bg-tertiary)",
                      border: "1px solid var(--border)", color: "var(--text-secondary)",
                      fontSize: 12, textDecoration: "none",
                    }}>
                      Éditer
                    </Link>
                    <button onClick={() => setConfirmDelete(a.id)} style={{
                      padding: "4px 10px", borderRadius: 6, background: "none",
                      border: "1px solid transparent", color: "var(--danger)",
                      fontSize: 12, cursor: "pointer",
                    }}>
                      Suppr.
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={confirmDelete !== null}
        title="Supprimer l'article"
        message="Cette action est irréversible. L'article sera définitivement supprimé."
        confirmLabel="Supprimer"
        onConfirm={() => { if (confirmDelete) deleteArticle(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />

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
