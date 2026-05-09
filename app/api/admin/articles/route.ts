import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { toSlug, isValidStatus } from "@/lib/slug";
import { findPublishedConflict } from "@/lib/duplicates";

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { title, category, status } = await req.json() as {
    title: string;
    category?: string;
    status?: string;
  };

  if (!title?.trim()) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  if (status !== undefined && !isValidStatus(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  const baseSlug = toSlug(title.trim());
  if (!baseSlug) {
    return NextResponse.json({ error: "title has no slug-able characters" }, { status: 400 });
  }
  // Ensure slug uniqueness
  const existing = await prisma.article.findMany({
    where: { siteId: site.id, slug: { startsWith: baseSlug } },
    select: { slug: true },
  });
  const slugs = new Set(existing.map(a => a.slug));
  let slug = baseSlug;
  let i = 2;
  while (slugs.has(slug)) { slug = `${baseSlug}-${i++}`; }

  // If creating directly as published, refuse if a duplicate exists.
  let resolvedStatus = status ?? "draft";
  if (resolvedStatus === "published") {
    const conflictId = await findPublishedConflict(site.id, title.trim());
    if (conflictId) resolvedStatus = "duplicate";
  }

  const article = await prisma.article.create({
    data: {
      siteId:   site.id,
      title:    title.trim(),
      slug,
      content:  "",
      category: category ?? null,
      status:   resolvedStatus,
      publishedAt: resolvedStatus === "published" ? new Date() : null,
    },
  });

  return NextResponse.json(article, { status: 201 });
}
