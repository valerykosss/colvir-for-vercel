/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "format" DROP NOT NULL,
ALTER COLUMN "background" SET DEFAULT 'default.jpg';

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_code_key" ON "Certificate"("code");
