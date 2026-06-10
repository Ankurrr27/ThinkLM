"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";

import {
  askQuestion,
  getChatHistory,
} from "../services/chat";
import MessageBubble from "./MessageBubbles";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!workspaceId) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoadingHistory(true);
        const response = await getChatHistory(workspaceId, token);
        setMessages(response.data || []);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [workspaceId]);

  const handleAsk = async () => {
    if (!workspaceId) {
      alert("Workspace ID is required to ask questions.");
      return;
    }

    if (!question.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    const currentQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const response = await askQuestion(
        currentQuestion,
        workspaceId,
        token
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer || "No answer received.",
        },
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An error occurred while generating the answer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="chat-window">
        {loadingHistory ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-[var(--muted)]">Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-sm font-medium text-[var(--text)]">
                Ask your first question
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Answers are generated from documents in this workspace.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
            />
          ))
        )}

        {loading && (
          <div className="message-bubble message-assistant">
            Thinking...
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question..."
          rows={2}
          className="field textarea-field"
        />

        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          title="Send question"
          className="icon-button self-end"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
