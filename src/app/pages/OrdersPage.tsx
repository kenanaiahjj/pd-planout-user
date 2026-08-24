import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Check,
  CalendarDays,
  Circle,
  Copy,
  Download,
  HelpCircle,
  Mail,
  MapPin,
  RotateCcw,
  Share2,
  Send,
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
  MY_TICKETS,
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
import {
  OrderPaymentSummary,
  formatOrderMoney,
} from '@/app/components/OrderDetailBlocks';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import { IconButton } from '@/app/components/IconButton';
import { SegmentedChoice } from '@/app/components/SegmentedChoice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { OrderCover, type OrderCoverItem } from '@/app/components/OrderCover';
import { OrderStatusLabel } from '@/app/components/OrderStatusLabel';
import {
  ContactOrganizerButton,
  OrganizerContactWidget,
  type ContactTarget,
} from '@/app/components/OrganizerContactWidget';
import {
  getOrderEventLineItems,
  getOrderEventSubtotal,
  getOrderRegistrationEntries,
  getTeamOrderSummary,
} from '@/app/data/orderPricing.js';
import {
  buildBulkFormLinkMessage,
  buildParticipantFormLink,
  getBulkEmailCandidates,
  getShareableFormEntries,
  groupBulkEmailEntriesByEvent,
} from '@/app/data/formLinks.js';
import { alpha, getEventBrand, PLANOUT_EVENT_BRAND } from '@/app/data/eventBrand';
import { formatEventDate, formatEventDateOnly } from '@/app/data/eventDate.js';
import { getOrganizerBySlug } from '@/app/data/organizers';

type OrderFilter = 'all' | 'pending' | 'complete';
type MerchStatus = 'Processing' | 'Shipped' | 'Delivered';
type PaymentStatus = 'Paid' | 'Refunded';

interface OrganizerContactSelection {
  contact: ContactTarget;
  contextSummary: string;
}

const TEMPORARILY_HIDDEN_ORDER_IDS = new Set(['ord-gear-001']);

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

export function isManagedGuestEntry(entry: OrderEventEntry) {
  return (entry.type === 'guest' && entry.accessPath !== 'passport')
    || (entry.type === 'team' && (entry.accessPath === 'pending' || entry.accessPath === 'guest_qr'));
}

export interface MerchItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  status: MerchStatus;
  image?: string;
  trackingNumber?: string;
  dates: Partial<Record<'confirmed' | 'processing' | 'shipped' | 'delivered', string>>;
}

export interface OrderRecord {
  id: string;
  ref: string;
  date: string;
  name: string;
  eventEntries: OrderEventEntry[];
  merchItems: MerchItem[];
  paymentStatus: PaymentStatus;
  refunded?: {
    amount: number;
    date: string;
    method: string;
    neverAttached?: boolean;
  };
  paymentMethod: string;
  paymentDate: string;
  fees: number;
  image?: string;
}

