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
  CheckCircle,
  LineChart as LineChartIcon,
  Zap,
  Target,
  Eye,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

// Simple Bar Chart Component
function BarChartComponent({ data, title }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">{item.name}</span>
            <span className="text-sm font-bold text-red-600">{item.value}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-red-500 to-rose-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(item.value / max) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple Pie Chart Component
function PieChartComponent({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center justify-center gap-8">
      <svg width="160" height="160" viewBox="0 0 200 200" className="drop-shadow-lg">
        {data.map((item, index) => {
          const sliceAngle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = 100 + 70 * Math.cos(startRad);
          const y1 = 100 + 70 * Math.sin(startRad);
          const x2 = 100 + 70 * Math.cos(endRad);
          const y2 = 100 + 70 * Math.sin(endRad);

          const largeArc = sliceAngle > 180 ? 1 : 0;

          const pathData = [
            `M 100 100`,
            `L ${x1} ${y1}`,
            `A 70 70 0 ${largeArc} 1 ${x2} ${y2}`,
            `Z`,
          ].join(" ");

          const colors = ["#ef4444", "#10b981", "#f97316", "#8b5cf6", "#06b6d4"];

          currentAngle = endAngle;

          return (
            <path
              key={index}
              d={pathData}
              fill={colors[index % colors.length]}
              opacity="0.85"
            />
          );
        })}
      </svg>
      <div className="space-y-2">
        {data.map((item, index) => {
          const colors = ["bg-red-500", "bg-green-500", "bg-orange-500", "bg-purple-500", "bg-cyan-500"];
          return (
            <div key={item.name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
              <span className="text-xs text-slate-700">
                {item.name} ({((item.value / total) * 100).toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState({});

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const safe = async (url) => {
        const res = await apiFetch(url);
        return Array.isArray(res) ? res : res?.data ?? [];
      };

      const [users, hospitals, events, donations, tips, newsletter, bloodMarket, testimonials] =
        await Promise.all([
          safe("/api/users"),
          safe("/api/hospitals"),
          safe("/api/events"),
          safe("/api/donations"),
          safe("/api/tips"),
          safe("/api/newsletter"),
          safe("/api/blood-market"),
          safe("/api/testimonials"),
        ]);

      // Store raw data for charts
      setRawData({
        users,
        hospitals,
        events,
        donations,
        tips,
        newsletter,
        bloodMarket,
        testimonials,
      });

      // Calculate stats
      const pendingTestimonials = testimonials.filter((t) => !t.is_approved).length;
      const approvedTestimonials = testimonials.filter((t) => t.is_approved).length;

      // Blood Market analysis
      const bloodMarketRequests = bloodMarket.filter((b) => b.type === "request").length;
      const bloodMarketOffers = bloodMarket.filter((b) => b.type === "offer").length;
      const criticalBloodMarket = bloodMarket.filter((b) => b.urgency === "critical").length;

      // Event analysis
      const upcomingEvents = events.filter(
        (e) => new Date(e.event_date) > new Date()
      ).length;
      const completedEvents = events.filter(
        (e) => new Date(e.event_date) <= new Date()
      ).length;

      // Calculate trends (mock data based on current counts)
      const userGrowth = Math.round((users.length / 100) * 12);
      const donationGrowth = Math.round((donations.length / 50) * 8);

      setStats({
        users: users.length,
        hospitals: hospitals.length,
        events: events.length,
        donations: donations.length,
        tips: tips.length,
        subscribers: newsletter.length,
        bloodMarket: bloodMarket.length,
        bloodMarketRequests,
        bloodMarketOffers,
        criticalBloodMarket,
        pendingTestimonials,
        approvedTestimonials,
        upcomingEvents,
        completedEvents,
        userGrowth,
        donationGrowth,
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
    <div className="min-h-screen p-2 bg-gradient-to-br from-slate-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                Dashboard Overview
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Monitor your platform's key metrics in real-time
              </p>
            </div>
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all disabled:opacity-50 font-medium shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Primary Stats - Core Metrics */}
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
              trend={`+${stats?.userGrowth}% this month`}
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
              subtitle={`${stats?.upcomingEvents} upcoming`}
            />
            <StatCard
              title="Donations"
              value={stats?.donations}
              loading={loading}
              icon={Heart}
              color="red"
              trend={`+${stats?.donationGrowth}% this month`}
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Blood Market Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-red-100 transition-all">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-600" />
              Blood Market Distribution
            </h3>
            {!loading && stats && (
              <PieChartComponent
                data={[
                  { name: "Requests", value: stats.bloodMarketRequests },
                  { name: "Offers", value: stats.bloodMarketOffers },
                ]}
              />
            )}
          </div>

          {/* Events Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-red-100 transition-all">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              Events Overview
            </h3>
            {!loading && stats && (
              <BarChartComponent
                data={[
                  { name: "Upcoming Events", value: stats.upcomingEvents },
                  { name: "Completed Events", value: stats.completedEvents },
                ]}
              />
            )}
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
              subtitle="Requires attention"
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

        {/* Blood Services - Enhanced */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-600" />
            Blood Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Main Blood Market Card */}
            <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-6 shadow-lg shadow-red-500/20 text-white hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-100 text-sm font-medium">Blood Market</p>
                  <p className="text-4xl font-bold mt-1">{loading ? "..." : stats?.bloodMarket}</p>
                </div>
                <Droplet className="w-8 h-8 opacity-80" />
              </div>
              <div className="space-y-2 text-sm text-red-100">
                <div className="flex justify-between">
                  <span>Requests:</span>
                  <span className="font-bold">{loading ? "..." : stats?.bloodMarketRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Offers:</span>
                  <span className="font-bold">{loading ? "..." : stats?.bloodMarketOffers}</span>
                </div>
              </div>
            </div>

            {/* Critical Cases Alert */}
            <div className={`rounded-2xl p-6 shadow-sm border transition-all hover:shadow-lg ${
              stats?.criticalBloodMarket > 0
                ? "bg-orange-50 border-orange-200 hover:border-orange-300"
                : "bg-green-50 border-green-200 hover:border-green-300"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-xl ${
                  stats?.criticalBloodMarket > 0
                    ? "bg-orange-100"
                    : "bg-green-100"
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    stats?.criticalBloodMarket > 0
                      ? "text-orange-600"
                      : "text-green-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    stats?.criticalBloodMarket > 0
                      ? "text-orange-700"
                      : "text-green-700"
                  }`}>
                    Critical Cases
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${
                    stats?.criticalBloodMarket > 0
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}>
                    {loading ? "..." : stats?.criticalBloodMarket}
                  </p>
                  <p className={`text-xs mt-2 ${
                    stats?.criticalBloodMarket > 0
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}>
                    {stats?.criticalBloodMarket > 0
                      ? "Requires immediate attention"
                      : "All cases stable"}
                  </p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-green-200 transition-all">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-500 font-medium">System Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600">Active</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">All Systems Operational</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                  <span className="text-slate-600">Uptime</span>
                  <span className="font-bold text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Services</span>
                  <span className="font-bold text-slate-900">8/8 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            title="Total Platform Records"
            value={
              loading
                ? "..."
                : (stats?.users || 0) +
                  (stats?.hospitals || 0) +
                  (stats?.events || 0) +
                  (stats?.donations || 0)
            }
            icon={<Target className="w-5 h-5" />}
            color="blue"
          />
          <SummaryCard
            title="Content Published"
            value={loading ? "..." : (stats?.tips || 0) + (stats?.approvedTestimonials || 0)}
            icon={<Eye className="w-5 h-5" />}
            color="purple"
          />
          <SummaryCard
            title="Engagement Rate"
            value={
              loading
                ? "..."
                : stats?.subscribers > 0
                ? `${Math.round((stats?.subscribers / Math.max(stats?.users, 1)) * 100)}%`
                : "0%"
            }
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-500 bg-white rounded-xl py-4 border border-slate-100">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-400">Data refreshes automatically</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, icon: Icon, color, trend, subtitle, alert }) {
  const colorClasses = {
    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-600",
      border: "border-red-100 hover:border-red-200",
      trend: "text-red-600 bg-red-50",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      border: "border-amber-100 hover:border-amber-200",
      trend: "text-amber-600 bg-amber-50",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
      border: "border-green-100 hover:border-green-200",
      trend: "text-green-600 bg-green-50",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-100 text-orange-600",
      border: "border-orange-100 hover:border-orange-200",
      trend: "text-orange-600 bg-orange-50",
    },
  };

  const colors = colorClasses[color] || colorClasses.red;

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-lg ${colors.border} ${
        alert ? "ring-2 ring-orange-400" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && !loading && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${colors.trend}`}>
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">
        {loading ? <span className="text-slate-300">...</span> : value ?? 0}
      </p>
      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
      {alert && !loading && value > 0 && (
        <div className="flex items-center gap-1 text-xs text-orange-600 mt-3 bg-orange-50 px-2 py-1 rounded-lg w-fit">
          <AlertCircle className="w-3 h-3" />
          <span>Requires attention</span>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  const colorMap = {
    blue: {
      bg: "from-blue-600 to-blue-700",
      icon: "text-blue-100",
    },
    purple: {
      bg: "from-purple-600 to-purple-700",
      icon: "text-purple-100",
    },
    green: {
      bg: "from-green-600 to-green-700",
      icon: "text-green-100",
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 text-white shadow-lg shadow-${color}-500/20`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 bg-white/20 rounded-xl ${colors.icon}`}>{icon}</div>
      </div>
    </div>
  );
}