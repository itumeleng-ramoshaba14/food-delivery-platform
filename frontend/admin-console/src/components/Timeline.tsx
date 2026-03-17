'use client';

import { OrderEvent } from '@/types';
import { Clock } from 'lucide-react';

interface TimelineProps {
  events: OrderEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
      <div className="space-y-6">
        {events.map((event, idx) => (
          <div key={event.id} className="relative flex gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
              idx === 0 ? 'bg-accent text-white' : 'bg-white border-2 border-gray-200 text-gray-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-gray-900">{event.event}</span>
                <span className="text-xs text-gray-400">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">by {event.actor}</p>
              {event.notes && (
                <p className="text-sm text-gray-400 mt-1 italic">{event.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
