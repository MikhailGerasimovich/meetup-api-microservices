/*
  Warnings:

  - You are about to drop the column `palce` on the `Meetups` table. All the data in the column will be lost.
  - Added the required column `place` to the `Meetups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meetups" DROP COLUMN "palce",
ADD COLUMN     "place" TEXT NOT NULL;
