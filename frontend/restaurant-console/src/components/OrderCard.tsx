'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, MapPin, X } from 'lucide-react';
import { Order } from '@/types';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import PrepTimeSelector from './PrepTimeSelector';
import { useOrdersStore } from '@/store/ordersStore';

interface OrderCardProps {
  order: Order;
}

const REJECT_REASONS = [
  'Too busy',
  'Item unavailable',
  'Kitchen closing',
  'Cannot deliver to area',
  'Other',
];

export default function OrderCard({ order }: OrderCardProps) {
  const { acceptOrder, rejectOrder, updateStatus, openDetail } = useOrdersStore();
  const [showPrepTime, setShowPrepTime] = useState(false);
  const [showReject, setShowReject] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="order-card mb-3"
      onClick={() => openDetail(order)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm text-gray-900">{order.orderNumber}</span>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
        <User size={12} />
        <span>{order.customerName}</span>
      </div>

      <div className="space-y-1 mb-3">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-gray-700">
              {item.quantity}x {item.name}
              {item.modifiers?.length ? (
                <span className="text-gray-400 ml-1">({item.modifiers.join(', ')})</span>
              ) : null}
            </span>
            <span className="text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={12} />
          <span>{formatTimeAgo(order.createdAt)}</span>
        </div>
        <span className="font-bold text-sm text-gray-900">{formatCurrency(order.total)}</span>
      </div>

      {order.customerNotes && (
        <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-700 border border-amber-100">
          📝 {order.customerNotes}
        </div>
      )}

      {/* Action buttons */}
      {order.status === 'new' && !showPrepTime && !showReject && (
        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowPrepTime(true)}
            className="btn-success text-xs py-1.5 flex-1"
          >
            Accept
          </button>
          <button
            onClick={() => setShowReject(true)}
            className="btn-danger text-xs py-1.5"
          >
            Reject
          </button>
        </div>
      )}

      {order.status === 'new' && showPrepTime && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <PrepTimeSelector
            onSelect={(mins) => {
              acceptOrder(order.id, mins);
              setShowPrepTime(false);
            }}
            onCancel={() => setShowPrepTime(false)}
          />
        </div>
      )}

      {order.status === 'new' && showReject && (
        <div className="mt-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-600">Reason</span>
            <button onClick={() => setShowReject(false)}>
              <X size={14} className="text-gray-400" />
            </button>
          </div>
          {REJECT_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => {
                rejectOrder(order.id, reason);
                setShowReject(false);
              }}
              className="block w-full text-left text-xs px-3 py-2 rounded-md bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              {reason}
            </button>
          ))}
        </div>
      )}

      {(order.status === 'accepted') && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => updateStatus(order.id, 'preparing')}
            className="btn-primary text-xs py-1.5 w-full"
          >
            Start Preparing
          </button>
        </div>
      )}

      {order.status === 'preparing' && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => updateStatus(order.id, 'ready')}
            className="btn-success text-xs py-1.5 w-full"
          >
            ✓ Ready for Pickup
          </button>
          {order.prepTime && (
            <div className="mt-1.5 text-center">
              <span className="text-xs text-gray-400">Est. {order.prepTime}min prep</span>
            </div>
          )}
        </div>
      )}

      {order.status === 'ready' && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <MapPin size={12} />
          Waiting for pickup
        </div>
      )}
    </motion.div>
  );
}
