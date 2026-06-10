"use client";

import Sidebar from "./Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="h-screen flex">

      <Sidebar />

      <div
        className="
          flex-1
          bg-slate-950
          text-white
          p-6
          overflow-auto
        "
      >
        {children}
      </div>

    </div>
  );
}