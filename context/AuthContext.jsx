"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "@/lib/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` is true only while we check localStorage on first load, so we
  // don't briefly flash the login page for someone who is already signed in.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const rawUser = window.localStorage.getItem("authUser");
    if (token && rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        // Corrupt storage - ignore and stay logged out.
      }
    }
    setLoading(false);
  }, []);

  async function login(username, password) {
    const response = await loginRequest(username, password);
    const data = response.data;
    window.localStorage.setItem("token", data.accessToken);
    window.localStorage.setItem("authUser", JSON.stringify(data));
    setUser(data);
    return data;
  }

  function logout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("authUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
