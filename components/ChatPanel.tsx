"use client";

import { useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="chat-panel-root">
      <div className="chat-window">
        {loadingHistory ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-[var(--muted)]">Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4 py-8">
            <div className="empty-chat-icon-wrapper">
              <Sparkles className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <h3 className="empty-chat-title">ThinkLM Research Assistant</h3>
            <p className="empty-chat-subtitle">
              Ask questions, analyze concepts, or extract insights grounded in your workspace documents.
            </p>
            <div className="empty-chat-suggestions">
              <button
                type="button"
                className="suggestion-pill"
                onClick={() => setQuestion("Summarize the key findings in this document.")}
              >
                Summarize document findings
              </button>
              <button
                type="button"
                className="suggestion-pill"
                onClick={() => setQuestion("What are the core technologies or concepts discussed?")}
              >
                What are the core concepts discussed?
              </button>
              <button
                type="button"
                className="suggestion-pill"
                onClick={() => setQuestion("Analyze the strengths and limitations mentioned.")}
              >
                Analyze strengths & limitations
              </button>
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
          <div className="chat-thinking-indicator">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
          </div>
        )}
      </div>

      {/* ── Premium bottom input bar ── */}
      <div className="chat-input-bar">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…"
          rows={1}
          className="chat-input-textarea"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          aria-label="Send"
          className="chat-send-btn"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
