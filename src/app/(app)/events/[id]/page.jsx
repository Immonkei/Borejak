"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Hourglass,
  Heart,
  Share2,
  Droplets,
  AlertCircle,
} from "lucide-react";
import { getEventById, registerForEvent } from "@/services/events";
import { useAuth } from "@/context/AuthContext";
import { useDonationCooldown } from "@/hooks/useDonationCooldown"; // 🔧 ADD cooldown hook

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { canDonate, remainingDays, nextEligibleDate } = useDonationCooldown(); // 🔧 ADD cooldown

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  async function register() {
    if (!user?.profile_completed) {
      alert("Please complete your profile before registering.");
      router.push("/profile");
      return;
    }

    // 🔧 CHECK COOLDOWN before registration
    if (!canDonate) {
      alert(`You must wait ${remainingDays} more days before your next donation. Recovery period in progress.`);
      return;
    }

    try {
      setRegistering(true);
      await registerForEvent(id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await loadEvent();
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  }

  const getRegistrationButton = () => {
    const regStatus = event.user_registration_status;
    const isRegistered = event.is_registered;
    const isFull = event.max_participants && event.registered_count >= event.max_participants;

    if (isRegistered || regStatus) {
      if (regStatus === "pending") {
        return (
          <button disabled className="group w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 flex items-center justify-center gap-3 text-lg border-2 border-amber-200 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
            <Hourglass className="w-6 h-6 animate-pulse" />
            <span>Pending Approval</span>
          </button>
        );
      }
      if (regStatus === "approved" || regStatus === "completed") {
        return (
          <button disabled className="group w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 flex items-center justify-center gap-3 text-lg border-2 border-emerald-200 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
            <CheckCircle className="w-6 h-6" />
            <span>Registration Approved!</span>
          </button>
        );
      }
      if (regStatus === "rejected") {
        return (
          <button disabled className="group w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-red-100 to-rose-100 text-red-700 flex items-center justify-center gap-3 text-lg border-2 border-red-200 shadow-lg">
            <XCircle className="w-6 h-6" />
            <span>Registration Rejected</span>
          </button>
        );
      }
      return (
        <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-100 text-slate-500 text-lg border-2 border-slate-200">
          Already Registered
        </button>
      );
    }

    // 🔧 CHECK COOLDOWN PERIOD
    if (!canDonate) {
      return (
        <button
          disabled
          title={`Recovery period: ${remainingDays} days remaining`}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-300 text-slate-600 text-lg border-2 border-slate-300 cursor-not-allowed"
        >
          Recovery Period Active ({remainingDays}d)
        </button>
      );
    }

    if (isFull) {
      return (
        <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-100 text-slate-400 text-lg border-2 border-slate-200">
          Event Full
        </button>
      );
    }

    return (
      <button
        onClick={register}
        disabled={registering}
        className={`group w-full py-4 rounded-2xl font-bold transition-all duration-500 text-lg relative overflow-hidden ${
          registering
            ? "bg-slate-300 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
        }`}
        style={{ backgroundSize: '200% 100%' }}
      >
        {registering ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-3">
            <Heart className="w-6 h-6 group-hover:animate-pulse" />
            Register for Event
            <Droplets className="w-5 h-5 opacity-70" />
          </span>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <Droplets className="w-8 h-8 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-slate-600 mt-6 font-medium animate-pulse">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-red-500 text-xl font-semibold">{error || "Event not found"}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const regStatus = event.user_registration_status;
  const progressPercent = event.max_participants 
    ? Math.min((event.registered_count / event.max_participants) * 100, 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className="bg-white border-l-4 border-green-500 rounded-xl shadow-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Registration Submitted!</p>
              <p className="text-sm text-slate-500">Waiting for admin approval</p>
            </div>
          </div>
        </div>
      )}

      {/* 🔧 Cooldown Alert */}
      {!canDonate && (
        <div className="bg-amber-50 border-b-2 border-amber-200 py-4 px-6">
          <div className="max-w-5xl mx-auto flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Recovery Period Active</p>
              <p className="text-amber-700 text-sm">
                You can donate again in <strong>{remainingDays} days</strong> ({nextEligibleDate?.toLocaleDateString()})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background Image or Gradient */}
        <div className="absolute inset-0">
          {event.image_url ? (
            <>
              <img 
                src={event.image_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-800/70 to-red-900/90"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-600 via-red-500 to-rose-600"></div>
          )}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-40 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="relative px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Back to events</span>
            </button>

            {/* Event Status Badge */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                event.status === "upcoming" ? "bg-blue-500/90 text-white" :
                event.status === "ongoing" ? "bg-emerald-500/90 text-white" :
                event.status === "completed" ? "bg-slate-500/90 text-white" : 
                "bg-red-500/90 text-white"
              } animate-fade-in`}>
                {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
              </span>
              
              {regStatus && (
                <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm animate-fade-in ${
                  regStatus === "approved" || regStatus === "completed" ? "bg-green-500/90 text-white" :
                  regStatus === "rejected" ? "bg-red-500/90 text-white" : 
                  "bg-yellow-500/90 text-white"
                }`}>
                  {regStatus === "approved" || regStatus === "completed" ? "✓ Approved" :
                   regStatus === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 animate-fade-in-up">
              {event.title}
            </h1>
            
            {/* Description */}
            {event.description && (
              <p className="text-white/80 text-lg md:text-xl max-w-3xl leading-relaxed animate-fade-in-up animation-delay-100">
                {event.description}
              </p>
            )}

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up animation-delay-200">
              {event.event_date && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 transform hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Event Details</h2>
              </div>

              <div className="space-y-5">
                {/* Date & Time */}
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl hover:from-red-100 hover:to-rose-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Date & Time</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                    <p className="text-red-600 font-medium">
                      {new Date(event.event_date).toLocaleTimeString("en-US", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl hover:from-red-100 hover:to-rose-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Location</p>
                      <p className="text-lg font-semibold text-slate-800">{event.location}</p>
                    </div>
                  </div>
                )}

                {/* Hospital */}
                {event.hospital_name && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl hover:from-red-100 hover:to-rose-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Building2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Hospital</p>
                      <p className="text-lg font-semibold text-slate-800">{event.hospital_name}</p>
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl hover:from-red-100 hover:to-rose-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Users className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium">Participants</p>
                    <p className="text-lg font-semibold text-slate-800">
                      <span className="text-red-600">{event.registered_count || 0}</span>
                      {event.max_participants && (
                        <span className="text-slate-400"> / {event.max_participants}</span>
                      )}
                      <span className="text-slate-500 font-normal ml-2">registered</span>
                    </p>
                    
                    {/* Progress Bar */}
                    {event.max_participants && (
                      <div className="mt-3">
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                          {Math.round(progressPercent)}% capacity filled
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About Event Card */}
            {event.description && (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 transform hover:shadow-2xl transition-all duration-500 animate-fade-in-up animation-delay-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">About This Event</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{event.description}</p>
              </div>
            )}
          </div>

          {/* Right - Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sticky top-6 transform hover:shadow-2xl transition-all duration-500 animate-fade-in-up animation-delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Registration</h2>
              </div>

              {/* Status Info Boxes */}
              {regStatus === "pending" && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 mb-6 animate-pulse-slow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Hourglass className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-800 text-lg">Awaiting Approval</p>
                      <p className="text-amber-600 mt-1">
                        Your registration is being reviewed by the admin team.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(regStatus === "approved" || regStatus === "completed") && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-800 text-lg">✅ You're In! 🎉</p>
                      <p className="text-emerald-600 mt-1">
                        Your registration has been approved. See you at the event!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {regStatus === "rejected" && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-red-800 text-lg">Not Approved</p>
                      <p className="text-red-600 mt-1">
                        Your registration was not approved. Please contact support.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Button */}
              {(event.status === "upcoming" || event.status === "ongoing") && (
                <>
                  {getRegistrationButton()}
                  
                  {/* Share Button */}
                  <button className="w-full mt-4 py-3 rounded-2xl font-semibold border-2 border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Event
                  </button>
                </>
              )}

              {event.status === "completed" && (
                <div className="text-center py-6 bg-slate-50 rounded-2xl">
                  <p className="text-slate-500 font-medium">This event has ended</p>
                </div>
              )}

              {event.status === "cancelled" && (
                <div className="text-center py-6 bg-red-50 rounded-2xl">
                  <p className="text-red-500 font-medium">This event has been cancelled</p>
                </div>
              )}

              {/* Blood Type Info */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-slate-500 text-sm text-center">
                  All blood types are welcome! 🩸
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(100px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
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
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}