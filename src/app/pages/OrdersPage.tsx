import React, { useId, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Check,
  Circle,
  Download,
  HelpCircle,
  QrCode,
  RotateCcw,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
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
  type RegistrationQueueEntry,
} from '@/app/data/tickets';
import {
  OrderPaymentSummary,
  formatOrderMoney,
} from '@/app/components/OrderDetailBlocks';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SegmentedChoice } from '@/app/components/SegmentedChoice';
type OrderFilter = 'all' | 'pending' | 'complete';
type MerchStatus = 'Processing' | 'Shipped' | 'Delivered';
type PaymentStatus = 'Paid' | 'Refunded';

export interface OrderEventEntry {
  id: string;
  ticket: MyTicket;
  entryName: string;
  participantName: string;
  attendeeEmail?: string;
  category: string;
  status: EntryStatus;
  type: 'self' | 'guest' | 'team';
  price: number;
  queueEntry?: RegistrationQueueEntry;
  teamAttachedCount?: number;
  teamTotalCount?: number;
  buyerAttending: boolean;
  attendance?: EntryAttendanceDecision;
  guestQR?: GuestEntryQRRecord;
  inviteStatus?: InviteStatus;
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
}: {
  registrationQueueEntries: RegistrationQueueEntry[];
  entryAttendance?: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs?: Record<string, GuestEntryQRRecord | undefined>;
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
      const basePrice = getTicketPrice(ticket);
      const entries: OrderEventEntry[] = ticket.participants.map((participant, participantIndex) => {
            const matchingQueue = queueEntries.find((entry) => entry.id.endsWith(participant.id));
            const participantStatus: EntryStatus =
              matchingQueue?.entryStatus ||
              ticket.entryStatus ||
              (participant.formStatus === 'completed' ? 'attached' : 'pending_form');
            // A team is one purchase with min/max players, but every player resolves
            // independently through a Passport claim or an app-less Guest QR.
            const isGuest = (ticket.ticketType === 'multiple' && !participant.isPrimary) || ticket.ticketType === 'team';

            const entryId = `${ticket.id}-${participant.id || participantIndex}`;
            return {
              id: entryId,
              ticket,
              entryName: `${ticket.eventTitle} - ${ticket.ticketTypeName} (${participant.name || participant.email || `Guest ${participantIndex + 1}`})`,
              participantName: participant.name || participant.email || `Guest ${participantIndex + 1}`,
              attendeeEmail: participant.email || undefined,
              category: ticket.ticketTypeName,
              status: participantStatus,
              type: isGuest ? 'guest' as const : 'self' as const,
              price: Math.round(basePrice / Math.max(ticket.quantity, 1)),
              queueEntry: matchingQueue,
              buyerAttending: ticket.participants.some((p) => p.isPrimary && p.formStatus === 'completed'),
              attendance: entryAttendance[entryId],
              guestQR: guestEntryQRs[entryId],
              inviteStatus: participant.inviteStatus,
            };
          });

      allEntries.push(...entries);
    });

    eventOrders.push({
      id: firstTicket.id,
      ref: ref,
      date: firstTicket.purchaseDate,
      name: tickets.length > 1
        ? `${firstTicket.eventTitle} + ${tickets.length - 1} other event${tickets.length > 2 ? 's' : ''}`
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
  const eventTotal = order.eventEntries.reduce((sum, entry) => sum + entry.price, 0);
  const merchTotal = order.merchItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return eventTotal + merchTotal;
}

function getOrderTotal(order: OrderRecord) {
  return getOrderSubtotal(order) + order.fees;
}

function getItemSummary(order: OrderRecord) {
  const eventGroups = new Map<string, { count: number; category: string }>();
  order.eventEntries.forEach((entry) => {
    const key = `${entry.ticket.eventTitle} - ${entry.category}`;
    const existing = eventGroups.get(key) || { count: 0, category: entry.category };
    existing.count++;
    eventGroups.set(key, existing);
  });
  
  const eventItems = Array.from(eventGroups.values()).map(
    (g) => `${g.count}x ${g.category}`
  );
  const merchItems = order.merchItems.map((item) => `${item.quantity}x ${item.name}`);
  return [...eventItems, ...merchItems].join(' - ');
}

function orderHasPending(order: OrderRecord) {
  return order.eventEntries.some((entry) => isPendingStatus(entry.status));
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

function StatusPills({ order }: { order: OrderRecord }) {
  const eventEntries = order.eventEntries;
  const teamEntry = eventEntries.find((entry) => entry.type === 'team' && (entry.teamAttachedCount || 0) < (entry.teamTotalCount || 0));
  const hasPending = eventEntries.some((entry) => isPendingStatus(entry.status));
  const hasAttachedEvents = eventEntries.length > 0 && eventEntries.every((entry) => isAttachedStatus(entry.status));
  return (
    <div className="flex flex-wrap gap-1.5">
      {hasPending && (
        <span className="rounded-full border border-[#facc15]/55 bg-[#fef3c7] px-2.5 py-1 text-[11px] font-bold text-[#854d0e] shadow-[0_6px_14px_-12px_rgba(133,77,14,0.75)]">
          Forms needed
        </span>
      )}
      {hasAttachedEvents && (
        <span className="rounded-full border border-[#79d8c6]/70 bg-[#d8f6ef] px-2.5 py-1 text-[11px] font-bold text-[#0f6b5f] shadow-[0_6px_14px_-12px_rgba(15,107,95,0.75)]">
          Ready for gate
        </span>
      )}
      {teamEntry && (
        <span className="rounded-full border border-[#facc15]/55 bg-[#fef3c7] px-2.5 py-1 text-[11px] font-bold text-[#854d0e] shadow-[0_6px_14px_-12px_rgba(133,77,14,0.75)]">
          {teamEntry.teamAttachedCount || 0} of {teamEntry.teamTotalCount || 0} forms complete
        </span>
      )}
    </div>
  );
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
    <div className="sticky top-0 z-10 py-3">
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

interface TicketStackTheme {
  accent: string;
  front: string;
  back: string;
  middle: string;
}

function getTicketStackTheme(order: OrderRecord): TicketStackTheme {
  const hasEvents = order.eventEntries.length > 0;
  const hasMerch = order.merchItems.length > 0;

  if (hasEvents && hasMerch) {
    return {
      accent: '#5b21b6',
      front: '#ab91ff',
      back: '#8145ef',
      middle: '#9365fb',
    };
  } else if (!hasEvents && hasMerch) {
    return {
      accent: '#3e5873',
      front: '#a6b9cc',
      back: '#536d88',
      middle: '#718ba4',
    };
  }

  return {
    accent: '#00796a',
    front: '#3fe3c8',
    back: '#129987',
    middle: '#1fc3ad',
  };
}

function TicketStackLayer({
  className,
  color,
  accent,
  isFront = false,
}: {
  className: string;
  color: string;
  accent: string;
  isFront?: boolean;
}) {
  const maskId = useId().replace(/:/g, '');

  return (
    <div
      className={`absolute h-[48px] w-[76px] shadow-[0_10px_17px_-12px_rgba(15,23,42,0.62)] transition-transform duration-200 ease-out motion-reduce:transition-none ${className}`}
      style={{
        filter: `drop-shadow(0 10px 10px ${accent}20)`,
      }}
    >
      <svg
        aria-hidden="true"
        className="block h-full w-full"
        viewBox="0 0 76 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${maskId}-fill`} x1="0" y1="0" x2="76" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={color} />
            <stop offset="0.68" stopColor={color} />
            <stop offset="1" stopColor={accent} />
          </linearGradient>
          <mask id={`${maskId}-cutouts`} maskUnits="userSpaceOnUse" x="0" y="0" width="76" height="48">
            <rect width="76" height="48" rx="13" fill="white" />
            <circle cx="0" cy="24" r="6" fill="black" />
            <circle cx="76" cy="24" r="6" fill="black" />
          </mask>
        </defs>

        <g mask={`url(#${maskId}-cutouts)`}>
          <rect width="76" height="48" rx="13" fill={`url(#${maskId}-fill)`} stroke="white" strokeOpacity="0.72" />
          <rect x="1" y="1" width="74" height="46" rx="12" stroke="white" strokeOpacity="0.22" />
          {Array.from({ length: 5 }).map((_, index) => (
            <rect key={index} x={24 + index * 6.7} y="22" width="4.5" height="3" rx="1.5" fill="white" fillOpacity="0.86" />
          ))}
          <rect x="14" y="11" width="14" height="5" rx="2.5" fill="white" fillOpacity="0.38" />
          {isFront && (
            <>
              <rect x="18" y="35" width="36" height="5" rx="2.5" fill="white" fillOpacity="0.58" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}

function TicketStackGraphic({ order }: { order: OrderRecord }) {
  const theme = getTicketStackTheme(order);
  const totalItems = order.eventEntries.length + order.merchItems.reduce((sum, item) => sum + item.quantity, 0);
  const visibleStackCount = Math.min(3, Math.max(1, totalItems));

  return (
    <div className="relative flex h-full w-full select-none items-center justify-center" aria-hidden="true">
      <div className="relative h-[82px] w-[88px]">
        {visibleStackCount >= 3 && (
          <TicketStackLayer
            color={theme.back}
            accent={theme.accent}
            className="left-[10px] top-[2px] rotate-[6deg] group-hover:-translate-y-[1px] group-hover:rotate-[8deg]"
          />
        )}
        {visibleStackCount >= 2 && (
          <TicketStackLayer
            color={theme.middle}
            accent={theme.accent}
            className={visibleStackCount === 2
              ? "left-[8px] top-[9px] rotate-[4deg] group-hover:-translate-y-[1px] group-hover:rotate-[6deg]"
              : "left-[5px] top-[12px] rotate-[2.5deg] group-hover:translate-y-[1px] group-hover:rotate-[4deg]"
            }
          />
        )}
        <TicketStackLayer
          color={theme.front}
          accent={theme.accent}
          isFront
          className={visibleStackCount === 1
            ? "left-[6px] top-[16px] rotate-[-1deg] group-hover:-translate-y-[2px] group-hover:rotate-[-2deg]"
            : visibleStackCount === 2
              ? "left-[2px] top-[22px] rotate-[-1deg] group-hover:-translate-y-[2px] group-hover:rotate-[-2deg]"
              : "left-0 top-[26px] rotate-[-1.5deg] group-hover:-translate-y-[2px] group-hover:rotate-[-3deg]"
          }
        />
        <div className="absolute bottom-[2px] left-[14px] right-[14px] h-[4px] rounded-full bg-slate-900/12 blur-[2px]" />
      </div>
    </div>
  );
}

function OrderCard({ order, onOpen }: { order: OrderRecord; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full gap-4 rounded-[22px] border border-[#dbe7e4] bg-white p-4 text-left shadow-[0_18px_42px_-34px_rgba(15,23,42,0.72),inset_0_1px_0_rgba(255,255,255,0.96)] transition-all hover:border-[#c8d8d4] hover:shadow-[0_22px_52px_-36px_rgba(15,23,42,0.82),inset_0_1px_0_rgba(255,255,255,0.98)] active:scale-[0.985]"
    >
      {/* Left: stacked order tickets */}
      <div className="h-[88px] w-[88px] shrink-0">
        <TicketStackGraphic order={order} />
      </div>

      {/* Right: Order details */}
      <div className="min-w-0 flex-1 flex flex-col justify-between min-h-[88px]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[9px] font-bold tracking-[0.3px] text-[#64748b]">{order.ref}</span>
            <span className="text-[11px] font-semibold text-[#64748b]">{order.date}</span>
          </div>
          <h2 className="mt-1.5 line-clamp-1 text-[16px] font-bold tracking-[-0.3px] text-[#181d27]">
            {order.name}
          </h2>
          <p className="mt-0.5 line-clamp-1 text-[12.5px] font-semibold text-[#71829a]">
            {getItemSummary(order)}
          </p>
        </div>

        <div className="mt-2.5 flex items-end justify-between gap-3">
          <StatusPills order={order} />
          <span className="shrink-0 text-[14.5px] font-bold text-[#181d27] leading-none">
            {formatMoney(getOrderTotal(order))}
          </span>
        </div>
      </div>
    </button>
  );
}

export function OrdersPage() {
  const navigate = useNavigate();
  const { registrationQueueEntries, entryAttendance, guestEntryQRs } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');
  const orders = useMemo(() => buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  }), [entryAttendance, guestEntryQRs, registrationQueueEntries]);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'pending') return orderHasPending(order);
    if (activeFilter === 'complete') return orderIsComplete(order);
    return true;
  });

  return (
    <div className="relative flex flex-col gap-5 pb-8">
      <div className="relative">
        <h1 className="text-[32px] font-semibold leading-none tracking-[-0.9px] text-[#181d27]">
          Orders
        </h1>
        <p className="mt-2 max-w-[560px] text-[13px] font-medium leading-relaxed text-[#64748b]">
          Manage registration items, required forms, Passport access, guest QR, and merch.
        </p>
      </div>

      <FilterTabs active={activeFilter} onChange={setActiveFilter} orders={orders} />

      <section className="flex flex-col gap-3" aria-label="Orders">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onOpen={() => navigate(`/orders/${order.id}`)}
          />
        ))}

        {filteredOrders.length === 0 && (
          <div className="rounded-[20px] border border-neutral-100 bg-white p-8 text-center">
            <EmptyStateGraphic kind="no-orders" className="h-32 w-32" />
            <p className="mt-2 text-[15px] font-semibold text-[#181d27]">No orders here</p>
            <p className="mt-1 text-[13px] text-[#64748b]">Try a different order filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function PassportBanner({ entry, orderId }: { entry: OrderEventEntry; orderId: string }) {
  const navigate = useNavigate();
  const { generateGuestEntryQR, member } = useAppContext();

  if (entry.type === 'guest' && entry.guestQR?.claimedAt) {
    return (
      <div className="mt-3 rounded-[14px] border border-[#d8ddff] bg-[#f5f7ff] p-3.5">
        <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#4338ca] ring-1 ring-[#d8ddff]">Claimed into Passport</span>
        <p className="mt-2 text-[12.5px] font-medium leading-relaxed text-[#46518f]">This Guest QR was claimed once and is permanently inactive. The entry now lives on the recipient’s Passport.</p>
      </div>
    );
  }

  if (entry.type === 'guest' && entry.status === 'attached') {
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
      navigate(`/orders/${orderId}/entry/${entry.id}/guest-qr`);
      return qr;
    };

    return (
      <div className="mt-3 rounded-[14px] border border-[#d9ece8] bg-[#f3fbf9] p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#d9ece8]">
              {entry.guestQR?.isActive ? 'Guest QR sent' : 'Guest QR ready to send'}
            </span>
            <p className="mt-2 text-[12.5px] font-medium leading-relaxed text-[#315f57]">
              The organizer form is complete for this guest. Send an app-less QR for buyer-managed gate entry.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <PrimaryButton
            type="button"
            onClick={openQr}
            compact
            className="text-[12px]"
          >
            {entry.guestQR?.isActive ? 'Manage QR' : 'Generate & send QR'}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (false && entry.type === 'team') {
    const completedCount = entry.teamAttachedCount ?? 0;
    const totalCount = entry.teamTotalCount || 0;
    const passportCount = entry.ticket.participants.filter(
      (participant) => participant.formStatus === 'completed' && participant.inviteStatus === 'accepted',
    ).length;
    const guestQrCount = entry.ticket.participants.filter(
      (participant) => participant.formStatus === 'completed' && participant.inviteStatus === 'not_invited',
    ).length;

    return (
      <div className="mt-3 rounded-[15px] border border-[#c7d2fe] bg-[linear-gradient(180deg,#f5f7ff_0%,#eef2ff_100%)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_28px_-24px_rgba(55,48,163,0.6)]">
        <span className="rounded-full border border-[#c7d2fe] bg-white/78 px-2.5 py-1 text-[11px] font-bold text-[#3730a3]">
          Team entry update
        </span>
        <p className="mt-3 text-[13px] font-semibold text-[#312e81]">
          Continue player registration
        </p>
        <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[#4338ca]">
          The buyer purchased this team package. Each player completes their own form and resolves access through their own Passport or Guest QR.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="rounded-[10px] border border-white/80 bg-white/72 px-2 py-2 text-center shadow-[0_6px_14px_-14px_rgba(15,23,42,0.45)]">
            <p className="text-[13px] font-semibold text-[#3730a3]">{completedCount}/{totalCount}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.6px] text-[#5f63a8]">Forms</p>
          </div>
          <div className="rounded-[10px] border border-white/80 bg-white/72 px-2 py-2 text-center shadow-[0_6px_14px_-14px_rgba(15,23,42,0.45)]">
            <p className="text-[13px] font-semibold text-[#3730a3]">{passportCount}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.6px] text-[#5f63a8]">Passport</p>
          </div>
          <div className="rounded-[10px] border border-white/80 bg-white/72 px-2 py-2 text-center shadow-[0_6px_14px_-14px_rgba(15,23,42,0.45)]">
            <p className="text-[13px] font-semibold text-[#3730a3]">{guestQrCount}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.6px] text-[#5f63a8]">Guest QR</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <PrimaryButton
            type="button"
            onClick={() => navigate(`/orders/${entry.ticket.id}/form?returnTo=orders`)}
            compact
            className="text-[12px]"
          >
            Complete team entries
          </PrimaryButton>
          {entry.status === 'attached' && (
            <button
              type="button"
              onClick={() => navigate('/passport')}
              className="rounded-[10px] border border-[#c7d2fe] bg-white/78 px-3 py-2 text-[12px] font-semibold text-[#3730a3] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] transition-transform active:scale-[0.98]"
            >
              View Passport
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(`/orders/${entry.ticket.id}/form?returnTo=orders`)}
            className="rounded-[10px] border border-[#c7d2fe] bg-white/78 px-3 py-2 text-[12px] font-semibold text-[#3730a3] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] transition-transform active:scale-[0.98]"
          >
            Complete player forms
          </button>
        </div>
      </div>
    );
  }

  if (entry.type === 'team' && entry.status === 'attached') {
    const completedCount = entry.teamAttachedCount ?? 0;
    const totalCount = entry.teamTotalCount || 0;
    const passportCount = entry.ticket.participants.filter(
      (participant) => participant.formStatus === 'completed' && participant.inviteStatus === 'accepted',
    ).length;
    const guestQrCount = entry.ticket.participants.filter(
      (participant) => participant.formStatus === 'completed' && participant.inviteStatus === 'not_invited',
    ).length;

    return (
      <div className="mt-3 rounded-[15px] border border-[#b7e2d9] bg-[linear-gradient(180deg,#effdf8_0%,#e6faf5_100%)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
        <p className="text-[13px] font-semibold text-[#0f6b5f]">
          Team ready for check-in
        </p>
        <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[#315f57]">
          Each player uses their own Passport or buyer-managed Guest QR at the gate. There is no team-wide gate credential.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="rounded-[10px] border border-white/80 bg-white/72 px-2 py-2 text-center shadow-[0_6px_14px_-14px_rgba(15,23,42,0.45)]">
            <p className="text-[13px] font-semibold text-[#0f6b5f]">{completedCount}/{totalCount}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.6px] text-[#5c786f]">Forms</p>
          </div>
          <div className="rounded-[10px] border border-white/80 bg-white/72 px-2 py-2 text-center shadow-[0_6px_14px_-14px_rgba(15,23,42,0.45)]">
            <p className="text-[13px] font-semibold text-[#0f6b5f]">{passportCount}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.6px] text-[#5c786f]">Passport</p>
          </div>
          <div className="rounded-[10px] border border-white/80 bg-white/72 px-2 py-2 text-center shadow-[0_6px_14px_-14px_rgba(15,23,42,0.45)]">
            <p className="text-[13px] font-semibold text-[#0f6b5f]">{guestQrCount}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.6px] text-[#5c786f]">Guest QR</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <PrimaryButton
            type="button"
            onClick={() => navigate('/passport')}
            compact
            className="text-[12px]"
          >
            View Passport
          </PrimaryButton>
          <button
            type="button"
            onClick={() => navigate(`/orders/${entry.ticket.id}/form?returnTo=orders`)}
            className="rounded-[10px] border border-[#b7e2d9] bg-white/78 px-3 py-2 text-[12px] font-semibold text-[#0f6b5f] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] transition-transform active:scale-[0.98]"
          >
            Complete player forms
          </button>
        </div>
      </div>
    );
  }

  if (entry.status === 'attached') {
    return (
      <div className="mt-3 rounded-[14px] border border-[#bfe5de] bg-[#ecfdf8] p-3">
        <p className="text-[13px] font-semibold text-[#177564]">
          Ready for gate - staff scans your universal QR.
        </p>
        <PrimaryButton
          type="button"
          onClick={() => navigate('/passport')}
          compact
          className="mt-3 text-[12px]"
        >
          View Passport
        </PrimaryButton>
      </div>
    );
  }

  if (entry.status === 'resubmit_required') {
    return (
      <div className="mt-3 rounded-[14px] border border-[#fdba74] bg-[#fff7ed] p-3">
        <p className="text-[13px] font-semibold text-[#c2410c]">
          Form update required - review and resubmit
        </p>
        <button
          type="button"
          onClick={() => navigate(`/forms/${entry.id}/diff`)}
          className="mt-3 rounded-[10px] bg-[#c2410c] px-3 py-2 text-[12px] font-semibold text-white"
        >
          Review changes
        </button>
      </div>
    );
  }

  if (entry.status === 'released') {
    return (
      <div className="mt-3 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] p-3">
        <p className="text-[13px] font-semibold text-[#b42318]">
          Spot released — form deadline missed
        </p>
        <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#991b1b]">
          The registration form was not submitted before {entry.ticket.deadline || entry.ticket.eventDate}. Your reserved spot has been returned to inventory. No refund is issued for released spots.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/events/${entry.ticket.eventId}`)}
          className="mt-3 rounded-[10px] bg-[#b42318] px-3 py-2 text-[12px] font-semibold text-white"
        >
          Check if slots available
        </button>
      </div>
    );
  }

  const isInvitedGuest = entry.type === 'guest' && entry.inviteStatus === 'invited';
  const isGuestWithoutBuyer = entry.type === 'guest' && !entry.buyerAttending;
  const isUnassignedGuest = entry.type === 'guest' && entry.inviteStatus === 'not_invited';

  const [editingEmail, setEditingEmail] = React.useState(false);
  const [emailDraft, setEmailDraft] = React.useState(entry.attendeeEmail ?? '');

  if (isInvitedGuest) {
    const handleSaveEmail = () => {
      const trimmed = emailDraft.trim();
      if (!trimmed) return;
      setEditingEmail(false);
      toast.success('Claim link resent', {
        description: `Sent to ${trimmed}`,
      });
    };

    return (
      <div className="mt-3 rounded-[14px] border border-[#d8ddff] bg-[#f5f7ff] p-3.5">
        <div className="flex flex-col gap-1.5">
          <span className="w-fit rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#3f3cc8] ring-1 ring-[#d8ddff]">
            Claim link sent
          </span>
          <p className="text-[12.5px] font-medium leading-relaxed text-[#3f4a8a]">
            {entry.attendeeEmail || 'Recipient'} will complete the organizer form and receive this entry on their Passport.
          </p>
        </div>

        {editingEmail ? (
          <div className="mt-2 flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-[#3f3cc8]">
              Send claim link to
            </label>
            <input
              type="email"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEmail();
                if (e.key === 'Escape') setEditingEmail(false);
              }}
              autoFocus
              className="w-full rounded-[10px] border border-[#c6cdfb] bg-white px-3 py-2 text-[13px] font-medium text-[#181d27] outline-none transition-shadow placeholder:text-[#64748b] focus:border-[#7775e6] focus:ring-2 focus:ring-[#7775e6]/20"
              placeholder="friend@example.com"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveEmail}
                className="flex-1 rounded-[10px] bg-[#4f46e5] px-3 py-2 text-[12px] font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Resend
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailDraft(entry.attendeeEmail ?? '');
                  setEditingEmail(false);
                }}
                className="rounded-[10px] border border-[#d8ddff] bg-white px-3 py-2 text-[12px] font-semibold text-[#4f46e5] transition-transform active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toast.success('Claim link copied', { description: entry.attendeeEmail })}
                className="rounded-[10px] bg-[#4f46e5] px-3 py-2 text-[12px] font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Copy claim link
              </button>
              <button
                type="button"
                onClick={() => setEditingEmail(true)}
                className="rounded-[10px] border border-[#d8ddff] bg-white px-3 py-2 text-[12px] font-semibold text-[#4f46e5] transition-transform active:scale-[0.98]"
              >
                Wrong email? Change
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const isTeamPlayer = entry.ticket.ticketType === 'team';
  const actionLabel = isTeamPlayer
    ? 'Complete team form'
    : (isGuestWithoutBuyer || isUnassignedGuest)
      ? 'Fill form & get QR'
      : 'Complete forms';
  const actionTarget = isTeamPlayer
    ? `/orders/${entry.ticket.id}/form?returnTo=orders`
    : (isGuestWithoutBuyer || isUnassignedGuest)
      ? `/orders/${orderId}/entry/${entry.id}/guest-qr`
      : `/orders/${entry.ticket.id}/form?returnTo=orders${entry.queueEntry?.id ? `&entryId=${entry.queueEntry.id}` : ''}`;

  return (
    <div className="mt-3 rounded-[14px] border border-[#fde68a] bg-[#fffbeb] p-3">
      <p className="text-[13px] font-semibold text-[#92400e]">
        {entry.type === 'team'
          ? `Player forms still needed - ${entry.teamAttachedCount || 0} of ${entry.teamTotalCount || 0} complete`
          : `Forms still needed - ${entryReason(entry.status)}`}
      </p>
      <button
        type="button"
        onClick={() => navigate(actionTarget)}
        className="mt-3 rounded-[10px] bg-[#b45309] px-3 py-2 text-[12px] font-semibold text-white"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function RegistrationItem({ entry, orderId }: { entry: OrderEventEntry; orderId: string }) {
  return (
    <article className="rounded-[18px] border border-[#e6eeec] bg-white p-4">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.2px] text-[#181d27]">
              {entry.entryName}
            </h3>
            <p className="mt-1 text-[12px] font-semibold text-[#8a9bb1]">
              {entry.ticket.eventDate}
            </p>
          </div>
          <span className={`shrink-0 pt-0.5 text-[13px] font-semibold ${entry.status === 'released' ? 'line-through text-[#b42318]' : 'text-[#181d27]'}`}>
            {formatMoney(entry.price)}
          </span>
        </div>
        <PassportBanner entry={entry} orderId={orderId} />
      </div>
    </article>
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
        <button
          type="button"
          onClick={() => toast.success('Tracking opened', { description: item.trackingNumber })}
          className="mt-3 rounded-[10px] border border-neutral-100 bg-white px-3 py-2 text-[12px] font-semibold text-[#64748b]"
        >
          Track package
        </button>
      )}
    </div>
  );
}

function MerchandiseItem({ item }: { item: MerchItem }) {
  return (
    <article className="rounded-[18px] border border-neutral-100 bg-white p-4">
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
    ...order.eventEntries.map((entry) => ({ id: entry.id, label: entry.entryName, amount: entry.price })),
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
      title="Payment on this order"
      statusLabel={order.paymentStatus}
      statusTone={order.paymentStatus === 'Paid' ? 'ready' : 'danger'}
    />
  );
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { registrationQueueEntries, entryAttendance, guestEntryQRs } = useAppContext();
  const orders = useMemo(() => buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  }), [entryAttendance, guestEntryQRs, registrationQueueEntries]);
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

  const guestEntries = order.eventEntries.filter((entry) => entry.type === 'guest');

  return (
    <div className="relative flex flex-col gap-5 pb-8">
      <div className="relative flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[12px] font-semibold text-[#64748b]">{order.ref}</p>
          <h1 className="mt-1 text-[27px] font-semibold leading-none tracking-[-0.8px] text-[#181d27]">
            Order details
          </h1>
          <p className="mt-3 text-[12px] font-semibold text-[#64748b]">
            Purchased {order.date}
          </p>
        </div>
      </div>

      {order.eventEntries.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-semibold tracking-[-0.3px] text-[#181d27]">Registration items</h2>
            {guestEntries.length > 0 && (
              <button
                type="button"
                onClick={() => navigate(`/orders/${order.id}/guest-manager`)}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#dbe7e4] bg-white px-3.5 text-[12px] font-semibold text-[#177564] shadow-[0_8px_20px_-18px_rgba(15,23,42,0.5)] transition-all active:scale-[0.98]"
              >
                <QrCode className="h-3.5 w-3.5" />
                Manage guest QRs
              </button>
            )}
          </div>
          {order.eventEntries.map((entry) => (
            <RegistrationItem key={entry.id} entry={entry} orderId={order.id} />
          ))}
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

      <PaymentSummary order={order} />

      {order.refunded && (
        <section className="rounded-[18px] border border-neutral-100 bg-white p-4">
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

      <div className="flex flex-wrap justify-center gap-4 pt-1 text-[13px] font-semibold text-[#64748b]">
        <button
          type="button"
          onClick={() => toast.success('Receipt prepared')}
          className="inline-flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          Download receipt
        </button>
        <button
          type="button"
          onClick={() => navigate('/settings/inbox')}
          className="inline-flex items-center gap-1.5"
        >
          <HelpCircle className="h-4 w-4" />
          Get help
        </button>
      </div>
    </div>
  );
}
