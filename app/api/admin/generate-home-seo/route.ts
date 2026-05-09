import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { parseJsonField } from "@/lib/parseJson";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await req.json().catch(() => ({})) as { siteId?: string };
  const site = body.siteId
    ? await prisma.site.findUnique({ where: { id: body.siteId } })
    : await prisma.site.findFirst();
  if (!site) return NextResponse.json({ error: "Site introuvable" }, { status: 404 });

  const menuConfig = parseJsonField(site.menuConfig) as Record<string, unknown> | null;
  const setup = (menuConfig?.setup ?? {}) as Record<string, unknown>;
  const setupCategories = Array.isArray(setup.categories) ? setup.categories as string[] : [];

  const dbCategories = await prisma.category.findMany({
    select: { label: true, metaDescription: true },
    orderBy: { label: "asc" },
  });
  const categories = setupCategories.length > 0
    ? setupCategories
    : dbCategories.map(c => c.label);

  const recentArticles = await prisma.article.findMany({
    where: { siteId: site.id, status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 12,
    select: { title: true, category: true },
  });

  const articleSnippet = recentArticles
    .map(a => `- ${a.title}${a.category ? ` (${a.category})` : ""}`)
    .join("\n") || "(aucun article publié)";

  const prompt = `Tu es un expert SEO et rédacteur web en français. Tu rédiges la balise meta title et la meta description de la page d'accueil d'un site éditorial.

Site : "${site.name}" — ${site.url}
Catégories du site : ${categories.join(", ") || "(aucune)"}
Articles récents :
${articleSnippet}

Contraintes :
- meta title : 50–60 caractères, accrocheur, intègre le nom du site et 2-3 thématiques principales.
- meta description : 140–160 caractères, claire, avec un appel à l'action implicite (ex : "découvrez", "explorez"), couvrant les principales catégories.
- Pas de superlatif générique creux. Reste concret.

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans backticks) :
{
  "metaTitle": "…",
  "metaDescription": "…"
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  let data: { metaTitle?: string; metaDescription?: string };
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    data = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Parsing failed", raw }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}
