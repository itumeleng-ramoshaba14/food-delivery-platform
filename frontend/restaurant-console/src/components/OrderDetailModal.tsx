'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, CreditCard, Clock, FileText } from 'lucide-react';
import { useOrdersStore } from '@/store/ordersStore';
import { formatCurrency, formatTimeAgo, formatTime } from '@/lib/utils';
import StatusBadge from './StatusBadge';

export default function OrderDetailModal() {
  const { selectedOrder: order, isDetailOpen, closeDetail } = useOrdersStore();

  if (!order) return null;

  return (
    <AnimatePresence>
      {isDetailOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={closeDetail}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">Order {order.orderNumber}</h2>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Placed {formatTimeAgo(order.createdAt)} · {formatTime(order.createdAt)}
                </p>
              </div>
              <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 col-span-2">
                  <MapPin size={14} className="text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">{order.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                </div>
                {order.prepTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{order.prepTime}min prep</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {item.quantity}x
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <p className="text-xs text-gray-500 ml-8 mt-0.5">
                          {item.modifiers.join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-amber-600 ml-8 mt-0.5 italic">
                          ⚠ {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="px-5 py-3 border-b border-gray-100 bg-amber-50">
                <div className="flex items-start gap-2">
                  <FileText size={14} className="text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Customer Notes</p>
                    <p className="text-sm text-amber-800 mt-0.5">{order.customerNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="p-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-700">
                    {order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
