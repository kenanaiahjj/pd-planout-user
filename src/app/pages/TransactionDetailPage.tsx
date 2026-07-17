/**
 * @file TransactionDetailPage.tsx
 * @description Shows the checkout confirmation view for a past transaction —
 * Success, Pending, or Expired — mirroring the CheckoutPage confirmation states.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  TimerOff,
  ShoppingCart,
  CreditCard,
  Ticket,
  Calendar,
  Download,
} from 'lucide-react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';

import imgBannerPending from '@/assets/4ce4998c8ae664673d8b0c83a5f5d317c00d66e0.png';

// ---------------------------------------------------------------------------
// Types (mirrored from TransactionsTab so we can look up data)
// ---------------------------------------------------------------------------
interface EventLineItem {
  name: string;
  tickets: number;
  ticketType: string;
  price: number;
}

export interface Transaction {
  id: string;
  date: string;
  events: EventLineItem[];
  paymentMethod: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Expired';
}

interface TransactionDetailPageProps {
  txn: Transaction;
  onBack: () => void;
}

const fmt = (n: number) =>
  `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const totalTickets = (events: EventLineItem[]) =>
  events.reduce((s, e) => s + e.tickets, 0);

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
const STATUS_CONFIG = {
  Completed: { label: 'Completed', textColor: '#177564', bgColor: '#ecfdf5' },
  Pending:   { label: 'Pending',   textColor: '#b45309', bgColor: '#fffbeb' },
  Expired:   { label: 'Expired',   textColor: '#6b7280', bgColor: '#f3f4f6' },
};

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-[5px] rounded-full text-[12px] font-semibold whitespace-nowrap"
      style={{ color: cfg.textColor, backgroundColor: cfg.bgColor }}
    >
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Step timeline (reused across states)
// ---------------------------------------------------------------------------
function StepItem({
  index,
  done,
  active,
  title,
  desc,
}: {
  index: number;
  done?: boolean;
  active?: boolean;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative pl-8">
      <div
        className="absolute -left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center z-10"
        style={{
          backgroundColor: done ? '#177564' : active ? '#f59e0b' : '#e5e7eb',
        }}
      >
        {done ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className={`text-[11px] ${active ? 'text-white' : 'text-[#6a7282]'}`}>{index}</span>
        )}
      </div>
      <div>
        <span className="text-[#101828] text-[15px] font-medium">{title}</span>
        <p className="text-[#6a7282] text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function TransactionDetailPage({ txn, onBack }: TransactionDetailPageProps) {
  const navigate = useNavigate();
  const tickets = totalTickets(txn.events);
  const cfg = STATUS_CONFIG[txn.status];

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[22px] font-semibold text-[#181d27] leading-none tracking-tight">
              {txn.id}
            </h1>
            <StatusBadge status={txn.status} />
          </div>
          <p className="text-[#94a3b8] text-[13px] mt-0.5">{txn.date}</p>
          <p className="mt-1 text-[12px] font-medium text-[#64748b]">
            Payment ledger record. Manage access, forms, and fulfillment from Orders.
          </p>
        </div>
      </div>

      {/* ── COMPLETED ─────────────────────────────────────────────────────── */}
      {txn.status === 'Completed' && (
        <>
          {/* Banner */}
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-[#0f766e] via-[#177564] to-[#0f4f46]">
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-[22px] font-bold tracking-tight sm:text-[24px]">
                  Payment Successful
                </h2>
                <p className="mt-1 max-w-[420px] text-sm text-white/85">
                  Your payment is confirmed. Related orders now show access and form status.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
            <h4 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px] mb-6">Ledger timeline</h4>
            <div className="flex flex-col gap-8 relative">
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-[#e5e7eb]" />
              <StepItem done index={1} title="Order Confirmed" desc="Your order was received and a confirmation was sent to your email." />
              <StepItem done index={2} title="Payment Received" desc="Payment was successfully processed." />
              <StepItem done index={3} title="Event Access Ready" desc="Confirmed events are ready once payment and required forms are complete." />
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/50 p-5 sm:p-6 flex flex-col gap-3 shadow-[0px_1px_2px_0px_rgba(15,23,42,0.02)]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#1e9680]" />
                <span className="text-[#101828] text-[15px] font-semibold">Related order items</span>
              </div>
              <span className="text-[#6a7282] text-[13px]">{tickets} ticket{tickets !== 1 ? 's' : ''}</span>
            </div>
            {txn.events.map((evt, i) => (
              <div key={i} className="flex justify-between">
                <div className="flex-1 min-w-0">
                  <span className="text-[#4a5565] text-sm">Registration purchase</span>
                  <p className="text-[#181d27] text-sm font-semibold truncate">{evt.name}</p>
                  <p className="text-[#94a3b8] text-[12px]">{evt.tickets} {evt.tickets === 1 ? 'ticket' : 'tickets'} · {evt.ticketType}</p>
                </div>
                <span className="text-[#101828] text-sm font-medium tabular-nums shrink-0 ml-3">
                  {fmt(evt.tickets * evt.price)}
                </span>
              </div>
            ))}
            <div className="h-px bg-black/5 my-0.5" />
            <div className="flex items-center justify-between">
              <span className="text-[#101828] text-[15px] font-bold">Total</span>
              <span className="text-[#101828] text-[18px] font-bold tabular-nums">{fmt(txn.amount)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 flex flex-col gap-3 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
            <p className="text-[#94a3b8] text-[11px] font-semibold uppercase tracking-wider mb-1">Details</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748b]">
                <CreditCard className="w-4 h-4" />
                <span className="text-[13px]">Payment method</span>
              </div>
              <span className="text-[#181d27] text-[13px] font-medium">{txn.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748b]">
                <Ticket className="w-4 h-4" />
                <span className="text-[13px]">Total tickets</span>
              </div>
              <span className="text-[#181d27] text-[13px] font-medium">{tickets} {tickets === 1 ? 'ticket' : 'tickets'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#64748b]">
                <Calendar className="w-4 h-4" />
                <span className="text-[13px]">Date</span>
              </div>
              <span className="text-[#181d27] text-[13px] font-medium">{txn.date}</span>
            </div>
          </div>

          {/* Actions */}
          <PrimaryButton
            onClick={() => navigate('/orders')}
            fullWidth
            className="py-3.5"
          >
            View related order
          </PrimaryButton>
          <SecondaryButton fullWidth tone="neutral" className="py-3">
            <Download className="w-4 h-4" />
            Download Receipt
          </SecondaryButton>
        </>
      )}

      {/* ── PENDING ───────────────────────────────────────────────────────── */}
      {txn.status === 'Pending' && (
        <>
          {/* Banner */}
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-[#78350f] via-[#d97706] to-[#92400e]">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-6">
                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight">
                  Awaiting Payment
                </h2>
                <p className="text-sm text-white/85 mt-1 max-w-[420px]">
                  Your order is reserved. Complete payment to secure your registration items.
                </p>
              </div>
            </div>
          </div>

          {/* Payment status timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
            <h4 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px] mb-6">Ledger timeline</h4>
            <div className="flex flex-col gap-8 relative">
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-[#e5e7eb]" />
              <StepItem done index={1} title="Order Submitted" desc="Your order has been received and tickets reserved." />
              <StepItem active index={2} title="Awaiting Payment" desc="Please complete your payment to secure your registration items." />
              <StepItem index={3} title="Confirmation" desc="Passport access updates once payment is received and required forms are complete." />
            </div>
          </div>

          {/* Reserved Items */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/50 p-5 sm:p-6 flex flex-col gap-3 shadow-[0px_1px_2px_0px_rgba(15,23,42,0.02)]">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-4 h-4 text-[#d97706]" />
              <span className="text-[#101828] text-[15px] font-semibold">Pending payment scope</span>
              <div className="ml-auto inline-flex items-center gap-1 bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-[#d97706]" />
                <span className="text-[#92400e] text-[10px] font-semibold uppercase">Processing</span>
              </div>
            </div>
            {txn.events.map((evt, i) => (
              <div key={i} className="flex justify-between">
                <div className="flex-1 min-w-0">
                  <span className="text-[#4a5565] text-sm">Registration purchase</span>
                  <p className="text-[#181d27] text-sm font-semibold truncate">{evt.name}</p>
                  <p className="text-[#94a3b8] text-[12px]">{evt.tickets} {evt.tickets === 1 ? 'ticket' : 'tickets'} · {evt.ticketType}</p>
                </div>
                <span className="text-[#101828] text-sm font-medium tabular-nums shrink-0 ml-3">
                  {fmt(evt.tickets * evt.price)}
                </span>
              </div>
            ))}
            <div className="h-px bg-black/5 my-0.5" />
            <div className="flex items-center justify-between">
              <span className="text-[#101828] text-[15px] font-bold">Total</span>
              <span className="text-[#101828] text-[18px] font-bold tabular-nums">{fmt(txn.amount)}</span>
            </div>
          </div>

          {/* Help */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 flex flex-col gap-2 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
            <span className="text-[#101828] text-[15px] font-semibold">Taking longer than expected?</span>
            <p className="text-[#6a7282] text-sm leading-relaxed">
              Most payments confirm within minutes. If your payment hasn't confirmed within 24 hours, contact our support team at{' '}
              <span className="text-[#177564] font-medium">support@planout.ph</span>
            </p>
          </div>
        </>
      )}

      {/* ── EXPIRED ───────────────────────────────────────────────────────── */}
      {txn.status === 'Expired' && (
        <>
          {/* Banner */}
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-[#334155] via-[#475569] to-[#1e293b]">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-6">
                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-4">
                  <TimerOff className="w-8 h-8" />
                </div>
                <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight">
                  Session Expired
                </h2>
                <p className="text-sm text-white/80 mt-1 max-w-[420px]">
                  This checkout session timed out before payment was completed. No charges were made to your account.
                </p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-5 sm:p-6 flex gap-3 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
            <Clock className="w-5 h-5 text-[#64748b] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[#334155] text-[15px] font-semibold">Checkout Session Timed Out</span>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Sessions expire after 30 minutes to protect event inventory for all users. Your previously selected registration items may still be available — start a new checkout to secure them.
              </p>
              <p className="text-[#94a3b8] text-[12px] mt-0.5">Expired: {txn.date}</p>
            </div>
          </div>

          {/* Released Items */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/50 p-5 sm:p-6 flex flex-col gap-3 shadow-[0px_1px_2px_0px_rgba(15,23,42,0.02)]">
            <span className="text-[#64748b] text-[13px] font-semibold uppercase tracking-[0.3px]">Expired payment scope</span>
            {txn.events.map((evt, i) => (
              <div key={i} className="flex justify-between opacity-60">
                <div className="flex-1 min-w-0">
                  <span className="text-[#4a5565] text-sm line-through">Registration purchase</span>
                  <p className="text-[#181d27] text-sm font-semibold truncate line-through">{evt.name}</p>
                  <p className="text-[#94a3b8] text-[12px]">{evt.tickets} {evt.tickets === 1 ? 'ticket' : 'tickets'} · {evt.ticketType}</p>
                </div>
                <span className="text-[#94a3b8] text-sm font-medium tabular-nums shrink-0 ml-3 line-through">
                  {fmt(evt.tickets * evt.price)}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <PrimaryButton
              onClick={() => navigate('/events')}
              fullWidth
              className="py-3.5"
            >
              Browse Events
            </PrimaryButton>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 flex flex-col gap-1.5 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
              <span className="text-[#101828] text-[14px] font-semibold">Need help?</span>
              <p className="text-[#6a7282] text-sm leading-relaxed">
                If you believe this was an error, contact us at{' '}
                <span className="text-[#177564] font-medium">support@planout.ph</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
