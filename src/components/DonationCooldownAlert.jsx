"use client";

import { AlertCircle, Calendar, Clock } from "lucide-react";

export function DonationCooldownAlert({ remainingDays, nextEligibleDate, lastDonationDate }) {
  if (remainingDays === 0) return null;

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const cooldownPercentage = Math.min(100, ((90 - remainingDays) / 90) * 100);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-6 my-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Recovery Period Active
          </h3>

          <p className="text-slate-600 mb-4">
            You donated recently. You can donate again after the recovery period.
          </p>

          <div className="space-y-3">
            {/* Last Donation Date */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-slate-600">
                Last Donation: <span className="font-semibold">{formatDate(lastDonationDate)}</span>
              </span>
            </div>

            {/* Next Eligible Date */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-slate-600">
                Next Eligible: <span className="font-semibold">{formatDate(nextEligibleDate)}</span>
              </span>
            </div>

            {/* Days Remaining */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 min-w-fit">
                {remainingDays} {remainingDays === 1 ? "day" : "days"} remaining
              </span>
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${cooldownPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            💡 This 90-day period helps your body recover and maintain your health. Thank you for your dedication to saving lives!
          </p>
        </div>
      </div>
    </div>
  );
}

// Smaller badge variant for inline use
export function DonationCooldownBadge({ remainingDays }) {
  if (remainingDays === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold">
      <Clock className="w-3 h-3" />
      {remainingDays} {remainingDays === 1 ? "day" : "days"} cooldown
    </div>
  );
}