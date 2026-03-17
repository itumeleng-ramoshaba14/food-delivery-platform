"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDeliveryStore } from "@/store/deliveryStore";
import { DriverDelivery } from "@/lib/api";

function formatDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString();
}

function statusBadgeClasses(status: string) {
  switch (status) {
    case "DRIVER_ASSIGNED":
      return "bg-yellow-400/20 text-yellow-300 border-yellow-400/30";
    case "PICKED_UP":
      return "bg-blue-400/20 text-blue-300 border-blue-400/30";
    case "EN_ROUTE":
      return "bg-indigo-400/20 text-indigo-300 border-indigo-400/30";
    case "DELIVERED":
      return "bg-green-400/20 text-green-300 border-green-400/30";
    default:
      return "bg-white/10 text-gray-300 border-white/10";
  }
}

function DeliveryActionButtons({
  delivery,
  onPickedUp,
  onEnRoute,
  onDelivered,
}: {
  delivery: DriverDelivery;
  onPickedUp: () => void;
  onEnRoute: () => void;
  onDelivered: () => void;
}) {
  const status = delivery.status;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
      <button
        onClick={onPickedUp}
        disabled={status !== "DRIVER_ASSIGNED" && status !== "ARRIVED_PICKUP"}
        className="rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Picked Up
      </button>

      <button
        onClick={onEnRoute}
        disabled={status !== "PICKED_UP"}
        className="rounded-xl bg-blue-500 px-4 py-3 font-semibold hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        En Route
      </button>

      <button
        onClick={onDelivered}
        disabled={status !== "EN_ROUTE" && status !== "ARRIVED_DROPOFF"}
        className="rounded-xl bg-green-500 px-4 py-3 font-semibold text-black hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Delivered
      </button>
    </div>
  );
}

