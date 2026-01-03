"use client";

import { useEffect, useState } from "react";
import { Trophy, Droplet, Calendar, ShieldCheck } from "lucide-react";
import { getMyBenefits } from "@/services/benefits";

export default function BenefitsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyBenefits()
      .then(setData)
      .catch(err => {
        console.error(err);
        setError("Failed to load benefits");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading benefits...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          My Donation Benefits
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            icon={Trophy}
            title="Donor Level"
            value={formatLevel(data.level)}
            color="bg-yellow-100 text-yellow-700"
          />

          <Card
            icon={Droplet}
            title="Total Donations"
            value={`${data.total_donations}`}
            color="bg-red-100 text-red-700"
          />
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-5">
          <Row
            icon={Calendar}
            label="Last Donation Date"
            value={
              data.last_donation_date
                ? new Date(data.last_donation_date).toLocaleDateString()
                : "-"
            }
          />

          <Row
            icon={ShieldCheck}
            label="Eligible to Donate"
            value={data.eligible ? "Yes" : "No"}
            valueClass={
              data.eligible ? "text-green-600" : "text-red-600"
            }
          />

          {!data.eligible && data.next_eligible_date && (
            <Row
              icon={Calendar}
              label="Next Eligible Date"
              value={new Date(
                data.next_eligible_date
              ).toLocaleDateString()}
            />
          )}
        </div>

        {/* Info */}
        <p className="mt-6 text-sm text-slate-500">
          ℹ️ Eligibility is based on health guidelines. You can donate
          blood again after the required recovery period.
        </p>
      </div>
    </div>
  );
}

/* ===============================
   Reusable Components
================================ */

function Card({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-red-500" />
      <div className="flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`font-semibold ${valueClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function formatLevel(level) {
  if (!level) return "-";
  return level.charAt(0).toUpperCase() + level.slice(1);
}
