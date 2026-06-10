"use client";

import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

import {
  uploadDocument,
} from "../services/document";

export default function UploadDocument({
  workspaceId,
  onSuccess,
}: {
  workspaceId: string;
  onSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      if (file.type !== "application/pdf") {
        alert("Only PDF files can be uploaded.");
        return;
      }

      await uploadDocument(file, workspaceId, token);

      setFile(null);
      onSuccess?.();
    } catch (error) {
      console.log(error);
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      alert(message || "Failed to upload the document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="application/pdf,.pdf"
        className="file-field"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="primary-button w-full"
      >
        <Upload className="h-4 w-4" />
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}
