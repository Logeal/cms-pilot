/**
 * Single source of truth for converting a label to a URL-safe slug.
 * Used across API routes, admin UI, sitemap, and dedup helpers so the same
 * normalization is applied everywhere.
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const ARTICLE_STATUSES = [
  "draft",
  "published",
  "scheduled",
  "duplicate",
] as const;

export type ArticleStatus = typeof ARTICLE_STATUSES[number];

export function isValidStatus(s: unknown): s is ArticleStatus {
  return typeof s === "string" && (ARTICLE_STATUSES as readonly string[]).includes(s);
}
