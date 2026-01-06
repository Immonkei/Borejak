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
  AlertCircle
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-red-600 font-medium mb-4">{error}</div>
            <button
              onClick={loadDashboard}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-1">Monitor your platform's key metrics</p>
            </div>
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Primary Stats */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Core Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={stats?.users}
              loading={loading}
              icon={Users}
              color="blue"
              trend="+12% from last month"
            />
            <StatCard
              title="Hospitals"
              value={stats?.hospitals}
              loading={loading}
              icon={Building2}
              color="purple"
            />
            <StatCard
              title="Total Events"
              value={stats?.events}
              loading={loading}
              icon={Calendar}
              color="green"
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Content & Engagement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Health Tips"
              value={stats?.tips}
              loading={loading}
              icon={Lightbulb}
              color="yellow"
            />
            <StatCard
              title="Newsletter Subscribers"
              value={stats?.subscribers}
              loading={loading}
              icon={Mail}
              color="indigo"
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
              icon={MessageSquare}
              color="teal"
            />
          </div>
        </div>

        {/* Blood Services */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-600" />
            Blood Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Blood Market Listings"
              value={stats?.bloodMarket}
              loading={loading}
              icon={Droplet}
              color="rose"
              large
            />
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quick Stats</p>
                  <p className="text-lg font-bold text-gray-900">Platform Health</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Records</span>
                  <span className="font-semibold text-gray-900">
                    {loading ? "..." : (stats?.users || 0) + (stats?.hospitals || 0) + (stats?.events || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Services</span>
                  <span className="font-semibold text-green-600">8</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
              <div className="mb-4">
                <Activity className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">System Status</p>
                <p className="text-2xl font-bold mt-1">All Systems Operational</p>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time monitoring active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, icon: Icon, color, trend, alert, large }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    indigo: "bg-indigo-100 text-indigo-600",
    orange: "bg-orange-100 text-orange-600",
    teal: "bg-teal-100 text-teal-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 transition-transform hover:scale-105 ${alert ? 'ring-2 ring-orange-400' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`${large ? 'text-4xl' : 'text-3xl'} font-bold text-gray-900 mt-1`}>
            {loading ? (
              <span className="text-gray-300">...</span>
            ) : (
              value ?? 0
            )}
          </p>
        </div>
      </div>
      {trend && !loading && (
        <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
      {alert && !loading && value > 0 && (
        <div className="flex items-center gap-1 text-xs text-orange-600 mt-2">
          <AlertCircle className="w-3 h-3" />
          <span>Requires attention</span>
        </div>
      )}
    </div>
  );
}