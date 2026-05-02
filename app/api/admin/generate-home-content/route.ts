import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/requireAuth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied;
  const { context } = await req.json() as { context: string };
  if (!context?.trim()) return NextResponse.json({ error: "context required" }, { status: 400 });

  const prompt = `Tu es un expert en copywriting et SEO. À partir de ce contexte de site web : "${context}"

Génère exactement ce JSON (sans markdown, sans backticks, sans explication) :
{
  "heroEyebrow": "accroche courte de 3-5 mots en lien avec la thématique, style éditorial",
  "heroLine1": "première ligne du titre hero, 4-6 mots, accrocheur",
  "heroLine2": "deuxième ligne du titre hero, 3-5 mots, mis en valeur en italique, percutant",
  "heroSub": "sous-titre de 1-2 phrases max (120 caractères max) qui décrit la valeur du site",
  "heroCta": "texte du bouton call-to-action, 3-5 mots avec →",
  "expertiseEyebrow": "2-3 mots pour l'eyebrow de la section expertise",
  "expertiseTitle": "titre sur 2 lignes séparées par \\n, style éditorial, 5-8 mots au total"
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(cleaned);
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "Parsing failed", raw }, { status: 500 });
  }
}
