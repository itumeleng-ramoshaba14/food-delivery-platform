'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, DollarSign, Truck, Store, Clock, XCircle, BarChart3 } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import ActivityFeed from '@/components/ActivityFeed';
import { useDashboardStore } from '@/store/dashboardStore';

export default function DashboardPage() {
  const { kpis, recentOrders, activityFeed, platformHealth, fetchDashboard } = useDashboardStore();
  const router = useRouter();

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const maxOrders = Math.max(...platformHealth.ordersPerHour);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview for today</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard label="Total Orders Today" value={kpis.totalOrdersToday.toLocaleString()} trend={kpis.totalOrdersTrend} icon={ShoppingCart} />
        <StatsCard label="Revenue Today" value={`R${kpis.revenueToday.toLocaleString()}`} trend={kpis.revenueTrend} icon={DollarSign} />
        <StatsCard label="Active Drivers" value={kpis.activeDrivers.toString()} trend={kpis.activeDriversTrend} icon={Truck} />
        <StatsCard label="Active Restaurants" value={kpis.activeRestaurants.toString()} trend={kpis.activeRestaurantsTrend} icon={Store} />
        <StatsCard label="Avg Delivery Time" value={`${kpis.avgDeliveryTime}`} trend={kpis.avgDeliveryTimeTrend} icon={Clock} suffix=" min" />
        <StatsCard label="Cancellation Rate" value={`${kpis.cancellationRate}`} trend={kpis.cancellationRateTrend} icon={XCircle} suffix="%" />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200"
        >
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <button
              onClick={() => router.push('/orders')}
              className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Restaurant</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-accent">{order.id}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{order.customerName}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{order.restaurantName}</td>
                    <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3 text-sm text-gray-900 font-medium text-right">R{order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200"
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Live Activity</h2>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto scrollbar-thin">
            <ActivityFeed items={activityFeed} />
          </div>
        </motion.div>
      </div>

      {/* Platform Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-gray-900">Orders Per Hour (Today)</h2>
        </div>
        <div className="flex items-end gap-1 h-32">
          {platformHealth.ordersPerHour.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-accent/20 hover:bg-accent/40 rounded-t transition-colors"
                style={{ height: `${(count / maxOrders) * 100}%` }}
                title={`${platformHealth.labels[i]}: ${count} orders`}
              />
              {i % 4 === 0 && (
                <span className="text-[10px] text-gray-400">{platformHealth.labels[i]}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
