import { create } from 'zustand';
import { Driver } from '@/types';
import { mockDrivers } from '@/lib/mockData';

interface DriversState {
  drivers: Driver[];
  searchQuery: string;
  isLoading: boolean;
  setSearchQuery: (q: string) => void;
  toggleVerified: (id: string) => void;
  getFiltered: () => Driver[];
}

export const useDriversStore = create<DriversState>((set, get) => ({
  drivers: mockDrivers,
  searchQuery: '',
  isLoading: false,
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleVerified: (id) => set(state => ({
    drivers: state.drivers.map(d =>
      d.id === id ? { ...d, isVerified: !d.isVerified } : d
    ),
  })),
  getFiltered: () => {
    const { drivers, searchQuery } = get();
    if (!searchQuery) return drivers;
    const q = searchQuery.toLowerCase();
    return drivers.filter(d => d.name.toLowerCase().includes(q) || d.vehicleType.toLowerCase().includes(q));
  },
}));
