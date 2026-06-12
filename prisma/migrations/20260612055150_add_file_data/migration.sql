-- DropIndex
DROP INDEX "DocumentChunk_documentId_idx";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "fileData" BYTEA,
ALTER COLUMN "filepath" DROP NOT NULL;
