import { createHmac, timingSafeEqual, randomBytes, scryptSync } from "crypto";
import { cookies } from "next/headers";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type Role = "admin" | "worker";

export interface Session {
  email: string;
  role: Role;
  expiresAt: number;
}

function b64urlEncode(s: string): string {
  return Buffer.from(s, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!)
    .update(payload)
    .digest("hex");
}

export function createSessionToken(email: string, role: Role): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const emailLc = email.toLowerCase();
  const head = b64urlEncode(JSON.stringify({ email: emailLc, role }));
  const payload = `${head}.${expiresAt}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

/**
 * Decode + verify a cms_session token. Returns the session payload on
 * success or null on any kind of failure (missing/expired/tampered).
 *
 * This is the runtime-agnostic core: callers from server components, API
 * routes, and proxy.ts all forward the cookie value here.
 */
export function decodeSessionToken(token: string | undefined | null): Session | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [head, expStr, sig] = parts;

  const expiresAt = parseInt(expStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

  const expected = sign(`${head}.${expStr}`);
  let ok = false;
  try {
    ok = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch { return null; }
  if (!ok) return null;

  let parsed: { email?: string; role?: Role };
  try { parsed = JSON.parse(b64urlDecode(head)); } catch { return null; }
  if (!parsed.email || (parsed.role !== "admin" && parsed.role !== "worker")) return null;

  // Defense in depth: invalidate admin tokens whose email no longer matches
  // the env (e.g. ADMIN_EMAIL was changed).
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (parsed.role === "admin" && parsed.email !== adminEmail) return null;

  return { email: parsed.email, role: parsed.role, expiresAt };
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  return decodeSessionToken(token);
}

export function verifyBearerToken(
  authHeader: string | null,
  apiKey: string
): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "").trim();
  return token === apiKey;
}

// Password hashing — scrypt is built into Node, no native deps
const SCRYPT_N = 16384, SCRYPT_R = 8, SCRYPT_P = 1, KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P }).toString("hex");
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, salt, hashHex] = parts;
  let computed: Buffer;
  try {
    computed = scryptSync(password, salt, KEY_LEN, { N: parseInt(n, 10), r: parseInt(r, 10), p: parseInt(p, 10) });
  } catch { return false; }
  const expected = Buffer.from(hashHex, "hex");
  if (computed.length !== expected.length) return false;
  try { return timingSafeEqual(computed, expected); } catch { return false; }
}
