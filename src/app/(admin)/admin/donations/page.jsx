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

  // 🔧 FIXED: Separate handlers for each action
  async function approveDonation(id) {
    try {
      setLoadingId(id);
      await updateDonationStatus(id, { status: "approved" });
      await load();
    } catch (err) {
      alert(err.message || "Failed to approve donation");
    } finally {
      setLoadingId(null);
    }
  }

  async function rejectDonation(id) {
    const ok = confirm("Are you sure you want to reject this donation?");
    if (!ok) return;

    try {
      setLoadingId(id);
      await updateDonationStatus(id, { status: "rejected" });
      await load();
    } catch (err) {
      alert(err.message || "Failed to reject donation");
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
      await load();
    } catch (err) {
      alert(err.message || "Failed to complete donation");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Donations Management</h1>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading donations...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
          {error}
        </div>
      )}

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
                <tr key={d.id} className="border-t hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-slate-900">{d.user_name}</div>
                      <div className="text-xs text-slate-500">{d.user_email}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-700">{d.event_title ?? "-"}</div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${statusStyle[d.status]}`}
                    >
                      {d.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="font-mono">{d.quantity_ml ?? "-"}</span>
                  </td>

                  <td className="p-3 space-x-2">
                    {d.status === "pending" && (
                      <>
                        <button
                          disabled={loadingId === d.id}
                          onClick={() => approveDonation(d.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loadingId === d.id ? "..." : "Approve"}
                        </button>

                        <button
                          disabled={loadingId === d.id}
                          onClick={() => rejectDonation(d.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loadingId === d.id ? "..." : "Reject"}
                        </button>
                      </>
                    )}

                    {d.status === "approved" && (
                      <button
                        disabled={loadingId === d.id}
                        onClick={() => completeDonation(d)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingId === d.id ? "..." : "Complete"}
                      </button>
                    )}

                    {(d.status === "completed" || d.status === "rejected") && (
                      <span className="text-slate-400 text-xs">No actions</span>
                    )}
                  </td>
                </tr>
              ))}

              {donations.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="text-slate-400">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-slate-500 font-medium">No donations found</p>
                      <p className="text-slate-400 text-sm mt-1">Donations will appear here once users register for events</p>
                    </div>
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