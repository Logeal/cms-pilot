-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "categories" JSONB NOT NULL DEFAULT '[]',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "menuConfig" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Site" ("apiKey", "categories", "createdAt", "id", "name", "updatedAt", "url") SELECT "apiKey", "categories", "createdAt", "id", "name", "updatedAt", "url" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
CREATE UNIQUE INDEX "Site_url_key" ON "Site"("url");
CREATE UNIQUE INDEX "Site_apiKey_key" ON "Site"("apiKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
