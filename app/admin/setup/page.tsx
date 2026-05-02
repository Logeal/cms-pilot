"use client";

import { useState, useEffect } from "react";
import { PALETTES } from "@/lib/palettes";

// ── Typographies ──
type FontConfig = { display: string; heading: string; body: string };

const FONT_PRESETS: Array<{ id: string; name: string; desc: string; fonts: FontConfig }> = [
  { id: "editorial",  name: "Éditorial",   desc: "Playfair · Raleway · Georgia",         fonts: { display: "Playfair Display",   heading: "Raleway",  body: "Georgia" } },
  { id: "magazine",   name: "Magazine",    desc: "DM Serif · DM Sans · DM Sans",         fonts: { display: "DM Serif Display",   heading: "DM Sans",  body: "DM Sans" } },
  { id: "elegant",    name: "Élégant",     desc: "Cormorant · Jost · Georgia",           fonts: { display: "Cormorant Garamond", heading: "Jost",     body: "Georgia" } },
  { id: "modern",     name: "Moderne",     desc: "Fraunces · Inter · Inter",             fonts: { display: "Fraunces",           heading: "Inter",    body: "Inter" } },
  { id: "classic",    name: "Classique",   desc: "Merriweather · Montserrat · Georgia",  fonts: { display: "Merriweather",       heading: "Montserrat", body: "Georgia" } },
  { id: "clean",      name: "Épuré",       desc: "Libre Baskerville · Nunito · Nunito",  fonts: { display: "Libre Baskerville",  heading: "Nunito",   body: "Nunito" } },
];

// ── Thèmes ──
const THEMES = [
  { id: "theme-1",  name: "Éditorial",    desc: "Serif classique, mise en page journal" },
  { id: "theme-2",  name: "Magazine",     desc: "Grille moderne, images larges" },
  { id: "theme-3",  name: "Presse",       desc: "Colonnes structurées, style news" },
  { id: "theme-4",  name: "Vitrine",      desc: "Cartes & spotlight, impact visuel" },
  { id: "theme-5",  name: "Blog",         desc: "Simple & lisible, focus contenu" },
  { id: "theme-6",  name: "Premium",      desc: "Bicolore, section expertise" },
  { id: "theme-7",  name: "Journal",      desc: "Style newspaper, très dense" },
  { id: "theme-8",  name: "Minimaliste",  desc: "Typographie pure, épuré" },
  { id: "theme-9",  name: "Mosaïque",     desc: "Tuiles colorées, vivant" },
  { id: "theme-10", name: "Dashboard",    desc: "Interface sombre, stats KPI" },
  { id: "theme-11", name: "Feed",         desc: "Défilement vertical, blog moderne" },
  { id: "theme-12", name: "Luxe",         desc: "Noir & or, très haut de gamme" },
];

const TABS = [
  { id: "site",       label: "Site",        icon: "🌐" },
  { id: "theme",      label: "Thème",       icon: "🎨" },
  { id: "style",      label: "Style",       icon: "✦" },
  { id: "categories", label: "Catégories",  icon: "🏷" },
  { id: "accueil",    label: "Accueil",     icon: "🏠" },
];

// ── Wireframes SVG ──
const L  = "rgba(148,163,184,0.16)";
const M  = "rgba(148,163,184,0.30)";
const D  = "rgba(148,163,184,0.50)";
const T  = "rgba(148,163,184,0.20)";
const BG = "rgba(148,163,184,0.07)";

