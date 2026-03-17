import { create } from 'zustand';
import { DashboardKPIs, ActivityFeedItem, PlatformHealth, Order } from '@/types';
import { mockKPIs, mockActivityFeed, mockPlatformHealth, mockOrders } from '@/lib/mockData';

interface DashboardState {
  kpis: DashboardKPIs;
  recentOrders: Order[];
  activityFeed: ActivityFeedItem[];
  platformHealth: PlatformHealth;
  isLoading: boolean;
  fetchDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  kpis: mockKPIs,
  recentOrders: mockOrders.slice(0, 10),
  activityFeed: mockActivityFeed,
  platformHealth: mockPlatformHealth,
  isLoading: false,
  fetchDashboard: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        kpis: mockKPIs,
        recentOrders: mockOrders.slice(0, 10),
        activityFeed: mockActivityFeed,
        platformHealth: mockPlatformHealth,
        isLoading: false,
      });
    }, 300);
  },
}));
