"use client";

import { useEffect, useState } from "react";
import { Building2, MapPin, Phone, Mail, Search, ArrowRight } from "lucide-react";
import { getHospitals } from "@/services/hospitals";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadHospitals();
  }, []);

  async function loadHospitals() {
    setLoading(true);
    const data = await getHospitals();
    // Only show active hospitals to users
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Healthcare Facilities</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl">
            Find trusted hospitals and medical centers for blood donation services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search hospitals by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-slate-700"
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-slate-600 text-sm">
              Found {filteredHospitals.length} {filteredHospitals.length === 1 ? 'hospital' : 'hospitals'}
            </p>
          )}
        </div>

        {/* Hospitals Grid */}
        {filteredHospitals.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">
              {searchQuery ? "No hospitals found" : "No hospitals available"}
            </h3>
            <p className="text-slate-500">
              {searchQuery 
                ? "Try adjusting your search terms." 
                : "There are no hospitals registered at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-slate-100"
              >
                {/* Hospital Image */}
                <div className="relative h-48 overflow-hidden">
                  {hospital.image_url ? (
                    <img
                      src={hospital.image_url}
                      alt={hospital.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  
                  {/* Active Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Active
                  </div>
                </div>

                {/* Hospital Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {hospital.name}
                  </h2>

                  {hospital.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {hospital.description}
                    </p>
                  )}

                  <div className="space-y-2.5">
                    {/* Address */}
                    {hospital.address && (
                      <div className="flex items-start gap-2.5 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{hospital.address}</span>
                      </div>
                    )}

                    {/* Phone */}
                    {hospital.phone && (
                      <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <a 
                          href={`tel:${hospital.phone}`}
                          className="hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {hospital.phone}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {hospital.email && (
                      <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <a 
                          href={`mailto:${hospital.email}`}
                          className="hover:text-blue-600 transition-colors truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {hospital.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Blood Inventory Indicator */}
                  {hospital.blood_inventory && (
                    <div className="mt-5 p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
                        <span>Blood Inventory Available</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {Object.entries(hospital.blood_inventory).map(([type, count]) => (
                          <div 
                            key={type} 
                            className="bg-white rounded-lg p-2 text-center border border-blue-100"
                          >
                            <div className="text-xs font-bold text-blue-600">{type}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg">
                    View Details
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Need to Donate Blood?
            </h2>
            <p className="text-slate-600 mb-6">
              Contact any of these hospitals directly to schedule your blood donation appointment. 
              Your donation can save up to three lives!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-blue-50 rounded-xl px-6 py-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {hospitals.length}
                </div>
                <div className="text-sm text-slate-600">Active Hospitals</div>
              </div>
              <div className="bg-green-50 rounded-xl px-6 py-4">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  24/7
                </div>
                <div className="text-sm text-slate-600">Available Service</div>
              </div>
              <div className="bg-red-50 rounded-xl px-6 py-4">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  Safe
                </div>
                <div className="text-sm text-slate-600">Verified Centers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}