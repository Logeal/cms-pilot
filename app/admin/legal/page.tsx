"use client";

import { useEffect, useState } from "react";

type Tab = "mentions" | "cgu" | "cookies" | "contact" | "sitemap" | "robots";

interface LegalData {
  mentions: { content: string };
  cgu: { content: string };
  cookies: { content: string };
  contact: {
    email: string;
    address: string;
    phone: string;
    company: string;
    director: string;
    hosting: string;
  };
}

interface SitemapEntry {
  url: string;
  label: string;
  type: "static" | "category" | "article" | "custom";
  priority: number;
  updatedAt?: string;
}

const defaultLegal: LegalData = {
  mentions: { content: "" },
  cgu: { content: "" },
  cookies: { content: "" },
  contact: {
    email: "",
    address: "",
    phone: "",
    company: "",
    director: "",
    hosting: "Vercel Inc., 340 Pine Street, Suite 701, San Francisco, California 94104, États-Unis.",
  },
};

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "mentions", label: "Mentions légales", icon: "⚖️" },
  { id: "cgu", label: "CGU", icon: "📋" },
  { id: "cookies", label: "Cookies", icon: "🍪" },
  { id: "contact", label: "Contact", icon: "✉️" },
  { id: "sitemap", label: "Sitemap", icon: "🗺️" },
  { id: "robots", label: "Robots.txt", icon: "🤖" },
];

