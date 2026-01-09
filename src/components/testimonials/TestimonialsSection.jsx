"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Quote, ArrowRight, Heart, MessageCircle } from "lucide-react";
import { getPublicTestimonials } from "@/services/testimonials";

// Default Avatar SVG Component
function DefaultAvatar() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="38"
        r="18"
        stroke="#DC2626"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M18 88C18 65 30 52 50 52C70 52 82 65 82 88"
        stroke="#DC2626"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Avatar component that handles both cases
function UserAvatar({ user }) {
  const [imageError, setImageError] = useState(false);
  const avatarUrl = user?.avatar_url;

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt="User avatar"
        className="w-full h-full object-cover block"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <DefaultAvatar />
    </div>
  );
}

export default function TestimonialsSection() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPublicTestimonials();
        setTestimonials((res.data || []).slice(0, 3));
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
      <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 mt-4 font-medium">
              Loading stories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-red-100 text-red-600 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-sm">
            <Heart className="w-4 h-4 fill-red-500" />
            Real Stories
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            What Our Donors Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hear from the heroes who are making a difference in their
            communities.
          </p>
        </div>

        {/* Testimonials Grid - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-red-200/40 transition-all duration-300 hover:-translate-y-1 border border-slate-100 flex flex-col"
            >
              {/* Quote Icon - Top */}
              <div className="mb-6">
                <Quote className="w-12 h-12 text-red-500" />
              </div>

              {/* Content */}
              <p className="text-slate-700 leading-relaxed text-base mb-8 flex-1 italic">
                "{t.content}"
              </p>

              {/* User Info - Bottom */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="w-50 h-50 rounded-full overflow-hidden bg-red-50 border-2 border-red-200 flex items-center justify-center shrink-0">
                  <UserAvatar user={t.users} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="font-bold text-slate-900 text-base leading-tight">
                    {t.users?.full_name || "Anonymous Donor"}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-200 fill-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/testimonials")}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 text-base"
          >
            <MessageCircle className="w-5 h-5" />
            View All Stories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
