import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const existing = await prisma.theme.findFirst({ where: { name: "Theme 1 — Maison & Conseil" } });
  if (existing) { console.log("Theme 1 déjà en base."); return; }

  const css = fs.readFileSync(path.join(process.cwd(), "app/(maison)/theme.css"), "utf8");

  await prisma.theme.create({
    data: {
      name: "Theme 1 — Maison & Conseil",
      description: "Thème éditorial lifestyle : maison, décoration, immobilier.",
      version: "1.0.0",
      css,
      active: true,
    },
  });
  console.log("Theme 1 seedé et activé.");
}

main().finally(() => prisma.$disconnect());
