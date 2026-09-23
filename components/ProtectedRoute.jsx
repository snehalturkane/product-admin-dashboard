"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";

// Wrap any page that should only be visible when logged in. The token lives
// in localStorage (not a cookie), so this check has to run on the client -
// there is no server-rendered session to check in middleware.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loader label="Checking your session..." />;
  }

  return children;
}
