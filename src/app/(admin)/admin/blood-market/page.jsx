"use client";

import { useEffect, useState } from "react";
import {
  Droplet,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Eye,
  RefreshCw,
  Heart,
  HandHeart,
  Phone,
  ExternalLink,
  Map,
  ChevronDown,
} from "lucide-react";
import {
  getBloodMarket,
  adminDeleteBloodMarket,
} from "@/services/blood-market";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function AdminBloodMarketPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    urgency: "all",
    blood_type: "all",
  });
  const [stats, setStats] = useState({
    total: 0,
    requests: 0,
    offers: 0,
    critical: 0,
  });

  async function load() {
    setLoading(true);
    try {
      const data = await getBloodMarket();
      setItems(data || []);
      setFilteredItems(data || []);

      // Calculate stats
      setStats({
        total: data?.length || 0,
        requests: data?.filter((item) => item.type === "request").length || 0,
        offers: data?.filter((item) => item.type === "offer").length || 0,
        critical: data?.filter((item) => item.urgency === "critical").length || 0,
      });
    } catch (err) {
      console.error("Failed to load blood market:", err);
      alert("Failed to load blood market posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    load();
  }

  // Filter logic
  useEffect(() => {
    let filtered = items;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.blood_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.contact_phone?.includes(searchQuery)
      );
    }

    // Apply filters
    if (filters.type !== "all") {
      filtered = filtered.filter((item) => item.type === filters.type);
    }
    if (filters.urgency !== "all") {
      filtered = filtered.filter((item) => item.urgency === filters.urgency);
    }
    if (filters.blood_type !== "all") {
      filtered = filtered.filter((item) => item.blood_type === filters.blood_type);
    }

    setFilteredItems(filtered);
  }, [searchQuery, filters, items]);

  async function remove(id) {
    if (
      !confirm(
        "Are you sure you want to delete this blood market post? This action cannot be undone."
      )
    )
      return;
    try {
      await adminDeleteBloodMarket(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post");
    }
  }

  function openMap(url) {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "urgent":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const activeFiltersCount = [
    filters.type !== "all",
    filters.urgency !== "all",
    filters.blood_type !== "all",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">
            Loading blood market posts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Blood Market</h1>
            <p className="text-slate-600 text-sm">Manage blood requests and offers</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Droplet className="w-5 h-5" />}
          label="Total Posts"
          value={stats.total}
          color="slate"
        />
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          label="Requests"
          value={stats.requests}
          color="red"
        />
        <StatCard
          icon={<HandHeart className="w-5 h-5" />}
          label="Offers"
          value={stats.offers}
          color="green"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Critical"
          value={stats.critical}
          color="orange"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by location, blood type, phone, or description..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="request">Requests</option>
              <option value="offer">Offers</option>
            </select>

            <select
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium"
              value={filters.urgency}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            >
              <option value="all">All Urgency</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>

            <select
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium"
              value={filters.blood_type}
              onChange={(e) => setFilters({ ...filters, blood_type: e.target.value })}
            >
              <option value="all">All Blood Types</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters info */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-bold text-slate-800">{filteredItems.length}</span> of{" "}
            {items.length} posts
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={() =>
                setFilters({ type: "all", urgency: "all", blood_type: "all" })
              }
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplet className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No posts found</h3>
            <p className="text-slate-600">
              {searchQuery || activeFiltersCount > 0
                ? "Try adjusting your search or filters"
                : "No blood market posts available"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Blood
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                          item.type === "request"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {item.type === "request" ? (
                          <Heart className="w-3.5 h-3.5" />
                        ) : (
                          <HandHeart className="w-3.5 h-3.5" />
                        )}
                        {item.type === "request" ? "Request" : "Offer"}
                      </span>
                    </td>

                    {/* Blood Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-red-100 text-red-700 font-black text-sm rounded-xl">
                        {item.blood_type}
                      </span>
                    </td>

                    {/* Urgency */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${getUrgencyBadge(
                          item.urgency
                        )}`}
                      >
                        {item.urgency === "critical" && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        {item.urgency}
                      </span>
                    </td>

                    {/* Location - Clickable if URL exists */}
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-2 ${
                          item.location_url
                            ? "cursor-pointer hover:text-red-600 transition-colors"
                            : "text-slate-700"
                        }`}
                        onClick={() => item.location_url && openMap(item.location_url)}
                      >
                        {item.location_url ? (
                          <Map className="w-4 h-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                        <span
                          className={`truncate max-w-[180px] ${
                            item.location_url ? "text-red-600 font-medium" : ""
                          }`}
                        >
                          {item.location}
                        </span>
                        {item.location_url && (
                          <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.contact_phone && (
                        <a
                          href={`tel:${item.contact_phone}`}
                          className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{item.contact_phone}</span>
                        </a>
                      )}
                    </td>

                    {/* Posted Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.created_at ? (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            window.open(`/blood-market/${item.id}`, "_blank")
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.location_url && (
                          <button
                            onClick={() => openMap(item.location_url)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Open map"
                          >
                            <Map className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => remove(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-bold text-slate-700 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-red-500" />
            <span className="text-sm text-slate-600">Has map location (clickable)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-600">Critical urgency</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-slate-600">Blood request</span>
          </div>
          <div className="flex items-center gap-2">
            <HandHeart className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-600">Blood offer</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===============================
// STAT CARD COMPONENT
// ===============================
function StatCard({ icon, label, value, color }) {
  const colorMap = {
    slate: {
      bg: "bg-slate-50",
      icon: "bg-slate-100 text-slate-600",
      border: "border-slate-200",
    },
    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-600",
      border: "border-red-200",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
      border: "border-green-200",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-100 text-orange-600",
      border: "border-orange-200",
    },
  };
  const colors = colorMap[color] || colorMap.slate;

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-4 hover:shadow-md transition-all`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colors.icon}`}>{icon}</div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}