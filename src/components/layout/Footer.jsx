"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Send,
  CheckCircle,
  AlertCircle,
  Heart,
} from "lucide-react";
import { subscribeNewsletter } from "@/services/newsletter";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError("");
      await subscribeNewsletter(email);
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/photo_2025-10-28_11-17-55-removebg-preview.png"
              alt="Borejak Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <h3 className="text-xl font-bold text-white">Borejak</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Borejak is a blood donation platform that connects donors,
            hospitals, and people in need to save lives together.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3 mt-5">
            <a 
              href="#" 
              className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-red-500 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-red-500 transition-colors">
                Events
              </Link>
            </li>
            <li>
              <Link href="/blood-market" className="hover:text-red-500 transition-colors">
                Blood Market
              </Link>
            </li>
            <li>
              <Link href="/hospitals" className="hover:text-red-500 transition-colors">
                Hospitals
              </Link>
            </li>
            <li>
              <Link href="/tips" className="hover:text-red-500 transition-colors">
                Donation Tips
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-red-500" />
              </div>
              <span>Phnom Penh, Cambodia</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-red-500" />
              </div>
              <span>+855 71 6249 197</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-red-500" />
              </div>
              <span>support@borejak.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Subscribe Newsletter
          </h4>
          <p className="text-sm text-slate-400 mb-4">
            Get updates about blood donation events and campaigns.
          </p>

          {success && (
            <div className="mb-3 flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              Subscribed successfully!
            </div>
          )}

          {error && (
            <div className="mb-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 px-5 py-3 rounded-xl text-white transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Borejak. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Cambodia
          </p>
        </div>
      </div>
    </footer>
  );
}