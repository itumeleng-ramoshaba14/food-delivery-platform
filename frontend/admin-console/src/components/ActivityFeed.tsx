'use client';

import { ActivityFeedItem } from '@/types';
import { ShoppingCart, Truck, CheckCircle, XCircle, Store, UserCheck } from 'lucide-react';

const iconMap: Record<ActivityFeedItem['type'], { icon: typeof ShoppingCart; color: string }> = {
  order_placed: { icon: ShoppingCart, color: 'text-blue-500 bg-blue-50' },
  driver_assigned: { icon: Truck, color: 'text-orange-500 bg-orange-50' },
  order_delivered: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
  order_cancelled: { icon: XCircle, color: 'text-red-500 bg-red-50' },
  restaurant_joined: { icon: Store, color: 'text-purple-500 bg-purple-50' },
  driver_verified: { icon: UserCheck, color: 'text-cyan-500 bg-cyan-50' },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface ActivityFeedProps {
  items: ActivityFeedItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const { icon: Icon, color } = iconMap[item.type];
        return (
          <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 leading-snug">{item.message}</p>
              <p className="text-xs text-gray-400 mt-1">{timeAgo(item.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
