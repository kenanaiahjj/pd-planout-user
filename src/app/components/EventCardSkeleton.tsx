/**
 * @file EventCardSkeleton.tsx
 * @description Animated placeholder skeleton that mirrors the EventCard layout.
 */

import React from 'react';

export function EventCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,23,42,0.01)]">
      <div className="flex gap-4 sm:gap-5">
        <div className="h-[142px] w-[104px] shrink-0 rounded-[14px] bg-slate-100 sm:h-[166px] sm:w-[146px]" />

        <div className="flex min-w-0 flex-1 flex-col justify-start gap-4">
          <div className="min-w-0 flex flex-col gap-2">
            <div className="h-6 w-11/12 rounded-lg bg-slate-100" />
            <div className="h-4 w-1/3 rounded-md bg-slate-100/70" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-md bg-slate-100/70 shrink-0" />
              <div className="h-4 w-2/3 rounded-md bg-slate-100/70" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-md bg-slate-100/70 shrink-0" />
              <div className="h-4 w-1/2 rounded-md bg-slate-100/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
