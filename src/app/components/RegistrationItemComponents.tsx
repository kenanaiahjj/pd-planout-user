import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Check,
  CalendarDays,
  Copy,
  Mail,
  MapPin,
  Share2,
  Send,
  Tag,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { ConfirmDialog } from '@/app/components/ConfirmDialog';
import { OrderQrOverlay, type OrderQrOverlayState } from '@/app/components/OrderQrOverlay';
import {
  type EntryAttendanceDecision,
  type GuestEntryQRRecord,
  useAppContext,
} from '@/app/context/AppContext';
import {
  type EntryStatus,
  type InviteStatus,
  type MyTicket,
  type Participant,
  type RegistrationQueueEntry,
  type TeamPlayerAccessPath,
} from '@/app/data/tickets';
import { resolveTeamPlayerAccess, teamPlayerDisplayName, teamPlayerLabel } from '@/app/data/teamAccess.js';
import {
  canAddTeamPlayer,
  canRemoveTeamPlayer,
  createTeamPlayerSlot,
  removeTeamPlayerSlot,
  shareTeamPlayerInvite,
  unsendTeamPlayerInvite,
} from '@/app/data/teamPlayers.js';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import { IconButton } from '@/app/components/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  ContactOrganizerButton,
} from '@/app/components/OrganizerContactWidget';
import {
  getTeamOrderSummary,
} from '@/app/data/orderPricing.js';
import {
  buildBulkFormLinkMessage,
  buildParticipantFormLink,
  getBulkEmailCandidates,
  getShareableFormEntries,
  groupBulkEmailEntriesByEvent,
} from '@/app/data/formLinks.js';
import { formatEventDate } from '@/app/data/eventDate.js';

export interface OrderEventEntry {
  id: string;
  ticket: MyTicket;
  entryName: string;
  participantName: string;
  participantLabel?: string;
  attendeeEmail?: string;
  category: string;
  status: EntryStatus;
  type: 'self' | 'guest' | 'team';
  participantId?: string;
  accessPath?: TeamPlayerAccessPath;
  price: number;
  queueEntry?: RegistrationQueueEntry;
  teamAttachedCount?: number;
  teamTotalCount?: number;
  buyerAttending: boolean;
  attendance?: EntryAttendanceDecision;
  guestQR?: GuestEntryQRRecord;
  inviteStatus?: InviteStatus;
  claimLinkRevoked?: boolean;
  passportMemberId?: string;
  passportDisplayName?: string;
}

export interface OrderRecord {
  id: string;
  ref: string;
  date: string;
  name: string;
  eventEntries: OrderEventEntry[];
  merchItems?: any[];
  paymentStatus?: string;
  paymentMethod?: string;
  paymentDate?: string;
  fees?: number;
  image?: string;
}

export type RegistrationStateTone = 'ready' | 'pending' | 'warning' | 'danger';

function appOrigin() {
  return typeof window !== 'undefined' ? window.location.origin : 'https://planout.app';
}

function copyText(text: string, label: string) {
  navigator.clipboard?.writeText(text);
  toast.success(label);
}

function entryReason(status: EntryStatus) {
  if (status === 'attached') return 'ready for event access';
  if (status === 'released') return 'deadline missed · slot released';
  if (status === 'resubmit_required') return 'changes required by organizer';
  if (status === 'no_show') return 'marked as no-show';
  if (status === 'pending_payment') return 'awaiting payment verification';
  return 'participant form required';
}

export function registrationQueueFallback(entry: OrderEventEntry, order: OrderRecord): RegistrationQueueEntry {
  return {
    id: entry.id,
    ticketId: entry.ticket.id,
    orderRef: order.ref,
    eventName: entry.ticket.eventTitle,
    personName: entry.participantName,
    category: entry.category,
    type: entry.type,
    participantId: entry.participantId,
    accessPath: entry.accessPath || 'pending',
    entryStatus: entry.status,
    deadline: entry.ticket.deadline,
    formRoute: `/orders/${entry.ticket.id}/form`,
    inviteEmail: entry.attendeeEmail || null,
    inviteStatus: entry.inviteStatus || 'not_invited',
    claimLinkRevoked: entry.claimLinkRevoked,
    participantIsPrimary: entry.type === 'self',
    price: entry.price,
  };
}

