import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function createSessionToken(email: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${email.toLowerCase()}:${expiresAt}`;
  const sig = createHmac("sha256", process.env.AUTH_SECRET!)
    .update(payload)
    .digest("hex");
  return `${expiresAt}.${sig}`;
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token) return false;

  const dotIdx = token.indexOf(".");
  if (dotIdx === -1) return false;

  const expiresAt = parseInt(token.slice(0, dotIdx), 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const sig = token.slice(dotIdx + 1);
  const email = process.env.ADMIN_EMAIL!.toLowerCase();
  const expected = createHmac("sha256", process.env.AUTH_SECRET!)
    .update(`${email}:${expiresAt}`)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function verifyBearerToken(
  authHeader: string | null,
  apiKey: string
): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "").trim();
  return token === apiKey;
}
