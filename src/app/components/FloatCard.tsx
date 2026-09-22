import React from 'react';
import { useLocation } from 'react-router';
import { ClipboardList, X } from 'lucide-react';

interface FloatCardProps {
  pendingCount: number;
  nearestDeadline?: Date;
  onPress: () => void;
  onDismiss?: () => void;
  /** Event brand accent color. If provided, card uses event gradient. */
  accentColor?: string;
  /** Event brand accent dark color for gradient end. */
  accentDarkColor?: string;
}

function getDaysLeft(deadline?: Date): number | null {
  if (!deadline) return null;

  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff < 0) return null;

  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

export function shouldHideFloatCardOnRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  // Event discovery and detail pages need the full viewport for browsing and purchase actions.
  if (pathname === '/events' || pathname.startsWith('/events/')) return true;
  if (pathname === '/orders') return true;
  if (pathname === '/passport' || pathname.startsWith('/passport/')) return true;
  if (pathname === '/registration-queue') return true;
  if (pathname === '/participant-form' || pathname.startsWith('/participant-form/')) return true;
  if (/^\/orders\/[^/]+$/.test(pathname)) return true;
  if (/^\/orders\/[^/]+\/entry\/[^/]+\/(guest-qr|temporary-guest-qr)$/.test(pathname)) return true;
  if (/^\/orders\/[^/]+\/guest-manager$/.test(pathname)) return true;
  if (/\/form(?:\/|$)/.test(pathname)) return true;
  return false;
}

export function FloatCard({ pendingCount, nearestDeadline, onPress, onDismiss, accentColor, accentDarkColor }: FloatCardProps) {
  const location = useLocation();
  const { pathname } = location;

  if (pendingCount <= 0 || shouldHideFloatCardOnRoute(pathname)) return null;

  const daysLeft = getDaysLeft(nearestDeadline);
  const showDeadline = daysLeft != null && daysLeft <= 7;
  const ctaLabel = 'Finish Forms';
  const bottomOffset = 'bottom-[calc(104px+env(safe-area-inset-bottom))] sm:bottom-6';
  const deadlineLabel = showDeadline ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : '';

  // Use event brand gradient if on an event page, otherwise default to the brand teal gradient from Passport page
  const hasEventBrand = Boolean(accentColor && accentDarkColor);
  const gradientBg = hasEventBrand
    ? `linear-gradient(135deg, ${accentColor} 0%, ${accentDarkColor} 100%)`
    : 'linear-gradient(135deg, #28b99e 0%, #177564 100%)';
  const borderColor = hasEventBrand ? `${accentColor}55` : 'rgba(89, 200, 184, 0.45)';
  const boxShadow = hasEventBrand
    ? `0 24px 44px -28px ${accentDarkColor}cc`
    : '0 24px 44px -28px rgba(23, 117, 100, 0.85)';
  const ctaTextColor = hasEventBrand ? (accentDarkColor ?? '#0f172a') : '#177564';

  return (
    <div
      role="status"
      aria-label="Forms need your attention"
      className={`fixed left-4 right-4 md:left-auto md:right-8 z-30 mx-auto md:mx-0 max-w-[380px] md:w-[360px] ${bottomOffset} md:bottom-8 overflow-hidden rounded-[18px] px-4 py-3 text-left text-white`}
      style={{ background: gradientBg, border: `1px solid ${borderColor}`, boxShadow }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.18),transparent_34%)]" />

      {/* Giant Background Icon */}
      <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 text-white opacity-[0.07]">
        <ClipboardList className="h-full w-full" strokeWidth={1.2} />
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss forms reminder"
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.2} />
        </button>
      )}

      <button
        type="button"
        onClick={onPress}
        className="relative flex w-full items-center justify-between gap-3 pr-7 text-left transition-transform active:scale-[0.985] cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase leading-tight tracking-[1.25px] text-white/90">
            {pendingCount} form{pendingCount === 1 ? '' : 's'} need your attention
            {deadlineLabel && <span className="text-white"> · {deadlineLabel}</span>}
          </p>
          <p className="mt-1 text-[12px] font-medium leading-[1.35] text-white/90">
            Finish the required forms to complete your registration.
          </p>
        </div>

        <div
          className="shrink-0 rounded-full bg-white px-4 py-2 shadow-[0_12px_22px_-16px_rgba(15,23,42,0.42)]"
          style={{ color: ctaTextColor }}
        >
          <span className="text-[12px] font-semibold leading-none">{ctaLabel}</span>
        </div>
      </button>
    </div>
  );
}
