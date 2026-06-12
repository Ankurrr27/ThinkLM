export const runtime = "nodejs";
export const maxDuration = 120;

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
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { question, workspaceId } = body;

    if (!question?.trim()) {
      return NextResponse.json(
        { success: false, message: "Question is required" },
        { status: 400 }
      );
    }

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, message: "workspaceId is required" },
        { status: 400 }
      );
    }

    await verifyWorkspaceAccess(workspaceId, userId);

    // Compute the real query embedding via Gemini (fixes the broken zero-vector bug)
    const queryEmbedding = await getEmbedding(question.trim());

    // Semantic search: find most relevant chunks from uploaded documents
    const chunks: any[] = (await searchSimilarChunks({
      embedding: queryEmbedding,
      workspaceId,
      limit: 6,
    })) as any[];

    // Build context from top matching chunks
    const context = chunks
      .map((chunk: any) => chunk.content)
      .join("\n\n---\n\n");

    // Generate a crisp, grounded answer via Gemini
    const answer = await generateAnswer(question.trim(), context);

    // Persist chat & messages
    let chat = await prisma.chat.findFirst({ where: { workspaceId } });
    if (!chat) {
      chat = await prisma.chat.create({ data: { workspaceId } });
    }

    await prisma.message.createMany({
      data: [
        { role: "user", content: question.trim(), chatId: chat.id },
        { role: "assistant", content: answer, chatId: chat.id },
      ],
    });

    return NextResponse.json({
      success: true,
      question,
      answer,
      matches: chunks,
    });
  } catch (error: any) {
    console.error("Chat Ask Error:", error?.message, error?.stack);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
