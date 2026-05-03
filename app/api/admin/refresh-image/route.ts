import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { prisma } from "@/lib/prisma";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY ?? "";

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { query, articleId } = await req.json() as { query: string; articleId?: string };
  if (!query?.trim()) return NextResponse.json({ error: "query required" }, { status: 400 });

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query.slice(0, 100))}&per_page=5&orientation=landscape&order_by=relevant`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  );
  if (!res.ok) return NextResponse.json({ error: "Unsplash API error" }, { status: 502 });

  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) return NextResponse.json({ error: "No results" }, { status: 404 });

  // Trigger download
  fetch(photo.links.download_location, { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }).catch(() => {});

  const attribution = JSON.stringify({
    name: photo.user.name,
    username: photo.user.username,
    link: `${photo.user.links.html}?utm_source=pilot_cms&utm_medium=referral`,
  });

  // Update article if provided
  if (articleId) {
    await prisma.article.update({
      where: { id: articleId },
      data: { imageUrl: photo.urls.regular, imageAttribution: attribution },
    });
  }

  return NextResponse.json({
    url: photo.urls.regular,
    attribution,
  });
}