function registrationQueueFallback(entry: OrderEventEntry, order: OrderRecord): RegistrationQueueEntry {
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

function formatMoney(value: number) {
  return formatOrderMoney(value);
}

function parseOrderDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function getTicketPrice(ticket: MyTicket) {
  if (ticket.ticketType === 'team') return 5200;
  if (ticket.labels.some((label) => /triathlon|elite/i.test(label))) return 3500;
  if (ticket.labels.some((label) => /music|festival/i.test(label))) return 1800;
  if (ticket.labels.some((label) => /yoga|wellness/i.test(label))) return 1200;
  return 1500;
}

function isPendingStatus(status?: EntryStatus) {
  return status === 'pending_form' || status === 'resubmit_required' || status === 'pending_payment';
}

function isAttachedStatus(status?: EntryStatus) {
  return status === 'attached';
}

function statusLabel(status: EntryStatus) {
  if (status === 'attached') return 'Ready';
  if (status === 'resubmit_required') return 'Resubmit';
  if (status === 'released') return 'Released';
  if (status === 'no_show') return 'No show';
  if (status === 'pending_payment') return 'Pending payment';
  return 'Locked';
}

function entryReason(status: EntryStatus) {
  if (status === 'resubmit_required') return 'organiser updated the required form';
  if (status === 'released') return 'form deadline missed';
  if (status === 'no_show') return 'event day passed without check-in';
  if (status === 'pending_payment') return 'awaiting payment verification';
  return 'participant form required';
}

export function buildOrders({
  registrationQueueEntries,
  entryAttendance = {},
  guestEntryQRs = {},
  teamPlayerAccess = {},
  teamPlayerRoster = {},
}: {
  registrationQueueEntries: RegistrationQueueEntry[];
  entryAttendance?: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs?: Record<string, GuestEntryQRRecord | undefined>;
  teamPlayerAccess?: Record<string, TeamPlayerAccessPath | undefined>;
  teamPlayerRoster?: Record<string, Participant[] | undefined>;
}): OrderRecord[] {
  const queueByTicket = new Map<string, RegistrationQueueEntry[]>();
  registrationQueueEntries.forEach((entry) => {
    const existing = queueByTicket.get(entry.ticketId) || [];
    existing.push(entry);
    queueByTicket.set(entry.ticketId, existing);
  });

  // Group MY_TICKETS by confirmationRef to support orders with multiple events
  const ticketsByRef = new Map<string, MyTicket[]>();
  MY_TICKETS.forEach((ticket) => {
    const ref = ticket.confirmationRef;
    const existing = ticketsByRef.get(ref) || [];
    existing.push(ticket);
    ticketsByRef.set(ref, existing);
  });

  const eventOrders: OrderRecord[] = [];
  let orderIndex = 0;

  ticketsByRef.forEach((tickets, ref) => {
    const firstTicket = tickets[0];
    const allEntries: OrderEventEntry[] = [];

    tickets.forEach((ticket) => {
      const queueEntries = queueByTicket.get(ticket.id) || [];
      const participants = ticket.ticketType === 'team'
        ? teamPlayerRoster[ticket.id] || ticket.participants
        : ticket.participants;
      const basePrice = getTicketPrice(ticket);
      const teamAttachedCount = participants.filter((participant) => {
        if (ticket.ticketType !== 'team') return false;
        const key = `${ticket.id}:${participant.id}`;
        const accessPath = teamPlayerAccess[key] || participant.accessPath || resolveTeamPlayerAccess({
          formStatus: participant.formStatus,
          inviteStatus: participant.inviteStatus,
          email: participant.email || undefined,
        });
        return accessPath !== 'pending';
      }).length;
      const entries: OrderEventEntry[] = participants.map((participant, participantIndex) => {
            const entryId = `${ticket.id}-${participant.id || participantIndex}`;
            const matchingQueue = queueEntries.find((entry) =>
              entry.participantId === participant.id || entry.id.endsWith(participant.id),
            );
            const effectiveInviteStatus = matchingQueue?.inviteStatus || participant.inviteStatus;
            const effectiveInviteEmail = matchingQueue
              ? matchingQueue.inviteEmail || undefined
              : participant.email || undefined;
            const queuePersonName = matchingQueue?.personName?.trim();
            const meaningfulQueueName = queuePersonName && !/^(?:Participant|Guest) \d+$/i.test(queuePersonName)
              ? queuePersonName
              : undefined;
            const effectiveIsPrimary = matchingQueue?.participantIsPrimary ?? participant.isPrimary;
            const accessPath = ticket.ticketType === 'team'
              ? teamPlayerAccess[`${ticket.id}:${participant.id}`]
                || participant.accessPath
                || resolveTeamPlayerAccess({
                  formStatus: participant.formStatus,
                  inviteStatus: participant.inviteStatus,
                  email: participant.email || undefined,
                })
              : matchingQueue?.accessPath || participant.accessPath;
            const participantStatus: EntryStatus =
              ticket.ticketType === 'team' && accessPath !== 'pending'
                ? 'attached'
                : matchingQueue?.entryStatus ||
              ticket.entryStatus ||
              (participant.formStatus === 'completed' ? 'attached' : 'pending_form');
            const isGuest = ticket.ticketType !== 'team' && !effectiveIsPrimary;
            const isBuyerManagedGuest = isGuest && accessPath === 'guest_qr';
            const playerLabel = ticket.ticketType === 'team' ? teamPlayerLabel(participantIndex) : undefined;
            const canDisplayTeamEmail = effectiveInviteStatus === 'invited' || participant.formStatus === 'completed';
            const participantName = ticket.ticketType === 'team'
              ? teamPlayerDisplayName({ participant, participantIndex, accessPath })
                || (canDisplayTeamEmail ? participant.email : undefined)
                || playerLabel
                || `Guest ${participantIndex + 1}`
              : meaningfulQueueName || participant.name || effectiveInviteEmail || playerLabel || `Guest ${participantIndex + 1}`;
            return {
              id: entryId,
              ticket,
              entryName: ticket.ticketType === 'team'
                ? `${ticket.eventTitle} - ${ticket.ticketTypeName} · ${playerLabel}`
                : `${ticket.eventTitle} - ${ticket.ticketTypeName} (${participantName})`,
              participantName,
              participantLabel: ticket.ticketType === 'team'
                ? teamPlayerDisplayName({ participant, participantIndex, accessPath })
                : playerLabel || participantName,
              attendeeEmail: effectiveInviteEmail,
              category: ticket.ticketTypeName,
              status: participantStatus,
              type: ticket.ticketType === 'team' ? 'team' as const : (isBuyerManagedGuest || isGuest) ? 'guest' as const : 'self' as const,
              participantId: participant.id,
              accessPath,
              price: Math.round(basePrice / Math.max(ticket.quantity, 1)),
              queueEntry: matchingQueue,
              buyerAttending: participants.some((p) => p.isPrimary && p.formStatus === 'completed'),
              attendance: entryAttendance[entryId],
              guestQR: guestEntryQRs[entryId],
              inviteStatus: effectiveInviteStatus,
              claimLinkRevoked: matchingQueue?.claimLinkRevoked ?? participant.claimLinkRevoked,
              passportMemberId: participant.passportMemberId,
              passportDisplayName: participant.passportDisplayName,
              teamAttachedCount: ticket.ticketType === 'team' ? teamAttachedCount : undefined,
              teamTotalCount: ticket.ticketType === 'team' ? participants.length : undefined,
            };
          });

      allEntries.push(...entries);
    });

    eventOrders.push({
      id: firstTicket.id,
      ref: ref,
      date: firstTicket.purchaseDate,
      name: tickets.length > 1
        ? `${firstTicket.eventTitle} + ${tickets.length - 1} more`
        : firstTicket.eventTitle,
      eventEntries: allEntries,
      merchItems: [],
      paymentStatus: 'Paid',
      paymentMethod: orderIndex % 2 === 0 ? 'Visa ending 4532' : 'GCash',
      paymentDate: firstTicket.purchaseDate,
      fees: 95 * tickets.length,
      image: firstTicket.image,
    });

    orderIndex++;
  });

  const merchOrders: OrderRecord[] = [
    {
      id: 'ord-gear-001',
      ref: 'GEAR-2026-001982',
      date: 'Feb 12, 2026',
      name: 'PlanOut Official Gear',
      eventEntries: [],
      merchItems: [
        {
          id: 'hoodie-black-m',
          name: 'Official Hoodie',
          variant: 'Black - Medium',
          quantity: 1,
          price: 1800,
          status: 'Shipped',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgcng9IjE0IiBmaWxsPSIjZjhmYWZjIiAvPjxwYXRoIGQ9Ik0zMCA0NSBMMTUgNjUgTDI1IDcyIEwzNCA1NiBMMzQgOTUgQzM0IDk4LCAzNiAxMDAsIDM5IDEwMCBMODEgMTAwIEM4NCAxMDAsIDg2IDk4LCA4NiA5NSBMODYgNTYgTDk1IDcyIEwxMDUgNjUgTDkwIDQ1IEw2MCAzOCBaIiBmaWxsPSIjMWUyOTNiIi8+PHBhdGggZD0iTTQyIDQwIEM0MiAyMiwgNzggMjIsIDc4IDQwIEM3OCA0NSwgNDIgNDUsIDQyIDQwIFoiIGZpbGw9IiMwZjE3MmEiIG9wYWNpdHk9IjAuOTUiLz48ZWxsaXBzZSBjeD0iNjAiIGN5PSI0MCIgcng9IjEyIiByeT0iNyIgZmlsbD0iIzMzNDE1NSIvPjxwYXRoIGQ9Ik05MCAzMiBDNTAgMzgsIDcwIDM4LCA3MCAzMiBaIiBmaWxsPSIjY2JkNWUxIiAvPjwvc3ZnPg==',
          trackingNumber: 'PLN-8841-22',
          dates: {
            confirmed: 'Feb 12',
            processing: 'Feb 13',
            shipped: 'Feb 15',
          },
        },
        {
          id: 'cap-green',
          name: 'PlanOut Race Cap',
          variant: 'Forest Green',
          quantity: 2,
          price: 650,
          status: 'Processing',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgcng9IjE0IiBmaWxsPSIjZjhmYWZjIiAvPjxwYXRoIGQ9Ik0zNSA3MCBDMzUgMzUsIDg1IDM1LCA4NSA3MCBaIiBmaWxsPSIjMTU4MDNkIi8+PHBhdGggZD0iTTI1IDcyIEM0NSA4MiwgNzUgODIsIDk1IDcyIEw4NSA3MCBMMzUgNzAgWiIgZmlsbD0iIzE2NjUzNCIvPjxwYXRoIGQ9Ik00NSA3MCBDNDUgNjYsIDc1IDY2LCA3NSA3MCIgc3Ryb2tlPSIjMTQ1MzJkIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQyIiByPSI0IiBmaWxsPSIjMTY2NTM0Ii8+PC9zdmc+',
          dates: {
            confirmed: 'Feb 12',
            processing: 'Feb 13',
          },
        },
      ],
      paymentStatus: 'Paid',
      paymentMethod: 'Mastercard ending 1188',
      paymentDate: 'Feb 12, 2026',
      fees: 80,
      image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 'ord-refund-001',
      ref: 'RFN-2026-000341',
      date: 'Jan 18, 2026',
      name: 'PlanOut Official Gear',
      eventEntries: [],
      merchItems: [
        {
          id: 'tee-white-l',
          name: 'Training Tee',
          variant: 'White - Large',
          quantity: 1,
          price: 950,
          status: 'Processing',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgcng9IjE0IiBmaWxsPSIjZjhmYWZjIiAvPjxwYXRoIGQ9Ik0zOCAzMiBMMjAgNDIgTDI4IDU0IEwzOCA0OCBMMzggODggQzM4IDkwLCA0MCA5MiwgNDIgOTIgTDc4IDkyIEM4MCA5MiwgODIgOTAsIDgyIDg4IEw4MiA0OCBMOTIgNTQgTDEwMCA0MiBMODIgMzIgWiIgZmlsbD0iI2UyZThmMCIvPjxwYXRoIGQ9Ik05MCAzMiBDNTAgMzgsIDcwIDM4LCA3MCAzMiBaIiBmaWxsPSIjY2JkNWUxIiAvPjwvc3ZnPg==',
          dates: {
            confirmed: 'Jan 18',
          },
        },
      ],
      paymentStatus: 'Refunded',
      refunded: {
        amount: 950,
        date: 'Jan 21, 2026',
        method: 'Original payment method',
      },
      paymentMethod: 'Visa ending 4532',
      paymentDate: 'Jan 18, 2026',
      fees: 0,
      image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  return [...eventOrders, ...merchOrders].sort((a, b) => parseOrderDate(b.date) - parseOrderDate(a.date));
}

function getOrderSubtotal(order: OrderRecord) {
  const eventTotal = getOrderEventSubtotal(order.eventEntries);
  const merchTotal = order.merchItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return eventTotal + merchTotal;
}

function getOrderTotal(order: OrderRecord) {
  return getOrderSubtotal(order) + order.fees;
}

function getOrderEventGroups(order: OrderRecord) {
  const eventGroups = new Map<string, { count: number; category: string }>();
  order.eventEntries.forEach((entry) => {
    const key = `${entry.ticket.eventTitle} - ${entry.category}`;
    if (entry.type === 'team' && eventGroups.has(key)) return;
    const existing = eventGroups.get(key) || { count: 0, category: entry.category };
    existing.count++;
    eventGroups.set(key, existing);
  });

  return eventGroups;
}

function getDistinctEventCount(order: OrderRecord) {
  return new Set(order.eventEntries.map((entry) => entry.ticket.id)).size;
}

function getRegistrationItemCount(order: OrderRecord) {
  return Array.from(getOrderEventGroups(order).values()).reduce(
    (total, group) => total + group.count,
    0,
  );
}

function getItemSummary(order: OrderRecord) {
  const eventGroups = getOrderEventGroups(order);
  const eventCount = getDistinctEventCount(order);
  if (eventCount > 1) {
    const registrationItemCount = getRegistrationItemCount(order);
    return `${eventCount} event${eventCount === 1 ? '' : 's'} · ${registrationItemCount} registration item${registrationItemCount === 1 ? '' : 's'}`;
  }

  const eventItems = Array.from(eventGroups.values()).map(
    (group) => `${group.count}× ${group.category}`,
  );
  const merchItems = order.merchItems.map((item) => `${item.quantity}× ${item.name}`);
  return [...eventItems, ...merchItems].join(' - ');
}

function orderHasPending(order: OrderRecord) {
  return order.eventEntries.some((entry) => (
    isPendingStatus(entry.status)
    // Team rows resolve form/access state per player. Keep the overview aligned
    // with the detail card when the ticket-level status is stale or released.
    || (entry.type === 'team' && entry.status !== 'attached')
  ));
}

function orderIsComplete(order: OrderRecord) {
  return !orderHasPending(order);
}

function orderHasEvents(order: OrderRecord) {
  return order.eventEntries.length > 0;
}

function orderHasMerch(order: OrderRecord) {
  return order.merchItems.length > 0;
}

function orderIsRefunded(order: OrderRecord) {
  return order.paymentStatus === 'Refunded' || Boolean(order.refunded);
}

function FilterTabs({
  active,
  onChange,
  orders,
}: {
  active: OrderFilter;
  onChange: (filter: OrderFilter) => void;
  orders: OrderRecord[];
}) {
  const tabs: { value: OrderFilter; label: string; badge: number }[] = [
    { value: 'all', label: 'All', badge: orders.length },
    { value: 'pending', label: 'Pending', badge: orders.filter(orderHasPending).length },
    { value: 'complete', label: 'Complete', badge: orders.filter(orderIsComplete).length },
  ];

  return (
    <div className="sticky top-0 z-10 py-1">
      <SegmentedChoice
        size="sm"
        value={active}
        onChange={onChange}
        options={tabs}
        columnsClass="grid-cols-3 max-w-[340px]"
      />
    </div>
  );
}

type OrderState = {
  label: 'Forms needed' | 'Ready for gate' | 'Complete' | MerchStatus | 'Refunded';
  tone: 'warning' | 'ready' | 'neutral' | 'refunded';
} | null;

function getOrderState(order: OrderRecord): OrderState {
  if (orderIsRefunded(order)) {
    return { label: 'Refunded', tone: 'refunded' };
  }

  if (orderHasPending(order)) {
    return { label: 'Forms needed', tone: 'warning' };
  }

  const hasAttachedEvents = order.eventEntries.length > 0 && order.eventEntries.every((entry) => isAttachedStatus(entry.status));
  if (hasAttachedEvents) {
    return { label: 'Ready for gate', tone: 'ready' };
  }

  if (order.eventEntries.length > 0) {
    return { label: 'Complete', tone: 'neutral' };
  }

  const merchStatuses = order.merchItems.map((item) => item.status);
  if (merchStatuses.includes('Processing')) return { label: 'Processing', tone: 'neutral' };
  if (merchStatuses.includes('Shipped')) return { label: 'Shipped', tone: 'neutral' };
  if (merchStatuses.includes('Delivered')) return { label: 'Delivered', tone: 'ready' };
  return null;
}

function getOrderGraphicImages(order: OrderRecord) {
  const imageCandidates = [
    ...order.eventEntries.map((entry) => entry.ticket.image),
    ...order.merchItems.map((item) => item.image),
    order.image,
  ];

  return Array.from(new Set(imageCandidates.filter((image): image is string => Boolean(image))));
}

function getOrderCardBrand(order: OrderRecord) {
  const brand = order.eventEntries[0]?.ticket.brand || PLANOUT_EVENT_BRAND;
  return getEventBrand({ brand });
}

function getOrderAmbientImage(order: OrderRecord) {
  return getOrderGraphicImages(order)[0] || '';
}

function getUniqueOrderEvents(order: OrderRecord): OrderCoverItem[] {
  const seen = new Set<string>();
  const events: OrderCoverItem[] = [];

  order.eventEntries.forEach((entry) => {
    if (seen.has(entry.ticket.id)) return;
    seen.add(entry.ticket.id);
    const brand = getEventBrand({ brand: entry.ticket.brand || PLANOUT_EVENT_BRAND });
    events.push({
      id: entry.ticket.id,
      title: entry.ticket.eventTitle,
      image: entry.ticket.image,
      gradientFrom: brand.pageBackground,
      gradientTo: brand.pageBackgroundTo,
    });
  });

  return events;
}

function getOrderCoverPresentation(order: OrderRecord, registrationCount: number) {
  const events = getUniqueOrderEvents(order);
  const eventCount = events.length;
  const fallbackBrand = getEventBrand({ brand: PLANOUT_EVENT_BRAND });
  const merchandiseQuantity = order.merchItems.reduce((sum, item) => sum + item.quantity, 0);
  const items: OrderCoverItem[] = eventCount > 0
    ? events
    : [{
        id: order.merchItems[0]?.id || order.id,
        title: order.name,
        image: getOrderGraphicImages(order)[0],
        gradientFrom: fallbackBrand.pageBackground,
        gradientTo: fallbackBrand.pageBackgroundTo,
      }];

  return {
    title: eventCount > 1 ? `${eventCount}-event order` : items[0]?.title || order.name,
    itemSummary: eventCount > 0
      ? `${registrationCount} registration item${registrationCount === 1 ? '' : 's'}`
      : `${merchandiseQuantity} item${merchandiseQuantity === 1 ? '' : 's'}`,
    items,
    totalMediaCount: eventCount || 1,
  };
}

function getOrderOverviewTitle(order: OrderRecord) {
  const eventCount = getDistinctEventCount(order);
  return {
    primary: order.eventEntries[0]?.ticket.eventTitle || order.name,
    additionalCount: Math.max(0, eventCount - 1),
  };
}

function getOrderCardEventDetails(order: OrderRecord) {
  const primaryTicket = order.eventEntries[0]?.ticket;
  if (!primaryTicket) return null;

  const eventCount = getDistinctEventCount(order);
  return {
    ticketType: primaryTicket.ticketTypeName,
    date: eventCount > 1 ? `${eventCount} events` : formatEventDateOnly(primaryTicket.eventDate),
  };
}

function getOrderCardStyle(order: OrderRecord) {
  const brand = getOrderCardBrand(order);

  return {
    '--order-card-fg': brand.pageForeground,
    '--order-card-muted': brand.pageMuted,
    '--order-card-subtle': brand.pageSubtle,
    '--order-card-border': brand.pageBorder,
    '--order-card-surface': brand.surface,
    '--order-card-accent': brand.accent,
    '--order-card-meta': alpha(brand.pageForeground, 0.82),
    '--order-card-scrim-leading': alpha(brand.pageBackgroundTo, 0.90),
    '--order-card-scrim-middle': alpha(brand.pageBackground, 0.56),
    '--order-card-scrim-trailing': alpha(brand.pageBackgroundTo, 0.24),
    '--order-card-solid': brand.pageBackgroundTo,
    '--order-card-shadow': brand.accentShadow,
    background: `linear-gradient(135deg, ${brand.pageBackground} 0%, ${brand.pageBackgroundTo} 100%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.48), inset 0 -1px 0 rgba(0,0,0,0.16), 0 14px 26px -20px ${brand.accentShadow}`,
    color: brand.pageForeground,
  } as React.CSSProperties;
}

function OrderCard({ order, onOpen }: { order: OrderRecord; onOpen: () => void }) {
  const ambientImage = getOrderAmbientImage(order);
  const state = getOrderState(order);
  const { primary, additionalCount } = getOrderOverviewTitle(order);
  const eventDetails = getOrderCardEventDetails(order);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={getOrderCardStyle(order)}
      className="order-glass-card group relative isolate w-full overflow-hidden rounded-[18px] text-left transition-[filter,transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:brightness-[1.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef4f4] active:translate-y-0 active:scale-[0.99] motion-reduce:hover:translate-y-0"
    >
      {ambientImage && (
        <span
          data-testid="order-card-image"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.78]"
        >
          <ImageWithFallback
            src={ambientImage}
            alt=""
            draggable={false}
            className="order-card-image-media h-full w-full scale-[1.03] object-cover contrast-[1.04] saturate-[1.12] transition-transform duration-200 ease-out group-hover:scale-[1.045]"
          />
        </span>
      )}
      <span
        data-testid="order-glass-tint"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'linear-gradient(to top, rgba(3,8,12,0.68) 0%, rgba(3,8,12,0.10) 62%, rgba(255,255,255,0.05) 100%)',
            'linear-gradient(96deg, var(--order-card-scrim-leading) 0%, var(--order-card-scrim-middle) 48%, var(--order-card-scrim-trailing) 100%)',
          ].join(', '),
        }}
      />
      <span
        data-testid="order-glass-material"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white/[0.018] backdrop-saturate-[112%]"
      />
      <span
        data-testid="order-glass-highlight"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-200 ease-out group-hover:opacity-100 motion-reduce:transition-none"
        style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.09) 16%, transparent 40%)' }}
      />

      <div className="relative z-10 flex min-h-[164px] flex-col px-4 py-3.5 sm:min-h-[176px] sm:px-5 sm:py-4">
        <div className="flex min-h-0 flex-1 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {state ? (
              <div data-testid="order-card-status" className="mb-2 self-start">
                <OrderStatusLabel label={state.label} tone={state.tone} />
              </div>
            ) : null}
            <h2
              aria-label={order.name}
              className="line-clamp-2 max-w-[92%] text-[18px] font-bold leading-[1.08] tracking-[-0.45px] text-[var(--order-card-fg)] [text-shadow:0_1px_2px_rgba(0,0,0,0.18)] sm:text-[20px] sm:leading-[1.1]"
            >
              <span aria-hidden="true">{primary}</span>
              {additionalCount > 0 && (
                <span
                  data-testid="order-additional-events"
                  aria-hidden="true"
                  className="ml-1.5 inline-flex whitespace-nowrap rounded-full border border-white/20 bg-black/30 px-2 py-1 align-middle text-[10.5px] font-semibold leading-none tracking-[-0.1px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[8px] backdrop-saturate-[120%] sm:text-[11px]"
                >
                  {`+${additionalCount} more`}
                </span>
              )}
            </h2>
            <p
              data-testid="order-event-ticket-type"
              className="order-card-muted mt-1.5 min-w-0 truncate text-[12.5px] font-semibold leading-none text-[var(--order-card-muted)] sm:text-[13px]"
            >
              {eventDetails?.ticketType || getItemSummary(order)}
            </p>
            {eventDetails ? (
              <div data-testid="order-event-details" className="mt-2 grid min-w-0 gap-1 text-[11px] font-semibold leading-[1.15] text-[var(--order-card-meta)] sm:text-[11.5px]">
                <div data-testid="order-event-date" className="flex min-w-0 items-center gap-1.5">
                  <CalendarDays className="size-3.5 shrink-0 text-[var(--order-card-subtle)]" strokeWidth={2.1} aria-hidden="true" />
                  <span className="truncate">{eventDetails.date}</span>
                </div>
              </div>
            ) : (
              <p className="order-card-muted mt-2 truncate text-[11px] font-semibold leading-[1.15] text-[var(--order-card-meta)] sm:text-[11.5px]">
                {order.date}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-end self-stretch">
            <span className="mt-auto tabular-nums text-[15px] font-bold leading-none tracking-[-0.2px] text-[var(--order-card-fg)] [text-shadow:0_1px_2px_rgba(0,0,0,0.18)] sm:text-[16px]">
              {formatMoney(getOrderTotal(order))}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function appOrigin() {
  return typeof window === 'undefined' ? '' : window.location.origin;
}

function copyText(value: string, successMessage: string) {
  if (!navigator.clipboard) {
    toast.error('Copy is unavailable in this browser');
    return;
  }

  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(successMessage))
    .catch(() => toast.error('Could not copy link'));
}

function EmailReviewSheet({
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

function BulkEmailReviewSheet({
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

function ParticipantFormLinkActions({
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

function ParticipantFormShareControls({
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
                buildBulkFormLinkMessage(order, shareableEntries, appOrigin()),
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

export function OrdersPage() {
  const navigate = useNavigate();
  const { registrationQueueEntries, entryAttendance, guestEntryQRs, teamPlayerAccess, teamPlayerRoster } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');
  const orders = useMemo(() => buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
  }), [entryAttendance, guestEntryQRs, registrationQueueEntries, teamPlayerAccess, teamPlayerRoster]);

  const visibleOrders = orders.filter((order) => !TEMPORARILY_HIDDEN_ORDER_IDS.has(order.id));

  const filteredOrders = visibleOrders.filter((order) => {
    if (activeFilter === 'pending') return orderHasPending(order);
    if (activeFilter === 'complete') return orderIsComplete(order);
    return true;
  });

  return (
    <div className="relative flex flex-col gap-3 pb-8">
      <div className="relative">
        <h1 className="text-[32px] font-semibold leading-none tracking-[-0.9px] text-[#181d27]">
          Orders
        </h1>
        <p className="mt-2 max-w-[560px] text-[13px] font-medium leading-relaxed text-[#64748b]">
          Forms, access, and delivery in one place.
        </p>
      </div>

      <FilterTabs active={activeFilter} onChange={setActiveFilter} orders={visibleOrders} />

      <section data-testid="orders-order-list" className="grid grid-cols-1 lg:grid-cols-2 gap-4" aria-label="Orders">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onOpen={() => navigate(`/orders/${order.id}`)}
          />
        ))}

        {filteredOrders.length === 0 && (
          <div className="lg:col-span-2 rounded-[16px] border border-neutral-100 bg-white p-8 text-center">
            <EmptyStateGraphic kind="no-orders" className="h-32 w-32" />
            <p className="mt-2 text-[15px] font-semibold text-[#181d27]">No orders here</p>
            <p className="mt-1 text-[13px] text-[#64748b]">Try a different order filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}

type RegistrationStateTone = 'ready' | 'pending' | 'warning' | 'danger';

function RegistrationCardHeader({ title, date, location, image }: { title: string; date: string; location?: string; image?: string }) {
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

function RegistrationItemShell({
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
    <article data-testid="registration-event-item" className="bg-transparent">
      <RegistrationCardHeader title={title} date={date} location={location} image={image} />
      {children}
    </article>
  );
}

function RegistrationStatePanel({
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

function RegistrationActionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-end gap-2">{children}</div>;
}

function ClaimLinkActions({
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

function ClaimLinkStatePanel({
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

function PassportBanner({
  entry,
  orderId,
  order,
  onRescind,
  fillAction,
  viewFormAction,
  shareActions,
  contactAction,
}: {
  entry: OrderEventEntry;
  orderId: string;
  order: OrderRecord;
  onRescind: () => void;
  fillAction?: React.ReactNode;
  viewFormAction?: React.ReactNode;
  shareActions?: React.ReactNode;
  contactAction?: React.ReactNode;
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
        setQrOverlay({ kind: 'guest', entry, orderId, qr });
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
              <PrimaryButton
                type="button"
                onClick={openQr}
                compact
                className="text-[12px]"
              >
                {entry.guestQR?.isActive ? 'View QR' : 'Generate & send QR'}
              </PrimaryButton>
            </>
          )}
        >
          <span className="inline-flex w-fit rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#d9ece8]">
            {entry.guestQR?.isActive ? 'QR sent' : 'Guest QR ready'}
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
              <PrimaryButton
                type="button"
                onClick={openPassportQr}
                compact
                className="text-[12px]"
              >
                View QR
              </PrimaryButton>
            </>
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex w-fit rounded-full bg-[#e4f4ef] px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#cfe3de]">
              Ready for gate
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

  const isInvitedGuest = entry.type === 'guest'
    && entry.inviteStatus === 'invited'
    && entry.status !== 'attached';

  if (isInvitedGuest) {
    return (
      <ClaimLinkStatePanel
        entry={entry}
        order={order}
        compact
        divider={false}
        compactDetail={(
          <p className="mt-1 text-[11px] font-medium text-[#516173]">
            Claim link sent
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
          {entry.type === 'team' ? 'Player entry needed' : 'Form needed'}
        </span>
        <span className="font-medium text-[#8a7760]">· {entryReason(entry.status)}</span>
      </p>
    </RegistrationStatePanel>
  );
}

function RegistrationItem({ entry, orderId, order, teamEntries, onContactOrganizer }: { entry: OrderEventEntry; orderId: string; order: OrderRecord; teamEntries: OrderEventEntry[]; onContactOrganizer?: () => void }) {
  const navigate = useNavigate();
  const { rescindRegistrationInvite, sendRegistrationInvite } = useAppContext();

  if (entry.type === 'team') {
    return (
      <TeamRegistrationItem
        entry={entry}
        order={order}
        teamEntries={teamEntries}
        onContactOrganizer={onContactOrganizer}
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
  const actionTarget = `/orders/${entry.ticket.id}/form?returnTo=order&entryId=${encodeURIComponent(entry.queueEntry?.id || entry.id)}${participantQuery}${isBuyerFillRequired ? '&buyerFill=1' : ''}`;

  return (
    <RegistrationItemShell title={entry.entryName} date={entry.ticket.eventDate} location={entry.ticket.eventLocation} image={entry.ticket.image}>
      <div className="px-4 pb-1 sm:px-5">
        <PassportBanner
          entry={entry}
          orderId={orderId}
          order={order}
          onRescind={() => {
            rescindRegistrationInvite(entry.queueEntry?.id || entry.id);
            toast.success('Claim link revoked');
          }}
          fillAction={(
            <SecondaryButton
              type="button"
              onClick={() => navigate(actionTarget)}
              compact
              className="text-[11px]"
            >
              Fill up
            </SecondaryButton>
          )}
          viewFormAction={(
            <SecondaryButton
              type="button"
              onClick={() => navigate(actionTarget)}
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

function TeamRegistrationItem({ entry, order, teamEntries, onContactOrganizer }: { entry: OrderEventEntry; order: OrderRecord; teamEntries: OrderEventEntry[]; onContactOrganizer?: () => void }) {
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
    navigate(`/orders/${playerEntry.ticket.id}/form?returnTo=order&participantId=${encodeURIComponent(playerEntry.participantId)}&playerOnly=1`);
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
      setQrOverlay({ kind: 'guest', entry: playerEntry, orderId: entry.ticket.id, qr });
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
      <RegistrationItemShell title={summary.title} date={entry.ticket.eventDate} location={entry.ticket.eventLocation} image={entry.ticket.image}>

      <section className="px-4 pt-4 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#e4f4ef] text-[#177564]">
            <Users className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold tracking-[-0.2px] text-[#163d37]">Players</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
              <p className="text-[17px] font-semibold tracking-[-0.3px] text-[#315f57]">{summary.setUpCount} of {summary.totalCount} ready</p>
              {!canAddPlayer && <span className="text-[11px] font-semibold text-[#7b8b9a]">Full</span>}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12.5px] font-medium leading-relaxed text-[#315f57]">
          Fill for Guest QR, or send a link to their Passport.
        </p>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dcebe7]"
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

      <div className="mt-4 border-t border-[#e2eee9] px-4 sm:px-5">
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
                          <PrimaryButton
                            type="button"
                            onClick={() => openPlayerGuestQr(playerEntry)}
                            compact
                            className="text-[11px]"
                          >
                            View QR
                          </PrimaryButton>
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
                      <PrimaryButton
                        type="button"
                        compact
                        onClick={openPlayerPassportQr}
                        className="text-[11px]"
                      >
                        View QR
                      </PrimaryButton>
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
                  ) : null}
                </>
              )}
            >
              <p className="truncate text-[12.5px] font-semibold text-[#181d27]">{playerName}</p>
              <div className="mt-1 flex min-w-0 items-center gap-1.5">
                {hasPassport || hasGuestQr ? (
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
      </RegistrationItemShell>
      <OrderQrOverlay state={qrOverlay} onClose={() => setQrOverlay(null)} />
    </>
  );
}

function ShippingTracker({ item }: { item: MerchItem }) {
  const steps: { key: keyof MerchItem['dates']; label: string }[] = [
    { key: 'confirmed', label: 'Order confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];
  const statusIndex = item.status === 'Delivered' ? 3 : item.status === 'Shipped' ? 2 : 1;

  return (
    <div className="mt-3 border-t border-neutral-100 pt-3">
      <div className="flex flex-col gap-2.5">
        {steps.map((step, index) => {
          const done = index < statusIndex;
          const active = index === statusIndex;
          return (
            <div key={step.key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  done ? 'bg-[#177564] text-white' : active ? 'bg-[#177564]/10 text-[#177564]' : 'bg-neutral-100 text-[#94a3b8]'
                }`}>
                  {done ? <Check className="h-2.5 w-2.5" /> : <Circle className="h-2 w-2 fill-current" />}
                </span>
                <span className={`text-[12px] font-medium ${done || active ? 'text-[#181d27]' : 'text-[#94a3b8]'}`}>
                  {step.label}
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#94a3b8]">{item.dates[step.key] || ''}</span>
            </div>
          );
        })}
      </div>
      {item.trackingNumber && (
        <SecondaryButton
          type="button"
          onClick={() => toast.success('Tracking opened', { description: item.trackingNumber })}
          compact
          tone="neutral"
          className="mt-3 text-[12px]"
        >
          Track package
        </SecondaryButton>
      )}
    </div>
  );
}

function MerchandiseItem({ item }: { item: MerchItem }) {
  return (
    <article className="rounded-[16px] border border-neutral-100 bg-white p-4">
      <div className="flex items-start gap-3">
        {item.image ? (
          <ImageWithFallback src={item.image} alt={item.name} className="h-10 w-10 shrink-0 rounded-[10px] object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-neutral-100">
            <span className="text-[13px] font-semibold text-[#64748b]">{item.name[0]}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold text-[#181d27]">{item.name}</h3>
              <p className="mt-0.5 text-[12px] font-medium text-[#94a3b8]">
                {item.variant} · Qty {item.quantity}
              </p>
            </div>
            <span className="text-[13px] font-semibold text-[#181d27]">
              {formatMoney(item.price * item.quantity)}
            </span>
          </div>
          <p className="mt-2 text-[12px] font-medium text-[#94a3b8]">Claim at the event</p>
        </div>
      </div>
    </article>
  );
}

function PaymentSummary({ order }: { order: OrderRecord }) {
  const lineItems = [
    ...getOrderEventLineItems(order.eventEntries),
    ...order.merchItems.map((item) => ({ id: item.id, label: `${item.quantity}x ${item.name}`, amount: item.price * item.quantity })),
  ];
  const subtotal = getOrderSubtotal(order);

  return (
    <OrderPaymentSummary
      lineItems={lineItems}
      subtotal={subtotal}
      fees={order.fees}
      total={getOrderTotal(order)}
      paymentMeta={`${order.paymentMethod} - ${order.paymentDate}`}
          title="Payment summary"
      statusLabel={order.paymentStatus}
      statusTone={order.paymentStatus === 'Paid' ? 'ready' : 'danger'}
    />
  );
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const {
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
    sendRegistrationInvite,
  } = useAppContext();
  const [organizerContactSelection, setOrganizerContactSelection] = useState<OrganizerContactSelection | null>(null);
  const orders = useMemo(() => buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
  }), [entryAttendance, guestEntryQRs, registrationQueueEntries, teamPlayerAccess, teamPlayerRoster]);
  const order = orders.find((item) =>
    item.id === orderId ||
    item.ref === orderId ||
    item.eventEntries.some((entry) => entry.ticket.id === orderId)
  );

  if (!order) {
    return (
      <div className="flex min-h-[52dvh] flex-col items-center justify-center text-center">
        <EmptyStateGraphic kind="order-not-found" className="h-40 w-40" />
        <h1 className="mt-3 text-[24px] font-semibold text-[#181d27]">Order not found</h1>
        <PrimaryButton
          type="button"
          onClick={() => navigate('/orders')}
          compact
          className="mt-4 text-[13px]"
        >
          Back to Orders
        </PrimaryButton>
      </div>
    );
  }

  const openOrganizerContact = (entry: OrderEventEntry) => {
    const contact = getOrganizerBySlug(entry.ticket.organizer);
    if (!contact) return;

    setOrganizerContactSelection({
      contact,
      contextSummary: `${entry.ticket.eventTitle} · Order ${order.ref}`,
    });
  };

  const registrationEntries = getOrderRegistrationEntries(order.eventEntries);
  const hasTeamRegistration = registrationEntries.some((entry) => entry.type === 'team');
  const state = getOrderState(order);
  const cover = getOrderCoverPresentation(order, registrationEntries.length);
  const pendingFormCount = order.eventEntries.filter((entry) => (
    entry.status === 'pending_form' || entry.status === 'resubmit_required'
  )).length;

  return (
    <div className="relative flex flex-col gap-4 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pb-10">
      <OrderCover
        title={cover.title}
        reference={order.ref}
        purchaseDate={order.date}
        itemSummary={cover.itemSummary}
        total={formatMoney(getOrderTotal(order))}
        state={state}
        items={cover.items}
        totalMediaCount={cover.totalMediaCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
        {/* Left Column: Registration items, merchandise, refunds */}
        <div className="flex flex-col gap-4">
          {order.eventEntries.length > 0 && (
            <section
              className="flex flex-col gap-3.5"
              aria-label="Registration items"
            >
              <div className="flex items-end justify-between gap-4 px-1">
                <div>
                  <h2 className="text-[17px] font-semibold tracking-[-0.3px] text-[#181d27]">Registration</h2>
                  <p className="mt-0.5 text-[12px] font-medium text-[#7b8b9a]">Forms and access for this order</p>
                </div>
                {pendingFormCount > 0 && (
                  <span className="shrink-0 rounded-full bg-[#fff3c4] px-2.5 py-1 text-[10.5px] font-semibold leading-none text-[#8a5a08] ring-1 ring-[#edd377]">
                    {pendingFormCount} form{pendingFormCount === 1 ? '' : 's'} needed
                  </span>
                )}
              </div>
              {!hasTeamRegistration && (
                <ParticipantFormShareControls
                  order={order}
                  onShareEntries={(draftEntries) => {
                    draftEntries.forEach((draft) => {
                      sendRegistrationInvite(
                        draft.queueEntry?.id || draft.id,
                        draft.attendeeEmail,
                        draft.queueEntry || registrationQueueFallback(draft, order),
                      );
                    });
                  }}
                />
              )}
              <div
                data-testid="registration-event-list"
                className="divide-y divide-[#e7ecef] overflow-hidden rounded-[20px] border border-[#dfe7e5] bg-white shadow-[0_18px_44px_-38px_rgba(15,23,42,0.5)]"
              >
                {registrationEntries.map((entry) => (
                  <RegistrationItem
                    key={entry.id}
                    entry={entry}
                    orderId={order.id}
                    order={order}
                    teamEntries={order.eventEntries.filter((item) => item.type === 'team' && item.ticket.id === entry.ticket.id)}
                    onContactOrganizer={() => openOrganizerContact(entry)}
                  />
                ))}
              </div>
            </section>
          )}

          {order.merchItems.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-semibold tracking-[-0.3px] text-[#181d27]">Merchandise</h2>
              {order.merchItems.map((item) => (
                <MerchandiseItem key={item.id} item={item} />
              ))}
            </section>
          )}

          {order.refunded && (
            <section className="rounded-[16px] border border-neutral-100 bg-white p-4">
              <div className="flex items-center gap-2 text-[#64748b]">
                <RotateCcw className="h-4 w-4" />
                <h2 className="text-[16px] font-semibold text-[#181d27]">Refund</h2>
              </div>
              <p className="mt-2 text-[13px] font-medium text-[#64748b]">
                {formatMoney(order.refunded.amount)} refunded on {order.refunded.date} via {order.refunded.method}.
              </p>
              {order.refunded.neverAttached && (
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#94a3b8]">
                  Access was never created for this event — no impact to your QR.
                </p>
              )}
            </section>
          )}
        </div>

        {/* Right Column: Sticky Payment summary & Action buttons */}
        <div className="lg:sticky lg:top-[96px] flex flex-col gap-4">
          <PaymentSummary order={order} />

          <div className="grid grid-cols-2 gap-2 pt-1">
            <SecondaryButton
              type="button"
              onClick={() => toast.success('Receipt prepared')}
              fullWidth
              tone="neutral"
              className="text-[12px]"
            >
              <Download className="h-4 w-4" />
              Download receipt
            </SecondaryButton>
            <SecondaryButton
              type="button"
              onClick={() => navigate('/settings/inbox')}
              fullWidth
              tone="neutral"
              className="text-[12px]"
            >
              <HelpCircle className="h-4 w-4" />
              Get help
            </SecondaryButton>
          </div>
        </div>
      </div>

      {organizerContactSelection && (
        <OrganizerContactWidget
          key={`${organizerContactSelection.contact.id}:${organizerContactSelection.contextSummary}`}
          contact={organizerContactSelection.contact}
          contextSummary={organizerContactSelection.contextSummary}
          initiallyOpen
          showLauncher={false}
          onOpenChange={(open) => {
            if (!open) setOrganizerContactSelection(null);
          }}
        />
      )}
    </div>
  );
}
