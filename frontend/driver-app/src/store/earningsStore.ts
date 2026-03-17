import { create } from "zustand";
import { EarningsData, Payout } from "@/types";
import { mockEarnings, mockPayouts } from "@/lib/mockData";

type Period = "today" | "week" | "month";

interface EarningsState {
  selectedPeriod: Period;
  earnings: Record<string, EarningsData>;
  payouts: Payout[];
  nextPayoutDate: string;
  nextPayoutEstimate: number;
  setPeriod: (period: Period) => void;
  loadMockData: () => void;
  getCurrentEarnings: () => EarningsData;
}

export const useEarningsStore = create<EarningsState>((set, get) => ({
  selectedPeriod: "today",
  earnings: {},
  payouts: [],
  nextPayoutDate: "2026-03-11",
  nextPayoutEstimate: 2388.0,

  setPeriod: (period) => set({ selectedPeriod: period }),

  loadMockData: () =>
    set({ earnings: mockEarnings, payouts: mockPayouts }),

  getCurrentEarnings: () => {
    const { earnings, selectedPeriod } = get();
    return (
      earnings[selectedPeriod] || {
        period: selectedPeriod,
        deliveryFees: 0,
        tips: 0,
        incentives: 0,
        total: 0,
        deliveryCount: 0,
        hoursOnline: 0,
        earningsPerHour: 0,
      }
    );
  },
}));
