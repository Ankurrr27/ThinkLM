"use client";

import Link from "next/link";
import AppLayout from "../../components/Applayout";

export default function WorkspacePage() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="page-title">Workspaces</h1>
        <p className="page-subtitle">
          Select an existing workspace from the sidebar or create a new one.
        </p>
      </div>

      <section className="panel max-w-xl">
        <div className="panel-header">
          <h2 className="panel-title">No workspace selected</h2>
        </div>
        <div className="panel-body">
          <p className="text-sm leading-6 text-[var(--muted)]">
            Workspaces keep documents, embeddings, and chats grouped by research project.
          </p>
          <Link
            href="/dashboard"
            className="primary-button mt-4 px-4 no-underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
