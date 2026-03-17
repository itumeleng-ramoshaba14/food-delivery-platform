"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";

type MenuListProps = {
  restaurantId: string;
  restaurantName: string;
  menu: MenuItem[];
};

export default function MenuList({
  restaurantId,
  restaurantName,
  menu,
}: MenuListProps) {
  const { addItem, setRestaurant, restaurantId: cartRestaurantId } = useCartStore();
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [brokenMenuImages, setBrokenMenuImages] = useState<Record<string, boolean>>(
    {}
  );

  function handleAddToCart(item: MenuItem) {
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      alert(
        "Your cart already contains items from another restaurant. Please clear the cart first."
      );
      return;
    }

    setRestaurant(restaurantId, restaurantName);

    addItem({
      menuItemId: String(item.id),
      name: item.name,
      price: item.price,
      categoryName: item.categoryName,
    });

    setJustAddedId(String(item.id));
    setTimeout(() => setJustAddedId(null), 1200);
  }

  function handleMenuImageError(itemId: string) {
    setBrokenMenuImages((prev) => ({
      ...prev,
      [itemId]: true,
    }));
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {menu.map((item) => {
        const itemId = String(item.id);
        const isAdded = justAddedId === itemId;
        const imageBroken = brokenMenuImages[itemId];

        return (
          <div
            key={item.id}
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition ${
              item.isAvailable ? "hover:shadow-md" : "opacity-90"
            }`}
          >
            <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
              {item.imageUrl && !imageBroken ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={() => handleMenuImageError(itemId)}
                />
              ) : (
                <div className="text-gray-400 text-sm">No image available</div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold">
                  {item.categoryName}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                    item.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <h3 className="text-lg font-bold mt-3">{item.name}</h3>

              <p className="text-gray-600 text-sm mt-2 min-h-[40px]">
                {item.description || "Freshly prepared and ready to order."}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold text-lg">R{item.price}</span>
              </div>

              <button
                onClick={() => handleAddToCart(item)}
                disabled={!item.isAvailable}
                className={`mt-4 w-full rounded-xl py-3 font-semibold transition ${
                  !item.isAvailable
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isAdded
                    ? "bg-green-600 text-white"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {!item.isAvailable
                  ? "Unavailable"
                  : isAdded
                  ? "Added"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}