"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { askQuestion } from "../../../services/chat";
import ThemeToggle from "../../../components/ThemeToggle";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!workspaceId.trim()) {
      alert("Please enter a workspace ID.");
      return;
    }

    if (!question.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);
      const res = await askQuestion(
        question.trim(),
        workspaceId.trim(),
        token
      );
      setAnswer(res.answer || "No answer returned.");
    } catch (error) {
      console.error(error);
      setAnswer("Unable to retrieve an answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="page-title">Workspace chat</h1>
            <p className="page-subtitle">
              Ask a question against a workspace by ID.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <section className="panel">
          <div className="panel-body space-y-3">
            <input
              className="field"
              placeholder="Workspace ID"
              value={workspaceId}
              onChange={(event) => setWorkspaceId(event.target.value)}
            />

            <textarea
              className="field textarea-field min-h-40"
              placeholder="Question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />

            <button
              onClick={handleAsk}
              disabled={loading}
              className="primary-button px-4"
            >
              <Send className="h-4 w-4" />
              {loading ? "Asking..." : "Ask"}
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Answer</h2>
          </div>
          <div className="panel-body">
            <p className="whitespace-pre-line text-sm leading-6 text-[var(--muted)]">
              {answer || "Your answer will appear here once the assistant responds."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
