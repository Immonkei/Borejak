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
} from "lucide-react";
import { getBloodMarketDetail, closeBloodMarket } from "@/services/blood-market";
import { useAuth } from "@/context/AuthContext";

export default function BloodMarketDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getBloodMarketDetail(id)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [id]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "critical":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          icon: "text-red-600",
        };
      case "urgent":
        return {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
          icon: "text-orange-600",
        };
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: "text-blue-600",
        };
    }
  };

  async function closePost() {
    if (!confirm("Are you sure you want to close this post? This action cannot be undone.")) return;
    await closeBloodMarket(id);
    router.push("/blood-market");
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Post</h2>
          <p className="text-gray-600">The post ID is missing or invalid.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Droplet className="w-12 h-12 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading post details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-6">This post may have been removed or doesn't exist.</p>
          <button
            onClick={() => router.push("/blood-market")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Blood Market
          </button>
        </div>
      </div>
    );
  }

  const urgencyColors = getUrgencyColor(item.urgency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Droplet className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    {item.type === "request" ? "Blood Request" : "Blood Offer"}
                  </h1>
                  <p className="text-red-100 text-sm">
                    {item.type === "request" 
                      ? "Someone needs your help" 
                      : "Blood available for donation"}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Info Pills */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-lg">{item.blood_type}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                <span className="font-semibold">{item.quantity_ml} ml</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Urgency Badge */}
            <div className="flex items-start gap-6">
              <div className={`flex-1 ${urgencyColors.bg} ${urgencyColors.border} border rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className={`w-5 h-5 ${urgencyColors.icon}`} />
                  <span className="font-semibold text-gray-900">Urgency Level</span>
                </div>
                <p className={`text-lg font-bold ${urgencyColors.text} capitalize`}>
                  {item.urgency}
                </p>
              </div>

              {item.created_at && (
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Posted</span>
                  </div>
                  <p className="text-lg font-bold text-gray-700">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-700">{item.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}

            {/* Contact Information (if available) */}
            {(item.contact_phone || item.contact_email) && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {item.contact_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <a 
                        href={`tel:${item.contact_phone}`}
                        className="text-blue-700 hover:underline"
                      >
                        {item.contact_phone}
                      </a>
                    </div>
                  )}
                  {item.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <a 
                        href={`mailto:${item.contact_email}`}
                        className="text-blue-700 hover:underline"
                      >
                        {item.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Matching Posts */}
            {item.matches?.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-4">
                  <Handshake className="w-5 h-5" />
                  <h3 className="text-gray-900">
                    {item.matches.length} Potential {item.matches.length === 1 ? "Match" : "Matches"}
                  </h3>
                </div>
                <div className="space-y-3">
                  {item.matches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => router.push(`/blood-market/${match.id}`)}
                      className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-green-700">
                              {match.blood_type}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {match.type === "request" ? "Request" : "Offer"} • {match.quantity_ml} ml
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              {match.location}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {user?.id === item.user_id ? (
                <button
                  onClick={closePost}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Close This Post
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Handle contact/response logic
                    alert("Contact functionality - to be implemented");
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Respond to Post
                </button>
              )}
              <button
                onClick={() => router.push("/blood-market")}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                View All Posts
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Important Safety Information</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Always verify the identity of donors and recipients</li>
            <li>• Meet in safe, public locations or medical facilities</li>
            <li>• Ensure all blood donations are properly screened and tested</li>
            <li>• Follow all local health regulations and guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
}