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
  Award,
  ChevronDown,
  Droplet,
  MessageCircle,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;
  if (pathname === "/complete-profile") return null;
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Link styles - dark text on white background
  const base =
    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-2";
  const active =
    "bg-red-600 text-white shadow-lg shadow-red-500/30";
  const inactive =
    "text-slate-600 hover:text-red-600 hover:bg-red-50";

  const navItem = (path) => `${base} ${pathname === path ? active : inactive}`;

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-lg shadow-slate-200/50 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Now stands out on white background */}
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="/photo_2025-10-28_11-17-55-removebg-preview.png"
              alt="BloodBank Logo"
              className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
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
            <div className="relative ml-4 pl-4 border-l border-slate-200">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden lg:block max-w-[100px] truncate">
                  {user?.email?.split("@")[0]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-4 bg-gradient-to-r from-red-500 to-rose-500">
                    <p className="text-sm font-semibold text-white">
                      Signed in as
                    </p>
                    <p className="text-sm text-red-100 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Your Profile
                    </Link>
                    <Link
                      href="/profile/donations"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Droplet className="w-4 h-4" />
                      My Donations
                    </Link>
                    <Link
                      href="/profile/benefits"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      My Benefits
                    </Link>
                    <Link
                      href="/profile/testimonials"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      My Testimonials
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
            className="md:hidden text-slate-700 hover:bg-red-50 hover:text-red-600 p-2 rounded-xl transition-all duration-300"
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
          open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        } bg-white border-t border-slate-100`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            className={`${navItem("/")} w-full`}
            onClick={() => setOpen(false)}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/blood-market"
            className={`${navItem("/blood-market")} w-full`}
            onClick={() => setOpen(false)}
          >
            <Heart className="w-4 h-4" />
            Blood Market
          </Link>
          <Link
            href="/hospitals"
            className={`${navItem("/hospitals")} w-full`}
            onClick={() => setOpen(false)}
          >
            <Building2 className="w-4 h-4" />
            Hospitals
          </Link>
          <Link
            href="/events"
            className={`${navItem("/events")} w-full`}
            onClick={() => setOpen(false)}
          >
            <Calendar className="w-4 h-4" />
            Events
          </Link>
          <Link
            href="/tips"
            className={`${navItem("/tips")} w-full`}
            onClick={() => setOpen(false)}
          >
            <Lightbulb className="w-4 h-4" />
            Tips
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-200">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-4 mb-4">
              <p className="text-xs text-red-100 mb-1">Signed in as</p>
              <p className="text-sm text-white font-medium truncate">
                {user?.email}
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/profile"
                className={`${navItem("/profile")} w-full`}
                onClick={() => setOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                href="/profile/donations"
                className={`${navItem("/profile/donations")} w-full`}
                onClick={() => setOpen(false)}
              >
                <Heart className="w-4 h-4" />
                My Donations
              </Link>
              <Link
                href="/profile/benefits"
                className={`${navItem("/profile/benefits")} w-full`}
                onClick={() => setOpen(false)}
              >
                <Heart className="w-4 h-4" />
                My Benefits
              </Link>
              <Link
                href="/profile/testimonials"
                className={`${navItem("/profile/testimonials")} w-full`}
                onClick={() => setOpen(false)}
              >
                <Heart className="w-4 h-4" />
                My Testimonials
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`${navItem("/admin")} w-full`}
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
                className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
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

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
}