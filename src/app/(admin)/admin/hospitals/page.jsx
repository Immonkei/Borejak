"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Building2,
  X,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image,
  Edit,
} from "lucide-react";
import {
  getHospitals,
  createHospital,
  deleteHospital,
  updateHospital,
  uploadHospitalImage,
} from "@/services/hospitals";

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editingHospital, setEditingHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getHospitals();
    setHospitals(data);
    setLoading(false);
  }

  async function addHospital() {
    if (!formData.name.trim()) return;
    setSubmitting(true);
    try {
      await createHospital(formData);
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        image_url: "",
      });
      setShowModal(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  }

 async function saveHospital() {
  if (!formData.name.trim()) return;
  setSubmitting(true);

  try {
    let imageUrl = formData.image_url || null;

    // ✅ upload image if selected
    if (imageFile) {
      imageUrl = await uploadHospitalImage(imageFile);
    }

    const payload = {
      ...formData,
      image_url: imageUrl,
    };

    if (editingHospital) {
      await updateHospital(editingHospital.id, payload);
    } else {
      await createHospital(payload);
    }

    // reset
    setImageFile(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      image_url: "",
    });

    setShowModal(false);
    setEditingHospital(null);
    await load();
  } finally {
    setSubmitting(false);
  }
}


  function openEditModal(hospital) {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name || "",
      address: hospital.address || "",
      phone: hospital.phone || "",
      email: hospital.email || "",
      description: hospital.description || "",
      image_url: hospital.image_url || "",
    });
    setShowModal(true);
  }

  function openAddModal() {
    setEditingHospital(null);
    setImageFile(null); 
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      image_url: "",
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingHospital(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      image_url: "",
    });
  }

  async function remove(id) {
    setDeletingId(id);
    try {
      await deleteHospital(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-red-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-3 rounded-xl shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Hospital Management
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Manage your healthcare facilities
              </p>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Hospital
          </button>
        </div>

        {/* Hospitals Grid */}
        {hospitals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">
              No hospitals yet
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Add your first hospital to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Hospital Image */}
                {hospital.image_url ? (
                  <div className="h-48 bg-slate-200 overflow-hidden">
                    <img
                      src={hospital.image_url}
                      alt={hospital.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-red-300" />
                  </div>
                )}

                {/* Hospital Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {hospital.name}
                  </h3>

                  {hospital.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {hospital.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {hospital.address && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span>{hospital.address}</span>
                      </div>
                    )}
                    {hospital.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        <span>{hospital.phone}</span>
                      </div>
                    )}
                    {hospital.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{hospital.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        hospital.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {hospital.is_active ? "Active" : "Inactive"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(hospital)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => remove(hospital.id)}
                        disabled={deletingId === hospital.id}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === hospital.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Hospital Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingHospital ? "Edit Hospital" : "Add New Hospital"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hospital Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., City General Hospital"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g., 123 Main Street, City, State"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +1 234 567 8900"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., info@hospital.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hospital Image
                  </label>

                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      className="h-40 w-full object-cover rounded-xl mb-3"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImageFile(file);
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the hospital..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveHospital}
                  disabled={!formData.name.trim() || submitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      {editingHospital ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {editingHospital ? (
                        <Edit className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      {editingHospital ? "Update Hospital" : "Add Hospital"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
