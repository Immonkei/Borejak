"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Droplets,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Clock,
  Users,
  Heart,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function HospitalDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hospital, setHospital] = useState(null);
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push("/hospitals");
      return;
    }
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const [hospitalRes, eventsRes, marketRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hospitals/${id}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?hospital=${id}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blood-market?hospital=${id}`)
      ]);

      const hospitalJson = await hospitalRes.json();
      const eventsJson = await eventsRes.json();
      const marketJson = await marketRes.json();

      setHospital(hospitalJson.data);
      setEvents(eventsJson.data || []);
      setRequests(marketJson.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getBloodLevelColor = (amount) => {
    if (amount < 500) return { bg: "from-red-500 to-rose-500", text: "text-red-600", label: "Critical" };
    if (amount < 1000) return { bg: "from-amber-500 to-yellow-500", text: "text-amber-600", label: "Low" };
    return { bg: "from-emerald-500 to-green-500", text: "text-emerald-600", label: "Good" };
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "urgent": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <Building2 className="w-8 h-8 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-slate-600 mt-6 font-medium animate-pulse">Loading hospital details...</p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-slate-700 text-xl font-semibold">Hospital not found</p>
          <button 
            onClick={() => router.push("/hospitals")} 
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
          >
            Back to hospitals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {hospital.image_url ? (
            <>
              <img 
                src={hospital.image_url} 
                alt={hospital.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-800/70 to-red-900/90"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-600 via-red-500 to-rose-600"></div>
          )}
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push("/hospitals")}
              className="group flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Back to hospitals</span>
            </button>

            {/* Status Badge */}
            <div className="mb-6 animate-fade-in">
              <span className="px-4 py-2 bg-emerald-500/90 text-white rounded-full text-sm font-bold backdrop-blur-sm">
                ✓ Active Hospital
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 animate-fade-in-up">
              {hospital.name}
            </h1>
            
            {hospital.description && (
              <p className="text-white/80 text-lg md:text-xl max-w-3xl leading-relaxed animate-fade-in-up animation-delay-100">
                {hospital.description}
              </p>
            )}

            {/* Contact Info Pills */}
            <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up animation-delay-200">
              {hospital.address && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">{hospital.address}</span>
                </div>
              )}
              {hospital.phone && (
                <a href={`tel:${hospital.phone}`} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
                  <Phone className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">{hospital.phone}</span>
                </a>
              )}
              {hospital.email && (
                <a href={`mailto:${hospital.email}`} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
                  <Mail className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">{hospital.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Blood Inventory Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 transform hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Blood Inventory</h2>
              <p className="text-slate-500 text-sm">Current blood stock levels</p>
            </div>
          </div>

          {hospital.blood_inventory && Object.keys(hospital.blood_inventory).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(hospital.blood_inventory).map(([type, amount]) => {
                const level = getBloodLevelColor(amount);
                return (
                  <div
                    key={type}
                    className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${level.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                        <span className="text-2xl font-black text-red-600">{type}</span>
                      </div>
                      <p className={`text-2xl font-bold ${level.text}`}>
                        {amount} <span className="text-sm font-medium">ml</span>
                      </p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        amount < 500 ? "bg-red-100 text-red-700" :
                        amount < 1000 ? "bg-amber-100 text-amber-700" :
                        "bg-emerald-100 text-emerald-700"
                      }`}>
                        {level.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No inventory data available</p>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donation Events */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 hover:shadow-2xl transition-all duration-500 animate-fade-in-up animation-delay-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Donation Events</h2>
                <p className="text-slate-500 text-sm">Upcoming blood drives</p>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="group p-5 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl cursor-pointer hover:from-red-100 hover:to-rose-100 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-red-500" />
                          {new Date(event.event_date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blood Requests */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 hover:shadow-2xl transition-all duration-500 animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Blood Requests</h2>
                  <p className="text-slate-500 text-sm">Active urgent requests</p>
                </div>
              </div>
            </div>

            {/* Request Blood Button */}
            <button
              onClick={() => router.push(`/blood-market/create?hospital=${id}`)}
              className="w-full mb-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Request Blood
            </button>

            {requests.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No active requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => router.push(`/blood-market/${req.id}`)}
                    className="group p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl cursor-pointer hover:from-red-50 hover:to-rose-50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <span className="text-xl font-black text-red-600">{req.blood_type}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {req.quantity_ml} ml needed
                          </p>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyStyle(req.urgency)}`}>
                            {req.urgency?.charAt(0).toUpperCase() + req.urgency?.slice(1)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl shadow-xl p-8 text-white animate-fade-in-up animation-delay-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
              <p className="text-red-100">Contact this hospital directly for blood donation inquiries</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {hospital.phone && (
                <a 
                  href={`tel:${hospital.phone}`}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              )}
              {hospital.email && (
                <a 
                  href={`mailto:${hospital.email}`}
                  className="flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}