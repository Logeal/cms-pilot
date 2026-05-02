import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { label, slug: customSlug, metaTitle, metaDescription, description, heroImage, bullets } = await req.json();
  const slug = customSlug?.trim() ? toSlug(customSlug.trim()) : toSlug(label.trim());
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        label: label.trim(),
        slug,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
        description: description?.trim() || null,
        heroImage: heroImage?.trim() || null,
        bullets: bullets ?? null,
      },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
  }
}
