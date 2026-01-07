"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Calendar, Droplet, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { getMyDonations } from "@/services/donations";

export default function MyDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getMyDonations()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setDonations(sorted);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load donations. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDonations = donations.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  const stats = {
    total: donations.length,
    completed: donations.filter((d) => d.status === "completed").length,
    pending: donations.filter((d) => d.status === "pending").length,
    approved: donations.filter((d) => d.status === "approved").length,
    totalVolume: donations
      .filter((d) => d.status === "completed")
      .reduce((sum, d) => sum + (d.quantity_ml || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
              <p className="text-gray-300 text-lg">Loading your donations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-300 font-semibold mb-1">Error Loading Donations</h3>
              <p className="text-red-400/90">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Droplet className="w-10 h-10 text-red-500" />
            My Donations
          </h1>
          <p className="text-gray-400">Track your blood donation history and upcoming appointments</p>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <Droplet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Donations Yet</h3>
            <p className="text-gray-400 mb-6">
              Start your journey as a blood donor and save lives in your community.
            </p>
            <a
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              Find Donation Events
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Droplet className="w-6 h-6" />}
                label="Total Donations"
                value={stats.total}
                color="blue"
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                label="Completed"
                value={stats.completed}
                color="green"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                label="Pending"
                value={stats.pending}
                color="yellow"
              />
              <StatCard
                icon={<Droplet className="w-6 h-6" />}
                label="Total Volume"
                value={`${stats.totalVolume} ml`}
                color="red"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "pending", "approved", "completed", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    filter === status
                      ? "bg-red-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300"
                  }`}
                >
                  {status === "all" ? "All" : status}
                  {status !== "all" && (
                    <span className="ml-2 text-xs opacity-75">
                      ({donations.filter((d) => d.status === status).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Donations Table */}
            {filteredDonations.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <p className="text-gray-400">No donations found with this filter.</p>
              </div>
            ) : (
              <>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Event
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Volume
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredDonations.map((d, index) => (
                          <tr
                            key={d.id}
                            className={`border-t border-white/10 hover:bg-white/5 transition ${
                              index % 2 === 0 ? "bg-white/[0.02]" : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-300">
                                  {d.donation_date
                                    ? new Date(d.donation_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : d.status === "approved"
                                    ? "Upcoming"
                                    : "-"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-white">
                                {d.events?.title ?? "N/A"}
                              </div>
                              {d.events?.location && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {d.events.location}
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <StatusBadge status={d.status} />
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Droplet className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-gray-300 font-medium">
                                  {d.quantity_ml ? `${d.quantity_ml} ml` : "-"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <DonationAction donation={d} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <strong>Donation Process:</strong> Pending → Hospital Review → Approved → Visit Hospital → Completed
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ===============================
// STAT CARD
// ===============================
function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-white truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ===============================
// STATUS BADGE
// ===============================
function StatusBadge({ status }) {
  const map = {
    pending: {
      label: "Waiting for Approval",
      icon: <Clock className="w-3.5 h-3.5" />,
      className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    },
    approved: {
      label: "Approved",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    completed: {
      label: "Completed",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      className: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle className="w-3.5 h-3.5" />,
      className: "bg-red-500/20 text-red-300 border-red-500/30",
    },
  };

  const item = map[status] ?? {
    label: status,
    icon: null,
    className: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${item.className}`}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

// ===============================
// DONATION ACTION
// ===============================
function DonationAction({ donation }) {
  if (donation.status === "approved") {
    return (
      <a
        href={`/hospitals/${donation.hospital_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition"
      >
        Go Donate
        <ChevronRight className="w-4 h-4" />
      </a>
    );
  }

  if (donation.status === "completed") {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
        <CheckCircle className="w-4 h-4" />
        Thank You!
      </div>
    );
  }

  if (donation.status === "rejected") {
    return (
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg font-medium text-sm transition border border-red-500/30">
        Contact Hospital
      </button>
    );
  }

  return (
    <span className="text-gray-500 text-sm">
      Awaiting Review
    </span>
  );
}