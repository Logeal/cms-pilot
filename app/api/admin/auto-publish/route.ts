import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function POST() {
  const denied = await requireAuth(); if (denied) return denied;
  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  let mc: Record<string, unknown> = {};
  try { mc = typeof site.menuConfig === "string" ? JSON.parse(site.menuConfig as string) : (site.menuConfig as Record<string, unknown> ?? {}); } catch {}

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

  // Vérifie si c'est l'heure de publier
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

  // Détermine la catégorie cible (rotation)
  let targetCategory: string | null = null;
  let nextCategoryIndex = config.nextCategoryIndex ?? 0;

  if (config.categoryRotation && config.categoryOrder?.length > 0) {
    targetCategory = config.categoryOrder[nextCategoryIndex % config.categoryOrder.length];
  }

  // Cherche le prochain article en brouillon
  const article = await prisma.article.findFirst({
    where: {
      siteId: site.id,
      status: "draft",
      ...(targetCategory ? { category: targetCategory } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  // Si pas trouvé dans la catégorie cible, cherche dans n'importe quelle catégorie
  const articleToPublish = article ?? (targetCategory ? await prisma.article.findFirst({
    where: { siteId: site.id, status: "draft" },
    orderBy: { createdAt: "asc" },
  }) : null);

  if (!articleToPublish) {
    return NextResponse.json({ skipped: true, reason: "No draft articles found" });
  }

  // Publie l'article
  await prisma.article.update({
    where: { id: articleToPublish.id },
    data: { status: "published", publishedAt: now },
  });

  // Calcule la prochaine date de publication
  const intervalMs = config.intervalUnit === "hour"
    ? config.intervalValue * 60 * 60 * 1000
    : config.intervalUnit === "week"
    ? config.intervalValue * 7 * 24 * 60 * 60 * 1000
    : config.intervalValue * 24 * 60 * 60 * 1000; // day

  const nextPublishAt = new Date(now.getTime() + intervalMs).toISOString();

  // Avance la rotation de catégorie
  if (config.categoryRotation && config.categoryOrder?.length > 0) {
    nextCategoryIndex = (nextCategoryIndex + 1) % config.categoryOrder.length;
  }

  // Sauvegarde l'état
  const updatedConfig = {
    ...config,
    lastPublishedAt: now.toISOString(),
    nextPublishAt,
    nextCategoryIndex,
  };

  await prisma.site.update({
    where: { id: site.id },
    data: { menuConfig: { ...mc, autoPublish: updatedConfig } as object },
  });

  return NextResponse.json({
    published: true,
    article: { id: articleToPublish.id, title: articleToPublish.title, category: articleToPublish.category },
    nextPublishAt,
    nextCategory: config.categoryOrder?.[nextCategoryIndex] ?? null,
  });
}

// GET — statut actuel
export async function GET() {
  const denied = await requireAuth(); if (denied) return denied;
  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  let mc: Record<string, unknown> = {};
  try { mc = typeof site.menuConfig === "string" ? JSON.parse(site.menuConfig as string) : (site.menuConfig as Record<string, unknown> ?? {}); } catch {}

  const config = mc.autoPublish as Record<string, unknown> | undefined;
  const draftCount = await prisma.article.count({ where: { siteId: site.id, status: "draft" } });

  return NextResponse.json({ config: config ?? null, draftCount });
}
