import { prisma } from "./prisma";
import { findPublishedConflict } from "./duplicates";

type AutoPublishConfig = {
  enabled: boolean;
  intervalValue: number;
  intervalUnit: "hour" | "day" | "week";
  categoryRotation: boolean;
  categoryOrder: string[];
  nextCategoryIndex: number;
  lastPublishedAt?: string;
  nextPublishAt?: string;
};

export type PublishOutcome =
  | { siteId: string; published: true; articleId: string; title: string; category: string | null; nextPublishAt: string }
  | { siteId: string; published: false; reason: string };

function parseMenuConfig(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  if (typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}

function intervalMs(c: AutoPublishConfig): number {
  if (c.intervalUnit === "hour") return c.intervalValue * 60 * 60 * 1000;
  if (c.intervalUnit === "week") return c.intervalValue * 7 * 24 * 60 * 60 * 1000;
  return c.intervalValue * 24 * 60 * 60 * 1000;
}

/**
 * Publish one due draft on a site, advance the rotation, and persist the new
 * `nextPublishAt`. Returns `published: false` with a reason if nothing was
 * eligible (disabled, not yet time, no draft, only-duplicate drafts).
 */
export async function publishDueForSite(siteId: string): Promise<PublishOutcome> {
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) return { siteId, published: false, reason: "No site" };

  const mc = parseMenuConfig(site.menuConfig);
  const config = mc.autoPublish as AutoPublishConfig | undefined;

  if (!config?.enabled) return { siteId, published: false, reason: "Auto-publish disabled" };

  const now = new Date();
  if (config.nextPublishAt) {
    const nextPublish = new Date(config.nextPublishAt);
    if (now < nextPublish) {
      return { siteId, published: false, reason: "Not yet time" };
    }
  }

  let nextCategoryIndex = config.nextCategoryIndex ?? 0;
  let targetCategory: string | null = null;
  if (config.categoryRotation && config.categoryOrder?.length > 0) {
    targetCategory = config.categoryOrder[nextCategoryIndex % config.categoryOrder.length];
  }

  // Look for a publishable draft. Up to 50 candidates; any conflicting with a
  // published article gets flagged "duplicate" along the way.
  async function findPublishable(category: string | null) {
    const candidates = await prisma.article.findMany({
      where: {
        siteId,
        status: "draft",
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
    for (const c of candidates) {
      const conflictId = await findPublishedConflict(siteId, c.title, c.id);
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
    return { siteId, published: false, reason: "No publishable draft" };
  }

  await prisma.article.update({
    where: { id: articleToPublish.id },
    data: { status: "published", publishedAt: now },
  });

  const nextPublishAt = new Date(now.getTime() + intervalMs(config)).toISOString();
  if (config.categoryRotation && config.categoryOrder?.length > 0) {
    nextCategoryIndex = (nextCategoryIndex + 1) % config.categoryOrder.length;
  }

  await prisma.site.update({
    where: { id: siteId },
    data: {
      menuConfig: {
        ...mc,
        autoPublish: { ...config, lastPublishedAt: now.toISOString(), nextPublishAt, nextCategoryIndex },
      } as object,
    },
  });

  return {
    siteId,
    published: true,
    articleId: articleToPublish.id,
    title: articleToPublish.title,
    category: articleToPublish.category,
    nextPublishAt,
  };
}

/** Run one tick across all sites. */
export async function runAutoPublishTick(): Promise<PublishOutcome[]> {
  const sites = await prisma.site.findMany({ select: { id: true } });
  const out: PublishOutcome[] = [];
  for (const s of sites) {
    try {
      out.push(await publishDueForSite(s.id));
    } catch (e) {
      out.push({ siteId: s.id, published: false, reason: `Error: ${String(e)}` });
    }
  }
  return out;
}

// ── In-process scheduler ───────────────────────────────────────────────
// Coolify (and any long-running Node container) keeps the Next.js server
// alive, so a simple setInterval is enough — no external cron required.
let started = false;
let timer: NodeJS.Timeout | null = null;
const TICK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function startAutoPublishScheduler(): void {
  if (started) return;
  if (process.env.DISABLE_AUTO_PUBLISH_SCHEDULER === "1") {
    console.log("[autoPublish] scheduler disabled via DISABLE_AUTO_PUBLISH_SCHEDULER=1");
    return;
  }
  started = true;
  // First tick 30s after boot so migrations + connections are warm.
  setTimeout(tick, 30_000);
  timer = setInterval(tick, TICK_INTERVAL_MS);
  console.log(`[autoPublish] scheduler started — tick every ${TICK_INTERVAL_MS / 1000}s`);
}

async function tick(): Promise<void> {
  try {
    const results = await runAutoPublishTick();
    for (const r of results) {
      if (r.published) {
        console.log(`[autoPublish] published "${r.title}" (${r.category ?? "—"}) for site ${r.siteId}`);
      }
    }
  } catch (e) {
    console.error("[autoPublish] tick failed:", e);
  }
}

export function _stopForTests() {
  if (timer) clearInterval(timer);
  timer = null;
  started = false;
}
