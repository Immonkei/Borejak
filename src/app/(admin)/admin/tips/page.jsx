"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, ToggleLeft, ToggleRight, AlertCircle, Image as ImageIcon } from "lucide-react";
import {
  getTips,
  createTip,
  deleteTip,
  updateTip,
} from "@/services/tips";

export default function AdminTipsPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    image_url: "",
    order: 0,
    is_published: true,
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getTips();
      setTips(data);
    } catch (err) {
      setError("Failed to load tips. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) || 0 : value,
    }));
  }

  async function addTip() {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required");
      return;
    }
    
    setError("");
    try {
      await createTip(form);
      setForm({ 
        title: "", 
        content: "", 
        category: "",
        image_url: "",
        order: 0,
        is_published: true 
      });
      load();
    } catch (err) {
      setError("Failed to create tip. Please try again.");
      console.error(err);
    }
  }

  async function togglePublished(tip) {
    try {
      await updateTip(tip.id, {
        ...tip,
        is_published: !tip.is_published,
      });
      load();
    } catch (err) {
      setError("Failed to update tip status.");
      console.error(err);
    }
  }

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this tip?")) return;
    
    try {
      await deleteTip(id);
      load();
    } catch (err) {
      setError("Failed to delete tip.");
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Tips Management</h1>
          <p className="text-gray-600">Create and manage donation tips for your users</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Add New Tip Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Tip
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                placeholder="Enter tip title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                value={form.title}
                onChange={updateField}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                placeholder="Enter tip content"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                value={form.content}
                onChange={updateField}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white"
                  value={form.category}
                  onChange={updateField}
                >
                  <option value="">Select category</option>
                  <option value="before">Before</option>
                  <option value="during">During</option>
                  <option value="after">After</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  name="order"
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  value={form.order}
                  onChange={updateField}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <div className="flex gap-2">
                <input
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  value={form.image_url}
                  onChange={updateField}
                />
                {form.image_url && (
                  <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={form.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e5e7eb' width='40' height='40'/%3E%3C/svg%3E"}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={updateField}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {form.is_published ? "Published" : "Draft"}
                </span>
              </label>
            </div>

            <button
              onClick={addTip}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Tip
            </button>
          </div>
        </div>

        {/* Tips List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              All Tips ({tips.length})
            </h2>
          </div>

          {tips.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-gray-400 mb-2">
                <AlertCircle className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">No tips yet</p>
              <p className="text-gray-500 text-sm">Create your first tip to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tips.map(tip => (
                    <tr key={tip.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tip.order}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{tip.title}</div>
                        <div className="text-sm text-gray-500 max-w-md truncate mt-1">
                          {tip.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tip.category ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tip.category === 'before' ? 'bg-purple-100 text-purple-800' :
                            tip.category === 'during' ? 'bg-orange-100 text-orange-800' :
                            tip.category === 'after' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tip.image_url ? (
                          <div className="w-10 h-10 border border-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={tip.image_url} 
                              alt={tip.title}
                              className="w-full h-full object-cover"
                              onError={(e) => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e5e7eb' width='40' height='40'/%3E%3C/svg%3E"}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tip.is_published 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {tip.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePublished(tip)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                            title={tip.is_published ? "Unpublish" : "Publish"}
                          >
                            {tip.is_published ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => remove(tip.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}