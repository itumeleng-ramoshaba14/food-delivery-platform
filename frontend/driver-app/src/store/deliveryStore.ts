import { create } from "zustand";
import {
  acceptDelivery,
  DriverDelivery,
  getAvailableDeliveries,
  getCompletedDeliveries,
  getMyCurrentDeliveries,
  markDelivered,
  markEnRoute,
  markPickedUp,
} from "@/lib/api";

interface DeliveryState {
  availableDeliveries: DriverDelivery[];
  currentDeliveries: DriverDelivery[];
  completedDeliveries: DriverDelivery[];
  loading: boolean;
  error: string | null;

  fetchAvailableDeliveries: () => Promise<void>;
  fetchCurrentDeliveries: () => Promise<void>;
  fetchCompletedDeliveries: () => Promise<void>;
  refreshAll: () => Promise<void>;
  acceptDeliveryById: (deliveryId: string) => Promise<void>;
  markPickedUpById: (deliveryId: string) => Promise<void>;
  markEnRouteById: (deliveryId: string) => Promise<void>;
  markDeliveredById: (deliveryId: string) => Promise<void>;
  clearError: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  availableDeliveries: [],
  currentDeliveries: [],
  completedDeliveries: [],
  loading: false,
  error: null,

  fetchAvailableDeliveries: async () => {
    try {
      set({ loading: true, error: null });
      const deliveries = await getAvailableDeliveries();
      set({ availableDeliveries: deliveries, loading: false });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load available deliveries";
      set({ error: message, loading: false });
    }
  },

  fetchCurrentDeliveries: async () => {
    try {
      set({ loading: true, error: null });
      const deliveries = await getMyCurrentDeliveries();
      set({ currentDeliveries: deliveries, loading: false });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load current deliveries";
      set({ error: message, loading: false });
    }
  },

  fetchCompletedDeliveries: async () => {
    try {
      set({ loading: true, error: null });
      const deliveries = await getCompletedDeliveries();
      set({ completedDeliveries: deliveries, loading: false });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load completed deliveries";
      set({ error: message, loading: false });
    }
  },

  refreshAll: async () => {
    try {
      set({ loading: true, error: null });

      const [availableDeliveries, currentDeliveries, completedDeliveries] =
        await Promise.all([
          getAvailableDeliveries(),
          getMyCurrentDeliveries(),
          getCompletedDeliveries(),
        ]);

      set({
        availableDeliveries,
        currentDeliveries,
        completedDeliveries,
        loading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh deliveries";
      set({ error: message, loading: false });
    }
  },

  acceptDeliveryById: async (deliveryId: string) => {
    try {
      set({ loading: true, error: null });
      await acceptDelivery(deliveryId);
      await get().refreshAll();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to accept delivery";
      set({ error: message, loading: false });
    }
  },

  markPickedUpById: async (deliveryId: string) => {
    try {
      set({ loading: true, error: null });
      const updated = await markPickedUp(deliveryId);

      set((state) => ({
        currentDeliveries: state.currentDeliveries.map((delivery) =>
          delivery.id === deliveryId ? updated : delivery
        ),
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark picked up";
      set({ error: message, loading: false });
    }
  },

  markEnRouteById: async (deliveryId: string) => {
    try {
      set({ loading: true, error: null });
      const updated = await markEnRoute(deliveryId);

      set((state) => ({
        currentDeliveries: state.currentDeliveries.map((delivery) =>
          delivery.id === deliveryId ? updated : delivery
        ),
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark en route";
      set({ error: message, loading: false });
    }
  },

  markDeliveredById: async (deliveryId: string) => {
    try {
      set({ loading: true, error: null });
      await markDelivered(deliveryId);
      await get().refreshAll();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark delivered";
      set({ error: message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
