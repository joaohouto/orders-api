-- CreateTable: VariationGroup
CREATE TABLE "VariationGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "VariationGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: VariationGroup -> Product
ALTER TABLE "VariationGroup" ADD CONSTRAINT "VariationGroup_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate existing Variation data: create one VariationGroup per (productId, type) pair
INSERT INTO "VariationGroup" ("id", "name", "productId", "deletedAt")
SELECT
    gen_random_uuid()::text,
    CASE "type"
        WHEN 'COLOR'   THEN 'Cor'
        WHEN 'SIZE'    THEN 'Tamanho'
        WHEN 'FABRIC'  THEN 'Tecido'
        ELSE 'Geral'
    END,
    "productId",
    MIN("deletedAt")
FROM "Variation"
GROUP BY "productId", "type";

-- Add groupId column to Variation (nullable first for migration)
ALTER TABLE "Variation" ADD COLUMN "groupId" TEXT;

-- Set groupId based on matching productId + type -> VariationGroup
UPDATE "Variation" v
SET "groupId" = vg."id"
FROM "VariationGroup" vg
WHERE vg."productId" = v."productId"
  AND vg."name" = CASE v."type"
        WHEN 'COLOR'   THEN 'Cor'
        WHEN 'SIZE'    THEN 'Tamanho'
        WHEN 'FABRIC'  THEN 'Tecido'
        ELSE 'Geral'
    END;

-- Make groupId NOT NULL
ALTER TABLE "Variation" ALTER COLUMN "groupId" SET NOT NULL;

-- AddForeignKey: Variation -> VariationGroup
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_groupId_fkey"
    FOREIGN KEY ("groupId") REFERENCES "VariationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old columns from Variation
ALTER TABLE "Variation" DROP COLUMN "type";
ALTER TABLE "Variation" DROP COLUMN "productId";

-- Migrate OrderItemVariation: variationType -> variationGroup (text snapshot)
ALTER TABLE "OrderItemVariation" ADD COLUMN "variationGroup" TEXT;

UPDATE "OrderItemVariation"
SET "variationGroup" = CASE "variationType"::text
    WHEN 'COLOR'   THEN 'Cor'
    WHEN 'SIZE'    THEN 'Tamanho'
    WHEN 'FABRIC'  THEN 'Tecido'
    ELSE 'Geral'
END;

ALTER TABLE "OrderItemVariation" ALTER COLUMN "variationGroup" SET NOT NULL;
ALTER TABLE "OrderItemVariation" DROP COLUMN "variationType";

-- Drop the enum
DROP TYPE IF EXISTS "VariationType";
