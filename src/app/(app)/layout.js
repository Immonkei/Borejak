"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppLayout({ children }) {
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

  // 🔒 Admins never use app layout
  if (user?.role === "admin") {
    router.replace("/admin");
    return;
  }

  // ⚠️ ONLY redirect when backend explicitly says false
  if (user?.profile_completed === false) {
    if (pathname !== "/complete-profile") {
      router.replace("/complete-profile");
    }
  }
}, [loading, isAuthenticated, user, pathname, router]);


  if (loading) {
    return <div className="p-6 text-center">Loading…</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
