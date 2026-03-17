'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';

interface PrepTimeSelectorProps {
  onSelect: (minutes: number) => void;
  onCancel: () => void;
}

const PREP_TIMES = [10, 15, 20, 25, 30];

export default function PrepTimeSelector({ onSelect, onCancel }: PrepTimeSelectorProps) {
  const [selected, setSelected] = useState<number>(15);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-lg" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} className="text-gray-500" />
        <span className="text-xs font-semibold text-gray-600">Prep Time</span>
      </div>
      <div className="flex gap-1.5 mb-3">
        {PREP_TIMES.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selected === t
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}m
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSelect(selected)} className="btn-success text-xs py-1.5 flex-1">
          Accept
        </button>
        <button onClick={onCancel} className="btn-secondary text-xs py-1.5">
          Cancel
        </button>
      </div>
    </div>
  );
}