export function RegistrationCardHeader({
  title,
  date,
  location,
  image,
}: {
  title: string;
  date: string;
  location?: string;
  image?: string;
}) {
  const formattedDate = formatEventDate(date, { month: 'long' });

  return (
    <header className="bg-transparent px-4 pt-4 sm:px-5 sm:pt-5">
      <div className="flex items-center gap-3">
        {image && (
          <ImageWithFallback
            src={image}
            alt=""
            className="size-10 shrink-0 rounded-[11px] object-cover"
          />
        )}
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-pretty text-[14px] font-semibold leading-[1.18] tracking-[-0.2px] text-[#181d27] sm:text-[15px]">
            {title}
          </h3>
          <div className="mt-1 flex min-w-0 flex-col gap-0.5 text-[11px] font-semibold leading-[1.2] text-[#8a9bb1] sm:text-[12px]">
            <span className="inline-flex min-w-0 items-center gap-1">
              <CalendarDays className="size-3 shrink-0" strokeWidth={2.1} aria-hidden="true" />
              <span className="truncate">{formattedDate}</span>
            </span>
            {location && (
              <span className="inline-flex min-w-0 items-start gap-1">
                <MapPin className="mt-px size-3 shrink-0" strokeWidth={2.1} aria-hidden="true" />
                <span className="line-clamp-2">{location}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function RegistrationItemShell({
  title,
  date,
  location,
  image,
  children,
}: {
  title: string;
  date: string;
  location?: string;
  image?: string;
  children: React.ReactNode;
}) {
  return (
    <article data-testid="registration-event-item" className="rounded-[18px] border border-neutral-100 bg-white overflow-hidden shadow-[0_12px_32px_-24px_rgba(15,23,42,0.4)]">
      <RegistrationCardHeader title={title} date={date} location={location} image={image} />
      {children}
    </article>
  );
}

export function RegistrationStatePanel({
  tone,
  children,
  actions,
  cornerAction,
  divider = true,
}: {
  tone: RegistrationStateTone;
  children: React.ReactNode;
  actions?: React.ReactNode;
  cornerAction?: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      data-tone={tone}
      className={`relative flex flex-col gap-2.5 py-3 sm:flex-row sm:items-center sm:justify-between ${divider ? 'border-b border-[#edf2f0]' : ''}`}
    >
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="min-w-0 flex-1">{children}</div>
        {cornerAction && <div className="shrink-0 sm:hidden">{cornerAction}</div>}
      </div>
      {(actions || cornerAction) && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions && <RegistrationActionRow>{actions}</RegistrationActionRow>}
          {cornerAction && <div className="hidden shrink-0 sm:block">{cornerAction}</div>}
        </div>
      )}
    </div>
  );
}

export function RegistrationActionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-end gap-2">{children}</div>;
}

export function ClaimLinkActions({
  entry,
  order,
  onRescind,
}: {
  entry: OrderEventEntry;
  order: OrderRecord;
  onRescind: () => void;
}) {
  const formLink = buildParticipantFormLink(entry, order.id, appOrigin());

  return (
    <>
      <SecondaryButton
        type="button"
        compact
        onClick={() => copyText(formLink, 'Claim link copied')}
        className="text-[12px]"
      >
        <Copy className="h-3.5 w-3.5" />
        Copy link
      </SecondaryButton>
      <SecondaryButton
        type="button"
        compact
        tone="neutral"
        onClick={onRescind}
        className="text-[12px]"
      >
        Revoke
      </SecondaryButton>
    </>
  );
}

export function ClaimLinkStatePanel({
  entry,
  order,
  onRescind,
  compact = false,
  title,
  compactDetail,
  divider = true,
}: {
  entry: OrderEventEntry;
  order: OrderRecord;
  onRescind: () => void;
  compact?: boolean;
  title?: string;
  compactDetail?: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <RegistrationStatePanel
      tone="pending"
      divider={divider}
      actions={<ClaimLinkActions entry={entry} order={order} onRescind={onRescind} />}
    >
      {title && <p className="truncate text-[12.5px] font-semibold text-[#181d27]">{title}</p>}
      {compact ? (
        compactDetail
      ) : (
        <div className="mt-1 flex flex-col gap-1.5">
          <span className="w-fit rounded-full bg-[#e4f4ef] px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#cfe3de]">
            Claim link sent
          </span>
          <p className="text-[12.5px] font-medium leading-relaxed text-[#315f57]">
            The recipient will complete the form and receive this entry on their Passport.
          </p>
        </div>
      )}
    </RegistrationStatePanel>
  );
}

export function EmailReviewSheet({
  entry,
  open,
  onClose,
  onSendInvite,
}: {
  entry: OrderEventEntry;
  open: boolean;
  onClose: () => void;
  onSendInvite: (recipient: string) => void;
}) {
  const [recipient, setRecipient] = useState(entry.attendeeEmail ?? '');
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    if (open) setRecipient(entry.attendeeEmail ?? '');
  }, [entry.attendeeEmail, open]);

  useEffect(() => {
    if (!open) {
      setKeyboardInset(0);
      return undefined;
    }

    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    const updateKeyboardInset = () => {
      setKeyboardInset(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop));
    };

    updateKeyboardInset();
    viewport.addEventListener('resize', updateKeyboardInset);
    viewport.addEventListener('scroll', updateKeyboardInset);

    return () => {
      viewport.removeEventListener('resize', updateKeyboardInset);
      viewport.removeEventListener('scroll', updateKeyboardInset);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-5"
          style={keyboardInset > 0 ? { paddingBottom: `${keyboardInset + 12}px` } : undefined}
        >
          <motion.button
            type="button"
            aria-label="Close email preview"
            className="absolute inset-0 bg-[#10211e]/28 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-review-title"
            data-testid="email-review-sheet"
            className="relative max-h-[calc(100svh-1.5rem)] w-full max-w-[520px] overflow-y-auto rounded-[20px] bg-white p-5 shadow-[0_24px_70px_-28px_rgba(16,33,30,0.55)] ring-1 ring-[#d7e5e2]"
            style={keyboardInset > 0 ? { maxHeight: `calc(100svh - ${keyboardInset + 24}px)` } : undefined}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.34 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d7e5e2] sm:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#e8f7f3] text-[#177564]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="email-review-title" className="text-[18px] font-semibold tracking-[-0.3px] text-[#181d27]">
                    Send form link
                  </h2>
                  <p className="mt-1 text-[12px] font-medium text-[#64748b]">
                    Review before the invite sends.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close email preview"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[22px] leading-none text-[#64748b] transition-colors hover:bg-[#f3f8f7] hover:text-[#181d27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
              >
                ×
              </button>
            </div>

            <div className="mt-5 rounded-[14px] border border-[#d7e5e2] bg-[#f8fcfb] p-3.5">
              <label htmlFor="invite-recipient-email" className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a9bb1]">
                Recipient email
              </label>
              <input
                id="invite-recipient-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="send"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                placeholder="name@example.com"
                className="mt-2 min-h-12 w-full rounded-[11px] border border-[#c9ddd9] bg-white px-3.5 text-[14px] font-semibold text-[#181d27] outline-none transition-shadow placeholder:font-medium placeholder:text-[#8a9bb1] focus:border-[#177564] focus:ring-2 focus:ring-[#177564]/15"
              />
              <p className="mt-2 text-[11px] leading-relaxed text-[#64748b]">
                A default PlanOut invite will be sent to this address.
              </p>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <SecondaryButton
                type="button"
                onClick={onClose}
                compact
                tone="neutral"
                className="text-[12px]"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="button"
                onClick={() => onSendInvite(recipient.trim())}
                data-testid="email-review-send"
                disabled={!/^\S+@\S+\.\S+$/.test(recipient.trim())}
                compact
                className="text-[12px]"
              >
                <Send className="h-3.5 w-3.5" />
                Send invite
              </PrimaryButton>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}

