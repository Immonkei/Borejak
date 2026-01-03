"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuthAndProfile({ children }) {
  const { loading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // ❌ Logged in but profile NOT completed
    if (
      user &&
      user.profile_completed === false &&
      pathname !== "/complete-profile"
    ) {
      router.replace("/complete-profile");
      return;
    }

    // ❌ Profile completed but trying to access complete-profile again
    if (
      user?.profile_completed === true &&
      pathname === "/complete-profile"
    ) {
      router.replace("/profile");
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) return null;

  return children;
}
