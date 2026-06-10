import { api } from "./api";

export const createWorkspace = async (
  name: string,
  token: string
) => {
  const res = await api.post(
    "/workspaces",
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getWorkspaces = async (
  token: string
) => {
  const res = await api.get(
    "/workspaces",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};