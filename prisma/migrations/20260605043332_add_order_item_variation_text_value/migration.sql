-- AlterTable
ALTER TABLE "OrderItemVariation" ADD COLUMN     "textValue" TEXT,
ALTER COLUMN "variationId" DROP NOT NULL;
