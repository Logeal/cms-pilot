import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findPublishedConflict } from "@/lib/duplicates";
import { requireAuth } from "@/lib/requireAuth";
import { getSession } from "@/lib/auth";
import { toSlug, isValidStatus } from "@/lib/slug";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;

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
  const denied = await requireAuth(["admin", "worker"]);
  if (denied) return denied;

  const session = await getSession();
  const isWorker = session?.role === "worker";

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};

  // Workers may only update imageUrl. Reject any attempt to send other fields.
  if (isWorker) {
    const keys = Object.keys(body ?? {});
    const disallowed = keys.filter(k => k !== "imageUrl");
    if (disallowed.length > 0) {
      return NextResponse.json(
        { error: "Forbidden", message: "Workers may only update imageUrl." },
        { status: 403 }
      );
    }
  }

  if (body.status !== undefined) {
    if (!isValidStatus(body.status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    if (body.status === "published") {
      const current = await prisma.article.findUnique({
        where: { id },
        select: { siteId: true, title: true, publishedAt: true },
      });
      if (current) {
        const conflictId = await findPublishedConflict(current.siteId, current.title, id);
        if (conflictId) {
          return NextResponse.json(
            { error: "duplicate", message: "Un article publié porte déjà ce titre.", conflictId },
            { status: 409 },
          );
        }
        // Preserve original publication date if already published once.
        data.publishedAt = current.publishedAt ?? new Date();
      } else {
        data.publishedAt = new Date();
      }
    } else {
      data.publishedAt = null;
    }
    data.status = body.status;
  }
  if (body.category !== undefined) data.category = body.category;
  if (body.imageUrl !== undefined) {
    const url = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    data.imageUrl = url || null;
  }
  const article = await prisma.article.update({ where: { id }, data });
  return NextResponse.json(article);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();

  if (body.status !== undefined && !isValidStatus(body.status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  let resolvedStatus = body.status as string;
  if (resolvedStatus === "published") {
    const current = await prisma.article.findUnique({
      where: { id },
      select: { siteId: true },
    });
    if (current) {
      const conflictId = await findPublishedConflict(current.siteId, body.title, id);
      if (conflictId) {
        return NextResponse.json(
          { error: "duplicate", message: "Un article publié porte déjà ce titre.", conflictId },
          { status: 409 },
        );
      }
    }
  }

  const cleanSlug = typeof body.slug === "string" && body.slug.trim() ? toSlug(body.slug) : body.slug;

  const wordCountRaw = Number(body.wordCount);
  const wordCount = Number.isFinite(wordCountRaw) && wordCountRaw >= 0 ? Math.floor(wordCountRaw) : null;

  // Preserve existing publishedAt when republishing an already-published article.
  let publishedAt: Date | null = null;
  if (resolvedStatus === "published") {
    if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);
    } else {
      const current = await prisma.article.findUnique({
        where: { id },
        select: { publishedAt: true },
      });
      publishedAt = current?.publishedAt ?? new Date();
    }
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      title:           body.title,
      slug:            cleanSlug,
      content:         body.content,
      introduction:    body.introduction ?? null,
      metaTitle:       body.metaTitle ?? null,
      metaDescription: body.metaDescription ?? null,
      category:        body.category ?? null,
      status:          resolvedStatus,
      imageUrl:        body.imageUrl ?? null,
      publishedAt,
      subject:         body.subject ?? null,
      keyword:         body.keyword ?? null,
      tone:            body.tone ?? null,
      language:        body.language ?? "FR",
      wordCount,
      generationLog:   body.generationLog ?? undefined,
    },
  });
  return NextResponse.json(article);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
