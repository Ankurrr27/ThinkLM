"use client";

import { useState } from "react";
import Link from "next/link";

import AppLayout from "../../components/Applayout";
import { createWorkspace } from "../../services/workspace";
import {
  useWorkspaces,
} from "../../components/WorkspaceProvider";

export default function DashboardPage() {
  const [name, setName] = useState("");

  const {
    workspaces,
    setWorkspaces,
  } = useWorkspaces();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Enter a workspace name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await createWorkspace(name.trim(), token);

      setWorkspaces([
        response.data,
        ...workspaces,
      ]);
      setName("");
    } catch (error) {
      console.log(error);
      alert("Failed to create workspace.");
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Create focused research workspaces and keep every project organized.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_1fr]">
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Create workspace</h2>
          </div>
          <div className="panel-body space-y-3">
            <input
              className="field"
              placeholder="Workspace name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <button
              onClick={handleCreate}
              className="primary-button w-full"
            >
              Create workspace
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Your workspaces</h2>
            <span className="text-xs text-[var(--faint)]">
              {workspaces.length} total
            </span>
          </div>

          {workspaces.length === 0 ? (
            <div className="panel-body">
              <p className="empty-state">
                No workspaces yet. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {workspaces.map((workspace) => (
                <Link
                  key={workspace.id}
                  href={`/workspace/${workspace.id}`}
                  className="block px-4 py-3 no-underline transition hover:bg-[var(--surface-muted)]"
                >
                  <div className="text-sm font-semibold text-[var(--text)]">
                    {workspace.name}
                  </div>
                  <div className="mt-1 text-xs text-[var(--faint)]">
                    {new Date(workspace.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
