/**
 * @file EventPeekPanel.tsx
 * @description Desktop-only slide-in peek panel for event previews.
 *
 * Keeps discovery PlanOut-branded while letting the event surface inherit the
 * organizer palette, similar to event pages that can be visually owned by the
 * host.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronUp,
  ChevronDown,
  Share2,
  ExternalLink,
  X,
  Calendar,
  MapPin,
  Ticket,
  Image as ImageIcon,
  FileText,
  Map,
  ChevronRight,
  ShieldCheck,
  Users,
  CircleOff,
  Clock,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { type CheckoutIntentItem } from '@/app/context/AppContext';
import { getBrandPanelStyle, getEventBrand } from '@/app/data/eventBrand';
import { type EventData } from '@/app/data/events';
import { PrimaryButton } from './PrimaryButton';
import { GetTicketsModal } from './GetTicketsModal';

const DEFAULT_COVER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22system-ui%22%20font-size%3D%2248%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EPlanOut%3C%2Ftext%3E%3C%2Fsvg%3E";

function ToolbarButton({
  children,
  onClick,
  label,
  ariaLabel,
  disabled,
  activeColor,
  isDarkPage,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  /** Visible text label. If provided, button expands to show it. */
  label?: string;
  /** Accessible label for icon-only buttons (no visible text). */
  ariaLabel?: string;
  disabled?: boolean;
  activeColor?: string;
  isDarkPage?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[12px] font-semibold shadow-[0_1px_2px_rgba(10,13,18,0.04)] transition-all hover:opacity-80 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 ${label ? '' : 'w-8 px-0'}`}
      style={{
        border: `1px solid ${isDarkPage ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.1)'}`,
        backgroundColor: isDarkPage ? 'rgba(255,255,255,0.1)' : '#ffffff',
        color: activeColor && !disabled ? activeColor : isDarkPage ? 'rgba(255,255,255,0.72)' : '#475569',
      }}
      aria-label={ariaLabel ?? label}
    >
      {children}
      {label && <span>{label}</span>}
    </button>
  );
}

interface EventPeekPanelProps {
  event: EventData;
  events: EventData[];
  onClose: () => void;
  onGoToEventPage: (event: EventData) => void;
  onEventChange: (event: EventData) => void;
  onOrganizerClick?: (organizerSlug: string) => void;
  onGoToCart?: (items?: CheckoutIntentItem[]) => void;
  onGoToCheckout?: (eventName: string, category: string, price: number, image: string, items?: CheckoutIntentItem[]) => void;
}

function splitDateTime(value: string) {
  const [date, time = 'Time TBD'] = value.split(' at ');
  return { date, time };
}

function getSessionSummary(event: EventData) {
  if (event.eventDates?.length) return `${event.eventDates.length} sessions`;
  if (event.dailySchedule?.length) return `${event.dailySchedule.length} scheduled days`;
  if (event.endDate) return 'Multi-day event';
  return '1 session';
}

