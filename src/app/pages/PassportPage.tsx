/**
 * @file PassportPage.tsx
 * @description Universal Passport QR screen with attached and locked event status.
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import {
  ChevronRight,
  CircleX,
  ClipboardList,
  Clock,
  Download,
  Lock,
  CalendarDays,
  QrCode,
  RefreshCw,
  Send,
  UserX,
  Users,
} from 'lucide-react';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import { createPassportQrSvg, PlanOutPassportCard } from '@/app/components/PlanOutPassportCard';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useAppContext } from '@/app/context/AppContext';
import {
  MY_TICKETS,
  type MyTicket,
  type Participant,
  type RegistrationQueueEntry,
  type TeamPlayerAccessPath,
} from '@/app/data/tickets';
import { resolveTeamPlayerAccess, teamPlayerLabel } from '@/app/data/teamAccess.js';

import imgAvatar from '@/assets/abde7b942aa982263d4cf69ea8ef217b427c3047.png';
import imgEventFallback from '@/assets/9dd246725291ca31eadbba57f65fc35c16ef8f44.png';

interface PassportPageProps {
  onBack: () => void;
}

function isLocked(entry: RegistrationQueueEntry) {
  return entry.entryStatus === 'pending_form' || entry.entryStatus === 'pending_payment';
}

function isUpcomingEntry(entry: RegistrationQueueEntry) {
  return entry.entryStatus !== 'no_show';
}

function findTicket(entry: RegistrationQueueEntry) {
  return MY_TICKETS.find((ticket) => ticket.id === entry.ticketId);
}

function buildTeamPassportEntries(
  teamPlayerAccess: Record<string, TeamPlayerAccessPath | undefined> = {},
  teamPlayerRoster: Record<string, Participant[] | undefined> = {},
): RegistrationQueueEntry[] {
  return MY_TICKETS.flatMap((ticket) => {
    if (ticket.ticketType !== 'team') return [];

    const participants = teamPlayerRoster[ticket.id] || ticket.participants;
    return participants.flatMap((participant, index) => {
      const accessPath = teamPlayerAccess[`${ticket.id}:${participant.id}`]
        || participant.accessPath
        || resolveTeamPlayerAccess({
          formStatus: participant.formStatus,
          inviteStatus: participant.inviteStatus,
          email: participant.email || undefined,
        });

      const hasExplicitClaim = teamPlayerAccess[`${ticket.id}:${participant.id}`] === 'passport';
      if (accessPath !== 'passport' || (participant.formStatus !== 'completed' && !hasExplicitClaim)) return [];

      return [{
        id: `${ticket.id}-${participant.id || index}-passport`,
        ticketId: ticket.id,
        orderRef: ticket.confirmationRef,
        eventName: ticket.eventTitle,
        personName: participant.passportDisplayName || teamPlayerLabel(index),
        category: ticket.ticketTypeName,
        type: 'self' as const,
        participantId: participant.id,
        accessPath,
        entryStatus: 'attached' as const,
        deadline: ticket.deadline,
        formRoute: `/orders/${ticket.id}/form?participantId=${encodeURIComponent(participant.id)}`,
      }];
    });
  });
}

function parseDeadline(deadline?: string): Date | null {
  if (!deadline) return null;
  const parsed = new Date(`${deadline} 23:59:59`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function deadlineWithinDays(deadline?: string, days = 14) {
  const parsed = parseDeadline(deadline);
  if (!parsed) return false;
  const diff = parsed.getTime() - Date.now();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function passportFormsPath(entry?: RegistrationQueueEntry) {
  const params = new URLSearchParams({ focus: 'forms' });
  if (entry?.id) params.set('entryId', entry.id);
  if (entry?.ticketId) params.set('ticketId', entry.ticketId);
  return `/passport/events?${params.toString()}`;
}

function hoursLeft(value?: string) {
  if (!value) return 24;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 24;
  return Math.max(0, Math.ceil((parsed.getTime() - Date.now()) / (60 * 60 * 1000)));
}

function formDeadlineText(deadline?: string) {
  const parsed = parseDeadline(deadline);
  if (!deadline || !parsed) return 'Deadline to be announced';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed.getTime() < today.getTime()) return 'Due now';

  return `Deadline ${deadline}`;
}

function eventDateFor(entry: RegistrationQueueEntry, ticket?: MyTicket) {
  return ticket?.eventDate || entry.deadline || 'Date to be announced';
}

function participantStatus(participant: Participant) {
  if (!participant.name && !participant.email) return 'unassigned';
  if (participant.formStatus === 'completed') return 'attached';
  return 'pending';
}

export function ParticipantRoster({ ticket }: { ticket: MyTicket }) {
  const playerEntries = ticket.participants.map((participant, index) => ({
      id: participant.id,
      name: ticket.ticketType === 'team'
        ? teamPlayerLabel(index)
        : participant.name || participant.email || 'Unassigned member',
      status: participantStatus(participant),
    }));

  return (
    <div className="mt-4 rounded-[14px] border border-neutral-100 bg-neutral-50/40 p-3.5">
      <div className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-neutral-400">
        <Users className="h-3.5 w-3.5 text-neutral-400" strokeWidth={2} />
        Player entries
      </div>
      <div className="flex flex-col gap-2.5">
        {playerEntries.slice(0, 6).map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-neutral-800">{member.name}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize border ${
                member.status === 'attached'
                  ? 'bg-emerald-50 text-[#177564] border-emerald-100'
                  : member.status === 'pending'
                    ? 'bg-amber-50 text-amber-800 border-amber-100'
                    : 'bg-neutral-100 text-neutral-500 border-neutral-200/30'
              }`}
            >
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LockedEventRow({
  entry,
  ticket,
  onComplete,
  onManageRoster,
  onSendInvites,
}: {
  entry: RegistrationQueueEntry;
  ticket?: MyTicket;
  onComplete: () => void;
  onManageRoster: () => void;
  onSendInvites: () => void;
}) {
  const isTeam = entry.type === 'team';

  return (
    <article className="rounded-[18px] border border-neutral-100 bg-white p-4.5">
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 rounded-[12px] overflow-hidden bg-neutral-100">
          <ImageWithFallback src={ticket?.image || imgEventFallback} alt={entry.eventName} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-semibold tracking-[-0.3px] text-[#181d27]">
                {entry.eventName}
              </h2>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#64748b]">
                {ticket?.eventDate || 'Date to be announced'} - {entry.category}
              </p>
            </div>
            {deadlineWithinDays(entry.deadline) && (
              <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50/50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                Deadline {entry.deadline}
              </span>
            )}
          </div>

          {isTeam ? (
            <>
              <p className="mt-3 text-[13px] font-semibold text-neutral-700">
                {entry.teamAttachedCount || 0} of {entry.teamTotalCount || ticket?.maxParticipants || 0} player forms complete
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-[#177564]"
                  style={{
                    width: `${Math.min(100, Math.round(((entry.teamAttachedCount || 0) / Math.max(entry.teamTotalCount || ticket?.maxParticipants || 1, 1)) * 100))}%`,
                  }}
                />
              </div>
              <div className="mt-4">
                <PrimaryButton
                  type="button"
                  onClick={onManageRoster}
                  compact
                  className="text-[12px]"
                >
                  Complete player details
                  <ChevronRight className="h-3.5 w-3.5" />
                </PrimaryButton>
              </div>
            </>
          ) : (
            <>
              {entry.entryStatus === 'pending_payment' ? (
                <>
                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-amber-800">
                    Payment verification pending · Access ready once paid
                  </p>
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-400 cursor-not-allowed"
                  >
                    <Clock className="h-3.5 w-3.5 animate-pulse" />
                    Awaiting payment
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-amber-800">
                    Participant form required before gate access is ready
                  </p>
                  <PrimaryButton
                    type="button"
                    onClick={onComplete}
                    compact
                    className="mt-4 text-[12px]"
                  >
                    Complete form
                    <ChevronRight className="h-3.5 w-3.5" />
                  </PrimaryButton>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function AttachedEventRow({ entry, ticket }: { entry: RegistrationQueueEntry; ticket?: MyTicket }) {
  const isTeam = entry.type === 'team';

  return (
    <article className="rounded-[18px] border border-neutral-100 bg-white p-4.5">
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 rounded-[12px] overflow-hidden bg-neutral-100">
          <ImageWithFallback src={ticket?.image || imgEventFallback} alt={entry.eventName} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-semibold tracking-[-0.3px] text-[#181d27]">
                {entry.eventName}
              </h2>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#64748b]">
                {ticket?.eventDate || 'Date to be announced'} - {entry.category}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#177564]">
              Ready
            </span>
          </div>

          {isTeam && <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#64748b]">Each player uses their own Passport entry or app-less Guest QR.</p>}
        </div>
      </div>
    </article>
  );
}


export function ResubmitEventRow({ entry, ticket, onReview }: { entry: RegistrationQueueEntry; ticket?: MyTicket; onReview: () => void }) {
  return (
    <article className="rounded-[18px] border border-neutral-100 bg-white p-4.5">
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 rounded-[12px] overflow-hidden bg-neutral-100">
          <ImageWithFallback src={ticket?.image || imgEventFallback} alt={entry.eventName} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-semibold tracking-[-0.3px] text-[#181d27]">{entry.eventName}</h2>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#64748b]">
                {eventDateFor(entry, ticket)} - {entry.category}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">
              Form update required
            </span>
          </div>
          <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#64748b]">
            Please review the updated form to keep this registration valid.
          </p>
          <button
            type="button"
            onClick={onReview}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-orange-600 px-4.5 text-[12px] font-semibold text-white transition-all hover:bg-orange-700 active:scale-[0.98] shadow-sm"
          >
            Review and resubmit
          </button>
        </div>
      </div>
    </article>
  );
}

export function ReleasedEventRow({ entry, ticket, onBrowse }: { entry: RegistrationQueueEntry; ticket?: MyTicket; onBrowse: () => void }) {
  return (
    <article className="rounded-[18px] border border-neutral-100 bg-white p-4.5 opacity-70">
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 rounded-[12px] overflow-hidden bg-neutral-100">
          <ImageWithFallback src={ticket?.image || imgEventFallback} alt={entry.eventName} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-semibold tracking-[-0.3px] text-[#535862]">{entry.eventName}</h2>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#717680]">
                {eventDateFor(entry, ticket)} - {entry.category}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#535862]">Spot released</span>
          </div>
          <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#717680]">
            Form deadline was {entry.deadline || 'missed'}. Your spot was released back to inventory. No refund issued.
          </p>
          <button
            type="button"
            onClick={onBrowse}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-neutral-200 bg-white px-4.5 text-[12px] font-semibold text-[#414651] transition-all hover:bg-neutral-50 active:scale-[0.98] shadow-sm"
          >
            Browse event again
          </button>
        </div>
      </div>
    </article>
  );
}

export function PastEventRow({ entry, ticket }: { entry: RegistrationQueueEntry; ticket?: MyTicket }) {
  const noShow = entry.entryStatus === 'no_show';
  const statusLabel = noShow ? 'No-show' : ticket?.status === 'completed' ? 'Completed' : 'Attended';
  return (
    <article className="rounded-[18px] border border-neutral-100 bg-white p-4.5">
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 rounded-[12px] overflow-hidden bg-neutral-100">
          <ImageWithFallback src={ticket?.image || imgEventFallback} alt={entry.eventName} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-semibold tracking-[-0.3px] text-[#535862]">{entry.eventName}</h2>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#64748b]">{eventDateFor(entry, ticket)}</p>
            </div>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#535862]">
              {statusLabel}
            </span>
          </div>
          {noShow && (
            <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#717680]">
              You were registered but not checked in on event day.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusSection({
  title,
  count,
  description,
  children,
}: {
  title: string;
  count?: number;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-[17px] font-semibold text-[#181d27]">{title}</h2>
        {typeof count === 'number' && (
          <span className="inline-flex h-5 items-center justify-center rounded-full bg-neutral-100 px-2 text-[10px] font-medium text-neutral-500">
            {count}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}

function getEventImageUrl(entry: RegistrationQueueEntry, ticket?: MyTicket): string {
  if (ticket?.image) return ticket.image;
  if (entry.image) return entry.image;
  
  const name = (entry.eventName || '').toLowerCase();
  if (name.includes('swim') || name.includes('water')) {
    return 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('futsal') || name.includes('soccer') || name.includes('football')) {
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('run') || name.includes('trail') || name.includes('marathon')) {
    return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('tennis')) {
    return 'https://images.unsplash.com/photo-1761286753856-2f39b4413c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('volleyball')) {
    return 'https://images.unsplash.com/photo-1628314200733-5f7785cdc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  if (name.includes('yoga')) {
    return 'https://images.unsplash.com/photo-1623182965637-e2e2f32818d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  }
  return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
}

function formTaskDetails(entry: RegistrationQueueEntry, ticket?: MyTicket) {
  const deadline = formDeadlineText(entry.deadline);
  const isUrgent = deadline.toLowerCase().includes('now') || deadline.toLowerCase().includes('today');

  if (entry.type === 'team') {
    const total = entry.teamTotalCount || ticket?.maxParticipants || ticket?.participants.length || 1;
    const complete = entry.teamAttachedCount ?? ticket?.participants.filter((participant) => participant.formStatus === 'completed').length ?? 0;
    const remaining = Math.max(0, total - complete);

    return {
      eyebrow: 'Team purchase',
      title: entry.eventName,
      description: `${remaining} player entr${remaining === 1 ? 'y still needs' : 'ies still need'} to be set up.`,
      metaText: `${complete}/${total} complete`,
      deadlineText: deadline,
      isUrgent,
      primaryLabel: 'Complete player details',
      secondaryLabel: undefined,
      icon: Users,
    };
  }

  if (entry.type === 'guest') {
    const total = entry.guestTotalCount || ticket?.participants.length || 1;
    const complete = entry.guestCompletedCount ?? ticket?.participants.filter((participant) => participant.formStatus === 'completed').length ?? 0;
    const remaining = Math.max(0, total - complete);

    return {
      eyebrow: 'Multiple entries',
      title: entry.eventName,
      description: 'Use this when one purchase covers more than one participant. Fill forms yourself or send links.',
      metaText: `${remaining} form${remaining === 1 ? '' : 's'} needed`,
      deadlineText: deadline,
      isUrgent,
      primaryLabel: 'Manage participant forms',
      secondaryLabel: undefined,
      icon: Send,
    };
  }

  const isResubmit = entry.entryStatus === 'resubmit_required';
  return {
    eyebrow: 'Single entry',
    title: entry.eventName,
    description: isResubmit 
      ? 'Please review the updated form requirements to keep this registration valid.'
      : 'Complete your participant details so this event appears as ready on your Passport.',
    metaText: isResubmit ? 'Update required' : entry.category,
    deadlineText: deadline,
    isUrgent,
    primaryLabel: isResubmit ? 'Review form' : 'Complete form',
    secondaryLabel: undefined,
    icon: ClipboardList,
  };
}

function FormTaskCard({
  entry,
  ticket,
  highlighted,
  onPrimary,
  onSecondary,
}: {
  entry: RegistrationQueueEntry;
  ticket?: MyTicket;
  highlighted: boolean;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const details = formTaskDetails(entry, ticket);
  const imageUrl = getEventImageUrl(entry, ticket);

  return (
    <article
      id={`passport-entry-${entry.id}`}
      className={`rounded-[18px] border border-slate-100 bg-white p-5 transition-all duration-300 ${
        highlighted
          ? 'border-neutral-300 ring-1 ring-neutral-300/10 shadow-[0_8px_20px_rgba(0,0,0,0.02)]'
          : 'shadow-[0_2px_12px_rgba(0,0,0,0.006)] hover:border-slate-200/60 hover:shadow-[0_6px_20px_rgba(0,0,0,0.012)]'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Event Image */}
        <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100/60 shadow-inner relative">
          <ImageWithFallback
            src={imageUrl}
            alt={details.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-400">
              {details.eyebrow}
            </span>
          </div>
          <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight text-slate-900 line-clamp-1">
            {details.title}
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-500 leading-relaxed">
            {details.description}
          </p>

          {/* Minimalist Apple-like Meta Row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-500 font-medium">
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
              details.isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
            }`} />
            <span>{details.metaText}</span>
            <span className="text-slate-300">·</span>
            <span className={details.isUrgent ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
              {details.deadlineText}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 min-[390px]:flex-row min-[390px]:items-center">
        <PrimaryButton
          type="button"
          onClick={onPrimary}
          compact
          className="h-9 rounded-full px-5 text-[13px]"
        >
          {details.primaryLabel}
          <ChevronRight className="h-3.5 w-3.5" />
        </PrimaryButton>
        {details.secondaryLabel && (
          <SecondaryButton
            type="button"
            onClick={onSecondary}
            compact
            tone="neutral"
            className="h-9 rounded-full px-5 text-[13px]"
          >
            {details.secondaryLabel}
          </SecondaryButton>
        )}
      </div>
    </article>
  );
}

function uniqueByTicket(entries: RegistrationQueueEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = entry.ticketId || entry.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isCompletedOrPastEntry(entry: RegistrationQueueEntry) {
  const ticket = findTicket(entry);
  return entry.type === 'self' && (entry.entryStatus === 'no_show' || ticket?.status === 'completed');
}

function isReadyAccessEntry(entry: RegistrationQueueEntry) {
  return entry.type === 'self' && entry.entryStatus === 'attached' && !isCompletedOrPastEntry(entry);
}

function isUpdateEntry(entry: RegistrationQueueEntry) {
  return entry.type === 'self' && entry.entryStatus === 'released';
}

export function PassportEventsPage() {
  const navigate = useNavigate();
  const { registrationQueueEntries, teamPlayerAccess, teamPlayerRoster } = useAppContext();
  const passportEntries = [
    ...registrationQueueEntries,
    ...buildTeamPassportEntries(teamPlayerAccess, teamPlayerRoster),
  ];

  const upcomingEntries = passportEntries.filter(isUpcomingEntry);
  const readyEntries = uniqueByTicket(upcomingEntries.filter(isReadyAccessEntry));
  const updateEntries = uniqueByTicket(upcomingEntries.filter(isUpdateEntry));
  const pastEntries = uniqueByTicket(passportEntries.filter(isCompletedOrPastEntry));
  const hasPassportEntries = readyEntries.length > 0 || updateEntries.length > 0 || pastEntries.length > 0;

  const renderUpdateCard = (entry: RegistrationQueueEntry) => {
    const ticket = findTicket(entry);

    return (
      <ReleasedEventRow
        key={entry.id}
        entry={entry}
        ticket={ticket}
        onBrowse={() => navigate(ticket ? `/events/${ticket.eventId}` : '/events')}
      />
    );
  };

  return (
    <div className="flex flex-col gap-7 pb-32">
      <section className="flex items-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#181d27]">
          Events Attending
        </h1>
      </section>

      {!hasPassportEntries ? (
        <section className="flex flex-col gap-3">
          <div className="rounded-[18px] border border-neutral-100 bg-white p-8 text-center">
            <EmptyStateGraphic kind="no-forms" className="h-36 w-36" />
            <h3 className="text-[16px] font-semibold text-[#181d27]">No Passport events yet</h3>
            <p className="mx-auto mt-1.5 max-w-[320px] text-[13px] leading-relaxed text-[#64748b]">
              Entries appear here after they are confirmed as your personal access. Bought or managed entries stay in Orders.
            </p>
            <PrimaryButton
              type="button"
              onClick={() => navigate('/orders')}
              compact
              className="mt-5 h-9 rounded-full px-5 text-[13px]"
            >
              View Orders
            </PrimaryButton>
          </div>
        </section>
      ) : null}

      {readyEntries.length > 0 && (
        <StatusSection
          title="Ready for access"
          count={readyEntries.length}
        >
          {readyEntries.map((entry) => (
            <AttachedEventRow key={entry.id} entry={entry} ticket={findTicket(entry)} />
          ))}
        </StatusSection>
      )}

      {updateEntries.length > 0 && (
        <StatusSection
          title="Status updates"
          count={updateEntries.length}
        >
          {updateEntries.map(renderUpdateCard)}
        </StatusSection>
      )}

      {pastEntries.length > 0 && (
        <StatusSection
          title="Past events"
          count={pastEntries.length}
        >
          {pastEntries.map((entry) => (
            <PastEventRow key={entry.id} entry={entry} ticket={findTicket(entry)} />
          ))}
        </StatusSection>
      )}
    </div>
  );
}

export function PassportPage({ onBack: _onBack }: PassportPageProps) {
  const navigate = useNavigate();
  const {
    userProfile,
    member,
    qrPayload,
    registrationQueueEntries,
    guestEntryQRs,
    rotatePassportQr,
    teamPlayerAccess,
    teamPlayerRoster,
  } = useAppContext();

  const holderName = userProfile.name || member.displayName || 'PlanOut Member';
  const holderImage = userProfile.avatarUrl || member.avatarUrl || imgAvatar;
  const passportEntries = [
    ...registrationQueueEntries,
    ...buildTeamPassportEntries(teamPlayerAccess, teamPlayerRoster),
  ];
  const upcomingEntries = passportEntries.filter(isUpcomingEntry);
  const attachedEntries = upcomingEntries.filter(isReadyAccessEntry);
  const attachedCount = attachedEntries.length;
  const formActionCount = 0;
  const claimedGuestEntries = Object.values(guestEntryQRs).filter(
    (entry) => entry?.claimedAt && entry.claimedByMemberId === member.memberId,
  );

  const downloadQr = useCallback(() => {
    const svg = createPassportQrSvg(qrPayload, holderName, member.passportCode);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PlanOut-Passport-${member.passportCode}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [holderName, member.passportCode, qrPayload]);

  const regenerateQr = useCallback(() => {
    rotatePassportQr();
    toast.success('Passport QR regenerated');
  }, [rotatePassportQr]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-white px-3 pb-[calc(118px+env(safe-area-inset-bottom))] pt-[calc(32px+env(safe-area-inset-top))]">
      {/* Redundant Close button removed as users safely navigate away using the bottom navbar */}

      <main className="mx-auto flex w-full max-w-[520px] lg:max-w-[1080px] flex-col gap-6 py-4">
        <div className="text-center lg:text-left">
          <h1 className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.6px] text-[#0f172b]">
            {holderName.split(' ')[0]}'s Passport
          </h1>
          <p className="mt-1 text-[13px] text-[#52716c] hidden lg:block">
            Universal event-day check-in credential and Passport entry records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[460px_minmax(0,1fr)] gap-8 items-start">
          {/* Left Column: Passport Card & QR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.15, y: 400 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 24,
              mass: 1
            }}
            style={{ transformOrigin: 'bottom center', width: '100%' }}
            className="flex w-full justify-center"
          >
            <PlanOutPassportCard
              name={holderName}
              image={holderImage}
              passportCode={member.passportCode}
              qrPayload={qrPayload}
              qrSubtitle={attachedCount > 0 ? 'Scan to view events' : 'Scan after your first event is ready'}
              identityVisual="gradient"
              footerActions={[
                {
                  label: 'Events',
                  icon: CalendarDays,
                  onClick: () => navigate('/passport/events'),
                  className: 'bg-[#ff6ed8] text-[#552045] rotate-[-5deg]',
                  badgeCount: formActionCount
                },
                { label: 'Save', icon: Download, onClick: downloadQr, className: 'bg-[#66dced] text-[#174753] rotate-[-1deg]' },
                { label: 'Reset QR', icon: RefreshCw, onClick: regenerateQr, className: 'bg-[#ffe36e] text-[#4f4214] rotate-[5deg]' },
              ].map(({ label, icon: Icon, onClick, className, badgeCount }) => (
                <button
                  key={label}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClick();
                  }}
                  className={`relative flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-t-[15px] rounded-b-[7px] px-2 pt-1 text-[11.5px] font-semibold shadow-[0_8px_14px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.65)] transition-transform active:scale-[0.96] ${className}`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                  <span className="truncate">{label}</span>
                  {badgeCount && badgeCount > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8.5px] font-black leading-none text-white shadow-[0_2px_6px_rgba(239,68,68,0.4)] ring-1.5 ring-white z-10">
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                      <span className="relative z-10">{badgeCount}</span>
                    </span>
                  ) : null}
                </button>
              ))}
            />
          </motion.div>

          {/* Right Column: Actions & Passport History */}
          <section
            data-testid="passport-add-event-card"
            className="rounded-[18px] border border-[#e3ebe8] bg-white p-4 shadow-[0_4px_8px_-6px_rgba(15,23,42,0.24)] sm:p-5"
          >
            <div className="flex items-center gap-3 px-1">
              <div className="min-w-0">
                <p className="text-balance text-[16px] font-semibold text-[#181d27]">Add a past event</p>
                <p className="mt-0.5 text-pretty text-[12px] leading-relaxed text-[#66746f]">Save an event you attended to your Passport.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/passport/add-entry?scan=1')}
              className="group mt-4 flex min-h-12 w-full items-center justify-between gap-4 rounded-[12px] bg-[linear-gradient(90deg,#3cd4b9_0%,#177564_100%)] px-3.5 py-2.5 text-left text-white shadow-[0_4px_8px_-6px_rgba(23,117,100,0.7)] ring-1 ring-inset ring-white/20 transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/40 focus-visible:ring-offset-2"
            >
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold">Scan event QR</span>
                <span className="mt-0.5 block text-[11.5px] font-medium text-white/65">Camera or saved QR photo</span>
              </span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-white/15 ring-1 ring-inset ring-white/20" aria-hidden="true">
                <QrCode className="size-4 text-white/90" strokeWidth={2} />
              </span>
            </button>

            {claimedGuestEntries.length > 0 && (
              <div className="mt-4 border-t border-[#e6eeeb] pt-4">
                <div className="flex items-center justify-between gap-3 px-1">
                  <p className="text-[13px] font-semibold text-[#284541]">Recently added</p>
                  <span className="text-[11px] font-semibold text-[#6a8580]">{claimedGuestEntries.length} {claimedGuestEntries.length === 1 ? 'event' : 'events'}</span>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {claimedGuestEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between gap-3 rounded-[12px] border border-[#e6eeeb] bg-[#f8fbfa] px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold text-[#181d27]">{entry.eventName}</p>
                        <p className="mt-0.5 truncate text-[11.5px] font-medium text-[#66746f]">{entry.category} · {entry.usedAt ? 'Checked in before claim' : 'Added from Guest QR'}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#e5f3ef] px-2.5 py-1 text-[11px] font-semibold text-[#177564]">Added</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
