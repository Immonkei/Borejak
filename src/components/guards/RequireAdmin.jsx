"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAdmin({ children }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // ❌ Logged in but NOT admin
    if (!isAdmin) {
      router.replace("/unauthorized");
      return;
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading || !isAuthenticated || !isAdmin) return null;

  return children;
}
