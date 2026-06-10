"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Search, Folder, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import {
  useWorkspaces,
} from "./WorkspaceProvider";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  // Load collapsed state from localStorage on client side mount
  useEffect(() => {
    const val = localStorage.getItem("sidebar-collapsed");
    if (val === "true") {
      setCollapsed(true);
    }
  }, []);

  const {
    workspaces,
  } = useWorkspaces();

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const filteredWorkspaces =
    workspaces.filter((workspace) =>
      workspace.name
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={toggleCollapse}
        className="sidebar-toggle-btn"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {collapsed ? (
        <div className="flex justify-center w-full py-2 mb-2">
          <Link href="/dashboard" className="brand-mark flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm text-[var(--accent)] bg-[var(--accent-soft)] hover:scale-105 transition no-underline">
            AR
          </Link>
        </div>
      ) : (
        <div className="brand-row">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="brand-mark"
            title="Search workspaces"
          >
            <Search className="h-4 w-4" />
          </button>

          {searchOpen ? (
            <input
              className="sidebar-search"
              placeholder="Search workspaces"
              value={query}
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : (
            <Link href="/dashboard" className="brand-title">
              AI Research
            </Link>
          )}
        </div>
      )}

      <div className="sidebar-controls">
        <Link href="/dashboard" className="sidebar-action" title="New workspace">
          <Plus className="h-4 w-4" />
          <span>New workspace</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="nav-label">
        Workspaces
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto">
        {workspaces.length === 0 ? (
          <p className="empty-state">
            {!collapsed && "No workspaces yet."}
          </p>
        ) : filteredWorkspaces.length === 0 ? (
          <p className="empty-state">
            {!collapsed && "No matching workspaces."}
          </p>
        ) : (
          <div className="space-y-1">
            {filteredWorkspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/workspace/${workspace.id}`}
                className="workspace-link"
                title={workspace.name}
              >
                <Folder className="h-4 w-4 flex-shrink-0" />
                <span>{workspace.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="secondary-button danger-hover mt-4 w-full"
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
