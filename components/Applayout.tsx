"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";

export default function AppLayout({
  children,
  workspaceId,
}: {
  children: React.ReactNode;
  workspaceId?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const open  = useCallback(() => setMobileOpen(true), []);
  const close = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="app-shell">
      {/* ── Mobile top header (hidden on desktop) ── */}
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-hamburger"
          aria-label="Open menu"
          onClick={open}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo size={26} showText showIcon={false} />
      </header>

      <div className="app-frame">
        {/* ── Backdrop (mobile only) ── */}
        {mobileOpen && (
          <div
            className="sidebar-backdrop"
            aria-hidden="true"
            onClick={close}
          />
        )}

        {/* ── Sidebar ── */}
        <Sidebar mobileOpen={mobileOpen} onClose={close} workspaceId={workspaceId} />

        {/* ── Main content ── */}
        <main className="app-main">
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
