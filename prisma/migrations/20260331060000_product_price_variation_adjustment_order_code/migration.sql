-- Add price to Product
ALTER TABLE "Product" ADD COLUMN "price" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- Rename price to priceAdjustment on Variation and set default 0
ALTER TABLE "Variation" RENAME COLUMN "price" TO "priceAdjustment";
ALTER TABLE "Variation" ALTER COLUMN "priceAdjustment" SET DEFAULT 0;

-- Add code (autoincrement) to Order
CREATE SEQUENCE IF NOT EXISTS "Order_code_seq";
ALTER TABLE "Order" ADD COLUMN "code" INTEGER NOT NULL DEFAULT nextval('"Order_code_seq"') UNIQUE;
ALTER SEQUENCE "Order_code_seq" OWNED BY "Order"."code";
