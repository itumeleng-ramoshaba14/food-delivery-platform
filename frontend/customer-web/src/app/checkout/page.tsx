"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { login, placeOrder } from "@/lib/api";

type StoreCartItem = {
  menuItemId: string;
  name: string;
  price: number;
  categoryName?: string;
  quantity: number;
};

const DEFAULT_DELIVERY_ADDRESS_ID = "8e33e2f9-2302-4157-8152-477b4458ca29";

function formatMoney(value: number) {
  return Number(value).toFixed(2);
}

export default function CheckoutPage() {
  const router = useRouter();

  const { items, restaurantId, clearCart } = useCartStore() as {
    items: StoreCartItem[];
    restaurantId: string | null;
    clearCart: () => void;
  };

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password");
  const [deliveryAddressId, setDeliveryAddressId] = useState(
    DEFAULT_DELIVERY_ADDRESS_ID
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useMemo(() => {
    const total = items.reduce((sum: number, item: StoreCartItem) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    return Number(total.toFixed(2));
  }, [items]);

  const deliveryFee = 25.0;
  const total = Number((subtotal + deliveryFee).toFixed(2));

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      if (!items.length) {
        setError("Your cart is empty");
        return;
      }

      if (!restaurantId) {
        setError("Restaurant ID is missing");
        return;
      }

      if (!email.trim()) {
        setError("Email is required");
        return;
      }

      if (!password.trim()) {
        setError("Password is required");
        return;
      }

      if (!deliveryAddressId.trim()) {
        setError("Delivery address ID is required");
        return;
      }

      const loginResponse = await login(email.trim(), password);
      const token =
        loginResponse?.data?.token ??
        loginResponse?.token ??
        localStorage.getItem("customerToken");

      if (!token) {
        throw new Error("Login succeeded but no token was returned");
      }

      const order = await placeOrder({
        token,
        restaurantId,
        deliveryAddressId: deliveryAddressId.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
        tipAmount: 0,
        items: items.map((item: StoreCartItem) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          specialInstructions: "",
        })),
      });

      localStorage.setItem("latestOrder", JSON.stringify(order));
      clearCart();

      const publicOrderId = order.publicOrderId ?? order.id;
      if (!publicOrderId) {
        throw new Error("Order created but no public order ID was returned");
      }

      router.replace(`/track/${encodeURIComponent(publicOrderId)}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    if (typeof window !== "undefined") {
      const latestOrder = localStorage.getItem("latestOrder");
      if (latestOrder) {
        return (
          <div className="p-6 text-lg">Redirecting to your order tracking...</div>
        );
      }
    }

    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
          <p className="text-gray-600">Your cart is empty.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Customer Details</h2>

          <div className="space-y-4 rounded-xl border border-gray-200 p-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Delivery Address ID
              </label>
              <input
                type="text"
                value={deliveryAddressId}
                onChange={(e) => setDeliveryAddressId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Paste address UUID from database"
              />
              <p className="mt-2 text-sm text-gray-500">
                This backend currently requires a real address UUID.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Delivery Instructions
              </label>
              <textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="min-h-[120px] w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="E.g. Call when outside, gate code 1234"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Your Items</h2>

            <div className="space-y-3">
              {items.map((item: StoreCartItem) => {
                const lineTotal = Number(
                  (Number(item.price) * Number(item.quantity)).toFixed(2)
                );

                return (
                  <div
                    key={item.menuItemId}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Unit Price: R {formatMoney(Number(item.price))}
                        </p>
                      </div>
                      <div className="font-semibold">
                        R {formatMoney(lineTotal)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex justify-between">
                <span>Subtotal</span>
                <span>R {formatMoney(subtotal)}</span>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Delivery Fee</span>
                <span>R {formatMoney(deliveryFee)}</span>
              </div>

              <div className="mb-4 flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>
                <span>R {formatMoney(total)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}