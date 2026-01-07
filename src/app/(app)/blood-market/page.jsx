"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Droplet,
  MapPin,
  AlertTriangle,
  Plus,
  X,
  Handshake,
  Filter,
  Clock,
  User,
} from "lucide-react";
import {
  getBloodMarket,
  createBloodMarket,
  closeBloodMarket,
} from "@/services/blood-market";
import { useAuth } from "@/context/AuthContext";

export default function BloodMarketPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    type: "all",
    blood_type: "",
    urgency: "",
  });

  const [form, setForm] = useState({
    type: "request",
    blood_type: "",
    quantity_ml: "",
    urgency: "normal",
    location: "",
    description: "",
  });

  async function load() {
    setLoading(true);

    const params = {};
    if (filters.type !== "all") params.type = filters.type;
    if (filters.blood_type) params.blood_type = filters.blood_type;
    if (filters.urgency) params.urgency = filters.urgency;

    const data = await getBloodMarket(params);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filters]);

  async function submit() {
    try {
      await createBloodMarket(form);
      setShowForm(false);
      setForm({
        type: "request",
        blood_type: "",
        quantity_ml: "",
        urgency: "normal",
        location: "",
        description: "",
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function closePost(id) {
    if (!confirm("Are you sure you want to close this post?")) return;
    await closeBloodMarket(id);
    load();
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const activeFiltersCount = [
    filters.type !== "all",
    filters.blood_type,
    filters.urgency,
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Droplet className="w-12 h-12 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading blood market...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-xl">
                  <Droplet className="text-white w-8 h-8" />
                </div>
                Blood Market
              </h1>
              <p className="text-gray-600 mt-2">
                Connect donors and recipients in your community
              </p>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Post
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle & Active Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Type
                  </label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={filters.type}
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
                  >
                    <option value="all">All Posts</option>
                    <option value="request">Requests Only</option>
                    <option value="offer">Offers Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type
                  </label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={filters.blood_type}
                    onChange={(e) =>
                      setFilters({ ...filters, blood_type: e.target.value })
                    }
                  >
                    <option value="">All Blood Types</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={filters.urgency}
                    onChange={(e) =>
                      setFilters({ ...filters, urgency: e.target.value })
                    }
                  >
                    <option value="">All Urgency Levels</option>
                    <option value="critical">Critical</option>
                    <option value="urgent">Urgent</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() =>
                    setFilters({ type: "all", blood_type: "", urgency: "" })
                  }
                  className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {items.length} {items.length === 1 ? "post" : "posts"} found
        </div>

        {/* Posts Grid */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or create a new post
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/blood-market/${item.id}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        item.type === "request"
                          ? "bg-red-100"
                          : "bg-green-100"
                      }`}
                    >
                      {item.type === "request" ? "🩸" : "🫀"}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">
                        {item.blood_type}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {item.type}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                      item.urgency
                    )}`}
                  >
                    {item.urgency}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Droplet className="w-4 h-4 text-red-500" />
                  <span className="font-medium">{item.quantity_ml} ml</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm truncate">{item.location}</span>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Matches */}
                {item.matches?.length > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-2 text-sm">
                      <Handshake className="w-4 h-4" />
                      {item.matches.length} potential{" "}
                      {item.matches.length === 1 ? "match" : "matches"}
                    </div>
                    <ul className="text-xs space-y-1 text-green-800">
                      {item.matches.slice(0, 2).map((m) => (
                        <li key={m.id} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {m.blood_type} – {m.location}
                        </li>
                      ))}
                      {item.matches.length > 2 && (
                        <li className="text-green-600 font-medium">
                          +{item.matches.length - 2} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Close Button */}
                {user?.id === item.user_id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closePost(item.id);
                    }}
                    className="mt-4 w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Close Post
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Create Blood Post
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Type *
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="request">Request Blood</option>
                    <option value="offer">Offer Blood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type *
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={form.blood_type}
                    onChange={(e) =>
                      setForm({ ...form, blood_type: e.target.value })
                    }
                  >
                    <option value="">Select blood type</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (ml) *
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="e.g., 450"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={form.quantity_ml}
                    onChange={(e) =>
                      setForm({ ...form, quantity_ml: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={form.urgency}
                    onChange={(e) =>
                      setForm({ ...form, urgency: e.target.value })
                    }
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., City Hospital, Downtown"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Additional details about your request or offer..."
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <button
                  onClick={submit}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}