import { prisma } from "../../prisma";

export const createWorkspaceService = async (
  name: string,
  userId: string
) => {
  const workspace =
    await prisma.workspace.create({
      data: {
        name,
        userId,
      },
    });

  return workspace;
};

export const getUserWorkspacesService =
  async (userId: string) => {
    const workspaces =
      await prisma.workspace.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return workspaces;
  };