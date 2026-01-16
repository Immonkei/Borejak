import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export function useDonationCooldown() {
  const { user } = useAuth();

  const [canDonate, setCanDonate] = useState(true);
  const [remainingDays, setRemainingDays] = useState(0);
  const [lastDonationDate, setLastDonationDate] = useState(null);
  const [nextEligibleDate, setNextEligibleDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEligibility = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const auth = JSON.parse(localStorage.getItem("auth"));
      if (!auth?.token) throw new Error("Not authenticated");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/donations/eligibility`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch eligibility");
      }

      const data = await res.json();

      const canDonateValue = data.canDonate === true;
      const nextDate = data.nextDonationDate
        ? new Date(data.nextDonationDate)
        : null;

      setCanDonate(canDonateValue);
      setNextEligibleDate(nextDate);

      if (!canDonateValue && nextDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eligible = new Date(nextDate);
        eligible.setHours(0, 0, 0, 0);

        const diffMs = eligible - today;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        setRemainingDays(diffDays);
        setLastDonationDate(
          new Date(eligible.getTime() - 90 * 24 * 60 * 60 * 1000)
        );
      } else {
        setRemainingDays(0);
        setLastDonationDate(null);
      }
    } catch (err) {
      console.error("❌ Eligibility check failed:", err);

      // Fail-safe: allow UI, backend still blocks
      setCanDonate(true);
      setRemainingDays(0);
      setLastDonationDate(null);
      setNextEligibleDate(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  return {
    canDonate,
    remainingDays,
    lastDonationDate,
    nextEligibleDate,
    loading,
    refresh: fetchEligibility,
    cooldownPercentage:
      !canDonate && remainingDays > 0
        ? Math.min(100, ((90 - remainingDays) / 90) * 100)
        : 0,
  };
}
