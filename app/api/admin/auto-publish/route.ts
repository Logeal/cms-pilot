import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { publishDueForSite } from "@/lib/autoPublishScheduler";

export async function POST() {
  const denied = await requireAuth();
  if (denied) return denied;
  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  const result = await publishDueForSite(site.id);
  if (result.published) {
    return NextResponse.json({
      published: true,
      article: { id: result.articleId, title: result.title, category: result.category },
      nextPublishAt: result.nextPublishAt,
    });
  }
  return NextResponse.json({ skipped: true, reason: result.reason });
}

// GET — current status + draft count for the first site
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  let mc: Record<string, unknown> = {};
  try {
    mc = typeof site.menuConfig === "string"
      ? JSON.parse(site.menuConfig as string)
      : (site.menuConfig as Record<string, unknown> ?? {});
  } catch {}

  const config = mc.autoPublish as Record<string, unknown> | undefined;
  const draftCount = await prisma.article.count({ where: { siteId: site.id, status: "draft" } });

  return NextResponse.json({ config: config ?? null, draftCount });
}
