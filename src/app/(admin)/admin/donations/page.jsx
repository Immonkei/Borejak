"use client";

import { useEffect, useState } from "react";
import {
  getAllDonations,
  updateDonationStatus,
} from "@/services/donations";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await getAllDonations();
      setDonations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

async function setStatus(id, status) {
  console.log("🔥 setStatus called with:", status);

  if (status === "rejected") {
    const ok = confirm("Are you sure you want to reject this donation?");
    if (!ok) return;
  }

  if (status === "completed") {
    const quantity = prompt("Enter donated blood amount (ml):");

    if (!quantity || Number(quantity) <= 0) {
      alert("Valid quantity is required");
      return;
    }

    try {
      setLoadingId(id);
      await updateDonationStatus(id, {
        status: "completed",
        quantity_ml: Number(quantity),
      });
      load();
    } finally {
      setLoadingId(null);
    }

    return; // ⛔ stop here
  }

  // approved / rejected
  try {
    setLoadingId(id);
    await updateDonationStatus(id, { status });
    load();
  } finally {
    setLoadingId(null);
  }
}


async function completeDonation(donation) {
  const quantity = prompt("Enter donated blood quantity (ml):");

  if (!quantity || Number(quantity) <= 0) {
    alert("Invalid quantity");
    return;
  }

  try {
    setLoadingId(donation.id);

    await updateDonationStatus(donation.id, {
      status: "completed",
      quantity_ml: Number(quantity),
    });

    load();
  } finally {
    setLoadingId(null);
  }
}


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Donations Management</h1>

      {loading && <p>Loading donations…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Event</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Quantity (ml)</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3">{d.user_email}</td>
                  <td className="p-3">{d.event_title ?? "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${statusStyle[d.status]}`}
                    >
                      {d.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {d.quantity_ml ?? "-"}
                  </td>

                  <td className="p-3 space-x-2">
                    {d.status === "pending" && (
                      <>
                        <button
                          disabled={loadingId === d.id}
                          onClick={() => setStatus(d.id, "approved")}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={loadingId === d.id}
                          onClick={() => setStatus(d.id, "rejected")}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {d.status === "approved" && (
                      <button
                        disabled={loadingId === d.id}
                        onClick={() => completeDonation(d)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {donations.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
