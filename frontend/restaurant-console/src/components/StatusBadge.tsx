'use client';

import { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-100' },
  accepted: { label: 'Accepted', color: 'text-amber-700', bg: 'bg-amber-100' },
  preparing: { label: 'Preparing', color: 'text-orange-700', bg: 'bg-orange-100' },
  ready: { label: 'Ready', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  picked_up: { label: 'Picked Up', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-gray-700', bg: 'bg-gray-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  );
}
