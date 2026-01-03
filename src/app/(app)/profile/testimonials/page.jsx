"use client";

import SubmitTestimonial from "@/components/testimonials/SubmitTestimonial";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfileTestimonialsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      {/* Submit */}
      <SubmitTestimonial />
    </div>
  );
}
