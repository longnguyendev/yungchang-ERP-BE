/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employeeCode` on the `UserAccount` table. All the data in the column will be lost.
  - You are about to drop the column `employeeCode` on the `userToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `UserAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `UserAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `userToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAccount" DROP CONSTRAINT "UserAccount_employeeCode_fkey";

-- DropForeignKey
ALTER TABLE "userToken" DROP CONSTRAINT "userToken_employeeCode_fkey";

-- DropIndex
DROP INDEX "Employee_code_key";

-- DropIndex
DROP INDEX "UserAccount_employeeCode_key";

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "code",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Employee_id_seq";

-- AlterTable
ALTER TABLE "UserAccount" DROP COLUMN "employeeCode",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "userToken" DROP COLUMN "employeeCode",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_employeeId_key" ON "UserAccount"("employeeId");

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userToken" ADD CONSTRAINT "userToken_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "UserAccount"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
