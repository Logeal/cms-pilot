import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied;
  const { categoryId } = await req.json() as { categoryId: string };
  if (!categoryId) return NextResponse.json({ error: "categoryId required" }, { status: 400 });

  const cat = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const prompt = `Tu es un expert SEO et rédacteur web en français. Génère du contenu SEO optimisé pour une page de catégorie de blog sur le thème "${cat.label}".

Génère exactement ce JSON (sans markdown, sans backticks) :
{
  "metaTitle": "titre SEO de 50-60 caractères pour la catégorie ${cat.label}",
  "metaDescription": "meta description de 140-155 caractères percutante avec call-to-action",
  "seoIntro": "une seule phrase d'accroche courte (max 120 caractères) qui présente la catégorie ${cat.label}, percutante et SEO-friendly",
  "seoH2": "titre H2 accrocheur pour la section contenu SEO, style éditorial",
  "seoCol1Title": "titre de la colonne gauche (ex: expertise, conseil pratique)",
  "seoCol1Body": "contenu de la colonne gauche, 2-3 phrases informatives sur ${cat.label}",
  "seoCol2Title": "titre de la colonne droite (ex: guide, astuces)",
  "seoCol2Body": "contenu de la colonne droite, 2-3 phrases complémentaires sur ${cat.label}",
  "seoFaq": [
    { "q": "question fréquente 1 sur ${cat.label} ?", "a": "réponse complète de 1-2 phrases" },
    { "q": "question fréquente 2 sur ${cat.label} ?", "a": "réponse complète de 1-2 phrases" },
    { "q": "question fréquente 3 sur ${cat.label} ?", "a": "réponse complète de 1-2 phrases" }
  ]
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();

  let data: Record<string, unknown>;
  try {
    // Nettoyer si Claude a quand même mis des backticks
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    data = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Parsing failed", raw }, { status: 500 });
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      metaTitle: data.metaTitle as string,
      metaDescription: data.metaDescription as string,
      seoIntro: data.seoIntro as string,
      seoH2: data.seoH2 as string,
      seoCol1Title: data.seoCol1Title as string,
      seoCol1Body: data.seoCol1Body as string,
      seoCol2Title: data.seoCol2Title as string,
      seoCol2Body: data.seoCol2Body as string,
      seoFaq: data.seoFaq as object[],
    },
  });

  return NextResponse.json({ ok: true, data });
}
