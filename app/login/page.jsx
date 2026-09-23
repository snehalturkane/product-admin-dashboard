"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Skip straight to the dashboard.
  useEffect(() => {
    if (!loading && user) router.replace("/products");
  }, [loading, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();

    // A guard so clicking "Log in" repeatedly can't fire multiple requests.
    if (submitting) return;

    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.replace("/products");
    } catch (err) {
      setError(err.normalizedMessage || "Invalid username or password.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-ink">Product Admin</h1>
        <p className="mt-1 text-sm text-ink/60">Log in to manage products.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-ink">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-bad">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-xs text-ink/50">
          Demo credentials: <span className="font-mono">emilys</span> /{" "}
          <span className="font-mono">emilyspass</span>
        </p>
      </div>
    </main>
  );
}
