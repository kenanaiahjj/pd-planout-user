/**
 * @file GetTicketsModal.tsx
 * @description Bottom-sheet modal for purchasing tickets, featuring two views:
 * - Guided: Multi-step wizard (experience → category → age → review)
 * - List: Browse all available tickets with category filters and add-to-cart
 *
 * Matches Figma designs for GetTickets guided flow & ticket list.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Minus, ChevronRight, ArrowLeft, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TicketCategory = 'Beginner' | 'Intermediate' | 'Advanced/Open';
export type TicketGender = 'Double Male' | 'Double Female' | 'Single';
export type TicketAge = '15 & below' | '15-30' | '30 & older';
type GuidedStep = 'start' | 'experience' | 'category' | 'age' | 'review';

export interface TicketOption {
  id: string;
  category: TicketCategory;
  gender: TicketGender;
  ageGroup: TicketAge;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
}

interface CartItem {
  ticketId: string;
  qty: number;
  category: string;
  price: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const EXPERIENCE_LEVELS: TicketCategory[] = ['Beginner', 'Intermediate', 'Advanced/Open'];
const CATEGORIES: TicketGender[] = ['Double Male', 'Double Female', 'Single'];
const AGE_GROUPS: TicketAge[] = ['15 & below', '15-30', '30 & older'];

const PRICE_MAP: Record<TicketCategory, Record<TicketAge, { price: number; originalPrice?: number }>> = {
  'Beginner': {
    '15 & below': { price: 1000, originalPrice: 1200 },
    '15-30': { price: 950, originalPrice: 1200 },
    '30 & older': { price: 1200 },
  },
  'Intermediate': {
    '15 & below': { price: 1500, originalPrice: 1800 },
    '15-30': { price: 1500, originalPrice: 1800 },
    '30 & older': { price: 1500 },
  },
  'Advanced/Open': {
    '15 & below': { price: 2000 },
    '15-30': { price: 2000 },
    '30 & older': { price: 2500 },
  },
};

const DESC_MAP: Record<TicketCategory, string> = {
  'Beginner': 'Beginner level competition for players just starting their journey! Requirements: Valid ID or birth certificate, and signed waiver required at check-in.',
  'Intermediate': 'Intermediate level competition for players with tournament experience. Requirements: Valid ID, previous tournament record, and signed waiver required at check-in.',
  'Advanced/Open': 'Advanced/Open level competition for experienced players seeking top-tier competition. Requirements: Valid ID, ranking proof, and signed waiver required at check-in.',
};

function buildTicket(exp: TicketCategory, cat: TicketGender, age: TicketAge): TicketOption {
  const pricing = PRICE_MAP[exp][age];
  const id = `guided-${exp}-${cat}-${age}`.replace(/[^a-zA-Z0-9-]/g, '');
  return {
    id,
    category: exp,
    gender: cat,
    ageGroup: age,
    name: `${exp} ${cat} - ${age}`,
    price: pricing.price,
    originalPrice: pricing.originalPrice,
    description: `${exp} level ${cat.toLowerCase() === 'single' ? 'singles' : 'doubles'} competition for ${cat.toLowerCase().includes('male') ? 'male' : cat.toLowerCase().includes('female') ? 'female' : ''} players aged ${age}. ${DESC_MAP[exp]}`,
  };
}

// All tickets for list view
export const ALL_TICKETS: TicketOption[] = EXPERIENCE_LEVELS.flatMap((exp) =>
  CATEGORIES.flatMap((cat) =>
    AGE_GROUPS.map((age) => buildTicket(exp, cat, age))
  )
);

export function formatTicketPrice(price: number): string {
  return `₱${price.toLocaleString()}`;
}

export function getCheapestTicketPrice(tickets: TicketOption[] = ALL_TICKETS): number | null {
  if (tickets.length === 0) return null;
  return Math.min(...tickets.map((ticket) => ticket.price));
}

export function getCheapestTicketPriceLabel(tickets: TicketOption[] = ALL_TICKETS): string {
  const cheapestPrice = getCheapestTicketPrice(tickets);
  return cheapestPrice === null ? 'Price unavailable' : `From ${formatTicketPrice(cheapestPrice)}`;
}

type FilterKey = 'All' | TicketCategory;
const FILTER_KEYS: FilterKey[] = ['All', 'Beginner', 'Intermediate', 'Advanced/Open'];

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function ViewToggle({ view, onChange }: { view: 'guided' | 'list'; onChange: (v: 'guided' | 'list') => void }) {
  return (
    <div className="relative flex items-center bg-slate-200/40 rounded-full border border-white/20 shadow-[0_2px_8px_rgba(15,23,42,0.02),inset_0_0.5px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl h-[28px] w-[105px] shrink-0 p-[2px]">
      <motion.div
        layout
        className="absolute top-[2px] h-[22px] bg-white/95 rounded-full shadow-[0px_1.5px_4px_rgba(10,13,18,0.04),0px_0.5px_1.5px_rgba(10,13,18,0.03)] border border-white/10"
        style={{
          left: view === 'guided' ? 2 : 61,
          width: view === 'guided' ? 59 : 42,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      <button
        onClick={() => onChange('guided')}
        className={`relative z-10 w-[59px] text-center text-[10px] font-bold leading-[15px] transition-colors cursor-pointer ${
          view === 'guided' ? 'text-[#177564]' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Guided
      </button>
      <button
        onClick={() => onChange('list')}
        className={`relative z-10 w-[42px] text-center text-[10px] font-bold leading-[15px] transition-colors cursor-pointer ${
          view === 'list' ? 'text-[#177564]' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        List
      </button>
    </div>
  );
}

/** Cart-consistent compact stepper for ticket list cards */
function CompactStepper({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-[3px] bg-slate-100/80 border border-slate-200/50 rounded-[8px] p-[3px]">
      <button
        onClick={onRemove}
        disabled={qty <= 0}
        className="w-[24px] h-[24px] bg-white rounded-[6px] flex items-center justify-center shrink-0 text-slate-650 disabled:text-slate-300 disabled:bg-white/40 disabled:cursor-not-allowed shadow-[0_0.5px_1px_rgba(15,23,42,0.05)] border border-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-[13px] font-bold text-slate-800 leading-none text-center min-w-[18px] tabular-nums select-none px-1">{qty}</span>
      <button
        onClick={onAdd}
        className="w-[24px] h-[24px] bg-white rounded-[6px] flex items-center justify-center shrink-0 text-slate-650 shadow-[0_0.5px_1px_rgba(15,23,42,0.05)] border border-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

/** Larger stepper for the guided review card (matches Figma review design) */
function ReviewStepper({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <div className="bg-slate-100/80 border border-slate-200/50 h-[38px] rounded-[10px] w-[112px] flex items-center justify-between px-[4px]">
      <button
        onClick={onRemove}
        disabled={qty <= 0}
        className="w-[30px] h-[30px] bg-white rounded-[8px] flex items-center justify-center shrink-0 text-slate-650 disabled:text-slate-300 disabled:bg-white/40 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(15,23,42,0.05)] border border-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="text-[16px] font-bold text-slate-800 leading-none text-center min-w-[24px] tabular-nums select-none">{qty}</span>
      <button
        onClick={onAdd}
        className="w-[30px] h-[30px] bg-white rounded-[8px] flex items-center justify-center shrink-0 text-slate-650 shadow-[0_1px_2px_rgba(15,23,42,0.05)] border border-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/** Footer shared across guided and list views */
function ModalFooter({
  totalAmount,
  totalItems,
  hasItems,
  onAddToCart,
  onCheckout,
  isProcessing,
}: {
  totalAmount: number;
  totalItems: number;
  hasItems: boolean;
  onAddToCart: () => void;
  onCheckout: () => void;
  isProcessing: 'cart' | 'checkout' | null;
}) {
  const disabled = !hasItems || !!isProcessing;
  const itemLabel = `${totalItems} ${totalItems === 1 ? 'ticket' : 'tickets'}`;

  return (
    <div className="border-t border-slate-100 bg-gradient-to-b from-white/96 to-[#f7fbfa] px-4 pt-3 pb-4 shadow-[0_-14px_34px_rgba(15,23,42,0.07)] shrink-0 sm:px-5 sm:pb-5">
      <div className="rounded-[18px] border border-white/80 bg-white/92 p-3.5 shadow-[0_16px_34px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold leading-none text-slate-500">
              Total amount
            </p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-[24px] font-bold leading-none tracking-tight text-[#177564] tabular-nums">
                ₱{totalAmount.toLocaleString()}
              </p>
              {hasItems && (
                <span className="rounded-full border border-[#d8eee9] bg-[#f0fdf9] px-2 py-1 text-[11px] font-semibold leading-none text-[#177564]">
                  {itemLabel}
                </span>
              )}
            </div>
          </div>
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf7f5] text-[#177564] sm:flex">
            <Plus className="h-[18px] w-[18px]" strokeWidth={2} />
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-2.5">
          <SecondaryButton
            onClick={onAddToCart}
            disabled={disabled}
            className="h-[46px] min-w-0 rounded-[14px] px-2 text-[12px] font-bold sm:text-[13px]"
          >
            {isProcessing === 'cart' ? (
              <div className="w-5 h-5 border-2 border-[#177564] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="h-[17px] w-[17px] shrink-0" strokeWidth={2.2} />
                <span className="truncate">Add to Cart</span>
              </>
            )}
          </SecondaryButton>

          <PrimaryButton
            onClick={onCheckout}
            disabled={disabled}
            className="h-[46px] min-w-0 rounded-[14px] px-2 text-[13px] font-bold sm:text-[14px]"
          >
            {isProcessing === 'checkout' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="truncate">Checkout</span>
                <ChevronRight className="h-[18px] w-[18px] shrink-0" />
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Guided-flow sub-components
// ---------------------------------------------------------------------------

/** Breadcrumb bar showing progress through guided steps */
function GuidedBreadcrumb({
  experience,
  category,
  age,
  currentStep,
  onNavigate,
}: {
  experience: TicketCategory | null;
  category: TicketGender | null;
  age: TicketAge | null;
  currentStep: GuidedStep;
  onNavigate: (step: GuidedStep) => void;
}) {
  const stepLabels: { step: GuidedStep; label: string | null; nextLabel: string }[] = [
    { step: 'experience', label: experience, nextLabel: experience ? '' : 'Level' },
    { step: 'category', label: category, nextLabel: category ? '' : 'Category' },
    { step: 'age', label: age, nextLabel: age ? '' : 'Age Category' },
    { step: 'review', label: null, nextLabel: 'Review' },
  ];

  const chevron = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M4.5 9L7.5 6L4.5 3" stroke="#D1D5DC" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Grid icon
  const gridIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="#99A1AF" strokeWidth="1.17" />
      <rect x="8.5" y="1" width="4.5" height="4.5" rx="1" stroke="#99A1AF" strokeWidth="1.17" />
      <rect x="1" y="8.5" width="4.5" height="4.5" rx="1" stroke="#99A1AF" strokeWidth="1.17" />
      <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1" stroke="#99A1AF" strokeWidth="1.17" />
    </svg>
  );

  const stepOrder: GuidedStep[] = ['experience', 'category', 'age', 'review'];
  const currentIdx = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {gridIcon}
      {stepLabels.map((item, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = item.step === currentStep;
        const label = isCompleted ? item.label : item.nextLabel;
        if (!label && !isCompleted) return null;

        return (
          <div key={item.step} className="contents">
            {chevron}
            <button
              onClick={() => isCompleted ? onNavigate(item.step) : undefined}
              className={`text-[11px] font-semibold leading-[16px] whitespace-nowrap shrink-0 px-2.5 py-0.5 rounded-full transition-all ${
                isCompleted
                  ? 'text-[#177564] bg-[#f0fdf9] hover:bg-[#def2ee] cursor-pointer'
                  : isCurrent
                  ? 'text-slate-800 bg-slate-100 cursor-default'
                  : 'text-slate-400 cursor-default'
              }`}
            >
              {label || item.nextLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Option row for guided selection steps */
function OptionRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#f8fafc]/80 border border-slate-200/60 h-[50px] rounded-[12px] px-4 flex items-center justify-between hover:bg-slate-100/70 hover:border-[#177564]/30 hover:shadow-[0_4px_16px_rgba(15,23,42,0.02)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.985] cursor-pointer group"
    >
      <span className="text-slate-800 text-[14px] font-semibold tracking-tight transition-colors group-hover:text-[#177564]">
        {label}
      </span>
      <div className="w-6.5 h-6.5 bg-white border border-slate-200/80 rounded-[8px] flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] group-hover:border-[#177564]/30 group-hover:bg-[#f0fdf9] transition-all">
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#177564] group-hover:translate-x-0.5 transition-all duration-300" />
      </div>
    </button>
  );
}

/** Review card for the final guided step */
function ReviewCard({
  ticket,
  qty,
  onAdd,
  onRemove,
}: {
  ticket: TicketOption;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const tags = [ticket.category, ticket.gender, ticket.ageGroup];
  return (
    <div className="relative p-[1.5px] rounded-[16px] bg-slate-100/80 border border-slate-200/40 shadow-[0_4px_20px_rgba(15,23,42,0.015)] overflow-hidden">
      <div className="relative rounded-[calc(16px-1.5px)] bg-white p-5 flex flex-col gap-3.5 overflow-hidden">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-slate-50 border border-slate-200/50 text-slate-500 text-[10px] font-semibold leading-[14px] uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-slate-900 text-[18px] font-bold leading-[24px] tracking-tight">
          {ticket.name}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-[13px] font-normal leading-[19px]">
          {ticket.description}
        </p>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Price + Quantity */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-slate-400 text-[10px] font-bold leading-[14px] tracking-[0.5px] uppercase">
              Price
            </p>
            <p className="text-[#177564] text-[22px] font-bold leading-[28px]">
              ₱{ticket.price.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col gap-0.5 items-end">
            <p className="text-slate-400 text-[10px] font-bold leading-[14px] tracking-[0.5px] uppercase">
              Quantity
            </p>
            <ReviewStepper qty={qty} onAdd={onAdd} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// List-view ticket card
// ---------------------------------------------------------------------------

function TicketCard({
  ticket,
  qty,
  onAdd,
  onRemove,
}: {
  ticket: TicketOption;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const tags = [ticket.category, ticket.gender, ticket.ageGroup];
  return (
    <div className="relative p-[1.5px] rounded-[14px] bg-slate-100/80 border border-slate-200/40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300">
      <div className="relative rounded-[calc(14px-1.5px)] bg-white p-4 flex gap-3 relative">
        <div className="pt-1 shrink-0">
          <ChevronRight className="w-4 h-4 text-slate-350" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-50 border border-slate-200/50 text-slate-500 text-[9.5px] font-semibold leading-[13px] uppercase tracking-wide px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-slate-800 text-[15px] font-bold leading-[1.375] tracking-[-0.23px]">
            {ticket.name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-baseline gap-1.5">
            {ticket.originalPrice && (
              <span className="text-[#99a1af] text-[12px] line-through opacity-70">
                ₱{ticket.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[#177564] text-[18px] font-bold leading-[28px]">
              ₱{ticket.price.toLocaleString()}
            </span>
          </div>
          {qty === 0 ? (
            <button
              onClick={onAdd}
              className="w-[28px] h-[28px] rounded-[9px] bg-[#177564] shadow-[0_2px_6px_rgba(23,117,100,0.25)] flex items-center justify-center hover:bg-[#136354] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" strokeWidth={1.5} />
            </button>
          ) : (
            <CompactStepper qty={qty} onAdd={onAdd} onRemove={onRemove} />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main modal component
// ---------------------------------------------------------------------------

interface GetTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (items: CartItem[], totalAmount: number) => void;
  onCheckout?: (items: CartItem[], totalAmount: number) => void;
}

export function GetTicketsModal({ isOpen, onClose, onAddToCart, onCheckout }: GetTicketsModalProps) {
  const [view, setView] = useState<'guided' | 'list'>('guided');

  // -- Guided state --
  const [guidedStep, setGuidedStep] = useState<GuidedStep>('start');
  const [selectedExperience, setSelectedExperience] = useState<TicketCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TicketGender | null>(null);
  const [selectedAge, setSelectedAge] = useState<TicketAge | null>(null);
  const [guidedQty, setGuidedQty] = useState(0);

  // -- List state --
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [listCart, setListCart] = useState<Record<string, number>>({});

  // Guided ticket
  const guidedTicket = useMemo(() => {
    if (selectedExperience && selectedCategory && selectedAge) {
      return buildTicket(selectedExperience, selectedCategory, selectedAge);
    }
    return null;
  }, [selectedExperience, selectedCategory, selectedAge]);

  // Totals
  const guidedTotal = guidedTicket ? guidedTicket.price * guidedQty : 0;

  const listTotal = useMemo(() => {
    return Object.entries(listCart).reduce((sum, [id, qty]) => {
      const ticket = ALL_TICKETS.find((t) => t.id === id);
      return sum + (ticket ? ticket.price * qty : 0);
    }, 0);
  }, [listCart]);

  const listTotalItems = useMemo(() => {
    return Object.values(listCart).reduce((sum, qty) => sum + qty, 0);
  }, [listCart]);

  const totalAmount = view === 'guided' ? guidedTotal : listTotal;
  const totalItems = view === 'guided' ? guidedQty : listTotalItems;
  const hasItems = totalItems > 0;

  const cartItems = useMemo<CartItem[]>(() => {
    if (view === 'guided' && guidedTicket && guidedQty > 0) {
      return [
        {
          ticketId: guidedTicket.id,
          qty: guidedQty,
          category: guidedTicket.name,
          price: guidedTicket.price,
        },
      ];
    }
    return Object.entries(listCart)
      .filter(([, qty]) => qty > 0)
      .map(([ticketId, qty]) => {
        const ticket = ALL_TICKETS.find((t) => t.id === ticketId);
        return {
          ticketId,
          qty,
          category: ticket?.name ?? ticketId.replace(/^guided-/, '').replace(/-/g, ' '),
          price: ticket?.price ?? 0,
        };
      });
  }, [view, guidedTicket, guidedQty, listCart]);

  // Filtered tickets for list
  const filteredTickets = useMemo(() => {
    if (activeFilter === 'All') return ALL_TICKETS;
    return ALL_TICKETS.filter((t) => t.category === activeFilter);
  }, [activeFilter]);

  // -- Processing state --
  const [isProcessing, setIsProcessing] = useState<'cart' | 'checkout' | null>(null);

  const checkAvailability = useCallback(async (type: 'cart' | 'checkout') => {
    setIsProcessing(type);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // 10% chance of failure for regular flow
        const shouldFail = Math.random() < 0.1; 
        if (shouldFail) {
          import('sonner').then(({ toast }) => {
            toast.error('Item No Longer Available', {
              description: 'We\'re sorry, but this ticket type just sold out and is no longer available.',
              duration: 4000,
            });
          });
          setIsProcessing(null);
          resolve(false);
        } else {
          setIsProcessing(null);
          resolve(true);
        }
      }, 1000);
    });
  }, []);

  // -- Handlers --
  const handleAddToCart = useCallback(async () => {
    const ok = await checkAvailability('cart');
    if (ok) onAddToCart?.(cartItems, totalAmount);
  }, [checkAvailability, onAddToCart, cartItems, totalAmount]);

  const handleCheckout = useCallback(async () => {
    const ok = await checkAvailability('checkout');
    if (ok) onCheckout?.(cartItems, totalAmount);
  }, [checkAvailability, onCheckout, cartItems, totalAmount]);

  const handleListAdd = useCallback((id: string) => {
    setListCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const handleListRemove = useCallback((id: string) => {
    setListCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  }, []);

  const resetGuided = useCallback(() => {
    setGuidedStep('start');
    setSelectedExperience(null);
    setSelectedCategory(null);
    setSelectedAge(null);
    setGuidedQty(0);
  }, []);

  const goBack = useCallback(() => {
    const stepBack: Record<GuidedStep, GuidedStep> = {
      start: 'start',
      experience: 'start',
      category: 'experience',
      age: 'category',
      review: 'age',
    };
    const prev = stepBack[guidedStep];
    setGuidedStep(prev);
    if (prev === 'start') {
      setSelectedExperience(null);
      setSelectedCategory(null);
      setSelectedAge(null);
      setGuidedQty(0);
    } else if (prev === 'experience') {
      setSelectedCategory(null);
      setSelectedAge(null);
      setGuidedQty(0);
    } else if (prev === 'category') {
      setSelectedAge(null);
      setGuidedQty(0);
    }
  }, [guidedStep]);

  const navigateToBreadcrumb = useCallback((step: GuidedStep) => {
    setGuidedStep(step);
    if (step === 'experience') {
      setSelectedCategory(null);
      setSelectedAge(null);
      setGuidedQty(0);
    } else if (step === 'category') {
      setSelectedAge(null);
      setGuidedQty(0);
    } else if (step === 'age') {
      setGuidedQty(0);
    }
  }, []);

  const handleViewChange = useCallback((v: 'guided' | 'list') => {
    setView(v);
  }, []);

  const showGuidedNav = view === 'guided' && guidedStep !== 'start';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-[101] sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[420px] sm:max-w-[calc(100vw-32px)] fixed-bottom-ios"
          >
            <div className="bg-white rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] flex flex-col max-h-[85vh] sm:max-h-[80vh]">

              {/* ---- Header ---- */}
              <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 h-[60px] shrink-0">
                <div className="flex items-center gap-3">
                  {showGuidedNav && (
                    <>
                      <button
                        onClick={goBack}
                        className="w-7.5 h-7.5 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors active:scale-95 cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={resetGuided}
                        className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors active:scale-95 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <p className="text-slate-900 text-[18px] font-bold leading-[28px] tracking-tight">Get Tickets</p>
                </div>
                <div className="flex items-center gap-3">
                  <ViewToggle view={view} onChange={handleViewChange} />
                  <button
                    onClick={onClose}
                    className="w-7.5 h-7.5 rounded-full bg-slate-100/80 hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ---- Body ---- */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <AnimatePresence mode="wait" initial={false}>
                  {view === 'guided' ? (
                    <motion.div
                      key={`guided-${guidedStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pt-6 pb-4 flex flex-col gap-4"
                    >
                      {/* Breadcrumb (steps 2-5) */}
                      {guidedStep !== 'start' && (
                        <GuidedBreadcrumb
                          experience={selectedExperience}
                          category={selectedCategory}
                          age={selectedAge}
                          currentStep={guidedStep}
                          onNavigate={navigateToBreadcrumb}
                        />
                      )}

                      {/* Step content */}
                      {guidedStep === 'start' && (
                        <div>
                          <p className="text-slate-800 text-[15.5px] font-bold leading-none tracking-tight mb-5">
                            Let's find the perfect tickets for you:
                          </p>
                          <PrimaryButton
                            fullWidth
                            onClick={() => setGuidedStep('experience')}
                            className="h-[48px] rounded-[12px] text-[13px] uppercase tracking-[0.325px]"
                          >
                            Get Started
                          </PrimaryButton>
                        </div>
                      )}

                      {guidedStep === 'experience' && (
                        <div className="flex flex-col gap-3">
                          <p className="text-slate-800 text-[15.5px] font-bold leading-none tracking-tight mb-1">
                            Select your experience level:
                          </p>
                          {EXPERIENCE_LEVELS.map((level) => (
                            <OptionRow
                              key={level}
                              label={level}
                              onClick={() => {
                                setSelectedExperience(level);
                                setGuidedStep('category');
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {guidedStep === 'category' && (
                        <div className="flex flex-col gap-3">
                          <p className="text-slate-800 text-[15.5px] font-bold leading-none tracking-tight mb-1">
                            Select your category:
                          </p>
                          {CATEGORIES.map((cat) => (
                            <OptionRow
                              key={cat}
                              label={cat}
                              onClick={() => {
                                setSelectedCategory(cat);
                                setGuidedStep('age');
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {guidedStep === 'age' && (
                        <div className="flex flex-col gap-3">
                          <p className="text-slate-800 text-[15.5px] font-bold leading-none tracking-tight mb-1">
                            Select your age category:
                          </p>
                          {AGE_GROUPS.map((age) => (
                            <OptionRow
                              key={age}
                              label={age}
                              onClick={() => {
                                setSelectedAge(age);
                                setGuidedStep('review');
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {guidedStep === 'review' && guidedTicket && (
                        <div className="flex flex-col gap-3">
                          <p className="text-slate-800 text-[15.5px] font-bold leading-none tracking-tight mb-1">
                            Review selection:
                          </p>
                          <ReviewCard
                            ticket={guidedTicket}
                            qty={guidedQty}
                            onAdd={() => setGuidedQty((q) => q + 1)}
                            onRemove={() => setGuidedQty((q) => Math.max(0, q - 1))}
                          />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <div className="px-6 pt-6 pb-3">
                        <p className="text-slate-800 text-[15.5px] font-bold leading-none tracking-tight mb-4">
                          Browse all available tickets:
                        </p>
                        <div
                          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
                          style={{ scrollbarWidth: 'none' }}
                        >
                          {FILTER_KEYS.map((key) => {
                            const isActive = activeFilter === key;
                            return (
                              <button
                                key={key}
                                onClick={() => setActiveFilter(key)}
                                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold leading-[16.5px] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-[#177564] text-white border border-[#177564] shadow-[0_2px_8px_rgba(23,117,100,0.2)]'
                                    : 'bg-slate-50 border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                }`}
                              >
                                {key}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="px-6 pb-4 flex flex-col gap-3">
                        {filteredTickets.map((ticket) => (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            qty={listCart[ticket.id] || 0}
                            onAdd={() => handleListAdd(ticket.id)}
                            onRemove={() => handleListRemove(ticket.id)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ---- Footer ---- */}
              <ModalFooter
                totalAmount={totalAmount}
                totalItems={totalItems}
                hasItems={hasItems}
                onAddToCart={handleAddToCart}
                onCheckout={handleCheckout}
                isProcessing={isProcessing}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
