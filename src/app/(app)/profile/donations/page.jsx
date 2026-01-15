"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Calendar, Droplet, CheckCircle, XCircle, Clock, ChevronRight, TrendingUp, Heart, Award } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-red-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 text-lg font-medium mt-6">Loading your donations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-red-900 font-bold text-lg mb-2">Unable to Load Donations</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 rounded-full shadow-lg shadow-red-500/30">
              <Droplet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Donations</h1>
              <p className="text-slate-600 mt-1">Track your impact and donation history</p>
            </div>
          </div>
        </div>

        {donations.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <Heart className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No Donations Yet</h3>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
              Start your journey as a blood donor and make a real difference in your community. Find events near you today!
            </p>
            <a
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold transition shadow-lg shadow-red-500/30"
            >
              <Calendar className="w-5 h-5" />
              Find Donation Events
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
              <StatCard
                icon={<Droplet className="w-6 h-6" />}
                label="Total Donations"
                value={stats.total}
                bgGradient="from-blue-600 to-blue-700"
                textColor="text-blue-600"
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                label="Completed"
                value={stats.completed}
                bgGradient="from-green-600 to-emerald-600"
                textColor="text-green-600"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                label="Pending"
                value={stats.pending}
                bgGradient="from-amber-600 to-yellow-600"
                textColor="text-amber-600"
              />
              <StatCard
                icon={<Award className="w-6 h-6" />}
                label="Approved"
                value={stats.approved}
                bgGradient="from-purple-600 to-indigo-600"
                textColor="text-purple-600"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Total Volume"
                value={`${stats.totalVolume} ml`}
                bgGradient="from-red-600 to-rose-600"
                textColor="text-red-600"
              />
            </div>

            {/* Filter Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {["all", "pending", "approved", "completed", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                      filter === status
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30"
                        : "bg-white text-slate-600 border-2 border-slate-200 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                    {status !== "all" && (
                      <span className="ml-2 font-semibold opacity-75">
                        {donations.filter((d) => d.status === status).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Donations List */}
            {filteredDonations.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
                <p className="text-slate-500 text-lg">No donations found with this filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonations.map((donation, index) => (
                  <DonationCard key={donation.id} donation={donation} index={index} />
                ))}
              </div>
            )}

            {/* Info Banner */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-900 font-bold mb-2">Donation Process</h4>
                <p className="text-blue-800 text-sm">
                  <strong>Pending</strong> → Hospital Review → <strong>Approved</strong> → Visit Hospital → <strong>Completed</strong>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===============================
// STAT CARD
// ===============================
function StatCard({ icon, label, value, bgGradient, textColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${bgGradient} rounded-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

// ===============================
// DONATION CARD
// ===============================
function DonationCard({ donation }) {
  const statusConfig = {
    pending: {
      badge: "bg-amber-100 text-amber-700 border border-amber-300",
      icon: <Clock className="w-4 h-4" />,
      label: "Waiting for Approval",
      dotColor: "bg-amber-500",
    },
    approved: {
      badge: "bg-blue-100 text-blue-700 border border-blue-300",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Approved",
      dotColor: "bg-blue-500",
    },
    completed: {
      badge: "bg-green-100 text-green-700 border border-green-300",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Completed",
      dotColor: "bg-green-500",
    },
    rejected: {
      badge: "bg-red-100 text-red-700 border border-red-300",
      icon: <XCircle className="w-4 h-4" />,
      label: "Rejected",
      dotColor: "bg-red-500",
    },
  };

  const config = statusConfig[donation.status] || statusConfig.pending;

  const donationDate = donation.donation_date
    ? new Date(donation.donation_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : donation.status === "approved"
    ? "Upcoming"
    : "-";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 overflow-hidden transition-all hover:border-slate-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-4 flex-1">
            {/* Left: Date & Event */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${config.dotColor}`}></div>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  {donationDate}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {donation.events?.title ?? "Blood Donation"}
              </h3>
              {donation.events?.location && (
                <div className="flex items-center gap-1 text-slate-600 text-sm">
                  <span>📍</span>
                  {donation.events.location}
                </div>
              )}
            </div>

            {/* Right: Status Badge */}
            <div className={`px-4 py-2 rounded-full font-semibold text-sm inline-flex items-center gap-2 ${config.badge} whitespace-nowrap`}>
              {config.icon}
              {config.label}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-5"></div>

        {/* Bottom: Volume & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
              <Droplet className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Volume Donated</p>
              <p className="text-xl font-bold text-slate-900">{donation.quantity_ml ? `${donation.quantity_ml} ml` : "-"}</p>
            </div>
          </div>

          {/* Action Button */}
          <DonationAction donation={donation} />
        </div>
      </div>
    </div>
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
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm transition shadow-lg hover:shadow-xl"
      >
        Go Donate
        <ChevronRight className="w-4 h-4" />
      </a>
    );
  }

  if (donation.status === "completed") {
    return (
      <div className="flex items-center gap-2 text-green-600 font-semibold">
        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
          <CheckCircle className="w-5 h-5" />
        </div>
        <span className="text-sm">Thank You!</span>
      </div>
    );
  }

  if (donation.status === "rejected") {
    return (
      <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold text-sm transition border border-red-300">
        Contact
      </button>
    );
  }

  return (
    <span className="text-slate-500 text-sm font-semibold">
      Awaiting Review
    </span>
  );
}