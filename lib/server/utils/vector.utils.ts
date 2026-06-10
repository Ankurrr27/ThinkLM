import { prisma } from "../../prisma";

export const storeChunkEmbedding = async ({
  content,
  embedding,
  chunkIndex,
  documentId,
}: {
  content: string;

  embedding: number[];

  chunkIndex: number;

  documentId: string;
}) => {

  const vector =
    `[${embedding.join(",")}]`;

  await prisma.$executeRawUnsafe(`
    INSERT INTO "DocumentChunk"
    (
      "id",
      "content",
      "embedding",
      "chunkIndex",
      "documentId",
      "createdAt"
    )
    VALUES
    (
      gen_random_uuid()::text,
      $1,
      $2::vector,
      $3,
      $4,
      NOW()
    )
  `,
    content,
    vector,
    chunkIndex,
    documentId
  );
};
