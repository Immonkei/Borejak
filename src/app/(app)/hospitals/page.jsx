"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Search,
  ArrowRight,
  Heart,
  Droplets,
  X
} from "lucide-react";
import { getHospitals } from "@/services/hospitals";

export default function HospitalsPage() {
  const router = useRouter();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadHospitals();
  }, []);

  async function loadHospitals() {
    setLoading(true);
    const data = await getHospitals();
    const activeHospitals = data.filter(h => h.is_active !== false);
    setHospitals(activeHospitals);
    setLoading(false);
  }

  const filteredHospitals = hospitals.filter(hospital => {
    const query = searchQuery.toLowerCase();
    return (
      hospital.name?.toLowerCase().includes(query) ||
      hospital.address?.toLowerCase().includes(query) ||
      hospital.description?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
           
            
            <Building2 className="w-8 h-8 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-slate-600 mt-6 font-medium animate-pulse">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-rose-600"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-5 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-20 right-40 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="relative text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4 animate-fade-in-up">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Building2 className="w-9 h-9" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black">
                Healthcare Facilities
              </h1>
            </div>
            <p className="text-xl text-red-100 max-w-2xl animate-fade-in-up animation-delay-100">
              Find trusted hospitals and medical centers for blood donation services.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8 animate-fade-in-up animation-delay-200">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Building2 className="w-5 h-5" />
                <span className="font-semibold">{hospitals.length} Hospitals</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">24/7 Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Droplets className="w-5 h-5" />
                <span className="font-semibold">Blood Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="mb-10 animate-fade-in-up">
          <div className="relative max-w-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-red-600" />
            </div>
            <input
              type="text"
              placeholder="Search hospitals by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-20 pr-12 py-5 rounded-2xl border-2 border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 shadow-lg shadow-slate-200/50 transition-all duration-300 text-lg"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-100 hover:bg-red-100 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-4 text-slate-600 font-medium">
              Found <span className="text-red-600 font-bold">{filteredHospitals.length}</span> hospitals
            </p>
          )}
        </div>

        {/* Grid */}
        {filteredHospitals.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No hospitals found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHospitals.map((hospital, index) => (
              <div
                key={hospital.id}
                onClick={() => router.push(`/hospitals/${hospital.id}`)}
                className="group bg-white rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-red-200/50 transition-all duration-500 overflow-hidden border border-slate-100 cursor-pointer transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {hospital.image_url ? (
                    <img
                      src={hospital.image_url}
                      alt={hospital.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-400 via-red-500 to-rose-500 flex items-center justify-center">
                      <Building2 className="w-20 h-20 text-white/30" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    Active
                  </div>
                  
                  {/* Quick action on hover */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <p className="text-white font-medium text-sm">Click to view details</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
                    {hospital.name}
                  </h2>

                  {hospital.description && (
                    <p className="text-slate-500 text-sm mb-5 line-clamp-2">
                      {hospital.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    {hospital.address && (
                      <div className="flex items-start gap-3 text-sm text-slate-600 group/item hover:text-red-600 transition-colors">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:bg-red-100 transition-colors">
                          <MapPin className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="line-clamp-2 pt-1">{hospital.address}</span>
                      </div>
                    )}

                    {hospital.phone && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-red-500" />
                        </div>
                        <a
                          href={`tel:${hospital.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-red-600 transition-colors"
                        >
                          {hospital.phone}
                        </a>
                      </div>
                    )}

                    {hospital.email && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-red-500" />
                        </div>
                        <a
                          href={`mailto:${hospital.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="truncate hover:text-red-600 transition-colors"
                        >
                          {hospital.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/hospitals/${hospital.id}`);
                    }}
                    className="mt-6 w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 group/btn"
                  >
                    View Details
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
      `}</style>
    </div>
  );
}