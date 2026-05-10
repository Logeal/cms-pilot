import { NextResponse } from "next/server";
import { getSession, type Role } from "./auth";

/**
 * Returns null when authentication passes for one of the allowed roles,
 * otherwise a 401/403 NextResponse the route handler should return as-is.
 *
 * Default `allowedRoles = ["admin"]` — preserves the previous behaviour for
 * existing routes (admin-only). Pass `["admin", "worker"]` on routes that
 * workers should also reach (the route MUST then enforce additional body
 * restrictions for workers itself).
 */
export async function requireAuth(
  allowedRoles: Role[] = ["admin"]
): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!allowedRoles.includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
