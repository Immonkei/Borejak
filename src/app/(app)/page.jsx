"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Droplet, Heart, Users, Calendar, Building2, Award, ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";

export default function HomePage() {
  const { loading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) return;

    // 🔒 ADMIN RULE (TOP PRIORITY)
    if (user?.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (typeof user?.profile_completed !== "boolean") return;

    if (!user?.profile_completed) {
      router.replace("/complete-profile");
    } else {
      router.replace("/profile");
    }
  }, [loading, isAuthenticated, user, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Heart className="w-4 h-4" />
                  Save Lives Today
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Donate Blood,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600">
                    {" "}Save Lives
                  </span>
                </h1>
                
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Join our community of heroes. Your single donation can save up to three lives. 
                  Find nearby blood drives, book appointments, and track your donation history.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-md border border-slate-200"
                  >
                    Sign In
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div>
                    <div className="text-3xl font-bold text-slate-900">10K+</div>
                    <div className="text-sm text-slate-600">Donors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">50K+</div>
                    <div className="text-sm text-slate-600">Lives Saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">100+</div>
                    <div className="text-sm text-slate-600">Hospitals</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Hero Image/Illustration */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-red-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                    {/* Blood Drop Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="bg-white rounded-full p-8 shadow-xl">
                        <Droplet className="w-24 h-24 text-red-600 fill-red-600" />
                      </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">Quick Registration</div>
                            <div className="text-sm text-slate-600">Sign up in 2 minutes</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">Easy Booking</div>
                            <div className="text-sm text-slate-600">Schedule appointments online</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Award className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">Track Impact</div>
                            <div className="text-sm text-slate-600">See lives you've saved</div>
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

        {/* Features Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Donate Blood?</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Every donation makes a difference. Here's how you can help.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="bg-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Save Lives</h3>
                <p className="text-slate-600 leading-relaxed">
                  One donation can save up to three lives. Blood is needed every two seconds in emergency situations.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Help Community</h3>
                <p className="text-slate-600 leading-relaxed">
                  Support your local hospitals and community members in need during critical times.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
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
        <div className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-xl text-slate-600">Simple steps to start saving lives</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Up</h3>
                <p className="text-slate-600">Create your free account and complete your profile</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Find Events</h3>
                <p className="text-slate-600">Browse nearby blood donation drives and events</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Book Slot</h3>
                <p className="text-slate-600">Schedule an appointment at your convenience</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-2xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Donate</h3>
                <p className="text-slate-600">Visit the center and make your life-saving donation</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-purple-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Join thousands of donors who are saving lives every day. Your journey starts here.
            </p>
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-white hover:bg-slate-100 text-red-600 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl inline-flex items-center gap-2"
            >
              Register Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>       
      </div>
  );
}