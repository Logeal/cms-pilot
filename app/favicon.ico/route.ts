export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const site = await prisma.site.findFirst({ select: { faviconUrl: true } });
  const faviconUrl = site?.faviconUrl ?? null;

  if (!faviconUrl) {
    return new NextResponse(null, { status: 404 });
  }

  if (faviconUrl.startsWith("data:")) {
    const [header, base64] = faviconUrl.split(",");
    const contentType = header.replace("data:", "").replace(";base64", "");
    const buffer = Buffer.from(base64, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  return NextResponse.redirect(faviconUrl);
}
