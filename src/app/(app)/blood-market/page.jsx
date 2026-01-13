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
  Search,
  Heart,
  HandHeart,
  Phone,
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  FileText,
  Calendar,
  Info,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import {
  getBloodMarket,
  createBloodMarket,
  closeBloodMarket,
} from "@/services/blood-market";
import { useAuth } from "@/context/AuthContext";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const URGENCY_CONFIG = {
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  urgent: {
    label: "Urgent",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  normal: {
    label: "Normal",
    color: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
};

export default function BloodMarketPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    blood_type: "",
    urgency: "",
  });

  // Form with location_url
  const [form, setForm] = useState({
    type: "request",
    blood_type: "",
    quantity_ml: "",
    urgency: "normal",
    location: "",
    location_url: "", // NEW: Google Maps URL
    contact_phone: "",
    description: "",
  });
  const [formError, setFormError] = useState("");

  async function load() {
    try {
      const params = {};
      if (filters.type !== "all") params.type = filters.type;
      if (filters.blood_type) params.blood_type = filters.blood_type;
      if (filters.urgency) params.urgency = filters.urgency;

      const data = await getBloodMarket(params);
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters]);

  function handleRefresh() {
    setRefreshing(true);
    load();
  }

  // Filter by search query
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.location?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.blood_type?.toLowerCase().includes(query)
    );
  });

  // Stats
  const stats = {
    total: items.filter((i) => i.status === "open").length,
    requests: items.filter((i) => i.status === "open" && i.type === "request").length,
    offers: items.filter((i) => i.status === "open" && i.type === "offer").length,
    critical: items.filter((i) => i.status === "open" && i.urgency === "critical").length,
  };

  async function handleSubmit() {
    setFormError("");

    if (!form.blood_type) {
      setFormError("Please select a blood type");
      return;
    }
    if (!form.location.trim()) {
      setFormError("Please enter a location");
      return;
    }
    if (!form.contact_phone.trim()) {
      setFormError("Please enter a contact phone number");
      return;
    }

    // Validate URL if provided
    if (form.location_url && !isValidUrl(form.location_url)) {
      setFormError("Please enter a valid map URL (e.g., Google Maps link)");
      return;
    }

    setSubmitting(true);
    try {
      await createBloodMarket({
        ...form,
        quantity_ml: form.quantity_ml ? parseInt(form.quantity_ml) : null,
      });
      setShowForm(false);
      setForm({
        type: "request",
        blood_type: "",
        quantity_ml: "",
        urgency: "normal",
        location: "",
        location_url: "",
        contact_phone: "",
        description: "",
      });
      load();
    } catch (err) {
      setFormError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function closePost(id) {
    if (!confirm("Are you sure you want to close this post?")) return;
    await closeBloodMarket(id);
    load();
  }

  const activeFiltersCount = [
    filters.type !== "all",
    filters.blood_type,
    filters.urgency,
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading blood market...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-red-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <Droplet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Blood Market</h1>
              <p className="text-slate-600">Connect with donors and recipients</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25"
              >
                <Plus className="w-5 h-5" />
                Create Post
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Droplet className="w-5 h-5" />} label="Total Posts" value={stats.total} color="slate" />
          <StatCard icon={<Heart className="w-5 h-5" />} label="Requests" value={stats.requests} color="red" />
          <StatCard icon={<HandHeart className="w-5 h-5" />} label="Offers" value={stats.offers} color="green" />
          <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Critical" value={stats.critical} color="orange" />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by location, description, or blood type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Type:</span>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {[
                  { key: "all", label: "All" },
                  { key: "request", label: "Requests" },
                  { key: "offer", label: "Offers" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilters({ ...filters, type: item.key })}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filters.type === item.key
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Blood:</span>
              <select
                value={filters.blood_type}
                onChange={(e) => setFilters({ ...filters, blood_type: e.target.value })}
                className="px-3 py-1.5 bg-slate-100 border-0 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="">All</option>
                {BLOOD_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Urgency:</span>
              <select
                value={filters.urgency}
                onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                className="px-3 py-1.5 bg-slate-100 border-0 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="">All</option>
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => setFilters({ type: "all", blood_type: "", urgency: "" })}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-slate-600 mb-4">
          Showing <span className="font-bold text-slate-800">{filteredItems.length}</span> result{filteredItems.length !== 1 ? "s" : ""}
        </p>

        {/* Posts Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Droplet className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Posts Found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {items.length === 0
                ? "Be the first to create a blood request or offer!"
                : "No posts match your current filters. Try adjusting your search."}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/25"
              >
                <Plus className="w-5 h-5" />
                Create a Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <BloodMarketCard
                key={item.id}
                item={item}
                index={index}
                isOwner={user?.id === item.user_id}
                onClose={() => closePost(item.id)}
                onClick={() => router.push(`/blood-market/${item.id}`)}
              />
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Heart className="w-12 h-12" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Need Blood or Want to Help?</h3>
              <p className="text-red-100 mb-4">
                Create a post to request blood or offer to donate. Your contribution can save lives!
              </p>
              {isAuthenticated ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Post
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all shadow-lg"
                >
                  Sign In to Create Post
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Create Post</h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">What would you like to do?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "request" })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      form.type === "request"
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Heart className={`w-6 h-6 mx-auto mb-2 ${form.type === "request" ? "text-red-600" : "text-slate-400"}`} />
                    <p className={`font-bold text-sm ${form.type === "request" ? "text-red-600" : "text-slate-700"}`}>
                      Request Blood
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "offer" })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      form.type === "offer"
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <HandHeart className={`w-6 h-6 mx-auto mb-2 ${form.type === "offer" ? "text-green-600" : "text-slate-400"}`} />
                    <p className={`font-bold text-sm ${form.type === "offer" ? "text-green-600" : "text-slate-700"}`}>
                      Offer Blood
                    </p>
                  </button>
                </div>
              </div>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Droplet className="w-4 h-4 inline mr-1 text-red-500" />
                  Blood Type *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, blood_type: type })}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                        form.blood_type === type
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-1 text-orange-500" />
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "critical", label: "Critical", color: "red" },
                    { value: "urgent", label: "Urgent", color: "orange" },
                    { value: "normal", label: "Normal", color: "green" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setForm({ ...form, urgency: item.value })}
                      className={`py-2.5 rounded-xl font-medium text-sm transition-all border-2 ${
                        form.urgency === item.value
                          ? item.color === "red"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : item.color === "orange"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-green-500 bg-green-50 text-green-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1 text-slate-500" />
                  Location Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Calmette Hospital, Phnom Penh"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              {/* Location URL (NEW) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-1 text-slate-500" />
                  Map URL <span className="font-normal text-slate-400">- Optional</span>
                </label>
                <input
                  type="url"
                  placeholder="Paste Google Maps link here..."
                  value={form.location_url}
                  onChange={(e) => setForm({ ...form, location_url: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  💡 Tip: Open Google Maps → Find location → Click "Share" → Copy link
                </p>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1 text-slate-500" />
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  placeholder="e.g., 012 345 678"
                  value={form.contact_phone}
                  onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Droplet className="w-4 h-4 inline mr-1 text-slate-500" />
                  Quantity (ml) <span className="font-normal text-slate-400">- Optional</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 450"
                  value={form.quantity_ml}
                  onChange={(e) => setForm({ ...form, quantity_ml: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1 text-slate-500" />
                  Description <span className="font-normal text-slate-400">- Optional</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                />
              </div>

              {/* Error */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">{formError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  form.type === "request"
                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/25"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/25"
                } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {form.type === "request" ? <Heart className="w-5 h-5" /> : <HandHeart className="w-5 h-5" />}
                    {form.type === "request" ? "Post Blood Request" : "Post Blood Offer"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===============================
// STAT CARD
// ===============================
function StatCard({ icon, label, value, color }) {
  const colorMap = {
    slate: { icon: "bg-slate-100 text-slate-600", border: "border-slate-100" },
    red: { icon: "bg-red-100 text-red-600", border: "border-red-100" },
    green: { icon: "bg-green-100 text-green-600", border: "border-green-100" },
    orange: { icon: "bg-orange-100 text-orange-600", border: "border-orange-100" },
  };
  const colors = colorMap[color] || colorMap.slate;

  return (
    <div className={`bg-white rounded-2xl shadow-md border ${colors.border} p-4 hover:shadow-lg transition-all`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${colors.icon}`}>{icon}</div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ===============================
// BLOOD MARKET CARD (with clickable location)
// ===============================
function BloodMarketCard({ item, index, isOwner, onClose, onClick }) {
  const urgency = URGENCY_CONFIG[item.urgency] || URGENCY_CONFIG.normal;
  const isRequest = item.type === "request";
  const timeAgo = getTimeAgo(item.created_at);

  // Handle location click - open map if URL exists
  function handleLocationClick(e) {
    e.stopPropagation();
    if (item.location_url) {
      window.open(item.location_url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
      style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
      onClick={onClick}
    >
      {/* Header */}
      <div className={`p-4 ${isRequest ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isRequest ? <Heart className="w-5 h-5 text-white" /> : <HandHeart className="w-5 h-5 text-white" />}
            <span className="text-white font-bold">{isRequest ? "Blood Request" : "Blood Offer"}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white font-black text-lg">{item.blood_type}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Urgency & Time */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${urgency.color}`}>
            <span className={`w-2 h-2 rounded-full ${urgency.dot} animate-pulse`}></span>
            {urgency.label}
          </span>
          <span className="text-xs text-slate-400">{timeAgo}</span>
        </div>

        {/* Location - Clickable if URL exists */}
        <div
          onClick={handleLocationClick}
          className={`flex items-start gap-2 mb-3 ${
            item.location_url
              ? "cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors group/loc"
              : ""
          }`}
        >
          <MapPin className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.location_url ? "text-red-500" : "text-slate-400"}`} />
          <p className={`font-medium text-sm ${item.location_url ? "text-red-600 group-hover/loc:underline" : "text-slate-700"}`}>
            {item.location || "Location not specified"}
          </p>
          {item.location_url && (
            <ExternalLink className="w-3.5 h-3.5 text-red-400 opacity-0 group-hover/loc:opacity-100 transition-opacity" />
          )}
        </div>

        {/* Quantity */}
        {item.quantity_ml && (
          <div className="flex items-center gap-2 mb-3">
            <Droplet className="w-4 h-4 text-red-500" />
            <span className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">{item.quantity_ml} ml</span>
            </span>
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        )}

        {/* Matches */}
        {item.matches?.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm mb-2">
              <Handshake className="w-4 h-4" />
              {item.matches.length} potential match{item.matches.length !== 1 ? "es" : ""}
            </div>
            <div className="space-y-1">
              {item.matches.slice(0, 2).map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-xs text-green-800">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  {m.blood_type} – {m.location}
                </div>
              ))}
              {item.matches.length > 2 && (
                <p className="text-xs text-green-600 font-medium">+{item.matches.length - 2} more</p>
              )}
            </div>
          </div>
        )}

        {/* Contact Button */}
        <a
          href={`tel:${item.contact_phone}`}
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all ${
            isRequest ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          <Phone className="w-4 h-4" />
          {item.contact_phone || "Contact"}
        </a>

        {/* Close Button for Owner */}
        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="mt-3 w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 rounded-xl hover:bg-red-50 transition-all"
          >
            Close Post
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ===============================
// TIME AGO HELPER
// ===============================
function getTimeAgo(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}