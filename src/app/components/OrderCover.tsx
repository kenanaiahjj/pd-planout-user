import React, { useMemo, useState } from 'react';
import { OrderStatusLabel, type OrderStatusTone } from '@/app/components/OrderStatusLabel';

export type OrderCoverItem = {
  id: string;
  title: string;
  image?: string;
  gradientFrom: string;
  gradientTo: string;
};

export function OrderCover({
  title,
  reference,
  purchaseDate,
  itemSummary,
  total,
  state,
  items,
  totalMediaCount,
}: {
  title: string;
  reference: string;
  purchaseDate: string;
  itemSummary: string;
  total: string;
  state: { label: string; tone: OrderStatusTone } | null;
  items: OrderCoverItem[];
  totalMediaCount: number;
}) {
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());
  const visibleItems = useMemo(() => items.slice(0, 3), [items]);
  const mode = totalMediaCount <= 1 ? 'single' : totalMediaCount === 2 ? 'double' : 'mosaic';
  const overflowCount = Math.max(0, totalMediaCount - 3);

  return (
    <section
      data-testid="order-detail-cover"
      data-cover-mode={mode}
      className="order-cover relative isolate min-h-[236px] overflow-hidden rounded-[24px] bg-[#0c493f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(0,0,0,0.18),0_22px_42px_-30px_rgba(4,24,19,0.72)] sm:min-h-[300px] sm:rounded-[28px]"
    >
      <div
        aria-hidden="true"
        className={`order-cover-media pointer-events-none absolute inset-0 grid ${
          mode === 'double'
            ? 'grid-cols-[58fr_42fr]'
            : mode === 'mosaic'
              ? 'grid-cols-[62fr_38fr] grid-rows-2'
              : 'grid-cols-1'
        }`}
      >
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className={`relative overflow-hidden ${
              mode === 'mosaic' && index === 0 ? 'row-span-2' : ''
            } ${index > 0 ? 'border-l border-white/20' : ''} ${
              mode === 'mosaic' && index === 2 ? 'border-t border-white/20' : ''
            }`}
            style={{ background: `linear-gradient(145deg, ${item.gradientFrom}, ${item.gradientTo})` }}
          >
            {item.image && !failedIds.has(item.id) && (
              <img
                src={item.image}
                alt=""
                draggable={false}
                onError={() => setFailedIds((current) => new Set(current).add(item.id))}
                className="order-cover-image h-full w-full scale-[1.015] object-cover contrast-[1.03] saturate-[1.08]"
              />
            )}
            {index === 2 && overflowCount > 0 && (
              <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[8px]">
                {`+${overflowCount}`}
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,8,12,0.91)_0%,rgba(3,8,12,0.38)_54%,rgba(3,8,12,0.10)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(128deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.06)_20%,transparent_44%)]"
      />

      <div className="relative z-10 flex min-h-[236px] flex-col p-5 sm:min-h-[300px] sm:p-7">
        <div className="flex min-w-0 items-start justify-between gap-3">
          {state ? (
            <OrderStatusLabel label={state.label} tone={state.tone} testId="order-cover-status" />
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="shrink-0 text-[10.5px] font-semibold leading-none text-white/80 sm:text-[11px]">
            Purchased {purchaseDate}
          </span>
        </div>

        <div className="mt-auto max-w-[94%]">
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.04em] text-white/70">
            Order details · {reference}
          </p>
          <h1 className="mt-2 text-balance text-[28px] font-bold leading-[1.02] tracking-[-0.75px] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.32)] sm:text-[36px]">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[12px] font-semibold text-white/78 sm:text-[13px]">
            <span>{itemSummary}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[16px] font-bold tracking-[-0.2px] text-white sm:text-[18px]">{total}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
