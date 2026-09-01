import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
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
  RegistrationItem,
  TeamRegistrationItem,
  RegistrationItemShell,
  RegistrationCardHeader,
  RegistrationStatePanel,
  RegistrationActionRow,
  ClaimLinkActions,
  ClaimLinkStatePanel,
  PassportBanner,
  EmailReviewSheet,
  BulkEmailReviewSheet,
  ParticipantFormLinkActions,
  ParticipantFormShareControls,
  GroupedRegistrationList,
  EventRegistrationGroupCard,
  TicketTypeRegistrationSection,
  RegistrationEntryRow,
  groupRegistrationEntriesByEventAndTicketType,
  registrationQueueFallback,
  type OrderEventEntry,
  type OrderRecord,
  type RegistrationStateTone,
} from '@/app/components/RegistrationItemComponents';

export {
  RegistrationItem,
  TeamRegistrationItem,
  RegistrationItemShell,
  RegistrationCardHeader,
  RegistrationStatePanel,
  RegistrationActionRow,
  ClaimLinkActions,
  ClaimLinkStatePanel,
  PassportBanner,
  EmailReviewSheet,
  BulkEmailReviewSheet,
  ParticipantFormLinkActions,
  ParticipantFormShareControls,
  GroupedRegistrationList,
  EventRegistrationGroupCard,
  TicketTypeRegistrationSection,
  RegistrationEntryRow,
  groupRegistrationEntriesByEventAndTicketType,
  registrationQueueFallback,
  type OrderEventEntry,
  type OrderRecord,
  type RegistrationStateTone,
};
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
import { formatOrderMoney, OrderPaymentSummary } from '@/app/components/OrderDetailBlocks';
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

export function getOrderFilterFromSearch(search: string): OrderFilter {
  const requestedFilter = new URLSearchParams(search).get('filter');
  return requestedFilter === 'pending' || requestedFilter === 'complete' ? requestedFilter : 'all';
}

interface OrganizerContactSelection {
  contact: ContactTarget;
  contextSummary: string;
}

const TEMPORARILY_HIDDEN_ORDER_IDS = new Set(['ord-gear-001']);

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



export function OrdersPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { registrationQueueEntries, entryAttendance, guestEntryQRs, teamPlayerAccess, teamPlayerRoster } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>(() => getOrderFilterFromSearch(search));
  const orders = useMemo(() => buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
  }), [entryAttendance, guestEntryQRs, registrationQueueEntries, teamPlayerAccess, teamPlayerRoster]);

  useEffect(() => {
    setActiveFilter(getOrderFilterFromSearch(search));
  }, [search]);

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
              <GroupedRegistrationList
                order={order}
                entries={registrationEntries}
                onContactOrganizer={(entry) => openOrganizerContact(entry)}
              />
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
