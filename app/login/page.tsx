"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { login } from "../../services/auth";
import ThemeToggle from "../../components/ThemeToggle";
import { useWorkspaces } from "../../components/WorkspaceProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { refreshWorkspaces } = useWorkspaces();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email.trim(), password);

      localStorage.setItem("token", data.data.token);
      await refreshWorkspaces();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      alert(message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="auth-card">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
          AI Research
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--text)]">Login</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Continue to your premium research workspace.
        </p>

        <div className="mt-5 space-y-3">
          <input
            className="field"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            className="field"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            disabled={loading}
            onClick={handleLogin}
            className="primary-button w-full"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-[var(--accent)] no-underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
