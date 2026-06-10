"use client";

import { useState } from "react";
import axios from "axios";
import { FileText, Trash2 } from "lucide-react";
import {
  deleteDocument,
} from "../services/document";

interface Document {
  id: string;
  filename: string;
}

export default function DocumentsList({
  documents,
  onDeleted,
}: {
  documents: Document[];
  onDeleted?: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (documentId: string) => {
    const confirmed = window.confirm("Delete this document?");

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setDeletingId(documentId);
      await deleteDocument(documentId, token);
      onDeleted?.();
    } catch (error) {
      console.log(error);
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      alert(message || "Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-2">
      {documents.length === 0 ? (
        <p className="empty-state">
          No documents uploaded.
        </p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            className="list-row"
          >
            <FileText className="h-4 w-4 shrink-0 text-[var(--accent)]" />
            <span className="min-w-0 flex-1 truncate">{doc.filename}</span>
            <button
              type="button"
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id}
              title="Delete document"
              className="danger-icon-button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
