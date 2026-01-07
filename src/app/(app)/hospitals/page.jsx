"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Search,
  ArrowRight
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
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Healthcare Facilities
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl">
            Find trusted hospitals and medical centers for blood donation services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search hospitals by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-slate-600 text-sm">
              Found {filteredHospitals.length} hospitals
            </p>
          )}
        </div>

        {/* Grid */}
        {filteredHospitals.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">
              No hospitals found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                onClick={() => router.push(`/hospitals/${hospital.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {hospital.image_url ? (
                    <img
                      src={hospital.image_url}
                      alt={hospital.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Active
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600">
                    {hospital.name}
                  </h2>

                  {hospital.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {hospital.description}
                    </p>
                  )}

                  <div className="space-y-2.5">
                    {hospital.address && (
                      <div className="flex gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="line-clamp-2">{hospital.address}</span>
                      </div>
                    )}

                    {hospital.phone && (
                      <div className="flex gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <a
                          href={`tel:${hospital.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-blue-600"
                        >
                          {hospital.phone}
                        </a>
                      </div>
                    )}

                    {hospital.email && (
                      <div className="flex gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <a
                          href={`mailto:${hospital.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="truncate hover:text-blue-600"
                        >
                          {hospital.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/hospitals/${hospital.id}`);
                    }}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
