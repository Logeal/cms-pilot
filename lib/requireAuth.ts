import { NextResponse } from "next/server";
import { getSession } from "./auth";

export async function requireAuth(): Promise<NextResponse | null> {
  const ok = await getSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}
