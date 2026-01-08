"use client";

import { useEffect, useState } from "react";
import { getPublicTestimonials, createTestimonial } from "@/services/testimonials";
import { Star, Quote, ArrowLeft, Send, Heart, MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

export default function TestimonialsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    content: "",
    rating: 5,
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      const res = await getPublicTestimonials();
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.content.trim()) return;

    try {
      setSubmitting(true);
      await createTestimonial(formData);
      setSuccess(true);
      setFormData({ content: "", rating: 5 });
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
      loadTestimonials();
    } catch (err) {
      alert(err.message || "Failed to submit testimonial");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <Heart className="w-6 h-6 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-rose-600"></div>
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-5 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-all"
            >
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Back to Home</span>
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black">
                Stories That Save Lives
              </h1>
              <span className="text-4xl">❤️</span>
            </div>
            
            <p className="text-xl text-red-100 max-w-3xl">
              Hear from donors and patients whose lives were changed through blood donation.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">{items.length} Stories</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">5.0 Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Share Your Story Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Share Your Story 💖
              </h2>
              <p className="text-slate-600">
                Your experience can inspire others to donate blood and save lives.
              </p>
            </div>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Write a Testimonial
              </button>
            )}
          </div>

          {/* Testimonial Form */}
          {showForm && (
            <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in-up">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You! 🎉</h3>
                  <p className="text-slate-600">Your testimonial has been submitted for review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      How would you rate your experience?
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 ${
                              star <= formData.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-slate-600 font-medium">
                        {formData.rating === 5 && "Excellent! ⭐"}
                        {formData.rating === 4 && "Great! 😊"}
                        {formData.rating === 3 && "Good 👍"}
                        {formData.rating === 2 && "Fair 😐"}
                        {formData.rating === 1 && "Poor 😔"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Share your experience
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Tell us about your blood donation experience... How did it make you feel? Would you recommend others to donate?"
                      rows={5}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all resize-none text-slate-700"
                      required
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      💡 Tip: Share how donating blood made you feel and why you'd encourage others to donate!
                    </p>
                  </div>

                  {/* Suggested prompts */}
                  <div className="bg-red-50 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-red-800 mb-3">Need inspiration? Try these prompts:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "My first donation experience...",
                        "I donate because...",
                        "Blood donation saved my life...",
                        "I recommend Borejak because...",
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => setFormData({ ...formData, content: prompt })}
                          className="px-4 py-2 bg-white text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all border border-red-200"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !formData.content.trim()}
                      className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Testimonial
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-8 py-4 border-2 border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600 rounded-2xl font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Testimonials Grid */}
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Stories Yet</h3>
            <p className="text-slate-600">
              Be the first to share your blood donation story! ❤️
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((t, index) => (
              <div
                key={t.id}
                className="group bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-red-200/30 transition-all duration-500 relative animate-fade-in-up hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Quote className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <p className="text-slate-700 leading-relaxed mt-4 mb-6 italic">
                  "{t.content}"
                </p>

                {/* User */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden bg-red-50">
                    <UserAvatar user={t.users} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      {t.users?.full_name || t.user?.full_name || "Anonymous Donor"}
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
        )}
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}