import { prisma } from "./prisma";

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export type DuplicateArticle = {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  status: string;
  createdAt: Date;
  publishedAt: Date | null;
  site: { name: string; url: string };
};

export type DuplicateGroup = {
  key: string;
  reason: "title" | "slug";
  articles: DuplicateArticle[];
};

const SELECT = {
  id: true, siteId: true, title: true, slug: true, status: true,
  createdAt: true, publishedAt: true,
  site: { select: { name: true, url: true } },
} as const;

export async function findDuplicateGroups(siteId?: string): Promise<DuplicateGroup[]> {
  const where = siteId ? { siteId } : {};
  const articles = await prisma.article.findMany({ where, select: SELECT });

  const byTitle = new Map<string, DuplicateArticle[]>();
  const bySlug  = new Map<string, DuplicateArticle[]>();

  for (const a of articles) {
    const tk = `${a.siteId}::${normalizeTitle(a.title)}`;
    if (!byTitle.has(tk)) byTitle.set(tk, []);
    byTitle.get(tk)!.push(a);

    const sk = `${a.siteId}::${a.slug}`;
    if (!bySlug.has(sk)) bySlug.set(sk, []);
    bySlug.get(sk)!.push(a);
  }

  const seen = new Set<string>();
  const groups: DuplicateGroup[] = [];

  for (const [key, list] of byTitle) {
    if (list.length < 2) continue;
    list.forEach(a => seen.add(a.id));
    groups.push({ key, reason: "title", articles: list });
  }

  for (const [key, list] of bySlug) {
    if (list.length < 2) continue;
    if (list.every(a => seen.has(a.id))) continue;
    list.forEach(a => seen.add(a.id));
    groups.push({ key, reason: "slug", articles: list });
  }

  return groups;
}

/**
 * Pick the article to KEEP from a duplicate group.
 * Priority: published > duplicate > scheduled > draft, then oldest createdAt.
 */
function pickKeeper(articles: DuplicateArticle[]): DuplicateArticle {
  const rank = (s: string) =>
    s === "published" ? 0 :
    s === "scheduled" ? 1 :
    s === "duplicate" ? 2 :
    3;
  return [...articles].sort((a, b) => {
    const r = rank(a.status) - rank(b.status);
    if (r !== 0) return r;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  })[0];
}

/**
 * For each duplicate group, delete every article except the keeper.
 * Returns the list of deleted ids.
 */
export async function resolveDuplicates(siteId?: string): Promise<{ deleted: string[]; kept: string[] }> {
  const groups = await findDuplicateGroups(siteId);
  const deleted: string[] = [];
  const kept: string[] = [];

  for (const group of groups) {
    const keeper = pickKeeper(group.articles);
    kept.push(keeper.id);
    const toDelete = group.articles.filter(a => a.id !== keeper.id);
    for (const a of toDelete) {
      if (deleted.includes(a.id)) continue;
      await prisma.article.delete({ where: { id: a.id } });
      deleted.push(a.id);
    }
  }

  return { deleted, kept };
}

/**
 * Returns the id of an already-published article in the same site whose
 * normalized title matches `title`, excluding `excludeId`. Null if none.
 */
export async function findPublishedConflict(
  siteId: string,
  title: string,
  excludeId?: string,
): Promise<string | null> {
  const norm = normalizeTitle(title);
  if (!norm) return null;
  const candidates = await prisma.article.findMany({
    where: {
      siteId,
      status: "published",
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true, title: true },
  });
  const hit = candidates.find(a => normalizeTitle(a.title) === norm);
  return hit?.id ?? null;
}
