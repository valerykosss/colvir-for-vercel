/*
  Warnings:

  - A unique constraint covering the columns `[oldId]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oldId` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "oldId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_oldId_key" ON "Certificate"("oldId");
