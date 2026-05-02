import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

// PUT — activer un thème (désactive tous les autres)
export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth(); if (denied) return denied;
  const { id } = await params;
  await prisma.theme.updateMany({ data: { active: false } });
  const theme = await prisma.theme.update({ where: { id }, data: { active: true } });
  return NextResponse.json(theme);
}

// DELETE — supprimer un thème
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth(); if (denied) return denied;
  const { id } = await params;
  await prisma.theme.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
