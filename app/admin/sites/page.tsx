"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

interface Site {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  categories: string[];
  _count?: { articles: number };
  createdAt: string;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [form, setForm] = useState({ name: "", url: "" });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/sites");
    setSites(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ name: "", url: "" });
    setShowModal(true);
  }

  function openEdit(s: Site) {
    setEditing(s);
    setForm({ name: s.name, url: s.url });
    setShowModal(true);
  }

  async function save() {
    if (!form.name || !form.url) return;
    if (editing) {
      await fetch(`/api/sites/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    load();
  }

  async function deleteSite(id: string) {
    await fetch(`/api/sites/${id}`, { method: "DELETE" });
    load();
  }

  async function copyKey(key: string) {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div style={{ padding: "28px", overflowY: "auto", flex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Sites</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            {sites.length} site{sites.length !== 1 ? "s" : ""} enregistré{sites.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openNew}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 16px", borderRadius: 8,
            background: "var(--accent)", color: "#fff",
            border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter un site
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Chargement…</p>
      ) : sites.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p style={{ marginBottom: 12 }}>Aucun site configuré</p>
          <button onClick={openNew} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
            + Créer votre premier site
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {sites.map((site) => (
            <div
              key={site.id}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "var(--accent-bg)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "var(--accent-light)", fontWeight: 700, fontSize: 14,
                  }}>
                    {site.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{site.name}</div>
                    <a href={site.url} target="_blank" rel="noopener" style={{ color: "var(--text-muted)", fontSize: 12, textDecoration: "none" }}>
                      {site.url.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(site)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => setConfirmDelete(site.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", padding: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4h6v2"/></svg>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1, background: "var(--bg-tertiary)", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{site._count?.articles ?? 0}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Articles</div>
                </div>
              </div>

              {/* API Key */}
              <div style={{
                background: "var(--bg-tertiary)", borderRadius: 8,
                padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 2 }}>API KEY</div>
                  <code style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: 0.5 }}>
                    {site.apiKey.slice(0, 20)}…
                  </code>
                </div>
                <button
                  onClick={() => copyKey(site.apiKey)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: copiedKey === site.apiKey ? "var(--success)" : "var(--text-muted)", padding: 4 }}
                >
                  {copiedKey === site.apiKey ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="20,6 9,17 4,12"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ConfirmModal
        open={confirmDelete !== null}
        title="Supprimer le site"
        message="Tous les articles associés seront également supprimés. Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={() => { if (confirmDelete) deleteSite(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />

      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderRadius: 14, padding: 28, width: 420,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              {editing ? "Modifier le site" : "Nouveau site"}
            </h2>

            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Nom du site</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mon Blog"
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 8,
                  background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                  color: "var(--text-primary)", fontSize: 13, outline: "none",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>URL du site</span>
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://monsite.com"
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 8,
                  background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                  color: "var(--text-primary)", fontSize: 13, outline: "none",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: "9px 16px", borderRadius: 8, background: "var(--bg-tertiary)",
                border: "1px solid var(--border)", color: "var(--text-secondary)",
                cursor: "pointer", fontSize: 13,
              }}>
                Annuler
              </button>
              <button onClick={save} style={{
                padding: "9px 16px", borderRadius: 8, background: "var(--accent)",
                border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
              }}>
                {editing ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
