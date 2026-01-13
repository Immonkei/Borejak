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
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;
  if (pathname === "/complete-profile") return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    setProfileOpen(false);
    router.replace("/login");
  };

  const requireLogin = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert("Please login first to access this feature.");
      router.push("/login");
      return;
    }
    setOpen(false);
    router.push(path);
  };

  const base =
    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-2";
  const active = "bg-red-600 text-white shadow-lg shadow-red-500/30";
  const inactive =
    "text-slate-600 hover:text-red-600 hover:bg-red-50";

  const navItem = (path) =>
    `${base} ${pathname === path ? active : inactive}`;

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-lg shadow-slate-200/50 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="/photo_2025-10-28_11-17-55-removebg-preview.png"
              alt="BloodBank Logo"
              className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className={navItem("/")}>
              <Home className="w-4 h-4" /> Home
            </Link>

            <Link
              href="/blood-market"
              onClick={(e) => requireLogin(e, "/blood-market")}
              className={navItem("/blood-market")}
            >
              <Heart className="w-4 h-4" /> Blood Market
            </Link>

            <Link href="/hospitals" className={navItem("/hospitals")}>
              <Building2 className="w-4 h-4" /> Hospitals
            </Link>

            <Link href="/events" className={navItem("/events")}>
              <Calendar className="w-4 h-4" /> Events
            </Link>

            <Link href="/tips" className={navItem("/tips")}>
              <Lightbulb className="w-4 h-4" /> Tips
            </Link>

            {/* Desktop Profile Dropdown */}
            {user && (
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

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
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
                        onClick={(e) => requireLogin(e, "/profile")}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50"
                      >
                        <User className="w-4 h-4" /> Your Profile
                      </Link>

                      <Link
                        href="/profile/donations"
                        onClick={(e) =>
                          requireLogin(e, "/profile/donations")
                        }
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50"
                      >
                        <Droplet className="w-4 h-4" /> My Donations
                      </Link>

                      <Link
                        href="/profile/benefits"
                        onClick={(e) =>
                          requireLogin(e, "/profile/benefits")
                        }
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50"
                      >
                        <Award className="w-4 h-4" /> My Benefits
                      </Link>

                      <Link
                        href="/profile/testimonials"
                        onClick={(e) =>
                          requireLogin(e, "/profile/testimonials")
                        }
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50"
                      >
                        <MessageCircle className="w-4 h-4" /> My Testimonials
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50"
                        >
                          <Settings className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-red-50"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown (FULL) */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-[900px]" : "max-h-0"
        } bg-white border-t`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2">
          <Link href="/" className={`${navItem("/")} w-full`}>
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link
            href="/blood-market"
            onClick={(e) => requireLogin(e, "/blood-market")}
            className={`${navItem("/blood-market")} w-full`}
          >
            <Heart className="w-4 h-4" /> Blood Market
          </Link>

          <Link href="/hospitals" className={`${navItem("/hospitals")} w-full`}>
            <Building2 className="w-4 h-4" /> Hospitals
          </Link>

          <Link href="/events" className={`${navItem("/events")} w-full`}>
            <Calendar className="w-4 h-4" /> Events
          </Link>

          <Link href="/tips" className={`${navItem("/tips")} w-full`}>
            <Lightbulb className="w-4 h-4" /> Tips
          </Link>

          {user && (
            <div className="pt-4 mt-4 border-t space-y-2">
              <Link
                href="/profile"
                onClick={(e) => requireLogin(e, "/profile")}
                className={`${base} w-full ${inactive}`}
              >
                <User className="w-4 h-4" /> Your Profile
              </Link>

              <Link
                href="/profile/donations"
                onClick={(e) =>
                  requireLogin(e, "/profile/donations")
                }
                className={`${base} w-full ${inactive}`}
              >
                <Droplet className="w-4 h-4" /> My Donations
              </Link>

              <Link
                href="/profile/benefits"
                onClick={(e) =>
                  requireLogin(e, "/profile/benefits")
                }
                className={`${base} w-full ${inactive}`}
              >
                <Award className="w-4 h-4" /> My Benefits
              </Link>

              <Link
                href="/profile/testimonials"
                onClick={(e) =>
                  requireLogin(e, "/profile/testimonials")
                }
                className={`${base} w-full ${inactive}`}
              >
                <MessageCircle className="w-4 h-4" /> My Testimonials
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`${base} w-full ${inactive}`}
                >
                  <Settings className="w-4 h-4" /> Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
