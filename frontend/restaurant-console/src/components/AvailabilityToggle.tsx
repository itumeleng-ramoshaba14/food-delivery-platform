'use client';

interface AvailabilityToggleProps {
  enabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvailabilityToggle({ enabled, onToggle, size = 'md' }: AvailabilityToggleProps) {
  const sizes = {
    sm: { track: 'h-5 w-10', dot: 'h-3.5 w-3.5', translate: 'translate-x-5' },
    md: { track: 'h-7 w-14', dot: 'h-5 w-5', translate: 'translate-x-7' },
    lg: { track: 'h-8 w-16', dot: 'h-6 w-6', translate: 'translate-x-8' },
  };

  const s = sizes[size];

  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex ${s.track} items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
        enabled ? 'bg-emerald-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block ${s.dot} transform rounded-full bg-white transition-transform duration-300 shadow-md ${
          enabled ? s.translate : 'translate-x-1'
        }`}
      />
    </button>
  );
}
