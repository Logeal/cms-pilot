import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import AdmZip from "adm-zip";
import { requireAuth } from "@/lib/requireAuth";

// GET — liste tous les thèmes
export async function GET() {
  const denied = await requireAuth(); if (denied) return denied;
  const themes = await prisma.theme.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, description: true, version: true, active: true, createdAt: true },
  });
  return NextResponse.json(themes);
}

// POST — upload d'un ZIP de thème
export async function POST(req: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied;
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  if (!file.name.endsWith(".zip")) return NextResponse.json({ error: "Format ZIP requis" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  let css = "";
  let meta: { name?: string; description?: string; version?: string } = {};

  try {
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    // Cherche theme.css et theme.json à n'importe quel niveau dans le ZIP
    for (const entry of entries) {
      const name = entry.entryName.split("/").pop();
      if (name === "theme.css") css = entry.getData().toString("utf8");
      if (name === "theme.json") {
        try { meta = JSON.parse(entry.getData().toString("utf8")); } catch { /* ignore */ }
      }
    }
  } catch {
    return NextResponse.json({ error: "ZIP invalide ou corrompu" }, { status: 400 });
  }

  if (!css) return NextResponse.json({ error: "Le ZIP ne contient pas de fichier theme.css" }, { status: 400 });

  const themeName = meta.name || file.name.replace(".zip", "");

  const theme = await prisma.theme.create({
    data: {
      name: themeName,
      description: meta.description ?? null,
      version: meta.version ?? null,
      css,
      active: false,
    },
  });

  return NextResponse.json(theme, { status: 201 });
}
