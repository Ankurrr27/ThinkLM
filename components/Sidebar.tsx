"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut, Plus, Search, Folder,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { useState, useEffect } from "react";

import { useWorkspaces } from "./WorkspaceProvider";
import ThemeToggle from "./ThemeToggle";

interface DocItem { id: string; filename: string; }

export default function Sidebar({
  mobileOpen = false,
  onClose,
  workspaceId,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  workspaceId?: string;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState("");
  const [collapsed, setCollapsed]   = useState(false);

  const { workspaces } = useWorkspaces();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const filteredWorkspaces = workspaces.filter(w =>
    w.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    const val = localStorage.getItem("sidebar-collapsed");
    if (val === "true") setCollapsed(true);
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>

      {/* Mobile close */}
      <button type="button" onClick={onClose} className="sidebar-mobile-close" aria-label="Close menu">
        <X className="h-4 w-4" />
      </button>

      {/* Desktop collapse toggle */}
      <button type="button" onClick={toggleCollapse} className="sidebar-toggle-btn"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Brand row */}
      {collapsed ? (
        <div className="flex justify-center w-full py-2 mb-2">
          <Link href="/dashboard"
            className="brand-mark flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm text-[var(--accent)] bg-[var(--accent-soft)] hover:scale-105 transition no-underline">
            T
          </Link>
        </div>
      ) : (
        <div className="brand-row">
          <button type="button" onClick={() => setSearchOpen(v => !v)} className="brand-mark" title="Search workspaces">
            <Search className="h-4 w-4" />
          </button>
          {searchOpen ? (
            <input className="sidebar-search" placeholder="Search workspaces" value={query}
              autoFocus onChange={e => setQuery(e.target.value)} />
          ) : (
            <Link href="/dashboard" className="brand-title">ThinkLM</Link>
          )}
        </div>
      )}

      {/* New workspace + theme */}
      <div className="sidebar-controls">
        <Link href="/dashboard" className="sidebar-action" title="New workspace" onClick={onClose}>
          <Plus className="h-4 w-4" />
          <span>New workspace</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Workspace list */}
      <div className="nav-label">Workspaces</div>
      <nav className="sidebar-nav">
        {workspaces.length === 0 ? (
          <p className="empty-state">{!collapsed && "No workspaces yet."}</p>
        ) : filteredWorkspaces.length === 0 ? (
          <p className="empty-state">{!collapsed && "No matches."}</p>
        ) : (
          <div className="space-y-1">
            {filteredWorkspaces.map(w => (
              <Link key={w.id} href={`/workspace/${w.id}`} className={`workspace-link ${w.id === workspaceId ? "workspace-link-active" : ""}`}
                title={w.name} onClick={onClose}>
                <Folder className="h-4 w-4 flex-shrink-0" />
                <span>{w.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>



      {/* Logout */}
      <button onClick={handleLogout} className="secondary-button danger-hover mt-auto w-full" title="Logout">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
