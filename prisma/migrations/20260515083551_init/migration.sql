/*
  Warnings:

  - You are about to drop the column `token` on the `userToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `userToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `userToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessToken]` on the table `userToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `userToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeCode` to the `userToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `userToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `userToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userToken" DROP CONSTRAINT "userToken_userId_fkey";

-- DropIndex
DROP INDEX "userToken_token_key";

-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "userToken" DROP COLUMN "token",
DROP COLUMN "userId",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "employeeCode" TEXT NOT NULL,
ADD COLUMN     "expiresAt" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userToken_refreshToken_key" ON "userToken"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "userToken_accessToken_key" ON "userToken"("accessToken");

-- AddForeignKey
ALTER TABLE "userToken" ADD CONSTRAINT "userToken_employeeCode_fkey" FOREIGN KEY ("employeeCode") REFERENCES "UserAccount"("employeeCode") ON DELETE RESTRICT ON UPDATE CASCADE;
