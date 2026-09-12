/*
  Warnings:

  - A unique constraint covering the columns `[idempotency_key]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotency_key_key" ON "transactions"("idempotency_key");
