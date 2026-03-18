import { create } from "zustand";
import {
  acceptRestaurantOrder,
  getRestaurantOrders,
  markOrderPreparing,
  markOrderReady,
  rejectRestaurantOrder,
  RestaurantOrder,
} from "@/lib/api";
import { Order, OrderStatus } from "@/types";

function mapBackendStatus(status: string): OrderStatus {
  switch (status) {
    case "PLACED":
      return "new";
    case "ACCEPTED":
      return "accepted";
    case "PREPARING":
      return "preparing";
    case "READY":
      return "ready";
    case "PICKED_UP":
      return "picked_up";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    default:
      return "new";
  }
}

function mapRestaurantOrderToOrder(
  order: RestaurantOrder,
  restaurantId: string
): Order {
  return {
    id: order.id,
    restaurantId,
    orderNumber: order.id.slice(0, 8).toUpperCase(),
    customerName: "Customer",
    customerPhone: "",
    items: (order.items || []).map((item, index) => ({
      id: `${order.id}-${index}`,
      name: item.menuItemName,
      quantity: item.quantity,
      price: Number(item.unitPrice ?? 0),
    })),
    subtotal: Number(order.totalAmount ?? 0),
    deliveryFee: 0,
    total: Number(order.totalAmount ?? 0),
    status: mapBackendStatus(order.status),
    createdAt: order.placedAt,
    acceptedAt: undefined,
    prepTime: undefined,
    estimatedReady: undefined,
    deliveryAddress: "",
    customerNotes: "",
    paymentMethod: "Unknown",
    rejectReason: undefined,
  };
}

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isDetailOpen: boolean;
  loading: boolean;
  error: string | null;

  fetchOrders: (restaurantId: string) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  selectOrder: (order: Order | null) => void;
  openDetail: (order: Order) => void;
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

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  selectedOrder: null,
  isDetailOpen: false,
  loading: false,
  error: null,

  fetchOrders: async (restaurantId: string) => {
    try {
      set({ loading: true, error: null });
      const backendOrders = await getRestaurantOrders(restaurantId);
      const orders = backendOrders.map((order) =>
        mapRestaurantOrderToOrder(order, restaurantId)
      );
      set({ orders, loading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load orders";
      set({ error: message, loading: false });
    }
  },

  setOrders: (orders: Order[]) => set({ orders }),

  selectOrder: (order: Order | null) => set({ selectedOrder: order }),

  openDetail: (order: Order) =>
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
      const backendOrders = await getRestaurantOrders(restaurantId);
      const orders = backendOrders.map((order) =>
        mapRestaurantOrderToOrder(order, restaurantId)
      );
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
      const backendOrders = await getRestaurantOrders(restaurantId);
      const orders = backendOrders.map((order) =>
        mapRestaurantOrderToOrder(order, restaurantId)
      );
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
      const backendOrders = await getRestaurantOrders(restaurantId);
      const orders = backendOrders.map((order) =>
        mapRestaurantOrderToOrder(order, restaurantId)
      );
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
      const backendOrders = await getRestaurantOrders(restaurantId);
      const orders = backendOrders.map((order) =>
        mapRestaurantOrderToOrder(order, restaurantId)
      );
      set({ orders, loading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to mark ready";
      set({ error: message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));