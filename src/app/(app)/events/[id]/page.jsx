"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { getEventById, registerForEvent } from "@/services/events";
import { useAuth } from "@/context/AuthContext";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  async function register() {
    if (!user?.profile_completed) {
      alert("Please complete your profile before registering.");
      router.push("/profile");
      return;
    }

    try {
      setRegistering(true);
      await registerForEvent(id);
      router.push("/profile/donations");
    } catch (err) {
      alert(err.message);
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading event...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || "Event not found"}
      </div>
    );
  }

  const isFull =
    event.max_participants &&
    event.registered_count >= event.max_participants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </button>

          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-red-100">{event.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="md:col-span-2 space-y-6">
            <Info icon={Clock}>
              {new Date(event.event_date).toLocaleDateString()} •{" "}
              {new Date(event.event_date).toLocaleTimeString()}
            </Info>

            {event.location && (
              <Info icon={MapPin}>{event.location}</Info>
            )}

            {event.hospital_name && (
              <Info icon={Building2}>{event.hospital_name}</Info>
            )}

            <Info icon={Users}>
              {event.registered_count || 0}
              {event.max_participants &&
                ` / ${event.max_participants}`}{" "}
              participants
            </Info>

            {event.max_participants && (
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-purple-500 h-full"
                  style={{
                    width: `${Math.min(
                      (event.registered_count / event.max_participants) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <Icon className="w-5 h-5 text-red-500" />
      <span>{children}</span>
    </div>
  );
}
