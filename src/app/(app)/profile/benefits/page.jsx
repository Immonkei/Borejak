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
  Sparkles,
  Zap,
  Target
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

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days since last donation
  const daysSinceLastDonation = data?.last_donation_date
    ? Math.floor((Date.now() - new Date(data.last_donation_date).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Generate professional PDF certificate
 function loadImageAsBase64(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /* ----------------------------------
     Download Certificate
  ---------------------------------- */
  async function downloadCertificate() {
    if (data?.total_donations < 1) {
      alert("You need at least 1 donation to download a certificate.");
      return;
    }

    setDownloading(true);

    try {
      /* LOAD LOGO */
      const logoBase64 = await loadImageAsBase64(
        "/photo_2025-10-28_11-17-55-removebg-preview.png"
      );

      /* MEDAL CONFIG */
      const medalConfig = {
        bronze: { color: [205, 127, 50], label: "BRONZE DONOR" },
        silver: { color: [148, 163, 184], label: "SILVER DONOR" },
        gold: { color: [202, 138, 4], label: "GOLD DONOR" },
        new: { color: [148, 163, 184], label: "NEW DONOR" },
      };

      /* CREATE PDF */
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const centerX = pageWidth / 2;

      /* BACKGROUND */
      doc.setFillColor(254, 242, 242);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      doc.setDrawColor(252, 165, 165);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      /* LOGO */
      const logoSize = 50;
      doc.addImage(
        logoBase64,
        "PNG",
        centerX - logoSize / 2,
        22,
        logoSize,
        logoSize
      );

      /* TITLE */
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(30, 41, 59);
      doc.text("Certificate of Appreciation", centerX, 72, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text("Blood Donation Recognition", centerX, 82, { align: "center" });

      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.8);
      doc.line(centerX - 55, 88, centerX + 55, 88);

      /* NAME */
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text("This is to certify that", centerX, 100, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(220, 38, 38);
      doc.text(user?.full_name || "Valued Donor", centerX, 114, {
        align: "center",
      });

      /* BLOOD TYPE */
      if (user?.blood_type) {
        doc.setFillColor(220, 38, 38);
        doc.roundedRect(centerX - 16, 120, 32, 12, 6, 6, "F");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(user.blood_type, centerX, 128, { align: "center" });
      }

      /* DONATION COUNT */
      const baseY = user?.blood_type ? 142 : 132;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(
        "has generously contributed to saving lives through",
        centerX,
        baseY,
        { align: "center" }
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(42);
      doc.setTextColor(220, 38, 38);
      doc.text(String(data.total_donations), centerX, baseY + 18, {
        align: "center",
      });

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text(
        data.total_donations === 1 ? "Blood Donation" : "Blood Donations",
        centerX,
        baseY + 32,
        { align: "center" }
      );

      /* -------------------------------
         MEDAL (FIXED, CLEAN, PROFESSIONAL)
      -------------------------------- */
      /* -------------------------------
     MEDAL (CERTIFICATE STYLE)
  -------------------------------- */
      const medal = medalConfig[data.level] || medalConfig.new;

      // Move medal higher
      const badgeY = baseY + 34;
      const badgeWidth = 42;
      const badgeHeight = 9;

      // subtle divider
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.3);
      doc.line(centerX - 22, badgeY - 6, centerX + 22, badgeY - 6);

      // medal outline (NOT filled button)
      doc.setDrawColor(...medal.color);
      doc.setLineWidth(0.8);
      doc.roundedRect(
        centerX - badgeWidth / 2,
        badgeY,
        badgeWidth,
        badgeHeight,
        4,
        4,
        "S"
      );

      // medal text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...medal.color);
      doc.text(medal.label, centerX, badgeY + 6.2, {
        align: "center",
      });


      /* FOOTER */
      const footerY = pageHeight - 30;

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Issued on: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        25,
        footerY
      );

      const certificateId = `BC-${Date.now().toString(36).toUpperCase()}`;
      doc.text(`Certificate ID: ${certificateId}`, pageWidth - 25, footerY, {
        align: "right",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text("BloodConnect Cambodia", centerX, footerY + 10, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Connecting donors, saving lives", centerX, footerY + 13, {
        align: "center",
      });

      /* SAVE */
      doc.save(
        `BloodConnect_Certificate_${(user?.full_name || "Donor")
          .replace(/\s+/g, "_")
          .toLowerCase()}.pdf`
      );
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate certificate.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-red-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-6 font-medium">Loading your benefits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Droplet className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-slate-600 hover:text-red-600 mb-8 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:bg-red-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-full shadow-lg shadow-red-500/30 mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Benefits & Progress</h1>
          <p className="text-slate-600 text-lg">Track your donations and unlock rewards</p>
        </div>

        {/* Current Level Card */}
        <div className={`bg-white rounded-3xl shadow-xl border-2 ${level.borderColor} overflow-hidden mb-8`}>
          <div className={`bg-gradient-to-r ${level.color} p-8 text-white`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl">
                  <LevelIcon className="w-12 h-12" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-semibold uppercase">Your Current Level</p>
                  <h2 className="text-4xl font-black">{level.name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm font-semibold">Total Donations</p>
                <p className="text-5xl font-black">{data.total_donations}</p>
              </div>
            </div>
            <p className="text-white/90 text-base">{level.description}</p>
          </div>

          <div className="p-8">
            {nextLevel && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-700">Progress to {nextLevel.name}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {data.total_donations} / {nextLevel.donationsNeeded}
                  </span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full bg-gradient-to-r ${nextLevel.color} rounded-full transition-all duration-700`}
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  {nextLevel.donationsNeeded - data.total_donations > 0
                    ? `🎯 ${nextLevel.donationsNeeded - data.total_donations} more donation(s) to reach ${nextLevel.name}!`
                    : "🎉 Amazing! You've reached this level!"}
                </p>
              </div>
            )}

            {!nextLevel && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-5 flex items-center gap-4 border-2 border-yellow-200">
                <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <p className="text-amber-900 font-semibold">
                  🏆 Congratulations! You've reached the highest donor level!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Last Donation Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-100">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Last Donation</p>
                <p className="text-xl font-bold text-slate-900">
                  {data?.last_donation_date 
                    ? formatDate(data.last_donation_date)
                    : "Not yet"}
                </p>
              </div>
            </div>
            {data?.last_donation_date && (
              <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                <p className="text-sm text-red-800 font-medium">
                  💖 <span className="font-semibold">{daysSinceLastDonation}</span> days ago
                </p>
              </div>
            )}
            {!data?.last_donation_date && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-sm text-slate-600">Ready to make your first donation</p>
              </div>
            )}
          </div>

          {/* Eligibility Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${data?.eligible ? "bg-green-100" : "bg-orange-100"}`}>
                {data?.eligible ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Donation Status</p>
                <p className={`text-xl font-bold ${data?.eligible ? "text-green-600" : "text-orange-600"}`}>
                  {data?.eligible ? "Eligible ✓" : "In Cooldown"}
                </p>
              </div>
            </div>
            {!data?.eligible && data?.next_eligible_date && (
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                <p className="text-sm text-orange-800 font-medium">
                  Next eligible:<br/>
                  <span className="font-bold">{formatDate(data.next_eligible_date)}</span>
                </p>
              </div>
            )}
            {data?.eligible && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <p className="text-sm text-green-700 font-medium">Ready to save more lives! 🩸</p>
              </div>
            )}
          </div>

          {/* Impact Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Lives Impacted</p>
                <p className="text-xl font-bold text-slate-900">
                  {(data?.total_donations * 3).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <p className="text-sm text-purple-800 font-medium">
                Your donations can save up to 3 lives each
              </p>
            </div>
          </div>

        </div>

        {/* Certificate Section */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 rounded-3xl shadow-2xl p-8 mb-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex-shrink-0">
              <FileText className="w-12 h-12" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Certificate of Honor</h3>
              <p className="text-red-100 mb-4 leading-relaxed">
                Download your personalized certificate recognizing your life-saving contributions. 
                Your certificate includes your name, total donations, donor level, and more.
              </p>
              <button
                onClick={downloadCertificate}
                disabled={downloading || data.total_donations < 1}
                className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 disabled:bg-white/50 disabled:text-red-400 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </>
                )}
              </button>
              {data.total_donations < 1 && (
                <p className="text-red-200 text-sm mt-3">
                  ℹ️ Complete at least 1 donation to unlock your certificate
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Donor Levels Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-600" />
            Donor Level Progression
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(DONOR_LEVELS).map(([key, lvl]) => {
              const Icon = lvl.icon;
              const isCurrentLevel = key === data?.level;
              
              return (
                <div
                  key={key}
                  className={`relative rounded-2xl border-2 p-5 transition-all ${
                    isCurrentLevel
                      ? `${lvl.bgColor} ${lvl.borderColor} shadow-lg ring-2 ring-red-300`
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  {/* Current badge */}
                  {isCurrentLevel && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      Current
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${lvl.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isCurrentLevel ? lvl.textColor : "text-slate-700"}`}>
                        {lvl.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {key === "new"
                          ? "Start"
                          : key === "bronze"
                          ? "1-2 donations"
                          : key === "silver"
                          ? "3-4 donations"
                          : "5+ donations"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200 flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-semibold">90-Day Cooldown Policy</p>
              <p className="text-xs text-blue-800 mt-1">
                After each donation, you can donate again after 90 days. This allows your body time to recover and ensures safe, healthy donation practices.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}