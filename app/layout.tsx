export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "CMS — Pilot",
  description: "Headless CMS for Pilot",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await prisma.site.findFirst({ select: { faviconUrl: true, name: true } });
  const faviconUrl = site?.faviconUrl ?? null;

  // Determine favicon type
  let faviconHref = "/favicon.ico";
  let faviconType = "image/x-icon";
  if (faviconUrl) {
    if (faviconUrl.startsWith("data:image/svg")) {
      faviconHref = faviconUrl;
      faviconType = "image/svg+xml";
    } else if (faviconUrl.startsWith("data:image/png")) {
      faviconHref = faviconUrl;
      faviconType = "image/png";
    } else {
      faviconHref = faviconUrl;
      faviconType = faviconUrl.endsWith(".svg") ? "image/svg+xml" : "image/png";
    }
  }

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href={faviconHref} type={faviconType} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href={faviconHref} />
      </head>
      <body style={{ minHeight: "100vh", margin: 0 }}>{children}</body>
    </html>
  );
}
