import React from 'react';

export type OrderStatusTone = 'warning' | 'ready' | 'neutral' | 'refunded';

const toneClasses: Record<OrderStatusTone, string> = {
  warning: 'border-[#f4c95d]/35 bg-[#33270e]/70 text-[#fff4c5]',
  ready: 'border-[#75e3bf]/30 bg-[#09241e]/70 text-[#ddfff4]',
  neutral: 'border-[#9bc5ff]/30 bg-[#0b1b2d]/70 text-[#e7f2ff]',
  refunded: 'border-[#ff8f9c]/35 bg-[#32131b]/70 text-[#ffe8ec]',
};

export function OrderStatusLabel({
  label,
  tone,
  className = '',
  testId = 'order-state-label',
}: {
  label: string;
  tone: OrderStatusTone;
  className?: string;
  testId?: string;
}) {
  return (
    <span
      data-testid={testId}
      className={`order-status-label inline-flex min-w-0 items-center whitespace-nowrap rounded-full border px-2 py-1 text-[10.5px] font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[8px] backdrop-saturate-[125%] sm:text-[11px] ${toneClasses[tone]} ${className}`}
    >
      <span>{label}</span>
    </span>
  );
}
