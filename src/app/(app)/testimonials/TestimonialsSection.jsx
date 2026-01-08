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
      width="40"
      height="40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="30" r="14" stroke="#DC2626" strokeWidth="6" fill="none"/>
      <path d="M12 85C12 65 25 55 40 55C55 55 68 65 68 85" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <rect x="55" y="15" width="35" height="28" rx="6" stroke="#DC2626" strokeWidth="5" fill="none"/>
      <circle cx="65" cy="29" r="2" fill="#DC2626"/>
      <circle cx="73" cy="29" r="2" fill="#DC2626"/>
      <circle cx="81" cy="29" r="2" fill="#DC2626"/>
      <path d="M60 43L55 52L68 43" fill="#DC2626"/>
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
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  }
  
  return <DefaultAvatar />;
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
      <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 mt-4">Loading stories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Heart className="w-4 h-4 fill-red-500" />
            Real Stories
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            What Our Donors Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hear from the heroes who are making a difference in their communities.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-red-200/30 transition-all duration-500 relative hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <p className="text-slate-700 leading-relaxed mt-4 mb-6 line-clamp-4 italic">
                "{t.content}"
              </p>

              {/* User */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden bg-red-50">
                  <UserAvatar user={t.users} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">
                    {t.users?.full_name || "Anonymous Donor"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                      <Star
                        key={`empty-${i}`}
                        className="w-4 h-4 text-slate-200"
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
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300"
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