function ThemeWireframe({ id }: { id: string }) {
  const content: Record<string, React.ReactNode> = {
    "theme-1": (
      <>
        <rect x="0" y="0" width="160" height="8" fill={D} />
        <rect x="4" y="11" width="70" height="36" fill={M} rx="1" />
        <rect x="80" y="13" width="30" height="3" fill={T} rx="1" />
        <rect x="80" y="18" width="75" height="6" fill={D} rx="1" />
        <rect x="80" y="26" width="65" height="6" fill={D} rx="1" />
        <rect x="80" y="34" width="75" height="3" fill={T} rx="1" />
        <rect x="80" y="39" width="55" height="3" fill={T} rx="1" />
        <rect x="80" y="44" width="30" height="4" fill={M} rx="2" />
        <line x1="4" y1="53" x2="156" y2="53" stroke={T} strokeWidth="0.7" />
        <rect x="4" y="56" width="36" height="20" fill={M} rx="1" />
        <rect x="44" y="57" width="25" height="3" fill={T} rx="1" />
        <rect x="44" y="62" width="108" height="4" fill={D} rx="1" />
        <rect x="44" y="68" width="90" height="3" fill={T} rx="1" />
        <rect x="44" y="73" width="70" height="3" fill={T} rx="1" />
        <line x1="4" y1="81" x2="156" y2="81" stroke={T} strokeWidth="0.7" />
        {[4,56,108].map(x => <g key={x}><rect x={x} y="83" width="46" height="4" fill={M} rx="1" /></g>)}
      </>
    ),
    "theme-2": (
      <>
        <rect x="0" y="0" width="160" height="46" fill={D} rx="1" />
        <rect x="0" y="0" width="160" height="8" fill="rgba(148,163,184,0.65)" />
        <rect x="8" y="2.5" width="28" height="3" fill={L} rx="1" />
        <rect x="8" y="28" width="30" height="3" fill={L} rx="1" />
        <rect x="8" y="33" width="100" height="6" fill="rgba(255,255,255,0.5)" rx="1" />
        <rect x="8" y="41" width="60" height="3" fill={M} rx="1" />
        <rect x="0" y="46" width="160" height="7" fill={M} />
        {[4,38,72,106,132].map(x => <rect key={x} x={x} y="48" width="26" height="3" fill={L} rx="1" />)}
        <rect x="4" y="57" width="60" height="20" fill={M} rx="1" />
        <rect x="68" y="58" width="20" height="3" fill={T} rx="1" />
        <rect x="68" y="63" width="86" height="5" fill={D} rx="1" />
        <rect x="68" y="70" width="70" height="3" fill={T} rx="1" />
        <rect x="68" y="75" width="55" height="3" fill={T} rx="1" />
        {[4,56,108].map(x => <g key={x}><rect x={x} y="82" width="44" height="7" fill={M} rx="1" /></g>)}
      </>
    ),
    "theme-3": (
      <>
        <rect x="0" y="0" width="160" height="8" fill={D} />
        <rect x="4" y="11" width="84" height="36" fill={M} rx="1" />
        <rect x="92" y="12" width="22" height="3" fill={T} rx="1" />
        <rect x="92" y="17" width="64" height="6" fill={D} rx="1" />
        <rect x="92" y="25" width="56" height="5" fill={D} rx="1" />
        <rect x="92" y="32" width="64" height="3" fill={T} rx="1" />
        <rect x="92" y="37" width="50" height="3" fill={T} rx="1" />
        <rect x="92" y="43" width="28" height="3" fill={T} rx="1" />
        {[4,34,64,94,124].map(x => <g key={x}><rect x={x} y="51" width="26" height="14" fill={L} rx="1" /><rect x={x} y="51" width="26" height="9" fill={M} rx="1" /><rect x={x} y="61" width="22" height="3" fill={T} rx="1" /></g>)}
        <rect x="4" y="70" width="70" height="16" fill={M} rx="1" />
        <rect x="78" y="72" width="22" height="3" fill={T} rx="1" />
        <rect x="78" y="77" width="78" height="4" fill={D} rx="1" />
        <rect x="78" y="83" width="60" height="3" fill={T} rx="1" />
      </>
    ),
    "theme-4": (
      <>
        <rect x="0" y="0" width="160" height="8" fill={D} />
        <rect x="4" y="11" width="88" height="44" fill={D} rx="1" />
        <rect x="10" y="46" width="40" height="5" fill={L} rx="1" />
        <rect x="10" y="41" width="70" height="5" fill="rgba(255,255,255,0.35)" rx="1" />
        <line x1="96" y1="11" x2="96" y2="55" stroke={T} strokeWidth="0.6" />
        {[11,19,27,35,43].map(y => <g key={y}><rect x="100" y={y} width="56" height="3" fill={M} rx="1" /><rect x="100" y={y+4} width="40" height="2" fill={T} rx="1" /></g>)}
        <rect x="4" y="58" width="30" height="3" fill={T} rx="1" />
        {[4,34,64,94,124].map(x => <g key={x}><rect x={x} y="63" width="26" height="14" fill={L} rx="1" /><rect x={x} y="63" width="26" height="8" fill={M} rx="1" /><rect x={x} y="73" width="20" height="3" fill={T} rx="1" /></g>)}
        {[4,57,110].map(x => <rect key={x} x={x} y="81" width="42" height="7" fill={M} rx="1" />)}
      </>
    ),
    "theme-5": (
      <>
        <rect x="0" y="0" width="160" height="8" fill={D} />
        <rect x="4" y="11" width="88" height="44" fill={D} rx="1" />
        <rect x="10" y="38" width="30" height="3" fill={M} rx="1" />
        <rect x="10" y="43" width="70" height="5" fill={L} rx="1" />
        <rect x="10" y="50" width="50" height="3" fill={M} rx="1" />
        {[11,26,41].map(y => <g key={y}><rect x="96" y={y} width="60" height="13" fill={M} rx="1" /><rect x="96" y={y} width="60" height="7" fill={L} rx="1" /><rect x="99" y={y+8} width="44" height="3" fill={T} rx="1" /></g>)}
        {[4,42,80,118].map(x => <g key={x}><rect x={x} y="59" width="34" height="18" fill={L} rx="1" /><rect x={x} y="59" width="34" height="10" fill={M} rx="1" /><rect x={x+2} y="71" width="26" height="3" fill={T} rx="1" /><rect x={x+2} y="75" width="18" height="2" fill={T} rx="1" /></g>)}
        <rect x="0" y="81" width="160" height="8" fill={D} rx="1" />
      </>
    ),
    "theme-6": (
      <>
        <rect x="0" y="0" width="160" height="8" fill={D} />
        <rect x="4" y="11" width="90" height="30" fill={M} rx="1" />
        <rect x="4" y="41" width="90" height="4" fill={D} rx="1" />
        <rect x="4" y="47" width="90" height="3" fill={T} rx="1" />
        <rect x="4" y="52" width="70" height="3" fill={T} rx="1" />
        {[11,22,33,44].map(y => <g key={y}><rect x="98" y={y} width="14" height="9" fill={M} rx="1" /><rect x="115" y={y+1} width="42" height="3" fill={D} rx="1" /><rect x="115" y={y+5} width="30" height="2" fill={T} rx="1" /></g>)}
        <line x1="4" y1="59" x2="156" y2="59" stroke={T} strokeWidth="0.7" />
        <rect x="4" y="61" width="25" height="3" fill={T} rx="1" />
        {[4,56,108].map(x => <g key={x}><rect x={x} y="67" width="44" height="20" fill={L} rx="1" /><rect x={x} y="67" width="44" height="12" fill={M} rx="1" /><rect x={x+3} y="81" width="34" height="3" fill={T} rx="1" /></g>)}
      </>
    ),
    "theme-7": (
      <>
        <rect x="0" y="0" width="160" height="14" fill={D} />
        <rect x="4" y="3" width="22" height="3" fill={M} rx="1" />
        <rect x="55" y="1.5" width="50" height="5" fill={L} rx="1" />
        <rect x="134" y="3" width="22" height="3" fill={M} rx="1" />
        <rect x="4" y="8" width="152" height="0.7" fill={M} />
        <rect x="20" y="10" width="120" height="2.5" fill={T} rx="1" />
        <rect x="0" y="14" width="160" height="6" fill={M} />
        <rect x="4" y="15.5" width="12" height="3" fill={D} rx="1" />
        <rect x="20" y="15.5" width="130" height="3" fill={L} rx="1" />
        <rect x="0" y="20" width="160" height="6" fill={L} />
        {[4,30,56,82,108,128].map(x => <rect key={x} x={x} y="22" width="18" height="2" fill={M} rx="1" />)}
        <rect x="4" y="29" width="62" height="30" fill={M} rx="1" />
        <rect x="6" y="50" width="40" height="4" fill={D} rx="1" />
        <rect x="6" y="55" width="54" height="3" fill={T} rx="1" />
        <line x1="69" y1="27" x2="69" y2="62" stroke={T} strokeWidth="0.6" />
        <line x1="115" y1="27" x2="115" y2="62" stroke={T} strokeWidth="0.6" />
        {[72,118].map(x => <g key={x}><rect x={x} y="29" width="40" height="16" fill={L} rx="1" /><rect x={x} y="47" width="40" height="3" fill={M} rx="1" />{[52,57,62].map(y => <rect key={y} x={x} y={y} width={38-(y%5)*2} height="2.5" fill={T} rx="1" />)}</g>)}
        <line x1="0" y1="65" x2="160" y2="65" stroke={M} strokeWidth="0.8" />
        {[4,42,80,118].map(x => <g key={x}><rect x={x} y="67" width="34" height="9" fill={L} rx="1" /><rect x={x} y="78" width="30" height="3" fill={M} rx="1" /><rect x={x} y="83" width="22" height="2" fill={T} rx="1" /></g>)}
      </>
    ),
    "theme-8": (
      <>
        <rect x="0" y="0" width="160" height="7" fill={T} />
        <rect x="8" y="2" width="24" height="3" fill={D} rx="1" />
        {[60,82,104,126].map(x => <rect key={x} x={x} y="2.5" width="18" height="2" fill={M} rx="1" />)}
        <rect x="8" y="11" width="30" height="2.5" fill={T} rx="1" />
        <rect x="8" y="15" width="130" height="8" fill={D} rx="1" />
        <rect x="8" y="25" width="100" height="8" fill={D} rx="1" />
        <rect x="8" y="36" width="130" height="3" fill={M} rx="1" />
        <rect x="8" y="41" width="100" height="3" fill={T} rx="1" />
        <line x1="8" y1="48" x2="152" y2="48" stroke={M} strokeWidth="0.8" />
        {[8,60,112].map(x => <g key={x}><rect x={x} y="50" width="28" height="6" fill={M} rx="1" /></g>)}
        <line x1="8" y1="60" x2="152" y2="60" stroke={T} strokeWidth="0.6" />
        {[63,70,77,84].map((y, i) => <g key={i}><rect x="8" y={y} width="6" height="3" fill={T} rx="1" /><rect x="18" y={y} width={85+(i%3)*10} height="3" fill={D} rx="1" /><rect x="140" y={y} width="14" height="3" fill={T} rx="1" /></g>)}
      </>
    ),
    "theme-9": (
      <>
        <rect x="0" y="0" width="160" height="9" fill={D} />
        <rect x="4" y="1.5" width="28" height="5" fill={L} rx="1" />
        {[40,68,96,120].map(x => <rect key={x} x={x} y="2.5" width="20" height="4" fill={M} rx="2" />)}
        <rect x="0" y="9" width="160" height="7" fill={M} />
        {[10,62,114].map(x => <rect key={x} x={x} y="11" width="30" height="3" fill={L} rx="1" />)}
        <rect x="4" y="19" width="90" height="32" fill={D} rx="2" />
        <rect x="6" y="42" width="55" height="4" fill={L} rx="1" />
        <rect x="98" y="19" width="58" height="15" fill={M} rx="2" />
        <rect x="98" y="36" width="58" height="15" fill={M} rx="2" />
        <rect x="4" y="54" width="40" height="32" fill={M} rx="2" />
        <rect x="48" y="54" width="52" height="15" fill={L} rx="2" />
        <rect x="104" y="54" width="52" height="15" fill={L} rx="2" />
        <rect x="48" y="71" width="52" height="15" fill={L} rx="2" />
        <rect x="104" y="71" width="52" height="15" fill={L} rx="2" />
      </>
    ),
    "theme-10": (
      <>
        <rect x="0" y="0" width="160" height="9" fill="rgba(50,50,70,0.7)" />
        <rect x="4" y="2" width="22" height="5" fill={D} rx="1" />
        <rect x="120" y="3" width="15" height="3" fill={M} rx="1" />
        <rect x="138" y="3" width="18" height="3" fill={M} rx="1" />
        <rect x="0" y="9" width="32" height="81" fill={M} />
        {[13,20,27,34,41,48].map(y => <rect key={y} x="3" y={y} width="26" height="4" fill={L} rx="1" />)}
        <rect x="128" y="9" width="32" height="81" fill={M} />
        {[13,26,39,52,65,78].map(y => <rect key={y} x="130" y={y} width="28" height="9" fill={L} rx="1" />)}
        {[36,60,84].map(x => <rect key={x} x={x} y="12" width="24" height="10" fill={L} rx="1" />)}
        <rect x="36" y="26" width="86" height="24" fill={L} rx="1" />
        <rect x="36" y="26" width="86" height="15" fill={M} rx="1" />
        <rect x="39" y="43" width="60" height="4" fill={T} rx="1" />
        <rect x="36" y="54" width="40" height="18" fill={L} rx="1" />
        <rect x="82" y="54" width="40" height="18" fill={L} rx="1" />
        <rect x="36" y="75" width="40" height="13" fill={L} rx="1" />
        <rect x="82" y="75" width="40" height="13" fill={L} rx="1" />
      </>
    ),
    "theme-11": (
      <>
        <rect x="0" y="0" width="160" height="8" fill={D} />
        <rect x="40" y="11" width="80" height="3" fill={T} rx="1" />
        <rect x="25" y="16" width="110" height="7" fill={D} rx="1" />
        <rect x="35" y="25" width="90" height="5" fill={M} rx="1" />
        <rect x="0" y="34" width="160" height="7" fill={L} />
        {[20,65,110].map(x => <rect key={x} x={x} y="36" width="28" height="3" fill={M} rx="1" />)}
        <rect x="0" y="41" width="160" height="6" fill={M} />
        {[4,34,64,94,124].map(x => <rect key={x} x={x} y="43" width="22" height="2.5" fill={L} rx="1" />)}
        <rect x="20" y="50" width="120" height="16" fill={M} rx="1" />
        <rect x="22" y="52" width="30" height="3" fill={T} rx="1" />
        <rect x="22" y="57" width="100" height="5" fill={D} rx="1" />
        <rect x="22" y="64" width="80" height="3" fill={T} rx="1" />
        {[70,79,88].map(y => <g key={y}><line x1="20" y1={y} x2="140" y2={y} stroke={T} strokeWidth="0.6" /><rect x="20" y={y+1} width="120" height="7" fill={L} rx="1" /><rect x="107" y={y+1} width="33" height="7" fill={M} rx="1" /><rect x="22" y={y+3} width="75" height="3" fill={D} rx="1" /></g>)}
      </>
    ),
    "theme-12": (
      <>
        <rect x="0" y="0" width="160" height="90" fill="rgba(12,12,16,0.85)" rx="4" />
        <rect x="0" y="0" width="160" height="8" fill="rgba(8,8,12,0.9)" />
        <rect x="6" y="2.5" width="45" height="3" fill="rgba(201,169,110,0.45)" rx="1" />
        <rect x="120" y="3" width="36" height="2" fill="rgba(201,169,110,0.2)" rx="1" />
        <rect x="0" y="8" width="160" height="36" fill="rgba(60,50,40,0.5)" />
        <rect x="6" y="31" width="20" height="2.5" fill="rgba(201,169,110,0.6)" rx="1" />
        <rect x="6" y="35" width="100" height="6" fill="rgba(245,238,225,0.8)" rx="1" />
        <rect x="6" y="43" width="80" height="6" fill="rgba(245,238,225,0.6)" rx="1" />
        <line x1="0" y1="46" x2="160" y2="46" stroke="rgba(201,169,110,0.15)" strokeWidth="0.7" />
        {[2,82].map(x => <g key={x}><rect x={x} y="47" width="76" height="14" fill="rgba(255,255,255,0.06)" rx="1" /><rect x={x} y="47" width="76" height="9" fill="rgba(255,255,255,0.1)" rx="1" /><rect x={x+3} y="58" width="55" height="3" fill="rgba(245,238,225,0.3)" rx="1" /></g>)}
        <line x1="0" y1="63" x2="160" y2="63" stroke="rgba(201,169,110,0.12)" strokeWidth="0.7" />
        {[2,42,82,122].map(x => <g key={x}><rect x={x} y="64" width="36" height="3" fill="rgba(201,169,110,0.3)" rx="1" /><rect x={x} y="69" width="36" height="4" fill="rgba(245,238,225,0.25)" rx="1" /></g>)}
        {[2,57,112].map(x => <g key={x}><rect x={x} y="76" width="44" height="12" fill="rgba(255,255,255,0.06)" rx="1" /><rect x={x} y="76" width="44" height="7" fill="rgba(255,255,255,0.1)" rx="1" /><rect x={x+3} y="85" width="30" height="2.5" fill="rgba(245,238,225,0.2)" rx="1" /></g>)}
      </>
    ),
  };

  return (
    <svg viewBox="0 0 160 90" width="100%" style={{ display: "block", borderRadius: 6, marginBottom: 10, border: "1px solid rgba(148,163,184,0.12)" }}>
      <rect width="160" height="90" fill={BG} rx="4" />
      {content[id]}
    </svg>
  );
}

