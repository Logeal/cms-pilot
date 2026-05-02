import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  const baseSlug = toSlug(title.trim());
  // Ensure slug uniqueness
  const existing = await prisma.article.findMany({
    where: { siteId: site.id, slug: { startsWith: baseSlug } },
    select: { slug: true },
  });
  const slugs = new Set(existing.map(a => a.slug));
  let slug = baseSlug;
  let i = 2;
  while (slugs.has(slug)) { slug = `${baseSlug}-${i++}`; }

  const article = await prisma.article.create({
    data: {
      siteId:   site.id,
      title:    title.trim(),
      slug,
      content:  "",
      category: category ?? null,
      status:   status ?? "draft",
    },
  });

  return NextResponse.json(article, { status: 201 });
}
