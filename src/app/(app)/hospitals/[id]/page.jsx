"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Droplets,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Plus
} from "lucide-react";

export default function HospitalDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hospital, setHospital] = useState(null);
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push("/hospitals");
      return;
    }

    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      const [hospitalRes, eventsRes, marketRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hospitals/${id}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?hospital=${id}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blood-market?hospital=${id}`)
      ]);

      const hospitalJson = await hospitalRes.json();
      const eventsJson = await eventsRes.json();
      const marketJson = await marketRes.json();

      setHospital(hospitalJson.data);
      setEvents(eventsJson.data || []);
      setRequests(marketJson.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading hospital details...
      </div>
    );
  }

  if (!hospital) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Back */}
      <button
        onClick={() => router.push("/hospitals")}
        className="flex items-center gap-2 text-blue-600 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to hospitals
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold mb-2">{hospital.name}</h1>
        <p className="text-slate-600">{hospital.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
          {hospital.address && (
            <Info icon={<MapPin />} value={hospital.address} />
          )}
          {hospital.phone && (
            <Info icon={<Phone />} value={hospital.phone} />
          )}
          {hospital.email && (
            <Info icon={<Mail />} value={hospital.email} />
          )}
        </div>
      </div>

      {/* Blood Inventory */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-red-600" />
          Blood Inventory
        </h2>

        {hospital.blood_inventory &&
        Object.keys(hospital.blood_inventory).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(hospital.blood_inventory).map(([type, amount]) => (
              <div
                key={type}
                className="border rounded-xl p-4 text-center"
              >
                <p className="font-bold text-lg">{type}</p>
                <p
                  className={`text-sm ${
                    amount < 500
                      ? "text-red-600"
                      : amount < 1000
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {amount} ml
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No inventory data available.</p>
        )}
      </section>

      {/* Events */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          Donation Events
        </h2>

        {events.length === 0 ? (
          <p className="text-slate-500">No upcoming events.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-xl p-4"
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-slate-600">
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
                <p className="text-sm">{event.location}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Blood Requests (Blood Market Integration) */}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Active Blood Requests
          </h2>

          <button
            onClick={() =>
              router.push(`/blood-market/create?hospital=${id}`)
            }
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
          >
            <Plus className="w-4 h-4" />
            Request Blood
          </button>
        </div>

        {requests.length === 0 ? (
          <p className="text-slate-500">No active requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {req.blood_type} • {req.quantity_ml} ml
                  </p>
                  <p className="text-sm text-slate-600">
                    Urgency: {req.urgency}
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push(`/blood-market/${req.id}`)
                  }
                  className="text-blue-600 font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Info({ icon, value }) {
  return (
    <div className="flex items-center gap-2 text-slate-700">
      <span className="text-blue-600">{icon}</span>
      <span>{value}</span>
    </div>
  );
}