type HomeContent = {
  heroEyebrow: string; heroLine1: string; heroLine2: string;
  heroSub: string; heroCta: string;
  expertiseEyebrow: string; expertiseTitle: string;
};

const HOME_DEFAULTS: HomeContent = {
  heroEyebrow:      "Conseil & expertise",
  heroLine1:        "Votre référence",
  heroLine2:        "pour tous vos projets",
  heroSub:          "Des experts partagent leurs connaissances pour vous aider à prendre les meilleures décisions.",
  heroCta:          "Découvrir nos conseils →",
  expertiseEyebrow: "Notre expertise",
  expertiseTitle:   "Des conseils d'experts\npour chaque projet",
};

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState("site");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null); // tab id qui vient d'être sauvé
  const [error, setError] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Site
  const [siteId, setSiteId] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Thème
  const [themeId, setThemeId] = useState("theme-1");

  // Style
  const [paletteId, setPaletteId] = useState("warm-earth");
  const [fontPreset, setFontPreset] = useState("editorial");

  // Catégories
  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");

  // Accueil
  const [homeContext, setHomeContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [home, setHome] = useState<HomeContent>(HOME_DEFAULTS);

  useEffect(() => {
    setSiteUrl(window.location.origin);
    Promise.all([
      fetch("/api/sites").then(r => r.json()),
      fetch("/api/setup").then(r => r.json()),
    ]).then(([sites, setupData]) => {
      const site = Array.isArray(sites) ? sites[0] : null;
      if (site) {
        setSiteId(site.id ?? "");
        setSiteName(site.name ?? "");
        setApiKey(site.apiKey ?? "");
        if (site.url && site.url !== "https://monblog.fr") setSiteUrl(site.url);
      }
      const s = setupData?.setup;
      if (s) {
        if (s.categories?.length) {
          setCategories(s.categories);
        } else {
          setIsFirstTime(true);
        }
        if (s.paletteId) setPaletteId(s.paletteId);
        if (s.themeId) setThemeId(s.themeId);
        if (s.homeContent) setHome({ ...HOME_DEFAULTS, ...s.homeContent });
        if (s.fonts) {
          const match = FONT_PRESETS.find(p =>
            p.fonts.display === s.fonts.display &&
            p.fonts.heading === s.fonts.heading &&
            p.fonts.body    === s.fonts.body
          );
          if (match) setFontPreset(match.id);
        }
      } else {
        setIsFirstTime(true);
      }
    });
  }, []);

  function addCat() {
    const v = catInput.trim();
    if (!v || categories.includes(v) || categories.length >= 6) return;
    setCategories(c => [...c, v]);
    setCatInput("");
  }

  function flash(tabId: string) {
    setSaved(tabId);
    setTimeout(() => setSaved(null), 2500);
  }

  async function saveSite() {
    if (!siteName.trim()) { setError("Nom du site requis."); return; }
    setError("");
    setSaving(true);
    try {
      let res;
      if (siteId) {
        res = await fetch(`/api/sites/${siteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: siteName.trim(), url: siteUrl.trim() }),
        });
      } else {
        res = await fetch("/api/sites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: siteName.trim(), url: siteUrl.trim() }),
        });
        if (res.ok) {
          const created = await res.json();
          if (created.id) setSiteId(created.id);
        }
      }
      if (res.ok) flash("site");
    } finally { setSaving(false); }
  }

  async function saveTheme() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/apply-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paletteId, themeId }),
      });
      if (res.ok) flash("theme");
    } finally { setSaving(false); }
  }

  async function saveStyle() {
    setSaving(true);
    const fonts = FONT_PRESETS.find(p => p.id === fontPreset)?.fonts ?? FONT_PRESETS[0].fonts;
    try {
      const res = await fetch("/api/admin/apply-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paletteId, themeId, fonts }),
      });
      if (res.ok) flash("style");
    } finally { setSaving(false); }
  }

  async function saveCategories() {
    if (!categories.length) { setError("Ajoutez au moins une catégorie."); return; }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, paletteId }),
      });
      if (res.ok) { setIsFirstTime(false); flash("categories"); }
    } finally { setSaving(false); }
  }

  async function generateHome() {
    if (!homeContext.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-home-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: homeContext }),
      });
      const data = await res.json();
      if (data.ok) setHome(h => ({ ...h, ...data.data }));
    } finally { setGenerating(false); }
  }

  async function saveHome() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/apply-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paletteId, themeId, homeContent: home }),
      });
      if (res.ok) flash("accueil");
    } finally { setSaving(false); }
  }

  async function handleSave() {
    if (activeTab === "site")       await saveSite();
    if (activeTab === "theme")      await saveTheme();
    if (activeTab === "style")      await saveStyle();
    if (activeTab === "categories") await saveCategories();
    if (activeTab === "accueil")    await saveHome();
  }

  const isSaved = saved === activeTab;

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "inherit", display: "flex", flexDirection: "column" }}>

      {/* ── Barre sticky ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Titre + bouton enregistrer */}
        <div style={{ padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Setup</span>
            {isFirstTime && (
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(251,191,36,0.15)", color: "#f59e0b", border: "1px solid rgba(251,191,36,0.3)", fontWeight: 600 }}>
                Configuration initiale
              </span>
            )}
            {apiKey && (
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: 6, border: "1px solid var(--border)" }}>
                {apiKey.slice(0, 18)}…
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "8px 20px", borderRadius: 8, cursor: saving ? "default" : "pointer",
              fontSize: 13, fontWeight: 600,
              background: isSaved ? "#22c55e" : "var(--accent)",
              color: "#fff",
              border: "none",
              transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {saving ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Enregistrement…
              </>
            ) : isSaved ? (
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

        {/* Onglets */}
        <div style={{ display: "flex", paddingLeft: 32, gap: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(""); }}
              style={{
                padding: "10px 20px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "var(--accent)" : "transparent"}`,
                color: activeTab === tab.id ? "var(--accent-light)" : "var(--text-muted)",
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "color 0.15s, border-color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenu ── */}
      <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#ef4444", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* ── SITE ── */}
        {activeTab === "site" && (
          <div style={{ maxWidth: 480 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Nom et URL de votre site. L&apos;URL est utilisée pour générer les sitemaps et les liens canoniques.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Nom du site" value={siteName} onChange={setSiteName} placeholder="ex: Tout sur la maison" />
              <Field label="URL du site" value={siteUrl} onChange={setSiteUrl} placeholder="https://monsite.fr" />
            </div>

            {apiKey && (
              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  Clé API Pilot
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <code style={{
                    flex: 1, padding: "9px 14px", borderRadius: 8,
                    background: "var(--bg-secondary)", border: "1px solid var(--border)",
                    fontSize: 12, fontFamily: "monospace", letterSpacing: 0.5,
                    color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {apiKey}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copier
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
                  Passez cette clé dans le header <code style={{ fontSize: 11, background: "var(--bg-secondary)", padding: "1px 5px", borderRadius: 4 }}>x-api-key</code> de chaque requête Pilot.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── THÈME ── */}
        {activeTab === "theme" && (
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24, lineHeight: 1.6, maxWidth: 560 }}>
              Choisissez la mise en page de votre site. Vous pouvez changer de thème à tout moment — les articles et catégories sont conservés.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  style={{
                    background: themeId === t.id ? "var(--accent-bg)" : "var(--bg-secondary)",
                    border: `2px solid ${themeId === t.id ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 10, padding: "12px", cursor: "pointer", textAlign: "left",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <ThemeWireframe id={t.id} />
                  <div style={{ fontSize: 10, fontWeight: 700, color: themeId === t.id ? "var(--accent-light)" : "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                    {t.id.replace("theme-", "Thème ")}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STYLE ── */}
        {activeTab === "style" && (
          <div>
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Palette de couleurs</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                {PALETTES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPaletteId(p.id)}
                    style={{
                      background: paletteId === p.id ? "var(--accent-bg)" : "var(--bg-secondary)",
                      border: `2px solid ${paletteId === p.id ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 10, padding: "12px", cursor: "pointer", textAlign: "left",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                      {p.swatch.map((c, i) => (
                        <span key={i} style={{ width: 18, height: 18, borderRadius: 4, background: c, display: "block", flexShrink: 0 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Typographie</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                {FONT_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setFontPreset(p.id)}
                    style={{
                      background: fontPreset === p.id ? "var(--accent-bg)" : "var(--bg-secondary)",
                      border: `2px solid ${fontPreset === p.id ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 10, padding: "14px", cursor: "pointer", textAlign: "left",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── CATÉGORIES ── */}
        {activeTab === "categories" && (
          <div style={{ maxWidth: 480 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Les rubriques de votre site (max 6). Pilot enverra les articles en précisant la catégorie correspondante.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                value={catInput}
                onChange={e => setCatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCat()}
                placeholder="Ex: Maison, Jardin, Voiture…"
                disabled={categories.length >= 6}
                style={inputStyle}
              />
              <button onClick={addCat} disabled={!catInput.trim() || categories.length >= 6} style={btnSecondary}>
                Ajouter
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {categories.map(c => (
                <span key={c} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", fontSize: 13, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                  {c}
                  <button onClick={() => setCategories(cats => cats.filter(x => x !== c))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {categories.length}/6 catégories — La sauvegarde récupère automatiquement des images d&apos;illustration depuis Unsplash.
            </p>
          </div>
        )}

        {/* ── ACCUEIL ── */}
        {activeTab === "accueil" && (
          <div style={{ maxWidth: 600 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Contenu de la page d&apos;accueil. Décrivez votre site et Claude génère les textes, ou remplissez directement.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              <textarea
                value={homeContext}
                onChange={e => setHomeContext(e.target.value)}
                placeholder="Ex: Site de conseils sur la maison, décoration, jardin et piscine pour les propriétaires français…"
                rows={3}
                style={{ ...inputStyle, resize: "vertical", flex: 1 }}
              />
              <button onClick={generateHome} disabled={!homeContext.trim() || generating} style={{ ...btnPrimary, alignSelf: "flex-end", whiteSpace: "nowrap" }}>
                {generating ? "Génère…" : "✦ Générer"}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Accroche (eyebrow)" value={home.heroEyebrow} onChange={v => setHome(h => ({ ...h, heroEyebrow: v }))} />
              <Field label="Titre ligne 1" value={home.heroLine1} onChange={v => setHome(h => ({ ...h, heroLine1: v }))} />
              <Field label="Titre ligne 2" value={home.heroLine2} onChange={v => setHome(h => ({ ...h, heroLine2: v }))} />
              <Field label="Sous-titre" value={home.heroSub} onChange={v => setHome(h => ({ ...h, heroSub: v }))} textarea />
              <Field label="CTA" value={home.heroCta} onChange={v => setHome(h => ({ ...h, heroCta: v }))} />
            </div>
          </div>
        )}

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

// ── Styles partagés ──
const inputStyle: React.CSSProperties = {
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 12px",
  color: "var(--text-primary)",
  fontSize: 13,
  outline: "none",
  width: "100%",
};
const btnPrimary: React.CSSProperties = {
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const btnSecondary: React.CSSProperties = {
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};

function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; textarea?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
      }
    </div>
  );
}
