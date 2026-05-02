export interface Palette {
  id: string;
  name: string;
  swatch: string[]; // 5 couleurs pour l'aperçu
  colors: {
    dark: string;
    brand: string;
    brandLight: string;
    accent: string;
    bg: string;
    bgAlt: string;
    secondary: string;
    mid: string;
    border: string;
  };
}

export const PALETTES: Palette[] = [
  {
    id: "warm-earth",
    name: "Terre chaude",
    swatch: ["#FAF8F4", "#C4A882", "#2D4A35", "#C4603A", "#1C1C1A"],
    colors: { dark: "#1C1C1A", brand: "#2D4A35", brandLight: "#3D6347", accent: "#C4603A", bg: "#FAF8F4", bgAlt: "#F2EDE6", secondary: "#C4A882", mid: "#6B6560", border: "#E2D9D0" },
  },
  {
    id: "ocean-deep",
    name: "Océan profond",
    swatch: ["#F4F9FC", "#85C1E9", "#1B4F72", "#2E86AB", "#0D1B2A"],
    colors: { dark: "#0D1B2A", brand: "#1B4F72", brandLight: "#2260A0", accent: "#2E86AB", bg: "#F4F9FC", bgAlt: "#E8F4F8", secondary: "#85C1E9", mid: "#567A8A", border: "#C8DDE8" },
  },
  {
    id: "bordeaux",
    name: "Bordeaux élégant",
    swatch: ["#FDF5F5", "#E8C4C4", "#6B1B1B", "#C0392B", "#1A0A0A"],
    colors: { dark: "#1A0A0A", brand: "#6B1B1B", brandLight: "#8B2B2B", accent: "#C0392B", bg: "#FDF5F5", bgAlt: "#F5E8E8", secondary: "#E8C4C4", mid: "#7A5555", border: "#E8D0D0" },
  },
  {
    id: "sage",
    name: "Sauge naturel",
    swatch: ["#F6F8F4", "#B8C9A3", "#4A6741", "#8B9E5C", "#1A2117"],
    colors: { dark: "#1A2117", brand: "#4A6741", brandLight: "#5D7D54", accent: "#8B9E5C", bg: "#F6F8F4", bgAlt: "#ECF0E8", secondary: "#B8C9A3", mid: "#5E6E5A", border: "#D4DDD0" },
  },
  {
    id: "slate-orange",
    name: "Ardoise & Ambre",
    swatch: ["#F5F7FA", "#5D9CEC", "#1B3A5C", "#E67E22", "#0F1C2E"],
    colors: { dark: "#0F1C2E", brand: "#1B3A5C", brandLight: "#244D78", accent: "#E67E22", bg: "#F5F7FA", bgAlt: "#EAEEf4", secondary: "#5D9CEC", mid: "#5A6E82", border: "#C8D4E0" },
  },
  {
    id: "plum",
    name: "Prune sophistiqué",
    swatch: ["#FAF5FC", "#D7A8E8", "#4A1A5C", "#9B59B6", "#1A0F1F"],
    colors: { dark: "#1A0F1F", brand: "#4A1A5C", brandLight: "#5E2278", accent: "#9B59B6", bg: "#FAF5FC", bgAlt: "#F2E8F8", secondary: "#D7A8E8", mid: "#6B5575", border: "#DCCCE8" },
  },
  {
    id: "gold-charcoal",
    name: "Or & Charbon",
    swatch: ["#FAFAF5", "#C4AA5C", "#3D3206", "#D4A017", "#1A1608"],
    colors: { dark: "#1A1608", brand: "#3D3206", brandLight: "#554A10", accent: "#D4A017", bg: "#FAFAF5", bgAlt: "#F2F0E5", secondary: "#C4AA5C", mid: "#6A6040", border: "#DDD8BC" },
  },
  {
    id: "coral-navy",
    name: "Corail & Marine",
    swatch: ["#F5F8FA", "#F2A65A", "#1A3A5C", "#E84855", "#0F1923"],
    colors: { dark: "#0F1923", brand: "#1A3A5C", brandLight: "#234E78", accent: "#E84855", bg: "#F5F8FA", bgAlt: "#EAF0F5", secondary: "#F2A65A", mid: "#5A6878", border: "#C8D4DE" },
  },
  {
    id: "mineral",
    name: "Minéral épuré",
    swatch: ["#F8F8F8", "#A8A8A8", "#2C2C2C", "#E63946", "#1C1C1C"],
    colors: { dark: "#1C1C1C", brand: "#2C2C2C", brandLight: "#444444", accent: "#E63946", bg: "#F8F8F8", bgAlt: "#EEEEEE", secondary: "#A8A8A8", mid: "#686868", border: "#D8D8D8" },
  },
  {
    id: "forest-honey",
    name: "Forêt & Miel",
    swatch: ["#FAF8F2", "#D4A853", "#2D5016", "#C4891A", "#1A1C0F"],
    colors: { dark: "#1A1C0F", brand: "#2D5016", brandLight: "#3D6520", accent: "#C4891A", bg: "#FAF8F2", bgAlt: "#F2EEE0", secondary: "#D4A853", mid: "#5E6040", border: "#DDD8C0" },
  },
  {
    id: "teal",
    name: "Teal moderne",
    swatch: ["#F4FAFA", "#76D7C4", "#1A5C55", "#17A589", "#0D1B1A"],
    colors: { dark: "#0D1B1A", brand: "#1A5C55", brandLight: "#22756D", accent: "#17A589", bg: "#F4FAFA", bgAlt: "#E8F5F4", secondary: "#76D7C4", mid: "#4A6E6A", border: "#C0DEDD" },
  },
  {
    id: "brick-linen",
    name: "Brique & Lin",
    swatch: ["#FAF6F0", "#D4B896", "#6B3F2A", "#E07B39", "#1C110A"],
    colors: { dark: "#1C110A", brand: "#6B3F2A", brandLight: "#8A5238", accent: "#E07B39", bg: "#FAF6F0", bgAlt: "#F2EAE0", secondary: "#D4B896", mid: "#7A6050", border: "#DDD0C0" },
  },
  {
    id: "night-sky",
    name: "Nuit étoilée",
    swatch: ["#F5F5FF", "#B0B8F8", "#1A1A6B", "#5D67E8", "#050520"],
    colors: { dark: "#050520", brand: "#1A1A6B", brandLight: "#252585", accent: "#5D67E8", bg: "#F5F5FF", bgAlt: "#EAEAF8", secondary: "#B0B8F8", mid: "#5050A0", border: "#D0D0EE" },
  },
  {
    id: "jade",
    name: "Jade & Émeraude",
    swatch: ["#F4FAF6", "#82E0AA", "#145A3C", "#27AE60", "#0A1C14"],
    colors: { dark: "#0A1C14", brand: "#145A3C", brandLight: "#1A7250", accent: "#27AE60", bg: "#F4FAF6", bgAlt: "#E8F5EC", secondary: "#82E0AA", mid: "#486A55", border: "#C0DDCA" },
  },
  {
    id: "copper-slate",
    name: "Cuivre & Ardoise",
    swatch: ["#FAF7F4", "#C49A6C", "#3D2B1A", "#B87333", "#1A1510"],
    colors: { dark: "#1A1510", brand: "#3D2B1A", brandLight: "#553D28", accent: "#B87333", bg: "#FAF7F4", bgAlt: "#F0EAE4", secondary: "#C49A6C", mid: "#7A6050", border: "#E0D4C8" },
  },
  {
    id: "indigo-peach",
    name: "Indigo & Pêche",
    swatch: ["#F5F5FF", "#A29BFE", "#1A1A5C", "#F39C12", "#0F0F2A"],
    colors: { dark: "#0F0F2A", brand: "#1A1A5C", brandLight: "#252578", accent: "#F39C12", bg: "#F5F5FF", bgAlt: "#EAEAF8", secondary: "#A29BFE", mid: "#5050A0", border: "#D0D0EE" },
  },
  {
    id: "autumn",
    name: "Automne",
    swatch: ["#FAF5EF", "#E8A87C", "#5C3010", "#E67E22", "#1C1208"],
    colors: { dark: "#1C1208", brand: "#5C3010", brandLight: "#78401A", accent: "#E67E22", bg: "#FAF5EF", bgAlt: "#F2EAE0", secondary: "#E8A87C", mid: "#7A5A40", border: "#E0D0C0" },
  },
  {
    id: "ice-pine",
    name: "Glace & Pin",
    swatch: ["#F5F8FA", "#85C1E9", "#1A3A2C", "#2980B9", "#0A1520"],
    colors: { dark: "#0A1520", brand: "#1A3A2C", brandLight: "#225040", accent: "#2980B9", bg: "#F5F8FA", bgAlt: "#EAF0F5", secondary: "#85C1E9", mid: "#4A6878", border: "#C8D8E4" },
  },
  {
    id: "rose-taupe",
    name: "Rose & Taupe",
    swatch: ["#FFF5F8", "#F0A0B8", "#6B1530", "#E84877", "#1C0A0F"],
    colors: { dark: "#1C0A0F", brand: "#6B1530", brandLight: "#8A1F40", accent: "#E84877", bg: "#FFF5F8", bgAlt: "#F8E8F0", secondary: "#F0A0B8", mid: "#7A5060", border: "#E8D0D8" },
  },
  {
    id: "graphite-lime",
    name: "Graphite & Citron",
    swatch: ["#F5F5F2", "#B8CC5A", "#2A2A2A", "#8BC34A", "#111111"],
    colors: { dark: "#111111", brand: "#2A2A2A", brandLight: "#444444", accent: "#8BC34A", bg: "#F5F5F2", bgAlt: "#EBEBE5", secondary: "#B8CC5A", mid: "#606060", border: "#D8D8D0" },
  },
  {
    id: "flamingo-teal",
    name: "Flamingo & Teal",
    swatch: ["#FFF0F5", "#FF6B9D", "#0D4D4D", "#00B4B4", "#0A2020"],
    colors: { dark: "#0A2020", brand: "#0D4D4D", brandLight: "#1A6666", accent: "#FF6B9D", bg: "#FFF0F5", bgAlt: "#FFE0EC", secondary: "#00B4B4", mid: "#4A6A6A", border: "#C8E8E8" },
  },
  {
    id: "maroon-gold",
    name: "Bordeaux & Or",
    swatch: ["#FFF8F0", "#D4A017", "#5C1A1A", "#E84855", "#1A0808"],
    colors: { dark: "#1A0808", brand: "#5C1A1A", brandLight: "#7A2525", accent: "#D4A017", bg: "#FFF8F0", bgAlt: "#F5EBE0", secondary: "#D4A017", mid: "#7A5050", border: "#E8D0C8" },
  },
  {
    id: "electric-dark",
    name: "Électrique",
    swatch: ["#F0F0FF", "#7C5CFC", "#1A0A3A", "#00D4FF", "#0A0520"],
    colors: { dark: "#0A0520", brand: "#1A0A3A", brandLight: "#2D1A5C", accent: "#7C5CFC", bg: "#F0F0FF", bgAlt: "#E8E0FF", secondary: "#00D4FF", mid: "#5050A0", border: "#D0C8F0" },
  },
  {
    id: "olive-terracotta",
    name: "Olive & Terracotta",
    swatch: ["#FAF8F0", "#C49A6C", "#4A4A1A", "#D4691E", "#1A1A0A"],
    colors: { dark: "#1A1A0A", brand: "#4A4A1A", brandLight: "#626228", accent: "#D4691E", bg: "#FAF8F0", bgAlt: "#F2EDE0", secondary: "#C49A6C", mid: "#6A6A40", border: "#DDDAC8" },
  },
  {
    id: "arctic",
    name: "Arctique",
    swatch: ["#F0F8FF", "#80D8FF", "#1A3A5C", "#FF7043", "#0A1C2E"],
    colors: { dark: "#0A1C2E", brand: "#1A3A5C", brandLight: "#244E78", accent: "#FF7043", bg: "#F0F8FF", bgAlt: "#E0F2FF", secondary: "#80D8FF", mid: "#4A6880", border: "#B8D8F0" },
  },
  {
    id: "dusty-rose",
    name: "Rose poudré",
    swatch: ["#FFF5F5", "#F4B8C8", "#5C2233", "#E07898", "#1A0A10"],
    colors: { dark: "#1A0A10", brand: "#5C2233", brandLight: "#7A2E45", accent: "#E07898", bg: "#FFF5F5", bgAlt: "#FCEAF0", secondary: "#F4B8C8", mid: "#7A5060", border: "#EED0D8" },
  },
  {
    id: "midnight-orange",
    name: "Minuit & Orange",
    swatch: ["#F8F5FF", "#FF9500", "#1A1A3A", "#FF6B00", "#0A0A1A"],
    colors: { dark: "#0A0A1A", brand: "#1A1A3A", brandLight: "#28285C", accent: "#FF6B00", bg: "#F8F5FF", bgAlt: "#F0EAFF", secondary: "#FF9500", mid: "#505080", border: "#D8D0F0" },
  },
  {
    id: "malachite",
    name: "Malachite",
    swatch: ["#F0FFF5", "#00E676", "#1A3D2B", "#00C853", "#0A1C14"],
    colors: { dark: "#0A1C14", brand: "#1A3D2B", brandLight: "#255238", accent: "#00C853", bg: "#F0FFF5", bgAlt: "#E0FFE8", secondary: "#00E676", mid: "#3A6A50", border: "#B8EEC8" },
  },
  {
    id: "sand-crimson",
    name: "Sable & Cramoisi",
    swatch: ["#FFF8F0", "#E8C89A", "#6B0F1A", "#C0392B", "#1A0808"],
    colors: { dark: "#1A0808", brand: "#6B0F1A", brandLight: "#8A1A28", accent: "#C0392B", bg: "#FFF8F0", bgAlt: "#F5EDE0", secondary: "#E8C89A", mid: "#7A5555", border: "#E8D8C8" },
  },
  {
    id: "lavender-dark",
    name: "Lavande profonde",
    swatch: ["#F8F5FF", "#C3A8F0", "#3A1A6B", "#9B59B6", "#150A2A"],
    colors: { dark: "#150A2A", brand: "#3A1A6B", brandLight: "#4E2590", accent: "#9B59B6", bg: "#F8F5FF", bgAlt: "#F0E8FF", secondary: "#C3A8F0", mid: "#6848A0", border: "#DDD0F5" },
  },
  {
    id: "peacock",
    name: "Paon",
    swatch: ["#F0FAFA", "#40E0D0", "#0A3D3D", "#008080", "#051A1A"],
    colors: { dark: "#051A1A", brand: "#0A3D3D", brandLight: "#145252", accent: "#008080", bg: "#F0FAFA", bgAlt: "#E0F5F5", secondary: "#40E0D0", mid: "#3A6868", border: "#B8E0E0" },
  },
  {
    id: "cherry-blossom",
    name: "Fleur de cerisier",
    swatch: ["#FFF0F8", "#FFB7C5", "#5C1A35", "#FF69B4", "#1A0810"],
    colors: { dark: "#1A0810", brand: "#5C1A35", brandLight: "#7A2548", accent: "#FF69B4", bg: "#FFF0F8", bgAlt: "#FFE0F0", secondary: "#FFB7C5", mid: "#7A4560", border: "#F0C8D8" },
  },
  {
    id: "rust-cream",
    name: "Rouille & Crème",
    swatch: ["#FDF8F0", "#F0B885", "#7A2D0F", "#BF5B1A", "#200A00"],
    colors: { dark: "#200A00", brand: "#7A2D0F", brandLight: "#9E3D18", accent: "#BF5B1A", bg: "#FDF8F0", bgAlt: "#F5EDE0", secondary: "#F0B885", mid: "#7A5540", border: "#E5D5C5" },
  },
  {
    id: "navy-gold",
    name: "Marine & Doré",
    swatch: ["#F5F8FF", "#FFD700", "#0A1A4A", "#FFA500", "#050D28"],
    colors: { dark: "#050D28", brand: "#0A1A4A", brandLight: "#142468", accent: "#FFA500", bg: "#F5F8FF", bgAlt: "#EAF0FF", secondary: "#FFD700", mid: "#4A5880", border: "#C8D4F0" },
  },
  {
    id: "forest-berry",
    name: "Forêt & Baie",
    swatch: ["#F8FFF5", "#A8D5A2", "#1A3A1A", "#8B1A1A", "#0A1A0A"],
    colors: { dark: "#0A1A0A", brand: "#1A3A1A", brandLight: "#284E28", accent: "#8B1A1A", bg: "#F8FFF5", bgAlt: "#EEF8E8", secondary: "#A8D5A2", mid: "#4A6A4A", border: "#C8E0C8" },
  },
  {
    id: "cobalt-amber",
    name: "Cobalt & Ambre",
    swatch: ["#F0F5FF", "#FFBF00", "#0A2A6B", "#1E90FF", "#050F28"],
    colors: { dark: "#050F28", brand: "#0A2A6B", brandLight: "#133890", accent: "#FFBF00", bg: "#F0F5FF", bgAlt: "#E0EAFF", secondary: "#1E90FF", mid: "#3A5890", border: "#B8CCF0" },
  },
  {
    id: "blush-charcoal",
    name: "Blush & Charbon",
    swatch: ["#FFF8FA", "#F5C6D0", "#2A2A2A", "#FF8FA3", "#111111"],
    colors: { dark: "#111111", brand: "#2A2A2A", brandLight: "#424242", accent: "#FF8FA3", bg: "#FFF8FA", bgAlt: "#FFEEF2", secondary: "#F5C6D0", mid: "#686868", border: "#F0D8DE" },
  },
  {
    id: "pine-copper",
    name: "Pin & Cuivre",
    swatch: ["#F5FAF5", "#B87333", "#1A3A2A", "#4CAF50", "#0A1A10"],
    colors: { dark: "#0A1A10", brand: "#1A3A2A", brandLight: "#254E38", accent: "#B87333", bg: "#F5FAF5", bgAlt: "#E8F5E8", secondary: "#4CAF50", mid: "#4A6A50", border: "#C8E0C8" },
  },
  {
    id: "violet-sand",
    name: "Violet & Sable",
    swatch: ["#FAF8FF", "#D4C5A9", "#3D1A5C", "#7B2D8B", "#150A20"],
    colors: { dark: "#150A20", brand: "#3D1A5C", brandLight: "#522580", accent: "#7B2D8B", bg: "#FAF8FF", bgAlt: "#F2EEF8", secondary: "#D4C5A9", mid: "#6A5580", border: "#DDD5F0" },
  },
];

export const DEFAULT_PALETTE_ID = "warm-earth";

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
