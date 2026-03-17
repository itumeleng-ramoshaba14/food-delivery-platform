"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  categoryName?: string;
  quantity: number;
};

type CartState = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  subtotal: number;
  setRestaurant: (restaurantId: string, restaurantName: string) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  increaseQty: (menuItemId: string) => void;
  decreaseQty: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
};

const calculateSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      restaurantId: null,
      restaurantName: null,
      items: [],
      subtotal: 0,

      setRestaurant: (restaurantId, restaurantName) =>
        set((state) => {
          const switchingRestaurant =
            state.restaurantId && state.restaurantId !== restaurantId;

          return {
            restaurantId,
            restaurantName,
            items: switchingRestaurant ? [] : state.items,
            subtotal: switchingRestaurant ? 0 : calculateSubtotal(state.items),
          };
        }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.menuItemId === item.menuItemId
          );

          let updatedItems: CartItem[];

          if (existing) {
            updatedItems = state.items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          } else {
            updatedItems = [...state.items, { ...item, quantity: 1 }];
          }

          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
          };
        }),

      increaseQty: (menuItemId) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.menuItemId === menuItemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );

          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
          };
        }),

      decreaseQty: (menuItemId) =>
        set((state) => {
          const updatedItems = state.items
            .map((item) =>
              item.menuItemId === menuItemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0);

          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
            restaurantName:
              updatedItems.length === 0 ? null : state.restaurantName,
          };
        }),

      removeItem: (menuItemId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.menuItemId !== menuItemId
          );

          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
            restaurantName:
              updatedItems.length === 0 ? null : state.restaurantName,
          };
        }),

      clearCart: () =>
        set(() => ({
          restaurantId: null,
          restaurantName: null,
          items: [],
          subtotal: 0,
        })),
    }),
    {
      name: "customer-cart-store",
      partialize: (state) => ({
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        items: state.items,
        subtotal: state.subtotal,
      }),
    }
  )
);