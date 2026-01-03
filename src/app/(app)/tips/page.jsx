"use client";

import { useEffect, useState } from "react";
import { Heart, Clock, Activity, Info } from "lucide-react";
import { getTips } from "@/services/tips";

export default function TipsPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getTips();
      setTips(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = [
    { value: "all", label: "All Tips", icon: Info, color: "red" },
    { value: "before", label: "Before Donation", icon: Clock, color: "purple" },
    { value: "during", label: "During Donation", icon: Activity, color: "orange" },
    { value: "after", label: "After Donation", icon: Heart, color: "blue" },
    { value: "general", label: "General", icon: Info, color: "gray" },
  ];

  const filteredTips = tips
    .filter(t => t.is_published)
    .filter(t => selectedCategory === "all" || t.category === selectedCategory)
    .sort((a, b) => a.order - b.order);

  const getCategoryColor = (category) => {
    switch (category) {
      case "before": return "purple";
      case "during": return "orange";
      case "after": return "blue";
      case "general": return "gray";
      default: return "gray";
    }
  };

  const getCategoryBadgeClasses = (category) => {
    const color = getCategoryColor(category);
    const classes = {
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      gray: "bg-gray-100 text-gray-700 border-gray-200",
      red: "bg-red-100 text-red-700 border-red-200",
    };
    return classes[color];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Blood Donation Tips</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Essential guidance to ensure a safe and comfortable donation experience
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? cat.value === "all"
                      ? "bg-red-600 text-white shadow-lg scale-105"
                      : getCategoryBadgeClasses(cat.value) + " shadow-md scale-105 border"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Tips Count */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredTips.length}</span> tip{filteredTips.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Tips Grid */}
        {filteredTips.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No tips available in this category</p>
            <p className="text-gray-500 text-sm mt-1">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTips.map((tip, index) => {
              const color = getCategoryColor(tip.category);
              
              return (
                <div
                  key={tip.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Card Header with Image or Icon */}
                  {tip.image_url ? (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={tip.image_url}
                        alt={tip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className={`h-32 bg-gradient-to-br ${
                      color === 'purple' ? 'from-purple-100 to-purple-200' :
                      color === 'orange' ? 'from-orange-100 to-orange-200' :
                      color === 'blue' ? 'from-blue-100 to-blue-200' :
                      'from-gray-100 to-gray-200'
                    } flex items-center justify-center`}>
                      <Heart className={`w-12 h-12 ${
                        color === 'purple' ? 'text-purple-400' :
                        color === 'orange' ? 'text-orange-400' :
                        color === 'blue' ? 'text-blue-400' :
                        'text-gray-400'
                      }`} />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-bold text-gray-900 flex-1 group-hover:text-red-600 transition-colors">
                        {tip.title}
                      </h2>
                      {tip.category && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ml-2 ${getCategoryBadgeClasses(tip.category)}`}>
                          {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {tip.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Save Lives?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Every donation makes a difference. Follow these tips to ensure a safe and comfortable experience.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-xl">
            Find Donation Center
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}