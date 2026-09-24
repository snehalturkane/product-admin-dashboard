"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M6.5 6.7C4 8.3 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.4 4.7-1.1M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7s-.8 1.5-2.3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FEATURES = [
  { title: "Instant search & filters", body: "Find any product in the catalog in seconds." },
  { title: "Full CRUD control", body: "Add, edit and delete products with confidence." },
  { title: "Built for real workflows", body: "Pagination, sorting and URL state, done right." },
];

function ForgotPasswordModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-base font-semibold text-ink">Forgot password?</h2>
        <p className="mt-2 text-sm text-ink/70">
          This app signs in against the public DummyJSON test API, which doesn't support real password resets.
        </p>
        <p className="mt-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 px-4 py-3 text-xs text-ink/70">
          Username: <span className="font-mono font-semibold text-ink">emilys</span>
          <br />
          Password: <span className="font-mono font-semibold text-ink">emilyspass</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink/90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/products");
  }, [loading, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-10 lg:px-0">
      {/* Living, breathing background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-accent/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 animate-pulse rounded-full bg-[#2D3B55]/30 blur-3xl [animation-delay:1s]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 animate-pulse rounded-full bg-good/10 blur-3xl [animation-delay:2s]" />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl border border-line bg-white/90 shadow-2xl shadow-ink/15 backdrop-blur-xl lg:grid-cols-2">
        {/* Left: brand / feature panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#1B2430] via-[#243247] to-[#2D3B55] p-10 text-white lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-pulse rounded-full bg-accent/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 animate-pulse rounded-full bg-good/15 blur-3xl [animation-delay:1.5s]" />

          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accentDark text-sm font-bold text-white shadow-lg shadow-accent/40 transition-transform hover:scale-110">
                P
              </span>
              <span className="text-lg font-semibold tracking-tight">Product Admin</span>
            </div>
            <h2 className="mt-10 bg-gradient-to-r from-white to-white/60 bg-clip-text text-2xl font-semibold leading-snug tracking-tight text-transparent">
              Manage your entire catalog from one clean dashboard.
            </h2>
            <p className="mt-3 text-sm text-white/60">
              Search, filter, sort and edit — all in a few clicks.
            </p>
          </div>

          <ul className="relative mt-10 flex flex-col gap-5">
            {FEATURES.map((f, i) => (
              <li
                key={f.title}
                className="flex gap-3 transition-transform hover:translate-x-1"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/25 text-accent ring-1 ring-accent/40">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{f.title}</p>
                  <p className="text-xs text-white/55">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: the form */}
        <div className="p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accentDark text-sm font-bold text-white shadow-lg shadow-accent/30">
              P
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">Product Admin</span>
          </div>

          <h1 className="bg-gradient-to-r from-ink to-ink/60 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink/60">Log in to manage your products.</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm transition-all focus:border-accent focus:shadow-md focus:shadow-accent/10"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-ink">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-medium text-accent transition-colors hover:text-accentDark hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 pr-11 text-sm text-ink shadow-sm transition-all focus:border-accent focus:shadow-md focus:shadow-accent/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink/40 transition-colors hover:text-accent"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="flex items-center gap-2 rounded-xl bg-bad/5 px-3 py-2.5 text-sm text-bad ring-1 ring-bad/20">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="0.9" fill="currentColor" />
                </svg>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accentDark px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {submitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 rounded-xl bg-paper px-3.5 py-2.5 text-xs text-ink/50">
            Demo credentials: <span className="font-mono font-medium text-ink/70">emilys</span> /{" "}
            <span className="font-mono font-medium text-ink/70">emilyspass</span>
          </p>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </main>
  );
}