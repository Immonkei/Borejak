"use client";

import { useEffect, useState } from "react";
import { getPublicTestimonials } from "@/services/testimonials";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getPublicTestimonials().then(res => {
      setItems(res.data.slice(0, 3)); // show only 3 on homepage
    });
  }, []);

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What People Say ❤️
          </h2>
          <p className="text-xl text-slate-600">
            Real stories from donors and patients
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map(t => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-8 shadow hover:shadow-xl transition"
            >
              <Quote className="w-8 h-8 text-red-500 mb-4" />

              <p className="text-slate-700 italic mb-6">
                “{t.content}”
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={t.users?.avatar_url || "/avatar.png"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {t.users?.full_name}
                  </p>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/testimonials"
            className="text-red-600 font-semibold hover:underline"
          >
            View all testimonials →
          </a>
        </div>
      </div>
    </div>
  );
}
