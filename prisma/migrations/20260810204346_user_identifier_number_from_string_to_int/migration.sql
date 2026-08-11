/*
  Warnings:

  - Changed the type of `identifier_number` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "identifier_number",
ADD COLUMN     "identifier_number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_identifier" ON "users"("identifier_type", "identifier_number");
