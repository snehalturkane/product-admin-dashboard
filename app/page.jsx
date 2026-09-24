"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoggedOutPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (seconds <= 0) {
      router.replace("/login");
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-accent/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 animate-pulse rounded-full bg-[#2D3B55]/30 blur-3xl [animation-delay:1s]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/4 h-32 w-32 -translate-x-1/2 animate-pulse rounded-full bg-good/15 blur-3xl [animation-delay:2s]" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-line bg-white/90 p-8 text-center shadow-2xl shadow-ink/15 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-good/20" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-good to-good/70 shadow-lg shadow-good/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <h1 className="mt-5 bg-gradient-to-r from-ink to-ink/60 bg-clip-text text-xl font-semibold tracking-tight text-transparent">
          You've been logged out
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Thanks for using Product Admin. Redirecting to login in {seconds}...
        </p>

        <div className="mx-auto mt-5 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accentDark transition-all duration-1000 ease-linear"
            style={{ width: `${(seconds / 3) * 100}%` }}
          />
        </div>

        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-accent to-accentDark px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
        >
          Back to login now
        </Link>
      </div>
    </main>
  );
}