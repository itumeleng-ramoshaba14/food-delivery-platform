'use client';

const statusStyles: Record<string, string> = {
  // Order statuses
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  preparing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  ready_for_pickup: 'bg-purple-50 text-purple-700 border-purple-200',
  picked_up: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  in_transit: 'bg-orange-50 text-orange-700 border-orange-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-gray-50 text-gray-700 border-gray-200',
  // User/general statuses
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-gray-50 text-gray-700 border-gray-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  pending_verification: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  // Driver statuses
  online: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  offline: 'bg-gray-50 text-gray-700 border-gray-200',
  on_delivery: 'bg-blue-50 text-blue-700 border-blue-200',
  // Payout statuses
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  // Ticket priorities
  low: 'bg-gray-50 text-gray-700 border-gray-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
  // Ticket statuses
  open: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-gray-50 text-gray-600 border-gray-200',
  // Promotion
  expired: 'bg-gray-50 text-gray-500 border-gray-200',
};

const formatLabel = (status: string) =>
  status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}>
      {formatLabel(status)}
    </span>
  );
}
