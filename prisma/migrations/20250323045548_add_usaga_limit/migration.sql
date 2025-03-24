/*
  Warnings:

  - Changed the type of `pricing` on the `API` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "API" ADD COLUMN     "monthlyLimit" INTEGER,
ADD COLUMN     "monthlyPrice" DOUBLE PRECISION,
ADD COLUMN     "pricePerRequest" DOUBLE PRECISION,
DROP COLUMN "pricing",
ADD COLUMN     "pricing" "PricingPlan" NOT NULL;
