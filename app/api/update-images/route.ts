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

type UnsplashPhoto = { url: string; attribution: string };

async function fetchUnsplashPool(query: string, needed: number): Promise<UnsplashPhoto[]> {
  const photos: UnsplashPhoto[] = [];
  const seen = new Set<string>();
  let page = 1;

  while (photos.length < needed && page <= 5) {
    const perPage = Math.min(30, needed - photos.length + 5);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (!data.results?.length) break;

    for (const r of data.results) {
      const url = r.urls.regular as string;
      if (!seen.has(url)) {
        seen.add(url);
        photos.push({
          url,
          attribution: JSON.stringify({
            name: r.user.name,
            username: r.user.username,
            link: `${r.user.links.html}?utm_source=pilot_cms&utm_medium=referral`,
          }),
        });
      }
    }
    page++;
  }

  return photos;
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

    const available = pool.filter((p) => !usedUrls.has(p.url));

    for (let i = 0; i < ids.length; i++) {
      const photo = available[i];
      if (!photo) continue;

      usedUrls.add(photo.url);
      // Trigger download as required by Unsplash guidelines
      fetch(`https://api.unsplash.com/photos/${photo.url.match(/photo-([^?/]+)/)?.[1]}/download`, {
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
      }).catch(() => {});
      await prisma.article.update({
        where: { id: ids[i] },
        data: { imageUrl: photo.url, imageAttribution: photo.attribution },
      });
      updated++;
    }
  }

  return NextResponse.json({ ok: true, updated, totalUnique: usedUrls.size });
}
