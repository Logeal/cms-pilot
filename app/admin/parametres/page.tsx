"use client";

import { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

interface Category {
  id: string;
  label: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  description?: string | null;
  heroImage?: string | null;
  bullets?: string[] | null;
  fromSetup?: boolean;
  createdAt: string;
}

interface MenuItem {
  id: string;
  type: "category" | "link";
  label: string;
  slug?: string;
  url?: string;
  enabled: boolean;
  level: number; // 0 = top level, 1 = sous-menu
}

interface MenuConfig {
  showLogo: boolean;
  items: MenuItem[];
}

interface Site {
  id: string;
  name: string;
  url: string;
  apiKey?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  menuConfig?: MenuConfig | null;
}

const defaultMenuConfig: MenuConfig = { showLogo: true, items: [] };

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ParametresPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [paletteColors, setPaletteColors] = useState<Record<string, string> | null>(null);
  const [faviconColor, setFaviconColor] = useState<string>("#C4603A");

  // Logo builder typographique
  const [logoPart1, setLogoPart1] = useState("Maison");
  const [logoPart2, setLogoPart2] = useState("Conseil");
  const [logoSeparator, setLogoSeparator] = useState("&");
  const [logoSlogan, setLogoSlogan] = useState("");
  const [logoPart1Bold, setLogoPart1Bold] = useState(true);
  const [logoPart2Bold, setLogoPart2Bold] = useState(true);

  // SEO de la page d'accueil
  const [homeMetaTitle, setHomeMetaTitle] = useState("");
  const [homeMetaDescription, setHomeMetaDescription] = useState("");
  const [generatingHomeSeo, setGeneratingHomeSeo] = useState(false);

  // Gestion des accès Worker
  type Worker = { id: string; email: string; createdAt: string; lastLoginAt: string | null };
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [newWorkerEmail, setNewWorkerEmail] = useState("");
  const [newWorkerPassword, setNewWorkerPassword] = useState("");
  const [workerError, setWorkerError] = useState("");
  const [creatingWorker, setCreatingWorker] = useState(false);
  const [confirmDeleteWorker, setConfirmDeleteWorker] = useState<string | null>(null);
  const [resetPwdWorkerId, setResetPwdWorkerId] = useState<string | null>(null);
  const [resetPwdValue, setResetPwdValue] = useState("");
  const [resetPwdError, setResetPwdError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-publish
  const [apEnabled, setApEnabled] = useState(false);
  const [apIntervalValue, setApIntervalValue] = useState(1);
  const [apIntervalUnit, setApIntervalUnit] = useState<"hour" | "day" | "week">("day");
  const [apCategoryRotation, setApCategoryRotation] = useState(true);
  const [apCategoryOrder, setApCategoryOrder] = useState<string[]>([]);
  const [apNextPublishAt, setApNextPublishAt] = useState<string | null>(null);
  const [apLastPublishedAt, setApLastPublishedAt] = useState<string | null>(null);
  const [apNextCategoryIndex, setApNextCategoryIndex] = useState(0);
  const [apDraftCount, setApDraftCount] = useState(0);
  const [apPublishing, setApPublishing] = useState(false);
  const [apResult, setApResult] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [menuConfig, setMenuConfig] = useState<MenuConfig>(defaultMenuConfig);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  // Empêche le useEffect de réecraser menuConfig après un save local
  const skipSiteEffectRef = useRef(false);

  // Drag & drop
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(null);
  const [catInput, setCatInput] = useState("");
  const [catSlugInput, setCatSlugInput] = useState("");
  const [catSlugManual, setCatSlugManual] = useState(false);
  const [catError, setCatError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSlugManual, setEditSlugManual] = useState(false);
  const [editMetaTitle, setEditMetaTitle] = useState("");
  const [editMetaDescription, setEditMetaDescription] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editHeroImage, setEditHeroImage] = useState("");
  const [editBullets, setEditBullets] = useState<string[]>(["", "", "", ""]);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generatingAllContent, setGeneratingAllContent] = useState(false);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  async function loadSites() {
    const res = await fetch("/api/sites");
    const data: Site[] = await res.json();
    setSites(data);
    if (data.length > 0 && !selectedSiteId) {
      setSelectedSiteId(data[0].id);
    }
  }

  async function loadCategories() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  async function loadWorkers() {
    const res = await fetch("/api/admin/workers");
    if (res.ok) setWorkers(await res.json());
  }

  async function createWorker() {
    setWorkerError("");
    const email = newWorkerEmail.trim().toLowerCase();
    const password = newWorkerPassword;
    if (!email) { setWorkerError("Email requis."); return; }
    if (password.length < 10) { setWorkerError("Le mot de passe doit faire au moins 10 caractères."); return; }
    setCreatingWorker(true);
    const res = await fetch("/api/admin/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setCreatingWorker(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setWorkerError(data?.error ?? "Erreur lors de la création.");
      return;
    }
    setNewWorkerEmail("");
    setNewWorkerPassword("");
    loadWorkers();
  }

  async function deleteWorker(id: string) {
    await fetch(`/api/admin/workers/${id}`, { method: "DELETE" });
    setConfirmDeleteWorker(null);
    loadWorkers();
  }

  async function resetWorkerPassword(id: string) {
    setResetPwdError("");
    if (resetPwdValue.length < 10) {
      setResetPwdError("Le mot de passe doit faire au moins 10 caractères.");
      return;
    }
    const res = await fetch(`/api/admin/workers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: resetPwdValue }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setResetPwdError(data?.error ?? "Erreur lors de la mise à jour.");
      return;
    }
    setResetPwdWorkerId(null);
    setResetPwdValue("");
  }

  useEffect(() => {
    loadSites();
    loadCategories();
    loadWorkers();
    // Draft count only — the auto-publish config is now read from the
    // selected site's menuConfig in the per-site useEffect below.
    fetch("/api/admin/auto-publish").then((r) => r.json()).then((data) => {
      setApDraftCount(data.draftCount ?? 0);
    });
  }, []);

  // Synchronise apCategoryOrder avec les catégories réelles :
  // - ajoute les nouvelles catégories absentes de la rotation
  // - supprime celles qui n'existent plus
  useEffect(() => {
    if (categories.length === 0) return;
    const labels = categories.map((c) => c.label);
    setApCategoryOrder((prev) => {
      const filtered = prev.filter((l) => labels.includes(l));
      const added = labels.filter((l) => !filtered.includes(l));
      if (filtered.length === prev.length && added.length === 0) return prev;
      return [...filtered, ...added];
    });
  }, [categories]);

  useEffect(() => {
    // Si on vient de faire un setSites local depuis saveAll, on ne ré-écrase pas l'état local
    if (skipSiteEffectRef.current) {
      skipSiteEffectRef.current = false;
      return;
    }
    const site = sites.find((s) => s.id === selectedSiteId);
    if (!site) return;
    setLogoUrl(site.logoUrl ?? "");
    setFaviconUrl(site.faviconUrl ?? "");
    let mc: MenuConfig | null = null;
    let mcRaw: Record<string, unknown> | null = null;
    const raw = site.menuConfig;
    if (typeof raw === "string") {
      try { mcRaw = JSON.parse(raw) as Record<string, unknown>; mc = mcRaw as unknown as MenuConfig; } catch { mc = null; }
    } else if (raw && typeof raw === "object") {
      mc = raw as MenuConfig;
      mcRaw = raw as unknown as Record<string, unknown>;
    }
    let colors: Record<string, string> | null = null;
    const setup = mcRaw?.setup;
    if (setup) {
      const setupObj = typeof setup === "string" ? JSON.parse(setup) : setup;
      colors = (setupObj?.colors ?? null) as Record<string, string> | null;
    }
    setPaletteColors(colors);

    // Restore homeSeo fields (homepage meta title + description)
    const hs = mcRaw?.homeSeo as Record<string, unknown> | undefined;
    setHomeMetaTitle(typeof hs?.metaTitle === "string" ? hs.metaTitle : "");
    setHomeMetaDescription(typeof hs?.metaDescription === "string" ? hs.metaDescription : "");

    // Restore logoBuilder fields (typographic logo generator inputs)
    const lb = mcRaw?.logoBuilder as Record<string, unknown> | undefined;
    if (lb) {
      if (typeof lb.part1 === "string") setLogoPart1(lb.part1);
      if (typeof lb.part2 === "string") setLogoPart2(lb.part2);
      if (typeof lb.separator === "string") setLogoSeparator(lb.separator);
      if (typeof lb.slogan === "string") setLogoSlogan(lb.slogan);
      if (typeof lb.part1Bold === "boolean") setLogoPart1Bold(lb.part1Bold);
      if (typeof lb.part2Bold === "boolean") setLogoPart2Bold(lb.part2Bold);
      if (typeof lb.faviconColor === "string") setFaviconColor(lb.faviconColor);
      else if (colors?.accent) setFaviconColor(colors.accent);
    } else if (colors?.accent) {
      setFaviconColor(colors.accent);
    }

    const items = (mc?.items ?? []).map((i: MenuItem) => ({ ...i, level: i.level ?? 0 }));
    setMenuConfig({ showLogo: mc?.showLogo ?? true, items });

    // Re-hydrate auto-publish config for the currently selected site so a
    // user switching between sites doesn't accidentally overwrite one with
    // another's settings on save.
    const ap = mcRaw?.autoPublish as Record<string, unknown> | undefined;
    setApEnabled(typeof ap?.enabled === "boolean" ? ap.enabled : false);
    setApIntervalValue(typeof ap?.intervalValue === "number" ? ap.intervalValue : 1);
    setApIntervalUnit((ap?.intervalUnit === "hour" || ap?.intervalUnit === "week" || ap?.intervalUnit === "day") ? ap.intervalUnit : "day");
    setApCategoryRotation(typeof ap?.categoryRotation === "boolean" ? ap.categoryRotation : true);
    setApCategoryOrder(Array.isArray(ap?.categoryOrder) ? ap.categoryOrder as string[] : []);
    setApNextPublishAt(typeof ap?.nextPublishAt === "string" ? ap.nextPublishAt : null);
    setApLastPublishedAt(typeof ap?.lastPublishedAt === "string" ? ap.lastPublishedAt : null);
    setApNextCategoryIndex(typeof ap?.nextCategoryIndex === "number" ? ap.nextCategoryIndex : 0);
  }, [selectedSiteId, sites]);

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    return (await res.json()).url as string;
  }

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) { setLogoUrl(url); setIsDirty(true); }
  }

  async function handleFaviconFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) { setFaviconUrl(url); setIsDirty(true); }
  }

  async function saveAll() {
    if (!selectedSiteId) return;
    setSaving(true);
    const site = sites.find((s) => s.id === selectedSiteId)!;
    // Dériver le nom depuis les champs du logo si renseignés
    const sep = logoSeparator === " " ? " " : (logoSeparator || "");
    const derivedName = logoPart1 && logoPart2
      ? [logoPart1, sep, logoPart2].filter(Boolean).join("")
      : site.name;
    const logoBuilder = {
      part1: logoPart1,
      part2: logoPart2,
      separator: logoSeparator,
      slogan: logoSlogan,
      part1Bold: logoPart1Bold,
      part2Bold: logoPart2Bold,
      faviconColor,
    };
    const homeSeo = {
      metaTitle: homeMetaTitle.trim(),
      metaDescription: homeMetaDescription.trim(),
    };
    const menuConfigToSave = { ...menuConfig, logoBuilder, homeSeo };
    try {
      const res = await fetch(`/api/sites/${selectedSiteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: derivedName,
          url: site.url,
          logoUrl: logoUrl || null,
          faviconUrl: faviconUrl || null,
          menuConfig: menuConfigToSave,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Mettre à jour le tableau local — on bloque le useEffect pour ne pas écraser menuConfig
      skipSiteEffectRef.current = true;
      setSites((prev) =>
        prev.map((s) =>
          s.id === selectedSiteId
            ? { ...s, name: derivedName, logoUrl: logoUrl || null, faviconUrl: faviconUrl || null, menuConfig: menuConfigToSave as unknown as MenuConfig }
            : s
        )
      );
      setIsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
      alert("Erreur lors de la sauvegarde. Vérifiez que le serveur est bien démarré.");
    } finally {
      setSaving(false);
    }
  }

  async function saveAutoPublish() {
    if (!selectedSiteId) return;
    // Read the current auto-publish config from the selected site's stored
    // menuConfig (we already have it in `sites`, no need to refetch).
    const site2 = sites.find((s) => s.id === selectedSiteId);
    let mc: Record<string, unknown> = {};
    try {
      const raw = site2?.menuConfig;
      if (typeof raw === "string") mc = JSON.parse(raw);
      else if (raw && typeof raw === "object") mc = raw as unknown as Record<string, unknown>;
    } catch {}
    const previousAp = mc.autoPublish as Record<string, unknown> | undefined;

    const intervalMs = apIntervalUnit === "hour"
      ? apIntervalValue * 60 * 60 * 1000
      : apIntervalUnit === "week"
      ? apIntervalValue * 7 * 24 * 60 * 60 * 1000
      : apIntervalValue * 24 * 60 * 60 * 1000;

    // Only recompute nextPublishAt when:
    //   - we just turned auto-publish ON (no previous schedule)
    //   - the interval (value or unit) changed (the previous schedule is stale)
    //   - the previous nextPublishAt is missing or in the past
    const wasEnabled = previousAp?.enabled === true;
    const intervalChanged = previousAp?.intervalValue !== apIntervalValue
      || previousAp?.intervalUnit !== apIntervalUnit;
    const previousNext = typeof previousAp?.nextPublishAt === "string" ? previousAp.nextPublishAt : null;
    const previousNextDate = previousNext ? new Date(previousNext) : null;
    const previousNextValid = previousNextDate && previousNextDate.getTime() > Date.now();

    let nextPublishAt: string | null;
    if (!apEnabled) {
      nextPublishAt = null;
    } else if (!wasEnabled || intervalChanged || !previousNextValid) {
      nextPublishAt = new Date(Date.now() + intervalMs).toISOString();
    } else {
      nextPublishAt = previousNext;
    }

    const autoPublish = {
      enabled: apEnabled,
      intervalValue: apIntervalValue,
      intervalUnit: apIntervalUnit,
      categoryRotation: apCategoryRotation,
      categoryOrder: apCategoryOrder,
      nextCategoryIndex: apNextCategoryIndex,
      lastPublishedAt: apLastPublishedAt,
      nextPublishAt,
    };

    await fetch(`/api/sites/${selectedSiteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuConfig: { autoPublish } }),
    });
    setApNextPublishAt(nextPublishAt);
    // Refresh local sites array so the next save reads the updated previousAp.
    setSites(prev => prev.map(s => s.id === selectedSiteId
      ? { ...s, menuConfig: { ...mc, autoPublish } as unknown as Site["menuConfig"] }
      : s));
    skipSiteEffectRef.current = true;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function triggerAutoPublish() {
    setApPublishing(true);
    setApResult(null);
    const res = await fetch("/api/admin/auto-publish", { method: "POST" });
    const data = await res.json();
    if (data.published) {
      setApResult(`✓ Article publié : "${data.article.title}" (${data.article.category ?? "sans catégorie"})`);
      setApNextPublishAt(data.nextPublishAt);
      setApLastPublishedAt(new Date().toISOString());
      setApDraftCount((n) => Math.max(0, n - 1));
      if (data.nextCategory !== null) setApNextCategoryIndex((apNextCategoryIndex + 1) % (apCategoryOrder.length || 1));
    } else {
      setApResult(`— ${data.reason}`);
    }
    setApPublishing(false);
  }

  // kept for internal use (no longer triggers API directly)
  function saveMenu(config: MenuConfig) {
    setMenuConfig(config);
    setIsDirty(true);
  }

  function updateMenu(items: MenuItem[]) {
    const updated = { ...menuConfig, items };
    saveMenu(updated);
  }

  function addCategoryToMenu(cat: Category) {
    if (menuConfig.items.some((i) => i.type === "category" && i.slug === cat.slug)) return;
    updateMenu([...menuConfig.items, { id: uid(), type: "category", label: cat.label, slug: cat.slug, enabled: true, level: 0 }]);
  }

  function addCustomLink() {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    updateMenu([...menuConfig.items, { id: uid(), type: "link", label: newLinkLabel.trim(), url: newLinkUrl.trim(), enabled: true, level: 0 }]);
    setNewLinkLabel("");
    setNewLinkUrl("");
  }

  function removeMenuItem(id: string) {
    updateMenu(menuConfig.items.filter((i) => i.id !== id));
  }

  function toggleMenuItem(id: string) {
    updateMenu(menuConfig.items.map((i) => i.id === id ? { ...i, enabled: !i.enabled } : i));
  }

  function indentItem(idx: number) {
    if (idx === 0) return; // can't indent first item
    const items = [...menuConfig.items];
    items[idx] = { ...items[idx], level: Math.min(1, items[idx].level + 1) };
    updateMenu(items);
  }

  function deindentItem(idx: number) {
    const items = [...menuConfig.items];
    items[idx] = { ...items[idx], level: Math.max(0, items[idx].level - 1) };
    updateMenu(items);
  }

  function toggleShowLogo() {
    saveMenu({ ...menuConfig, showLogo: !menuConfig.showLogo });
  }

  // ── Drag & drop handlers ──
  function handleDragStart(idx: number) {
    dragIndexRef.current = idx;
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setDragOverIndex(idx);
  }

  function handleDrop(e: React.DragEvent, dropIdx: number) {
    e.preventDefault();
    const dragIdx = dragIndexRef.current;
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragOverIndex(null);
      return;
    }
    const items = [...menuConfig.items];
    const [moved] = items.splice(dragIdx, 1);
    items.splice(dropIdx, 0, moved);
    dragIndexRef.current = null;
    setDragOverIndex(null);
    updateMenu(items);
  }

  function handleDragEnd() {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  function autoSlug(str: string) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // ── Categories ──
  async function addCat() {
    if (!catInput.trim()) return;
    setCatError("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: catInput.trim(), slug: catSlugInput.trim() || undefined }),
    });
    if (res.ok) { setCatInput(""); setCatSlugInput(""); setCatSlugManual(false); loadCategories(); }
    else { const d = await res.json(); setCatError(d.error ?? "Erreur"); }
  }

  async function removeCat(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  async function saveEditCat(id: string) {
    if (!editLabel.trim()) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: editLabel.trim(),
        slug: editSlug.trim() || undefined,
        metaTitle: editMetaTitle.trim() || null,
        metaDescription: editMetaDescription.trim() || null,
        description: editDescription.trim() || null,
        heroImage: editHeroImage.trim() || null,
        bullets: editBullets.filter(b => b.trim()).length > 0 ? editBullets.filter(b => b.trim()) : null,
      }),
    });
    if (res.ok) { setEditingId(null); loadCategories(); }
    else { const d = await res.json(); setCatError(d.error ?? "Erreur slug"); }
  }

  async function generateContent(catId: string) {
    setGeneratingContent(true);
    const site = sites.find(s => s.id === selectedSiteId);
    const siteContext = site?.name ?? "";
    const res = await fetch(`/api/admin/categories/${catId}/generate-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteContext }),
    });
    if (res.ok) {
      const data = await res.json();
      setEditDescription(data.description ?? "");
      setEditHeroImage(data.heroImage ?? "");
      setEditBullets(data.bullets?.length === 4 ? data.bullets : [...(data.bullets ?? []), "", "", "", ""].slice(0, 4));
      loadCategories();
    }
    setGeneratingContent(false);
  }

  async function generateAllContent() {
    setGeneratingAllContent(true);
    const site = sites.find(s => s.id === selectedSiteId);
    const siteContext = site?.name ?? "";
    for (const cat of categories) {
      await fetch(`/api/admin/categories/${cat.id}/generate-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteContext }),
      });
    }
    loadCategories();
    setGeneratingAllContent(false);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setEditLabel(cat.label);
    setEditSlug(cat.slug);
    setEditSlugManual(true);
    setEditMetaTitle(cat.metaTitle ?? "");
    setEditMetaDescription(cat.metaDescription ?? "");
    setEditDescription(cat.description ?? "");
    setEditHeroImage(cat.heroImage ?? "");
    setEditBullets(cat.bullets?.length ? [...cat.bullets, "", "", "", ""].slice(0, 4) : ["", "", "", ""]);
  }

  async function generateSeo(catId: string) {
    setGeneratingSeo(true);
    const res = await fetch("/api/admin/generate-category-seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: catId }),
    });
    setGeneratingSeo(false);
    if (res.ok) {
      const { data } = await res.json();
      if (data.metaTitle) setEditMetaTitle(data.metaTitle);
      if (data.metaDescription) setEditMetaDescription(data.metaDescription);
    } else {
      setCatError("Erreur lors de la génération SEO");
    }
  }

  async function generateHomeSeo() {
    if (!selectedSiteId) return;
    setGeneratingHomeSeo(true);
    try {
      const res = await fetch("/api/admin/generate-home-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: selectedSiteId }),
      });
      if (!res.ok) { alert("Erreur lors de la génération SEO de l'accueil."); return; }
      const { data } = await res.json();
      if (typeof data?.metaTitle === "string") setHomeMetaTitle(data.metaTitle);
      if (typeof data?.metaDescription === "string") setHomeMetaDescription(data.metaDescription);
      setIsDirty(true);
    } finally {
      setGeneratingHomeSeo(false);
    }
  }

  // ── Logo builder ──
  function buildLogoSvg(): string {
    const part1 = logoPart1 || "";
    const sep = logoSeparator === " " ? " " : (logoSeparator || "");
    const part2 = logoPart2 || "";
    const fw1 = logoPart1Bold ? "700" : "400";
    const fw2 = logoPart2Bold ? "700" : "400";

    // Calcul approximatif des positions X
    const charWidth = 22; // approx px per char at font-size 38
    const sepWidth = sep === " " ? 10 : 24;
    const part1Width = part1.length * charWidth;
    const sepX = part1Width + 4;
    const part2X = sepX + sepWidth + 4;
    const totalWidth = part2X + part2.length * charWidth + 8;

    const height = logoSlogan ? 72 : 60;
    const viewBox = `0 0 ${totalWidth} ${height}`;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${totalWidth}" height="${height}">`;
    if (part1) {
      svg += `<text x="0" y="42" font-family="Georgia, serif" font-size="38" font-weight="${fw1}" fill="#1C1C1A">${part1.replace(/&/g, "&amp;")}</text>`;
    }
    if (sep) {
      svg += `<text x="${sepX}" y="42" font-family="Georgia, serif" font-size="38" font-weight="700" fill="#C4603A">${sep.replace(/&/g, "&amp;")}</text>`;
    }
    if (part2) {
      svg += `<text x="${part2X}" y="42" font-family="Georgia, serif" font-size="38" font-weight="${fw2}" fill="#1C1C1A">${part2.replace(/&/g, "&amp;")}</text>`;
    }
    if (logoSlogan) {
      svg += `<text x="0" y="65" font-family="Georgia, serif" font-size="13" font-weight="400" fill="#888" font-style="italic">${logoSlogan.replace(/&/g, "&amp;")}</text>`;
    }
    svg += "</svg>";
    return svg;
  }

  function applyLogoSvg() {
    const svg = buildLogoSvg();
    const b64 = btoa(unescape(encodeURIComponent(svg)));
    const dataUrl = `data:image/svg+xml;base64,${b64}`;
    setLogoUrl(dataUrl);
    // Met à jour le nom du site avec les parties du logo, sans laisser le
    // useEffect re-hydrater les champs depuis l'ancien logoBuilder en DB.
    const sep = logoSeparator === " " ? " " : (logoSeparator || "");
    const newName = [logoPart1, sep, logoPart2].filter(Boolean).join("");
    skipSiteEffectRef.current = true;
    setSites((prev) =>
      prev.map((s) =>
        s.id === selectedSiteId ? { ...s, name: newName } : s
      )
    );
    setIsDirty(true);
  }

  function isLightColor(hex: string): boolean {
    const c = hex.replace("#", "");
    if (c.length !== 6) return false;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
  }

  function buildFaviconSvg(bgColor: string): string {
    const letter = (logoPart1 || "M").charAt(0).toUpperCase();
    const textColor = isLightColor(bgColor) ? "#1C1C1A" : "#ffffff";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="${bgColor}" rx="10"/><text x="32" y="46" font-family="Georgia, serif" font-size="40" font-weight="700" fill="${textColor}" text-anchor="middle">${letter}</text></svg>`;
  }

  function generateFaviconFromLogo() {
    const svg = buildFaviconSvg(faviconColor);
    const b64 = btoa(unescape(encodeURIComponent(svg)));
    setFaviconUrl(`data:image/svg+xml;base64,${b64}`);
    setIsDirty(true);
  }

  function pickFaviconColor(color: string) {
    setFaviconColor(color);
    const svg = buildFaviconSvg(color);
    const b64 = btoa(unescape(encodeURIComponent(svg)));
    setFaviconUrl(`data:image/svg+xml;base64,${b64}`);
    setIsDirty(true);
  }

  // Catégories fromSetup (pour icône ⚡)
  const setupSlugs = new Set(categories.filter(c => c.fromSetup).map(c => c.slug));

  // ── Styles ──
  const card: React.CSSProperties = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 15, fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 12, marginTop: 36,
    paddingBottom: 10,
    borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", gap: 8,
  };

  const inp: React.CSSProperties = {
    flex: 1, padding: "8px 12px", borderRadius: 8,
    background: "var(--input-bg)", border: "1px solid var(--border)",
    color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "inherit",
  };

  const btnPrimary: React.CSSProperties = {
    padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 500, background: "var(--accent)", color: "#fff",
  };

  const btnGhost: React.CSSProperties = {
    padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer",
    fontSize: 12, fontWeight: 500, background: "transparent", color: "var(--text-muted)",
  };

  const categoriesInMenu = menuConfig.items.filter((i) => i.type === "category").map((i) => i.slug);

  return (
    <>
    <ConfirmModal
      open={confirmDeleteCat !== null}
      title="Supprimer la catégorie"
      message="Les articles associés à cette catégorie ne seront pas supprimés, mais leur catégorie sera effacée."
      confirmLabel="Supprimer"
      onConfirm={() => { if (confirmDeleteCat) removeCat(confirmDeleteCat); setConfirmDeleteCat(null); }}
      onCancel={() => setConfirmDeleteCat(null)}
    />
    <ConfirmModal
      open={confirmDeleteWorker !== null}
      title="Supprimer ce worker"
      message="L'accès du worker sera révoqué immédiatement. Cette action est irréversible."
      confirmLabel="Supprimer"
      onConfirm={() => { if (confirmDeleteWorker) deleteWorker(confirmDeleteWorker); }}
      onCancel={() => setConfirmDeleteWorker(null)}
    />
    <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }}>

      {/* ── Barre sticky ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Paramètres</span>
          {isDirty && !saved && (
            <span style={{ marginLeft: 12, fontSize: 11, color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: 20, border: "1px solid var(--border)" }}>
              Modifications non enregistrées
            </span>
          )}
        </div>
        <button
          onClick={saveAll}
          disabled={saving || !selectedSiteId}
          style={{
            padding: "8px 20px", borderRadius: 8, cursor: saving ? "default" : "pointer",
            fontSize: 13, fontWeight: 600,
            background: saved ? "#22c55e" : isDirty ? "var(--accent)" : "var(--bg-secondary)",
            color: saved || isDirty ? "#fff" : "var(--text-muted)",
            border: `1px solid ${saved ? "#22c55e" : isDirty ? "var(--accent)" : "var(--border)"}`,
            transition: "background 0.2s, color 0.2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {saving ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Enregistrement…
            </>
          ) : saved ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>
              Enregistré
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Enregistrer
            </>
          )}
        </button>
      </div>

      <div style={{ padding: "28px 32px", flex: 1 }}>
      <div style={{ maxWidth: 660 }}>

        <div style={{ marginBottom: 8 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            Gérez l'apparence, la navigation et les catégories de votre site.
          </p>
        </div>

        {sites.length > 1 && (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", flexShrink: 0 }}>Site :</span>
            <select value={selectedSiteId} onChange={(e) => setSelectedSiteId(e.target.value)} style={{ ...inp, flex: "none", minWidth: 200 }}>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        {/* ── LOGO DU SITE — Générateur typographique ── */}
        <div style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
          Logo du site
        </div>

        {/* Générateur typographique SVG */}
        <div style={{ ...card, marginBottom: 12 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>GÉNÉRATEUR TYPOGRAPHIQUE</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 120px" }}>
                <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Partie 1</label>
                <input style={inp} value={logoPart1} onChange={e => setLogoPart1(e.target.value)} placeholder="Maison" />
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={logoPart1Bold} onChange={e => setLogoPart1Bold(e.target.checked)} />
                  Gras
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "0 0 90px" }}>
                <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Séparateur</label>
                <select style={{ ...inp, flex: "none" }} value={logoSeparator} onChange={e => setLogoSeparator(e.target.value)}>
                  <option value="&">&amp;</option>
                  <option value="·">·</option>
                  <option value="—">—</option>
                  <option value=" ">espace</option>
                  <option value="">rien</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 120px" }}>
                <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Partie 2</label>
                <input style={inp} value={logoPart2} onChange={e => setLogoPart2(e.target.value)} placeholder="Conseil" />
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={logoPart2Bold} onChange={e => setLogoPart2Bold(e.target.checked)} />
                  Gras
                </label>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Slogan (optionnel)</label>
              <input style={inp} value={logoSlogan} onChange={e => setLogoSlogan(e.target.value)} placeholder="Votre slogan…" />
            </div>
            {/* Aperçu live */}
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-tertiary)", border: "1px solid var(--border)", marginBottom: 12, minHeight: 64, display: "flex", alignItems: "center" }}>
              <span dangerouslySetInnerHTML={{ __html: buildLogoSvg() }} />
            </div>
            {/* Sélecteur couleur favicon depuis la palette du site */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                Couleur du favicon{paletteColors ? "" : " (palette par défaut — configure une palette dans Setup pour des couleurs sur-mesure)"}
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {(["dark", "brand", "brandLight", "accent", "secondary", "mid"] as const).map(key => {
                  const c = paletteColors?.[key];
                  if (!c) return null;
                  const selected = faviconColor.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={key}
                      onClick={() => pickFaviconColor(c)}
                      title={`${key} · ${c}`}
                      style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: c,
                        border: selected ? "2px solid var(--text-primary)" : "1px solid var(--border)",
                        cursor: "pointer", padding: 0,
                        boxShadow: selected ? "0 0 0 2px var(--bg-secondary), 0 0 0 4px var(--accent)" : "none",
                      }}
                    />
                  );
                })}
                <input
                  type="color"
                  value={faviconColor}
                  onChange={e => pickFaviconColor(e.target.value)}
                  title="Couleur personnalisée"
                  style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", padding: 0, background: "transparent" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={applyLogoSvg} style={{ ...btnPrimary, fontSize: 12 }}>Utiliser ce logo</button>
              <button onClick={generateFaviconFromLogo} style={{ ...btnGhost, fontSize: 12 }}>Générer favicon</button>
            </div>
          </div>
        </div>

        {/* Champs URL logo/favicon — conservés en dessous */}
        <div style={card}>
          <div style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 10, flexShrink: 0, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {logoUrl ? <img src={logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
              )}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <input style={inp} value={logoUrl} onChange={(e) => { setLogoUrl(e.target.value); setIsDirty(true); }} placeholder="https://exemple.com/logo.png" />
              <div style={{ display: "flex", gap: 8 }}>
                <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoFile} />
                <button onClick={() => logoInputRef.current?.click()} style={btnGhost}>Uploader une image</button>
                {logoUrl && <button onClick={() => { setLogoUrl(""); setIsDirty(true); }} style={{ ...btnGhost, color: "var(--danger)", borderColor: "var(--danger)" }}>Supprimer</button>}
              </div>
            </div>
          </div>
        </div>

        {/* ── FAVICON ── */}
        <div style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Favicon
        </div>
        <div style={card}>
          <div style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {faviconUrl ? <img src={faviconUrl} alt="favicon" style={{ width: 32, height: 32, objectFit: "contain" }} /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.5}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              )}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <input style={inp} value={faviconUrl} onChange={(e) => { setFaviconUrl(e.target.value); setIsDirty(true); }} placeholder="https://exemple.com/favicon.ico" />
              <div style={{ display: "flex", gap: 8 }}>
                <input ref={faviconInputRef} type="file" accept="image/*,.ico" style={{ display: "none" }} onChange={handleFaviconFile} />
                <button onClick={() => faviconInputRef.current?.click()} style={btnGhost}>Uploader un fichier</button>
                {faviconUrl && <button onClick={() => { setFaviconUrl(""); setIsDirty(true); }} style={{ ...btnGhost, color: "var(--danger)", borderColor: "var(--danger)" }}>Supprimer</button>}
              </div>
            </div>
          </div>
        </div>

        {/* ── SEO PAGE D'ACCUEIL ── */}
        <div style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          SEO de la page d&apos;accueil
        </div>
        <div style={card}>
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              Définissez la meta title et la meta description affichées par les moteurs de recherche pour la page d&apos;accueil. Claude peut les générer en se basant sur vos catégories et vos articles publiés.
            </p>
            <div>
              <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                Meta title <span style={{ color: homeMetaTitle.length > 60 ? "var(--danger)" : "var(--text-muted)" }}>({homeMetaTitle.length}/60)</span>
              </label>
              <input
                style={inp}
                value={homeMetaTitle}
                onChange={e => { setHomeMetaTitle(e.target.value); setIsDirty(true); }}
                placeholder="Ex: Maison & Conseil — Déco, jardin, immobilier"
                maxLength={120}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                Meta description <span style={{ color: homeMetaDescription.length > 160 ? "var(--danger)" : "var(--text-muted)" }}>({homeMetaDescription.length}/160)</span>
              </label>
              <textarea
                style={{ ...inp, minHeight: 72, fontFamily: "inherit", resize: "vertical" }}
                value={homeMetaDescription}
                onChange={e => { setHomeMetaDescription(e.target.value); setIsDirty(true); }}
                placeholder="Une description courte et engageante (140-160 caractères) qui apparaît dans Google."
                maxLength={250}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={generateHomeSeo}
                disabled={generatingHomeSeo}
                style={{
                  ...btnGhost, fontSize: 12,
                  display: "inline-flex", alignItems: "center", gap: 7,
                  opacity: generatingHomeSeo ? 0.6 : 1,
                  cursor: generatingHomeSeo ? "default" : "pointer",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                {generatingHomeSeo ? "Génération…" : "Générer avec Claude"}
              </button>
            </div>
          </div>
        </div>

        {/* ── MENU DE NAVIGATION ── */}
        <div style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          Menu de navigation
        </div>

        <div style={card}>

          {/* Toggle logo */}
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Afficher le logo dans le menu</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Affiche ou masque le logo en haut de la navigation</div>
            </div>
            <button onClick={toggleShowLogo} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: menuConfig.showLogo ? "var(--accent)" : "var(--border)", position: "relative" }}>
              <span style={{ position: "absolute", top: 3, left: menuConfig.showLogo ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.15s" }} />
            </button>
          </div>

          {/* Structure du menu — toujours visible */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>STRUCTURE DU MENU</span>
              <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>Glisser pour réordonner • ← → pour le niveau</span>
            </div>

            {menuConfig.items.length === 0 ? (
              <div style={{
                padding: "24px 16px", textAlign: "center", borderRadius: 8,
                border: "2px dashed var(--border)", color: "var(--text-muted)", fontSize: 13,
              }}>
                Aucun élément — ajoutez des catégories ou des liens ci-dessous
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {menuConfig.items.map((item, i) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: dragOverIndex === i ? "var(--accent-bg)" : "var(--bg-tertiary)",
                      border: `1px solid ${dragOverIndex === i ? "var(--accent)" : "var(--border)"}`,
                      cursor: "grab",
                      marginLeft: item.level === 1 ? 28 : 0,
                      opacity: item.enabled ? 1 : 0.45,
                      transition: "background 0.1s, border-color 0.1s",
                      userSelect: "none",
                    }}
                  >
                    {/* Drag handle */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2} style={{ flexShrink: 0, cursor: "grab" }}>
                      <circle cx="9" cy="6" r="1.5" fill="var(--text-muted)"/>
                      <circle cx="15" cy="6" r="1.5" fill="var(--text-muted)"/>
                      <circle cx="9" cy="12" r="1.5" fill="var(--text-muted)"/>
                      <circle cx="15" cy="12" r="1.5" fill="var(--text-muted)"/>
                      <circle cx="9" cy="18" r="1.5" fill="var(--text-muted)"/>
                      <circle cx="15" cy="18" r="1.5" fill="var(--text-muted)"/>
                    </svg>

                    {/* Level indicator */}
                    {item.level === 1 && (
                      <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>└</span>
                    )}

                    {/* Type badge */}
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 4, flexShrink: 0,
                      background: item.type === "category" ? "var(--accent-bg)" : "rgba(80,180,80,0.12)",
                      color: item.type === "category" ? "var(--accent-light)" : "#5db85d",
                    }}>
                      {item.type === "category" ? "CAT" : "LIEN"}
                    </span>

                    {/* Label */}
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                      {item.label}
                      {item.type === "category" && item.slug && (
                        <button
                          title="Générer le contenu SEO de cette catégorie"
                          onClick={(e) => { e.stopPropagation(); const cat = categories.find(c => c.slug === item.slug); if (cat) { openEdit(cat); document.getElementById("section-categories")?.scrollIntoView({ behavior: "smooth" }); } }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", fontSize: 14, lineHeight: 1, color: "#f59e0b", flexShrink: 0 }}
                        >
                          ⚡
                        </button>
                      )}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
                      {item.slug ? `/${item.slug}` : item.url}
                    </span>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 2, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                      {/* De-indent */}
                      <button
                        onClick={() => deindentItem(i)}
                        disabled={item.level === 0}
                        title="Remonter au niveau supérieur"
                        style={{ background: "none", border: "none", cursor: item.level === 0 ? "default" : "pointer", color: "var(--text-muted)", padding: "2px 4px", opacity: item.level === 0 ? 0.2 : 1, fontSize: 13, borderRadius: 4 }}
                      >
                        ←
                      </button>
                      {/* Indent */}
                      <button
                        onClick={() => indentItem(i)}
                        disabled={item.level === 1 || i === 0}
                        title="Passer en sous-menu"
                        style={{ background: "none", border: "none", cursor: (item.level === 1 || i === 0) ? "default" : "pointer", color: "var(--text-muted)", padding: "2px 4px", opacity: (item.level === 1 || i === 0) ? 0.2 : 1, fontSize: 13, borderRadius: 4 }}
                      >
                        →
                      </button>
                      {/* Visibilité */}
                      <button
                        onClick={() => toggleMenuItem(item.id)}
                        title={item.enabled ? "Masquer" : "Afficher"}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px 4px", borderRadius: 4 }}
                      >
                        {item.enabled
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        }
                      </button>
                      {/* Supprimer */}
                      <button
                        onClick={() => removeMenuItem(item.id)}
                        title="Supprimer"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", padding: "2px 4px", borderRadius: 4 }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ajouter une catégorie */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>
              AJOUTER UNE CATÉGORIE
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.length === 0
                ? <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Aucune catégorie — créez-en ci-dessous</span>
                : categories.map((cat) => {
                  const already = categoriesInMenu.includes(cat.slug);
                  return (
                    <button key={cat.id} onClick={() => !already && addCategoryToMenu(cat)} disabled={already} style={{
                      padding: "5px 12px", borderRadius: 20,
                      border: `1px solid ${already ? "var(--accent)" : "var(--border)"}`,
                      fontSize: 12, fontWeight: 500,
                      background: already ? "var(--accent-bg)" : "var(--bg-tertiary)",
                      color: already ? "var(--accent-light)" : "var(--text-primary)",
                      cursor: already ? "default" : "pointer",
                    }}>
                      {already ? "✓ " : "+ "}{cat.label}
                    </button>
                  );
                })
              }
            </div>
          </div>

          {/* Ajouter un lien personnalisé */}
          <div style={{ padding: "14px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>
              AJOUTER UN LIEN PERSONNALISÉ
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input style={{ ...inp, minWidth: 130, flex: "1 1 130px" }} value={newLinkLabel} onChange={(e) => setNewLinkLabel(e.target.value)} placeholder="Label (ex: Contact)" />
              <input style={{ ...inp, minWidth: 160, flex: "1 1 160px" }} value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="URL (ex: /contact)" onKeyDown={(e) => e.key === "Enter" && addCustomLink()} />
              <button onClick={addCustomLink} disabled={!newLinkLabel.trim() || !newLinkUrl.trim()} style={{ ...btnPrimary, opacity: newLinkLabel.trim() && newLinkUrl.trim() ? 1 : 0.5, fontSize: 12 }}>
                + Ajouter
              </button>
            </div>
          </div>

        </div>

        {/* ── ACCÈS WORKER ── */}
        <div style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Accès worker
        </div>
        <div style={card}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              Les workers ont uniquement accès à la liste des articles et à l&apos;ajout d&apos;URLs d&apos;images. Ils ne peuvent pas voir le contenu des articles, les modifier ni les supprimer. Choisissez un mot de passe d&apos;au moins 10 caractères.
            </p>
          </div>

          {/* Liste des workers */}
          <div style={{ padding: workers.length > 0 ? "8px 0 0" : "0" }}>
            {workers.map(w => (
              <div key={w.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis" }}>{w.email}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    Créé le {new Date(w.createdAt).toLocaleDateString("fr-FR")}
                    {w.lastLoginAt && <> · Dernière connexion : {new Date(w.lastLoginAt).toLocaleDateString("fr-FR")}</>}
                  </div>
                </div>
                {resetPwdWorkerId === w.id ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                      type="password"
                      value={resetPwdValue}
                      onChange={e => setResetPwdValue(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") resetWorkerPassword(w.id); }}
                      placeholder="Nouveau mot de passe…"
                      style={{ ...inp, padding: "6px 10px", fontSize: 12, width: 200 }}
                      autoFocus
                    />
                    <button onClick={() => resetWorkerPassword(w.id)} style={{ ...btnPrimary, padding: "6px 12px", fontSize: 12 }}>Enregistrer</button>
                    <button onClick={() => { setResetPwdWorkerId(null); setResetPwdValue(""); setResetPwdError(""); }} style={{ ...btnGhost, padding: "6px 12px", fontSize: 12 }}>Annuler</button>
                    {resetPwdError && <span style={{ fontSize: 11, color: "var(--danger)", width: "100%" }}>{resetPwdError}</span>}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setResetPwdWorkerId(w.id); setResetPwdValue(""); setResetPwdError(""); }} style={{ ...btnGhost, padding: "6px 12px", fontSize: 12 }}>Réinit. mdp</button>
                    <button onClick={() => setConfirmDeleteWorker(w.id)} style={{ ...btnGhost, padding: "6px 12px", fontSize: 12, color: "var(--danger)", borderColor: "var(--danger)" }}>Supprimer</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Création d'un nouveau worker */}
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Ajouter un worker
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
              <input
                style={{ ...inp, flex: "1 1 200px" }}
                type="email"
                value={newWorkerEmail}
                onChange={e => setNewWorkerEmail(e.target.value)}
                placeholder="email@exemple.com"
                autoComplete="off"
              />
              <input
                style={{ ...inp, flex: "1 1 200px" }}
                type="password"
                value={newWorkerPassword}
                onChange={e => setNewWorkerPassword(e.target.value)}
                placeholder="Mot de passe (10+ caractères)"
                autoComplete="new-password"
              />
              <button
                onClick={createWorker}
                disabled={creatingWorker}
                style={{ ...btnPrimary, fontSize: 12, opacity: creatingWorker ? 0.6 : 1 }}
              >
                {creatingWorker ? "Création…" : "+ Ajouter"}
              </button>
            </div>
            {workerError && (
              <p style={{ fontSize: 12, color: "var(--danger)", margin: 0 }}>{workerError}</p>
            )}
          </div>
        </div>

        {/* ── CATÉGORIES D'ARTICLES ── */}
        <div id="section-categories" style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Catégories d'articles
        </div>
        <div style={card}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {categories.length} catégorie{categories.length !== 1 ? "s" : ""} — accessibles via{" "}
              <code style={{ fontSize: 11, background: "var(--bg-tertiary)", padding: "1px 5px", borderRadius: 4 }}>GET /api/categories</code>
            </span>
            {categories.length > 0 && (
              <button
                onClick={generateAllContent}
                disabled={generatingAllContent}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, border: "none", background: generatingAllContent ? "var(--bg-tertiary)" : "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: generatingAllContent ? "default" : "pointer", opacity: generatingAllContent ? 0.7 : 1, whiteSpace: "nowrap" }}
              >
                {generatingAllContent ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                )}
                {generatingAllContent ? "Génération en cours…" : "Tout générer avec IA"}
              </button>
            )}
          </div>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                value={catInput}
                onChange={(e) => {
                  setCatInput(e.target.value);
                  setCatError("");
                  if (!catSlugManual) setCatSlugInput(autoSlug(e.target.value));
                }}
                onKeyDown={(e) => e.key === "Enter" && addCat()}
                placeholder="Label (ex: Immobilier)"
                style={{ ...inp, border: `1px solid ${catError ? "var(--danger)" : "var(--border)"}` }}
              />
              <button onClick={addCat} disabled={!catInput.trim()} style={{ ...btnPrimary, opacity: catInput.trim() ? 1 : 0.5, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Ajouter
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>Slug :</span>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-muted)", pointerEvents: "none" }}>/</span>
                <input
                  value={catSlugInput}
                  onChange={(e) => { setCatSlugInput(e.target.value); setCatSlugManual(true); }}
                  placeholder="généré automatiquement"
                  style={{ ...inp, paddingLeft: 18, fontSize: 12 }}
                />
              </div>
              {catSlugManual && (
                <button onClick={() => { setCatSlugInput(autoSlug(catInput)); setCatSlugManual(false); }} style={{ fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  Réinitialiser
                </button>
              )}
            </div>
            {catError && <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}>{catError}</p>}
          </div>

          {categories.length === 0 ? (
            <div style={{ padding: "28px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Aucune catégorie — ajoutez-en une ci-dessus
            </div>
          ) : (
            <ul style={{ listStyle: "none" }}>
              {categories.map((cat, i) => (
                <li key={cat.id} style={{ borderBottom: i < categories.length - 1 ? "1px solid var(--border)" : "none" }}>
                  {editingId === cat.id ? (
                    <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, opacity: 0.7 }} />
                        <input
                          ref={editInputRef}
                          value={editLabel}
                          onChange={(e) => {
                            setEditLabel(e.target.value);
                            if (!editSlugManual) setEditSlug(autoSlug(e.target.value));
                          }}
                          onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }}
                          placeholder="Label"
                          style={{ flex: 1, padding: "5px 10px", borderRadius: 6, background: "var(--input-bg)", border: "1px solid var(--accent)", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "inherit" }}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 17 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>Slug :</span>
                        <div style={{ position: "relative", flex: 1 }}>
                          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-muted)", pointerEvents: "none" }}>/</span>
                          <input
                            value={editSlug}
                            onChange={(e) => { setEditSlug(e.target.value); setEditSlugManual(true); }}
                            style={{ ...inp, paddingLeft: 18, fontSize: 12 }}
                          />
                        </div>
                      </div>
                      <div style={{ paddingLeft: 17, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>SEO</div>
                          <button
                            onMouseDown={(e) => { e.preventDefault(); generateSeo(cat.id); }}
                            disabled={generatingSeo}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "none", background: generatingSeo ? "var(--bg-tertiary)" : "linear-gradient(135deg, #f59e0b, #f97316)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: generatingSeo ? "default" : "pointer", opacity: generatingSeo ? 0.7 : 1, transition: "opacity 0.15s" }}
                          >
                            {generatingSeo ? (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                            ) : (
                              <span>⚡</span>
                            )}
                            {generatingSeo ? "Génération…" : "Générer avec Claude"}
                          </button>
                        </div>
                        <input
                          value={editMetaTitle}
                          onChange={(e) => setEditMetaTitle(e.target.value)}
                          placeholder="Meta title (ex: Décoration intérieure — Maison & Conseil)"
                          style={{ ...inp, fontSize: 12 }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <span style={{ fontSize: 11, color: editMetaTitle.length > 60 ? "var(--danger)" : "var(--text-muted)" }}>
                            {editMetaTitle.length}/60
                          </span>
                        </div>
                        <textarea
                          value={editMetaDescription}
                          onChange={(e) => setEditMetaDescription(e.target.value)}
                          placeholder="Meta description (ex: Retrouvez tous nos conseils en décoration intérieure…)"
                          rows={2}
                          style={{ ...inp, fontSize: 12, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <span style={{ fontSize: 11, color: editMetaDescription.length > 160 ? "var(--danger)" : "var(--text-muted)" }}>
                            {editMetaDescription.length}/160
                          </span>
                        </div>
                      </div>
                      {/* Contenu éditorial */}
                      <div style={{ paddingLeft: 17, display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contenu éditorial (Thèmes)</div>
                          <button
                            onMouseDown={(e) => { e.preventDefault(); generateContent(cat.id); }}
                            disabled={generatingContent}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "none", background: generatingContent ? "var(--bg-tertiary)" : "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: generatingContent ? "default" : "pointer", opacity: generatingContent ? 0.7 : 1 }}
                          >
                            {generatingContent ? (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                            ) : (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            )}
                            {generatingContent ? "Génération…" : "Générer avec IA"}
                          </button>
                        </div>
                        {editHeroImage && (
                          <div style={{ borderRadius: 8, overflow: "hidden", height: 100, background: "var(--bg-tertiary)", position: "relative" }}>
                            <img src={editHeroImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                              onMouseDown={(e) => { e.preventDefault(); setEditHeroImage(""); }}
                              style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 4, color: "#fff", fontSize: 11, padding: "2px 7px", cursor: "pointer" }}
                            >✕</button>
                          </div>
                        )}
                        <input
                          value={editHeroImage}
                          onChange={(e) => setEditHeroImage(e.target.value)}
                          placeholder="URL image hero (générée ou saisie manuellement)"
                          style={{ ...inp, fontSize: 12 }}
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description de la rubrique (2-3 phrases éditoriales)"
                          rows={3}
                          style={{ ...inp, fontSize: 12, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
                        />
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Points forts (4 bullets)</div>
                        {editBullets.map((b, bi) => (
                          <input
                            key={bi}
                            value={b}
                            onChange={(e) => { const nb = [...editBullets]; nb[bi] = e.target.value; setEditBullets(nb); }}
                            placeholder={`Point ${bi + 1}`}
                            style={{ ...inp, fontSize: 12 }}
                          />
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 6, paddingLeft: 17 }}>
                        <button onMouseDown={(e) => { e.preventDefault(); saveEditCat(cat.id); }} style={{ padding: "5px 14px", borderRadius: 6, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Enregistrer</button>
                        <button onMouseDown={(e) => { e.preventDefault(); setEditingId(null); setCatError(""); }} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: 12 }}>Annuler</button>
                      </div>
                      {catError && <p style={{ fontSize: 12, color: "var(--danger)", paddingLeft: 17 }}>{catError}</p>}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", minHeight: 44 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, opacity: 0.7 }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.label}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>/{cat.slug}</span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onMouseDown={(e) => { e.preventDefault(); openEdit(cat); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "3px 5px" }} title="Modifier">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onMouseDown={(e) => { e.preventDefault(); setConfirmDeleteCat(cat.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", padding: "3px 5px" }} title="Supprimer">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ marginTop: 4, padding: "12px 16px", borderRadius: 10, background: "var(--accent-bg)", border: "1px solid var(--accent)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--accent-light)" }}>Pilot</strong> récupère ces catégories via{" "}
          <code style={{ fontSize: 11, background: "rgba(0,0,0,0.2)", padding: "1px 5px", borderRadius: 4 }}>GET /api/categories</code>{" "}
          — toute catégorie ajoutée ici sera immédiatement disponible dans l'éditeur d'articles.
        </div>

        {/* ── PUBLICATION AUTOMATIQUE ── */}
        <div style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Publication automatique
        </div>
        <div style={card}>
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Statut brouillons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg-tertiary)", borderRadius: 8, fontSize: 13 }}>
              <span style={{ color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--text-primary)" }}>{apDraftCount}</strong> article{apDraftCount > 1 ? "s" : ""} en brouillon disponible{apDraftCount > 1 ? "s" : ""}
              </span>
              {apLastPublishedAt && (
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Dernier : {new Date(apLastPublishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>

            {/* Activer / désactiver */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Activer la publication automatique</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Les articles en brouillon seront publiés selon la fréquence choisie</div>
              </div>
              <button
                onClick={() => setApEnabled((v) => !v)}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                  background: apEnabled ? "var(--accent)" : "var(--border)",
                  position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}
              >
                <span style={{
                  position: "absolute", top: 3, left: apEnabled ? 23 : 3,
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  transition: "left 0.2s", display: "block",
                }} />
              </button>
            </div>

            {/* Fréquence */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Fréquence de publication
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Publier</span>
                <input
                  type="number" min={1} max={365} value={apIntervalValue}
                  onChange={(e) => setApIntervalValue(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: 64, padding: "8px 10px", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-primary)", fontSize: 13, textAlign: "center" }}
                />
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>article(s) tous les</span>
                <input
                  type="number" min={1} max={365} value={apIntervalValue}
                  onChange={(e) => setApIntervalValue(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: 64, padding: "8px 10px", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-primary)", fontSize: 13, textAlign: "center" }}
                />
                <select value={apIntervalUnit} onChange={(e) => setApIntervalUnit(e.target.value as "hour" | "day" | "week")}
                  style={{ padding: "8px 10px", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-primary)", fontSize: 13, cursor: "pointer" }}>
                  <option value="hour">heure(s)</option>
                  <option value="day">jour(s)</option>
                  <option value="week">semaine(s)</option>
                </select>
              </div>
            </div>

            {/* Rotation des catégories */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Rotation des catégories</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Alterne entre les catégories à chaque publication</div>
                </div>
                <button
                  onClick={() => setApCategoryRotation((v) => !v)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: apCategoryRotation ? "var(--accent)" : "var(--border)",
                    position: "relative", transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute", top: 3, left: apCategoryRotation ? 23 : 3,
                    width: 18, height: 18, borderRadius: "50%", background: "#fff",
                    transition: "left 0.2s", display: "block",
                  }} />
                </button>
              </div>

              {apCategoryRotation && (
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                    Ordre de rotation (glissez pour réordonner) — catégorie suivante : <strong style={{ color: "var(--accent-light)" }}>{apCategoryOrder[apNextCategoryIndex % (apCategoryOrder.length || 1)] ?? "—"}</strong>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {categories.map((cat) => {
                      const isSelected = apCategoryOrder.includes(cat.label);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setApCategoryOrder((prev) =>
                              isSelected ? prev.filter((c) => c !== cat.label) : [...prev, cat.label]
                            );
                          }}
                          style={{
                            padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                            border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                            background: isSelected ? "var(--accent-bg)" : "transparent",
                            color: isSelected ? "var(--accent-light)" : "var(--text-secondary)",
                            transition: "all 0.15s",
                          }}
                        >
                          {isSelected && <span style={{ marginRight: 4 }}>✓</span>}{cat.label}
                        </button>
                      );
                    })}
                  </div>
                  {apCategoryOrder.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {apCategoryOrder.map((cat, i) => (
                        <div key={cat} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "var(--bg-tertiary)", borderRadius: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{i + 1}.</span>
                          <span>{cat}</span>
                          {i === apNextCategoryIndex % apCategoryOrder.length && (
                            <span style={{ color: "var(--accent)", fontSize: 10 }}>▶</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prochaine publication */}
            {apEnabled && apNextPublishAt && (
              <div style={{ padding: "10px 14px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                ⏰ Prochaine publication : <strong style={{ color: "var(--success)" }}>{new Date(apNextPublishAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</strong>
              </div>
            )}

            {/* Résultat du déclenchement manuel */}
            {apResult && (
              <div style={{ padding: "10px 14px", background: "var(--bg-tertiary)", borderRadius: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                {apResult}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveAutoPublish} style={{ padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Enregistrer
              </button>
              <button
                onClick={triggerAutoPublish}
                disabled={apPublishing || apDraftCount === 0}
                style={{ padding: "9px 20px", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, cursor: apDraftCount === 0 ? "not-allowed" : "pointer", opacity: apDraftCount === 0 ? 0.5 : 1 }}
              >
                {apPublishing ? "Publication…" : "▶ Publier maintenant"}
              </button>
            </div>

          </div>
        </div>

        {/* ── CLÉ API ── */}
        <div style={sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          Clé API
        </div>
        {(() => {
          const site = sites.find((s) => s.id === selectedSiteId);
          const apiKey = site?.apiKey ?? null;
          return (
            <div style={card}>
              <div style={{ padding: "18px 20px" }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.6 }}>
                  Cette clé API est utilisée par <strong style={{ color: "var(--text-primary)" }}>Pilot</strong> pour s'authentifier auprès du CMS.
                  Passez-la dans le header <code style={{ fontSize: 11, background: "var(--bg-tertiary)", padding: "1px 5px", borderRadius: 4 }}>x-api-key</code> de chaque requête.
                </p>
                {apiKey ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <code style={{
                      flex: 1, padding: "9px 14px", borderRadius: 8,
                      background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                      fontSize: 12, fontFamily: "monospace", letterSpacing: 0.5,
                      color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {apiKey}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(apiKey); }}
                      title="Copier la clé"
                      style={{ ...btnGhost, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copier
                    </button>
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Aucune clé API disponible pour ce site.</p>
                )}
              </div>
            </div>
          );
        })()}

        <div style={{ height: 40 }} />
      </div>
      </div>
    </div>
    </>
  );
}
