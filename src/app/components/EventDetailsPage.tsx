/**
 * @file EventDetailsPage.tsx
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  BellRing,
  ArrowLeft,
  Share2,
  Image as ImageIcon,
  FileText,
  Map,
  MapPin,
  Navigation,
  ChevronRight,
  ShieldCheck,
  Users,
  CircleOff,
  Ticket,
  X,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { type EventData } from '@/app/data/events';
import {
  formatEventDateOnly,
  formatEventDateRange,
  formatEventDay,
  getEventTime,
} from '@/app/data/eventDate';
import { getBrandCSSVarsStyle, getBrandSurfaceStyle, getEventBrand } from '@/app/data/eventBrand';
import { getGoogleMapsSearchUrl } from '@/app/data/navigation.js';
import { type CheckoutIntentItem } from '@/app/context/AppContext';
import { PrimaryButton } from './PrimaryButton';
import { GetTicketsModal, getCheapestTicketPriceLabel } from './GetTicketsModal';

interface EventDetailsPageProps {
  event: EventData;
  onBack: () => void;
  onOrganizerClick?: (organizerSlug: string) => void;
  onGoToCart?: (items?: CheckoutIntentItem[]) => void;
  onGoToCheckout?: (eventName: string, category: string, price: number, image: string, items?: CheckoutIntentItem[]) => void;
}

const DEFAULT_COVER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22system-ui%22%20font-size%3D%2248%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EPlanOut%3C%2Ftext%3E%3C%2Fsvg%3E";

const MONTH_ABBR: Record<string, string> = {
  January: 'JAN',
  February: 'FEB',
  March: 'MAR',
  April: 'APR',
  May: 'MAY',
  June: 'JUN',
  July: 'JUL',
  August: 'AUG',
  September: 'SEP',
  October: 'OCT',
  November: 'NOV',
  December: 'DEC',
};

function dateTileParts(dateValue: string) {
  const dateOnly = dateValue.split(' at ')[0];
  const [month = '', day = '--'] = dateOnly.split(/\s+/);

  return {
    month: MONTH_ABBR[month] ?? month.slice(0, 3).toUpperCase(),
    day: day.replace(',', ''),
  };
}

export function EventDetailsPage({ event, onBack, onOrganizerClick, onGoToCart, onGoToCheckout }: EventDetailsPageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [isNotifyOn, setIsNotifyOn] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const brand = getEventBrand(event);
  const isPast = event.isPast === true;
  const eventDateLabel = formatEventDateOnly(event.date);
  const endEventDateLabel = event.endDate ? formatEventDateOnly(event.endDate) : undefined;
  const eventTime = getEventTime(event.date);
  const endEventTime = event.endDate ? getEventTime(event.endDate) : undefined;
  const eventDateRangeLabel = event.endDate
    ? formatEventDateRange(event.date, event.endDate)
    : eventDateLabel;
  const eventVenue = event.location.split(',')[0];
  const eventCity = event.location.split(',')[1]?.trim() || '';
  const attendanceLabel = isPast ? '124 attended' : '124 attending';
  const ticketPriceLabel = isPast ? 'Registration closed' : getCheapestTicketPriceLabel();
  const salesCloseLabel = isPast ? `Closed after ${eventDateLabel}` : 'Sales end June 15';
  const registrationEndedLabel = `Registration ended after ${eventDateLabel}`;
  const sessionSummary = event.eventDates?.length
    ? `${event.eventDates.length} sessions`
    : event.endDate ? 'Multi-day' : '1 session';
  const dateTile = dateTileParts(event.eventDates?.[0] ?? event.date);

  const galleryImages = [
    `https://picsum.photos/seed/event-${event.id}-g1/800/600`,
    `https://picsum.photos/seed/event-${event.id}-g2/800/600`,
    `https://picsum.photos/seed/event-${event.id}-g3/800/600`,
    `https://picsum.photos/seed/event-${event.id}-g4/800/600`,
  ];

  function cycleSelectedImage(direction: -1 | 1) {
    setSelectedImageIndex((current) => {
      if (current === null || galleryImages.length === 0) return current;
      return (current + direction + galleryImages.length) % galleryImages.length;
    });
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: `Check out ${event.title}!`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied', { duration: 2000 });
      }
    } catch { /* cancelled */ }
  };

  const toggleNotification = () => {
    setIsNotifyOn((prev) => {
      const next = !prev;
      toast(next ? 'Notifications on' : 'Notifications off', {
        icon: next ? <BellRing className="w-4 h-4" style={{ color: brand.accent }} /> : <Bell className="w-4 h-4 text-[#94a3b8]" />,
        duration: 2000,
      });
      return next;
    });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="relative -mx-4 w-[calc(100%+2rem)] pb-24 sm:mx-0 sm:w-full sm:pb-8 lg:pb-0"
      style={getBrandCSSVarsStyle(event)}
    >
      {/* ── Hero Image (Full Width) ── */}
      <motion.div variants={fadeUp}>
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[480px] overflow-hidden sm:rounded-t-[14px] lg:rounded-none">
          <ImageWithFallback
            src={event.image || DEFAULT_COVER_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/18" />
          <ImageWithFallback
            src={event.image || DEFAULT_COVER_IMAGE}
            alt={event.title}
            className="relative z-[1] h-full w-full object-contain"
          />
          {/* Top fade gradient for header legibility */}
          <div className="absolute top-0 left-0 right-0 z-[2] h-36 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* ── Event Summary (Below Hero Image) ── */}
      <motion.div variants={fadeUp} className="px-5 pt-5 pb-1 lg:mx-auto lg:max-w-[960px] lg:px-8 lg:pt-7">
        <div className="flex flex-wrap gap-2">
          {event.labels.map((label, i) => (
            <span
              key={i}
              className="rounded-full px-3.5 py-1 text-[12px] font-semibold"
              style={{ backgroundColor: brand.accentWash, color: brand.accent }}
            >
              {label}
            </span>
          ))}
        </div>
        <h1 className="mt-3 max-w-[820px] text-[32px] font-bold leading-[1.05] tracking-[-0.035em] text-[var(--event-page-fg)] sm:text-[44px]">
          {event.title}
        </h1>
      </motion.div>

      {/* ── Content Grid (Under Hero Section) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] lg:gap-8 lg:items-start p-0 lg:p-8 lg:max-w-[960px] lg:mx-auto">

        {/* ── Left Column: Details ── */}
        <div className="flex flex-col">
          {/* Mobile CTA */}
          {!isPast && (
            <motion.div variants={fadeUp} className="flex items-center justify-between gap-4 px-5 pt-5 pb-1 lg:hidden">
              <div>
                <p className="text-[20px] font-bold text-[var(--event-page-fg)] tracking-tight">{ticketPriceLabel}</p>
                <p className="text-[12px] text-[var(--event-page-muted)]">{salesCloseLabel}</p>
              </div>
              <PrimaryButton brandGradient={brand.buttonGradient} className="py-2.5 px-5 rounded-[12px] font-semibold text-[14px] shrink-0" onClick={() => setShowTicketsModal(true)}>
                Get Tickets
              </PrimaryButton>
            </motion.div>
          )}

          {/* Organizer & Actions */}
          <motion.div variants={fadeUp} className="px-5 pt-5 pb-0 lg:pt-0 lg:px-0 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onOrganizerClick?.(event.organizer)}
              className="flex items-center gap-2.5 group min-w-0 cursor-pointer"
            >
              <div
                className="h-8 w-8 rounded-[8px] flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{ backgroundColor: brand.accentWash, color: brand.accent }}
              >
                {event.organizer.charAt(0)}
              </div>
              <div className="text-left min-w-0">
                <p className="text-[14px] font-semibold text-[var(--event-page-fg)] transition-colors truncate group-hover:underline group-hover:opacity-90">{event.organizer}</p>
                <p className="text-[13px] text-[var(--event-page-muted)] truncate">
                  Rating · {event.rating.toFixed(1)} ★
                </p>
              </div>
            </button>

            {/* Share & Notification Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleShare}
                className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
                style={{
                  border: `1px solid ${brand.isDarkPage ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)'}`,
                  backgroundColor: brand.isDarkPage ? 'rgba(255,255,255,0.12)' : '#ffffff',
                  color: brand.isDarkPage ? 'rgba(255,255,255,0.72)' : '#64748b',
                }}
                title="Share event"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggleNotification}
                className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
                style={isNotifyOn
                  ? { border: `1px solid ${brand.accentSoft}`, backgroundColor: brand.accentWash, color: brand.accent }
                  : {
                      border: `1px solid ${brand.isDarkPage ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)'}`,
                      backgroundColor: brand.isDarkPage ? 'rgba(255,255,255,0.12)' : '#ffffff',
                      color: brand.isDarkPage ? 'rgba(255,255,255,0.72)' : '#64748b',
                    }
                }
                title={isNotifyOn ? 'Disable notifications' : 'Enable notifications'}
              >
                {isNotifyOn ? <BellRing className="w-3.5 h-3.5" strokeWidth={2} /> : <Bell className="w-3.5 h-3.5" strokeWidth={2} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Key facts */}
          <motion.div variants={fadeUp} className="px-5 pt-4 lg:px-0">
            <div className="space-y-0 divide-y divide-[var(--event-page-border)]">
              <div className="flex items-start gap-3 py-3.5">
                <div
                  className="mt-0.5 h-5 w-4 shrink-0 overflow-hidden rounded-[4px] border border-[var(--event-page-subtle)] text-[var(--event-page-subtle)]"
                  aria-hidden="true"
                >
                  <div className="border-b border-[var(--event-page-subtle)] py-[1px] text-center text-[5px] font-bold leading-none tracking-[0.04em]">
                    {dateTile.month}
                  </div>
                  <div className="pt-[1px] text-center text-[9px] font-bold leading-none">
                    {dateTile.day}
                  </div>
                </div>
                {event.dailySchedule ? (
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[14px] font-medium text-[var(--event-page-fg)]">{eventDateRangeLabel}</span>
                    </div>
                    {event.dailySchedule.map((day, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className="text-[13px] font-medium text-[var(--event-page-muted)] w-28 shrink-0">{formatEventDay(day.date)}</span>
                        <span className="font-mono text-[12px] text-[var(--event-page-subtle)]">{day.startTime} – {day.endTime}</span>
                      </div>
                    ))}
                  </div>
                ) : event.eventDates ? (
                  <div className="space-y-1.5">
                    <span className="text-[14px] font-medium text-[var(--event-page-fg)]">{event.eventDates.length} sessions</span>
                    {event.eventDates.map((d, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className="text-[13px] text-[var(--event-page-muted)]">{formatEventDay(d)}</span>
                        <span className="font-mono text-[12px] text-[var(--event-page-subtle)]">{getEventTime(d)}</span>
                      </div>
                    ))}
                  </div>
                ) : endEventDateLabel ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] font-medium text-[var(--event-page-fg)]">{eventDateRangeLabel}</span>
                    <span className="font-mono text-[13px] text-[var(--event-page-subtle)]">{eventTime}{endEventTime ? ` – ${endEventTime}` : ''}</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] font-medium text-[var(--event-page-fg)]">{eventDateLabel}</span>
                    <span className="font-mono text-[13px] text-[var(--event-page-subtle)]">{eventTime}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 py-3.5">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--event-page-subtle)]" strokeWidth={1.8} />
                <span className="text-[14px] font-medium text-[var(--event-page-fg)]">{eventVenue}{eventCity ? <span className="font-normal text-[var(--event-page-subtle)]">, {eventCity}</span> : null}</span>
              </div>
              <div className="flex items-center gap-3 py-3.5">
                <Users className="h-4 w-4 shrink-0 text-[var(--event-page-subtle)]" strokeWidth={1.8} />
                <span className="text-[14px] font-medium text-[var(--event-page-fg)]">{attendanceLabel}</span>
                <div className="ml-auto flex -space-x-1.5">
                  {[1, 2, 3].map((i) => (
                    <img key={i} className="h-6 w-6 rounded-full ring-2 ring-white object-cover" src={`https://picsum.photos/seed/user-${i}/50/50`} alt="" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {isPast && (
            <motion.div variants={fadeUp} className="px-5 pt-3 lg:px-0">
              <div
                className="flex items-start gap-3 rounded-[14px] border px-4 py-3.5"
                style={{
                  borderColor: brand.isDarkPage ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.08)',
                  backgroundColor: brand.isDarkPage ? 'rgba(255,255,255,0.06)' : '#f8fafc',
                }}
              >
                <div
                  className="mt-[1px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: brand.isDarkPage ? 'rgba(255,255,255,0.08)' : '#eef2f7',
                    color: brand.pageSubtle,
                  }}
                >
                  <CircleOff className="h-3.5 w-3.5" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-[var(--event-page-fg)]">Registration closed</p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--event-page-muted)]">
                    {registrationEndedLabel}. This event is kept here for reference.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div className="mx-5 mt-1 border-t border-[var(--event-page-border)] lg:mx-0" />

          {/* About */}
          <motion.div variants={fadeUp} className="px-5 pt-6 pb-2 lg:px-0">
            <h2 className="text-[16px] font-semibold text-[var(--event-page-fg)] mb-3">About</h2>
            <div 
              className={`relative overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[600px]' : 'max-h-[88px]'}`}
              style={!isExpanded ? {
                maskImage: 'linear-gradient(to bottom, black 35px, transparent 84px)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 35px, transparent 84px)',
              } : undefined}
            >
              <p className="text-[14.5px] leading-[1.75] text-[var(--event-page-muted)]">
                {event.title} brings athletes and supporters together for a high-energy day hosted by {event.organizer}. Expect organized check-in, clear race-day flow, and on-site support built around the needs of participants. The event is based at {event.location}, with access details and participant requirements available before arrival. Complete your registration early so your PlanOut passport is ready at the gate. Bring a valid ID and review the route or venue guidance.
              </p>
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 flex items-center gap-0.5 text-[13px] font-medium transition-opacity hover:opacity-70" style={{ color: brand.accent }}>
              {isExpanded ? 'Show less' : 'Read more'}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          </motion.div>

          <div className="mx-5 mt-4 border-t border-[var(--event-page-border)] lg:mx-0" />

          {/* Good to know */}
          <motion.div variants={fadeUp} className="px-5 pt-6 pb-2 lg:px-0">
            <h2 className="text-[16px] font-semibold text-[var(--event-page-fg)] mb-1">Good to know</h2>
            <div className="divide-y divide-[var(--event-page-border)]">
              {[
                { icon: ShieldCheck, title: 'Refund policy', detail: 'Refunds are handled by the organizer before final race-day confirmation.' },
                { icon: FileText, title: 'Entry requirements', detail: 'Bring a valid ID and keep your PlanOut passport ready at check-in.' },
                { icon: Users, title: 'Attendance', detail: `${attendanceLabel} · ${sessionSummary}` },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-start gap-3 py-4">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--event-page-subtle)] mt-0.5" strokeWidth={1.8} />
                  <div>
                    <p className="text-[14px] font-medium text-[var(--event-page-fg)]">{title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--event-page-muted)]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mx-5 border-t border-[var(--event-page-border)] lg:mx-0" />

          {/* Location */}
          <motion.div variants={fadeUp} className="px-5 pt-6 pb-2 lg:px-0">
            <h2 className="text-[16px] font-semibold text-[var(--event-page-fg)] mb-3">Location</h2>
            <div className="overflow-hidden rounded-[18px] border border-[var(--event-surface-border)] bg-[var(--event-surface)]">
              <div className="relative h-44 overflow-hidden" style={{ backgroundColor: brand.isDarkPage ? '#1e2533' : '#f8f8f7' }}>
                {/* CartoDB Light (Positron) tile grid — zoom 15, Midtown Manhattan */}
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
                {/* Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ backgroundColor: brand.accent, boxShadow: `0 4px 20px ${brand.accentGlow}` }}>
                    <MapPin className="h-4 w-4" strokeWidth={2.2} />
                  </div>
                  <div className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brand.accentRing }} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-[var(--event-surface)]">
                <div>
                  <p className="text-[14px] font-medium text-[var(--event-surface-fg)]">{eventVenue}</p>
                  <p className="text-[12.5px] text-[var(--event-surface-muted)]">{event.location}</p>
                </div>
                <a
                  href={getGoogleMapsSearchUrl(event.location)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={'Get directions to ' + event.location}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--event-surface-border)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--event-surface-muted)] transition-colors hover:bg-white/10 active:scale-95"
                >
                  <Navigation className="h-3.5 w-3.5" strokeWidth={2} />
                  Directions
                </a>
              </div>
            </div>
          </motion.div>

          <div className="mx-5 mt-4 border-t border-[var(--event-page-border)] lg:mx-0" />

          {/* Event Requirements */}
          <motion.div variants={fadeUp} className="px-5 pt-6 pb-2 lg:px-0">
            <h2 className="text-[16px] font-semibold text-[var(--event-page-fg)] mb-1">Requirements</h2>
            <div className="divide-y divide-[var(--event-page-border)]">
              {[
                { icon: Map, label: 'Route Map', sub: 'Interactive · GPX available' },
                { icon: FileText, label: 'Event Waiver', sub: 'PDF · 142 KB' },
              ].map(({ icon: Icon, label, sub }) => (
                <button key={label} type="button" className="group flex w-full items-center gap-3 py-4 text-left hover:opacity-70 transition-opacity active:opacity-50">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--event-page-subtle)]" strokeWidth={1.8} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--event-page-fg)]">{label}</p>
                    <p className="text-[12.5px] text-[var(--event-page-muted)]">{sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--event-page-subtle)] shrink-0" strokeWidth={2} />
                </button>
              ))}
            </div>
          </motion.div>

          <div className="mx-5 border-t border-[var(--event-page-border)] lg:mx-0" />

          {/* Gallery */}
          <motion.div variants={fadeUp} className="px-5 pt-6 pb-8 lg:px-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] font-semibold text-[var(--event-page-fg)]">Gallery</h2>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setSelectedImageIndex(0)}
                className="text-[13px] font-medium transition-opacity hover:opacity-70"
                style={{ color: brand.accent }}
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {galleryImages.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative overflow-hidden rounded-[14px] cursor-pointer bg-neutral-100 ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'} sm:col-span-1 sm:row-span-1`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Sticky Booking Panel (Desktop only) ── */}
        {!isPast && (
          <div className="hidden lg:block lg:sticky lg:top-6 lg:w-[340px] shrink-0">
            <div
              className="rounded-[24px] border p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
              style={{ backgroundColor: brand.surface, borderColor: brand.surfaceBorder, color: brand.surfaceForeground }}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <p className="text-[24px] font-bold text-[var(--event-surface-fg)] tracking-tight">{ticketPriceLabel}</p>
                <Ticket className="h-4.5 w-4.5 text-[var(--event-surface-muted)]" strokeWidth={1.8} />
              </div>
              <p className="text-[13px] text-[var(--event-surface-muted)] mb-5">{salesCloseLabel}</p>
              
              <PrimaryButton
                brandGradient={brand.buttonGradient}
                fullWidth
                className="py-3.5 rounded-[14px] font-semibold text-[15px]"
                onClick={() => setShowTicketsModal(true)}
              >
                Get Tickets
              </PrimaryButton>
              
              <div className="mt-6 space-y-3.5 border-t border-[var(--event-surface-border)] pt-5 text-[12px] text-[var(--event-surface-muted)] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }} strokeWidth={2} />
                  <span>Verified Organizer & Secure Gate Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 shrink-0" style={{ color: brand.isDarkPage ? '#ffffff' : '#5f6f86' }} strokeWidth={2} />
                  <span>Instant PlanOut Passport Entry Activation</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bar */}
      {!isPast && (
        <div className="fixed bottom-0 inset-x-0 border-t border-[var(--event-surface-border)] bg-[var(--event-surface)] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] backdrop-blur-xl lg:hidden z-50">
          <div className="flex items-center justify-between gap-4 max-w-[960px] mx-auto">
            <div>
              <p className="text-[16px] font-bold text-[var(--event-surface-fg)] tracking-tight">{ticketPriceLabel}</p>
              <p className="text-[11.5px] text-[var(--event-surface-muted)]">{eventDateLabel} · {eventTime}</p>
            </div>
            <PrimaryButton brandGradient={brand.buttonGradient} className="py-3 px-7 rounded-[12px] font-semibold text-[14px]" onClick={() => setShowTicketsModal(true)}>
              Get Tickets
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={'Event gallery for ' + event.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setSelectedImageIndex(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              className="relative max-w-4xl w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => cycleSelectedImage(-1)}
                className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                &larr;
              </button>
              <motion.img
                key={selectedImageIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                src={galleryImages[selectedImageIndex]}
                alt=""
                className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              />
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => cycleSelectedImage(1)}
                className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                &rarr;
              </button>
            </div>
            <p className="absolute bottom-5 text-white/40 text-xs font-medium">
              {selectedImageIndex + 1} / {galleryImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Get Tickets Modal */}
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
            const category = items.length === 1
              ? items[0].category
              : `${items.length} ticket types`;
            onGoToCheckout?.(event.title, category, total, event.image || '', checkoutItems);
          }}
        />
      )}
    </motion.div>
  );
}
