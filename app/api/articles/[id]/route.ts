import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { site: { select: { id: true, name: true, url: true, categories: true } } },
  });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.status !== undefined) {
    data.status = body.status;
    data.publishedAt = body.status === "published" ? new Date() : null;
  }
  if (body.category !== undefined) data.category = body.category;
  const article = await prisma.article.update({ where: { id }, data });
  return NextResponse.json(article);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const article = await prisma.article.update({
    where: { id },
    data: {
      title:           body.title,
      slug:            body.slug,
      content:         body.content,
      metaTitle:       body.metaTitle ?? null,
      metaDescription: body.metaDescription ?? null,
      category:        body.category ?? null,
      status:          body.status,
      imageUrl:        body.imageUrl ?? null,
      publishedAt:     body.status === "published" ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null,
      subject:         body.subject ?? null,
      keyword:         body.keyword ?? null,
      tone:            body.tone ?? null,
      language:        body.language ?? "FR",
      wordCount:       body.wordCount ? Number(body.wordCount) : null,
      generationLog:   body.generationLog ?? undefined,
    },
  });
  return NextResponse.json(article);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
