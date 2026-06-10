"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signup } from "../../services/auth";
import ThemeToggle from "../../components/ThemeToggle";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || password.length < 8) {
      alert("Enter your name, email, and a password with at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await signup(name.trim(), email.trim(), password);
      alert("Signup successful. Please log in.");
      router.push("/login");
    } catch (error) {
      console.log(error);
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      alert(message || "Signup failed. Please try again.");
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
        <h1 className="mt-2 text-2xl font-bold text-[var(--text)]">Create account</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Start organizing documents into research workspaces.
        </p>

        <div className="mt-5 space-y-3">
          <input
            className="field"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

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
            onClick={handleSignup}
            className="primary-button w-full"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--accent)] no-underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
