/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAccount" DROP CONSTRAINT "UserAccount_employeeCode_fkey";

-- DropIndex
DROP INDEX "Employee_id_key";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_code_key" ON "Employee"("code");

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_employeeCode_fkey" FOREIGN KEY ("employeeCode") REFERENCES "Employee"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