export function EventPeekPanel({
  event,
  events,
  onClose,
  onGoToEventPage,
  onEventChange,
  onOrganizerClick,
  onGoToCart,
  onGoToCheckout,
}: EventPeekPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);

  const brand = getEventBrand(event);
  const isPast = event.isPast === true;
  const { date: eventDate, time: eventTime } = splitDateTime(event.date);
  const eventVenue = event.location.split(',')[0];
  const attendanceLabel = isPast ? '124 attended' : '124 attending';
  const ticketPriceLabel = isPast ? 'Registration closed' : 'From ₱0';
  const salesCloseLabel = isPast ? `Closed after ${eventDate}` : 'Sales end June 15';
  const sessionSummary = getSessionSummary(event);

  const galleryImages = [
    `https://picsum.photos/seed/event-peek-${event.id}-g1/800/600`,
    `https://picsum.photos/seed/event-peek-${event.id}-g2/800/600`,
    `https://picsum.photos/seed/event-peek-${event.id}-g3/800/600`,
  ];

  const currentIndex = useMemo(
    () => events.findIndex((e) => e.id === event.id),
    [events, event.id],
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < events.length - 1;

  const goToPrev = useCallback(() => {
    if (hasPrev) onEventChange(events[currentIndex - 1]);
  }, [hasPrev, events, currentIndex, onEventChange]);

  const goToNext = useCallback(() => {
    if (hasNext) onEventChange(events[currentIndex + 1]);
  }, [hasNext, events, currentIndex, onEventChange]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/events/${event.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: `Check out ${event.title}`, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Share was cancelled.
    }
  }, [event.id, event.title]);

  useEffect(() => {
    setIsExpanded(false);
  }, [event.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showTicketsModal) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goToPrev, goToNext, showTicketsModal]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="absolute inset-0 bg-[#101828]/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 310 }}
        className="absolute bottom-0 right-0 top-0 flex w-full max-w-[820px] flex-col overflow-hidden bg-white shadow-[-18px_0_44px_-34px_rgba(15,23,42,0.6)]"
        style={getBrandPanelStyle(event)}
      >
        <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-[var(--event-page-border)] bg-[var(--event-surface)] px-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <ToolbarButton onClick={goToPrev} disabled={!hasPrev} isDarkPage={brand.isDarkPage} ariaLabel="Previous event">
              <ChevronUp className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={goToNext} disabled={!hasNext} isDarkPage={brand.isDarkPage} ariaLabel="Next event">
              <ChevronDown className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleShare} label="Share" isDarkPage={brand.isDarkPage}>
              <Share2 className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => onGoToEventPage(event)}
              label="Event page"
              activeColor={brand.accent}
              isDarkPage={brand.isDarkPage}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </ToolbarButton>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] shadow-[0_1px_2px_rgba(10,13,18,0.04)] transition-colors"
            style={{
              border: `1px solid ${brand.isDarkPage ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.1)'}`,
              backgroundColor: brand.isDarkPage ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
              color: brand.isDarkPage ? 'rgba(255,255,255,0.64)' : 'var(--event-surface-muted)',
            }}
            aria-label="Close event peek"
          >
            <X className="h-4 w-4" strokeWidth={2.3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <section className="relative h-[352px] overflow-hidden bg-neutral-100">
            <ImageWithFallback
              src={event.image || DEFAULT_COVER_IMAGE}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/82" />
            <div
              className="absolute inset-x-0 bottom-0 h-28 opacity-90 mix-blend-multiply"
              style={{ background: `linear-gradient(180deg, transparent 0%, ${brand.heroOverlay} 100%)` }}
            />

            <div className="absolute left-6 right-6 top-5 flex flex-wrap items-center gap-2">
              {isPast && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <CircleOff className="h-3 w-3" />
                  Past event
                </span>
              )}
              {event.labels.slice(0, 3).map((label) => (
                <span key={label} className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  {label}
                </span>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6">
              <button
                type="button"
                onClick={() => onOrganizerClick?.(event.organizer)}
                aria-label={`View organizer: ${event.organizer}`}
                className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full bg-white/16 px-2 py-1 pr-3 text-left text-white backdrop-blur-md transition-colors hover:bg-white/22 cursor-pointer group"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                  style={{ backgroundColor: brand.accent, color: brand.textOnAccent }}
                >
                  {event.organizer.charAt(0)}
                </span>
                <span className="truncate text-[12px] font-semibold group-hover:underline">{event.organizer}</span>
              </button>

              <h1 className="max-w-[620px] text-[32px] font-bold leading-[1.05] tracking-[-0.8px] text-white drop-shadow-sm">
                {event.title}
              </h1>
              <p className="mt-2 text-[13px] font-medium text-white/74">
                {eventDate} at {eventTime} · {eventVenue}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-[minmax(0,1fr)_264px] gap-6 px-6 py-6">
            <div className="min-w-0 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Calendar, label: 'Date', value: eventDate, sub: eventTime },
                  { icon: MapPin, label: 'Location', value: eventVenue, sub: event.location },
                  { icon: Users, label: 'Attendance', value: attendanceLabel, sub: sessionSummary },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="min-w-0 rounded-[16px] border border-[var(--event-surface-border)] bg-[var(--event-surface)] p-3.5 shadow-[0_10px_28px_-26px_rgba(15,23,42,0.5)]">
                    <Icon className="mb-2 h-4 w-4" style={{ color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }} strokeWidth={1.9} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--event-surface-muted)]">{label}</p>
                    <p className="mt-1 truncate text-[13px] font-semibold text-[var(--event-surface-fg)]">{value}</p>
                    <p className="truncate text-[12px] text-[var(--event-surface-muted)]">{sub}</p>
                  </div>
                ))}
              </div>

              <section>
                <h2 className="text-[17px] font-semibold tracking-[-0.2px] text-[var(--event-page-fg)]">About</h2>
                <div 
                  className={`relative mt-3 overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[520px]' : 'max-h-[112px]'}`}
                  style={!isExpanded ? {
                    maskImage: 'linear-gradient(to bottom, black 50px, transparent 108px)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 50px, transparent 108px)',
                  } : undefined}
                >
                  <p className="text-[14.5px] leading-[1.75] text-[var(--event-page-muted)]">
                    {event.title} brings athletes and supporters together for a high-energy day hosted by {event.organizer}. Expect organized check-in, clear race-day flow, and on-site support built around the needs of participants. The event is based at {event.location}, with access details and participant requirements available before arrival. Complete your registration early so your PlanOut passport is ready at the gate.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="mt-2 inline-flex items-center gap-0.5 text-[13px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: brand.accent }}
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              </section>

              <section className="border-t border-[var(--event-page-border)] pt-6">
                <h2 className="text-[17px] font-semibold tracking-[-0.2px] text-[var(--event-page-fg)]">Good to know</h2>
                <div className="mt-2 divide-y divide-[var(--event-page-border)]">
                  {[
                    { icon: ShieldCheck, title: 'Passport entry', detail: 'Your registration activates against your PlanOut passport.' },
                    { icon: FileText, title: 'Entry requirements', detail: 'Bring a valid ID and review organizer documents before arrival.' },
                    { icon: Ticket, title: 'Registration', detail: isPast ? 'Registration is closed for this event.' : salesCloseLabel },
                  ].map(({ icon: Icon, title, detail }) => (
                    <div key={title} className="flex items-start gap-3 py-4">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }} strokeWidth={1.8} />
                      <div>
                        <p className="text-[14px] font-medium text-[var(--event-page-fg)]">{title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--event-page-muted)]">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-t border-[var(--event-page-border)] pt-6">
                <h2 className="text-[17px] font-semibold tracking-[-0.2px] text-[var(--event-page-fg)]">Location</h2>
                <div className="mt-3 overflow-hidden rounded-[18px] border border-[var(--event-surface-border)] bg-[var(--event-surface)]">
                  <div className="relative h-40 overflow-hidden" style={{ backgroundColor: brand.isDarkPage ? '#1e2533' : '#f8f8f7' }}>
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 256px)',
                        width: 768,
                        height: 512,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {([
                        [9648, 12301], [9649, 12301], [9650, 12301],
                        [9648, 12302], [9649, 12302], [9650, 12302],
                      ] as [number, number][]).map(([x, y]) => (
                        <img
                          key={`${x}-${y}`}
                          src={`https://a.basemaps.cartocdn.com/${brand.isDarkPage ? 'dark_all' : 'light_all'}/15/${x}/${y}.png`}
                          width={256}
                          height={256}
                          alt=""
                          draggable={false}
                          style={{ display: 'block', userSelect: 'none' }}
                        />
                      ))}
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: brand.accent, boxShadow: `0 4px 20px ${brand.accentGlow}` }}
                      >
                        <MapPin className="h-4 w-4" strokeWidth={2.2} />
                      </div>
                      <div className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brand.accentRing }} />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[14px] font-medium text-[var(--event-surface-fg)]">{eventVenue}</p>
                    <p className="text-[12.5px] text-[var(--event-surface-muted)]">{event.location}</p>
                  </div>
                </div>
              </section>

              <section className="border-t border-[var(--event-page-border)] pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-semibold tracking-[-0.2px] text-[var(--event-page-fg)]">Requirements</h2>
                  <button type="button" className="text-[12px] font-semibold" style={{ color: brand.accent }}>View all</button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { icon: Map, label: 'Route map', sub: 'Interactive guide' },
                    { icon: FileText, label: 'Event waiver', sub: 'PDF available' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <button key={label} type="button" className="group flex items-center gap-3 rounded-[14px] border border-[var(--event-surface-border)] bg-[var(--event-surface)] p-3 text-left transition-colors hover:bg-white/10">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]" style={{ backgroundColor: brand.isDarkPage ? 'rgba(255, 255, 255, 0.12)' : brand.accentWash, color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-[var(--event-surface-fg)]">{label}</span>
                        <span className="block truncate text-[12px] text-[var(--event-surface-muted)]">{sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="border-t border-[var(--event-page-border)] pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[17px] font-semibold tracking-[-0.2px] text-[var(--event-page-fg)]">Gallery</h2>
                  <button type="button" className="text-[12px] font-semibold" style={{ color: brand.accent }}>View all</button>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {galleryImages.map((src, index) => (
                    <div key={src} className="relative aspect-square overflow-hidden rounded-[14px] bg-neutral-100">
                      {index === 0 ? (
                        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                            <ImageIcon className="h-7 w-7" />
                          </div>
                          <div className="absolute inset-0" style={{ backgroundColor: brand.accentFaint }} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="sticky top-5 h-fit">
              <div
                className="rounded-[22px] border p-5 shadow-[0_18px_38px_-34px_rgba(15,23,42,0.64)]"
                style={{ backgroundColor: brand.surface, borderColor: brand.surfaceBorder, color: brand.surfaceForeground }}
              >
                {isPast ? (
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#94a3b8]">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[15px] font-bold text-[var(--event-surface-fg)]">This event has ended</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[var(--event-surface-muted)]">
                        This event took place on {eventDate}. Registration is closed.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-5 flex items-baseline justify-between">
                      <div>
                        <p className="text-[24px] font-bold tracking-[-0.5px] text-[var(--event-surface-fg)]">{ticketPriceLabel}</p>
                        <p className="mt-1 text-[12.5px] font-medium text-[var(--event-surface-muted)]">{salesCloseLabel}</p>
                      </div>
                      <Ticket className="h-4.5 w-4.5" style={{ color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }} strokeWidth={1.8} />
                    </div>

                    <PrimaryButton
                      brandGradient={brand.buttonGradient}
                      fullWidth
                      className="py-3.5 rounded-[14px] font-semibold text-[15px]"
                      onClick={() => setShowTicketsModal(true)}
                    >
                      Get Tickets
                    </PrimaryButton>

                    <div className="mt-5 space-y-3 border-t border-[var(--event-surface-border)] pt-4 text-[12px] font-medium text-[var(--event-surface-muted)]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }} />
                        <span>Secure organizer checkout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 shrink-0" style={{ color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }} />
                        <span>Entry attaches to your Passport</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </motion.div>

      {!isPast && (
        <GetTicketsModal
          isOpen={showTicketsModal}
          onClose={() => setShowTicketsModal(false)}
          onAddToCart={(items) => {
            setShowTicketsModal(false);
            onGoToCart?.(items.map((item) => ({
              ticketId: item.ticketId,
              qty: item.qty,
              category: item.category,
              price: item.price,
              eventName: event.title,
              image: event.image || '',
            })));
          }}
          onCheckout={(items, total) => {
            setShowTicketsModal(false);
            const checkoutItems = items.map((item) => ({
              ticketId: item.ticketId,
              qty: item.qty,
              category: item.category,
              price: item.price,
              eventName: event.title,
              image: event.image || '',
            }));
            const category =
              items.length === 1
                ? items[0].category
                : `${items.length} ticket type${items.length > 1 ? 's' : ''}`;
            onGoToCheckout?.(event.title, category, total, event.image || '', checkoutItems);
          }}
        />
      )}
    </motion.div>
  );
}
