"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Incorrect password. Please try again.");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent">
          First Read
        </p>
        <h1 className="mt-2 text-xl font-semibold text-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-muted">
          Enter the shared password to access the portal.
        </p>

        <label className="block mt-6">
          <span className="text-sm font-medium text-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-triage-full" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting || !password}
          className="mt-6 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
