/*
  Warnings:

  - The `id` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `userToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `userToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `userToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "userToken" DROP CONSTRAINT "userToken_userId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserAccount" DROP CONSTRAINT "UserAccount_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "userToken" DROP CONSTRAINT "userToken_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "userToken_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "userToken" ADD CONSTRAINT "userToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