export function BulkEmailReviewSheet({
  entries,
  open,
  onClose,
  onSend,
}: {
  entries: OrderEventEntry[];
  open: boolean;
  onClose: () => void;
  onSend: (entries: OrderEventEntry[]) => void;
}) {
  const [emailDrafts, setEmailDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setEmailDrafts(Object.fromEntries(entries.map((entry) => [entry.id, entry.attendeeEmail || ''])));
  }, [entries, open]);

  const draftEntries = entries.map((entry) => ({
    ...entry,
    attendeeEmail: emailDrafts[entry.id]?.trim() || '',
  }));
  const eventGroups = groupBulkEmailEntriesByEvent(draftEntries) as Array<{
    id: string;
    title: string;
    entries: OrderEventEntry[];
  }>;
  const allEmailsValid = draftEntries.length > 0
    && draftEntries.every((entry) => /^\S+@\S+\.\S+$/.test(entry.attendeeEmail || ''));

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-5">
          <motion.button
            type="button"
            aria-label="Close bulk email review"
            className="absolute inset-0 bg-[#10211e]/28 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-email-review-title"
            aria-describedby="bulk-email-review-description bulk-email-eligibility-note"
            data-testid="bulk-email-review-sheet"
            className="relative flex max-h-[calc(100svh-1.5rem)] w-full max-w-[520px] flex-col overflow-hidden rounded-[26px] border border-white/70 bg-[rgba(250,252,251,0.94)] shadow-[0_28px_80px_-30px_rgba(16,33,30,0.62)] backdrop-blur-[24px]"
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.34 }}
          >
            <div className="shrink-0 px-4 pt-3.5 sm:px-5 sm:pt-4">
              <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#cadbd7] sm:hidden" />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 pt-0.5">
                  <h2 id="bulk-email-review-title" className="text-[19px] font-semibold leading-[1.15] tracking-[-0.4px] text-[#181d27]">
                    Email pending forms
                  </h2>
                  <p id="bulk-email-review-description" className="mt-1 text-[12px] font-medium leading-[1.4] text-[#64748b]">
                    Check each recipient before sending.
                  </p>
                </div>
                <IconButton
                  type="button"
                  onClick={onClose}
                  aria-label="Close bulk email review"
                  className="h-9 w-9 border-white/80 bg-white/78 text-[#5f716d] shadow-[0_7px_18px_-12px_rgba(15,23,42,0.48)] backdrop-blur-[12px]"
                >
                  <X className="h-4 w-4" strokeWidth={2.25} />
                </IconButton>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto px-4 pb-3 sm:px-5">
              <div
                data-testid="bulk-email-event-groups"
                className="mt-4 grid gap-2.5"
              >
                {eventGroups.map((group) => (
                  <section
                    key={group.id}
                    aria-labelledby={`bulk-email-event-${group.id}`}
                    className="overflow-hidden rounded-[16px] border border-[#dce7e4] bg-white/86 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.55)]"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-[#dce7e4] bg-[linear-gradient(135deg,rgba(233,247,243,0.96),rgba(249,252,251,0.88))] px-3.5 py-2.5">
                      <h3
                        id={`bulk-email-event-${group.id}`}
                        className="min-w-0 text-[12.5px] font-semibold leading-[1.3] tracking-[-0.15px] text-[#315f57]"
                      >
                        {group.title}
                      </h3>
                      <span className="shrink-0 pt-0.5 text-[10px] font-semibold text-[#6a817b]">
                        {group.entries.length} recipient{group.entries.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="divide-y divide-[#e8efed]">
                      {group.entries.map((entry, index) => {
                        const label = entry.participantLabel || entry.participantName || `Player ${index + 1}`;
                        return (
                          <label key={entry.id} className="block px-3.5 py-3.5">
                            <span className="text-[12px] font-semibold tracking-[-0.1px] text-[#315f57]">{label}</span>
                            <input
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              enterKeyHint="next"
                              value={entry.attendeeEmail}
                              onChange={(event) => setEmailDrafts((current) => ({ ...current, [entry.id]: event.target.value }))}
                              placeholder="name@example.com"
                              aria-label={`${label} email`}
                              className="mt-2 min-h-11 w-full rounded-[12px] border border-[#dce7e4] bg-[#f7f9f8] px-3 text-[13.5px] font-semibold text-[#181d27] outline-none transition-[background-color,border-color,box-shadow] placeholder:font-medium placeholder:text-[#94a3b8] focus:border-[#79b8ab] focus:bg-white focus:ring-2 focus:ring-[#177564]/12"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <p
                id="bulk-email-eligibility-note"
                data-testid="bulk-email-eligibility-note"
                className="mt-3 rounded-[12px] bg-[#f1f5f4] px-3 py-2.5 text-[10.5px] font-medium leading-[1.45] text-[#64748b]"
              >
                Only unsent forms without Passport or Guest QR access are included.
              </p>
            </div>

            <div
              data-testid="bulk-email-actions"
              className="shrink-0 border-t border-white/80 bg-white/72 px-4 pb-[calc(0.25rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-[16px] sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-2 sm:px-5 sm:pb-4"
            >
              <PrimaryButton
                type="button"
                onClick={() => onSend(draftEntries)}
                data-testid="bulk-email-review-send"
                disabled={!allEmailsValid}
                compact
                fullWidth
                className="min-h-11 rounded-[13px] text-[13px] shadow-[0_14px_28px_-20px_rgba(23,117,100,0.85)]"
              >
                <Send className="h-3.5 w-3.5" />
                {entries.length === 1 ? 'Send invite' : `Send ${entries.length} invites`}
              </PrimaryButton>
              <button
                type="button"
                onClick={onClose}
                className="mt-1.5 min-h-10 w-full rounded-[11px] px-4 text-[12px] font-semibold text-[#64748b] transition-colors hover:bg-[#eef3f2] hover:text-[#334155] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/25 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ParticipantFormLinkActions({
  entry,
  order,
  onShare,
  compact = false,
  primary = false,
}: {
  entry: OrderEventEntry;
  order: OrderRecord;
  onShare?: (recipient?: string) => void;
  compact?: boolean;
  primary?: boolean;
}) {
  const formLink = buildParticipantFormLink(entry, order.id, appOrigin());
  const [emailReviewOpen, setEmailReviewOpen] = useState(false);

  const sendInvite = (recipient: string) => {
    onShare?.(recipient);
    setEmailReviewOpen(false);
    toast.success('Invite sent', {
      description: `Default PlanOut invite sent to ${recipient}.`,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {primary ? (
            <PrimaryButton
              type="button"
              compact
              className="text-[11px] whitespace-nowrap"
              title="Choose how to share this form"
              aria-label="Share form"
            >
              <Share2 className="h-3.5 w-3.5 shrink-0" />
              Share form
            </PrimaryButton>
          ) : (
            <SecondaryButton
              type="button"
              compact
              className={compact ? 'text-[11px] whitespace-nowrap' : 'text-[12px] whitespace-nowrap'}
              title="Choose how to share this form"
              aria-label="Share form"
            >
              <Share2 className="h-3.5 w-3.5 shrink-0" />
              Share form
            </SecondaryButton>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="end"
          sideOffset={8}
          aria-label="Form sharing options"
          className="min-w-[168px] rounded-[12px] border-[#d9e8e5] bg-white p-1.5 shadow-[0_16px_36px_-18px_rgba(15,23,42,0.38)]"
        >
          <DropdownMenuItem
            onSelect={() => setEmailReviewOpen(true)}
            className="cursor-pointer rounded-[9px] px-2.5 py-2 text-[12px] font-semibold text-[#315f57] focus:bg-[#f0f8f6] focus:text-[#125c4f]"
          >
            <Mail className="h-3.5 w-3.5 text-[#177564]" />
            Send link
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onShare?.();
              copyText(formLink, 'Link copied');
            }}
            className="cursor-pointer rounded-[9px] px-2.5 py-2 text-[12px] font-semibold text-[#315f57] focus:bg-[#f0f8f6] focus:text-[#125c4f]"
          >
            <Copy className="h-3.5 w-3.5 text-[#177564]" />
            Copy link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EmailReviewSheet
        entry={entry}
        open={emailReviewOpen}
        onClose={() => setEmailReviewOpen(false)}
        onSendInvite={sendInvite}
      />
    </>
  );
}

export function ParticipantFormShareControls({
  order,
  entries = order.eventEntries,
  onShareEntries,
  contactAction,
}: {
  order: OrderRecord;
  entries?: OrderEventEntry[];
  onShareEntries?: (entries: OrderEventEntry[]) => void;
  contactAction?: React.ReactNode;
}) {
  const [bulkEmailReviewOpen, setBulkEmailReviewOpen] = useState(false);
  const shareableEntries = getShareableFormEntries(entries);
  if (shareableEntries.length === 0 && !contactAction) return null;

  const bulkEmailCandidates = getBulkEmailCandidates(shareableEntries);
  const canEmailAll = bulkEmailCandidates.length > 0;

  return (
    <>
      <div className="mt-1 flex flex-col gap-2">
        {canEmailAll && (
          <p className="text-right text-[11px] font-medium leading-4 text-[#6a817b]">
            {bulkEmailCandidates.length} unsent form{bulkEmailCandidates.length === 1 ? '' : 's'}
          </p>
        )}
        {shareableEntries.length > 0 && (
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <SecondaryButton
              type="button"
              disabled={!canEmailAll}
              title={canEmailAll ? 'Review unsent pending forms before sending' : 'No unsent pending forms to email'}
              onClick={() => setBulkEmailReviewOpen(true)}
              className="text-[12px]"
            >
              <Send className="h-4 w-4" />
              Send all
            </SecondaryButton>
            <SecondaryButton
              type="button"
              onClick={() => copyText(
                buildBulkFormLinkMessage(order as any, shareableEntries, appOrigin()),
                'Links copied',
              )}
              className="text-[12px]"
            >
              <Copy className="h-4 w-4" />
              Copy all
            </SecondaryButton>
          </div>
        )}
        {contactAction && (
          <div className="flex justify-end">
            {contactAction}
          </div>
        )}
      </div>
      {shareableEntries.length > 0 && (
        <BulkEmailReviewSheet
          entries={bulkEmailCandidates}
          open={bulkEmailReviewOpen}
          onClose={() => setBulkEmailReviewOpen(false)}
          onSend={(draftEntries) => {
            onShareEntries?.(draftEntries);
            setBulkEmailReviewOpen(false);
            toast.success('Invites sent', {
              description: `${draftEntries.length} default PlanOut invite${draftEntries.length === 1 ? '' : 's'} sent.`,
            });
          }}
        />
      )}
    </>
  );
}

export function PassportBanner({
  entry,
  orderId,
  order,
  onRescind,
  fillAction,
  viewFormAction,
  shareActions,
  contactAction,
  isPreCheckout = false,
}: {
  entry: OrderEventEntry;
  orderId: string;
  order: OrderRecord;
  onRescind: () => void;
  fillAction?: React.ReactNode;
  viewFormAction?: React.ReactNode;
  shareActions?: React.ReactNode;
  contactAction?: React.ReactNode;
  isPreCheckout?: boolean;
}) {
  const navigate = useNavigate();
  const { generateGuestEntryQR, isDesktop, member } = useAppContext();
  const [qrOverlay, setQrOverlay] = useState<OrderQrOverlayState | null>(null);
  const isGuestAccessEntry = (entry.type === 'guest' && entry.accessPath === 'guest_qr')
    || (entry.type === 'team' && entry.accessPath === 'guest_qr');
  const isIndividualPassportEntry = (entry.type === 'guest' || entry.type === 'team') && entry.accessPath === 'passport';
  const openPassportQr = () => {
    if (isDesktop()) {
      setQrOverlay({ kind: 'passport' });
    } else {
      navigate('/passport');
    }
  };

  if (isGuestAccessEntry && entry.guestQR?.claimedAt) {
    return (
      <RegistrationStatePanel tone="ready" divider={false}>
        <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#d9ece8]">Claimed into Passport</span>
      </RegistrationStatePanel>
    );
  }

  if (isIndividualPassportEntry && entry.status === 'attached') {
    return (
      <RegistrationStatePanel tone="ready" divider={false}>
        <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#d9ece8]">
          In Passport
        </span>
      </RegistrationStatePanel>
    );
  }

  if (isGuestAccessEntry && entry.status === 'attached') {
    const openQr = () => {
      const qr = entry.guestQR?.isActive
        ? entry.guestQR
        : generateGuestEntryQR({
            orderId,
            entryId: entry.id,
            attendeeName: entry.participantName,
            eventName: entry.ticket.eventTitle,
            eventDate: entry.ticket.eventDate,
            category: entry.category,
            gate: 'Main Gate',
            buyerName: member.displayName,
          });
      if (isDesktop()) {
        setQrOverlay({ kind: 'guest', entry: entry as any, orderId, qr });
      } else {
        navigate(`/orders/${orderId}/entry/${entry.id}/guest-qr`);
      }
      return qr;
    };

    return (
      <>
        <RegistrationStatePanel
          tone="ready"
          divider={false}
          actions={(
            <>
              {viewFormAction}
              {!isPreCheckout && (
                <PrimaryButton
                  type="button"
                  onClick={openQr}
                  compact
                  className="text-[12px]"
                >
                  {entry.guestQR?.isActive ? 'View QR' : 'Generate & send QR'}
                </PrimaryButton>
              )}
            </>
          )}
        >
          <span className="inline-flex w-fit rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#d9ece8]">
            {isPreCheckout ? 'Ready for payment' : entry.guestQR?.isActive ? 'QR sent' : 'Guest QR ready'}
          </span>
          <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#315f57]">Ready to share · no app required.</p>
        </RegistrationStatePanel>
        <OrderQrOverlay state={qrOverlay} onClose={() => setQrOverlay(null)} />
      </>
    );
  }

  if (entry.status === 'attached') {
    return (
      <>
        <RegistrationStatePanel
          tone="ready"
          divider={false}
          actions={(
            <>
              {viewFormAction}
              {!isPreCheckout && (
                <PrimaryButton
                  type="button"
                  onClick={openPassportQr}
                  compact
                  className="text-[12px]"
                >
                  View QR
                </PrimaryButton>
              )}
            </>
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex w-fit rounded-full bg-[#e4f4ef] px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#cfe3de]">
              {isPreCheckout ? 'Ready' : 'Ready for gate'}
            </span>
            <span className="text-[11px] font-medium text-[#7b8b9a]">PlanOut Passport</span>
          </div>
        </RegistrationStatePanel>
        <OrderQrOverlay state={qrOverlay} onClose={() => setQrOverlay(null)} />
      </>
    );
  }

  if (entry.status === 'resubmit_required') {
    return (
      <RegistrationStatePanel
        tone="warning"
        divider={false}
        actions={(
          <>
            <PrimaryButton
              type="button"
              onClick={() => navigate(`/forms/${entry.id}/diff`)}
              compact
              className="text-[12px]"
            >
              Review changes
            </PrimaryButton>
            {contactAction}
          </>
        )}
      >
        <p className="text-[13px] font-semibold text-[#c2410c]">
          Form update required - review and resubmit
        </p>
      </RegistrationStatePanel>
    );
  }

  if (entry.status === 'released') {
    return (
      <RegistrationStatePanel
        tone="danger"
        divider={false}
        actions={(
          <PrimaryButton
            type="button"
            onClick={() => navigate(`/events/${entry.ticket.eventId}`)}
            compact
            className="text-[12px]"
          >
            Check if slots available
          </PrimaryButton>
        )}
      >
        <p className="text-[13px] font-semibold text-[#b42318]">
          Spot released — form deadline missed
        </p>
        <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#991b1b]">
          The registration form was not submitted before {entry.ticket.deadline || entry.ticket.eventDate}. Your reserved spot has been returned to inventory. No refund is issued for released spots.
        </p>
      </RegistrationStatePanel>
    );
  }

  const isInvitedEntry = (entry.inviteStatus === 'invited' || entry.queueEntry?.inviteStatus === 'invited')
    && entry.status !== 'attached';

  if (isInvitedEntry) {
    return (
      <ClaimLinkStatePanel
        entry={entry}
        order={order}
        compact
        divider={false}
        compactDetail={(
          <p className="mt-1 text-[11px] font-medium text-[#516173]">
            Claim link sent {entry.attendeeEmail ? `to ${entry.attendeeEmail}` : ''}
          </p>
        )}
        onRescind={onRescind}
      />
    );
  }

  return (
    <RegistrationStatePanel
      tone="warning"
      divider={false}
      actions={(
        <>
          {fillAction}
          {shareActions}
          {contactAction}
        </>
      )}
    >
      <p className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="inline-flex w-fit rounded-full bg-[#fff3c4] px-2.5 py-1 font-semibold text-[#8a5a08] ring-1 ring-[#edd377]">
          {entry.type === 'team' ? 'Player entry needed' : isPreCheckout ? 'Required before payment' : 'Form needed'}
        </span>
        <span className="font-medium text-[#8a7760]">· {isPreCheckout ? 'Fill up or send claim link' : entryReason(entry.status)}</span>
      </p>
    </RegistrationStatePanel>
  );
}

export function RegistrationItem({
  entry,
  orderId,
  order,
  teamEntries = [],
  onContactOrganizer,
  isPreCheckout = false,
  onFill,
}: {
  entry: OrderEventEntry;
  orderId: string;
  order: OrderRecord;
  teamEntries?: OrderEventEntry[];
  onContactOrganizer?: () => void;
  isPreCheckout?: boolean;
  onFill?: (entry: OrderEventEntry) => void;
}) {
  const navigate = useNavigate();
  const { rescindRegistrationInvite, sendRegistrationInvite } = useAppContext();

  if (entry.type === 'team') {
    return (
      <TeamRegistrationItem
        entry={entry}
        order={order}
        teamEntries={teamEntries}
        onContactOrganizer={onContactOrganizer}
        isPreCheckout={isPreCheckout}
        onFill={onFill}
      />
    );
  }

  const canSharePendingForm = entry.status !== 'attached'
    && entry.status !== 'released'
    && entry.status !== 'no_show'
    && entry.inviteStatus !== 'invited';
  const isShareable = canSharePendingForm && (
    entry.type === 'self'
    || getShareableFormEntries([entry]).length > 0
  );
  const isGuestWithoutBuyer = entry.type === 'guest' && !entry.buyerAttending;
  const isUnassignedGuest = entry.type === 'guest' && entry.inviteStatus === 'not_invited';
  const isBuyerFillRequired = entry.type === 'guest'
    && entry.status !== 'attached'
    && entry.accessPath !== 'passport'
    && entry.accessPath !== 'guest_qr'
    && entry.inviteStatus !== 'invited'
    && (isGuestWithoutBuyer || isUnassignedGuest);
  const participantQuery = entry.participantId
    ? `&participantId=${encodeURIComponent(entry.participantId)}&playerOnly=1`
    : '';
  const returnParam = isPreCheckout ? 'checkout' : 'order';
  const actionTarget = `/orders/${entry.ticket.id}/form?returnTo=${returnParam}&entryId=${encodeURIComponent(entry.queueEntry?.id || entry.id)}${participantQuery}${isBuyerFillRequired ? '&buyerFill=1' : ''}`;

  const handleFill = () => {
    if (onFill) {
      onFill(entry);
    } else {
      navigate(actionTarget);
    }
  };

  return (
    <RegistrationItemShell title={entry.entryName} date={entry.ticket.eventDate} location={entry.ticket.eventLocation} image={entry.ticket.image}>
      <div className="px-4 pb-1 sm:px-5">
        <PassportBanner
          entry={entry}
          orderId={orderId}
          order={order}
          isPreCheckout={isPreCheckout}
          onRescind={() => {
            rescindRegistrationInvite(entry.queueEntry?.id || entry.id);
            toast.success('Claim link revoked');
          }}
          fillAction={(
            <SecondaryButton
              type="button"
              onClick={handleFill}
              compact
              className="text-[11px]"
            >
              Fill up
            </SecondaryButton>
          )}
          viewFormAction={(
            <SecondaryButton
              type="button"
              onClick={handleFill}
              compact
              className="text-[11px]"
            >
              View form
            </SecondaryButton>
          )}
          contactAction={onContactOrganizer ? (
            <ContactOrganizerButton
              onClick={onContactOrganizer}
              className="text-[11px]"
            />
          ) : undefined}
          shareActions={isShareable ? (
            <ParticipantFormLinkActions
              entry={entry}
              order={order}
              compact
              primary={entry.type === 'guest'}
              onShare={(recipient) => sendRegistrationInvite(
                entry.queueEntry?.id || entry.id,
                recipient,
                entry.queueEntry || registrationQueueFallback(entry, order),
              )}
            />
          ) : undefined}
        />
      </div>
    </RegistrationItemShell>
  );
}

export function TeamRegistrationSectionContent({
  entry,
  order,
  teamEntries,
  onContactOrganizer,
  isPreCheckout = false,
  onFill,
}: {
  entry: OrderEventEntry;
  order: OrderRecord;
  teamEntries: OrderEventEntry[];
  onContactOrganizer?: () => void;
  isPreCheckout?: boolean;
  onFill?: (entry: OrderEventEntry) => void;
}) {
  const navigate = useNavigate();
  const {
    generateGuestEntryQR,
    isDesktop,
    member,
    teamPlayerRoster,
    setTeamPlayerRoster,
    setTeamPlayerAccess,
  } = useAppContext();
  const [removeParticipantId, setRemoveParticipantId] = useState<string | null>(null);
  const [qrOverlay, setQrOverlay] = useState<OrderQrOverlayState | null>(null);
  const summary = getTeamOrderSummary(teamEntries);
  const maxPlayers = entry.ticket.maxParticipants ?? teamEntries.length;
  const minPlayers = entry.ticket.minParticipants ?? 1;
  const canAddPlayer = canAddTeamPlayer(teamEntries.length, maxPlayers);
  const teamRoster = teamPlayerRoster[entry.ticket.id] || entry.ticket.participants;
  const playerToRemove = removeParticipantId
    ? teamEntries.find((playerEntry) => playerEntry.participantId === removeParticipantId)
    : undefined;

  const openPlayerForm = (playerEntry: OrderEventEntry) => {
    if (!playerEntry.participantId) return;
    if (onFill) {
      onFill(playerEntry);
      return;
    }
    const returnParam = isPreCheckout ? 'checkout' : 'order';
    navigate(`/orders/${playerEntry.ticket.id}/form?returnTo=${returnParam}&participantId=${encodeURIComponent(playerEntry.participantId)}&playerOnly=1`);
  };

  const openPlayerGuestQr = (playerEntry: OrderEventEntry) => {
    const qr = playerEntry.guestQR?.isActive
      ? playerEntry.guestQR
      : generateGuestEntryQR({
          orderId: entry.ticket.id,
          entryId: playerEntry.id,
          attendeeName: playerEntry.participantName,
          eventName: playerEntry.ticket.eventTitle,
          eventDate: playerEntry.ticket.eventDate,
          category: playerEntry.category,
          gate: 'Main Gate',
          buyerName: member.displayName,
        });

    if (isDesktop()) {
      setQrOverlay({ kind: 'guest', entry: playerEntry as any, orderId: entry.ticket.id, qr });
    } else {
      navigate(`/orders/${entry.ticket.id}/entry/${playerEntry.id}/guest-qr`);
    }
  };

  const openPlayerPassportQr = () => {
    if (isDesktop()) {
      setQrOverlay({ kind: 'passport' });
    } else {
      navigate('/passport');
    }
  };

  const unsendPlayerInvite = (playerEntry: OrderEventEntry) => {
    const participantId = playerEntry.participantId;
    if (!participantId) return;

    const ticketId = playerEntry.ticket.id;
    const roster = teamPlayerRoster[ticketId] || playerEntry.ticket.participants;
    const nextRoster = roster.map((participant) => (
      participant.id === participantId
        ? unsendTeamPlayerInvite(participant)
        : participant
    ));

    setTeamPlayerRoster(ticketId, nextRoster);
    setTeamPlayerAccess(ticketId, participantId, 'pending');
  };

  const sharePlayerInvite = (playerEntry: OrderEventEntry, recipient?: string) => {
    if (!playerEntry.participantId) return;
    const ticketId = playerEntry.ticket.id;
    const roster = teamPlayerRoster[ticketId] || playerEntry.ticket.participants;
    const nextRoster = roster.map((participant) => (
      participant.id === playerEntry.participantId
        ? shareTeamPlayerInvite(participant, recipient)
        : participant
    ));
    setTeamPlayerRoster(ticketId, nextRoster);
    setTeamPlayerAccess(ticketId, playerEntry.participantId, 'pending');
  };

  const sharePlayerInvites = (draftEntries: OrderEventEntry[]) => {
    const ticketId = entry.ticket.id;
    const roster = teamPlayerRoster[ticketId] || entry.ticket.participants;
    const recipients = new Map(draftEntries.map((draft) => [draft.participantId, draft.attendeeEmail]));
    setTeamPlayerRoster(ticketId, roster.map((participant) => (
      recipients.has(participant.id)
        ? shareTeamPlayerInvite(participant, recipients.get(participant.id))
        : participant
    )));
    draftEntries.forEach((draft) => {
      if (draft.participantId) setTeamPlayerAccess(ticketId, draft.participantId, 'pending');
    });
  };

  const addPlayerSlot = () => {
    if (!canAddPlayer) return;

    const ticketId = entry.ticket.id;
    const roster = teamPlayerRoster[ticketId] || entry.ticket.participants;
    const newPlayer = createTeamPlayerSlot(ticketId, roster);
    setTeamPlayerRoster(ticketId, [...roster, newPlayer]);
  };

  const canRemovePlayer = (playerEntry: OrderEventEntry) => {
    const participant = teamRoster.find((candidate) => candidate.id === playerEntry.participantId);
    return Boolean(participant && canRemoveTeamPlayer({
      participantCount: teamRoster.length,
      minParticipants: minPlayers,
      formStatus: participant.formStatus,
      inviteStatus: participant.inviteStatus,
      sentToEmail: participant.sentToEmail,
      isPrimary: participant.isPrimary,
    }));
  };

  const removePlayerSlot = () => {
    if (!removeParticipantId) return;

    const nextRoster = removeTeamPlayerSlot(teamRoster, removeParticipantId, {
      minParticipants: minPlayers,
    });
    if (nextRoster.length === teamRoster.length) return;

    setTeamPlayerRoster(entry.ticket.id, nextRoster);
    setRemoveParticipantId(null);
    toast.success('Player entry removed');
  };

  if (!summary) return null;

  return (
    <>
      <section className="px-4 pt-3.5 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#e4f4ef] text-[#177564]">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold tracking-[-0.2px] text-[#163d37]">Team Roster</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
              <p className="text-[15px] font-semibold tracking-[-0.3px] text-[#315f57]">{summary.setUpCount} of {summary.totalCount} ready</p>
              {!canAddPlayer && <span className="text-[11px] font-semibold text-[#7b8b9a]">Full</span>}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#315f57]">
          Fill for Guest QR, or send a link to their Passport.
        </p>
        <div
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#dcebe7]"
          role="progressbar"
          aria-label={`${summary.setUpCount} of ${summary.totalCount} player entries set up`}
          aria-valuemin={0}
          aria-valuemax={summary.totalCount}
          aria-valuenow={summary.setUpCount}
        >
          <span
            className="block h-full rounded-full bg-[#177564]"
            style={{ width: `${summary.totalCount ? (summary.setUpCount / summary.totalCount) * 100 : 0}%` }}
          />
        </div>
        <ParticipantFormShareControls
          order={order}
          entries={teamEntries}
          onShareEntries={sharePlayerInvites}
          contactAction={onContactOrganizer ? (
            <ContactOrganizerButton
              onClick={onContactOrganizer}
              className="text-[11px]"
            />
          ) : undefined}
        />
      </section>

      <div className="mt-3 border-t border-[#e2eee9] px-4 sm:px-5">
        {teamEntries.map((playerEntry, index) => {
          const hasGuestQr = playerEntry.accessPath === 'guest_qr' && playerEntry.status === 'attached';
          const hasPassport = playerEntry.accessPath === 'passport' && playerEntry.status === 'attached';
          const hasPendingInvite = playerEntry.inviteStatus === 'invited';
          const isBuyerPlayer = playerEntry.passportMemberId === member.memberId;
          const playerName = isBuyerPlayer
            ? member.displayName || playerEntry.participantLabel || playerEntry.participantName || `Player ${index + 1}`
            : playerEntry.participantLabel || playerEntry.participantName || `Player ${index + 1}`;
          const isFormNeeded = !hasGuestQr && !hasPassport && !hasPendingInvite && playerEntry.status !== 'attached';
          const playerState = hasGuestQr
            ? 'Guest QR'
            : hasPassport
              ? 'In Passport'
              : hasPendingInvite
                ? 'Sent'
                : playerEntry.status === 'attached'
                  ? 'Ready'
                  : 'Form needed';
          const playerDisplayName = isBuyerPlayer ? 'You' : playerEntry.passportDisplayName || playerEntry.participantName;
          const playerDetail = hasPendingInvite
            ? (playerEntry.attendeeEmail || 'Recipient')
            : playerDisplayName && playerDisplayName !== playerName
            ? `${playerDisplayName} · ${playerState}`
            : playerState;
          const canRemove = canRemovePlayer(playerEntry);

          if (hasPendingInvite) {
            return (
              <ClaimLinkStatePanel
                key={playerEntry.id}
                entry={playerEntry}
                order={order}
                compact
                title={playerName}
                compactDetail={(
                  <p className="mt-1 truncate text-[11px] font-medium text-[#516173]">
                    {playerEntry.attendeeEmail || 'Recipient'} · Claim link sent
                  </p>
                )}
                onRescind={() => {
                  unsendPlayerInvite(playerEntry);
                  toast.success('Claim link revoked');
                }}
              />
            );
          }

          return (
            <RegistrationStatePanel
              key={playerEntry.id}
              tone={isFormNeeded ? 'warning' : 'ready'}
              cornerAction={canRemove ? (
                <IconButton
                  type="button"
                  size="sm"
                  aria-label={`Remove ${playerName}`}
                  title="Remove player entry"
                  onClick={() => setRemoveParticipantId(playerEntry.participantId || null)}
                  className="text-[#94a3b8] hover:border-[#f0c4c0] hover:bg-[#fff7f5] hover:text-[#b42318]"
                >
                  <X className="h-3.5 w-3.5" />
                </IconButton>
              ) : null}
              actions={(
                <>
                  {hasGuestQr ? (
                    <>
                      <SecondaryButton
                        type="button"
                        compact
                        onClick={() => openPlayerForm(playerEntry)}
                        className="text-[11px]"
                      >
                        View form
                      </SecondaryButton>
                      {!isPreCheckout && (
                        <PrimaryButton
                          type="button"
                          onClick={() => openPlayerGuestQr(playerEntry)}
                          compact
                          className="text-[11px]"
                        >
                          View QR
                        </PrimaryButton>
                      )}
                    </>
                  ) : hasPassport && isBuyerPlayer ? (
                    <>
                      <SecondaryButton
                        type="button"
                        compact
                        onClick={() => openPlayerForm(playerEntry)}
                        className="text-[11px]"
                      >
                        View form
                      </SecondaryButton>
                      {!isPreCheckout && (
                        <PrimaryButton
                          type="button"
                          onClick={openPlayerPassportQr}
                          compact
                          className="text-[11px]"
                        >
                          View QR
                        </PrimaryButton>
                      )}
                    </>
                  ) : playerEntry.status !== 'attached' ? (
                    <>
                      <SecondaryButton
                        type="button"
                        compact
                        onClick={() => openPlayerForm(playerEntry)}
                        className="text-[11px]"
                      >
                        Fill up
                      </SecondaryButton>
                      <ParticipantFormLinkActions
                        entry={playerEntry}
                        order={order}
                        compact
                        primary={!isBuyerPlayer}
                        onShare={(recipient) => sharePlayerInvite(playerEntry, recipient)}
                      />
                    </>
                  ) : (
                    <SecondaryButton
                      type="button"
                      compact
                      onClick={() => openPlayerForm(playerEntry)}
                      className="text-[11px]"
                    >
                      View form
                    </SecondaryButton>
                  )}
                </>
              )}
            >
              <p className="truncate text-[12.5px] font-semibold text-[#181d27]">{playerName}</p>
              <div className="mt-1 flex min-w-0 items-center gap-1.5">
                {hasPassport || hasGuestQr || playerEntry.status === 'attached' ? (
                  <Check className="h-3 w-3 shrink-0 text-[#177564]" />
                ) : null}
                <p className={isFormNeeded
                  ? 'inline-flex w-fit max-w-full truncate rounded-full bg-[#fff7d6] px-2 py-0.5 text-[11px] font-semibold text-[#8a5b08] ring-1 ring-[#efd68b]'
                  : 'truncate text-[11px] font-medium text-[#516173]'}
                >{playerDetail}</p>
              </div>
            </RegistrationStatePanel>
          );
        })}
      </div>

      {canAddPlayer && (
        <SecondaryButton
          type="button"
          onClick={addPlayerSlot}
          compact
          className="mx-4 mb-4 mt-2 w-[calc(100%-2rem)] border-dashed border-[#b7ded6] bg-[#f8fdfc] text-[12px] hover:bg-[#ecfdf8] focus-visible:ring-2 focus-visible:ring-[#177564]/30 sm:mx-5 sm:w-[calc(100%-2.5rem)]"
        >
          <UserPlus className="h-4 w-4" />
          Add player
        </SecondaryButton>
      )}

      {playerToRemove && (
        <ConfirmDialog
          open
          onOpenChange={(open) => {
            if (!open) setRemoveParticipantId(null);
          }}
          title="Remove player entry?"
          description={(
            <>
              Remove <span className="font-semibold text-[#181d27]">{playerToRemove.participantLabel || `Player ${teamEntries.indexOf(playerToRemove) + 1}`}</span> from this purchase before sending their access?
            </>
          )}
          icon={<Trash2 className="h-6 w-6" />}
          iconVariant="destructive"
          confirmLabel="Remove"
          variant="destructive"
          onConfirm={removePlayerSlot}
        />
      )}
      <OrderQrOverlay state={qrOverlay} onClose={() => setQrOverlay(null)} />
    </>
  );
}

export function TeamRegistrationItem({
  entry,
  order,
  teamEntries,
  onContactOrganizer,
  isPreCheckout = false,
  onFill,
}: {
  entry: OrderEventEntry;
  order: OrderRecord;
  teamEntries: OrderEventEntry[];
  onContactOrganizer?: () => void;
  isPreCheckout?: boolean;
  onFill?: (entry: OrderEventEntry) => void;
}) {
  const summary = getTeamOrderSummary(teamEntries);
  if (!summary) return null;

  return (
    <RegistrationItemShell title={summary.title} date={entry.ticket.eventDate} location={entry.ticket.eventLocation} image={entry.ticket.image}>
      <TeamRegistrationSectionContent
        entry={entry}
        order={order}
        teamEntries={teamEntries}
        onContactOrganizer={onContactOrganizer}
        isPreCheckout={isPreCheckout}
        onFill={onFill}
      />
    </RegistrationItemShell>
  );
}

// ===========================================================================
// GROUPED REGISTRATION BY EVENT > TICKET TYPE
// ===========================================================================

export interface TicketTypeGroup {
  ticketTypeId: string;
  ticketTypeName: string;
  category: string;
  ticketType: 'single' | 'team' | 'multiple';
  price: number;
  ticket: MyTicket;
  entries: OrderEventEntry[];
}

export interface EventRegistrationGroup {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  image?: string;
  organizer?: string;
  brand?: string;
  ticketTypeGroups: TicketTypeGroup[];
  totalEntriesCount: number;
  completedEntriesCount: number;
}

export function groupRegistrationEntriesByEventAndTicketType(
  entries: OrderEventEntry[]
): EventRegistrationGroup[] {
  const eventMap = new Map<string, EventRegistrationGroup>();

  entries.forEach((entry) => {
    const eventTitle = entry.ticket?.eventTitle?.trim() || 'Event';
    const eventId = entry.ticket?.eventId || eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const eventKey = eventTitle.toLowerCase().replace(/\s+/g, ' ').trim();

    let eventGroup = eventMap.get(eventKey);
    if (!eventGroup) {
      eventGroup = {
        eventId,
        eventTitle,
        eventDate: entry.ticket?.eventDate || '',
        eventLocation: entry.ticket?.eventLocation,
        image: entry.ticket?.image,
        organizer: entry.ticket?.organizer,
        brand: entry.ticket?.brand,
        ticketTypeGroups: [],
        totalEntriesCount: 0,
        completedEntriesCount: 0,
      };
      eventMap.set(eventKey, eventGroup);
    }

    eventGroup.totalEntriesCount += 1;
    if (entry.status === 'attached' || entry.accessPath === 'passport' || entry.accessPath === 'guest_qr') {
      eventGroup.completedEntriesCount += 1;
    }

    const ticketTypeName = (entry.category || entry.ticket?.ticketTypeName || entry.ticket?.labels?.[0] || 'Standard Entry').trim();
    const ticketTypeKey = ticketTypeName.toLowerCase().replace(/\s+/g, ' ').trim();

    let ticketTypeGroup = eventGroup.ticketTypeGroups.find(
      (ttg) => ttg.ticketTypeId === ticketTypeKey
    );

    if (!ticketTypeGroup) {
      ticketTypeGroup = {
        ticketTypeId: ticketTypeKey,
        ticketTypeName,
        category: entry.category,
        ticketType: entry.type === 'team' ? 'team' : (entry.ticket?.ticketType || 'single'),
        price: entry.price || 0,
        ticket: entry.ticket,
        entries: [],
      };
      eventGroup.ticketTypeGroups.push(ticketTypeGroup);
    }

    ticketTypeGroup.entries.push(entry);
  });

  return Array.from(eventMap.values());
}

export function RegistrationEntryRow({
  entry,
  slotIndex,
  totalSlotsInType,
  orderId,
  order,
  isPreCheckout = false,
  onContactOrganizer,
  onFill,
}: {
  entry: OrderEventEntry;
  slotIndex: number;
  totalSlotsInType: number;
  orderId: string;
  order: OrderRecord;
  isPreCheckout?: boolean;
  onContactOrganizer?: () => void;
  onFill?: (entry: OrderEventEntry) => void;
}) {
  const navigate = useNavigate();
  const { rescindRegistrationInvite, sendRegistrationInvite, isDesktop } = useAppContext();
  const [qrOverlay, setQrOverlay] = useState<OrderQrOverlayState | null>(null);

  const canSharePendingForm = entry.status !== 'attached'
    && entry.status !== 'released'
    && entry.status !== 'no_show'
    && entry.inviteStatus !== 'invited';
  const isShareable = canSharePendingForm && (
    entry.type === 'self'
    || getShareableFormEntries([entry]).length > 0
  );
  const isGuestWithoutBuyer = entry.type === 'guest' && !entry.buyerAttending;
  const isUnassignedGuest = entry.type === 'guest' && entry.inviteStatus === 'not_invited';
  const isBuyerFillRequired = entry.type === 'guest'
    && entry.status !== 'attached'
    && entry.accessPath !== 'passport'
    && entry.accessPath !== 'guest_qr'
    && entry.inviteStatus !== 'invited'
    && (isGuestWithoutBuyer || isUnassignedGuest);
  const participantQuery = entry.participantId
    ? `&participantId=${encodeURIComponent(entry.participantId)}&playerOnly=1`
    : '';
  const returnParam = isPreCheckout ? 'checkout' : 'order';
  const actionTarget = `/orders/${entry.ticket.id}/form?returnTo=${returnParam}&entryId=${encodeURIComponent(entry.queueEntry?.id || entry.id)}${participantQuery}${isBuyerFillRequired ? '&buyerFill=1' : ''}`;

  const handleFill = () => {
    if (onFill) {
      onFill(entry);
    } else {
      navigate(actionTarget);
    }
  };

  const handleViewQr = () => {
    if (entry.accessPath === 'passport') {
      if (isDesktop()) {
        setQrOverlay({ kind: 'passport' });
      } else {
        navigate('/passport');
      }
    } else {
      if (isDesktop()) {
        setQrOverlay({ kind: 'guest', entry: entry as any, orderId: entry.ticket.id, qr: entry.guestQR });
      } else {
        navigate(`/orders/${entry.ticket.id}/entry/${entry.id}/guest-qr`);
      }
    }
  };

  const isSelf = entry.type === 'self';
  const slotNumber = slotIndex + 1;
  const slotBadge = totalSlotsInType > 1
    ? (isSelf ? `Slot ${slotNumber} (Buyer)` : `Slot ${slotNumber}`)
    : (isSelf ? 'Buyer' : 'Participant');

  let displayName = entry.participantName;
  if (!displayName || displayName.includes(entry.category)) {
    displayName = isSelf ? (entry.queueEntry?.personName || 'Jessica Sanchez') : `Guest ${totalSlotsInType > 1 ? slotIndex : 1}`;
  }

  return (
    <>
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col gap-1 hover:bg-[#fafcfb] transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#181d27]">
              {displayName}
            </span>
            <span className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[10.5px] font-semibold text-[#64748b]">
              {slotBadge}
            </span>
          </div>
        </div>

        <PassportBanner
          entry={entry}
          orderId={orderId}
          order={order}
          isPreCheckout={isPreCheckout}
          onRescind={() => {
            rescindRegistrationInvite(entry.queueEntry?.id || entry.id);
            toast.success('Claim link revoked');
          }}
          fillAction={(
            <SecondaryButton
              type="button"
              onClick={handleFill}
              compact
              className="text-[11px]"
            >
              Fill up
            </SecondaryButton>
          )}
          viewFormAction={(
            <SecondaryButton
              type="button"
              onClick={handleFill}
              compact
              className="text-[11px]"
            >
              View form
            </SecondaryButton>
          )}
          viewQrAction={(
            <PrimaryButton
              type="button"
              onClick={handleViewQr}
              compact
              className="text-[11px]"
            >
              View QR
            </PrimaryButton>
          )}
          contactAction={onContactOrganizer ? (
            <ContactOrganizerButton
              onClick={onContactOrganizer}
              className="text-[11px]"
            />
          ) : undefined}
          shareActions={isShareable ? (
            <ParticipantFormLinkActions
              entry={entry}
              order={order}
              compact
              primary={entry.type === 'guest'}
              onShare={(recipient) => sendRegistrationInvite(
                entry.queueEntry?.id || entry.id,
                recipient,
                entry.queueEntry || registrationQueueFallback(entry, order),
              )}
            />
          ) : undefined}
        />
      </div>

      {qrOverlay && (
        <OrderQrOverlay
          state={qrOverlay}
          onClose={() => setQrOverlay(null)}
        />
      )}
    </>
  );
}

export function TicketTypeRegistrationSection({
  ticketTypeGroup,
  order,
  allEntries,
  isPreCheckout = false,
  onContactOrganizer,
  onFill,
}: {
  ticketTypeGroup: TicketTypeGroup;
  order: OrderRecord;
  allEntries: OrderEventEntry[];
  isPreCheckout?: boolean;
  onContactOrganizer?: (entry: OrderEventEntry) => void;
  onFill?: (entry: OrderEventEntry) => void;
}) {
  const isTeam = ticketTypeGroup.ticketType === 'team';
  const entryCount = ticketTypeGroup.entries.length;

  return (
    <div className="flex flex-col">
      {/* ── Ticket Type Subheader ── */}
      <div className="px-4 py-2.5 sm:px-5 bg-[#f8fafc] border-b border-[#edf2f0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#eef8f5] text-[#177564]">
            {isTeam ? <Users className="h-3 w-3" /> : <Tag className="h-3 w-3" />}
          </span>
          <span className="text-[13px] font-semibold tracking-[-0.2px] text-[#344054] truncate">
            {ticketTypeGroup.ticketTypeName}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#64748b] ring-1 ring-slate-200/80 shadow-2xs">
            {isTeam ? 'Team Entry' : `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`}
          </span>
        </div>
      </div>

      {/* ── Entries List under this Ticket Type ── */}
      {isTeam ? (
        <TeamRegistrationSectionContent
          entry={ticketTypeGroup.entries[0]}
          order={order}
          teamEntries={allEntries.filter(
            (e) => e.type === 'team' && e.ticket.id === ticketTypeGroup.ticket.id
          )}
          onContactOrganizer={
            onContactOrganizer ? () => onContactOrganizer(ticketTypeGroup.entries[0]) : undefined
          }
          isPreCheckout={isPreCheckout}
          onFill={onFill}
        />
      ) : (
        <div className="divide-y divide-[#f1f5f9]">
          {ticketTypeGroup.entries.map((entry, index) => (
            <RegistrationEntryRow
              key={entry.id}
              entry={entry}
              slotIndex={index}
              totalSlotsInType={entryCount}
              orderId={order.id}
              order={order}
              isPreCheckout={isPreCheckout}
              onContactOrganizer={onContactOrganizer ? () => onContactOrganizer(entry) : undefined}
              onFill={onFill}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function EventRegistrationGroupCard({
  eventGroup,
  order,
  allEntries,
  isPreCheckout = false,
  onContactOrganizer,
  onFill,
}: {
  eventGroup: EventRegistrationGroup;
  order: OrderRecord;
  allEntries: OrderEventEntry[];
  isPreCheckout?: boolean;
  onContactOrganizer?: (entry: OrderEventEntry) => void;
  onFill?: (entry: OrderEventEntry) => void;
}) {
  const formattedDate = formatEventDate(eventGroup.eventDate, { month: 'long' });
  const isAllReady = eventGroup.completedEntriesCount >= eventGroup.totalEntriesCount && eventGroup.totalEntriesCount > 0;

  return (
    <article className="rounded-[20px] border border-[#d5e3df] bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,0.35)] overflow-hidden">
      {/* ── Event Level Header ── */}
      <header className="px-4 py-3.5 sm:px-5 sm:py-4 bg-gradient-to-r from-[#fbfdfc] to-white border-b border-[#e9f0ee] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {eventGroup.image && (
            <ImageWithFallback
              src={eventGroup.image}
              alt=""
              className="size-11 sm:size-12 shrink-0 rounded-[12px] object-cover ring-1 ring-black/5 shadow-xs"
            />
          )}
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[15px] sm:text-[16px] font-semibold tracking-[-0.2px] text-[#181d27]">
              {eventGroup.eventTitle}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] sm:text-[12px] font-medium text-[#64748b]">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5 shrink-0 text-[#8a9bb1]" />
                <span>{formattedDate}</span>
              </span>
              {eventGroup.eventLocation && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5 shrink-0 text-[#8a9bb1]" />
                  <span className="line-clamp-1">{eventGroup.eventLocation}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isAllReady
                ? 'bg-[#e4f4ef] text-[#177564] ring-1 ring-[#cfe3de]'
                : 'bg-[#fff3c4] text-[#8a5a08] ring-1 ring-[#edd377]'
            }`}
          >
            {isAllReady
              ? (isPreCheckout ? 'Ready' : 'Ready for gate')
              : `${eventGroup.completedEntriesCount} of ${eventGroup.totalEntriesCount} ready`}
          </span>
        </div>
      </header>

      {/* ── Ticket Type Groups ── */}
      <div className="divide-y divide-[#e9f0ee]">
        {eventGroup.ticketTypeGroups.map((ticketTypeGroup) => (
          <TicketTypeRegistrationSection
            key={ticketTypeGroup.ticketTypeId}
            ticketTypeGroup={ticketTypeGroup}
            order={order}
            allEntries={allEntries}
            isPreCheckout={isPreCheckout}
            onContactOrganizer={onContactOrganizer}
            onFill={onFill}
          />
        ))}
      </div>
    </article>
  );
}

export function GroupedRegistrationList({
  order,
  entries,
  isPreCheckout = false,
  onContactOrganizer,
  onFill,
}: {
  order: OrderRecord;
  entries: OrderEventEntry[];
  isPreCheckout?: boolean;
  onContactOrganizer?: (entry: OrderEventEntry) => void;
  onFill?: (entry: OrderEventEntry) => void;
}) {
  const eventGroups = useMemo(
    () => groupRegistrationEntriesByEventAndTicketType(entries),
    [entries]
  );

  return (
    <div className="flex flex-col gap-4" data-testid="grouped-registration-list">
      {eventGroups.map((eventGroup) => (
        <EventRegistrationGroupCard
          key={eventGroup.eventId}
          eventGroup={eventGroup}
          order={order}
          allEntries={entries}
          isPreCheckout={isPreCheckout}
          onContactOrganizer={onContactOrganizer}
          onFill={onFill}
        />
      ))}
    </div>
  );
}

