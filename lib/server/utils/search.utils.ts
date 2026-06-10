import { prisma } from "../../prisma";

export const searchSimilarChunks = async ({
  embedding,
  workspaceId,
  limit = 5,
}: {
  embedding: number[];

  workspaceId: string;

  limit?: number;
}) => {

  const vector =
    `[${embedding.join(",")}]`;

  const result =
    await prisma.$queryRawUnsafe(`
      SELECT
        dc.id,
        dc.content,
        dc."documentId",

        1 - (
          dc.embedding <=> $1::vector
        ) AS similarity

      FROM "DocumentChunk" dc

      INNER JOIN "Document" d
      ON dc."documentId" = d.id

      WHERE d."workspaceId" = $2

      ORDER BY
        dc.embedding <=> $1::vector

      LIMIT $3
    `,
      vector,
      workspaceId,
      limit
    );

  return result;
};