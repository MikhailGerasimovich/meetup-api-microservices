/*
  Warnings:

  - You are about to drop the column `roles` on the `Users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "roles",
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USER';
