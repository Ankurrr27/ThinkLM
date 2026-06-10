import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/server/utils/auth";
import { uploadDocumentService } from "@/lib/server/services/document.service";
import { verifyWorkspaceAccess } from "@/lib/server/utils/workspace-auth.utils";
import { extractTextFromPDF } from "@/lib/server/utils/pdf.utils";
import { chunkText } from "@/lib/server/utils/chunk.utils";
import { getEmbedding } from "@/lib/server/utils/embeddings.utils";
import { storeChunkEmbedding } from "@/lib/server/utils/vector.utils";

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const workspaceId = formData.get("workspaceId") as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    if (!workspaceId) {
      return NextResponse.json({ success: false, message: "Workspace is required" }, { status: 400 });
    }

    await verifyWorkspaceAccess(workspaceId, userId);

    const buffer = Buffer.from(await file.arrayBuffer());

    const extractedText = await extractTextFromPDF(buffer);
    const chunks = chunkText(extractedText);
    
    const document = await uploadDocumentService({
      filename: file.name,
      filepath: null,
      mimetype: file.type,
      size: file.size,
      fileData: buffer,
      workspaceId,
    });

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk) as number[];

      await storeChunkEmbedding({
        content: chunk,
        embedding,
        chunkIndex: i,
        documentId: document.id,
      });
    }

    return NextResponse.json(
      { success: true, data: document, totalChunks: chunks.length },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload document" },
      { status: 400 }
    );
  }
}
