import { prisma } from "../../prisma";

interface UploadDocumentInput {
  filename: string;
  filepath?: string | null;
  mimetype: string;
  size: number;
  fileData: Buffer;
  workspaceId: string;
}

export const uploadDocumentService =
  async (
    data: UploadDocumentInput
  ) => {
    const document =
      await prisma.document.create({
        data: {
          ...data,
          fileData: data.fileData as any,
        },
      });

    return document;
  };

export const getWorkspaceDocumentsService =
  async (workspaceId: string) => {
    const documents =
      await prisma.document.findMany({
        where: {
          workspaceId,
        },
        select: {
          id: true,
          filename: true,
          mimetype: true,
          size: true,
          uploadedAt: true,
          workspaceId: true,
          filepath: true,
          // fileData intentionally excluded — raw PDF bytes cannot be JSON-serialised
        },
        orderBy: {
          uploadedAt: "desc",
        },
      });

    return documents;
  };

export const deleteDocumentService =
  async (
    documentId: string,
    userId: string
  ) => {
    const document =
      await prisma.document.findFirst({
        where: {
          id: documentId,
          workspace: { userId },
        },
        select: {
          id: true,
          filename: true,
          mimetype: true,
          size: true,
          uploadedAt: true,
          workspaceId: true,
          filepath: true,
        },
      });

    if (!document) {
      throw new Error("Document not found");
    }

    await prisma.$transaction([
      prisma.documentChunk.deleteMany({
        where: {
          documentId,
        },
      }),
      prisma.document.delete({
        where: {
          id: documentId,
        },
      }),
    ]);

    return document;
  };
