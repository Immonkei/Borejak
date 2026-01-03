"use client";

import { useEffect, useState } from "react";
import { Droplet, Trash2 } from "lucide-react";
import {
  getBloodMarket,
  adminDeleteBloodMarket,
} from "@/services/blood-market";

export default function AdminBloodMarketPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getBloodMarket(); // ✅ LIST ONLY
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Expire this blood market post?")) return;
    await adminDeleteBloodMarket(id);
    setItems(prev => prev.filter(item => item.id !== id));
  }

  if (loading) {
    return <div className="p-6">Loading blood market...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Droplet className="text-red-600" />
        Blood Market Moderation
      </h1>

      <div className="bg-white border rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3">Blood</th>
              <th className="p-3">Urgency</th>
              <th className="p-3">Location</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-3 capitalize">{item.type}</td>
                <td className="p-3">{item.blood_type}</td>
                <td className="p-3">{item.urgency}</td>
                <td className="p-3">{item.location}</td>
                <td className="p-3">
                  <button
                    onClick={() => remove(item.id)}
                    className="flex items-center gap-1 text-red-600 hover:underline"
                  >
                    <Trash2 className="w-4 h-4" />
                    Expire
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-slate-500">
            No blood market posts found.
          </div>
        )}
      </div>
    </div>
  );
}
