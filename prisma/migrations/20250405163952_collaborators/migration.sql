/*
  Warnings:

  - You are about to drop the `StoreCollaborator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StoreCollaborator" DROP CONSTRAINT "StoreCollaborator_storeId_fkey";

-- DropForeignKey
ALTER TABLE "StoreCollaborator" DROP CONSTRAINT "StoreCollaborator_userId_fkey";

-- DropTable
DROP TABLE "StoreCollaborator";

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "StoreRole" NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_storeId_userId_key" ON "Collaborator"("storeId", "userId");

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
