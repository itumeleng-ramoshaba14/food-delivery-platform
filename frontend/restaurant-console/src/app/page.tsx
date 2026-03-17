"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getMyRestaurants, RestaurantSummary } from "@/lib/api";
import { useOrdersStore } from "@/store/ordersStore";

type DashboardStatus =
  | "ALL"
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "DRIVER_ASSIGNED"
  | "PICKED_UP"
  | "EN_ROUTE"
  | "DELIVERED"
  | "CANCELLED";

function statusBadgeClasses(status: string) {
  switch (status) {
    case "PLACED":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "PREPARING":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "READY":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "DRIVER_ASSIGNED":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "PICKED_UP":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "EN_ROUTE":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "DELIVERED":
      return "bg-green-100 text-green-700 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "PLACED":
      return "Placed";
    case "ACCEPTED":
      return "Accepted";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready";
    case "DRIVER_ASSIGNED":
      return "Driver Assigned";
    case "PICKED_UP":
      return "Picked Up";
    case "EN_ROUTE":
      return "En Route";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export default function RestaurantHomePage() {
  const router = useRouter();

  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<DashboardStatus>("ALL");

  const {
    orders,
    loading,
    error,
    fetchOrders,
    acceptOrder,
    rejectOrder,
    markPreparing,
    markReady,
  } = useOrdersStore();

  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ??
    null;

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const token = Cookies.get("restaurant_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const myRestaurants = await getMyRestaurants();
        setRestaurants(myRestaurants);

        if (myRestaurants.length > 0) {
          setSelectedRestaurantId(myRestaurants[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadRestaurants();
  }, [router]);

  useEffect(() => {
    if (!selectedRestaurantId) return;
    fetchOrders(selectedRestaurantId);
  }, [selectedRestaurantId, fetchOrders]);

  useEffect(() => {
    if (!selectedRestaurantId) return;

    const timer = setInterval(() => {
      fetchOrders(selectedRestaurantId);
    }, 10000);

    return () => clearInterval(timer);
  }, [selectedRestaurantId, fetchOrders]);

  const stats = useMemo(() => {
    return {
      all: orders.length,
      placed: orders.filter((o) => o.status === "PLACED").length,
      accepted: orders.filter((o) => o.status === "ACCEPTED").length,
      preparing: orders.filter((o) => o.status === "PREPARING").length,
      ready: orders.filter((o) => o.status === "READY").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedStatus === "ALL") return orders;
    return orders.filter((order) => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">
              Restaurant Console
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              {selectedRestaurant
                ? `${selectedRestaurant.name} Dashboard`
                : "Restaurant Dashboard"}
            </h1>
            <p className="mt-2 text-gray-500">
              Manage incoming orders, track kitchen progress, and keep delivery
              flow moving.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[240px]">
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none focus:border-orange-400"
              >
                {restaurants.length === 0 && (
                  <option value="">No restaurants found</option>
                )}
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} - {restaurant.city}
                  </option>
                ))}
              </select>
            </div>

            {selectedRestaurantId && (
              <button
                onClick={() => fetchOrders(selectedRestaurantId)}
                className="rounded-xl bg-white px-4 py-2 font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-100"
              >
                Refresh Orders
              </button>
            )}

            <button
              onClick={() => {
                Cookies.remove("restaurant_token");
                router.replace("/login");
              }}
              className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
        </div>

        {selectedRestaurant && (
          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm font-medium text-gray-500">Restaurant</p>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {selectedRestaurant.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {selectedRestaurant.cuisineType || "Mixed Cuisine"} •{" "}
                {selectedRestaurant.city}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm font-medium text-gray-500">Open Status</p>
              <div className="mt-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    selectedRestaurant.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedRestaurant.isOpen ? "Open" : "Closed"}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Min order: R{selectedRestaurant.minOrderAmount}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm font-medium text-gray-500">Today&apos;s Orders</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {stats.all}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Auto-refreshes every 10 seconds
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {stats.delivered}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Cancelled: {stats.cancelled}
              </p>
            </div>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <button
            onClick={() => setSelectedStatus("ALL")}
            className={`rounded-2xl p-5 text-left shadow-sm ring-1 transition ${
              selectedStatus === "ALL"
                ? "bg-gray-900 text-white ring-gray-900"
                : "bg-white text-gray-900 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium opacity-80">All Orders</p>
            <p className="mt-2 text-3xl font-bold">{stats.all}</p>
          </button>

          <button
            onClick={() => setSelectedStatus("PLACED")}
            className={`rounded-2xl p-5 text-left shadow-sm ring-1 transition ${
              selectedStatus === "PLACED"
                ? "bg-amber-500 text-white ring-amber-500"
                : "bg-white text-gray-900 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium opacity-80">Placed</p>
            <p className="mt-2 text-3xl font-bold">{stats.placed}</p>
          </button>

          <button
            onClick={() => setSelectedStatus("ACCEPTED")}
            className={`rounded-2xl p-5 text-left shadow-sm ring-1 transition ${
              selectedStatus === "ACCEPTED"
                ? "bg-blue-500 text-white ring-blue-500"
                : "bg-white text-gray-900 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium opacity-80">Accepted</p>
            <p className="mt-2 text-3xl font-bold">{stats.accepted}</p>
          </button>

          <button
            onClick={() => setSelectedStatus("PREPARING")}
            className={`rounded-2xl p-5 text-left shadow-sm ring-1 transition ${
              selectedStatus === "PREPARING"
                ? "bg-orange-500 text-white ring-orange-500"
                : "bg-white text-gray-900 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium opacity-80">Preparing</p>
            <p className="mt-2 text-3xl font-bold">{stats.preparing}</p>
          </button>

          <button
            onClick={() => setSelectedStatus("READY")}
            className={`rounded-2xl p-5 text-left shadow-sm ring-1 transition ${
              selectedStatus === "READY"
                ? "bg-purple-500 text-white ring-purple-500"
                : "bg-white text-gray-900 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium opacity-80">Ready</p>
            <p className="mt-2 text-3xl font-bold">{stats.ready}</p>
          </button>

          <button
            onClick={() => setSelectedStatus("DELIVERED")}
            className={`rounded-2xl p-5 text-left shadow-sm ring-1 transition ${
              selectedStatus === "DELIVERED"
                ? "bg-green-500 text-white ring-green-500"
                : "bg-white text-gray-900 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm font-medium opacity-80">Delivered</p>
            <p className="mt-2 text-3xl font-bold">{stats.delivered}</p>
          </button>
        </div>

        {loading && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="font-semibold text-red-700">Could not load orders</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              No matching orders
            </h3>
            <p className="mt-2 text-gray-500">
              There are no orders in the selected status right now.
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {selectedRestaurant &&
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order</p>
                      <h2 className="mt-2 break-all text-2xl font-bold text-gray-900">
                        #{order.id}
                      </h2>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClasses(
                            order.status
                          )}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Items & Total
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">
                        {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                      </p>
                      <p className="mt-1 text-gray-600">R{order.totalAmount}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Placed</p>
                      <p className="mt-2 text-gray-900">
                        {new Date(order.placedAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {order.restaurantName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 xl:w-[280px] xl:justify-end">
                    {order.status === "PLACED" && (
                      <>
                        <button
                          onClick={() =>
                            acceptOrder(order.id, 20, selectedRestaurant.id)
                          }
                          className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            rejectOrder(
                              order.id,
                              "Restaurant unavailable",
                              selectedRestaurant.id
                            )
                          }
                          className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {order.status === "ACCEPTED" && (
                      <button
                        onClick={() =>
                          markPreparing(order.id, selectedRestaurant.id)
                        }
                        className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600"
                      >
                        Mark Preparing
                      </button>
                    )}

                    {order.status === "PREPARING" && (
                      <button
                        onClick={() => markReady(order.id, selectedRestaurant.id)}
                        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Mark Ready
                      </button>
                    )}

                    {(order.status === "READY" ||
                      order.status === "DRIVER_ASSIGNED" ||
                      order.status === "PICKED_UP" ||
                      order.status === "EN_ROUTE" ||
                      order.status === "DELIVERED") && (
                      <div className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                        Awaiting / handled by delivery flow
                      </div>
                    )}

                    {order.status === "CANCELLED" && (
                      <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                        Order cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
