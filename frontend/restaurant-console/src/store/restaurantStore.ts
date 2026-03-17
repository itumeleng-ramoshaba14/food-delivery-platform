import { create } from 'zustand';
import { Restaurant } from '@/types';
import { mockRestaurant } from '@/lib/mockData';

interface RestaurantState {
  restaurant: Restaurant;
  isAuthenticated: boolean;
  setRestaurant: (restaurant: Restaurant) => void;
  toggleOnline: () => void;
  togglePaused: () => void;
  updateProfile: (updates: Partial<Restaurant>) => void;
  setAuthenticated: (auth: boolean) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurant: mockRestaurant,
  isAuthenticated: true,

  setRestaurant: (restaurant) => set({ restaurant }),

  toggleOnline: () =>
    set((state) => ({
      restaurant: { ...state.restaurant, isOnline: !state.restaurant.isOnline },
    })),

  togglePaused: () =>
    set((state) => ({
      restaurant: { ...state.restaurant, isPaused: !state.restaurant.isPaused },
    })),

  updateProfile: (updates) =>
    set((state) => ({
      restaurant: { ...state.restaurant, ...updates },
    })),

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
}));
