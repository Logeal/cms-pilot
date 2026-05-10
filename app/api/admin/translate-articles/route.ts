import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ItemIn { id: string; title?: string; keyword?: string | null }
interface ItemOut { title?: string; keyword?: string }

const MAX_ITEMS = 60;

export async function POST(req: NextRequest) {
  const denied = await requireAuth(["admin", "worker"]);
  if (denied) return denied;

  let body: { lang?: string; items?: ItemIn[] };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.lang !== "en") {
    return NextResponse.json({ error: "Only English target supported" }, { status: 400 });
  }
  const items = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];
  if (items.length === 0) return NextResponse.json({ translations: {} });

  // Defense: items must be { id, title?, keyword? } strings, nothing more.
  const safeItems = items
    .filter(it => it && typeof it.id === "string" && (typeof it.title === "string" || typeof it.keyword === "string"))
    .map(it => ({
      id: it.id,
      title: typeof it.title === "string" ? it.title : undefined,
      keyword: typeof it.keyword === "string" ? it.keyword : undefined,
    }));
  if (safeItems.length === 0) return NextResponse.json({ translations: {} });

  const prompt = `Translate the following French article entries to natural, concise English. Keep proper nouns and brand names as-is. For the "keyword" field keep it as a SEO-style noun phrase (no leading verbs).

Return ONLY a JSON object mapping each id to its translations, no markdown, no backticks. Schema:
{
  "<id>": { "title": "english title", "keyword": "english keyword" }
}

Omit a field when the source value is missing or empty.

Source:
${JSON.stringify(safeItems)}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  let parsed: Record<string, ItemOut>;
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Parsing failed", raw }, { status: 500 });
  }

  // Validate shape — only keep string title/keyword for known ids.
  const known = new Set(safeItems.map(i => i.id));
  const translations: Record<string, ItemOut> = {};
  for (const [id, val] of Object.entries(parsed)) {
    if (!known.has(id) || typeof val !== "object" || val === null) continue;
    const out: ItemOut = {};
    if (typeof val.title === "string" && val.title.trim()) out.title = val.title.trim();
    if (typeof val.keyword === "string" && val.keyword.trim()) out.keyword = val.keyword.trim();
    if (out.title || out.keyword) translations[id] = out;
  }

  // Persist translations so they survive refreshes / re-logins / other users.
  // Articles that may have been deleted between request + write are silently
  // skipped (catch on each update).
  await Promise.all(
    Object.entries(translations).map(([id, val]) =>
      prisma.article.update({
        where: { id },
        data: {
          ...(val.title !== undefined ? { titleEn: val.title } : {}),
          ...(val.keyword !== undefined ? { keywordEn: val.keyword } : {}),
        },
      }).catch(() => null)
    )
  );

  return NextResponse.json({ translations });
}
