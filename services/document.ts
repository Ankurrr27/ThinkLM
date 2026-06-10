import { api } from "./api";

export const uploadDocument =
  async (
    file: File,
    workspaceId: string,
    token: string
  ) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "workspaceId",
      workspaceId
    );

    const res =
      await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

export const getDocuments =
  async (
    workspaceId: string,
    token: string
  ) => {

    const res =
      await api.get(
        `/documents/${workspaceId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

export const deleteDocument =
  async (
    documentId: string,
    token: string
  ) => {
    const res =
      await api.delete(
        `/documents/${documentId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };
