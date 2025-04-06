-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Variation" ADD COLUMN     "deletedAt" TIMESTAMP(3);
