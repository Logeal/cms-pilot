import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { hashPassword } from "@/lib/auth";

// Identifier may be an email (kept for back-compat) or a plain username
// like "worker1". Restrict to letters, digits, dot, dash, underscore and @
// so it's safe to render and compare. Min 3 chars to avoid trivial logins.
const IDENT_RE = /^[a-zA-Z0-9._@-]{3,64}$/;
const MIN_PASSWORD_LEN = 10;

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  const workers = await prisma.worker.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, createdAt: true, lastLoginAt: true },
  });
  return NextResponse.json(workers);
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  let body: { email?: string; password?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!IDENT_RE.test(email)) {
    return NextResponse.json(
      { error: "Identifiant invalide. Utilisez 3 à 64 caractères : lettres, chiffres, . _ - @" },
      { status: 400 }
    );
  }
  if (password.length < MIN_PASSWORD_LEN) {
    return NextResponse.json(
      { error: `Le mot de passe doit faire au moins ${MIN_PASSWORD_LEN} caractères.` },
      { status: 400 }
    );
  }
  if (email === process.env.ADMIN_EMAIL?.toLowerCase()) {
    return NextResponse.json(
      { error: "Cet identifiant est déjà utilisé par l'administrateur." },
      { status: 400 }
    );
  }

  const existing = await prisma.worker.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un worker avec cet identifiant existe déjà." }, { status: 409 });
  }

  const passwordHash = hashPassword(password);
  const worker = await prisma.worker.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true, lastLoginAt: true },
  });
  return NextResponse.json(worker, { status: 201 });
}
