import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await prisma.site.findFirst();
  const baseUrl = site?.url ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  let mc: Record<string, unknown> = {};
  try { mc = typeof site?.menuConfig === "string" ? JSON.parse(site.menuConfig as string) : (site?.menuConfig as Record<string, unknown> ?? {}); } catch {}
  const seo = mc.seo as { customUrls?: string[]; robotsDisallow?: string[] } | undefined;
  const customDisallow = seo?.robotsDisallow ?? [];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/login", ...customDisallow],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
