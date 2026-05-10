import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { hashPassword } from "@/lib/auth";

const MIN_PASSWORD_LEN = 10;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await params;

  let body: { password?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password = body.password ?? "";
  if (password.length < MIN_PASSWORD_LEN) {
    return NextResponse.json(
      { error: `Le mot de passe doit faire au moins ${MIN_PASSWORD_LEN} caractères.` },
      { status: 400 }
    );
  }

  const passwordHash = hashPassword(password);
  try {
    await prisma.worker.update({ where: { id }, data: { passwordHash } });
  } catch {
    return NextResponse.json({ error: "Worker introuvable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await params;
  try {
    await prisma.worker.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Worker introuvable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
