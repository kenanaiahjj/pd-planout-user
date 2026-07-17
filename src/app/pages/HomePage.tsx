/**
 * @file HomePage.tsx
 * @description State-aware Home page. Guests get a premium event-discovery entry
 * point; authenticated users get a personal PlanOut command centre.
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Calendar,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  MapPin,
  Search,
  ShieldCheck,
  TicketCheck,
  UserCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { EventCard } from '@/app/components/EventCard';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PlanOutPassportCard } from '@/app/components/PlanOutPassportCard';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { useAppContext } from '@/app/context/AppContext';
import { MOCK_EVENTS, type EventData } from '@/app/data/events';
import { getOrderFormActionEntries, MY_TICKETS, type MyTicket, type RegistrationQueueEntry } from '@/app/data/tickets';
import imgAvatar from '@/assets/abde7b942aa982263d4cf69ea8ef217b427c3047.png';
import imgNoUpcomingEvents from '@/assets/ChatGPT Image Jun 18, 2026, 10_04_48 AM.png';

interface HomePageProps {
  onEventSelect: (event: EventData) => void;
  onGoToEvents: (query?: string) => void;
  userName?: string;
}

const SPORTS = ['Running', 'Basketball', 'Cycling', 'Tennis', 'Triathlon', 'Swimming', 'Volleyball', 'Fitness'];
const FEATURED_EVENTS = MOCK_EVENTS.filter((event) => !event.isPast).slice(0, 4);
const RECOMMENDED_EVENTS = MOCK_EVENTS.filter((event) => !event.isPast).slice(2, 7);

function firstName(name?: string) {
  return name?.trim().split(/\s+/)[0] || 'there';
}

function findTicket(entry?: RegistrationQueueEntry) {
  if (!entry) return undefined;
  return MY_TICKETS.find((ticket) => ticket.id === entry.ticketId);
}

function parseDate(date?: string) {
  if (!date) return null;
  const normalized = date.replace(' at ', ' ');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function compactDate(date?: string) {
  if (!date) return 'Date to be announced';
  return date.replace(' at ', ' · ');
}

function deadlineLabel(deadline?: string) {
  const parsed = parseDate(deadline);
  if (!deadline || !parsed) return undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(parsed);
  due.setHours(0, 0, 0, 0);
  const days = Math.ceil((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  if (days < 0) return `Deadline passed · ${deadline}`;
  if (days === 0) return `Due today · ${deadline}`;
  if (days === 1) return `Due tomorrow · ${deadline}`;
  return `Due in ${days} days · ${deadline}`;
}

function dateParts(date?: string) {
  if (!date) return { month: 'TBA', day: '', time: 'Time TBA', full: 'Date to be announced' };
  const [datePart, timePart] = date.split(' at ');
  const [month = 'TBA', day = ''] = datePart.split(/\s+/);
  return {
    month: month.slice(0, 3).toUpperCase(),
    day: day.replace(',', ''),
    time: timePart || 'Time TBA',
    full: date,
  };
}

function formProgress(ticket?: ReturnType<typeof findTicket>, entry?: RegistrationQueueEntry) {
  if (!ticket) {
    const total = entry?.teamTotalCount ?? entry?.guestTotalCount ?? 1;
    const completed = entry?.teamAttachedCount ?? entry?.guestCompletedCount ?? 0;
    const missing = Math.max(0, total - completed);
    const needsAction = entry?.entryStatus === 'pending_form' || entry?.entryStatus === 'resubmit_required';
    const formText = missing === 1 ? '1 form needed' : `${missing} forms needed`;
    const progressText = total > 1 ? `${completed}/${total} complete` : undefined;

    return {
      primary: needsAction ? (progressText ? `${formText} · ${progressText}` : formText) : 'Registration details pending',
      secondary: deadlineLabel(entry?.deadline),
      needsAction,
    };
  }

  const total =
    ticket.ticketType === 'team'
      ? entry?.teamTotalCount || ticket.maxParticipants || ticket.participants.length
      : ticket.participants.length || ticket.quantity || 1;
  const completed =
    ticket.ticketType === 'team'
      ? entry?.teamAttachedCount ?? ticket.participants.filter((participant) => participant.formStatus === 'completed').length
      : ticket.participants.filter((participant) => participant.formStatus === 'completed').length;
  const missing = Math.max(0, total - completed);
  const uninvited = ticket.participants.filter((participant) => participant.inviteStatus === 'not_invited').length;
  const invited = ticket.participants.filter((participant) => participant.inviteStatus === 'invited').length;
  const needsAction =
    ticket.status === 'action_required' ||
    ticket.status === 'pending' ||
    ticket.entryStatus === 'pending_form' ||
    ticket.entryStatus === 'resubmit_required' ||
    missing > 0;

  if (!needsAction) {
    return {
      primary: 'All forms complete',
      secondary: ticket.deadline ? `Deadline met · ${ticket.deadline}` : 'Ready in Orders',
      needsAction,
    };
  }

  const formText = missing === 1 ? '1 form needed' : `${missing} forms needed`;
  const progressText = total > 1 ? `${completed}/${total} complete` : undefined;
  const inviteText =
    ticket.ticketType !== 'single' && (uninvited > 0 || invited > 0)
      ? [
          uninvited > 0 ? `${uninvited} unsent` : null,
          invited > 0 ? `${invited} invited` : null,
        ].filter(Boolean).join(' · ')
      : undefined;

  return {
    primary: progressText ? `${formText} · ${progressText}` : formText,
    secondary: [deadlineLabel(ticket.deadline), inviteText].filter(Boolean).join(' · ') || undefined,
    needsAction,
  };
}

function passportFormsPath(entry?: RegistrationQueueEntry) {
  const params = new URLSearchParams({ focus: 'forms' });
  if (entry?.id) params.set('entryId', entry.id);
  if (entry?.ticketId) params.set('ticketId', entry.ticketId);
  return `/passport/events?${params.toString()}`;
}

function PassportMini({
  label,
  tone,
}: {
  label: string;
  tone: 'green' | 'amber' | 'neutral';
}) {
  const { userProfile, member, qrPayload } = useAppContext();
  const holderName = userProfile.name || member.displayName || 'PlanOut Member';
  const holderImage = userProfile.avatarUrl || member.avatarUrl || imgAvatar;

  return (
    <PlanOutPassportCard
      variant="mini"
      name={holderName}
      image={holderImage}
      passportCode={member.passportCode}
      qrPayload={qrPayload}
      statusLabel={label}
      statusTone={tone}
    />
  );
}

function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[1.2px] text-[#177564]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[18px] font-semibold tracking-[-0.35px] text-[#181d27]">
          {title}
        </h2>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[13px] font-semibold text-[#177564] transition-colors hover:text-[#0f5f51]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EventRow({
  event,
  onClick,
  featured = false,
}: {
  event: EventData;
  onClick: () => void;
  featured?: boolean;
}) {
  const parts = dateParts(event.date);
  const formattedMonth = parts.month.charAt(0) + parts.month.slice(1).toLowerCase();
  const dateString = `${formattedMonth} ${parts.day}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-w-0 w-full items-center gap-3.5 overflow-hidden rounded-[18px] border border-neutral-100 bg-white p-3 text-left transition-colors hover:bg-neutral-50/40 active:scale-[0.99] ${featured ? 'sm:p-3.5' : ''}`}
    >
      <div className="relative h-[64px] w-[74px] shrink-0 overflow-hidden rounded-[14px] bg-neutral-100">
        <ImageWithFallback src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="rounded-full bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 text-[10px] font-semibold text-[#177564]">
            {event.labels[0] || 'Event'}
          </span>
          {event.rating >= 4.8 && (
            <span className="rounded-full bg-neutral-100 border border-neutral-200/30 px-2 py-0.5 text-[10px] font-semibold text-[#64748b]">
              Popular
            </span>
          )}
        </div>
        <p className="truncate text-[15px] font-semibold leading-tight tracking-[-0.25px] text-[#181d27]">
          {event.title}
        </p>
        <p className="mt-1 truncate text-[12.5px] font-medium text-[#64748b]">
          {dateString} · {parts.time} · {event.location}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94a3b8] transition-colors group-hover:text-[#177564] mr-0.5" />
    </button>
  );
}

function EventRail({ events, onEventSelect }: { events: EventData[]; onEventSelect: (event: EventData) => void }) {
  return (
    <div className="-mx-4 flex max-w-[calc(100%+32px)] snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:max-w-full sm:px-0">
      {events.map((event) => {
        const parts = dateParts(event.date);
        return (
          <button
            type="button"
            key={event.id}
            onClick={() => onEventSelect(event)}
            className="group w-[286px] shrink-0 snap-start overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white text-left shadow-[0_18px_38px_-32px_rgba(15,23,42,0.44)] transition-all duration-300 hover:border-[#bfe5de] active:scale-[0.99]"
          >
            <div className="relative h-36 overflow-hidden bg-[#e2e8f0]">
              <ImageWithFallback src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-[#181d27] shadow-sm">
                {event.labels[0] || 'Event'}
              </span>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold text-[#177564]">
                <CalendarDays className="h-3.5 w-3.5" />
                {parts.month} {parts.day} · {parts.time}
              </div>
              <p className="line-clamp-2 min-h-[38px] text-[16px] font-semibold leading-tight tracking-[-0.3px] text-[#101828]">
                {event.title}
              </p>
              <p className="mt-2 line-clamp-1 text-[12px] font-medium text-[#64748b]">
                {event.location}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SportRail({ onGoToEvents }: { onGoToEvents: (query?: string) => void }) {
  return (
    <div className="-mx-4 flex max-w-[calc(100%+32px)] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:max-w-full sm:px-0 scrollbar-none">
      {SPORTS.map((sport) => (
        <button
          key={sport}
          type="button"
          onClick={() => onGoToEvents(sport)}
          className="shrink-0 rounded-full border border-[#d5d7da] bg-white px-4 py-2 text-[13px] font-semibold text-[#475569] shadow-[0_1px_2px_rgba(10,13,18,0.04)] transition-colors hover:border-[#bfe5de] hover:text-[#177564] active:scale-[0.98]"
        >
          {sport}
        </button>
      ))}
    </div>
  );
}

function EmptyEventIllustration() {
  return (
    <div className="mx-auto mb-1 w-full max-w-[200px] select-none sm:mb-0 sm:max-w-[220px]">
      <img
        src={imgNoUpcomingEvents}
        alt=""
        aria-hidden="true"
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

function EmptyDiscoveryEventRow({
  event,
  onClick,
}: {
  event: EventData;
  onClick: () => void;
}) {
  const dateCopy = event.endDate ? `${event.date} - ${event.endDate}` : event.date;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full gap-3 rounded-[18px] border border-black/[0.04] bg-white p-2 text-left shadow-[0_16px_42px_-34px_rgba(15,23,42,0.5)] transition-all duration-300 hover:bg-[#fbfefd] active:scale-[0.99]"
    >
      <div className="h-[88px] w-[112px] shrink-0 overflow-hidden rounded-[12px] bg-[#e2e8f0]">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 flex-1 py-1 pr-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[16px] font-semibold leading-[1.15] tracking-[-0.25px] text-[#101828]">
            {event.title}
          </h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8] transition-colors group-hover:text-[#177564]" />
        </div>
        <p className="mt-1.5 truncate text-[12px] font-semibold text-[#8a9ab3]">
          {event.organizer} <span className="px-1 text-[#cbd5e1]">·</span> {event.rating.toFixed(1)}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-[#52627a]">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#8a9ab3]" strokeWidth={1.8} />
          <span className="truncate">{dateCopy}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[12px] font-semibold text-[#52627a]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8a9ab3]" strokeWidth={1.8} />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </button>
  );
}

function GuestHome({ onGoToEvents, onEventSelect }: HomePageProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const spotlight = FEATURED_EVENTS[0];

  return (
    <div className="flex w-full max-w-full flex-col gap-9 overflow-hidden pb-4">
      <section className="grid w-full max-w-full min-w-0 gap-6 pt-1 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:pt-6">
        <div className="min-w-0 max-w-full">
          <h1 className="mt-3 max-w-full text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#181d27] sm:max-w-[720px] sm:text-[56px]">
            Your next sports event, organized in one place.
          </h1>
          {/*
          <p className="mt-4 max-w-full text-[15px] leading-relaxed text-[#64748b] sm:max-w-[540px] sm:text-[17px]">
            Discover races and tournaments, finish registration forms, and complete waivers in one dashboard. PlanOut coordinates the details so you can focus on the starting line.
          </p>
          */}

          <form
            onSubmit={(event) => {
               event.preventDefault();
               onGoToEvents(query.trim() || undefined);
            }}
            className="mt-7.5 flex items-center gap-2 w-full max-w-full rounded-full border border-black/[0.06] bg-white pl-4 pr-1.5 py-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.03)] focus-within:border-neutral-300 focus-within:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all"
          >
            <div className="relative flex flex-1 items-center">
              <Search className="h-4.5 w-4.5 text-[#94a3b8] shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search running, cycling, swimming..."
                className="h-10 min-w-0 w-full bg-transparent pl-2.5 pr-2 text-[14px] font-medium text-[#181d27] outline-none placeholder:text-[#94a3b8]"
              />
            </div>
            <PrimaryButton
              type="submit"
              compact
              className="h-10 shrink-0 rounded-full px-5 text-[13px]"
            >
              Search
            </PrimaryButton>
          </form>

          <div className="mt-9 flex items-center justify-between border-t border-black/[0.04] pt-6 pb-2">
            {[
              ['320+', 'events'],
              ['48K', 'athletes'],
              ['18', 'sports'],
            ].map(([value, label]) => (
              <div key={label} className="flex-1 text-center">
                <p className="text-[25px] font-bold tracking-[-0.03em] text-[#181d27]">{value}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {spotlight && (
          <aside className="w-full max-w-full rounded-[24px] border border-black/[0.04] bg-white p-3.5 shadow-premium">
            <div className="relative overflow-hidden rounded-[18px] bg-neutral-100">
              <ImageWithFallback src={spotlight.image} alt={spotlight.title} className="h-[210px] w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-16">
                <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#181d27]">
                  Featured
                </span>
                <p className="mt-2.5 text-[18px] font-semibold leading-tight tracking-[-0.3px] text-white">
                  {spotlight.title}
                </p>
                <p className="mt-1 text-[12px] font-medium text-white/80">{spotlight.location}</p>
              </div>
            </div>
            <div className="mt-3.5 flex items-center justify-between gap-3 px-1.5 pb-0.5">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#177564]">{dateParts(spotlight.date).full}</p>
                <p className="mt-0.5 text-[11px] text-[#64748b]">One QR at check-in after registration.</p>
              </div>
              <button
                type="button"
                onClick={() => onEventSelect(spotlight)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#177564] shadow-sm hover:bg-neutral-50 active:scale-95 transition-all"
                aria-label="Open featured event"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        )}
      </section>

      <section>
        <SectionHeader title="Browse by sport" actionLabel="All events" onAction={() => onGoToEvents()} />
        <SportRail onGoToEvents={onGoToEvents} />
      </section>

      <section>
        <SectionHeader title="Featured events" actionLabel="View all" onAction={() => onGoToEvents()} />
        <div className="grid gap-3 lg:grid-cols-2">
          {FEATURED_EVENTS.map((event) => (
            <EventRow key={event.id} event={event} onClick={() => onEventSelect(event)} featured />
          ))}
        </div>
      </section>

      <section className="border-t border-black/[0.04] pt-8">
        <SectionHeader title="How it works" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [Search, 'Find an event', 'Pick the sport, date, and organiser that fit.'],
            [TicketCheck, 'Register', 'Pay and complete the required organiser forms.'],
            [ShieldCheck, 'Show one QR', 'Staff scan your PlanOut Passport at the gate.'],
          ].map(([Icon, title, body]) => {
            const StepIcon = Icon as typeof Search;
            return (
              <div key={title as string} className="rounded-[22px] border border-black/[0.04] bg-white p-5.5 shadow-premium">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-emerald-50 text-[#177564]">
                  <StepIcon className="h-4.5 w-4.5" strokeWidth={1.8} />
                </div>
                <p className="mt-4 text-[14.5px] font-semibold text-[#181d27]">{title as string}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#64748b]">{body as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[24px] border border-emerald-800/20 bg-[linear-gradient(135deg,#1f8573_0%,#115d4f_100%)] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 shadow-[0_24px_48px_-24px_rgba(23,117,100,0.35)] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="relative min-w-0">
          <p className="text-[20px] font-semibold tracking-[-0.4px] text-white">Create your Passport for free</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/80 max-w-[420px]">
            Keep registration, forms, and event-day access in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="relative mt-4 w-full rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#177564] transition-all hover:bg-neutral-50 active:scale-95 sm:mt-0 sm:w-auto shadow-sm"
        >
          Sign up
        </button>
      </section>
    </div>
  );
}

function getEventImageUrl(entry: RegistrationQueueEntry, ticket?: MyTicket): string {
  if (ticket?.image) return ticket.image;
  
  const name = (entry.eventName || '').toLowerCase();
  if (name.includes('swim') || name.includes('water') || name.includes('aquathlon')) {
    return 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('futsal') || name.includes('soccer') || name.includes('football')) {
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('run') || name.includes('trail') || name.includes('marathon')) {
    return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('tennis')) {
    return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('volleyball')) {
    return 'https://images.unsplash.com/photo-1628314200733-5f7785cdc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('yoga')) {
    return 'https://images.unsplash.com/photo-1623182965637-e2e2f32818d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
}

function UpcomingEventCard({
  entry,
  onClick,
}: {
  entry: RegistrationQueueEntry;
  onClick: () => void;
}) {
  const ticket = findTicket(entry);
  const location = ticket?.eventLocation || 'Location to be announced';
  const progress = formProgress(ticket, entry);
  const organizer = ticket?.organizer || entry.category;
  const eventDate = ticket?.eventDate || entry.deadline;
  const imageUrl = getEventImageUrl(entry, ticket);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-100/80 bg-white p-4 text-left shadow-[0_2px_8px_rgba(15,23,42,0.01)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-slate-50/30 hover:border-slate-200/50 hover:shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:scale-[1.005] focus:outline-none active:scale-[0.99] sm:p-5 cursor-pointer"
    >
      <div className="flex gap-4 sm:gap-5">
        <div className="h-[142px] w-[104px] shrink-0 overflow-hidden rounded-[14px] bg-slate-100 sm:h-[166px] sm:w-[146px]">
          <ImageWithFallback
            src={imageUrl}
            alt={entry.eventName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-[17.5px] sm:text-[20px] font-bold leading-[1.2] tracking-[-0.4px] text-slate-800 transition-colors group-hover:text-slate-900">
              {entry.eventName}
            </h2>
            <p className="mt-1.5 truncate text-[11px] font-bold uppercase tracking-[0.9px] text-slate-400">
              {organizer}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex min-w-0 items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100/80 text-neutral-500">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />
              </div>
              <span className="min-w-0 pt-0.5 text-[13px] font-semibold leading-[1.35] text-slate-600">
                {compactDate(eventDate)}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100/80 text-neutral-500">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
              </div>
              <span className="truncate pt-0.5 text-[13px] font-semibold leading-[1.35] text-slate-600">
                {location}
              </span>
            </div>

            <div className="flex min-w-0 items-start gap-2.5">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                progress.needsAction
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
              >
                <ClipboardList className="h-3.5 w-3.5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className={`text-[13px] font-semibold leading-[1.35] ${
                  progress.needsAction ? 'text-[#92400e]' : 'text-[#177564]'
                }`}
                >
                  {progress.primary}
                </p>
                {progress.secondary && (
                  <p className="mt-0.5 text-[11px] font-medium leading-snug text-slate-550" style={{ color: '#64748b' }}>
                    {progress.secondary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-slate-100/80 pt-3">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#177564] group-hover:text-[#0f5f51]">
          <span>{progress.needsAction ? 'Finish forms' : 'View details'}</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-[#177564] transition-colors" />
        </div>
      </div>
    </button>
  );
}

function FormsToFinishSection({
  entries,
  onOpenEntry,
  onOpenAll,
}: {
  entries: RegistrationQueueEntry[];
  onOpenEntry: (entry: RegistrationQueueEntry) => void;
  onOpenAll: () => void;
}) {
  const nearestDeadline = entries
    .map((entry) => ({ entry, date: parseDate(entry.deadline) }))
    .filter((item): item is { entry: RegistrationQueueEntry; date: Date } => Boolean(item.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0]?.entry.deadline;
  const countLabel = entries.length === 1 ? '1 form needs attention' : `${entries.length} forms need attention`;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 px-0.5">
        <div className="flex flex-col gap-1">
          <h2 className="text-[17px] font-semibold tracking-[-0.3px] text-[#181d27]">
            {countLabel}
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenAll}
          className="mt-0.5 shrink-0 text-[13px] font-medium text-[#177564] transition-colors hover:text-[#0f5f51] active:opacity-70"
        >
          See all
        </button>
      </div>

      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        {entries.slice(0, 2).map((entry, i) => {
          const ticket = findTicket(entry);
          const progress = formProgress(ticket, entry);
          const actionLabel = entry.type === 'team' ? 'Complete team entries' : entry.entryStatus === 'resubmit_required' ? 'Resubmit' : 'Finish form';

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onOpenEntry(entry)}
              className={`group flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-[#fafafa] active:bg-[#f5f5f5] ${i > 0 ? 'border-t border-[#f1f5f9]' : ''}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-amber-50 text-amber-600">
                <ClipboardList className="h-[18px] w-[18px]" strokeWidth={1.7} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#181d27]">
                  {entry.eventName}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[#64748b]">
                  {progress.primary}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-[#177564]">
                <span className="text-[13px] font-medium">{actionLabel}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EmptyUserHome({
  first,
  onGoToEvents,
  onEventSelect,
  holderImage,
}: {
  first: string;
  onGoToEvents: (query?: string) => void;
  onEventSelect: (event: EventData) => void;
  holderImage: string;
}) {
  const navigate = useNavigate();
  const profileCopy = first === 'there' ? 'Welcome to PlanOut' : `Welcome to PlanOut, ${first}`;
  const exploreEvents = RECOMMENDED_EVENTS.slice(0, 3);

  return (
    <div className="flex flex-col gap-7 pb-32">
      <section className="rounded-[32px] border border-neutral-100 bg-white px-5 py-5 shadow-premium">
        <div className="flex items-start gap-4">
          <div className="relative h-[76px] w-[76px] shrink-0">
            <div className="h-full w-full overflow-hidden rounded-full border-[4px] border-white bg-neutral-100 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.56)] ring-1 ring-[#eef2f6]">
              <ImageWithFallback
                src={holderImage}
                alt={profileCopy}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h1 className="max-w-[270px] text-[28px] font-semibold leading-[1.03] tracking-[-0.8px] text-[#181d27]">
              {first === 'there' ? 'Welcome to PlanOut' : `Welcome back, ${first}`}
            </h1>
            <p className="mt-2 max-w-[250px] text-[13px] font-medium leading-snug text-[#64748b]">
              Browse events to find your first race, tournament, or challenge.
            </p>
            <div className="mt-5 flex max-w-full flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onGoToEvents()}
                className="inline-flex items-center gap-2 rounded-full bg-[#eefbf7] px-4 py-2 text-[13px] font-semibold text-[#177564] transition-colors hover:bg-[#def2ee] active:scale-[0.98]"
              >
                <span className="h-2 w-2 rounded-full bg-[#177564]" />
                Browse events
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.1} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[19px] font-semibold tracking-[-0.35px] text-[#0f172a]">Your upcoming event</h2>
        <div className="grid gap-5 overflow-hidden rounded-[24px] border border-black/[0.04] bg-white px-5 pb-7 pt-5 shadow-premium sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] sm:items-center sm:gap-6 sm:px-6 sm:py-6">
          <EmptyEventIllustration />
          <div className="min-w-0 sm:py-3">
            <h3 className="text-[21px] font-semibold leading-tight tracking-[-0.45px] text-[#0f172a]">
              No upcoming events yet
            </h3>
            <p className="mt-4 max-w-[340px] text-[15px] font-medium leading-relaxed text-[#52627a]">
              You haven&apos;t registered for any events. Explore upcoming races, tournaments, and challenges to find your first one.
            </p>
            <div className="mt-7 flex flex-col items-start gap-4">
              <PrimaryButton onClick={() => onGoToEvents()} className="h-[48px] rounded-[12px] px-6">
                Browse events
              </PrimaryButton>
              <button
                type="button"
                onClick={() => onGoToEvents()}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#14735f] transition-colors hover:text-[#0f5f51]"
              >
                View categories
                <ChevronRight className="h-4 w-4" strokeWidth={2.1} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[19px] font-semibold tracking-[-0.35px] text-[#0f172a]">Getting started</h2>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex w-full items-center gap-4 rounded-[20px] border border-black/[0.04] bg-white p-4 text-left shadow-premium transition-all hover:bg-[#fbfefd] active:scale-[0.99]"
        >
          <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full bg-[#e7f8f1] text-[#16856f]">
            <UserCheck className="h-8 w-8" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-semibold tracking-[-0.2px] text-[#101828]">Complete your profile</h3>
            <p className="mt-1 max-w-[270px] text-[14px] font-medium leading-snug text-[#52627a]">
              Add a few details once so future registrations are faster.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1 text-[14px] font-semibold text-[#14735f] sm:inline-flex">
            Complete profile
            <ChevronRight className="h-4 w-4" strokeWidth={2.1} />
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#14735f] sm:hidden" strokeWidth={2.1} />
        </button>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-[19px] font-semibold tracking-[-0.35px] text-[#0f172a]">Explore events</h2>
          <button
            type="button"
            onClick={() => onGoToEvents()}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#14735f] transition-colors hover:text-[#0f5f51]"
          >
            Browse all
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {exploreEvents.map((event) => (
            <EmptyDiscoveryEventRow
              key={event.id}
              event={event}
              onClick={() => onEventSelect(event)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export function HomePage({ onEventSelect, onGoToEvents, userName }: HomePageProps) {
  const navigate = useNavigate();
  const { isAuthenticated, registrationQueueEntries, member, userProfile } = useAppContext();
  const entries = registrationQueueEntries;
  const pendingEntries = getOrderFormActionEntries(entries);
  const attachedEntries = entries.filter((entry) => entry.entryStatus === 'attached');
  const hasEntries = entries.length > 0;
  const nextEntry = useMemo(() => {
    const source = pendingEntries.length > 0 ? pendingEntries : attachedEntries;
    const candidates = source
      .map((entry) => ({ entry, ticket: findTicket(entry) }))
      .filter(({ ticket }) => Boolean(ticket))
      .sort((a, b) => (parseDate(a.ticket?.eventDate)?.getTime() || 0) - (parseDate(b.ticket?.eventDate)?.getTime() || 0));
    return candidates[0]?.entry || source[0];
  }, [attachedEntries, pendingEntries]);
  const holderName = userProfile.name || member.displayName || userName || 'PlanOut Member';
  const holderImage = userProfile.avatarUrl || member.avatarUrl || imgAvatar;
  const first = firstName(userName || userProfile.name || member.displayName);

  if (!isAuthenticated) {
    return <GuestHome onEventSelect={onEventSelect} onGoToEvents={onGoToEvents} userName={userName} />;
  }

  if (!hasEntries) {
    return (
      <EmptyUserHome
        first={first}
        holderImage={holderImage}
        onGoToEvents={onGoToEvents}
        onEventSelect={onEventSelect}
      />
    );
  }

  const hasPending = pendingEntries.length > 0;
  const pendingFormCount = pendingEntries.length;
  const passportStatusLabel = `${pendingFormCount} form${pendingFormCount === 1 ? '' : 's'} to finish`;

  return (
    <>
      <div className="flex flex-col gap-7 pb-32">
        <section className="rounded-[24px] border border-neutral-100 bg-white px-5 py-5">
          <div className="flex items-start gap-4">
            <div className="relative h-[64px] w-[64px] shrink-0 rounded-[20px] overflow-hidden bg-neutral-100">
              <ImageWithFallback
                src={holderImage}
                alt={holderName}
                className="h-full w-full rounded-[21px] object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className="max-w-[270px] text-[28px] font-semibold leading-[1.03] tracking-[-0.8px] text-[#181d27]">
                Welcome back, {firstName(holderName)}
              </h1>
              <p className="mt-2 max-w-[250px] text-[13px] font-medium leading-snug text-[#64748b]">
                {hasPending ? 'Complete your forms to keep event-day access ready.' : 'Your event-day access is ready when you need it.'}
              </p>
              <div className="mt-4 flex max-w-full flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  hasPending
                    ? 'bg-[#fff7ed] text-[#9a4f00]'
                    : 'bg-[#eefbf7] text-[#177564]'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${hasPending ? 'bg-[#f59e0b]' : 'bg-[#177564]'}`} />
                  {passportStatusLabel}
                </span>
              </div>
            </div>
          </div>
        </section>

      {nextEntry && (
        <section className="flex flex-col gap-3">
          <h2 className="text-[17px] font-semibold text-[#181d27]">Your upcoming event</h2>
          <UpcomingEventCard
            entry={nextEntry}
            onClick={() => {
              if (hasPending) {
                navigate(`/orders/${nextEntry.ticketId}/form?returnTo=home&entryId=${nextEntry.id}`);
                return;
              }
              const event = MOCK_EVENTS.find((item) => item.id === findTicket(nextEntry)?.eventId);
              if (event) onEventSelect(event);
            }}
          />
        </section>
      )}

      {hasPending && (
        <FormsToFinishSection
          entries={pendingEntries}
          onOpenEntry={(entry) => navigate(`/orders/${entry.ticketId}/form?returnTo=home&entryId=${entry.id}`)}
          onOpenAll={() => navigate(passportFormsPath())}
        />
      )}

      {!hasPending && attachedEntries.length > 0 && (
        <section>
          <SectionHeader title="Your events" actionLabel="View all" onAction={() => navigate('/orders')} />
          <div className="divide-y divide-[#eef2f6] rounded-[20px] border border-[#e2e8f0] bg-white">
            {attachedEntries.slice(0, 3).map((entry) => {
              const ticket = findTicket(entry);
              const event = ticket ? MOCK_EVENTS.find((item) => item.id === ticket.eventId) : undefined;
              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    if (event) {
                      onEventSelect(event);
                      return;
                    }
                    navigate('/orders');
                  }}
                  className="group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#f8fafc]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#101828]">{entry.eventName}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[#64748b]">{ticket?.eventDate}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94a3b8] transition-colors group-hover:text-[#177564]" strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#181d27]">You might like</h2>
          <button type="button" onClick={() => onGoToEvents()} className="text-[13px] font-medium text-[#177564] hover:opacity-70 transition-opacity">
            Browse all
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {RECOMMENDED_EVENTS.slice(0, 2).map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              endDate={event.endDate}
              eventDates={event.eventDates}
              dailySchedule={event.dailySchedule}
              location={event.location}
              organizer={event.organizer}
              rating={event.rating}
              labels={event.labels}
              image={event.image}
              onClick={() => onEventSelect(event)}
            />
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
