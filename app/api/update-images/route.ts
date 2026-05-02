import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY ?? "";

const categoryQueries: Record<string, string> = {
  "Immobilier":  "real estate luxury house france",
  "Décoration":  "interior decoration living room elegant",
  "Maison":      "beautiful home interior architecture",
  "Jardin":      "garden flowers outdoor french",
  "Piscine":     "swimming pool luxury outdoor",
  "Finance":     "finance investment business professional",
  "Santé":       "health wellness nature calm",
  "Emploi":      "work office professional modern",
  "Droit":       "law justice architecture serious",
  "Voyage":      "travel landscape beautiful destination",
  "High-Tech":   "technology modern device innovation",
  "Conseils":    "advice professional meeting consultation",
};

async function fetchUnsplashPool(query: string, needed: number): Promise<string[]> {
  const urls: string[] = [];
  let page = 1;

  while (urls.length < needed && page <= 5) {
    const perPage = Math.min(30, needed - urls.length + 5);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (!data.results?.length) break;

    for (const r of data.results) {
      const url = r.urls.regular as string;
      if (!urls.includes(url)) urls.push(url);
    }
    page++;
  }

  return urls;
}

export async function GET() {
  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site found" }, { status: 404 });

  const articles = await prisma.article.findMany({
    where: { siteId: site.id },
    select: { id: true, category: true },
    orderBy: { publishedAt: "desc" },
  });

  // Grouper par catégorie
  const byCat: Record<string, string[]> = {};
  for (const a of articles) {
    const cat = a.category ?? "Maison";
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(a.id);
  }

  // Pool global d'URLs déjà utilisées — garantit l'unicité sur tout le site
  const usedUrls = new Set<string>();
  let updated = 0;

  for (const [cat, ids] of Object.entries(byCat)) {
    const query = categoryQueries[cat] ?? `${cat} home interior`;
    const pool = await fetchUnsplashPool(query, ids.length + 10);

    // On filtre les URLs déjà utilisées dans d'autres catégories
    const available = pool.filter((u) => !usedUrls.has(u));

    for (let i = 0; i < ids.length; i++) {
      const imageUrl = available[i];
      if (!imageUrl) continue; // pas assez d'images Unsplash dispo

      usedUrls.add(imageUrl);
      await prisma.article.update({
        where: { id: ids[i] },
        data: { imageUrl },
      });
      updated++;
    }
  }

  return NextResponse.json({ ok: true, updated, totalUnique: usedUrls.size });
}
