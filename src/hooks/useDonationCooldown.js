import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to check 90-day donation cooldown
 * Usage: const { canDonate, remainingDays } = useDonationCooldown();
 */
export function useDonationCooldown() {
  const { user } = useAuth();
  const [canDonate, setCanDonate] = useState(true);
  const [remainingDays, setRemainingDays] = useState(0);
  const [lastDonationDate, setLastDonationDate] = useState(null);
  const [nextEligibleDate, setNextEligibleDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.last_donation_date) {
      // User never donated
      setCanDonate(true);
      setRemainingDays(0);
      setLastDonationDate(null);
      setNextEligibleDate(null);
      return;
    }

    // Calculate cooldown
    const lastDonation = new Date(user.last_donation_date);
    const today = new Date();
    const daysSince = Math.floor(
      (today - lastDonation) / (1000 * 60 * 60 * 24)
    );

    const COOLDOWN_DAYS = 90;
    const canDonateNow = daysSince >= COOLDOWN_DAYS;
    const remaining = Math.max(0, COOLDOWN_DAYS - daysSince);

    const nextEligible = new Date(lastDonation);
    nextEligible.setDate(nextEligible.getDate() + COOLDOWN_DAYS);

    setCanDonate(canDonateNow);
    setRemainingDays(remaining);
    setLastDonationDate(user.last_donation_date);
    setNextEligibleDate(nextEligible);
  }, [user?.last_donation_date]);

  return {
    canDonate,
    remainingDays,
    lastDonationDate,
    nextEligibleDate,
    loading,
    cooldownPercentage: lastDonationDate 
      ? Math.min(100, ((90 - remainingDays) / 90) * 100)
      : 0,
  };
}