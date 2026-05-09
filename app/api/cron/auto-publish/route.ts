import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findPublishedConflict } from "@/lib/duplicates";

// Called by a VPS cron every 15 min: GET /api/cron/auto-publish?secret=CRON_SECRET
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });

  const provided = req.nextUrl.searchParams.get("secret");
  if (provided !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ skipped: true, reason: "No site" });

  let mc: Record<string, unknown> = {};
  try {
    mc = typeof site.menuConfig === "string"
      ? JSON.parse(site.menuConfig as string)
      : (site.menuConfig as Record<string, unknown> ?? {});
  } catch {}

  const config = mc.autoPublish as {
    enabled: boolean;
    intervalValue: number;
    intervalUnit: "hour" | "day" | "week";
    categoryRotation: boolean;
    categoryOrder: string[];
    nextCategoryIndex: number;
    lastPublishedAt?: string;
    nextPublishAt?: string;
  } | undefined;

  if (!config?.enabled) {
    return NextResponse.json({ skipped: true, reason: "Auto-publish disabled" });
  }

  const now = new Date();
  if (config.nextPublishAt) {
    const nextPublish = new Date(config.nextPublishAt);
    if (now < nextPublish) {
      return NextResponse.json({
        skipped: true,
        reason: "Not yet time",
        nextPublishAt: config.nextPublishAt,
      });
    }
  }

  let targetCategory: string | null = null;
  let nextCategoryIndex = config.nextCategoryIndex ?? 0;

  if (config.categoryRotation && config.categoryOrder?.length > 0) {
    targetCategory = config.categoryOrder[nextCategoryIndex % config.categoryOrder.length];
  }

  // Find a draft to publish that isn't a duplicate of an already-published one.
  // Iterate up to 50 candidates; flag any duplicates we find along the way.
  async function findPublishable(category: string | null) {
    const candidates = await prisma.article.findMany({
      where: {
        siteId: site!.id,
        status: "draft",
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
    for (const c of candidates) {
      const conflictId = await findPublishedConflict(site!.id, c.title, c.id);
      if (conflictId) {
        await prisma.article.update({ where: { id: c.id }, data: { status: "duplicate" } });
        continue;
      }
      return c;
    }
    return null;
  }

  let articleToPublish = await findPublishable(targetCategory);
  if (!articleToPublish && targetCategory) {
    articleToPublish = await findPublishable(null);
  }

  if (!articleToPublish) {
    return NextResponse.json({ skipped: true, reason: "No publishable draft (all conflict with existing published articles)" });
  }

  await prisma.article.update({
    where: { id: articleToPublish.id },
    data: { status: "published", publishedAt: now },
  });

  const intervalMs = config.intervalUnit === "hour"
    ? config.intervalValue * 60 * 60 * 1000
    : config.intervalUnit === "week"
    ? config.intervalValue * 7 * 24 * 60 * 60 * 1000
    : config.intervalValue * 24 * 60 * 60 * 1000;

  const nextPublishAt = new Date(now.getTime() + intervalMs).toISOString();

  if (config.categoryRotation && config.categoryOrder?.length > 0) {
    nextCategoryIndex = (nextCategoryIndex + 1) % config.categoryOrder.length;
  }

  await prisma.site.update({
    where: { id: site.id },
    data: {
      menuConfig: {
        ...mc,
        autoPublish: { ...config, lastPublishedAt: now.toISOString(), nextPublishAt, nextCategoryIndex },
      } as object,
    },
  });

  return NextResponse.json({
    published: true,
    article: { id: articleToPublish.id, title: articleToPublish.title, category: articleToPublish.category },
    nextPublishAt,
  });
}
