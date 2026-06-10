import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/server/utils/auth";
import { verifyWorkspaceAccess } from "@/lib/server/utils/workspace-auth.utils";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId } = await params;

    if (!workspaceId) {
      return NextResponse.json({ success: false, message: "Workspace ID is required" }, { status: 400 });
    }

    await verifyWorkspaceAccess(workspaceId, userId);

    const chat = await prisma.chat.findFirst({
      where: { workspaceId },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    }) as any;

    const messages = chat ? chat.messages : [];

    return NextResponse.json(
      { success: true, data: messages },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get chat history" },
      { status: 500 }
    );
  }
}
