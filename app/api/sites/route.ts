import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function GET() {
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { articles: true } } },
  });
  return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
  const { name, url, categories } = await req.json();
  if (!name || !url) {
    return NextResponse.json({ error: "name and url are required" }, { status: 400 });
  }
  const apiKey = "sk_" + randomBytes(20).toString("hex");
  const site = await prisma.site.create({
    data: { name, url, apiKey, categories: categories ?? [] },
  });
  return NextResponse.json(site, { status: 201 });
}
