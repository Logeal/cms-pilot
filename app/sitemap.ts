import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await prisma.site.findFirst();
  const baseUrl = site?.url ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  // Articles publiés
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true, category: true, updatedAt: true },
  });

  // Catégories
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: article.category
      ? `${baseUrl}/${toSlug(article.category)}/${article.slug}`
      : `${baseUrl}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
