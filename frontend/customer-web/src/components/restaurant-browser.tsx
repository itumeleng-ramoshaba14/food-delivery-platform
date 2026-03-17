"use client";

import { useEffect, useState } from "react";
import { getRestaurantMenu, Restaurant, MenuItem } from "@/lib/api";
import CartPanel from "@/components/cart-panel";
import MenuList from "@/components/menu-list";
import { useCartStore } from "@/store/cart-store";

type Props = {
  restaurants: Restaurant[];
};

export default function RestaurantBrowser({ restaurants }: Props) {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(
    restaurants[0]?.id ?? null
  );
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [brokenRestaurantImages, setBrokenRestaurantImages] = useState<
    Record<string, boolean>
  >({});

  const cartRestaurantId = useCartStore((state) => state.restaurantId);

  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? null;

  useEffect(() => {
    async function loadMenu() {
      if (!selectedRestaurantId) {
        setMenu([]);
        return;
      }

      try {
        setLoadingMenu(true);
        setMenuError(null);
        const menuData = await getRestaurantMenu(selectedRestaurantId);
        setMenu(menuData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load menu";
        setMenuError(message);
        setMenu([]);
      } finally {
        setLoadingMenu(false);
      }
    }

    loadMenu();
  }, [selectedRestaurantId]);

  function handleSelectRestaurant(restaurantId: string) {
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      const confirmed = window.confirm(
        "Your cart contains items from another restaurant. You can browse this restaurant, but you must clear the cart before adding items from it. Continue?"
      );

      if (!confirmed) {
        return;
      }
    }

    setSelectedRestaurantId(restaurantId);
  }

  function handleRestaurantImageError(restaurantId: string) {
    setBrokenRestaurantImages((prev) => ({
      ...prev,
      [restaurantId]: true,
    }));
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="bg-orange-500 text-white px-8 py-14">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-[0.25em] mb-3 font-semibold">
            Mr D Clone
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Craving something delicious?
            <br />
            Order your favourites, fast.
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Browse top restaurants, choose where to order from, add meals to your
            cart, and place your order in a few simple steps.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Restaurants</h2>
            <p className="text-gray-500 mt-1">
              Choose from available restaurants near you.
            </p>
          </div>

          <div className="text-sm text-gray-500 bg-white border rounded-xl px-4 py-2">
            {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}
          </div>
        </div>

        {restaurants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            No restaurants found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => {
              const isSelected = restaurant.id === selectedRestaurantId;
              const imageBroken = brokenRestaurantImages[restaurant.id];

              return (
                <button
                  key={restaurant.id}
                  type="button"
                  onClick={() => handleSelectRestaurant(restaurant.id)}
                  className={`text-left bg-white rounded-2xl shadow-sm border overflow-hidden transition hover:shadow-md ${
                    isSelected ? "ring-2 ring-orange-500 border-orange-500" : ""
                  }`}
                >
                  <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {restaurant.bannerUrl && !imageBroken ? (
                      <img
                        src={restaurant.bannerUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        onError={() => handleRestaurantImageError(restaurant.id)}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">
                        No restaurant image available
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{restaurant.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {restaurant.cuisineType || "Mixed Cuisine"} •{" "}
                          {restaurant.city}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                          restaurant.isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {restaurant.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    <p className="text-gray-600 mt-4">
                      {restaurant.description || "Fresh meals delivered fast."}
                    </p>

                    <div className="mt-4 text-sm text-gray-500 space-y-1">
                      <p>📍 {restaurant.addressLine1}</p>
                      <p>
                        ⭐ {restaurant.rating} ({restaurant.totalRatings} ratings)
                      </p>
                      <p>🕒 Prep time: {restaurant.avgPrepTimeMinutes} min</p>
                      <p>💵 Min order: R{restaurant.minOrderAmount}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t flex items-center justify-between text-xs text-gray-400 break-all">
                      <span>Restaurant ID: {restaurant.id}</span>
                      {isSelected && (
                        <span className="text-orange-600 font-semibold">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selectedRestaurant && (
        <section className="max-w-6xl mx-auto px-8 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Menu — {selectedRestaurant.name}
            </h2>
            <p className="text-gray-500">
              Add items to cart and continue to checkout.
            </p>
          </div>

          {loadingMenu ? (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              Loading menu...
            </div>
          ) : menuError ? (
            <div className="bg-white rounded-2xl shadow-sm border p-6 text-red-600">
              {menuError}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <MenuList
                  restaurantId={selectedRestaurant.id}
                  restaurantName={selectedRestaurant.name}
                  menu={menu}
                />
              </div>

              <div>
                <CartPanel />
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}