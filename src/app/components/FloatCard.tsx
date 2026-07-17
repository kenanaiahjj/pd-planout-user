import React from 'react';
import { useLocation } from 'react-router';
import { ClipboardList } from 'lucide-react';

interface FloatCardProps {
  pendingCount: number;
  nearestDeadline?: Date;
  onPress: () => void;
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

function shouldHideOnRoute(pathname: string): boolean {
  if (pathname.startsWith('/passport/')) return true;
  if (pathname === '/registration-queue') return true;
  if (pathname === '/participant-form' || pathname.startsWith('/participant-form/')) return true;
  if (/^\/orders\/[^/]+$/.test(pathname)) return true;
  if (/^\/orders\/[^/]+\/entry\/[^/]+\/(guest-qr|temporary-guest-qr)$/.test(pathname)) return true;
  if (/^\/orders\/[^/]+\/guest-manager$/.test(pathname)) return true;
  if (/\/form(?:\/|$)/.test(pathname)) return true;
  return false;
}

export function FloatCard({ pendingCount, nearestDeadline, onPress, accentColor, accentDarkColor }: FloatCardProps) {
  const location = useLocation();
  const { pathname } = location;

  if (pendingCount <= 0 || shouldHideOnRoute(pathname)) return null;

  const daysLeft = getDaysLeft(nearestDeadline);
  const showDeadline = daysLeft != null && daysLeft <= 7;
  const ctaLabel = 'Finish Forms';
  const bottomOffset = 'bottom-[calc(104px+env(safe-area-inset-bottom))] sm:bottom-6';
  const deadlineLabel = showDeadline
    ? ` ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`
    : '';

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
    <button
      type="button"
      onClick={onPress}
      className={`fixed left-4 right-4 z-40 mx-auto max-w-[440px] ${bottomOffset} overflow-hidden rounded-[22px] px-5 py-4 text-left text-white transition-transform active:scale-[0.985]`}
      style={{ background: gradientBg, border: `1px solid ${borderColor}`, boxShadow }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.18),transparent_34%)]" />

      {/* Giant Background Icon */}
      <div className="pointer-events-none absolute -left-5 -top-5 h-32 w-32 text-white opacity-[0.07]">
        <ClipboardList className="h-full w-full" strokeWidth={1.2} />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase leading-tight tracking-[1.4px] text-white/78">
            {pendingCount} form{pendingCount === 1 ? '' : 's'} need your attention{deadlineLabel && ` ·${deadlineLabel}`}
          </p>
          <p className="mt-1.5 text-[13px] font-medium leading-[1.35] text-white/88">
            Finish the required forms to complete your registration.
          </p>
        </div>

        <div
          className="shrink-0 rounded-full bg-white px-5 py-2.5 shadow-[0_12px_22px_-16px_rgba(15,23,42,0.42)]"
          style={{ color: ctaTextColor }}
        >
          <span className="text-[13px] font-semibold leading-none">{ctaLabel}</span>
        </div>
      </div>
    </button>
  );
}
