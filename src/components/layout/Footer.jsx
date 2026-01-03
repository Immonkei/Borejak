"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Droplet,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Send,
  CheckCircle,
  AlertCircle,
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
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-red-600 to-purple-600 p-2 rounded-xl">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Borejak</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Borejak is a blood donation platform that connects donors,
            hospitals, and people in need to save lives together.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white">
                Events
              </Link>
            </li>
            <li>
              <Link href="/blood-market" className="hover:text-white">
                Blood Market
              </Link>
            </li>
            <li>
              <Link href="/hospitals" className="hover:text-white">
                Hospitals
              </Link>
            </li>
            <li>
              <Link href="/tips" className="hover:text-white">
                Donation Tips
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              Phnom Penh, Cambodia
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500" />
              +855 12 345 678
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500" />
              support@borejak.com
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Subscribe Newsletter
          </h4>
          <p className="text-sm text-slate-400 mb-3">
            Get updates about blood donation events and campaigns.
          </p>

          {success && (
            <div className="mb-3 flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Subscribed successfully
            </div>
          )}

          {error && (
            <div className="mb-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-purple-600 px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Borejak. All rights reserved.
      </div>
    </footer>
  );
}
