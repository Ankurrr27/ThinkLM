"use client";

import { use, useEffect, useState } from "react";
import AppLayout from "../../../components/Applayout";
import UploadDocument from "../../../components/UploadDocument";
import ChatPanel from "../../../components/ChatPanel";
import DocumentsList from "../../../components/DocumentList";
import { getDocuments } from "../../../services/document";

interface DocumentItem {
  id: string;
  filename: string;
}

export default function WorkspacePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    id,
  } = use(params);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDocuments = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      setLoading(true);
      const response = await getDocuments(id, token);
      setDocuments(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [id]);

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Workspace</h1>
          <p className="page-subtitle">
            Upload PDFs, review indexed files, and ask grounded questions.
          </p>
        </div>
        <span className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs text-[var(--faint)]">
          {id}
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Documents</h2>
            <span className="text-xs text-[var(--faint)]">
              {documents.length} files
            </span>
          </div>

          <div className="panel-body">
            <UploadDocument workspaceId={id} onSuccess={loadDocuments} />

            <div className="mt-5">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--faint)]">
                Uploaded files
              </h3>

              {loading ? (
                <p className="empty-state">Loading documents...</p>
              ) : (
                <DocumentsList
                  documents={documents}
                  onDeleted={loadDocuments}
                />
              )}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">AI Chat</h2>
            <span className="text-xs text-[var(--faint)]">
              Workspace grounded
            </span>
          </div>

          <div className="panel-body">
            <ChatPanel workspaceId={id} />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
