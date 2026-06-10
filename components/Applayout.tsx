"use client";

import Sidebar from "./Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <Sidebar />
        <main className="app-main">
          <div className="app-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
