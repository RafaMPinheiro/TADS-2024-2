/*
  Warnings:

  - Added the required column `action` to the `log` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_log" ("id", "module", "userId") SELECT "id", "module", "userId" FROM "log";
DROP TABLE "log";
ALTER TABLE "new_log" RENAME TO "log";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
