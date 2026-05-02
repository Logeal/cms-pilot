import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPalette } from "@/lib/palettes";
import { parseJsonField } from "@/lib/parseJson";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY ?? "";

async function searchUnsplash(query: string, count: number, page = 1): Promise<string[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${Math.min(count, 30)}&page=${page}&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  );
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: { urls: { regular: string } }) => r.urls.regular);
}

async function fetchUniquePool(query: string, needed: number, usedUrls: Set<string>): Promise<string[]> {
  const pool: string[] = [];
  let page = 1;
  while (pool.length < needed && page <= 4) {
    const urls = await searchUnsplash(query, 30, page);
    if (!urls.length) break;
    for (const u of urls) {
      if (!usedUrls.has(u) && !pool.includes(u)) pool.push(u);
      if (pool.length >= needed) break;
    }
    page++;
  }
  return pool;
}

function toSlug(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const { categories, paletteId } = await req.json() as { categories: string[]; paletteId: string };
  if (!categories?.length) return NextResponse.json({ error: "categories required" }, { status: 400 });

  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  const palette = getPalette(paletteId);
  const usedUrls = new Set<string>();

  // Images (code existant inchangé)
  const heroQuery = categories.join(" ") + " lifestyle professional";
  const heroImages = await fetchUniquePool(heroQuery, 1, usedUrls);
  const heroImageUrl = heroImages[0] ?? null;
  if (heroImageUrl) usedUrls.add(heroImageUrl);

  const categoryQueries: Record<string, string> = {
    "Maison": "beautiful home interior architecture france",
    "Décoration": "interior design elegant living room decor",
    "Immobilier": "real estate luxury property house exterior",
    "Jardin": "garden landscape beautiful outdoor plants",
    "Piscine": "swimming pool luxury outdoor summer",
    "Voiture": "luxury car automobile showroom",
    "Moto": "motorcycle motorbike road adventure",
    "Cuisine": "kitchen gourmet cooking food professional",
    "Sport": "sport fitness training professional athlete",
    "Voyage": "travel landscape destination beautiful scenery",
    "Finance": "finance investment business professional office",
    "Santé": "health wellness medical professional calm",
    "Technologie": "technology innovation digital modern",
    "Mode": "fashion style clothing elegant",
    "Beauté": "beauty cosmetics elegant professional",
  };
  const categoryHeroImages: Record<string, string> = {};
  for (const cat of categories) {
    const query = categoryQueries[cat] ?? `${cat} professional lifestyle high quality`;
    const imgs = await fetchUniquePool(query, 2, usedUrls);
    if (imgs[0]) { categoryHeroImages[cat] = imgs[0]; usedUrls.add(imgs[0]); }
  }

  // Upsert chaque catégorie dans la table Category avec fromSetup: true
  for (const cat of categories) {
    const slug = toSlug(cat);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      await prisma.category.update({ where: { slug }, data: { label: cat, fromSetup: true } });
    } else {
      await prisma.category.create({ data: { label: cat, slug, fromSetup: true } });
    }
  }

  // Merger avec la config existante (ne pas écraser les nav items)
  const existingConfig = parseJsonField(site.menuConfig);
  const existingItems: Array<{ id: string; type: string; label: string; slug?: string; url?: string; enabled: boolean; level: number }> =
    (existingConfig as { items?: Array<{ id: string; type: string; label: string; slug?: string; url?: string; enabled: boolean; level: number }> })?.items ?? [];

  // Ajouter les catégories setup dans les nav items si elles n'y sont pas
  const newItems = [...existingItems];
  for (const cat of categories) {
    const slug = toSlug(cat);
    const alreadyInNav = newItems.some(i => i.type === "category" && i.slug === slug);
    if (!alreadyInNav) {
      newItems.push({
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        type: "category",
        label: cat,
        slug,
        enabled: true,
        level: 0,
      });
    }
  }

  const config = {
    ...existingConfig,
    items: newItems,
    showLogo: (existingConfig as { showLogo?: boolean }).showLogo ?? true,
    setup: {
      categories,
      paletteId,
      colors: palette.colors,
      heroImageUrl,
      categoryHeroImages,
      updatedAt: new Date().toISOString(),
    },
  };

  await prisma.site.update({ where: { id: site.id }, data: { menuConfig: config } });
  return NextResponse.json({ ok: true, updated: 0, heroImageUrl, palette: paletteId });
}

export async function GET() {
  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ setup: null });
  const config = parseJsonField(site.menuConfig);
  return NextResponse.json({ setup: config.setup ?? null });
}
