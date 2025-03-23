/*
  Warnings:

  - The values [PRO,ENTERPRISE] on the enum `PricingPlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PricingPlan_new" AS ENUM ('FREE', 'PAY_PER_REQUEST', 'SUBSCRIPTION');
ALTER TABLE "UsageLimit" ALTER COLUMN "plan" TYPE "PricingPlan_new" USING ("plan"::text::"PricingPlan_new");
ALTER TABLE "Subscription" ALTER COLUMN "plan" TYPE "PricingPlan_new" USING ("plan"::text::"PricingPlan_new");
ALTER TYPE "PricingPlan" RENAME TO "PricingPlan_old";
ALTER TYPE "PricingPlan_new" RENAME TO "PricingPlan";
DROP TYPE "PricingPlan_old";
COMMIT;
