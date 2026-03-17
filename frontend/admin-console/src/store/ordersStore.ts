import { create } from 'zustand';
import { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/lib/mockData';

interface OrdersState {
  orders: Order[];
  filteredOrders: Order[];
  statusFilter: OrderStatus | 'all';
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  setStatusFilter: (status: OrderStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  getOrderById: (id: string) => Order | undefined;
  fetchOrders: () => void;
}

const applyFilters = (orders: Order[], status: OrderStatus | 'all', search: string) => {
  let filtered = [...orders];
  if (status !== 'all') filtered = filtered.filter(o => o.status === status);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.restaurantName.toLowerCase().includes(q)
    );
  }
  return filtered;
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: mockOrders,
  filteredOrders: mockOrders,
  statusFilter: 'all',
  searchQuery: '',
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 });
    const { orders, searchQuery } = get();
    set({ filteredOrders: applyFilters(orders, status, searchQuery) });
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    const { orders, statusFilter } = get();
    set({ filteredOrders: applyFilters(orders, statusFilter, query) });
  },
  setPage: (page) => set({ currentPage: page }),
  getOrderById: (id) => get().orders.find(o => o.id === id),
  fetchOrders: () => {
    set({ isLoading: true });
    setTimeout(() => set({ orders: mockOrders, filteredOrders: applyFilters(mockOrders, get().statusFilter, get().searchQuery), isLoading: false }), 300);
  },
}));