const typeColors: Record<string, string> = {
  static: "rgba(99,102,241,0.15)",
  category: "rgba(52,211,153,0.15)",
  article: "rgba(251,191,36,0.15)",
  custom: "rgba(248,113,113,0.15)",
};
const typeLabels: Record<string, string> = {
  static: "Statique",
  category: "Catégorie",
  article: "Article",
  custom: "Personnalisé",
};

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<Tab>("mentions");
  const [legal, setLegal] = useState<LegalData>(defaultLegal);
  const [siteId, setSiteId] = useState<string>("");
  const [menuConfig, setMenuConfig] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sitemap state
  const [sitemapPages, setSitemapPages] = useState<SitemapEntry[]>([]);
  const [sitemapTotal, setSitemapTotal] = useState(0);
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [customUrls, setCustomUrls] = useState<string[]>([]);

  // Robots state
  const [robotsDisallow, setRobotsDisallow] = useState<string[]>(["/admin", "/api", "/login"]);
  const [robotsDisallowInput, setRobotsDisallowInput] = useState("");
  const [sitemapFilter, setSitemapFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/sites");
      const sites = await res.json();
      if (sites.length === 0) { setLoading(false); return; }
      const site = sites[0];
      setSiteId(site.id);
      let mc: Record<string, unknown> = {};
      try { mc = typeof site.menuConfig === "string" ? JSON.parse(site.menuConfig) : (site.menuConfig ?? {}); } catch {}
      setMenuConfig(mc);
      if (mc.legal) {
        setLegal({ ...defaultLegal, ...(mc.legal as Partial<LegalData>) });
      }
      const seo = mc.seo as { customUrls?: string[]; robotsDisallow?: string[] } | undefined;
      if (seo?.customUrls) setCustomUrls(seo.customUrls);
      if (seo?.robotsDisallow) setRobotsDisallow(["/admin", "/api", "/login", ...seo.robotsDisallow]);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (activeTab === "sitemap" && sitemapPages.length === 0) {
      setSitemapLoading(true);
      fetch("/api/admin/sitemap-preview")
        .then((r) => r.json())
        .then((data) => {
          setSitemapPages(data.pages);
          setSitemapTotal(data.total);
          setSitemapLoading(false);
        });
    }
  }, [activeTab]);

  async function save() {
    if (!siteId) return;
    setSaving(true);
    const seo = {
      customUrls,
      robotsDisallow: robotsDisallow.filter((r) => !["/admin", "/api", "/login"].includes(r)),
    };
    const newMenuConfig = { ...menuConfig, legal, seo };
    await fetch(`/api/sites/${siteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuConfig: newMenuConfig }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateContent(tab: "mentions" | "cgu" | "cookies", value: string) {
    setLegal((prev) => ({ ...prev, [tab]: { content: value } }));
  }

  function updateContact(field: keyof LegalData["contact"], value: string) {
    setLegal((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }

  function addCustomUrl() {
    const url = customUrlInput.trim();
    if (!url || customUrls.includes(url)) return;
    setCustomUrls((prev) => [...prev, url]);
    setCustomUrlInput("");
    // Refresh sitemap preview
    setSitemapLoading(true);
    fetch("/api/admin/sitemap-preview").then((r) => r.json()).then((data) => {
      setSitemapPages(data.pages);
      setSitemapTotal(data.total);
      setSitemapLoading(false);
    });
  }

  function removeCustomUrl(url: string) {
    setCustomUrls((prev) => prev.filter((u) => u !== url));
  }

  function addDisallow() {
    const rule = robotsDisallowInput.trim();
    if (!rule || robotsDisallow.includes(rule)) return;
    setRobotsDisallow((prev) => [...prev, rule]);
    setRobotsDisallowInput("");
  }

  function removeDisallow(rule: string) {
    if (["/admin", "/api", "/login"].includes(rule)) return;
    setRobotsDisallow((prev) => prev.filter((r) => r !== rule));
  }

  const filteredPages = sitemapFilter === "all"
    ? sitemapPages
    : sitemapPages.filter((p) => p.type === sitemapFilter);

  if (loading) {
    return <div style={{ padding: 40, color: "var(--text-muted)", fontSize: 14 }}>Chargement…</div>;
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
          Pages légales & SEO technique
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Gérez les pages légales, le sitemap et le fichier robots.txt de votre site.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "var(--accent-light)" : "var(--text-secondary)",
              background: "transparent", border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1, cursor: "pointer",
              borderRadius: "6px 6px 0 0", transition: "color 0.15s",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 20 }}>

        {/* Mentions légales */}
        {activeTab === "mentions" && (
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Contenu personnalisé (HTML supporté)
            </label>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
              Si vide, le contenu par défaut sera affiché.
            </p>
            <textarea value={legal.mentions.content} onChange={(e) => updateContent("mentions", e.target.value)} rows={18}
              placeholder="Laissez vide pour le contenu par défaut..." className="cms-input" style={{ fontFamily: "monospace", resize: "vertical" }} />
            <a href="/mentions-legales" target="_blank" style={{ fontSize: 12, color: "var(--accent-light)", textDecoration: "none", display: "inline-block", marginTop: 10 }}>Voir la page →</a>
          </div>
        )}

        {/* CGU */}
        {activeTab === "cgu" && (
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Contenu personnalisé (HTML supporté)
            </label>
            <textarea value={legal.cgu.content} onChange={(e) => updateContent("cgu", e.target.value)} rows={18}
              placeholder="Laissez vide pour le contenu par défaut..." className="cms-input" style={{ fontFamily: "monospace", resize: "vertical" }} />
            <a href="/cgu" target="_blank" style={{ fontSize: 12, color: "var(--accent-light)", textDecoration: "none", display: "inline-block", marginTop: 10 }}>Voir la page →</a>
          </div>
        )}

        {/* Cookies */}
        {activeTab === "cookies" && (
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Contenu personnalisé (HTML supporté)
            </label>
            <textarea value={legal.cookies.content} onChange={(e) => updateContent("cookies", e.target.value)} rows={18}
              placeholder="Laissez vide pour le contenu par défaut..." className="cms-input" style={{ fontFamily: "monospace", resize: "vertical" }} />
            <a href="/cookies" target="_blank" style={{ fontSize: 12, color: "var(--accent-light)", textDecoration: "none", display: "inline-block", marginTop: 10 }}>Voir la page →</a>
          </div>
        )}

        {/* Contact */}
        {activeTab === "contact" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Ces informations seront affichées sur la page de contact et dans les mentions légales.
            </p>
            {[
              { field: "company" as const, label: "Nom de la société / éditeur", placeholder: "Ex: Maison & Conseil SAS" },
              { field: "director" as const, label: "Directeur de la publication", placeholder: "Prénom Nom" },
              { field: "address" as const, label: "Adresse postale", placeholder: "123 rue de la Paix, 75001 Paris" },
              { field: "email" as const, label: "E-mail de contact", placeholder: "contact@votresite.fr" },
              { field: "phone" as const, label: "Téléphone (optionnel)", placeholder: "+33 1 23 45 67 89" },
              { field: "hosting" as const, label: "Hébergeur", placeholder: "Vercel Inc., ..." },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</label>
                <input type={field === "email" ? "email" : "text"} value={legal.contact[field]} onChange={(e) => updateContact(field, e.target.value)}
                  placeholder={placeholder} className="cms-input" />
              </div>
            ))}
            <a href="/contact" target="_blank" style={{ fontSize: 12, color: "var(--accent-light)", textDecoration: "none", marginTop: 4 }}>Voir la page →</a>
          </div>
        )}

        {/* Sitemap */}
        {activeTab === "sitemap" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                  Sitemap dynamique
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Généré automatiquement. {sitemapTotal} URL{sitemapTotal > 1 ? "s" : ""} indexées.
                  <a href="/sitemap.xml" target="_blank" style={{ color: "var(--accent-light)", marginLeft: 8 }}>Voir sitemap.xml →</a>
                </p>
              </div>
              {/* Filter */}
              <select value={sitemapFilter} onChange={(e) => setSitemapFilter(e.target.value)}
                style={{ padding: "6px 10px", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-primary)", fontSize: 12, cursor: "pointer" }}>
                <option value="all">Toutes les pages</option>
                <option value="static">Statiques</option>
                <option value="category">Catégories</option>
                <option value="article">Articles</option>
                <option value="custom">Personnalisées</option>
              </select>
            </div>

            {/* URL list */}
            <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 20, maxHeight: 380, overflowY: "auto" }}>
              {sitemapLoading ? (
                <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Chargement…</div>
              ) : filteredPages.map((page, i) => (
                <div key={page.url} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  borderBottom: i < filteredPages.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "var(--bg-primary)" : "transparent",
                }}>
                  <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: typeColors[page.type], color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {typeLabels[page.type]}
                  </span>
                  <span style={{ flex: 1, fontSize: 12, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {page.label}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{page.url.replace(/^https?:\/\/[^/]+/, "")}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>P: {page.priority}</span>
                  {page.type === "custom" && (
                    <button onClick={() => removeCustomUrl(page.url)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: 14, padding: 2 }}>✕</button>
                  )}
                </div>
              ))}
            </div>

            {/* Ajouter URL personnalisée */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Ajouter une URL personnalisée
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={customUrlInput} onChange={(e) => setCustomUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomUrl()}
                  placeholder="https://votresite.fr/page-custom" className="cms-input" style={{ flex: 1 }} />
                <button onClick={addCustomUrl} style={{ padding: "10px 18px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Robots.txt */}
        {activeTab === "robots" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
              Règles robots.txt
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
              Contrôlez quelles pages les robots peuvent indexer.
              <a href="/robots.txt" target="_blank" style={{ color: "var(--accent-light)", marginLeft: 8 }}>Voir robots.txt →</a>
            </p>

            {/* Prévisualisation */}
            <div style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 20, fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <div style={{ color: "var(--text-muted)" }}># robots.txt généré automatiquement</div>
              <br />
              <div>User-agent: *</div>
              <div>Allow: /</div>
              {robotsDisallow.map((rule) => (
                <div key={rule}>Disallow: {rule}</div>
              ))}
              <br />
              <div>Sitemap: /sitemap.xml</div>
            </div>

            {/* Règles Disallow */}
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Règles Disallow
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {robotsDisallow.map((rule) => {
                const isDefault = ["/admin", "/api", "/login"].includes(rule);
                return (
                  <div key={rule} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: 6 }}>
                    <code style={{ flex: 1, fontSize: 12, color: "var(--text-primary)" }}>{rule}</code>
                    {isDefault ? (
                      <span style={{ fontSize: 11, color: "var(--text-muted)", padding: "2px 6px", background: "var(--border)", borderRadius: 4 }}>par défaut</span>
                    ) : (
                      <button onClick={() => removeDisallow(rule)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: 14 }}>✕</button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ajouter règle */}
            <div style={{ display: "flex", gap: 8 }}>
              <input value={robotsDisallowInput} onChange={(e) => setRobotsDisallowInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addDisallow()}
                placeholder="/dossier-prive" className="cms-input" style={{ flex: 1 }} />
              <button onClick={addDisallow} style={{ padding: "10px 18px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                Ajouter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={save} disabled={saving} style={{
          padding: "10px 24px", background: "var(--accent)", color: "#fff", border: "none",
          borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1, transition: "opacity 0.15s",
        }}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saved && (
          <span style={{ fontSize: 13, color: "var(--success)", display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><polyline points="20,6 9,17 4,12" /></svg>
            Sauvegardé
          </span>
        )}
      </div>
    </div>
  );
}
