import { create } from "zustand";
import { Driver, LatLng } from "@/types";
import { mockDriver } from "@/lib/mockData";

interface DriverState {
  driver: Driver | null;
  isOnline: boolean;
  currentLocation: LatLng;
  isAuthenticated: boolean;
  todayEarnings: number;
  setDriver: (driver: Driver) => void;
  toggleOnline: () => void;
  setOnline: (online: boolean) => void;
  setLocation: (location: LatLng) => void;
  setAuthenticated: (auth: boolean) => void;
  setTodayEarnings: (amount: number) => void;
  loadMockData: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  driver: null,
  isOnline: false,
  currentLocation: { lat: -26.1076, lng: 28.0567 },
  isAuthenticated: true, // mock: start authenticated
  todayEarnings: 160.0,
  setDriver: (driver) => set({ driver }),
  toggleOnline: () =>
    set((state) => ({ isOnline: !state.isOnline })),
  setOnline: (online) => set({ isOnline: online }),
  setLocation: (location) => set({ currentLocation: location }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setTodayEarnings: (amount) => set({ todayEarnings: amount }),
  loadMockData: () =>
    set({
      driver: mockDriver,
      isAuthenticated: true,
      todayEarnings: 160.0,
    }),
}));
