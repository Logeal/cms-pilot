import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchUnsplashImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const siteContext: string = body.siteContext ?? "";

  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const contextClause = siteContext
    ? `Le site est dédié à : "${siteContext}".`
    : "";

  const prompt = `Tu es un rédacteur éditorial expert en français. ${contextClause}
Génère du contenu accrocheur pour présenter la rubrique "${cat.label}" sur un site de contenu.

RÈGLES ABSOLUES pour la description :
- Ne commence JAMAIS par "Bienvenue", "Découvrez", "Explorez" ou tout autre mot d'accueil générique
- Commence directement par un fait, une promesse concrète, une question ou une affirmation percutante liée à "${cat.label}"
- 2-3 phrases percutantes, ton magazine moderne, sans formule bateau
- Chaque rubrique doit avoir un angle unique : un chiffre, une tension, un bénéfice direct

Réponds UNIQUEMENT avec ce JSON valide (sans markdown, sans backticks) :
{
  "description": "2-3 phrases qui présentent la rubrique ${cat.label} avec un angle original et humain",
  "bullets": [
    "point fort ou type de contenu proposé dans cette rubrique (10-15 mots max)",
    "deuxième point fort (10-15 mots max)",
    "troisième point fort (10-15 mots max)",
    "quatrième point fort (10-15 mots max)"
  ],
  "imageQuery": "2-3 mots anglais pour chercher une photo Unsplash représentant visuellement ${cat.label}"
}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();

  let generated: { description: string; bullets: string[]; imageQuery: string };
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    generated = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Parsing failed", raw }, { status: 500 });
  }

  const heroImage = await fetchUnsplashImage(generated.imageQuery ?? cat.label);

  await prisma.category.update({
    where: { id },
    data: {
      description: generated.description,
      bullets: generated.bullets,
      heroImage: heroImage ?? undefined,
    },
  });

  return NextResponse.json({
    ok: true,
    description: generated.description,
    bullets: generated.bullets,
    heroImage,
  });
}
