import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const article = await prisma.article.findFirst({
    where: {
      siteId: site.id,
      status: "draft",
      ...(targetCategory ? { category: targetCategory } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const articleToPublish = article ?? (targetCategory ? await prisma.article.findFirst({
    where: { siteId: site.id, status: "draft" },
    orderBy: { createdAt: "asc" },
  }) : null);

  if (!articleToPublish) {
    return NextResponse.json({ skipped: true, reason: "No draft articles" });
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
