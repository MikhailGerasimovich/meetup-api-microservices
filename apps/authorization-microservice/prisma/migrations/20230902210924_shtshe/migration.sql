/*
  Warnings:

  - You are about to drop the column `avatarPhotoPaht` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "avatarPhotoPaht",
ADD COLUMN     "avatarFilename" TEXT;
