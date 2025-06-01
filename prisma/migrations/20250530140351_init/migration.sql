/*
  Warnings:

  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_quoteId_fkey";

-- DropTable
DROP TABLE "Likes";

-- CreateTable
CREATE TABLE "Reactions" (
    "id" TEXT NOT NULL,
    "likesCount" INTEGER NOT NULL,
    "dislikeCount" INTEGER NOT NULL,
    "quoteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reactions" ADD CONSTRAINT "Reactions_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
