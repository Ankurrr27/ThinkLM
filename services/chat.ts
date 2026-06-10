import { api } from "./api";

export const askQuestion =
  async (
    question: string,
    workspaceId: string,
    token: string
  ) => {

    const res =
      await api.post(
        "/chat/ask",
        {
          question,
          workspaceId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

export const getChatHistory =
  async (
    workspaceId: string,
    token: string
  ) => {
    const res =
      await api.get(
        `/chat/history/${workspaceId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };
