"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="border-b border-line bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-lg font-semibold tracking-tight">
          Product Admin
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user && <span className="text-white/70">Signed in as {user.username}</span>}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-white/30 px-3 py-1.5 font-medium hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
