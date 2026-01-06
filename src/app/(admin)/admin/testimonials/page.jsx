"use client";

import { useEffect, useState } from "react";
import {
  getAllTestimonials,
  approveTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "@/services/testimonials";
import { CheckCircle, Trash2, Edit3, Star, X } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ content: "", rating: 5 });

  async function load() {
    setLoading(true);
    try {
      const res = await getAllTestimonials();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id) {
    if (!confirm("Approve this testimonial?")) return;
    await approveTestimonial(id);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    await deleteTestimonial(id);
    load();
  }

  async function handleUpdate(id) {
    if (!form.content || form.rating < 1 || form.rating > 5) {
      alert("Content is required and rating must be 1–5");
      return;
    }

    await updateTestimonial(id, form);
    setEditingId(null);
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Testimonials Moderation
      </h1>

      {items.length === 0 ? (
        <p className="text-slate-600">No testimonials found.</p>
      ) : (
        <div className="space-y-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl p-6 shadow border"
            >
              <div className="flex justify-between items-start gap-6">
                {/* LEFT CONTENT */}
                <div className="flex-1">
                  {/* EDIT MODE */}
                  {editingId === t.id ? (
                    <>
                      <textarea
                        value={form.content}
                        onChange={(e) =>
                          setForm({ ...form, content: e.target.value })
                        }
                        className="w-full border rounded-lg p-3 mb-3"
                        rows={4}
                      />

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">
                          Rating:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={form.rating}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              rating: Number(e.target.value),
                            })
                          }
                          className="w-20 border rounded p-1"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(t.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-gray-300 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-800 mb-3">
                        “{t.content}”
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="font-medium">
                          {t.users?.full_name || "Unknown User"}
                        </span>

                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-500"
                            />
                          ))}
                        </div>

                        {t.is_approved ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Approved
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* ACTIONS */}
                {editingId !== t.id && (
                  <div className="flex flex-col gap-2">
                    {!t.is_approved && (
                      <button
                        onClick={() => handleApprove(t.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingId(t.id);
                        setForm({
                          content: t.content,
                          rating: t.rating,
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
