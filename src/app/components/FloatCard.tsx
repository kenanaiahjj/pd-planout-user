import React from 'react';
import { useLocation } from 'react-router';
import { ArrowUpRight, ClipboardList, X } from 'lucide-react';

interface FloatCardProps {
  pendingCount: number;
  nearestDeadline?: Date;
  onPress: () => void;
  onDismiss?: () => void;
}

function getDaysLeft(deadline?: Date): number | null {
  if (!deadline) return null;

  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff < 0) return null;

  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

export function shouldHideFloatCardOnRoute(pathname: string): boolean {
  if (pathname === '/orders') return true;
  // Event discovery and detail pages need the full viewport for browsing and purchase actions.
  if (pathname === '/events' || pathname.startsWith('/events/')) return true;
  if (pathname === '/notifications') return true;
  if (pathname === '/passport' || pathname.startsWith('/passport/')) return true;
  if (pathname === '/registration-queue') return true;
  if (pathname === '/participant-form' || pathname.startsWith('/participant-form/')) return true;
  if (/^\/orders\/[^/]+$/.test(pathname)) return true;
  if (/^\/orders\/[^/]+\/entry\/[^/]+\/(guest-qr|temporary-guest-qr)$/.test(pathname)) return true;
  if (/^\/orders\/[^/]+\/guest-manager$/.test(pathname)) return true;
  if (/\/form(?:\/|$)/.test(pathname)) return true;
  return false;
}

export function FloatCard({ pendingCount, nearestDeadline, onPress, onDismiss }: FloatCardProps) {
  const location = useLocation();
  const { pathname } = location;

  if (pendingCount <= 0 || shouldHideFloatCardOnRoute(pathname)) return null;

  const daysLeft = getDaysLeft(nearestDeadline);
  const showDeadline = daysLeft != null && daysLeft <= 7;
  const ctaLabel = 'Finish forms';
  const positionClasses = 'fixed left-4 right-4 z-30 mx-auto max-w-[380px] bottom-[calc(104px+env(safe-area-inset-bottom))] md:left-auto md:right-8 md:mx-0 md:w-[360px] md:bottom-8';
  const deadlineLabel = showDeadline ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : '';

  return (
    <div
      role="status"
      aria-label="Forms need your attention"
      className={`${positionClasses} relative rounded-[14px] border border-[#eadfca] bg-white px-3.5 py-3 text-left shadow-[0_12px_32px_-24px_rgba(29,31,26,0.42)] sm:px-4`}
    >
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss forms reminder"
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg text-[#777b73] transition-colors hover:bg-[#f1f2ef] hover:text-[#30332e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.2} />
        </button>
      )}

      <button
        type="button"
        onClick={onPress}
        className="flex w-full items-center gap-3 pr-7 text-left transition-colors hover:bg-[#fcfcfa] active:scale-[0.995] cursor-pointer"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#fbf2e3] text-[#8b5c1b]">
          <ClipboardList className="h-[17px] w-[17px]" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold leading-tight text-[#81591f]">
            {pendingCount} form{pendingCount === 1 ? '' : 's'} need your attention
            {deadlineLabel && <span className="text-[#81591f]"> · {deadlineLabel}</span>}
          </p>
          <p className="mt-1 text-[11px] leading-[1.35] text-[#62665f]">
            Finish the required forms to complete your registration.
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-[#177564]">
          {ctaLabel}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
        </span>
      </button>
    </div>
  );
}
