"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Droplet,
  Lightbulb,
  Mail,
  LogOut,
  Menu,
  X,
  Heart,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  // 🔒 ADMIN LOGIC (ONLY LOGIC CHANGE)
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/unauthorized"); // or /403
    }
  }, [loading, user, router]);

  // prevent UI flicker
  if (loading || !user || user.role !== "admin") {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/hospitals", label: "Hospitals", icon: Building2 },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/donations", label: "Donations", icon: Heart },
    { href: "/admin/tips", label: "Tips", icon: Lightbulb },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/blood-market", label: "Blood Market", icon: Droplet },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  ];

  const isActive = (href) => {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-red-600 text-white p-2 rounded-xl shadow-lg shadow-red-500/30"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          flex flex-col shadow-2xl
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl p-1 shadow-lg">
              <img
                src="/photo_2025-10-28_11-17-55-removebg-preview.png"
                alt="BloodBank Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-slate-400">Management Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? "" : "opacity-70"}`} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-0 w-full">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
