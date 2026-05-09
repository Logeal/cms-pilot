import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";
import { requireAuth } from "@/lib/requireAuth";

// GET /api/categories — used by Pilot & CMS editor
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { label: "asc" },
  });
  return NextResponse.json(categories, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// POST /api/categories — create a new category
export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { label, slug: customSlug } = await req.json();
  if (!label?.trim()) {
    return NextResponse.json({ error: "label is required" }, { status: 400 });
  }
  const slug = customSlug?.trim() ? toSlug(customSlug.trim()) : toSlug(label.trim());

  try {
    const category = await prisma.category.create({ data: { label: label.trim(), slug } });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 });
  }
}
