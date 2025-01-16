/*
  Warnings:

  - You are about to alter the column `amount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE INTEGER;
