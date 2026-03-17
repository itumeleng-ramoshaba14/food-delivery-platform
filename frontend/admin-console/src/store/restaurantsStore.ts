import { create } from 'zustand';
import { Restaurant } from '@/types';
import { mockRestaurants } from '@/lib/mockData';

interface RestaurantsState {
  restaurants: Restaurant[];
  searchQuery: string;
  isLoading: boolean;
  showAddModal: boolean;
  setSearchQuery: (q: string) => void;
  toggleStatus: (id: string) => void;
  setShowAddModal: (show: boolean) => void;
  getFiltered: () => Restaurant[];
}

export const useRestaurantsStore = create<RestaurantsState>((set, get) => ({
  restaurants: mockRestaurants,
  searchQuery: '',
  isLoading: false,
  showAddModal: false,
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleStatus: (id) => set(state => ({
    restaurants: state.restaurants.map(r =>
      r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' as const : 'active' as const } : r
    ),
  })),
  setShowAddModal: (show) => set({ showAddModal: show }),
  getFiltered: () => {
    const { restaurants, searchQuery } = get();
    if (!searchQuery) return restaurants;
    const q = searchQuery.toLowerCase();
    return restaurants.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
  },
}));
