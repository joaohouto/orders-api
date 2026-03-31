-- CreateEnum
CREATE TYPE "VariationType" AS ENUM ('GENERIC', 'COLOR', 'SIZE', 'FABRIC');

-- AlterTable Variation: drop old columns, add type
ALTER TABLE "Variation" DROP COLUMN IF EXISTS "color";
ALTER TABLE "Variation" DROP COLUMN IF EXISTS "fabric";
ALTER TABLE "Variation" DROP COLUMN IF EXISTS "size";
ALTER TABLE "Variation" ADD COLUMN "type" "VariationType" NOT NULL DEFAULT 'GENERIC';

-- AlterTable OrderItem: drop old columns
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "variationId";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "variationName";

-- CreateTable OrderItemVariation
CREATE TABLE "OrderItemVariation" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "variationId" TEXT NOT NULL,
    "variationName" TEXT NOT NULL,
    "variationType" "VariationType" NOT NULL,

    CONSTRAINT "OrderItemVariation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItemVariation" ADD CONSTRAINT "OrderItemVariation_orderItemId_fkey"
    FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
