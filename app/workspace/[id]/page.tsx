"use client";

import { use, useState, useCallback } from "react";
import AppLayout from "../../../components/Applayout";
import ChatPanel from "../../../components/ChatPanel";
import DocumentManager from "../../../components/DocumentManager";
import { FileText, X } from "lucide-react";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [docsOpen, setDocsOpen] = useState(false);

  const openDocs  = useCallback(() => setDocsOpen(true), []);
  const closeDocs = useCallback(() => setDocsOpen(false), []);

  const handleDocumentsChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const docsButton = (
    <button
      type="button"
      className="mobile-docs-btn"
      aria-label="Open documents"
      onClick={openDocs}
    >
      <FileText className="h-4 w-4" />
      <span>Sources</span>
    </button>
  );

  return (
    <AppLayout workspaceId={id} rightPanel={docsButton}>
      <div className="workspace-layout-container">

        {/* ── Desktop split ── */}
        <div className="workspace-split-layout">
          {/* Left: Documents column (desktop only) */}
          <div className="workspace-column documents-column">
            <DocumentManager workspaceId={id} onDocumentsChange={handleDocumentsChange} />
          </div>

          {/* Right: Chat column */}
          <div className="workspace-column chat-column">
            <div className="workspace-chat-wrap">
              <ChatPanel workspaceId={id} key={refreshTrigger} />
            </div>
          </div>
        </div>

        {/* ── Mobile: Full-height chat (no split) ── */}
        <div className="mobile-chat-fullscreen">
          <ChatPanel workspaceId={id} key={`mobile-${refreshTrigger}`} />
        </div>

      </div>

      {/* ── Right drawer: Documents (mobile) ── */}
      {docsOpen && (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={closeDocs}
        />
      )}
      <div className={`docs-drawer ${docsOpen ? "open" : ""}`}>
        <div className="docs-drawer-header">
          <span className="docs-drawer-title">Sources</span>
          <button
            type="button"
            className="mobile-hamburger"
            aria-label="Close documents"
            onClick={closeDocs}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="docs-drawer-body">
          <DocumentManager workspaceId={id} onDocumentsChange={handleDocumentsChange} />
        </div>
      </div>
    </AppLayout>
  );
}
