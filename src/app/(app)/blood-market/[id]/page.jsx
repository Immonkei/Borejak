"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Droplet,
  MapPin,
  AlertTriangle,
  Handshake,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Heart,
  HandHeart,
  Shield,
  CheckCircle,
  ExternalLink,
  Map,
} from "lucide-react";
import { getBloodMarketDetail, closeBloodMarket } from "@/services/blood-market";
import { useAuth } from "@/context/AuthContext";

const URGENCY_CONFIG = {
  critical: {
    label: "Critical",
    description: "Needs blood within hours",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    icon: "text-red-600",
    dot: "bg-red-500",
  },
  urgent: {
    label: "Urgent",
    description: "Needs blood within days",
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    icon: "text-orange-600",
    dot: "bg-orange-500",
  },
  normal: {
    label: "Normal",
    description: "Can wait for a match",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    icon: "text-green-600",
    dot: "bg-green-500",
  },
};

export default function BloodMarketDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!id) return;

    getBloodMarketDetail(id)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [id]);

  async function closePost() {
    if (!confirm("Are you sure you want to close this post? This action cannot be undone.")) return;

    setClosing(true);
    try {
      await closeBloodMarket(id);
      router.push("/blood-market");
    } catch (err) {
      alert("Failed to close post");
      setClosing(false);
    }
  }

  // Open map location
  // Open map location
  function openMap() {
    const url = item?.location_url || `https://www.google.com/maps/search/${encodeURIComponent(item.location)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Invalid ID
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Invalid Post</h2>
          <p className="text-slate-600 mb-6">The post ID is missing or invalid.</p>
          <button
            onClick={() => router.push("/blood-market")}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg"
          >
            Back to Blood Market
          </button>
        </div>
      </div>
    );
  }

// Loading
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50">
      <div className="text-center space-y-4">

        {/* Spinner */}
        <div className="relative mx-auto w-16 h-16">
          {/* Soft glow */}
          <div className="absolute inset-0 rounded-full bg-red-200/40 blur-md animate-pulse" />

          {/* Rings */}
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-4 border-red-200 rounded-full" />
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
        </div>

        {/* Text */}
        <p className="text-slate-600 font-medium tracking-wide">
          Loading post details
          <span className="inline-flex ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </span>
        </p>
      </div>
    </div>
  );
}


  // Not Found
  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Droplet className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Post Not Found</h2>
          <p className="text-slate-600 mb-6">This post may have been removed or doesn't exist.</p>
          <button
            onClick={() => router.push("/blood-market")}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg"
          >
            Back to Blood Market
          </button>
        </div>
      </div>
    );
  }

  const isRequest = item.type === "request";
  const isOwner = user?.id === item.user_id;
  const urgency = URGENCY_CONFIG[item.urgency] || URGENCY_CONFIG.normal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/blood-market")}
          className="group flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-red-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Blood Market</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className={`p-6 sm:p-8 ${isRequest ? "bg-gradient-to-r from-red-600 to-rose-600" : "bg-gradient-to-r from-green-600 to-emerald-600"}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  {isRequest ? <Heart className="w-8 h-8 text-white" /> : <HandHeart className="w-8 h-8 text-white" />}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {isRequest ? "Blood Request" : "Blood Offer"}
                  </h1>
                  <p className="text-white/80 text-sm">
                    {isRequest ? "Someone needs your help" : "Blood available for donation"}
                  </p>
                </div>
              </div>
            </div>

            {/* Blood Type & Quantity Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full">
                <span className="text-white font-black text-2xl">{item.blood_type}</span>
              </div>
              {item.quantity_ml && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">{item.quantity_ml} ml</span>
                </div>
              )}
              <div className={`px-4 py-2.5 rounded-full flex items-center gap-2 ${urgency.bg} ${urgency.border} border`}>
                <span className={`w-2 h-2 rounded-full ${urgency.dot} animate-pulse`}></span>
                <span className={`font-bold text-sm ${urgency.text}`}>{urgency.label}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Urgency Info */}
            <div className={`${urgency.bg} ${urgency.border} border rounded-2xl p-5`}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-6 h-6 ${urgency.icon}`} />
                <div>
                  <h3 className="font-bold text-slate-800">{urgency.label} Priority</h3>
                  <p className="text-sm text-slate-600">{urgency.description}</p>
                </div>
              </div>
            </div>

            {/* Location - Clickable if URL exists */}
            {/* Location - Make it always clickable */}
            <div
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all"
              onClick={openMap}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-100">
                  <Map className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">Location</h3>
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      View on Map
                    </span>
                  </div>
                  <p className="mt-1 text-red-600 font-medium">
                    {item.location}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Map Button (if URL exists) */}
            {item.location_url && (
              <button
                onClick={openMap}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                <MapPin className="w-5 h-5" />
                Open Location in Maps
              </button>
              
            )}

          {/* Posted Date */}
          {item.created_at && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2.5 rounded-xl">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Posted On</h3>
                  <p className="text-slate-600">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-3">Additional Details</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>
          )}

          {/* Contact Information */}
          {(item.contact_phone || item.contact_email) && (
            <div className={`${isRequest ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"} border rounded-2xl p-5`}>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Phone className={`w-5 h-5 ${isRequest ? "text-red-600" : "text-green-600"}`} />
                Contact Information
              </h3>
              <div className="space-y-3">
                {item.contact_phone && (
                  <a
                    href={`tel:${item.contact_phone}`}
                    className={`flex items-center justify-between p-4 bg-white rounded-xl border transition-all ${isRequest
                        ? "border-red-200 hover:border-red-400 hover:shadow-md"
                        : "border-green-200 hover:border-green-400 hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isRequest ? "bg-red-100" : "bg-green-100"}`}>
                        <Phone className={`w-5 h-5 ${isRequest ? "text-red-600" : "text-green-600"}`} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className={`font-bold ${isRequest ? "text-red-600" : "text-green-600"}`}>
                          {item.contact_phone}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </a>
                )}
                {item.contact_email && (
                  <a
                    href={`mailto:${item.contact_email}`}
                    className={`flex items-center justify-between p-4 bg-white rounded-xl border transition-all ${isRequest
                        ? "border-red-200 hover:border-red-400 hover:shadow-md"
                        : "border-green-200 hover:border-green-400 hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isRequest ? "bg-red-100" : "bg-green-100"}`}>
                        <Mail className={`w-5 h-5 ${isRequest ? "text-red-600" : "text-green-600"}`} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className={`font-bold ${isRequest ? "text-red-600" : "text-green-600"}`}>
                          {item.contact_email}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Matching Posts */}
          {item.matches?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Handshake className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-slate-800">
                  {item.matches.length} Potential Match{item.matches.length !== 1 ? "es" : ""}
                </h3>
              </div>
              <div className="space-y-3">
                {item.matches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => router.push(`/blood-market/${match.id}`)}
                    className="bg-white border border-green-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                          <span className="text-lg font-black text-green-700">{match.blood_type}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {match.type === "request" ? "Blood Request" : "Blood Offer"} • {match.quantity_ml} ml
                          </p>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="w-3.5 h-3.5" />
                            {match.location}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {isOwner ? (
              <button
                onClick={closePost}
                disabled={closing}
                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
              >
                {closing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Closing...
                  </span>
                ) : (
                  "Close This Post"
                )}
              </button>
            ) : (
              <a
                href={item.contact_phone ? `tel:${item.contact_phone}` : `mailto:${item.contact_email}`}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl transition-all shadow-lg ${isRequest
                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/25"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/25"
                  }`}
              >
                <Phone className="w-5 h-5" />
                Contact Now
              </a>
            )}
            <button
              onClick={() => router.push("/blood-market")}
              className="flex-1 sm:flex-none px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            >
              View All Posts
            </button>
          </div>
        </div>
      </div>

      {/* Safety Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2.5 rounded-xl flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-3">Important Safety Information</h3>
            <ul className="space-y-2">
              {[
                "Always verify the identity of donors and recipients",
                "Meet in safe, public locations or medical facilities",
                "Ensure all blood donations are properly screened and tested",
                "Follow all local health regulations and guidelines",
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div >
  );
}