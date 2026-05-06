import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { findDuplicateGroups, resolveDuplicates } from "@/lib/duplicates";

export async function GET(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId") ?? undefined;

  const groups = await findDuplicateGroups(siteId);
  return NextResponse.json({ groups });
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId") ?? undefined;

  const result = await resolveDuplicates(siteId);
  return NextResponse.json(result);
}
