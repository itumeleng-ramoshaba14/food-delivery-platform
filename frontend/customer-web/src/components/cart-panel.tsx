"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export default function CartPanel() {
  const {
    items,
    restaurantName,
    increaseQty,
    decreaseQty,
    removeItem,
    subtotal,
  } = useCartStore();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const minimumOrder = 50;
  const belowMinimum = subtotal < minimumOrder;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-3">Your Cart</h2>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <p className="text-sm text-gray-400">
          Add items from the menu to continue to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Your Cart</h2>
          {restaurantName && (
            <p className="text-sm text-gray-500">{restaurantName}</p>
          )}
        </div>

        <div className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.menuItemId} className="border-b pb-4 last:border-b-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                {item.categoryName && (
                  <p className="text-xs text-gray-500">{item.categoryName}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  R{item.price} each
                </p>
              </div>

              <button
                onClick={() => removeItem(item.menuItemId)}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item.menuItemId)}
                  className="w-8 h-8 rounded-lg border hover:bg-gray-50"
                >
                  -
                </button>
                <span className="font-medium min-w-[20px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQty(item.menuItemId)}
                  className="w-8 h-8 rounded-lg border hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <p className="font-semibold">R{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>

        <div className="flex items-center justify-between text-lg font-bold">
          <span>Subtotal</span>
          <span>R{subtotal}</span>
        </div>

        {belowMinimum && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3">
            Add R{minimumOrder - subtotal} more to reach the minimum order of R
            {minimumOrder}.
          </div>
        )}

        <Link
          href="/checkout"
          className={`mt-2 block w-full text-center rounded-xl py-3 font-semibold transition ${
            belowMinimum
              ? "pointer-events-none bg-gray-300 text-gray-500"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {belowMinimum ? "Minimum not reached" : "Go to Checkout"}
        </Link>
      </div>
    </div>
  );
}