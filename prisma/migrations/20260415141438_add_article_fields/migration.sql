-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "imageUrl" TEXT,
    "publishedAt" DATETIME,
    "subject" TEXT,
    "keyword" TEXT,
    "tone" TEXT,
    "language" TEXT NOT NULL DEFAULT 'FR',
    "wordCount" INTEGER,
    "generationLog" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Article_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("category", "content", "createdAt", "id", "imageUrl", "metaDescription", "metaTitle", "publishedAt", "siteId", "slug", "status", "title", "updatedAt") SELECT "category", "content", "createdAt", "id", "imageUrl", "metaDescription", "metaTitle", "publishedAt", "siteId", "slug", "status", "title", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_siteId_slug_key" ON "Article"("siteId", "slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
