"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, X, MapPin, Clock, Users, Edit, Building2 } from "lucide-react";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/services/events";
import { getHospitals } from "@/services/hospitals";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    hospital_id: "",
    max_participants: "",
    status: "upcoming",
    image_url: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [eventsData, hospitalsData] = await Promise.all([
      getEvents(),
      getHospitals()
    ]);
    setEvents(eventsData);
    setHospitals(hospitalsData);
    setLoading(false);
  }

  async function load() {
    const data = await getEvents();
    setEvents(data);
  }

  async function saveEvent() {
    if (!formData.title.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        hospital_id: formData.hospital_id || null,
      };
      
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
      } else {
        await createEvent(payload);
      }
      closeModal();
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id) {
    setDeletingId(id);
    try {
      await deleteEvent(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  function openEditModal(event) {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date ? event.event_date.split('T')[0] : "",
      location: event.location || "",
      hospital_id: event.hospital_id || "",
      max_participants: event.max_participants || "",
      status: event.status || "upcoming",
      image_url: event.image_url || "",
    });
    setShowModal(true);
  }

  function openAddModal() {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      event_date: "",
      location: "",
      hospital_id: "",
      max_participants: "",
      status: "upcoming",
      image_url: "",
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      event_date: "",
      location: "",
      hospital_id: "",
      max_participants: "",
      status: "upcoming",
      image_url: "",
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-slate-100 text-slate-600';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getHospitalName = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital ? hospital.name : 'No hospital assigned';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-purple-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading events...</p>
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
            <div className="bg-purple-600 p-3 rounded-xl shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Event Management</h1>
              <p className="text-slate-600 text-sm mt-1">
                Manage blood donation events and campaigns
              </p>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">No events yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first blood donation event</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Event Image */}
                {event.image_url ? (
                  <div className="h-48 bg-slate-200 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-purple-300" />
                  </div>
                )}

                {/* Event Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {event.event_date && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.hospital_id && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span>{getHospitalName(event.hospital_id)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4 flex-shrink-0 text-slate-400" />
                      <span>
                        {event.registered_count || 0} / {event.max_participants || '∞'} registered
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Upcoming'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => remove(event.id)}
                        disabled={deletingId === event.id}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === event.id ? (
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

        {/* Add/Edit Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingEvent ? "Edit Event" : "Add New Event"}
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Event Title <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Blood Donation Drive 2024"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Event Date & Max Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Event Date
                    </label>
                    <input
                      type="datetime-local"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      placeholder="e.g., 100"
                      min="1"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Location & Hospital */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., City Community Center"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Hospital
                    </label>
                    <select
                      name="hospital_id"
                      value={formData.hospital_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select a hospital (optional)</option>
                      {hospitals.map(hospital => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="e.g., https://example.com/event.jpg"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                    placeholder="Brief description of the event..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
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
                  onClick={saveEvent}
                  disabled={!formData.title.trim() || submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      {editingEvent ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {editingEvent ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      {editingEvent ? "Update Event" : "Add Event"}
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