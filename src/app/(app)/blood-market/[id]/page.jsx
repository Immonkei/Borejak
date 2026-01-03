"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Droplet,
  MapPin,
  AlertTriangle,
  Handshake,
  ArrowLeft,
} from "lucide-react";
import { getBloodMarketDetail, closeBloodMarket } from "@/services/blood-market";
import { useAuth } from "@/context/AuthContext";

export default function BloodMarketDetailPage() {
  const params = useParams();
  const id = params?.id; // ✅ SAFE
  const router = useRouter();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // ⛔ prevent undefined call

    getBloodMarketDetail(id)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return <div className="p-6">Invalid post</div>;
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!item) {
    return <div className="p-6">Post not found</div>;
  }

  async function closePost() {
    if (!confirm("Close this post?")) return;
    await closeBloodMarket(id);
    router.push("/blood-market");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-600 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Droplet className="text-red-600" />
          {item.type === "request" ? "Blood Request" : "Blood Offer"}
        </h1>

        <div className="flex gap-4 text-sm text-slate-700">
          <span className="font-semibold">{item.blood_type}</span>
          <span>{item.quantity_ml} ml</span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            {item.urgency}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-red-500" />
          {item.location}
        </div>

        {item.description && (
          <p className="text-slate-600">{item.description}</p>
        )}

        {item.matches?.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
              <Handshake className="w-4 h-4" />
              Matching Posts
            </div>
            <ul className="text-sm space-y-1">
              {item.matches.map(match => (
                <li key={match.id}>
                  {match.blood_type} — {match.location}
                </li>
              ))}
            </ul>
          </div>
        )}

        {user?.id === item.user_id && (
          <button
            onClick={closePost}
            className="text-red-600 text-sm hover:underline"
          >
            Close this post
          </button>
        )}
      </div>
    </div>
  );
}
