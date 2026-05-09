import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";
import { requireAuth } from "@/lib/requireAuth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json() as Record<string, unknown>;

  // Partial update: only write fields explicitly present in the body.
  // Avoids wiping bullets/heroImage/description when the editor doesn't send them.
  const data: Record<string, unknown> = {};

  if (typeof body.label === "string" && body.label.trim()) {
    data.label = body.label.trim();
  }
  if (body.slug !== undefined) {
    const customSlug = typeof body.slug === "string" ? body.slug.trim() : "";
    if (customSlug) data.slug = toSlug(customSlug);
    else if (typeof data.label === "string") data.slug = toSlug(data.label);
  }
  if (body.metaTitle !== undefined) {
    data.metaTitle = typeof body.metaTitle === "string" ? (body.metaTitle.trim() || null) : null;
  }
  if (body.metaDescription !== undefined) {
    data.metaDescription = typeof body.metaDescription === "string" ? (body.metaDescription.trim() || null) : null;
  }
  if (body.description !== undefined) {
    data.description = typeof body.description === "string" ? (body.description.trim() || null) : null;
  }
  if (body.heroImage !== undefined) {
    data.heroImage = typeof body.heroImage === "string" ? (body.heroImage.trim() || null) : null;
  }
  if (body.bullets !== undefined) {
    data.bullets = body.bullets ?? null;
  }

  try {
    const category = await prisma.category.update({ where: { id }, data });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
  }
}
