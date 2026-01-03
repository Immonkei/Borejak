"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
} from "lucide-react";
import { getEvents, registerForEvent } from "@/services/events";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  }

  async function register(id) {
    try {
      setLoadingId(id);
      await registerForEvent(id);
      router.push("/profile/donations");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

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
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-slate-400";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const filteredEvents = events.filter((event) =>
    filter === "all" ? true : event.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Blood Donation Events
            </h1>
          </div>
          <p className="text-xl text-red-100 max-w-2xl">
            Join us in saving lives. Find upcoming blood donation drives near you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", "upcoming", "ongoing", "completed"].map((f) => (
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
            <p className="text-slate-500">
              {filter === "all"
                ? "There are no events scheduled at the moment."
                : `There are no ${filter} events.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push(`/events/${event.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-slate-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-400 to-purple-500 flex items-center justify-center">
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
                  <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors">
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
                        ` / ${event.max_participants}`}
                    </div>
                  </div>

                  {/* Action */}
                  {(event.status === "upcoming" ||
                    event.status === "ongoing") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ⛔ prevent card navigation
                        register(event.id);
                      }}
                      disabled={
                        loadingId === event.id ||
                        event.is_registered ||
                        (event.max_participants &&
                          event.registered_count >= event.max_participants)
                      }
                      className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all
                        ${
                          loadingId === event.id
                            ? "bg-slate-400 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white"
                        }`}
                    >
                      {event.is_registered
                        ? "Already Registered"
                        : loadingId === event.id
                        ? "Registering..."
                        : event.max_participants &&
                          event.registered_count >= event.max_participants
                        ? "Event Full"
                        : event.status === "ongoing"
                        ? "Join Now"
                        : "Register Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