export default function DriverHomePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const {
    availableDeliveries,
    currentDeliveries,
    completedDeliveries,
    loading,
    error,
    refreshAll,
    fetchAvailableDeliveries,
    fetchCurrentDeliveries,
    fetchCompletedDeliveries,
    acceptDeliveryById,
    markPickedUpById,
    markEnRouteById,
    markDeliveredById,
    clearError,
  } = useDeliveryStore();

  useEffect(() => {
    const token = Cookies.get("driver_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    refreshAll();

    const interval = setInterval(() => {
      refreshAll();
    }, 15000);

    return () => clearInterval(interval);
  }, [authChecked, refreshAll]);

  function handleLogout() {
    Cookies.remove("driver_token");
    router.push("/login");
  }

  const totalCompleted = completedDeliveries.length;

  const totalEstimatedMinutes = useMemo(
    () =>
      completedDeliveries.reduce(
        (sum, delivery) => sum + (delivery.estimatedMinutes ?? 0),
        0
      ),
    [completedDeliveries]
  );

  const estimatedEarnings = useMemo(() => totalCompleted * 35, [totalCompleted]);

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-[#16213e] px-6 py-4 text-gray-300">
          Checking session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-green-400 mb-2">
              Driver App
            </p>
            <h1 className="text-4xl font-bold">Driver Delivery Flow</h1>
            <p className="text-gray-300 mt-2">
              View available jobs, accept deliveries, and update delivery status.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Auto-refreshes every 15 seconds
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-400"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-red-300">{error}</p>
              <button
                onClick={clearError}
                className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#16213e] p-5">
            <p className="text-sm text-gray-300">Completed Deliveries</p>
            <p className="text-3xl font-bold mt-2">{totalCompleted}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#16213e] p-5">
            <p className="text-sm text-gray-300">Estimated Earnings</p>
            <p className="text-3xl font-bold mt-2 text-green-400">
              R{estimatedEarnings}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Demo estimate at R35 per completed delivery
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#16213e] p-5">
            <p className="text-sm text-gray-300">Minutes Delivered</p>
            <p className="text-3xl font-bold mt-2">{totalEstimatedMinutes}</p>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-[#16213e] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">Available Deliveries</h2>
              <button
                onClick={fetchAvailableDeliveries}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
              >
                Refresh
              </button>
            </div>

            {loading && availableDeliveries.length === 0 ? (
              <p className="text-gray-300">Loading available deliveries...</p>
            ) : availableDeliveries.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300">
                No available deliveries right now.
              </div>
            ) : (
              <div className="space-y-4">
                {availableDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-xs uppercase tracking-widest text-green-400">
                        Delivery
                      </p>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClasses(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 break-all">
                      <span className="font-semibold text-white">Delivery ID:</span>{" "}
                      {delivery.id}
                    </p>
                    {delivery.orderId && (
                      <p className="text-sm text-gray-300 break-all mt-1">
                        <span className="font-semibold text-white">Order ID:</span>{" "}
                        {delivery.orderId}
                      </p>
                    )}
                    <p className="text-sm text-gray-300 mt-2">
                      <span className="font-semibold text-white">Pickup:</span>{" "}
                      {delivery.pickupAddress || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      <span className="font-semibold text-white">Dropoff:</span>{" "}
                      {delivery.dropoffAddress || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      <span className="font-semibold text-white">ETA:</span>{" "}
                      {delivery.estimatedMinutes ?? 0} min
                    </p>

                    <button
                      onClick={() => acceptDeliveryById(delivery.id)}
                      className="mt-4 w-full rounded-xl bg-green-500 px-4 py-3 font-semibold text-black hover:bg-green-400"
                    >
                      Accept Delivery
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-[#16213e] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">My Current Deliveries</h2>
              <button
                onClick={fetchCurrentDeliveries}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
              >
                Refresh
              </button>
            </div>

            {loading && currentDeliveries.length === 0 ? (
              <p className="text-gray-300">Loading current deliveries...</p>
            ) : currentDeliveries.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300">
                No active deliveries assigned to you.
              </div>
            ) : (
              <div className="space-y-4">
                {currentDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-xs uppercase tracking-widest text-orange-400">
                        Active Delivery
                      </p>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClasses(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 break-all">
                      <span className="font-semibold text-white">Delivery ID:</span>{" "}
                      {delivery.id}
                    </p>
                    {delivery.orderId && (
                      <p className="text-sm text-gray-300 break-all mt-1">
                        <span className="font-semibold text-white">Order ID:</span>{" "}
                        {delivery.orderId}
                      </p>
                    )}
                    <p className="text-sm text-gray-300 mt-2">
                      <span className="font-semibold text-white">Pickup:</span>{" "}
                      {delivery.pickupAddress || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      <span className="font-semibold text-white">Dropoff:</span>{" "}
                      {delivery.dropoffAddress || "N/A"}
                    </p>

                    <DeliveryActionButtons
                      delivery={delivery}
                      onPickedUp={() => markPickedUpById(delivery.id)}
                      onEnRoute={() => markEnRouteById(delivery.id)}
                      onDelivered={() => markDeliveredById(delivery.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="bg-[#16213e] rounded-2xl border border-white/10 p-6 mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold">Completed Deliveries</h2>
            <button
              onClick={fetchCompletedDeliveries}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
            >
              Refresh
            </button>
          </div>

          {completedDeliveries.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300">
              No completed deliveries yet.
            </div>
          ) : (
            <div className="space-y-4">
              {completedDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-xs uppercase tracking-widest text-green-400">
                      Completed
                    </p>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClasses(
                        delivery.status
                      )}`}
                    >
                      {delivery.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 break-all">
                    <span className="font-semibold text-white">Delivery ID:</span>{" "}
                    {delivery.id}
                  </p>
                  {delivery.orderId && (
                    <p className="text-sm text-gray-300 break-all mt-1">
                      <span className="font-semibold text-white">Order ID:</span>{" "}
                      {delivery.orderId}
                    </p>
                  )}
                  <p className="text-sm text-gray-300 mt-2">
                    <span className="font-semibold text-white">Pickup:</span>{" "}
                    {delivery.pickupAddress || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="font-semibold text-white">Dropoff:</span>{" "}
                    {delivery.dropoffAddress || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="font-semibold text-white">Delivered At:</span>{" "}
                    {formatDate(delivery.deliveredAt)}
                  </p>
                  <p className="text-sm text-green-400 mt-3 font-semibold">
                    Estimated payout: R35
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
