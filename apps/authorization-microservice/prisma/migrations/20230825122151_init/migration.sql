/*
  Warnings:

  - Added the required column `refreshToken` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tokens" ADD COLUMN     "refreshToken" TEXT NOT NULL;
