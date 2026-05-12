import { NextRequest, NextResponse } from "next/server";
import { runAutoPublishTick } from "@/lib/autoPublishScheduler";

// Manual external trigger — kept as a fallback so admins can fire the cycle
// from outside (e.g. cron-job.org) without depending on the in-process
// scheduler. Authenticates via ?secret=$CRON_SECRET.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });

  const provided = req.nextUrl.searchParams.get("secret");
  if (provided !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = await runAutoPublishTick();
  return NextResponse.json({ ok: true, results });
}
