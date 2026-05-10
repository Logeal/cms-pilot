import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifyPassword, type Role } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Constant-time string compare to avoid timing oracles on the env-based admin
// password. (Worker passwords are scrypt-hashed; the compare is timingSafe in
// verifyPassword already.)
function constEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: NextRequest) {
  let email = "";
  let password = "";
  try {
    const body = await req.json();
    if (typeof body?.email === "string") email = body.email;
    if (typeof body?.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  let role: Role | null = null;

  if (normalizedEmail && adminEmail && normalizedEmail === adminEmail) {
    if (constEq(password, adminPassword)) role = "admin";
  } else if (normalizedEmail) {
    const worker = await prisma.worker.findUnique({ where: { email: normalizedEmail } });
    if (worker && verifyPassword(password, worker.passwordHash)) {
      role = "worker";
      await prisma.worker.update({
        where: { id: worker.id },
        data: { lastLoginAt: new Date() },
      });
    }
  }

  if (!role) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createSessionToken(normalizedEmail, role);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set("cms_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
