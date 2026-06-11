import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/server/utils/auth";
import { verifyWorkspaceAccess } from "@/lib/server/utils/workspace-auth.utils";
import { getEmbedding } from "@/lib/server/utils/embeddings.utils";
import { searchSimilarChunks } from "@/lib/server/utils/search.utils";
import { generateAnswer } from "@/lib/server/utils/llm.utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    console.log("STEP 1 - Route Started");

    const userId = getAuthUserId(req);

    if (!userId) {
      console.log("STEP 2 - Unauthorized");

      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("STEP 3 - User Authenticated");

    const body = await req.json();
    const { question, workspaceId } = body;

    console.log("STEP 4 - Body Parsed", {
      question,
      workspaceId,
    });

    await verifyWorkspaceAccess(
      workspaceId,
      userId
    );

    console.log("STEP 5 - Workspace Verified");

    const queryEmbedding =
      new Array(384).fill(0);

    console.log("STEP 6 - Embedding Created");

    const chunks: any =
      await searchSimilarChunks({
        embedding: queryEmbedding,
        workspaceId,
      });

    console.log(
      "STEP 7 - Search Completed",
      chunks?.length
    );

    const context =
      chunks
        .map((chunk: any) => chunk.content)
        .join("\n\n");

    console.log("STEP 8 - Context Created");

    const answer =
      await generateAnswer(
        question,
        context
      );

    console.log("STEP 9 - Answer Generated");

    let chat =
      await prisma.chat.findFirst({
        where: { workspaceId },
      });

    console.log("STEP 10 - Chat Lookup");

    if (!chat) {
      chat =
        await prisma.chat.create({
          data: { workspaceId },
        });

      console.log(
        "STEP 11 - Chat Created"
      );
    }

    await prisma.message.create({
      data: {
        role: "user",
        content: question,
        chatId: chat.id,
      },
    });

    console.log(
      "STEP 12 - User Message Saved"
    );

    await prisma.message.create({
      data: {
        role: "assistant",
        content: answer,
        chatId: chat.id,
      },
    });

    console.log(
      "STEP 13 - Assistant Message Saved"
    );

    return NextResponse.json({
      success: true,
      question,
      answer,
      matches: chunks,
    });

  } catch (error: any) {

    console.error(
      "==================== ERROR ===================="
    );

    console.error("NAME:", error?.name);

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "STACK:",
      error?.stack
    );

    console.error(
      "FULL ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        name: error?.name,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
