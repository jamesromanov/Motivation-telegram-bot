/*
  Warnings:

  - You are about to drop the column `text` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "text",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_key_key" ON "Session"("key");
