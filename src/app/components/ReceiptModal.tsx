/**
 * @file ReceiptModal.tsx
 * @description A polished receipt modal rendered via Radix Dialog.
 *
 * Shows order summary, line items with pricing, fees, discounts,
 * payment info, and the confirmation reference. Visually styled to
 * resemble a real digital receipt with the app's green accent.
 */

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Download,
  Receipt,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  MapPin,
  CreditCard,
  Hash,
} from 'lucide-react';
import { type MyTicket } from '@/app/data/tickets';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import { IconButton } from '@/app/components/IconButton';

// ---------------------------------------------------------------------------
// Mock receipt data generator
// ---------------------------------------------------------------------------

interface ReceiptLineItem {
  label: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface ReceiptData {
  orderId: string;
  purchaseDate: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  organizer: string;
  lineItems: ReceiptLineItem[];
  subtotal: number;
  serviceFee: number;
  discount: number;
  discountCode: string | null;
  total: number;
  paymentMethod: string;
  paymentLast4: string;
  confirmationRef: string;
  currency: string;
}

/** Deterministic mock prices based on ticket type. */
function generateReceiptData(ticket: MyTicket): ReceiptData {
  const prices: Record<string, number> = {
    '10K Category': 1500,
    'VIP Courtside': 5000,
    'Singles Entry': 2500,
    'Team of 4': 3200,
    'Individual Entry': 8500,
  };

  const unitPrice = prices[ticket.ticketTypeName] ?? 2000;
  const qty = ticket.quantity;
  const lineTotal = unitPrice * qty;

  const serviceFee = Math.round(lineTotal * 0.05);
  const hasDiscount = ticket.id === 'tkt-001' || ticket.id === 'tkt-005';
  const discount = hasDiscount ? Math.round(lineTotal * 0.1) : 0;
  const discountCode = hasDiscount ? 'EARLYBIRD10' : null;
  const total = lineTotal + serviceFee - discount;

  return {
    orderId: `ORD-${ticket.confirmationRef.replace('MNL-2025-', '')}`,
    purchaseDate: ticket.purchaseDate,
    eventTitle: ticket.eventTitle,
    eventDate: ticket.eventDate,
    eventLocation: ticket.eventLocation,
    organizer: ticket.organizer,
    lineItems: [
      {
        label: ticket.ticketTypeName,
        qty,
        unitPrice,
        total: lineTotal,
      },
    ],
    subtotal: lineTotal,
    serviceFee,
    discount,
    discountCode,
    total,
    paymentMethod: 'Visa',
    paymentLast4: '4242',
    confirmationRef: ticket.confirmationRef,
    currency: 'PHP',
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number, currency: string) {
  return `${currency === 'PHP' ? '₱' : '$'}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[#64748b] hover:text-[#177564] transition-colors"
      title="Copy"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-[#059669]" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ReceiptModalProps {
  ticket: MyTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReceiptModal({ ticket, open, onOpenChange }: ReceiptModalProps) {
  if (!ticket) return null;

  const receipt = generateReceiptData(ticket);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

        {/* Modal */}
        <Dialog.Content className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="relative w-full sm:max-w-[440px] max-h-[92vh] bg-white rounded-t-[20px] sm:rounded-[16px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 fade-in duration-300 overflow-hidden">
            {/* ---- Header ---- */}
            <div className="relative px-5 pt-5 pb-4 bg-gradient-to-b from-[#f0fdf9] to-white border-b border-[#def2ee]">
              {/* Drag indicator (mobile) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-1 rounded-full bg-[#cbd5e1] sm:hidden" />

              <div className="flex items-start justify-between mt-2 sm:mt-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#177564]/10 flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5 text-[#177564]" />
                  </div>
                  <div>
                    <Dialog.Title className="text-[18px] font-semibold text-[#181d27] leading-tight">
                      Order Receipt
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Detailed receipt for your order including line items, fees, and payment information.
                    </Dialog.Description>
                    <p className="text-[12px] text-[#64748b] font-medium mt-0.5">
                      {receipt.orderId}
                    </p>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <IconButton aria-label="Close receipt">
                    <X className="w-4 h-4" />
                  </IconButton>
                </Dialog.Close>
              </div>

              {/* Paid badge */}
              <div className="flex items-center gap-1.5 mt-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[#065f46] text-[12px] font-semibold">
                  Payment Confirmed
                </span>
                <span className="text-[#94a3b8] text-[12px]">
                  &middot; {receipt.purchaseDate}
                </span>
              </div>
            </div>

            {/* ---- Scrollable body ---- */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 flex flex-col gap-5">
              {/* Event Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[16px] font-semibold text-[#181d27] leading-snug">
                  {receipt.eventTitle}
                </h3>
                <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-wider">
                  {receipt.organizer}
                </p>
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                    <Calendar className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                    {receipt.eventDate}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                    <MapPin className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                    {receipt.eventLocation}
                  </div>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="border-t border-dashed border-[#e2e8f0]" />

              {/* Line Items */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Order Summary
                </span>

                {receipt.lineItems.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#181d27]">{item.label}</p>
                      <p className="text-[12px] text-[#94a3b8] mt-0.5">
                        {item.qty} &times; {formatCurrency(item.unitPrice, receipt.currency)}
                      </p>
                    </div>
                    <span className="text-[14px] font-semibold text-[#181d27] whitespace-nowrap">
                      {formatCurrency(item.total, receipt.currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2 bg-[#f8fafc] rounded-[10px] p-3.5">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#64748b]">Subtotal</span>
                  <span className="text-[#181d27] font-medium">
                    {formatCurrency(receipt.subtotal, receipt.currency)}
                  </span>
                </div>

                {/* Service fee */}
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#64748b]">Service Fee (5%)</span>
                  <span className="text-[#181d27] font-medium">
                    {formatCurrency(receipt.serviceFee, receipt.currency)}
                  </span>
                </div>

                {/* Discount */}
                {receipt.discount > 0 && (
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#059669]">Discount</span>
                      <span className="text-[10px] font-semibold bg-[#ecfdf5] text-[#065f46] px-1.5 py-0.5 rounded-full border border-[#a7f3d0]">
                        {receipt.discountCode}
                      </span>
                    </div>
                    <span className="text-[#059669] font-medium">
                      -{formatCurrency(receipt.discount, receipt.currency)}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-[#e2e8f0] my-1" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-[#181d27]">Total</span>
                  <span className="text-[18px] font-bold text-[#177564]">
                    {formatCurrency(receipt.total, receipt.currency)}
                  </span>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="border-t border-dashed border-[#e2e8f0]" />

              {/* Payment & Reference Info */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Payment Details
                </span>

                {/* Payment method */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                    <CreditCard className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                    {receipt.paymentMethod} ending in {receipt.paymentLast4}
                  </div>
                </div>

                {/* Confirmation ref */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                    <Hash className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                    <span className="font-mono font-medium">{receipt.confirmationRef}</span>
                  </div>
                  <CopyButton value={receipt.confirmationRef} />
                </div>
              </div>
            </div>

            {/* ---- Footer ---- */}
            <div className="border-t border-[#f1f5f9] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex gap-3">
              <SecondaryButton
                onClick={() => {
                  // In production this would trigger a PDF download
                  window.print();
                }}
                fullWidth
                tone="neutral"
                className="rounded-[10px] py-3 text-[14px]"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </SecondaryButton>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
