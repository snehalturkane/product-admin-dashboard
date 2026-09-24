"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "./ConfirmModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleLogoutConfirmed() {
    logout();
    setShowConfirm(false);
    router.push("/logout");
  }

  return (
    <>
      <header className="bg-gradient-to-r from-[#1B2430] via-[#212C3D] to-[#2D3B55] text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/products" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
              P
            </span>
            <span className="text-lg font-semibold tracking-tight">Product Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {user && (
              <span className="hidden text-white/60 sm:inline">
                Signed in as <span className="font-medium text-white">{user.username}</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded-lg border border-white/25 px-3 py-1.5 font-medium transition-colors hover:bg-white/10"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <ConfirmModal
        open={showConfirm}
        title="Log out of Product Admin?"
        message="You'll need to sign in again to manage products."
        confirmLabel="Log out"
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}