"use client";

import { useEffect, useState } from "react";
import { getMyDonations } from "@/services/donations";

export default function MyDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyDonations()
      .then(setDonations)
      .catch(err => {
        console.error(err);
        setError("Failed to load donations");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-gray-300">
        Loading your donations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">My Donations</h1>

      {donations.length === 0 ? (
        <p className="text-gray-400">You haven’t made any donations yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full border-collapse">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Quantity (ml)
                  </th>
                </tr>
              </thead>

              <tbody>
                {donations.map(d => (
                  <tr
                    key={d.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {d.donation_date
                        ? new Date(d.donation_date).toLocaleDateString()
                        : d.status === "approved"
                          ? "Upcoming"
                          : "-"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {d.events?.title ?? "-"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={d.status} />
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {d.quantity_ml ? `${d.quantity_ml} ml` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            ℹ️ Donations are first reviewed by the hospital.  
            Once completed, the donated blood quantity will appear here.
          </p>
        </>
      )}
    </div>
  );
}

// ===============================
// STATUS BADGE
// ===============================
function StatusBadge({ status }) {
  const map = {
    pending: {
      label: "Waiting for approval",
      className: "bg-yellow-500/20 text-yellow-300",
    },
    approved: {
      label: "Approved",
      className: "bg-blue-500/20 text-blue-300",
    },
    completed: {
      label: "Completed",
      className: "bg-green-500/20 text-green-300",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/20 text-red-300",
    },
  };

  const item = map[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}
