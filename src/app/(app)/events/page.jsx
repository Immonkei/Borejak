"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
} from "lucide-react";
import { getEvents } from "@/services/events";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const router = useRouter();

  /* ---------------- LOAD EVENTS ---------------- */
  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- FILTER ---------------- */
  const filteredEvents = events.filter((event) =>
    filter === "all" ? true : event.status === filter
  );

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  const formatTime = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "bg-blue-500";
      case "ongoing": return "bg-green-500";
      case "completed": return "bg-slate-400";
      case "cancelled": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading events...
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Blood Donation Events
            </h1>
          </div>
          <p className="text-xl text-red-100 max-w-2xl">
            Browse upcoming blood donation events near you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", "upcoming", "ongoing"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                filter === f
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">
              No events found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}

                  <div
                    className={`absolute top-4 right-4 ${getStatusColor(
                      event.status
                    )} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                  >
                    {event.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-3">
                    {event.title}
                  </h2>

                  <div className="space-y-2.5 text-sm text-slate-600">
                    {event.event_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        {formatDate(event.event_date)} •{" "}
                        {formatTime(event.event_date)}
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        {event.location}
                      </div>
                    )}

                    {event.hospital_name && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-red-500" />
                        {event.hospital_name}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-500" />
                      {event.registered_count || 0}
                      {event.max_participants &&
                        ` / ${event.max_participants}`}{" "}
                      participants
                    </div>
                  </div>

                  {/* View Detail */}
                  <button
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="mt-6 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-700 text-white transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
