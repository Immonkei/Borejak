"use client";

import { useEffect, useState } from "react";
import { Mail, Users } from "lucide-react";
import { getNewsletterSubscribers } from "@/services/newsletter";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getNewsletterSubscribers()
      .then(setSubscribers)
      .catch(err => {
        console.error(err);
        setError("Failed to load subscribers");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Loading newsletter subscribers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Mail className="text-red-600" />
        Newsletter Subscribers
      </h1>

      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-6 text-slate-500">
            No subscribers yet.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                  #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                  Subscribed At
                </th>
              </tr>
            </thead>

            <tbody>
              {subscribers.map((s, index) => (
                <tr
                  key={s.id}
                  className="border-b last:border-b-0 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 text-sm">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {s.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center gap-2 text-slate-600">
        <Users className="w-4 h-4 text-red-500" />
        Total subscribers:{" "}
        <span className="font-semibold">
          {subscribers.length}
        </span>
      </div>
    </div>
  );
}
