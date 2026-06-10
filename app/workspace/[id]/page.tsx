"use client";

import { use } from "react";
import AppLayout from "../../../components/Applayout";
import ChatPanel from "../../../components/ChatPanel";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AppLayout workspaceId={id}>
      {/* Chat fills the full content area — docs live in the sidebar */}
      <div className="workspace-chat-wrap">
        <ChatPanel workspaceId={id} />
      </div>
    </AppLayout>
  );
}
