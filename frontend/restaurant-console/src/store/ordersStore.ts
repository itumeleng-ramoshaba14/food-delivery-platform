import { create } from "zustand";
import {
  acceptRestaurantOrder,
  getRestaurantOrders,
  markOrderPreparing,
  markOrderReady,
  rejectRestaurantOrder,
  RestaurantOrder,
} from "@/lib/api";

interface OrdersState {
  orders: RestaurantOrder[];
  selectedOrder: RestaurantOrder | null;
  isDetailOpen: boolean;
  loading: boolean;
  error: string | null;

  fetchOrders: (restaurantId: string) => Promise<void>;
  setOrders: (orders: RestaurantOrder[]) => void;
  selectOrder: (order: RestaurantOrder | null) => void;
  openDetail: (order: RestaurantOrder) => void;
  closeDetail: () => void;
  acceptOrder: (
    orderId: string,
    prepTime: number,
    restaurantId: string
  ) => Promise<void>;
  rejectOrder: (
    orderId: string,
    reason: string,
    restaurantId: string
  ) => Promise<void>;
  markPreparing: (orderId: string, restaurantId: string) => Promise<void>;
  markReady: (orderId: string, restaurantId: string) => Promise<void>;
  clearError: () => void;
}

export const useOrdersStore = create<OrdersState>(
  (set: (partial: Partial<OrdersState>) => void) => ({
    orders: [],
    selectedOrder: null,
    isDetailOpen: false,
    loading: false,
    error: null,

    fetchOrders: async (restaurantId: string) => {
      try {
        set({ loading: true, error: null });
        const orders = await getRestaurantOrders(restaurantId);
        set({ orders, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to load orders";
        set({ error: message, loading: false });
      }
    },

    setOrders: (orders: RestaurantOrder[]) => set({ orders }),

    selectOrder: (order: RestaurantOrder | null) =>
      set({ selectedOrder: order }),

    openDetail: (order: RestaurantOrder) =>
      set({ selectedOrder: order, isDetailOpen: true }),

    closeDetail: () => set({ isDetailOpen: false, selectedOrder: null }),

    acceptOrder: async (
      orderId: string,
      prepTime: number,
      restaurantId: string
    ) => {
      try {
        set({ loading: true, error: null });
        await acceptRestaurantOrder(orderId, prepTime);
        const orders = await getRestaurantOrders(restaurantId);
        set({ orders, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to accept order";
        set({ error: message, loading: false });
      }
    },

    rejectOrder: async (
      orderId: string,
      reason: string,
      restaurantId: string
    ) => {
      try {
        set({ loading: true, error: null });
        await rejectRestaurantOrder(orderId, reason);
        const orders = await getRestaurantOrders(restaurantId);
        set({ orders, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to reject order";
        set({ error: message, loading: false });
      }
    },

    markPreparing: async (orderId: string, restaurantId: string) => {
      try {
        set({ loading: true, error: null });
        await markOrderPreparing(orderId);
        const orders = await getRestaurantOrders(restaurantId);
        set({ orders, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to mark preparing";
        set({ error: message, loading: false });
      }
    },

    markReady: async (orderId: string, restaurantId: string) => {
      try {
        set({ loading: true, error: null });
        await markOrderReady(orderId);
        const orders = await getRestaurantOrders(restaurantId);
        set({ orders, loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to mark ready";
        set({ error: message, loading: false });
      }
    },

    clearError: () => set({ error: null }),
  })
);