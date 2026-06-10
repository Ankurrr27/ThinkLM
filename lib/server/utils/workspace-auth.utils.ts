import { prisma } from "../../prisma";

export const verifyWorkspaceAccess = async (
  workspaceId: string,
  userId: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      userId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  return workspace;
};
