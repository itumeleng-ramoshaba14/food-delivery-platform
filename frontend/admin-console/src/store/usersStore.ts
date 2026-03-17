import { create } from 'zustand';
import { User, Customer, Driver, RestaurantStaff, UserRole } from '@/types';
import { mockCustomers, mockDrivers, mockRestaurantStaff, mockAdmins } from '@/lib/mockData';

interface UsersState {
  customers: Customer[];
  drivers: Driver[];
  restaurantStaff: RestaurantStaff[];
  admins: User[];
  activeTab: 'customer' | 'driver' | 'restaurant_staff' | 'admin';
  searchQuery: string;
  isLoading: boolean;
  setActiveTab: (tab: UsersState['activeTab']) => void;
  setSearchQuery: (q: string) => void;
  getUsersByRole: () => User[];
}

export const useUsersStore = create<UsersState>((set, get) => ({
  customers: mockCustomers,
  drivers: mockDrivers,
  restaurantStaff: mockRestaurantStaff,
  admins: mockAdmins,
  activeTab: 'customer',
  searchQuery: '',
  isLoading: false,
  setActiveTab: (tab) => set({ activeTab: tab, searchQuery: '' }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  getUsersByRole: () => {
    const { activeTab, customers, drivers, restaurantStaff, admins, searchQuery } = get();
    let users: User[];
    switch (activeTab) {
      case 'customer': users = customers; break;
      case 'driver': users = drivers; break;
      case 'restaurant_staff': users = restaurantStaff; break;
      case 'admin': users = admins; break;
      default: users = [];
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return users;
  },
}));
