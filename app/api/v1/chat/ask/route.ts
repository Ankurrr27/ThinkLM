import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/server/utils/auth";
import { verifyWorkspaceAccess } from "@/lib/server/utils/workspace-auth.utils";
import { getEmbedding } from "@/lib/server/utils/embeddings.utils";
import { searchSimilarChunks } from "@/lib/server/utils/search.utils";
import { generateAnswer } from "@/lib/server/utils/llm.utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { question, workspaceId } = body;

    if (!question || !workspaceId) {
      return NextResponse.json(
        { success: false, message: "Question and workspaceId required" },
        { status: 400 }
      );
    }

    await verifyWorkspaceAccess(workspaceId, userId);

    const queryEmbedding = await getEmbedding(question);

    const chunks: any = await searchSimilarChunks({
      embedding: queryEmbedding as number[],
      workspaceId,
    });

    const context = chunks
      .map((chunk: any) => chunk.content)
      .join("\n\n");

    const answer = await generateAnswer(question, context);

    let chat = await prisma.chat.findFirst({
      where: { workspaceId },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { workspaceId },
      });
    }

    await prisma.message.create({
      data: {
        role: "user",
        content: question,
        chatId: chat.id,
      },
    });

    await prisma.message.create({
      data: {
        role: "assistant",
        content: answer,
        chatId: chat.id,
      },
    });

    return NextResponse.json(
      { success: true, question, answer, matches: chunks },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process question" },
      { status: 500 }
    );
  }
}
