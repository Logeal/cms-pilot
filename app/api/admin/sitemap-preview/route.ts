import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

export async function GET() {
  const denied = await requireAuth(); if (denied) return denied;
  const site = await prisma.site.findFirst();
  const baseUrl = site?.url ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true, category: true, updatedAt: true, title: true },
    orderBy: { updatedAt: "desc" },
  });

  let mc: Record<string, unknown> = {};
  try { mc = typeof site?.menuConfig === "string" ? JSON.parse(site.menuConfig as string) : (site?.menuConfig as Record<string, unknown> ?? {}); } catch {}
  const setup = mc.setup ? (typeof mc.setup === "string" ? JSON.parse(mc.setup) : mc.setup) as { categories?: string[] } : {};
  const categories: string[] = setup.categories ?? [...new Set(articles.map((a) => a.category).filter(Boolean))] as string[];

  const staticPages = [
    { url: baseUrl, label: "Page d'accueil", type: "static", priority: 1.0 },
    { url: `${baseUrl}/contact`, label: "Contact", type: "static", priority: 0.5 },
    { url: `${baseUrl}/mentions-legales`, label: "Mentions légales", type: "static", priority: 0.3 },
    { url: `${baseUrl}/cgu`, label: "CGU", type: "static", priority: 0.3 },
    { url: `${baseUrl}/cookies`, label: "Cookies", type: "static", priority: 0.3 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/${catSlug(cat)}`,
    label: `Catégorie : ${cat}`,
    type: "category",
    priority: 0.8,
  }));

  const articlePages = articles.map((a) => ({
    url: a.category ? `${baseUrl}/${catSlug(a.category)}/${a.slug}` : `${baseUrl}/${a.slug}`,
    label: a.title,
    type: "article",
    priority: 0.7,
    updatedAt: a.updatedAt,
  }));

  // Custom URLs from menuConfig
  const seo = mc.seo as { customUrls?: string[]; robotsRules?: string } | undefined;
  const customUrls = (seo?.customUrls ?? []).map((url: string) => ({
    url,
    label: url,
    type: "custom",
    priority: 0.5,
  }));

  return NextResponse.json({
    baseUrl,
    pages: [...staticPages, ...categoryPages, ...articlePages, ...customUrls],
    total: staticPages.length + categoryPages.length + articlePages.length + customUrls.length,
  });
}
