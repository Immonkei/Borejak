"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import { Droplet, Heart, Users, Calendar, Building2, Award, ArrowRight, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { loading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <Droplet className="w-6 h-6 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Heart className="w-4 h-4 fill-red-500" />
                Save Lives Today
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                Donate Blood,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                  {" "}Save Lives
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Join our community of heroes. Your single donation can save up to three lives. 
                Find nearby blood drives, book appointments, and track your donation history.
              </p>

              {/* Different buttons for authenticated vs non-authenticated users */}
              {isAuthenticated ? (
                // Logged in user - Show quick actions
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/events"
                    className="group bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-red-500/25 hover:shadow-red-500/40 flex items-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Find Events
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/blood-market"
                    className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg border-2 border-slate-200 hover:border-red-200 flex items-center gap-2"
                  >
                    <Droplet className="w-5 h-5" />
                    Blood Market
                  </Link>
                </div>
              ) : (
                // Not logged in - Show auth buttons
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => router.push("/register")}
                    className="group bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-red-500/25 hover:shadow-red-500/40 flex items-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg border-2 border-slate-200 hover:border-red-200"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Welcome message for logged in users */}
              {isAuthenticated && user && (
                <div className="mt-6 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-red-100">
                  <p className="text-slate-600">
                    Welcome back, <span className="font-bold text-red-600">{user.full_name || user.email?.split('@')[0]}</span>! 👋
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl">
                  <div className="text-3xl font-black text-red-600">10K+</div>
                  <div className="text-sm text-slate-600 font-medium">Donors</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl">
                  <div className="text-3xl font-black text-red-600">50K+</div>
                  <div className="text-sm text-slate-600 font-medium">Lives Saved</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl">
                  <div className="text-3xl font-black text-red-600">100+</div>
                  <div className="text-sm text-slate-600 font-medium">Hospitals</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Illustration */}
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-8 shadow-2xl shadow-red-500/30">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                  {/* Blood Drop Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white rounded-full p-8 shadow-xl animate-pulse-slow">
                      <Droplet className="w-24 h-24 text-red-600 fill-red-600" />
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-xl">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Quick Registration</div>
                          <div className="text-sm text-slate-500">Sign up in 2 minutes</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-3 rounded-xl">
                          <Calendar className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Easy Booking</div>
                          <div className="text-sm text-slate-500">Schedule appointments online</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-3 rounded-xl">
                          <Award className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Track Impact</div>
                          <div className="text-sm text-slate-500">See lives you've saved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Logged In Users */}
      {isAuthenticated && (
        <div className="bg-white py-12 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/events"
                className="group p-6 bg-red-50 hover:bg-red-100 rounded-2xl text-center transition-all hover:-translate-y-1"
              >
                <Calendar className="w-8 h-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-slate-800">Find Events</div>
              </Link>
              <Link
                href="/hospitals"
                className="group p-6 bg-red-50 hover:bg-red-100 rounded-2xl text-center transition-all hover:-translate-y-1"
              >
                <Building2 className="w-8 h-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-slate-800">Hospitals</div>
              </Link>
              <Link
                href="/blood-market"
                className="group p-6 bg-red-50 hover:bg-red-100 rounded-2xl text-center transition-all hover:-translate-y-1"
              >
                <Droplet className="w-8 h-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-slate-800">Blood Market</div>
              </Link>
              <Link
                href="/profile"
                className="group p-6 bg-red-50 hover:bg-red-100 rounded-2xl text-center transition-all hover:-translate-y-1"
              >
                <Users className="w-8 h-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-slate-800">My Profile</div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Why Donate Blood?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Every donation makes a difference. Here's how you can help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-red-50 to-rose-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-red-200/50 transition-all duration-500 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-red-600 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Save Lives</h3>
              <p className="text-slate-600 leading-relaxed">
                One donation can save up to three lives. Blood is needed every two seconds in emergency situations.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-red-50 to-rose-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-red-200/50 transition-all duration-500 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-red-600 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Help Community</h3>
              <p className="text-slate-600 leading-relaxed">
                Support your local hospitals and community members in need during critical times.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-red-50 to-rose-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-red-200/50 transition-all duration-500 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-red-600 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Safe Process</h3>
              <p className="text-slate-600 leading-relaxed">
                Certified facilities, sterile equipment, and professional staff ensure your safety.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-slate-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Simple steps to start saving lives</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30 text-white text-3xl font-black group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Up</h3>
              <p className="text-slate-600">Create your free account and complete your profile</p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30 text-white text-3xl font-black group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Find Events</h3>
              <p className="text-slate-600">Browse nearby blood donation drives and events</p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30 text-white text-3xl font-black group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book Slot</h3>
              <p className="text-slate-600">Schedule an appointment at your convenience</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30 text-white text-3xl font-black group-hover:scale-110 transition-transform">
                ✓
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Donate</h3>
              <p className="text-slate-600">Visit the center and make your life-saving donation</p>
            </div>
          </div>
        </div>
      </div>

      <TestimonialsSection />

      {/* CTA Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Join thousands of donors who are saving lives every day. Your journey starts here.
            </p>
            <button
              onClick={() => router.push("/register")}
              className="group bg-white hover:bg-red-50 text-red-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl inline-flex items-center gap-2"
            >
              Register Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

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
            transform: translateY(30px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}