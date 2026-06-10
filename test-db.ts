import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database...");
  try {
    const usersCount = await prisma.user.count();
    console.log("Users count:", usersCount);

    const workspaces = await prisma.workspace.findMany();
    console.log("Workspaces:", workspaces.map(w => ({ id: w.id, name: w.name })));

    const documents = await prisma.document.findMany();
    console.log("Documents:", documents.map(d => ({ id: d.id, filename: d.filename, workspaceId: d.workspaceId, size: d.size })));

    const chunksCount = await prisma.documentChunk.count();
    console.log("Document chunks count:", chunksCount);
    
    if (workspaces.length > 0) {
      const workspaceId = workspaces[0].id;
      // Let's test the raw query to see if it fails
      const dummyEmbedding = new Array(384).fill(0.1);
      const vector = `[${dummyEmbedding.join(",")}]`;
      console.log("Running raw vector query test...");
      const result = await prisma.$queryRawUnsafe(`
        SELECT 
          dc.id, 
          dc.content, 
          dc."documentId"
        FROM "DocumentChunk" dc
        INNER JOIN "Document" d ON dc."documentId" = d.id
        WHERE d."workspaceId" = $1
        LIMIT 1
      `, workspaceId);
      console.log("Raw query result:", result);
    }
  } catch (err) {
    console.error("Error running test:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
