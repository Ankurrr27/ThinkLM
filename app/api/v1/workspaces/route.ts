import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/server/utils/auth";
import { createWorkspaceService, getUserWorkspacesService } from "@/lib/server/services/workspace.service";

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const workspaces = await getUserWorkspacesService(userId);

    return NextResponse.json(
      { success: true, data: workspaces },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch workspaces" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    const workspace = await createWorkspaceService(name, userId);

    return NextResponse.json(
      { success: true, data: workspace },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create workspace" },
      { status: 400 }
    );
  }
}
