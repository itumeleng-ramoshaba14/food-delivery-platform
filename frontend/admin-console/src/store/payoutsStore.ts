import { create } from 'zustand';
import { RestaurantPayout, DriverPayout } from '@/types';
import { mockRestaurantPayouts, mockDriverPayouts } from '@/lib/mockData';

interface PayoutsState {
  restaurantPayouts: RestaurantPayout[];
  driverPayouts: DriverPayout[];
  activeTab: 'restaurant' | 'driver';
  isLoading: boolean;
  setActiveTab: (tab: 'restaurant' | 'driver') => void;
  processPayout: (id: string, type: 'restaurant' | 'driver') => void;
}

export const usePayoutsStore = create<PayoutsState>((set) => ({
  restaurantPayouts: mockRestaurantPayouts,
  driverPayouts: mockDriverPayouts,
  activeTab: 'restaurant',
  isLoading: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  processPayout: (id, type) => set(state => ({
    restaurantPayouts: type === 'restaurant'
      ? state.restaurantPayouts.map(p => p.id === id ? { ...p, status: 'processing' as const } : p)
      : state.restaurantPayouts,
    driverPayouts: type === 'driver'
      ? state.driverPayouts.map(p => p.id === id ? { ...p, status: 'processing' as const } : p)
      : state.driverPayouts,
  })),
}));
