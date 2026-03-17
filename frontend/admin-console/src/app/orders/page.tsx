'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import { useOrdersStore } from '@/store/ordersStore';

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready for Pickup', value: 'ready_for_pickup' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

export default function OrdersPage() {
  const router = useRouter();
  const { filteredOrders, statusFilter, searchQuery, currentPage, pageSize, setStatusFilter, setSearchQuery, setPage } = useOrdersStore();

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-accent" /> Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">{filteredOrders.length} orders total</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <FilterBar
            searchPlaceholder="Search by order ID, customer, or restaurant..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filters={[
              {
                label: 'Status',
                value: statusFilter,
                options: statusOptions,
                onChange: (v) => setStatusFilter(v as any),
              },
            ]}
          />
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Driver</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 text-sm font-medium text-accent">{order.id}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{order.customerName}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{order.restaurantName}</td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 text-right">R{order.total.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{order.driverName || '—'}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">{new Date(order.placedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
        />
      </motion.div>
    </div>
  );
}
