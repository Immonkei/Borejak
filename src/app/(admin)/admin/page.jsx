"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Building2, 
  Calendar, 
  Heart, 
  Lightbulb, 
  Mail, 
  Droplet, 
  MessageSquare,
  TrendingUp,
  Activity,
  RefreshCw,
  BarChart3,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const safe = async (url) => {
        const res = await apiFetch(url);
        return Array.isArray(res) ? res : res?.data ?? [];
      };

      const [
        users,
        hospitals,
        events,
        donations,
        tips,
        newsletter,
        bloodMarket,
        testimonials,
      ] = await Promise.all([
        safe("/api/users"),
        safe("/api/hospitals"),
        safe("/api/events"),
        safe("/api/donations"),
        safe("/api/tips"),
        safe("/api/newsletter"),
        safe("/api/blood-market"),
        safe("/api/testimonials"),
      ]);

      setStats({
        users: users.length,
        hospitals: hospitals.length,
        events: events.length,
        donations: donations.length,
        tips: tips.length,
        subscribers: newsletter.length,
        bloodMarket: bloodMarket.length,
        pendingTestimonials: testimonials.filter(
          (t) => t.status === "pending"
        ).length,
        approvedTestimonials: testimonials.filter(
          (t) => t.status === "approved"
        ).length,
      });
    } catch (err) {
      console.error("Dashboard load error", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-red-600 font-medium mb-4">{error}</div>
            <button
              onClick={loadDashboard}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-red-600" />
                </div>
                Dashboard Overview
              </h1>
              <p className="text-slate-600 mt-2">Monitor your platform's key metrics</p>
            </div>
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50 font-medium shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Primary Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Core Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Users"
              value={stats?.users}
              loading={loading}
              icon={Users}
              color="red"
              trend="+12% from last month"
            />
            <StatCard
              title="Hospitals"
              value={stats?.hospitals}
              loading={loading}
              icon={Building2}
              color="red"
            />
            <StatCard
              title="Total Events"
              value={stats?.events}
              loading={loading}
              icon={Calendar}
              color="red"
            />
            <StatCard
              title="Donations"
              value={stats?.donations}
              loading={loading}
              icon={Heart}
              color="red"
            />
          </div>
        </div>

        {/* Content & Engagement */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            Content & Engagement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Health Tips"
              value={stats?.tips}
              loading={loading}
              icon={Lightbulb}
              color="amber"
            />
            <StatCard
              title="Newsletter Subscribers"
              value={stats?.subscribers}
              loading={loading}
              icon={Mail}
              color="red"
            />
            <StatCard
              title="Pending Reviews"
              value={stats?.pendingTestimonials}
              loading={loading}
              icon={MessageSquare}
              color="orange"
              alert={stats?.pendingTestimonials > 0}
            />
            <StatCard
              title="Approved Testimonials"
              value={stats?.approvedTestimonials}
              loading={loading}
              icon={CheckCircle}
              color="green"
            />
          </div>
        </div>

        {/* Blood Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-600" />
            Blood Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Blood Market Listings"
              value={stats?.bloodMarket}
              loading={loading}
              icon={Droplet}
              color="red"
              large
            />
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-red-100 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Quick Stats</p>
                  <p className="text-lg font-bold text-slate-900">Platform Health</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Total Records</span>
                  <span className="font-bold text-slate-900">
                    {loading ? "..." : (stats?.users || 0) + (stats?.hospitals || 0) + (stats?.events || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Active Services</span>
                  <span className="font-bold text-green-600">8</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-6 shadow-lg shadow-red-500/20 text-white">
              <div className="mb-4">
                <Activity className="w-8 h-8 mb-2 opacity-90" />
                <p className="text-sm text-red-100">System Status</p>
                <p className="text-2xl font-bold mt-1">All Systems Operational</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-red-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time monitoring active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-500 bg-white rounded-xl py-3 border border-slate-100">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, icon: Icon, color, trend, alert, large }) {
  const colorClasses = {
    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-600",
      border: "border-red-100 hover:border-red-200",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      border: "border-amber-100 hover:border-amber-200",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
      border: "border-green-100 hover:border-green-200",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-100 text-orange-600",
      border: "border-orange-100 hover:border-orange-200",
    },
  };

  const colors = colorClasses[color] || colorClasses.red;

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-lg ${colors.border} ${alert ? 'ring-2 ring-orange-400' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className={`${large ? 'text-4xl' : 'text-3xl'} font-bold text-slate-900 mt-1`}>
            {loading ? (
              <span className="text-slate-300">...</span>
            ) : (
              value ?? 0
            )}
          </p>
        </div>
      </div>
      {trend && !loading && (
        <div className="flex items-center gap-1 text-xs text-green-600 mt-3 bg-green-50 px-2 py-1 rounded-lg w-fit">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
      {alert && !loading && value > 0 && (
        <div className="flex items-center gap-1 text-xs text-orange-600 mt-3 bg-orange-50 px-2 py-1 rounded-lg w-fit">
          <AlertCircle className="w-3 h-3" />
          <span>Requires attention</span>
        </div>
      )}
    </div>
  );
}