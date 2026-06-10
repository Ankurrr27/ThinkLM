"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function AppLayout({
  children,
  workspaceId,
  rightPanel,
}: {
  children: React.ReactNode;
  workspaceId?: string;
  rightPanel?: React.ReactNode;
}) {
  const [leftOpen, setLeftOpen] = useState(false);

  const openLeft  = useCallback(() => setLeftOpen(true), []);
  const closeLeft = useCallback(() => setLeftOpen(false), []);

  return (
    <div className="app-shell">
      {/* ── Mobile top header (hidden on desktop) ── */}
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-hamburger"
          aria-label="Open navigation"
          onClick={openLeft}
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="mobile-header-title">ThinkLM</span>

        {/* Right slot injected by workspace page for docs drawer trigger */}
        <div className="mobile-header-right">
          {rightPanel}
        </div>
      </header>

      <div className="app-frame">
        {/* ── Left sidebar backdrop (mobile only) ── */}
        {leftOpen && (
          <div
            className="sidebar-backdrop"
            aria-hidden="true"
            onClick={closeLeft}
          />
        )}

        {/* ── Left Sidebar ── */}
        <Sidebar mobileOpen={leftOpen} onClose={closeLeft} workspaceId={workspaceId} />

        {/* ── Main content ── */}
        <main className="app-main">
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
