-- Remover coluna antiga (inteiro com autoincrement)
ALTER TABLE "Order" DROP COLUMN "code";
DROP SEQUENCE IF EXISTS "Order_code_seq";

-- Adicionar nova coluna de código legível (string)
ALTER TABLE "Order" ADD COLUMN "code" TEXT;

-- Popular pedidos existentes com código derivado do id (único por construção)
UPDATE "Order" SET "code" = UPPER(SUBSTRING("id", 1, 4)) || '-' || UPPER(SUBSTRING("id", 5, 4));

-- Tornar NOT NULL e criar índice único
ALTER TABLE "Order" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");
