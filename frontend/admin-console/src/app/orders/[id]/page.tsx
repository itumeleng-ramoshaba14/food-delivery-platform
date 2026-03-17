'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Hash, Shield, Camera, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import Timeline from '@/components/Timeline';
import ConfirmDialog from '@/components/ConfirmDialog';
import Modal from '@/components/Modal';
import { useOrdersStore } from '@/store/ordersStore';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrderById } = useOrdersStore();
  const order = getOrderById(params.id as string);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {order.id}
            <StatusBadge status={order.status} />
          </h1>
          <p className="text-sm text-gray-500 mt-1">Placed {new Date(order.placedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Timeline + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Order Timeline</h2>
            <Timeline events={order.events} />
          </motion.div>

          {/* Items & Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">R{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>R{order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery Fee</span><span>R{order.deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Service Fee</span><span>R{order.serviceFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">VAT</span><span>R{order.vat.toFixed(2)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm"><span className="text-emerald-600">Discount</span><span className="text-emerald-600">-R{order.discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span>Total</span><span>R{order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          {(order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded') && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Cancel Order
                </button>
                <button
                  onClick={() => { setRefundAmount(order.total.toFixed(2)); setShowRefundModal(true); }}
                  className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
                >
                  Issue Refund
                </button>
                <button className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  Reassign Driver
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Order Info */}
        <div className="space-y-6">
          {/* Customer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
            <p className="text-sm text-gray-500">{order.customerPhone}</p>
          </motion.div>

          {/* Restaurant */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Restaurant</h3>
            <p className="text-sm font-medium text-gray-900">{order.restaurantName}</p>
          </motion.div>

          {/* Driver */}
          {order.driverName && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Driver</h3>
              <p className="text-sm font-medium text-gray-900">{order.driverName}</p>
            </motion.div>
          )}

          {/* Delivery Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Delivery Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="text-sm text-gray-700">{order.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Dropoff</p>
                  <p className="text-sm text-gray-700">{order.dropoffAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash className="w-4 h-4" /> Distance: {order.distance} km
              </div>
              {order.otp && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" /> OTP: <span className="font-mono font-bold text-gray-900">{order.otp}</span>
                </div>
              )}
              {order.proofOfDelivery && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Camera className="w-4 h-4" /> Proof of delivery captured
                </div>
              )}
            </div>
          </motion.div>

          {/* Support Tickets */}
          {order.supportTicketIds.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" /> Linked Support Tickets
              </h3>
              <div className="space-y-2">
                {order.supportTicketIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => router.push('/support')}
                    className="block text-sm text-accent hover:underline"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => alert('Order cancelled (mock)')}
        title="Cancel Order"
        message={`Are you sure you want to cancel order ${order.id}? This action cannot be undone.`}
        confirmLabel="Cancel Order"
        variant="danger"
      />

      {/* Refund Modal */}
      <Modal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} title="Issue Refund">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount (R)</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              max={order.total}
              min={0}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            <p className="text-xs text-gray-400 mt-1">Max refund: R{order.total.toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setRefundAmount(order.total.toFixed(2)); }}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Full Refund
            </button>
            <button
              onClick={() => { setRefundAmount((order.total / 2).toFixed(2)); }}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              50% Refund
            </button>
          </div>
          <button
            onClick={() => { alert(`Refund of R${refundAmount} issued (mock)`); setShowRefundModal(false); }}
            className="w-full px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Issue Refund of R{refundAmount}
          </button>
        </div>
      </Modal>
    </div>
  );
}
