import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticlePageTheme1 } from "../../themes/theme-1/ArticlePageTheme1";
import { ArticlePageTheme2 } from "../../themes/theme-2/ArticlePageTheme2";
import { ArticlePageTheme3 } from "../../themes/theme-3/ArticlePageTheme3";
import { ArticlePageTheme4 } from "../../themes/theme-4/ArticlePageTheme4";
import { ArticlePageTheme5 } from "../../themes/theme-5/ArticlePageTheme5";
import { ArticlePageTheme6 } from "../../themes/theme-6/ArticlePageTheme6";
import { ArticlePageTheme7 } from "../../themes/theme-7/ArticlePageTheme7";
import { ArticlePageTheme8 } from "../../themes/theme-8/ArticlePageTheme8";
import { ArticlePageTheme9 } from "../../themes/theme-9/ArticlePageTheme9";
import { ArticlePageTheme10 } from "../../themes/theme-10/ArticlePageTheme10";
import { ArticlePageTheme11 } from "../../themes/theme-11/ArticlePageTheme11";
import { ArticlePageTheme12 } from "../../themes/theme-12/ArticlePageTheme12";

export const revalidate = 3600;

type Params = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;

  const site = await prisma.site.findFirst();
  const article = await prisma.article.findFirst({
    where: { siteId: site?.id, slug, status: "published" },
  });

  if (!article) return {};

  const siteUrl = site?.url?.replace(/\/$/, "") ?? "";
  const title = article.metaTitle ?? article.title;
  const description = article.metaDescription ?? "";
  const imageUrl = article.imageUrl
    ? article.imageUrl.startsWith("http")
      ? article.imageUrl
      : `${siteUrl}${article.imageUrl}`
    : null;

  const canonicalUrl = `${siteUrl}/${category}/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: article.publishedAt?.toISOString(),
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { category, slug } = await params;

  const site = await prisma.site.findFirst();
  if (!site) notFound();

  const menuConfig = site.menuConfig as { setup?: { themeId?: string } } | null;
  const themeId: string = menuConfig?.setup?.themeId ?? "theme-1";

  const article = await prisma.article.findFirst({
    where: { siteId: site.id, slug, status: "published" },
  });
  if (!article) notFound();

  const related = await prisma.article.findMany({
    where: { siteId: site.id, status: "published", category: article.category, NOT: { id: article.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // JSON-LD Article schema
  const siteUrl = site.url.replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/${category}/${slug}`;
  const imageUrl = article.imageUrl
    ? article.imageUrl.startsWith("http") ? article.imageUrl : `${siteUrl}${article.imageUrl}`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription ?? "",
    datePublished: article.publishedAt?.toISOString() ?? new Date().toISOString(),
    dateModified: article.updatedAt?.toISOString() ?? article.publishedAt?.toISOString() ?? new Date().toISOString(),
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
    },
    ...(imageUrl ? { image: { "@type": "ImageObject", url: imageUrl } } : {}),
    ...(article.category ? {
      articleSection: article.category,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
          { "@type": "ListItem", position: 2, name: article.category, item: `${siteUrl}/${category}` },
          { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
        ],
      },
    } : {}),
  };

  const props = { category, article, related };

  const themeComponent = (() => {
    if (themeId === "theme-2") return <ArticlePageTheme2 {...props} />;
    if (themeId === "theme-3") return <ArticlePageTheme3 {...props} />;
    if (themeId === "theme-4") return <ArticlePageTheme4 {...props} />;
    if (themeId === "theme-5") return <ArticlePageTheme5 {...props} />;
    if (themeId === "theme-6") return <ArticlePageTheme6 {...props} />;
    if (themeId === "theme-7") return <ArticlePageTheme7 {...props} />;
    if (themeId === "theme-8") return <ArticlePageTheme8 {...props} />;
    if (themeId === "theme-9") return <ArticlePageTheme9 {...props} />;
    if (themeId === "theme-10") return <ArticlePageTheme10 {...props} />;
    if (themeId === "theme-11") return <ArticlePageTheme11 {...props} />;
    if (themeId === "theme-12") return <ArticlePageTheme12 {...props} />;
    return <ArticlePageTheme1 {...props} />;
  })();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {themeComponent}
    </>
  );
}
