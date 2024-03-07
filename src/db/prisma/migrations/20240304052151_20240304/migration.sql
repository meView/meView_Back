/*
  Warnings:

  - You are about to drop the `SWYP_User_Authority` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SWYP_User_Authority" DROP CONSTRAINT "SWYP_User_Authority_user_id_fkey";

-- DropTable
DROP TABLE "SWYP_User_Authority";
