/*
  Warnings:

  - A unique constraint covering the columns `[endpoint]` on the table `API` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authType` to the `API` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricing` to the `API` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `API` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `API` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "API" ADD COLUMN     "authType" TEXT NOT NULL,
ADD COLUMN     "pricing" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "API_endpoint_key" ON "API"("endpoint");

-- AddForeignKey
ALTER TABLE "API" ADD CONSTRAINT "API_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
