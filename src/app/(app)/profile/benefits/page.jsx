"use client";

import { useEffect, useState } from "react";
import { 
  Trophy, 
  Droplet, 
  Calendar, 
  ShieldCheck, 
  Download, 
  Award, 
  Star, 
  Heart,
  CheckCircle,
  Clock,
  FileText,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { getMyBenefits } from "@/services/benefits";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

// Donor level configuration
const DONOR_LEVELS = {
  new: {
    name: "New Donor",
    icon: Heart,
    color: "from-slate-400 to-slate-500",
    bgColor: "bg-slate-50",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
    description: "Welcome! Make your first donation to start your journey.",
    nextLevel: "bronze",
    donationsNeeded: 1,
  },
  bronze: {
    name: "Bronze Donor",
    icon: Award,
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    description: "You're making a difference! Keep up the great work.",
    nextLevel: "silver",
    donationsNeeded: 3,
  },
  silver: {
    name: "Silver Donor",
    icon: Star,
    color: "from-slate-400 to-slate-500",
    bgColor: "bg-slate-50",
    textColor: "text-slate-600",
    borderColor: "border-slate-300",
    description: "Outstanding commitment to saving lives!",
    nextLevel: "gold",
    donationsNeeded: 5,
  },
  gold: {
    name: "Gold Donor",
    icon: Trophy,
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-300",
    description: "You're a blood donation hero! Thank you for your dedication.",
    nextLevel: null,
    donationsNeeded: null,
  },
};

export default function BenefitsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getMyBenefits()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load benefits");
      })
      .finally(() => setLoading(false));
  }, []);

  // Generate and download PDF certificate on frontend
  function downloadCertificate() {
    if (data?.total_donations < 1) {
      alert("You need at least 1 donation to download a certificate.");
      return;
    }

    setDownloading(true);

    try {
      // Create PDF document (A4 landscape)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const centerX = pageWidth / 2;

      // Background color (light red)
      doc.setFillColor(254, 242, 242);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Outer border
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Inner border
      doc.setDrawColor(252, 165, 165);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Top decorative circle with blood drop
      doc.setFillColor(220, 38, 38);
      doc.circle(centerX, 30, 12, "F");

      // Simple blood drop shape (white)
      doc.setFillColor(255, 255, 255);
      doc.triangle(centerX, 22, centerX - 5, 32, centerX + 5, 32, "F");
      doc.circle(centerX, 33, 5, "F");

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(30, 41, 59);
      doc.text("Certificate of Appreciation", centerX, 55, { align: "center" });

      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text("Blood Donation Recognition", centerX, 65, { align: "center" });

      // Decorative line
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.8);
      doc.line(centerX - 50, 72, centerX + 50, 72);

      // "This is to certify that"
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text("This is to certify that", centerX, 82, { align: "center" });

      // Donor Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(220, 38, 38);
      doc.text(user?.full_name || "Valued Donor", centerX, 95, { align: "center" });

      // Blood Type Badge
      if (user?.blood_type) {
        doc.setFillColor(220, 38, 38);
        doc.roundedRect(centerX - 12, 100, 24, 12, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(user.blood_type, centerX, 108, { align: "center" });
      }

      // Achievement text
      const achievementY = user?.blood_type ? 122 : 110;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text("has generously contributed to saving lives through", centerX, achievementY, { align: "center" });

      // Total donations (big number)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(42);
      doc.setTextColor(220, 38, 38);
      doc.text(data.total_donations.toString(), centerX, achievementY + 18, { align: "center" });

      // "Blood Donations" text
      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105);
      doc.text(
        data.total_donations === 1 ? "Blood Donation" : "Blood Donations",
        centerX,
        achievementY + 28,
        { align: "center" }
      );

      // Donor Level Badge
      const levelColors = {
        bronze: [180, 83, 9],
        silver: [100, 116, 139],
        gold: [202, 138, 4],
        new: [100, 116, 139],
      };

      const levelNames = {
        bronze: "Bronze Donor",
        silver: "Silver Donor",
        gold: "Gold Donor",
        new: "New Donor",
      };

      const badgeY = achievementY + 35;
      const levelColor = levelColors[data.level] || levelColors.new;
      
      doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
      doc.roundedRect(centerX - 22, badgeY, 44, 12, 6, 6, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(levelNames[data.level] || "Donor", centerX, badgeY + 8, { align: "center" });

      // Footer section
      const footerY = pageHeight - 35;

      // Issue date (left)
      const issueDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Issued on: ${issueDate}`, 25, footerY);

      // Certificate ID (right)
      const certificateId = `BC-${Date.now().toString(36).toUpperCase()}`;
      doc.text(`Certificate ID: ${certificateId}`, pageWidth - 25, footerY, { align: "right" });

      // Organization name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text("BloodConnect Cambodia", centerX, footerY + 8, { align: "center" });

      // Tagline
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Connecting donors, saving lives", centerX, footerY + 14, { align: "center" });

      // Corner decorations
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.8);

      // Top-left corner
      doc.line(20, 28, 20, 20);
      doc.line(20, 20, 28, 20);

      // Top-right corner
      doc.line(pageWidth - 20, 20, pageWidth - 28, 20);
      doc.line(pageWidth - 20, 20, pageWidth - 20, 28);

      // Bottom-left corner
      doc.line(20, pageHeight - 20, 20, pageHeight - 28);
      doc.line(20, pageHeight - 20, 28, pageHeight - 20);

      // Bottom-right corner
      doc.line(pageWidth - 20, pageHeight - 20, pageWidth - 28, pageHeight - 20);
      doc.line(pageWidth - 20, pageHeight - 20, pageWidth - 20, pageHeight - 28);

      // Save PDF
      const filename = `BloodConnect_Certificate_${(user?.full_name || "Donor").replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);

    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading benefits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Droplet className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const level = DONOR_LEVELS[data?.level] || DONOR_LEVELS.new;
  const LevelIcon = level.icon;
  const nextLevel = level.nextLevel ? DONOR_LEVELS[level.nextLevel] : null;
  const progressToNext = nextLevel
    ? Math.min((data.total_donations / nextLevel.donationsNeeded) * 100, 100)
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-red-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-full shadow-lg shadow-red-500/30 mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Donation Benefits</h1>
          <p className="text-slate-600">Track your progress and earn rewards for saving lives</p>
        </div>

        {/* Donor Level Card */}
        <div className={`bg-white rounded-3xl shadow-xl border-2 ${level.borderColor} overflow-hidden mb-8`}>
          <div className={`bg-gradient-to-r ${level.color} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <LevelIcon className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Current Level</p>
                  <h2 className="text-3xl font-bold">{level.name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Total Donations</p>
                <p className="text-4xl font-black">{data.total_donations}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-slate-600 mb-4">{level.description}</p>

            {/* Progress to Next Level */}
            {nextLevel && (
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Progress to {nextLevel.name}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {data.total_donations} / {nextLevel.donationsNeeded} donations
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${nextLevel.color} rounded-full transition-all duration-500`}
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {nextLevel.donationsNeeded - data.total_donations > 0
                    ? `${nextLevel.donationsNeeded - data.total_donations} more donation(s) to reach ${nextLevel.name}!`
                    : "You've reached this level! 🎉"}
                </p>
              </div>
            )}

            {!nextLevel && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-600" />
                <p className="text-amber-800 font-medium">
                  You've reached the highest level! Thank you for being a dedicated donor! 🏆
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Eligibility Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${data.eligible ? "bg-green-100" : "bg-orange-100"}`}>
                {data.eligible ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">Donation Status</p>
                <p className={`text-xl font-bold ${data.eligible ? "text-green-600" : "text-orange-600"}`}>
                  {data.eligible ? "Eligible to Donate" : "Cooldown Period"}
                </p>
              </div>
            </div>
            
            {!data.eligible && data.next_eligible_date && (
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-sm text-orange-800">
                  Next eligible date:{" "}
                  <span className="font-bold">
                    {new Date(data.next_eligible_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            )}

            {data.eligible && (
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-sm text-green-800">
                  You're ready to save more lives! Find an event near you.
                </p>
              </div>
            )}
          </div>

          {/* Last Donation Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-100">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Donation</p>
                <p className="text-xl font-bold text-slate-800">
                  {data.last_donation_date
                    ? new Date(data.last_donation_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No donations yet"}
                </p>
              </div>
            </div>
            
            {data.last_donation_date && (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-sm text-red-800">
                  Thank you for your generous donation! 💖
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Section */}
        <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl shadow-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
              <FileText className="w-16 h-16" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Download Your Certificate</h3>
              <p className="text-red-100 mb-4">
                Get a personalized certificate acknowledging your life-saving contributions.
                Your certificate includes your name, total donations, and donor level.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  onClick={downloadCertificate}
                  disabled={downloading || data.total_donations < 1}
                  className="bg-white text-red-600 hover:bg-red-50 disabled:bg-white/50 disabled:text-red-400 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
              {data.total_donations < 1 && (
                <p className="text-red-200 text-sm mt-3">
                  Complete at least 1 donation to unlock your certificate.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Level Benefits Info */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Donor Level Benefits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(DONOR_LEVELS).map(([key, lvl]) => {
              const Icon = lvl.icon;
              const isCurrentLevel = key === data?.level;
              
              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isCurrentLevel
                      ? `${lvl.bgColor} ${lvl.borderColor} shadow-md`
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${lvl.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-bold ${isCurrentLevel ? lvl.textColor : "text-slate-700"}`}>
                        {lvl.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {key === "new"
                          ? "0 donations"
                          : key === "bronze"
                          ? "1-2 donations"
                          : key === "silver"
                          ? "3-4 donations"
                          : "5+ donations"}
                      </p>
                    </div>
                    {isCurrentLevel && (
                      <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            ℹ️ Eligibility is based on health guidelines. You can donate blood again 90 days after your last donation.
          </p>
        </div>
      </div>
    </div>
  );
}