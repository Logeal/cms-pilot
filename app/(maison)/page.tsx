import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/parseJson";

export const revalidate = 3600;
import { HomePageTheme1 } from "./themes/theme-1/HomePageTheme1";
import { HomePageTheme2 } from "./themes/theme-2/HomePageTheme2";
import { HomePageTheme3 } from "./themes/theme-3/HomePageTheme3";
import { HomePageTheme4 } from "./themes/theme-4/HomePageTheme4";
import { HomePageTheme5 } from "./themes/theme-5/HomePageTheme5";
import { HomePageTheme6 } from "./themes/theme-6/HomePageTheme6";
import { HomePageTheme7 } from "./themes/theme-7/HomePageTheme7";
import { HomePageTheme8 } from "./themes/theme-8/HomePageTheme8";
import { HomePageTheme9 } from "./themes/theme-9/HomePageTheme9";
import { HomePageTheme10 } from "./themes/theme-10/HomePageTheme10";
import { HomePageTheme11 } from "./themes/theme-11/HomePageTheme11";
import { HomePageTheme12 } from "./themes/theme-12/HomePageTheme12";

function catSlug(cat: string | null | undefined) {
  return (cat ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

type SiteSetup = {
  heroImageUrl?: string;
  categories?: string[];
  categoryHeroImages?: Record<string, string>;
  themeId?: string;
};

export default async function HomePage() {
  const site = await prisma.site.findFirst();
  if (!site) return <div style={{ padding: 48 }}>Aucun site configuré.</div>;

  const menuConfig = parseJsonField(site.menuConfig);
  const setup = parseJsonField(menuConfig.setup) as unknown as SiteSetup;
  const hc = (setup as unknown as Record<string, unknown>).homeContent as Record<string, string> | undefined;
  const home = {
    heroEyebrow:      hc?.heroEyebrow      ?? "Conseil & expertise maison",
    heroLine1:        hc?.heroLine1        ?? "Votre maison mérite",
    heroLine2:        hc?.heroLine2        ?? "les meilleurs conseils",
    heroSub:          hc?.heroSub          ?? "Décoration, immobilier, jardin, piscine — nos experts partagent leurs connaissances pour vous aider à prendre les meilleures décisions, sans jargon et sans prise de tête.",
    heroCta:          hc?.heroCta          ?? "Découvrir nos conseils →",
    expertiseEyebrow: hc?.expertiseEyebrow ?? "Notre expertise",
    expertiseTitle:   hc?.expertiseTitle   ?? "Des conseils d'experts\npour chaque projet",
  };

  const themeId = setup.themeId ?? "theme-1";
  const heroImageUrl = setup.heroImageUrl ?? null;
  const setupCategories = setup.categories ?? [];
  const categoryHeroImages = setup.categoryHeroImages ?? {};

  const totalArticles = await prisma.article.count({
    where: { siteId: site.id, status: "published" },
  });

  const articles = await prisma.article.findMany({
    where: { siteId: site.id, status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 25,
  });

  const heroArt  = articles[0];
  const cardArts = articles.slice(1, 11);
  const moreArts = articles.slice(11, 16);

  // Fetch all category metadata from DB
  const allCategoriesData = await prisma.category.findMany({
    orderBy: { label: "asc" },
    select: { slug: true, label: true, metaDescription: true, seoIntro: true, description: true, heroImage: true, bullets: true },
  });

  // If setup.categories is empty, fall back to DB categories order
  const activeCategories = setupCategories.length > 0
    ? setupCategories
    : allCategoriesData.map(c => c.label);

  const expertiseCats = activeCategories.slice(0, 3);
  const extraCats = activeCategories.slice(3);
  const totalCats = activeCategories.length;

  // Match categoriesData to activeCategories
  const categoriesData = allCategoriesData;

  const props = {
    home,
    heroImageUrl,
    expertiseCats,
    extraCats,
    categoryHeroImages,
    totalArticles,
    totalCats,
    heroArt,
    cardArts,
    moreArts,
    categoriesData,
  };

  if (themeId === "theme-2") return <HomePageTheme2 {...props} />;
  if (themeId === "theme-3") return <HomePageTheme3 {...props} />;
  if (themeId === "theme-4") return <HomePageTheme4 {...props} />;
  if (themeId === "theme-5") return <HomePageTheme5 {...props} />;
  if (themeId === "theme-6") return <HomePageTheme6 {...props} />;
  if (themeId === "theme-7") return <HomePageTheme7 {...props} />;
  if (themeId === "theme-8") return <HomePageTheme8 {...props} />;
  if (themeId === "theme-9") return <HomePageTheme9 {...props} />;
  if (themeId === "theme-10") return <HomePageTheme10 {...props} />;
  if (themeId === "theme-11") return <HomePageTheme11 {...props} />;
  if (themeId === "theme-12") return <HomePageTheme12 {...props} />;
  return <HomePageTheme1 {...props} />;
}
