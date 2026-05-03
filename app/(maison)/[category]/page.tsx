import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryPageTheme1 } from "../themes/theme-1/CategoryPageTheme1";
import { CategoryPageTheme2 } from "../themes/theme-2/CategoryPageTheme2";
import { CategoryPageTheme3 } from "../themes/theme-3/CategoryPageTheme3";
import { CategoryPageTheme4 } from "../themes/theme-4/CategoryPageTheme4";
import { CategoryPageTheme5 } from "../themes/theme-5/CategoryPageTheme5";
import { CategoryPageTheme6 } from "../themes/theme-6/CategoryPageTheme6";
import { CategoryPageTheme7 } from "../themes/theme-7/CategoryPageTheme7";
import { CategoryPageTheme8 } from "../themes/theme-8/CategoryPageTheme8";
import { CategoryPageTheme9 } from "../themes/theme-9/CategoryPageTheme9";
import { CategoryPageTheme10 } from "../themes/theme-10/CategoryPageTheme10";
import { CategoryPageTheme11 } from "../themes/theme-11/CategoryPageTheme11";
import { CategoryPageTheme12 } from "../themes/theme-12/CategoryPageTheme12";

export const revalidate = 3600;

function catToSlug(cat: string) {
  return cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function labelFromSlug(slug: string, setupCategories: string[]): string {
  const match = setupCategories.find((c) => catToSlug(c) === slug);
  if (match) return match;
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const site = await prisma.site.findFirst();
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  const label = cat?.label ?? (category.charAt(0).toUpperCase() + category.slice(1));
  const siteUrl = site?.url?.replace(/\/$/, "") ?? "";
  const title = cat?.metaTitle || `${label} — ${site?.name ?? ""}`;
  const description = cat?.metaDescription || `Retrouvez tous nos conseils et articles sur le thème ${label}.`;
  const canonicalUrl = `${siteUrl}/${category}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const perPage = 9;

  const site = await prisma.site.findFirst();
  if (!site) notFound();

  const menuConfig = site.menuConfig as { setup?: { categories?: string[]; themeId?: string } } | null;
  const setupCategories: string[] = menuConfig?.setup?.categories ?? [];
  const themeId: string = menuConfig?.setup?.themeId ?? "theme-1";

  const categoryMeta = await prisma.category.findUnique({ where: { slug: category } });
  const label = categoryMeta?.label ?? labelFromSlug(category, setupCategories);

  const [total, articles] = await Promise.all([
    prisma.article.count({
      where: { siteId: site.id, status: "published", category: label },
    }),
    prisma.article.findMany({
      where: { siteId: site.id, status: "published", category: label },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  if (page > 1 && total === 0) notFound();
  const totalPages = Math.ceil(total / perPage);

  const seoIntro     = categoryMeta?.seoIntro ?? null;
  const seoH2        = categoryMeta?.seoH2 ?? null;
  const seoCol1Title = categoryMeta?.seoCol1Title ?? null;
  const seoCol1Body  = categoryMeta?.seoCol1Body ?? null;
  const seoCol2Title = categoryMeta?.seoCol2Title ?? null;
  const seoCol2Body  = categoryMeta?.seoCol2Body ?? null;
  const seoFaq       = categoryMeta?.seoFaq as Array<{ q: string; a: string }> | null ?? null;
  const hasSeoContent = !!(seoIntro || seoH2 || seoCol1Body || seoCol2Body || (seoFaq && seoFaq.length > 0));

  const props = {
    category,
    label,
    articles,
    total,
    page,
    totalPages,
    seoIntro,
    seoH2,
    seoCol1Title,
    seoCol1Body,
    seoCol2Title,
    seoCol2Body,
    seoFaq,
    hasSeoContent,
  };

  const siteUrl = site.url.replace(/\/$/, "");
  const categoryUrl = `${siteUrl}/${category}`;

  const jsonLdItems: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
        { "@type": "ListItem", position: 2, name: label, item: categoryUrl },
      ],
    },
  ];

  if (seoFaq && seoFaq.length > 0) {
    jsonLdItems.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seoFaq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }

  const themeComponent = (() => {
    if (themeId === "theme-2") return <CategoryPageTheme2 {...props} />;
    if (themeId === "theme-3") return <CategoryPageTheme3 {...props} />;
    if (themeId === "theme-4") return <CategoryPageTheme4 {...props} />;
    if (themeId === "theme-5") return <CategoryPageTheme5 {...props} />;
    if (themeId === "theme-6") return <CategoryPageTheme6 {...props} />;
    if (themeId === "theme-7") return <CategoryPageTheme7 {...props} />;
    if (themeId === "theme-8") return <CategoryPageTheme8 {...props} />;
    if (themeId === "theme-9") return <CategoryPageTheme9 {...props} />;
    if (themeId === "theme-10") return <CategoryPageTheme10 {...props} />;
    if (themeId === "theme-11") return <CategoryPageTheme11 {...props} />;
    if (themeId === "theme-12") return <CategoryPageTheme12 {...props} />;
    return <CategoryPageTheme1 {...props} />;
  })();

  return (
    <>
      {jsonLdItems.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      {themeComponent}
    </>
  );
}
