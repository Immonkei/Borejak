"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Heart,
  Building2,
  Calendar,
  Lightbulb,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  if (pathname === "/complete-profile") {
    return null;
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Shared link styles
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 inline-flex items-center gap-2";
  const active =
    "bg-accent text-secondary shadow-lg shadow-accent/30 scale-105 font-semibold";
  const inactive =
    "text-primary hover:text-white hover:bg-white/10 backdrop-blur-sm";

  const navItem = (path) => `${base} ${pathname === path ? active : inactive}`;

  return (
    <header className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-lg shadow-2xl z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="/photo_2025-10-28_11-17-55-removebg-preview.png"
              alt="BloodBank Logo"
              className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className={navItem("/")}>
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/blood-market" className={navItem("/blood-market")}>
              <Heart className="w-4 h-4" />
              Blood Market
            </Link>
            <Link href="/hospitals" className={navItem("/hospitals")}>
              <Building2 className="w-4 h-4" />
              Hospitals
            </Link>
            <Link href="/events" className={navItem("/events")}>
              <Calendar className="w-4 h-4" />
              Events
            </Link>
            <Link href="/tips" className={navItem("/tips")}>
              <Lightbulb className="w-4 h-4" />
              Tips
            </Link>

            {/* Profile Dropdown */}
            <div className="relative ml-4 pl-4 border-l border-white/20">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden lg:block">
                  {user?.email?.split("@")[0]}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      href="/profile/donations"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      My Donations
                    </Link>
                    <Link
                      href="/profile/benefits"
                      className={navItem("/profile/benefits")}
                      onClick={() => setOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      My Benefits
                    </Link>
                    <Link
                      href="/profile/testimonials"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-pink-500" />
                      My Testimonials
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {!open ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        } bg-red-700/95 backdrop-blur-sm`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            className={navItem("/")}
            onClick={() => setOpen(false)}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/blood-market"
            className={navItem("/blood-market")}
            onClick={() => setOpen(false)}
          >
            <Heart className="w-4 h-4" />
            Blood Market
          </Link>
          <Link
            href="/hospitals"
            className={navItem("/hospitals")}
            onClick={() => setOpen(false)}
          >
            <Building2 className="w-4 h-4" />
            Hospitals
          </Link>
          <Link
            href="/events"
            className={navItem("/events")}
            onClick={() => setOpen(false)}
          >
            <Calendar className="w-4 h-4" />
            Events
          </Link>
          <Link
            href="/tips"
            className={navItem("/tips")}
            onClick={() => setOpen(false)}
          >
            <Lightbulb className="w-4 h-4" />
            Tips
          </Link>

          <div className="pt-4 mt-4 border-t border-white/20">
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <p className="text-xs text-white/70 mb-1">Signed in as</p>
              <p className="text-sm text-white font-medium truncate">
                {user?.email}
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/profile"
                className={navItem("/profile")}
                onClick={() => setOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                href="/profile/donations"
                className={navItem("/profile/donations")}
                onClick={() => setOpen(false)}
              >
                <Heart className="w-4 h-4" />
                My Donations
              </Link>
              <Link
                href="/profile/benefits"
                className={navItem("/profile/benefits")}
                onClick={() => setOpen(false)}
              >
                <Heart className="w-4 h-4" />
                My Benefits
              </Link>
              <Link
                href="/profile/testimonials"
                className={navItem("/profile/testimonials")}
                onClick={() => setOpen(false)}
              >
                <Heart className="w-4 h-4" />
                My Testimonials
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={navItem("/admin")}
                  onClick={() => setOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </header>
  );
}
