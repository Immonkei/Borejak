"use client";

import { useEffect, useState } from "react";
import { getPublicTestimonials } from "@/services/testimonials";
import { Star, Quote, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPublicTestimonials();
        setItems(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-red-200 border-t-red-600 rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Stories That Save Lives ❤️
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl">
          Hear from donors and patients whose lives were changed through blood donation.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-slate-600">
              No testimonials yet. Be the first to share your story ❤️
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition relative"
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-red-500 absolute -top-4 left-6 bg-white rounded-full p-1" />

                {/* Content */}
                <p className="text-slate-700 leading-relaxed italic mb-6">
                  “{t.content}”
                </p>

                {/* User */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.users?.avatar_url || "/avatar.png"}
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {t.users?.full_name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
