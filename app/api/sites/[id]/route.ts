import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, url, categories, logoUrl, faviconUrl, menuConfig } = body;

    const data: Record<string, unknown> = {};
    if (typeof name === "string" && name.trim()) data.name = name.trim();
    if (typeof url === "string" && url.trim()) data.url = url.trim();

    // categories only if explicitly provided
    if (categories !== undefined) data.categories = categories;

    if (logoUrl !== undefined) data.logoUrl = logoUrl;
    if (faviconUrl !== undefined) data.faviconUrl = faviconUrl;

    // menuConfig is stored as JSON string. We MERGE rather than replace so a
    // partial update (e.g. {showLogo, items} from Paramètres) doesn't wipe
    // unrelated branches like `setup` (palette/theme) written by Setup.
    if (menuConfig !== undefined) {
      const incoming = typeof menuConfig === "string"
        ? JSON.parse(menuConfig) as Record<string, unknown>
        : menuConfig as Record<string, unknown>;
      const current = await prisma.site.findUnique({
        where: { id },
        select: { menuConfig: true },
      });
      let existing: Record<string, unknown> = {};
      const raw = current?.menuConfig;
      if (raw) {
        if (typeof raw === "string") {
          try { existing = JSON.parse(raw); } catch { existing = {}; }
        } else if (typeof raw === "object") {
          existing = raw as Record<string, unknown>;
        }
      }
      const merged = { ...existing, ...incoming };
      data.menuConfig = JSON.stringify(merged);
    }

    const site = await prisma.site.update({ where: { id }, data });
    return NextResponse.json(site);
  } catch (err) {
    console.error("[PUT /api/sites/:id] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await params;
  await prisma.site.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
