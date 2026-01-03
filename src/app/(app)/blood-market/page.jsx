"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Droplet,
  MapPin,
  AlertTriangle,
  Plus,
  X,
  Handshake,
} from "lucide-react";
import {
  getBloodMarket,
  createBloodMarket,
  closeBloodMarket,
} from "@/services/blood-market";
import { useAuth } from "@/context/AuthContext";

export default function BloodMarketPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({
    type: "all",
    blood_type: "",
    urgency: "",
  });

  const [form, setForm] = useState({
    type: "request",
    blood_type: "",
    quantity_ml: "",
    urgency: "normal",
    location: "",
    description: "",
  });

  async function load() {
    setLoading(true);

    const params = {};
    if (filters.type !== "all") params.type = filters.type;
    if (filters.blood_type) params.blood_type = filters.blood_type;
    if (filters.urgency) params.urgency = filters.urgency;

    const data = await getBloodMarket(params);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filters]);

  async function submit() {
    try {
      await createBloodMarket(form);
      setShowForm(false);
      setForm({
        type: "request",
        blood_type: "",
        quantity_ml: "",
        urgency: "normal",
        location: "",
        description: "",
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function closePost(id) {
    if (!confirm("Close this post?")) return;
    await closeBloodMarket(id);
    load();
  }

  if (loading) {
    return <div className="p-6">Loading blood market...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Droplet className="text-red-600" />
          Blood Market
        </h1>

        {isAuthenticated && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-4 mb-6 grid md:grid-cols-4 gap-3">
        <select
          className="border p-2 rounded"
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
        >
          <option value="all">All</option>
          <option value="request">Request</option>
          <option value="offer">Offer</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filters.blood_type}
          onChange={(e) =>
            setFilters({ ...filters, blood_type: e.target.value })
          }
        >
          <option value="">Blood Type</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bt => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filters.urgency}
          onChange={(e) =>
            setFilters({ ...filters, urgency: e.target.value })
          }
        >
          <option value="">Urgency</option>
          <option value="critical">Critical</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => router.push(`/blood-market/${item.id}`)}
            className="bg-white rounded-xl border p-4 shadow-sm cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div className="font-semibold">
                {item.type === "request" ? "🩸 Request" : "🫀 Offer"} –{" "}
                {item.blood_type}
              </div>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                {item.urgency}
              </span>
            </div>

            <div className="text-sm text-slate-600 mt-1">
              {item.quantity_ml} ml
            </div>

            <div className="flex items-center gap-2 text-sm mt-2">
              <MapPin className="w-4 h-4 text-red-500" />
              {item.location}
            </div>

            {item.description && (
              <p className="text-sm text-slate-500 mt-2">
                {item.description}
              </p>
            )}

            {/* MATCHES */}
            {item.matches?.length > 0 && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                  <Handshake className="w-4 h-4" />
                  Matches found
                </div>
                <ul className="text-sm space-y-1">
                  {item.matches.slice(0, 3).map(m => (
                    <li key={m.id}>
                      {m.blood_type} – {m.location}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CLOSE OWN */}
            {user?.id === item.user_id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePost(item.id);
                }}
                className="mt-3 text-sm text-red-600 hover:underline"
              >
                Close
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">New Blood Post</h2>
              <X
                onClick={() => setShowForm(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <select
                className="w-full border p-2 rounded"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="request">Request</option>
                <option value="offer">Offer</option>
              </select>

              <input
                placeholder="Blood Type (O+)"
                className="w-full border p-2 rounded"
                value={form.blood_type}
                onChange={(e) =>
                  setForm({ ...form, blood_type: e.target.value })
                }
              />

              <input
                placeholder="Quantity (ml)"
                className="w-full border p-2 rounded"
                value={form.quantity_ml}
                onChange={(e) =>
                  setForm({ ...form, quantity_ml: e.target.value })
                }
              />

              <select
                className="w-full border p-2 rounded"
                value={form.urgency}
                onChange={(e) =>
                  setForm({ ...form, urgency: e.target.value })
                }
              >
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="normal">Normal</option>
              </select>

              <input
                placeholder="Location"
                className="w-full border p-2 rounded"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button
                onClick={submit}
                className="w-full bg-red-600 text-white py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
