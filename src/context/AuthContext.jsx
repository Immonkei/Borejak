"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session (guest-first)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (!stored) return;

      const data = JSON.parse(stored);
      if (data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 Login
  async function login(data) {
    const token = data.token || data.data?.token;
    const userData = data.user || data.data?.user;

    setToken(token);
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify({ token, user: userData }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) return userData;

      const { user: profile } = await res.json();

      const completed = Boolean(
        profile?.full_name &&
        profile?.blood_type &&
        profile?.date_of_birth &&
        profile?.gender
      );

      const mergedUser = { ...profile, profile_completed: completed };

      setUser(mergedUser);
      localStorage.setItem("auth", JSON.stringify({ token, user: mergedUser }));

      return mergedUser;
    } catch {
      return userData;
    }
  }

  // 🚪 Logout
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth");
  }

  // 🔄 Update user
  function updateUser(updatedUser) {
    setUser(updatedUser);

    const stored = JSON.parse(localStorage.getItem("auth"));
    if (!stored?.token) return;

    localStorage.setItem(
      "auth",
      JSON.stringify({ token: stored.token, user: updatedUser })
    );
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,

        // derived
        isAuthenticated: !!user,
        role: user?.role ?? null,
        isAdmin: user?.role === "admin",

        // actions
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
