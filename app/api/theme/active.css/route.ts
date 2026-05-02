import { prisma } from "@/lib/prisma";

export async function GET() {
  const theme = await prisma.theme.findFirst({ where: { active: true } });
  const css = theme?.css ?? "";
  return new Response(css, {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
