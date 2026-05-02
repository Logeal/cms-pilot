import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPalette } from "@/lib/palettes";
import { parseJsonField } from "@/lib/parseJson";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied;
  const { paletteId, homeContent, fonts, themeId } = await req.json() as {
    paletteId: string;
    homeContent?: Record<string, string>;
    fonts?: { display: string; heading: string; body: string };
    themeId?: string;
  };
  if (!paletteId) return NextResponse.json({ error: "paletteId required" }, { status: 400 });

  const site = await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "No site" }, { status: 404 });

  const palette = getPalette(paletteId);
  const existing = parseJsonField(site.menuConfig);

  // existing.setup peut être un objet JS (déjà parsé) ou une string — on gère les deux cas
  const rawSetup = existing.setup;
  const existingSetup: Record<string, unknown> =
    rawSetup == null ? {} :
    typeof rawSetup === "string" ? JSON.parse(rawSetup) :
    (rawSetup as Record<string, unknown>);

  const newSetup: Record<string, unknown> = {
    ...existingSetup,
    paletteId,
    colors: palette.colors,
  };
  if (homeContent !== undefined) newSetup.homeContent = homeContent;
  if (fonts !== undefined) newSetup.fonts = fonts;
  if (themeId !== undefined) newSetup.themeId = themeId;

  const newConfig = { ...existing, setup: newSetup };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.site.update({ where: { id: site.id }, data: { menuConfig: newConfig as any } });
  return NextResponse.json({ ok: true, paletteId, name: palette.name });
}
