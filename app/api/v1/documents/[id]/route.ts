import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/server/utils/auth";
import { getWorkspaceDocumentsService, deleteDocumentService } from "@/lib/server/services/document.service";
import { verifyWorkspaceAccess } from "@/lib/server/utils/workspace-auth.utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: workspaceId } = await params;

    await verifyWorkspaceAccess(workspaceId, userId);

    const documents = await getWorkspaceDocumentsService(workspaceId);

    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Documents Error:", error);
    const status = error.message?.includes("Unauthorized") ? 401
      : error.message?.includes("not found") ? 404
      : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get documents" },
      { status }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: documentId } = await params;

    const document = await deleteDocumentService(documentId, userId);

    return NextResponse.json(
      { success: true, data: document },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Document Error:", error);
    const status = error.message?.includes("Unauthorized") ? 401
      : error.message?.includes("not found") ? 404
      : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete document" },
      { status }
    );
  }
}
