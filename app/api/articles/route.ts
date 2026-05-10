import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { findPublishedConflict } from "@/lib/duplicates";
import { requireAuth } from "@/lib/requireAuth";
import { getSession } from "@/lib/auth";
import { toSlug, isValidStatus } from "@/lib/slug";

const PRIVATE_IP = /^(https?:\/\/)(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0|::1)/i;

async function mirrorImage(url: string): Promise<string> {
  try {
    if (PRIVATE_IP.test(url)) return url;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return url;
    const contentType = res.headers.get("content-type") ?? "";
    const extMap: Record<string, string> = {
      "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp",
      "image/gif": ".gif", "image/svg+xml": ".svg",
    };
    const ext = extMap[contentType.split(";")[0].trim()] ?? path.extname(new URL(url).pathname) ?? ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > 10 * 1024 * 1024) return url; // 10 MB max
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(path.join(uploadsDir, filename), buffer);
    return `/uploads/${filename}`;
  } catch {
    return url;
  }
}

// POST /api/articles — called by Pilot with Bearer <apiKey>
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = authHeader.replace("Bearer ", "").trim();
  const site = await prisma.site.findUnique({ where: { apiKey } });
  if (!site) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  let body: {
    title?: string;
    slug?: string;
    content?: string;
    introduction?: string;
    metaTitle?: string;
    metaDescription?: string;
    category?: string;
    status?: string;
    imageUrl?: string;
    subject?: string;
    keyword?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, slug: rawSlug, content, introduction, metaTitle, metaDescription, category, status, imageUrl, subject, keyword } = body;

  if (!title || !rawSlug || !content) {
    return NextResponse.json(
      { error: "title, slug and content are required" },
      { status: 400 }
    );
  }

  if (status !== undefined && !isValidStatus(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const slug = toSlug(rawSlug);
  if (!slug) {
    return NextResponse.json({ error: "slug is empty after normalization" }, { status: 400 });
  }

  // Mirror external images locally so they don't disappear if the source dies
  const localImageUrl = imageUrl && imageUrl.startsWith("http")
    ? await mirrorImage(imageUrl)
    : imageUrl ?? null;

  const existing = await prisma.article.findUnique({
    where: { siteId_slug: { siteId: site.id, slug } },
    select: { id: true, publishedAt: true },
  });

  // If another already-published article in this site has the same title,
  // refuse to publish this one — flag it as a duplicate instead.
  const conflictId = await findPublishedConflict(site.id, title, existing?.id);
  let resolvedStatus = status ?? "draft";
  if (conflictId && resolvedStatus === "published") {
    resolvedStatus = "duplicate";
  }

  // Preserve original publishedAt if the article was already published.
  const publishedAt = resolvedStatus === "published"
    ? (existing?.publishedAt ?? new Date())
    : null;

  const article = await prisma.article.upsert({
    where: { siteId_slug: { siteId: site.id, slug } },
    update: {
      title,
      content,
      introduction:    introduction ?? null,
      metaTitle:       metaTitle ?? null,
      metaDescription: metaDescription ?? null,
      category:        category ?? null,
      status:          resolvedStatus,
      imageUrl:        localImageUrl,
      subject:         subject ?? null,
      keyword:         keyword ?? null,
      publishedAt,
    },
    create: {
      siteId: site.id,
      title,
      slug,
      content,
      introduction:    introduction ?? null,
      metaTitle:       metaTitle ?? null,
      metaDescription: metaDescription ?? null,
      category:        category ?? null,
      status:          resolvedStatus,
      imageUrl:        localImageUrl,
      subject:         subject ?? null,
      keyword:         keyword ?? null,
      publishedAt,
    },
  });

  const baseUrl = site.url.replace(/\/$/, "");
  const articleUrl = article.category
    ? `${baseUrl}/${toSlug(article.category)}/${article.slug}`
    : `${baseUrl}/${article.slug}`;
  return NextResponse.json(
    { id: article.id, slug: article.slug, status: article.status, url: articleUrl },
    { status: 201 }
  );
}

// GET /api/articles — admin list (also accessible to workers, but with the
// article body redacted: workers should only see metadata + image URL).
export async function GET(req: NextRequest) {
  const denied = await requireAuth(["admin", "worker"]);
  if (denied) return denied;

  const session = await getSession();
  const isWorker = session?.role === "worker";

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId");

  const articles = isWorker
    ? await prisma.article.findMany({
        where: siteId ? { siteId } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, title: true, slug: true, status: true, category: true,
          imageUrl: true, keyword: true, titleEn: true, keywordEn: true,
          createdAt: true,
          site: { select: { name: true, url: true } },
        },
      })
    : await prisma.article.findMany({
        where: siteId ? { siteId } : undefined,
        orderBy: { createdAt: "desc" },
        include: { site: { select: { name: true, url: true } } },
      });

  return NextResponse.json(articles);
}
