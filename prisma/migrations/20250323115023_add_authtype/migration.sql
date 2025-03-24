/*
  Warnings:

  - Changed the type of `authType` on the `API` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('API_KEY', 'OAUTH', 'NONE');

-- AlterTable
ALTER TABLE "API" DROP COLUMN "authType",
ADD COLUMN     "authType" "AuthType" NOT NULL;
