import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, url, categories, logoUrl, faviconUrl, menuConfig } = body;

    const data: Record<string, unknown> = { name, url };

    // categories only if explicitly provided
    if (categories !== undefined) data.categories = categories;

    if (logoUrl !== undefined) data.logoUrl = logoUrl;
    if (faviconUrl !== undefined) data.faviconUrl = faviconUrl;

    // Stocker menuConfig comme string JSON pour éviter les problèmes Prisma/SQLite
    if (menuConfig !== undefined) {
      data.menuConfig = typeof menuConfig === "string" ? menuConfig : JSON.stringify(menuConfig);
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
  const { id } = await params;
  await prisma.site.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
