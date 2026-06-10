"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut, Plus, Search, Folder,
  ChevronLeft, ChevronRight, X,
  FileText, Trash2, Upload,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useWorkspaces } from "./WorkspaceProvider";
import ThemeToggle from "./ThemeToggle";
import { getDocuments, deleteDocument, uploadDocument } from "../services/document";

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

  // ── document state (only when workspaceId is given) ──────────
  const [docs, setDocs]             = useState<DocItem[]>([]);
  const [file, setFile]             = useState<File | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const val = localStorage.getItem("sidebar-collapsed");
    if (val === "true") setCollapsed(true);
  }, []);

  const { workspaces } = useWorkspaces();
  const router = useRouter();

  // ── load docs when workspace changes ─────────────────────────
  const loadDocs = useCallback(async () => {
    if (!workspaceId) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await getDocuments(workspaceId, token);
      setDocs(res.data || []);
    } catch { /* silent */ }
  }, [workspaceId]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const handleUpload = async () => {
    if (!file || !workspaceId) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    if (file.type !== "application/pdf") { alert("Only PDFs allowed."); return; }
    try {
      setUploading(true);
      await uploadDocument(file, workspaceId, token);
      setFile(null);
      loadDocs();
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      alert(msg || "Upload failed.");
    } finally { setUploading(false); }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setDeletingId(docId);
      await deleteDocument(docId, token);
      loadDocs();
    } catch { alert("Delete failed."); }
    finally { setDeletingId(null); }
  };

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

  const showDocs = !!workspaceId && !collapsed;

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

      {/* ── Documents section (only when inside a workspace) ── */}
      {showDocs && (
        <div className="sidebar-docs">
          <div className="nav-label" style={{ marginTop: 0 }}>Documents</div>

          {/* Upload row */}
          <label className="sidebar-upload-label">
            <input type="file" accept="application/pdf,.pdf" className="sr-only"
              onChange={e => setFile(e.target.files?.[0] || null)} />
            <span className="sidebar-upload-pick">
              <FileText className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{file ? file.name : "Choose PDF…"}</span>
            </span>
          </label>

          <button onClick={handleUpload} disabled={uploading || !file} className="primary-button w-full" style={{ marginTop: 6 }}>
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Upload"}
          </button>

          {/* File list */}
          <div className="space-y-1" style={{ marginTop: 8 }}>
            {docs.length === 0 ? (
              <p className="empty-state">No documents yet.</p>
            ) : docs.map(doc => (
              <div key={doc.id} className="sidebar-doc-row">
                <FileText className="h-3.5 w-3.5 flex-shrink-0 text-[var(--accent)]" />
                <span className="min-w-0 flex-1 truncate text-[13px]">{doc.filename}</span>
                <button type="button" disabled={deletingId === doc.id}
                  onClick={() => handleDelete(doc.id)} className="danger-icon-button" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout} className="secondary-button danger-hover mt-auto w-full" title="Logout">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
