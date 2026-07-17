/**
 * @file MyEventsPage.tsx
 * @description Legacy orders/events page with mock order cards in 3 states:
 * Confirmed, Action Required, and Forms Pending. Includes filter tabs,
 * participant dot avatars, passport affordances, and a summary warning bar.
 *
 * "Manage Participants" and "Complete Forms" buttons now navigate to the
 * dedicated ParticipantFormPage instead of expanding inline.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  ArrowLeft,
  MapPin,
  Ticket,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  IdCard,
  ClipboardList,
  Star,
  Award,
  Download,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { SegmentedChoice } from '@/app/components/SegmentedChoice';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import {
  type MyTicket,
  type TicketStatus,
  type Participant,
  MY_TICKETS,
} from '@/app/data/tickets';

import { ReviewModal } from './ReviewModal';

// --- Status Badge ---
function StatusBadge({ status, compact = false }: { status: TicketStatus; compact?: boolean }) {
  const baseClass = `inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-[0.16px] ${
    compact ? 'px-2 py-[2px] text-[10px]' : 'px-2.5 py-[3px] text-[11px]'
  }`;
  const iconClass = compact ? 'w-2.5 h-2.5' : 'w-3 h-3';

  if (status === 'confirmed') {
    return (
      <div className={`${baseClass} bg-[#eefbf7] border-[#bde9de] text-[#0f6f60]`}>
        <CheckCircle2 className={`${iconClass} text-[#0f8a72]`} />
        <span>Confirmed</span>
      </div>
    );
  }
  if (status === 'action_required') {
    return (
      <div className={`${baseClass} bg-[#fff7ed] border-[#fed7aa] text-[#b45309]`}>
        <AlertCircle className={`${iconClass} text-[#d97706]`} />
        <span>Action Required</span>
      </div>
    );
  }
  if (status === 'completed') {
    return (
      <div className={`${baseClass} bg-[#f8fafc] border-[#dbe4ef] text-[#475569]`}>
        <Award className={`${iconClass} text-[#64748b]`} />
        <span>Completed</span>
      </div>
    );
  }
  return (
    <div className={`${baseClass} bg-[#fff7ed] border-[#fed7aa] text-[#9a3412]`}>
      <Clock className={`${iconClass} text-[#ea580c]`} />
      <span>Forms Pending</span>
    </div>
  );
}

// --- Participant Dots ---
function ParticipantDots({ participants }: { participants: Participant[] }) {
  return (
    <div className="flex items-center -space-x-1.5">
      {participants.slice(0, 5).map((p) => (
        <div
          key={p.id}
          className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold shrink-0 ${
            p.formStatus === 'completed'
              ? 'bg-[#d1fae5] text-[#065f46]'
              : p.formStatus === 'pending'
                ? 'bg-[#fef3c7] text-[#92400e]'
                : 'bg-[#f3f4f6] text-[#9ca3af]'
          }`}
          title={p.name || 'Not assigned'}
        >
          {p.name ? p.name.charAt(0).toUpperCase() : '?'}
        </div>
      ))}
      {participants.length > 5 && (
        <div className="w-6 h-6 rounded-full border-2 border-white bg-[#e5e7eb] text-[#6b7280] flex items-center justify-center text-[9px] font-bold shrink-0">
          +{participants.length - 5}
        </div>
      )}
    </div>
  );
}

function splitEventDate(value: string) {
  const [date, time] = value.split(' at ');
  return {
    date,
    time: time ? time : '',
  };
}

function getEventDateParts(value: string) {
  const { date, time } = splitEventDate(value);
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return {
      monthGroup: date,
      month: '',
      day: '',
      weekday: '',
      date,
      time,
      sortTime: 0,
    };
  }

  return {
    monthGroup: parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    month: parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: parsed.toLocaleDateString('en-US', { day: '2-digit' }),
    weekday: parsed.toLocaleDateString('en-US', { weekday: 'short' }),
    date,
    time,
    sortTime: parsed.getTime(),
  };
}

function getAccessSessions(ticket: MyTicket) {
  const sessions = ticket.schedule?.sessions ?? [
    { id: 'default', date: ticket.eventDate, location: ticket.eventLocation },
  ];

  if (!ticket.schedule || ticket.schedule.accessScope === 'all_sessions') {
    return sessions;
  }

  const accessIds = new Set(ticket.schedule.accessSessionIds ?? []);
  const matching = sessions.filter((session) => accessIds.has(session.id));
  return matching.length > 0 ? matching : sessions.slice(0, 1);
}

function getDisplayDateParts(ticket: MyTicket) {
  const sessions = getAccessSessions(ticket);
  const first = getEventDateParts(sessions[0]?.date ?? ticket.eventDate);
  const last = getEventDateParts(sessions[sessions.length - 1]?.date ?? sessions[0]?.date ?? ticket.eventDate);
  const allSessions = ticket.schedule?.sessions ?? sessions;

  if (
    ticket.schedule?.accessScope === 'all_sessions' &&
    ticket.schedule.type === 'consecutive_days' &&
    allSessions.length > 1
  ) {
    return {
      ...first,
      day: `${first.day}-${last.day}`,
      date: `${first.date} - ${last.date}`,
      time: first.time,
      sortTime: first.sortTime,
    };
  }

  if (ticket.schedule?.type === 'non_consecutive_days' && sessions.length > 1) {
    return {
      ...first,
      day: `${sessions.length}x`,
      weekday: 'Dates',
      date: first.date,
      time: first.time,
      sortTime: first.sortTime,
    };
  }

  return first;
}

function getAccessSummary(ticket: MyTicket) {
  const sessions = ticket.schedule?.sessions ?? [
    { id: 'default', date: ticket.eventDate },
  ];
  const accessSessions = getAccessSessions(ticket);
  const total = sessions.length;
  const accessCount = accessSessions.length;
  const scheduleType = ticket.schedule?.type ?? 'single_day';
  const accessScope = ticket.schedule?.accessScope ?? 'all_sessions';

  if (scheduleType === 'single_day') return 'Single day';
  if (accessScope === 'all_sessions') {
    return scheduleType === 'consecutive_days'
      ? `${total}-day all access`
      : `${total} dates all access`;
  }
  if (accessScope === 'single_session') {
    return scheduleType === 'consecutive_days'
      ? `1 of ${total} days`
      : `1 of ${total} dates`;
  }
  return scheduleType === 'consecutive_days'
    ? `${accessCount} of ${total} days`
    : `${accessCount} of ${total} dates`;
}

function getAccessTimeSummary(ticket: MyTicket) {
  const accessSessions = getAccessSessions(ticket);
  const first = getEventDateParts(accessSessions[0]?.date ?? ticket.eventDate);
  const last = getEventDateParts(accessSessions[accessSessions.length - 1]?.date ?? accessSessions[0]?.date ?? ticket.eventDate);

  if (accessSessions.length === 1) return first.time;
  return `${first.date} - ${last.date}`;
}

function getTicketProgress(ticket: MyTicket) {
  const completed = ticket.participants.filter((p) => p.formStatus === 'completed').length;
  const total = Math.max(ticket.participants.length, 1);
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

function TicketActions({
  ticket,
  allComplete,
  isConfirmed,
  isCompleted,
  isMultiple,
  isTeam,
  onViewTicket,
  onManageParticipants,
  onWriteReview,
  onDownloadCertificate,
}: {
  ticket: MyTicket;
  allComplete: boolean;
  isConfirmed: boolean;
  isCompleted: boolean;
  isMultiple: boolean;
  isTeam: boolean;
  onViewTicket: (ticket: MyTicket) => void;
  onManageParticipants: (ticket: MyTicket) => void;
  onWriteReview?: (ticket: MyTicket) => void;
  onDownloadCertificate?: (ticket: MyTicket) => void;
}) {
  if (isCompleted) {
    if (ticket.reviewStatus === 'submitted') {
      return (
        <SecondaryButton
          onClick={() => onDownloadCertificate?.(ticket)}
          compact
          className="rounded-full px-3.5 py-2 text-[13px]"
        >
          <Download className="h-3.5 w-3.5" />
          Certificate
        </SecondaryButton>
      );
    }

    return (
      <PrimaryButton
        onClick={() => onWriteReview?.(ticket)}
        compact
        className="rounded-full px-3.5 py-2 text-[13px]"
      >
        <Star className="h-3.5 w-3.5" />
        Review
      </PrimaryButton>
    );
  }

  return (
    <>
      {isConfirmed ? (
        <PrimaryButton
          onClick={() => onViewTicket(ticket)}
          compact
          className="rounded-full px-3.5 py-2 text-[13px]"
        >
          <IdCard className="h-3.5 w-3.5" />
          Passport
        </PrimaryButton>
      ) : isTeam ? (
        <PrimaryButton
          onClick={() => onManageParticipants(ticket)}
          compact
          className="rounded-full px-3.5 py-2 text-[13px]"
        >
          <Users className="h-3.5 w-3.5" />
          Manage
        </PrimaryButton>
      ) : isMultiple ? (
        <PrimaryButton
          onClick={() => onManageParticipants(ticket)}
          compact
          className="rounded-full px-3.5 py-2 text-[13px]"
        >
          <Users className="h-3.5 w-3.5" />
          Manage
        </PrimaryButton>
      ) : (
        <PrimaryButton
          onClick={() => onManageParticipants(ticket)}
          compact
          className="rounded-full px-3.5 py-2 text-[13px]"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Complete
        </PrimaryButton>
      )}
    </>
  );
}

// --- Ticket Card ---
function MyTicketCard({
  ticket,
  onViewTicket,
  onManageParticipants,
  onWriteReview,
  onDownloadCertificate,
}: {
  ticket: MyTicket;
  onViewTicket: (ticket: MyTicket) => void;
  onManageParticipants: (ticket: MyTicket) => void;
  onWriteReview?: (ticket: MyTicket) => void;
  onDownloadCertificate?: (ticket: MyTicket) => void;
}) {
  const { completed: completedCount, total: totalSlots, percent } = getTicketProgress(ticket);
  const allComplete = completedCount === totalSlots;
  const isConfirmed = allComplete && ticket.status === 'confirmed';
  const isCompleted = ticket.status === 'completed';
  const isMultiple = ticket.ticketType === 'multiple';
  const isTeam = ticket.ticketType === 'team';
  const dateParts = getDisplayDateParts(ticket);
  const accessSummary = getAccessSummary(ticket);
  const timeSummary = getAccessTimeSummary(ticket);
  const showFormProgress = !allComplete || ticket.status === 'action_required' || ticket.status === 'pending';

  return (
    <article className="group rounded-[22px] border border-white/75 bg-white/[0.68] px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_58px_-46px_rgba(15,23,42,0.58)] ring-1 ring-[#dbe7e4]/65 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/82 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_32px_72px_-50px_rgba(15,23,42,0.68)] sm:px-4">
      <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 sm:grid-cols-[56px_64px_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
        <div className="rounded-[16px] border border-white/78 bg-[#f7fffc]/78 px-2 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_26px_-22px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.24px] text-[#177564]">
            {dateParts.month}
          </p>
          <p className="mt-0.5 text-[20px] font-semibold leading-none tracking-[-0.4px] text-[#181d27]">
            {dateParts.day}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-[#94a3b8]">
            {dateParts.weekday}
          </p>
        </div>

        <div className="hidden h-14 w-16 shrink-0 overflow-hidden rounded-[15px] bg-[#f1f5f9] shadow-[0_12px_26px_-22px_rgba(15,23,42,0.5)] ring-1 ring-white/70 sm:block">
          <ImageWithFallback
            src={ticket.image}
            alt={ticket.eventTitle}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[16px] font-semibold leading-tight tracking-[-0.15px] text-[#181d27] sm:text-[17px]">
            {ticket.eventTitle}
          </h3>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-[#64748b]">
            {timeSummary && <span>{timeSummary}</span>}
            <span className="text-[#cbd5e1]">·</span>
            <span className="truncate">{ticket.eventLocation}</span>
          </div>
          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <span className="truncate text-[12px] font-medium text-[#64748b]">
              {ticket.ticketTypeName}{ticket.quantity > 1 ? ` · ${ticket.quantity} tickets` : ''}
            </span>
            <span className="rounded-full border border-[#dbe7e4] bg-white/54 px-2 py-[2px] text-[11px] font-semibold text-[#177564]">
              {accessSummary}
            </span>
            {isCompleted && ticket.reviewStatus === 'submitted' && (
              <span className="text-[12px] font-semibold text-[#047857]">Reviewed</span>
            )}
          </div>

          {showFormProgress && (
            <div className="mt-2 flex min-w-0 items-center gap-2">
              <span className="text-[12px] font-medium text-[#94a3b8]">
                {completedCount}/{totalSlots} forms
              </span>
              <div className="h-1 w-20 overflow-hidden rounded-full bg-[#e2e8f0]">
                <div
                  className={`h-full rounded-full ${allComplete ? 'bg-[#177564]' : 'bg-[#d97706]'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              {ticket.deadline && (
                <span className="truncate text-[12px] font-medium text-[#94a3b8]">
                  Due {ticket.deadline}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="col-span-2 flex items-center justify-between gap-3 border-t border-[#eef2f7] pt-3 sm:col-span-1 sm:border-t-0 sm:pt-0">
          <div className="sm:hidden">
            <ParticipantDots participants={ticket.participants} />
          </div>
          <TicketActions
            ticket={ticket}
            allComplete={allComplete}
            isConfirmed={isConfirmed}
            isCompleted={isCompleted}
            isMultiple={isMultiple}
            isTeam={isTeam}
            onViewTicket={onViewTicket}
            onManageParticipants={onManageParticipants}
            onWriteReview={onWriteReview}
            onDownloadCertificate={onDownloadCertificate}
          />
        </div>
      </div>
    </article>
  );
}

function FeaturedTicket({
  ticket,
  onViewTicket,
  onManageParticipants,
  onWriteReview,
  onDownloadCertificate,
}: {
  ticket: MyTicket;
  onViewTicket: (ticket: MyTicket) => void;
  onManageParticipants: (ticket: MyTicket) => void;
  onWriteReview?: (ticket: MyTicket) => void;
  onDownloadCertificate?: (ticket: MyTicket) => void;
}) {
  const { completed, total, percent } = getTicketProgress(ticket);
  const allComplete = completed === total;
  const isConfirmed = allComplete && ticket.status === 'confirmed';
  const isCompleted = ticket.status === 'completed';
  const dateParts = getDisplayDateParts(ticket);
  const accessSummary = getAccessSummary(ticket);
  const timeSummary = getAccessTimeSummary(ticket);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/18 bg-[#111827] text-white shadow-[0_42px_92px_-52px_rgba(15,23,42,0.8)] ring-1 ring-white/10">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={ticket.image}
          alt={ticket.eventTitle}
          className="h-full w-full object-cover opacity-78 saturate-[0.94]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_26%),linear-gradient(90deg,rgba(12,18,27,0.86)_0%,rgba(12,18,27,0.62)_44%,rgba(12,18,27,0.14)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/68 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-[1px] rounded-[31px] border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(255,255,255,0.08)]" />
      <div className="pointer-events-none absolute -right-14 top-14 h-48 w-48 rounded-full bg-white/12 blur-3xl" />

      <div className="relative grid min-h-[300px] grid-cols-1 content-between gap-8 p-5 sm:min-h-[340px] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.36px] text-white/62">
              Next ticket
            </p>
          </div>

          <div className="rounded-[21px] border border-white/20 bg-white/14 px-3.5 py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_18px_34px_-26px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3px] text-[#9be7d8]">
              {dateParts.month}
            </p>
            <p className="mt-0.5 text-[28px] font-semibold leading-none tracking-[-0.6px]">
              {dateParts.day}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-white/64">
              {dateParts.weekday}
            </p>
          </div>
        </div>

        <div className="max-w-[520px]">
          <StatusBadge status={ticket.status} compact />
          <h2 className="mt-4 text-[29px] font-semibold leading-[1.02] tracking-[-0.9px] sm:text-[42px]">
            {ticket.eventTitle}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] font-medium text-white/72">
            {timeSummary && <span>{timeSummary}</span>}
            <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {ticket.eventLocation}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <TicketActions
              ticket={ticket}
              allComplete={allComplete}
              isConfirmed={isConfirmed}
              isCompleted={isCompleted}
              isMultiple={ticket.ticketType === 'multiple'}
              isTeam={ticket.ticketType === 'team'}
              onViewTicket={onViewTicket}
              onManageParticipants={onManageParticipants}
              onWriteReview={onWriteReview}
              onDownloadCertificate={onDownloadCertificate}
            />
            {allComplete ? (
              <div className="flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-3 py-2 text-[12px] font-semibold text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl">
                <Ticket className="h-3.5 w-3.5 text-[#9be7d8]" />
                {accessSummary}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-3 py-2 text-[12px] font-semibold text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl">
                <span>{completed}/{total} forms</span>
                <div className="h-1 w-16 overflow-hidden rounded-full bg-white/22">
                  <div
                    className="h-full rounded-full bg-[#9be7d8]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Filter Tabs ---
type FilterTab = 'all' | 'action_required' | 'confirmed' | 'completed';

// --- Main Page ---
export function MyEventsPage({
  onBack,
  onManageParticipants,
}: {
  onBack: () => void;
  onManageParticipants?: (ticket: MyTicket) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') as FilterTab | null;
  const [activeTab, setActiveTab] = useState<FilterTab>(
    filterParam && ['all', 'action_required', 'confirmed', 'completed'].includes(filterParam)
      ? filterParam
      : 'all'
  );
  const navigate = useNavigate();

  // Clear the filter search param after reading it (one-time deep-link)
  useEffect(() => {
    if (filterParam) {
      setSearchParams({}, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Local ticket state for review status changes
  const [tickets, setTickets] = useState<MyTicket[]>(MY_TICKETS);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTicket, setReviewTicket] = useState<MyTicket | null>(null);

  const handleViewTicket = () => {
    navigate('/passport');
  };

  const handleManageParticipants = (ticket: MyTicket) => {
    onManageParticipants?.(ticket);
  };

  const handleWriteReview = (ticket: MyTicket) => {
    setReviewTicket(ticket);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, reviewStatus: 'submitted' as const } : t
      )
    );
  };

  const handleDownloadCertificate = (ticket: MyTicket) => {
    // Directly trigger certificate download (mock)
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${ticket.eventTitle.replace(/\s+/g, '_')}_Certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter tickets based on active tab
  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'all') return t.status !== 'completed';
    if (activeTab === 'action_required') return t.status === 'action_required' || t.status === 'pending';
    if (activeTab === 'confirmed') return t.status === 'confirmed';
    if (activeTab === 'completed') return t.status === 'completed';
    return true;
  });

  const sortedTickets = filteredTickets
    .slice()
    .sort((a, b) => {
      const aTime = getDisplayDateParts(a).sortTime;
      const bTime = getDisplayDateParts(b).sortTime;
      return activeTab === 'completed' ? bTime - aTime : aTime - bTime;
    });
  const featuredTicket = activeTab === 'all' ? sortedTickets[0] : null;
  const listTickets = featuredTicket
    ? sortedTickets.filter((ticket) => ticket.id !== featuredTicket.id)
    : sortedTickets;
  const groupedListTickets = listTickets.reduce<Array<{ month: string; tickets: MyTicket[] }>>(
    (groups, ticket) => {
      const month = getDisplayDateParts(ticket).monthGroup;
      const lastGroup = groups[groups.length - 1];

      if (lastGroup?.month === month) {
        lastGroup.tickets.push(ticket);
      } else {
        groups.push({ month, tickets: [ticket] });
      }

      return groups;
    },
    [],
  );

  const actionCount = tickets.filter(t => t.status === 'action_required' || t.status === 'pending').length;
  const confirmedCount = tickets.filter(t => t.status === 'confirmed').length;
  const completedCount = tickets.filter(t => t.status === 'completed').length;
  const upcomingCount = tickets.length - completedCount;
  const reviewPendingCount = tickets.filter(t => t.status === 'completed' && t.reviewStatus === 'none').length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'Upcoming', count: upcomingCount },
    { key: 'action_required', label: 'Needs Action', count: actionCount },
    { key: 'confirmed', label: 'Ready', count: confirmedCount },
    { key: 'completed', label: 'Past', count: completedCount },
  ];

  return (
    <div className="relative flex flex-col gap-5 pb-6">
      <div className="pointer-events-none absolute left-1/2 top-[-88px] h-64 w-64 -translate-x-1/2 rounded-full bg-[#def2ee]/70 blur-3xl" />
      <div className="pointer-events-none absolute right-[-96px] top-[220px] h-56 w-56 rounded-full bg-[#f5c99b]/18 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <button
          onClick={onBack}
          className="mt-0.5 w-9 h-9 rounded-full bg-white/64 flex items-center justify-center text-[#177564] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_32px_-26px_rgba(15,23,42,0.48)] ring-1 ring-white/80 backdrop-blur-2xl hover:bg-white/84 active:scale-[0.98] transition-all shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[30px] sm:text-[40px] font-semibold text-[#181d27] leading-none tracking-[-0.9px]">
            Orders
          </h1>
          <p className="mt-2 text-[#64748b] text-sm font-medium">
            Your registered events on your passport
          </p>
        </div>
      </div>

      <div className="relative overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SegmentedChoice
          size="sm"
          value={activeTab}
          onChange={setActiveTab}
          columnsClass="grid-cols-4 min-w-[560px] max-w-none"
          className="border border-white/78 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_44px_-42px_rgba(15,23,42,0.52)] ring-1 ring-[#dbe7e4]/62 backdrop-blur-xl"
          options={tabs.map((tab) => ({
            value: tab.key,
            label: tab.label,
            badge: tab.count,
          }))}
        />
      </div>

      {featuredTicket && (
        <FeaturedTicket
          ticket={featuredTicket}
          onViewTicket={handleViewTicket}
          onManageParticipants={handleManageParticipants}
          onWriteReview={handleWriteReview}
          onDownloadCertificate={handleDownloadCertificate}
        />
      )}

      <section className="space-y-3" aria-label="Order overview">
        {activeTab === 'completed' && reviewPendingCount > 0 && (
          <div className="rounded-[16px] border border-[#dbeafe] bg-[#eff6ff] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1e40af] text-sm font-medium">
                <span className="font-bold">{reviewPendingCount} event{reviewPendingCount > 1 ? 's' : ''}</span> {reviewPendingCount === 1 ? 'needs' : 'need'} a review before you can download {reviewPendingCount === 1 ? 'the' : 'their'} certificate{reviewPendingCount > 1 ? 's' : ''}.
              </p>
            </div>
          </div>
        )}

        {groupedListTickets.length > 0 ? (
          <div className="space-y-5">
            {groupedListTickets.map((group) => (
              <div key={group.month} className="space-y-2">
                <h2 className="px-1 text-[12px] font-bold uppercase tracking-[0.32px] text-[#94a3b8]">
                  {group.month}
                </h2>
                <div className="space-y-2">
                  {group.tickets.map(ticket => (
                    <MyTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onViewTicket={handleViewTicket}
                      onManageParticipants={handleManageParticipants}
                      onWriteReview={handleWriteReview}
                      onDownloadCertificate={handleDownloadCertificate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[20px] border border-[#e2e8f0]">
            <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-3">
              <Ticket className="w-6 h-6 text-[#94a3b8]" />
            </div>
            <p className="text-[#64748b] text-[15px] font-medium">No orders in this category</p>
            <p className="text-[#94a3b8] text-sm mt-1">Try another order status.</p>
          </div>
        )}
      </section>

      {/* Review Modal */}
      <ReviewModal
        open={reviewModalOpen}
        ticket={reviewTicket}
        onClose={() => setReviewModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
        onGoToTickets={() => {
          setReviewModalOpen(false);
          setActiveTab('completed');
        }}
      />
    </div>
  );
}
