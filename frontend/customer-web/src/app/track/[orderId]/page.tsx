"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getCustomerToken, getOrder, OrderDetails } from "@/lib/api";
import {
  buildTrackingState,
  OrderStatus,
  TrackingState,
} from "@/lib/mock-tracking";

const OrderMap = dynamic(() => import("@/components/order-map"), {
  ssr: false,
});

const statusSteps: OrderStatus[] = [
  "ORDER_RECEIVED",
  "PREPARING",
  "DRIVER_ASSIGNED",
  "PICKED_UP",
  "DELIVERED",
];

function mapBackendStatusToTrackingStatus(status: string): OrderStatus {
  switch (status?.toUpperCase()) {
    case "PENDING":
    case "CREATED":
    case "ORDER_RECEIVED":
      return "ORDER_RECEIVED";
    case "ACCEPTED":
    case "CONFIRMED":
    case "PREPARING":
    case "READY":
      return "PREPARING";
    case "DRIVER_ASSIGNED":
    case "ASSIGNED":
      return "DRIVER_ASSIGNED";
    case "PICKED_UP":
    case "OUT_FOR_DELIVERY":
      return "PICKED_UP";
    case "DELIVERED":
      return "DELIVERED";
    default:
      return "ORDER_RECEIVED";
  }
}

function statusLabel(status: OrderStatus) {
  switch (status) {
    case "ORDER_RECEIVED":
      return "Order received";
    case "PREPARING":
      return "Restaurant preparing";
    case "DRIVER_ASSIGNED":
      return "Driver assigned";
    case "PICKED_UP":
      return "Driver picked up order";
    case "DELIVERED":
      return "Delivered";
    default:
      return status;
  }
}

function formatMoney(value?: number | string) {
  return Number(value ?? 0).toFixed(2);
}

export default function TrackOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const initial = useMemo(() => buildTrackingState(params.orderId), [params.orderId]);

  const [tracking, setTracking] = useState<TrackingState>(initial);
  const [pathIndex, setPathIndex] = useState(0);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const token = getCustomerToken();

        if (!token) {
          throw new Error("No customer token found. Please log in again.");
        }

        // params.orderId is now the SHORT PUBLIC ORDER ID, e.g. ORD-ABC123
        const orderData = await getOrder(token, params.orderId);
        setOrder(orderData);

        setTracking((prev) => ({
          ...prev,
          orderId: orderData.publicOrderId ?? prev.orderId,
          status: mapBackendStatusToTrackingStatus(orderData.status),
        }));
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params.orderId]);

  useEffect(() => {
    if (!order) return;
    if (tracking.status === "DELIVERED") return;

    const moveTimer = setInterval(() => {
      setPathIndex((prev) => {
        if (prev >= tracking.driverPath.length - 1) return prev;
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(moveTimer);
  }, [order, tracking.driverPath.length, tracking.status]);

  useEffect(() => {
    if (!tracking.driver) return;

    const currentPoint = tracking.driverPath[pathIndex];
    if (!currentPoint) return;

    setTracking((prev) => ({
      ...prev,
      driver: prev.driver
        ? {
            ...prev.driver,
            lat: currentPoint.lat,
            lng: currentPoint.lng,
          }
        : null,
    }));
  }, [pathIndex, tracking.driver, tracking.driverPath]);

  useEffect(() => {
    if (!order) return;

    const mappedStatus = mapBackendStatusToTrackingStatus(order.status);

    setTracking((prev) => ({
      ...prev,
      status: mappedStatus,
    }));

    if (mappedStatus === "ORDER_RECEIVED") {
      setPathIndex(0);
    } else if (mappedStatus === "PREPARING") {
      setPathIndex(Math.min(1, tracking.driverPath.length - 1));
    } else if (mappedStatus === "DRIVER_ASSIGNED") {
      setPathIndex(Math.min(2, tracking.driverPath.length - 1));
    } else if (mappedStatus === "PICKED_UP") {
      setPathIndex(Math.min(4, tracking.driverPath.length - 1));
    } else if (mappedStatus === "DELIVERED") {
      setPathIndex(tracking.driverPath.length - 1);
    }
  }, [order, tracking.driverPath.length]);

  useEffect(() => {
    if (!order) return;

    const pollTimer = setInterval(async () => {
      try {
        const token = getCustomerToken();
        if (!token) return;

        const latestOrder = await getOrder(token, params.orderId);
        setOrder(latestOrder);
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 5000);

    return () => clearInterval(pollTimer);
  }, [order, params.orderId]);

  const activeStep = statusSteps.indexOf(tracking.status);

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-orange-600 font-semibold">
            Live Tracking
          </p>
          <h1 className="text-4xl font-bold mt-2">Track your order</h1>
          <p className="text-gray-500 mt-2">
            Order ID: {order?.publicOrderId ?? params.orderId}
          </p>
          <p className="text-gray-500 mt-1">
            Delivery ID: {order?.publicDeliveryId ?? "Pending assignment"}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <p className="text-gray-600">Loading your order...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <p className="text-red-600 font-semibold">Could not load tracking</p>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <OrderMap
                restaurant={tracking.restaurant}
                customer={tracking.customer}
                driver={tracking.driver}
                path={tracking.driverPath.slice(0, pathIndex + 1)}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3">Delivery Status</h2>
                <p className="text-orange-600 font-semibold text-lg">
                  {statusLabel(tracking.status)}
                </p>
                <p className="text-gray-500 mt-2">
                  Backend status: {order?.status ?? "Unknown"}
                </p>
                <p className="text-gray-500 mt-1">ETA: {tracking.etaMinutes} min</p>

                {tracking.driver && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold">{tracking.driver.name}</p>
                    <p className="text-sm text-gray-500">
                      Vehicle: {tracking.driver.vehicle}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Progress</h2>
                <div className="space-y-3">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          index <= activeStep ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          index <= activeStep
                            ? "text-gray-900 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {statusLabel(step)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3">Order Details</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-900">Order ID:</span>{" "}
                    {order?.publicOrderId ?? params.orderId}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Delivery ID:</span>{" "}
                    {order?.publicDeliveryId ?? "Pending assignment"}
                  </p>
                  {order?.subtotal !== undefined && (
                    <p>
                      <span className="font-medium text-gray-900">Subtotal:</span>{" "}
                      R{formatMoney(order.subtotal)}
                    </p>
                  )}
                  {order?.deliveryFee !== undefined && (
                    <p>
                      <span className="font-medium text-gray-900">Delivery Fee:</span>{" "}
                      R{formatMoney(order.deliveryFee)}
                    </p>
                  )}
                  {order?.totalAmount !== undefined && (
                    <p>
                      <span className="font-medium text-gray-900">Total:</span>{" "}
                      R{formatMoney(order.totalAmount)}
                    </p>
                  )}
                  {order?.placedAt && (
                    <p>
                      <span className="font-medium text-gray-900">Placed at:</span>{" "}
                      {new Date(order.placedAt).toLocaleString()}
                    </p>
                  )}
                  {order?.restaurantName && (
                    <p>
                      <span className="font-medium text-gray-900">Restaurant:</span>{" "}
                      {order.restaurantName}
                    </p>
                  )}
                  {order?.deliveryInstructions && (
                    <p>
                      <span className="font-medium text-gray-900">Instructions:</span>{" "}
                      {order.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}