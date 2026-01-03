"use client";

import { useState } from "react";
import { createTestimonial } from "@/services/testimonials";
import { Star, Send } from "lucide-react";

export default function SubmitTestimonial() {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await createTestimonial({ content, rating });
      setContent("");
      setRating(5);
      setSuccess(true);
    } catch (err) {
      alert(err.message || "Failed to submit testimonial");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Share Your Story ❤️
      </h3>
      <p className="text-slate-600 mb-4">
        Your experience can inspire others to save lives.
      </p>

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          Thank you! Your testimonial is pending approval.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell us about your blood donation experience..."
          className="w-full min-h-[120px] border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
          required
        />

        {/* Rating */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    rating >= n
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          Submit Testimonial
        </button>
      </form>
    </div>
  );
}
