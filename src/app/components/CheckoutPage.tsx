/**
 * @file CheckoutPage.tsx
 * @description Single-step checkout flow with participant info, payment method,
 * order summary, voucher/discount code, and purchase CTA — all on one screen.
 * After purchase, shows confirmation states (success, registered, pending, failed, expired).
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  ListChecks,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  X,
  Clock,
  ClipboardList,
  ShoppingCart,
  User,
  CalendarDays,
  Lock,
  Mail,
  RefreshCw,
  XCircle,
  TimerOff,
  Loader2,
  PartyPopper,
  CreditCard,
  Wallet,
  Minus,
  Plus,
  Tag,
  IdCard,
  Phone,
  Send,
  Wrench,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { IconButton } from './IconButton';
import { SegmentedChoice } from './SegmentedChoice';
import { FormTextField } from './FormTextField';
import { ConfirmDialog } from './ConfirmDialog';
import { useAppContext } from '@/app/context/AppContext';
import {
  OrderPaymentSummary,
} from '@/app/components/OrderDetailBlocks';
import {
  type RegistrationQueueEntry,
  type TeamPlayerAccessPath,
} from '@/app/data/tickets';

import imgGcashLogo from "@/assets/361b5ff808595f5b0ded183dc36121f71aa9d6bf.png";
import imgMayaLogo from "@/assets/65ebd716d42cf572d26c663985c86d40104a8c69.png";

// Inline SVG data-URI logo for Card (original not exported from Figma)
const imgCardLogos = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="138" height="36" viewBox="0 0 138 36"><rect x="0" y="0" width="58" height="36" rx="4" fill="#1A1F71"/><text x="29" y="24" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-style="italic" font-size="16" fill="#fff">VISA</text><g transform="translate(68,0)"><rect width="70" height="36" rx="4" fill="#f5f5f5" stroke="#e5e7eb"/><circle cx="26" cy="18" r="12" fill="#EB001B" opacity="0.9"/><circle cx="44" cy="18" r="12" fill="#F79E1B" opacity="0.9"/><path d="M35,8.6a12,12,0,0,1,0,18.8a12,12,0,0,0,0-18.8Z" fill="#FF5F00" opacity="0.9"/></g></svg>`)}`;

import imgQrphLogo from "@/assets/bb63f7a883805a79e93cdb6c0667cac5d61c6ca2.png";

import imgBannerPending from "@/assets/4ce4998c8ae664673d8b0c83a5f5d317c00d66e0.png";
import imgBannerConfirmed from "@/assets/17fe8898e771e27dee3f07a72a27733986022bbe.png";

const NUTRI_RUN_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1714962747379-93714999d5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjBjcm93ZHxlbnwxfHx8fDE3NzAxODc2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080';
const TENNIS_EVENT_IMAGE =
  'https://images.unsplash.com/photo-176128675355-2f39b4413c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBwbGF5ZXIlMjBhY3Rpb24lMjBjb3VydHxlbnwxfHx8fDE3NzAxNTE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const SWIM_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1707401252805-9019f342604b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMGNvbXBldGl0aW9uJTIwcG9vbHxlbnwxfHx8fDE3NzAxODc2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const LIPTONG_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBjYW1waW5nfGVufDF8fHx8MTc3MDk1NzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080';

// --- Types ---
interface CheckoutPageProps {
  eventName: string;
  category: string;
  price: number;
  image: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

type ConfirmationState = 'success' | 'failed' | 'expired' | 'registered' | 'pending';
type CheckoutItemMode = 'single' | 'multiple';
type CheckoutEntryOwner = 'self' | 'guest';

const VOUCHER_MAP: Record<string, number> = {
  SAVE100: 100,
  SPORT50: 50,
  RUN200: 200,
};

const CONVENIENCE_FEE_RATE = 0.04; // 4%

function PassportStatusCard({
  status,
  passportCode,
}: {
  status: 'ready' | 'locked' | 'failed' | 'pending' | 'expired';
  passportCode: string;
}) {
  const copy = {
    ready: {
      label: 'Passport Ready',
      description: 'Open your PlanOut passport at the venue. Staff scans the same QR for every event.',
      tone: 'text-[#177564]',
      bg: 'bg-[#def2ee]',
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    locked: {
      label: 'Forms Pending',
      description: 'Complete participant forms before event access is ready.',
      tone: 'text-[#d97706]',
      bg: 'bg-[#fffbeb]',
      icon: <Lock className="h-5 w-5" />,
    },
    failed: {
      label: 'Payment Failed',
      description: 'Retry payment to keep this registration moving.',
      tone: 'text-[#ef4444]',
      bg: 'bg-[#fef2f2]',
      icon: <XCircle className="h-5 w-5" />,
    },
    pending: {
      label: 'Payment Processing',
      description: 'Your passport access updates once payment is confirmed.',
      tone: 'text-[#d97706]',
      bg: 'bg-[#fffbeb]',
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
    },
    expired: {
      label: 'Session Expired',
      description: 'Reserved items were released and access was not created.',
      tone: 'text-[#64748b]',
      bg: 'bg-[#f1f5f9]',
      icon: <TimerOff className="h-5 w-5" />,
    },
  }[status];

  return (
    <div className="rounded-[18px] border border-neutral-100 bg-white p-5 shadow-[0_16px_38px_-32px_rgba(15,23,42,0.46)]">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${copy.bg} ${copy.tone}`}>
          {copy.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28px] text-[#94a3b8]">
            Passport status
          </p>
          <p className="text-[16px] font-semibold tracking-[-0.25px] text-[#101828]">
            {copy.label}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6a7282]">
            {copy.description}
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-[14px] border border-neutral-100 bg-[#f8fafc] p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#177564]">
            <IdCard className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[13px] font-semibold text-[#181d27]">
              {passportCode}
            </p>
            <p className="text-[11px] text-[#94a3b8]">Universal Passport</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment options (mocked logos)
const PAYMENT_OPTIONS = [
  {
    id: 'gcash',
    name: 'Pay with GCash',
    logo: imgGcashLogo,
    logoType: 'square' as const,
    imgClass: 'absolute h-[112.4%] left-[-72.9%] max-w-none top-[-6.47%] w-[249.32%]',
    containerClass: 'relative shrink-0 size-[40px] rounded-[4px] overflow-hidden',
  },
  {
    id: 'maya',
    name: 'Pay with Maya',
    logo: imgMayaLogo,
    logoType: 'square' as const,
    imgClass: 'absolute inset-0 w-full h-full object-cover',
    containerClass: 'relative shrink-0 size-[40px] rounded-[4px] overflow-hidden',
  },
  {
    id: 'card',
    name: 'Pay with Card',
    logo: imgCardLogos,
    logoType: 'wide' as const,
    imgClass: 'absolute inset-0 w-full h-full object-contain',
    containerClass: 'relative shrink-0 h-[24px] w-[80px] overflow-hidden',
  },
  {
    id: 'qrph',
    name: 'Pay with QRPH',
    logo: imgQrphLogo,
    logoType: 'wide' as const,
    imgClass: 'absolute inset-0 max-w-none object-cover pointer-events-none size-full',
    containerClass: 'relative shrink-0 h-[16px] w-[69px] overflow-hidden',
  },
];

type DeferredFormPreviewItem = {
  id: string;
  eventName: string;
  category: string;
  label: string;
  deadline: string;
};

// --- Form Requirements Preview ---
function FormRequirementsPreview({ items }: { items: DeferredFormPreviewItem[] }) {
  const [open, setOpen] = React.useState(false);
  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#f5e4b9] bg-[#fffaf0] shadow-[0_16px_34px_-30px_rgba(146,64,14,0.65)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-4 pb-4 pt-4 text-left transition-colors hover:bg-white/42 sm:px-5 sm:pt-5"
      >
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#b45309] shadow-[0_8px_20px_-16px_rgba(146,64,14,0.8)]">
          <ListChecks className="h-4.5 w-4.5" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[14px] font-semibold tracking-[-0.16px] text-[#7b3306]">
            Forms can be completed after payment
          </span>
          <p className="text-[13px] leading-relaxed text-[#9a5214]">
            {items.length} registration detail{items.length === 1 ? '' : 's'} still needed. We will keep them attached to this order so you can finish from confirmation or Orders.
          </p>
        </div>
        <ChevronRight
          className={`mt-1 h-4 w-4 shrink-0 text-[#b45309] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[#f3dfb0]"
          >
            <div className="flex flex-col bg-white/58">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 px-4 py-3 ${index > 0 ? 'border-t border-[#f6e8c6]' : ''}`}
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fffbeb] text-[#b45309]">
                    <ClipboardList className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#364153]">
                      {item.eventName}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-[#9a5214]">
                      {item.category} · {item.label}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#f3dfb0] bg-white/80 px-2 py-0.5 text-[10px] font-bold text-[#92400e]">
                    Due {item.deadline}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeferredCheckoutFormsSummary({ items }: { items: DeferredFormPreviewItem[] }) {
  if (items.length === 0) return null;

  const eventCount = new Set(items.map((item) => item.eventName)).size;

  return (
    <section
      className="participant-form-deferred-summary overflow-hidden rounded-[16px] border border-[#dce5e1] bg-[#f8fafc]"
      aria-labelledby="after-payment-forms-heading"
    >
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#177564] ring-1 ring-[#e5ece8]">
          <ClipboardList className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#6a817b]">
            After payment
          </p>
          <h3 id="after-payment-forms-heading" className="mt-1 text-[14px] font-semibold text-[#18201d]">
            {items.length} more form{items.length === 1 ? '' : 's'} from {eventCount} event{eventCount === 1 ? '' : 's'}
          </h3>
          <p className="mt-1 text-[12px] leading-relaxed text-[#5f6f68]">
            These forms do not block payment. You can complete them from confirmation or Orders.
          </p>
        </div>
      </div>
      <div className="divide-y divide-[#e5ece8] border-t border-[#e5ece8] bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#b8cec7]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[#34413c]">{item.eventName}</p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-[#6a817b]">
                {item.category}{item.label !== item.category ? ` · ${item.label}` : ''}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold text-[#6a817b]">After payment</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PendingFormsHeroCard({
  eyebrow,
  title,
  description,
  progress,
}: {
  eyebrow: string;
  title: string;
  description: string;
  progress?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[rgba(89,200,184,0.45)] bg-[linear-gradient(135deg,#28b99e_0%,#177564_100%)] px-5 py-4 text-left text-white shadow-[0_24px_44px_-28px_rgba(23,117,100,0.85)] sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.18),transparent_34%)]" />
      <div className="pointer-events-none absolute -left-5 -top-5 h-32 w-32 text-white opacity-[0.07]">
        <ClipboardList className="h-full w-full" strokeWidth={1.2} />
      </div>

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold uppercase leading-tight tracking-[1.4px] text-white/78">
            {eyebrow}
          </p>
          <p className="mt-2 max-w-[440px] text-[24px] font-semibold leading-[1.25] tracking-[-0.5px] text-white sm:text-[26px]">
            {title}
          </p>
          <p className="mt-2 max-w-[440px] text-[13px] font-medium leading-[1.45] text-white/78">
            {description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {progress && (
            <div className="hidden rounded-full bg-white/12 px-3 py-2 text-[12px] font-semibold text-white/86 sm:block">
              {progress}
            </div>
          )}
          <div className="shrink-0 rounded-full bg-white px-5 py-2.5 text-[#177564] shadow-[0_12px_22px_-16px_rgba(15,23,42,0.42)]">
            <span className="text-[14px] font-semibold leading-none">Finish Forms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutEntryOwnerChoice({
  name,
  value,
  onChange,
  selfTakenByAnotherEntry = false,
}: {
  name: string;
  value: CheckoutEntryOwner;
  onChange: (value: CheckoutEntryOwner) => void;
  selfTakenByAnotherEntry?: boolean;
}) {
  const options = [
    {
      value: 'self' as const,
      label: 'For me',
      description: 'Attaches to my Passport',
    },
    {
      value: 'guest' as const,
      label: 'For someone else',
      description: 'Buyer-filled Guest QR',
    },
  ];

  return (
    <fieldset className="participant-form-ownership flex flex-col gap-2">
      <legend className="text-[14px] font-semibold text-[#181d27]">This entry is for</legend>
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          const disabled = option.value === 'self' && selfTakenByAnotherEntry && !selected;

          return (
            <label
              key={option.value}
              data-selected={selected ? '' : undefined}
              className={`participant-form-owner-choice flex min-h-[70px] items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-all ${
                selected
                  ? 'border-[#177564] bg-[#f0fdf9] text-[#177564]'
                  : 'border-[#e2e8f0] bg-white text-[#64748b]'
              } ${
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:border-[#b7ded6] hover:bg-[#f8fbfa]'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 accent-[#177564]"
              />
              <span className="min-w-0">
                <span className={`block text-[13px] font-semibold ${selected ? 'text-[#177564]' : 'text-[#181d27]'}`}>
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium leading-relaxed text-[#64748b]">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {selfTakenByAnotherEntry && value !== 'self' && (
        <p className="text-[12px] font-medium leading-relaxed text-[#64748b]">
          This order already has a Passport entry for you. Additional player entries use Guest QR or claim links.
        </p>
      )}
    </fieldset>
  );
}

function CheckoutDevTools({
  confirmationState,
  onConfirmationStateChange,
  itemMode,
  onItemModeChange,
}: {
  confirmationState: ConfirmationState;
  onConfirmationStateChange: (value: ConfirmationState) => void;
  itemMode: CheckoutItemMode;
  onItemModeChange: (value: CheckoutItemMode) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed right-4 top-[calc(5.75rem+env(safe-area-inset-top))] z-[70]">
      {open && (
        <div className="absolute bottom-auto right-0 top-12 w-[min(320px,calc(100vw-2rem))] rounded-[16px] border border-[#dbe5e3] bg-white p-3 shadow-[0_4px_8px_-2px_rgba(15,23,42,0.18)]">
          <div className="flex items-start justify-between gap-3 px-1 pb-3">
            <div>
              <p className="text-[12px] font-semibold text-[#181d27]">Checkout dev tools</p>
              <p className="mt-0.5 text-[11px] text-[#7b8b9a]">Preview controls · development only</p>
            </div>
            <IconButton
              size="sm"
              aria-label="Close checkout dev tools"
              onClick={() => setOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </IconButton>
          </div>

          <div className="space-y-3 border-t border-[#edf2f0] pt-3">
            <div>
              <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-[0.4px] text-[#8a9bb1]">Confirmation state</p>
              <SegmentedChoice
                size="sm"
                value={confirmationState}
                onChange={onConfirmationStateChange}
                columnsClass="grid-cols-2"
                className="w-full"
                options={[
                  { value: 'success', label: 'Success' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'expired', label: 'Expired' },
                ]}
              />
            </div>

            <div>
              <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-[0.4px] text-[#8a9bb1]">Order shape</p>
              <SegmentedChoice
                size="sm"
                value={itemMode}
                onChange={onItemModeChange}
                columnsClass="grid-cols-2"
                className="w-full"
                options={[
                  { value: 'multiple', label: 'Multiple Events', badge: 3 },
                  { value: 'single', label: 'Single Event', badge: 1 },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Open checkout dev tools"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#c8ded9] bg-white px-3 py-2 text-[11px] font-semibold text-[#177564] shadow-[0_4px_8px_-2px_rgba(15,23,42,0.18)] transition-colors hover:bg-[#f3fbf8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/25"
      >
        <Wrench className="h-3.5 w-3.5" />
        <span>Dev tools</span>
      </button>
    </div>
  );
}

// --- Main Component ---
export function CheckoutPage({
  eventName = 'NegOr50•50 Series 2: NUTRI-RUN 65',
  category = '65K Ultramarathon',
  price = 1500,
  image = 'https://images.unsplash.com/photo-1759674915081-b38844dbb613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lciUyMHJhY2UlMjBiaWIlMjBudW1iZXJ8ZW58MXx8fHwxNzcwODc3MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  userName,
  userEmail,
  userPhone,
}: CheckoutPageProps) {
  // --- Payment persistence (localStorage) ---
  const LS_DEFAULT_KEY = 'planout_default_payment';
  const LS_LAST_USED_KEY = 'planout_last_used_payment';

  const readLS = (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const writeLS = (key: string, value: string | null) => {
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    } catch {}
  };

  const storedDefault = readLS(LS_DEFAULT_KEY);
  const storedLastUsed = readLS(LS_LAST_USED_KEY);

  // Pre-select from saved default, otherwise leave null
  const [selectedPayment, setSelectedPayment] = useState<string | null>(
    storedDefault && PAYMENT_OPTIONS.some((o) => o.id === storedDefault) ? storedDefault : null,
  );
  const [defaultPayment, setDefaultPayment] = useState<string | null>(
    storedDefault && PAYMENT_OPTIONS.some((o) => o.id === storedDefault) ? storedDefault : null,
  );
  const [lastUsedPayment] = useState<string | null>(
    storedLastUsed && PAYMENT_OPTIONS.some((o) => o.id === storedLastUsed) ? storedLastUsed : null,
  );
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);

  // Helper: select a payment and optionally set as default
  const selectPaymentMethod = (id: string, setAsDefault?: boolean) => {
    setSelectedPayment(id);
    writeLS(LS_LAST_USED_KEY, id); // track as last used
    if (setAsDefault) {
      setDefaultPayment(id);
      writeLS(LS_DEFAULT_KEY, id);
    }
    setPaymentDrawerOpen(false);
  };

  const toggleDefault = (id: string) => {
    if (defaultPayment === id) {
      setDefaultPayment(null);
      writeLS(LS_DEFAULT_KEY, null);
    } else {
      setDefaultPayment(id);
      writeLS(LS_DEFAULT_KEY, id);
    }
  };

  const navigate = useNavigate();
  const { member, setCheckoutConfirmed, seedRegistrationQueue, checkoutIntent } = useAppContext();

  // Whether we're showing confirmation or the checkout form
  const [isConfirmation, setIsConfirmation] = useState(false);

  // Confirmation state
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const [lockedDialogTicketId, setLockedDialogTicketId] = useState<string | null>(null);
  const confirmRef = 'MNL-2024-789456';

  // Confirmation sub-state (for demo controls)
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>('success');

  // Countdown timer for failed state (ticket hold)
  const FAILED_HOLD_INITIAL = 14 * 60 + 32; // 14:32
  const [holdSeconds, setHoldSeconds] = useState(FAILED_HOLD_INITIAL);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (confirmationState === 'failed' && isConfirmation) {
      holdIntervalRef.current = setInterval(() => {
        setHoldSeconds((prev) => {
          if (prev <= 1) {
            if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
            setConfirmationState('expired');
            toast.error('Session Expired', {
              description: 'Your reserved registration items have been released back to inventory.',
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    }
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [confirmationState, isConfirmation]);

  useEffect(() => {
    if (confirmationState === 'failed') setHoldSeconds(FAILED_HOLD_INITIAL);
  }, [confirmationState]);

  const holdMinutes = Math.floor(holdSeconds / 60);
  const holdSecs = holdSeconds % 60;
  const holdDisplay = `${holdMinutes}:${holdSecs.toString().padStart(2, '0')}`;
  const holdUrgent = holdSeconds < 5 * 60;

  const [isRetrying, setIsRetrying] = useState(false);
  const handleRetryCheckout = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      toast.error('Item No Longer Available', {
        description: `We're sorry, but one or more items in your cart have sold out and are no longer available.`,
        duration: 4000,
      });
    }, 1500);
  };

  // Multiple order items with per-ticket form status
  type FormTiming = 'before_checkout' | 'after_checkout';

  type OrderItem = {
    id: string;
    label: string;
    eventName: string;
    category: string;
    price: number;
    image?: string;
    requiresForm: boolean;
    formComplete: boolean;
    formTiming?: FormTiming | string;
    requireFormsBeforeCheckout?: boolean;
  };

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: 'PBL-9901', label: 'Singles Entry', eventName: 'NegOr50•50 Series 2: NUTRI-RUN 65', category: '65K Ultramarathon', price: 1500, image, requiresForm: true, formComplete: false, formTiming: 'before_checkout' },
    { id: 'PBL-9902', label: 'Singles Entry', eventName: 'NegOr50•50 Series 2: NUTRI-RUN 65', category: '10K Nutri-Run', price: 800, image, requiresForm: true, formComplete: false, formTiming: 'after_checkout' },
    { id: 'PBL-9903', label: 'Team Entry', eventName: 'Liptong Woodland 20th Anniversary', category: 'Group Cabin Pass', price: 2200, image: LIPTONG_EVENT_IMAGE, requiresForm: true, formComplete: false, formTiming: 'after_checkout' },
  ]);

  // Demo state: itemMode determines if 1 or 3 events are in the checkout confirmation
  const [itemMode, setItemMode] = useState<CheckoutItemMode>('multiple');
  const handleItemModeChange = (mode: CheckoutItemMode) => {
    setItemMode(mode);
    if (mode === 'single') {
      setOrderItems((prev) => prev.map((item, idx) => idx === 0 ? { ...item, formComplete: false } : item));
    } else {
      setOrderItems((prev) => prev.map((item) => ({ ...item, formComplete: false })));
    }
  };
  const displayedItems = itemMode === 'single' ? [orderItems[0]] : orderItems;

  const getItemFormTiming = useCallback((item: OrderItem): FormTiming => {
    if (item.formTiming === 'before_checkout') return 'before_checkout';
    if (item.formTiming === 'after_checkout') return 'after_checkout';
    return item.requireFormsBeforeCheckout ? 'before_checkout' : 'after_checkout';
  }, []);

  useEffect(() => {
    if (checkoutIntent) {
      const isNutriRun = checkoutIntent.eventName.includes('NUTRI-RUN 65');
      const isFormFilledQuery = new URLSearchParams(window.location.search).get('formFilled') === '1';
      const ticketTypeCountMatch = checkoutIntent.category.match(/^(\d+)\s+ticket types?$/i);
      const fallbackTicketTypes = [
        {
          eventName: 'NegOr50•50 Series 2: NUTRI-RUN 65',
          category: 'Beginner Double Male - 15-30',
          price: 1500,
          image: NUTRI_RUN_EVENT_IMAGE,
          formTiming: 'before_checkout' as FormTiming,
        },
        {
          eventName: 'Grand Slam Tennis Open',
          category: 'Doubles Open - Mixed',
          price: 1000,
          image: TENNIS_EVENT_IMAGE,
          formTiming: 'after_checkout' as FormTiming,
        },
        {
          eventName: 'Regional Swimming Championship',
          category: '200m Freestyle - Adult',
          price: 500,
          image: SWIM_EVENT_IMAGE,
          formTiming: 'after_checkout' as FormTiming,
        },
      ];
      
      if (checkoutIntent.items?.length || ticketTypeCountMatch) {
        const intentLines = checkoutIntent.items?.length
          ? checkoutIntent.items
          : fallbackTicketTypes
              .slice(0, Number(ticketTypeCountMatch?.[1] ?? 1))
	              .map((item, index) => ({
	                ticketId: `fallback-${index}`,
	                qty: 1,
	                eventName: item.eventName,
	                category: item.category,
	                price: item.price,
	                image: item.image,
	              }));

        const expandedItems = intentLines.flatMap((line, lineIndex) => {
          const lineFallback = fallbackTicketTypes[lineIndex] ?? fallbackTicketTypes[fallbackTicketTypes.length - 1];
          const qty = Math.max(1, line.qty || 1);
          return Array.from({ length: qty }, (_, qtyIndex) => {
            const category = line.category || lineFallback.category;
            const requiresForm = isNutriRun || /beginner|intermediate|advanced|single|double/i.test(category);
	            return {
	              id: `PBL-${9901 + lineIndex}-${qtyIndex}`,
	              label: category.includes('Team') ? 'Team Entry' : 'Singles Entry',
		              eventName: line.eventName || lineFallback.eventName || checkoutIntent.eventName,
	              category,
	              price: line.price || lineFallback.price || Math.round(checkoutIntent.price / intentLines.length),
	              image: line.image || lineFallback.image || checkoutIntent.image,
	              requiresForm,
              formComplete: lineIndex === 0 && qtyIndex === 0 ? isFormFilledQuery : false,
              formTiming: lineIndex === 0 ? 'before_checkout' : (lineFallback.formTiming ?? 'after_checkout'),
            } satisfies OrderItem;
          });
        });

        setOrderItems(expandedItems);
        setItemMode('multiple');
      } else {
        const newItem: OrderItem = {
          id: 'PBL-9901',
          label: checkoutIntent.category.includes('Team') ? 'Team Entry' : 'Singles Entry',
          eventName: checkoutIntent.eventName,
          category: checkoutIntent.category,
          price: checkoutIntent.price,
          image: checkoutIntent.image,
          requiresForm: isNutriRun,
          formComplete: isFormFilledQuery,
          formTiming: isNutriRun ? 'before_checkout' : 'after_checkout',
        };
        setOrderItems([newItem]);
        setItemMode('single');
      }
    }
  }, [checkoutIntent]);

  // Local state for the inline form (shown when itemMode === 'single')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const pendingItems = displayedItems.filter((t) => t.requiresForm && !t.formComplete);
  const preCheckoutPendingItems = pendingItems.filter((item) => getItemFormTiming(item) === 'before_checkout');
  const hasGatedPreCheckoutItems = preCheckoutPendingItems.length > 0;
  const showPreCheckoutForms = hasGatedPreCheckoutItems;
  const completedItems = displayedItems.filter((t) => !t.requiresForm || t.formComplete);
  const allFormsComplete = pendingItems.length === 0;

  const requiredFormsCompleted = displayedItems.filter((item) => item.requiresForm && item.formComplete).length;
  const requiredFormsTotal = displayedItems.filter((item) => item.requiresForm).length;
  // Pending state: refresh status simulation
  const [refreshing, setRefreshing] = useState(false);
  const handleRefreshStatus = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.info('Still Processing', {
        description: 'Your payment is still being verified by the payment provider. We\'ll notify you once confirmed.',
      });
    }, 2000);
  };

  const handleInlineSubmit = () => {
    // 1. Validate pre-checkout slots
    const preCheckoutSlots = gatedSlots;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const slot of preCheckoutSlots) {
      const data = slotsData[slot.id];
      if (!data) continue;

      if (data.deliveryMethod === 'fill') {
        if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim()) {
          toast.error('Required fields missing', {
            description: `Please fill out first name, last name, and email for ${slot.label}.`,
          });
          return;
        }
        if (!emailRegex.test(data.email.trim())) {
          toast.error('Invalid email', {
            description: `Please enter a valid email for ${slot.label}.`,
          });
          return;
        }
        const is65K = slot.item.category.includes('65K');
        if (is65K && !data.uploadedFile) {
          toast.error('Medical certificate required', {
            description: `Please upload a medical certificate for ${slot.label} (65K Ultramarathon).`,
          });
          return;
        }
      } else {
        // Invite mode
        if (!data.inviteEmail.trim()) {
          toast.error('Invite email required', {
            description: `Please enter a friend's email to invite for ${slot.label}.`,
          });
          return;
        }
        if (!emailRegex.test(data.inviteEmail.trim())) {
          toast.error('Invalid invite email', {
            description: `Please enter a valid email address to invite for ${slot.label}.`,
          });
          return;
        }
      }
    }

    // 2. Validate post-checkout slots only if the user started filling them
  const postCheckoutSlots = checkoutSlots.filter(
      (slot) => slot.item.requiresForm && getItemFormTiming(slot.item) === 'after_checkout'
    );

    for (const slot of postCheckoutSlots) {
      const data = slotsData[slot.id];
      if (!data) continue;

      if (data.deliveryMethod === 'fill') {
        const hasAnyValue =
          data.firstName.trim() ||
          data.lastName.trim() ||
          data.email.trim() ||
          data.phone.trim() ||
          data.uploadedFile;

        if (hasAnyValue) {
          if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim()) {
            toast.error('Required fields missing', {
              description: `Please complete all required fields for optional slot ${slot.label}, or clear them.`,
            });
            return;
          }
          if (!emailRegex.test(data.email.trim())) {
            toast.error('Invalid email', {
              description: `Please enter a valid email for optional slot ${slot.label}.`,
            });
            return;
          }
        }
      } else {
        // Invite mode
        const isSingleTicketInlineForm = itemMode === 'single' && displayedItems.length === 1 && itemQuantity === 1;
        if (isSingleTicketInlineForm) {
          if (!data.inviteEmail.trim()) {
            toast.error('Invite email required', {
              description: `Please enter a friend's email to invite.`,
            });
            return;
          }
        }
        if (data.inviteEmail.trim()) {
          if (!emailRegex.test(data.inviteEmail.trim())) {
            toast.error('Invalid invite email', {
              description: `Please enter a valid email to invite for optional slot ${slot.label}.`,
            });
            return;
          }
        }
      }
    }

    setIsSubmittingForm(true);
    setTimeout(() => {
      setIsSubmittingForm(false);
      const completedItemIds = new Set(
        displayedItems
          .filter((item) => {
            const itemFormSlots = checkoutSlots.filter(
              (slot) => slot.item.id === item.id && slot.item.requiresForm,
            );
            return itemFormSlots.length > 0 && itemFormSlots.every((slot) => isSlotComplete(slotsData[slot.id], slot.item));
          })
          .map((item) => item.id),
      );
      setOrderItems((prev) =>
        prev.map((item) =>
          completedItemIds.has(item.id) ? { ...item, formComplete: true } : item
        )
      );
      toast.success('Details Saved', {
        description: 'Participant details saved successfully. Continue to payment.',
      });
    }, 1200);
  };

  // Form state — split full name into first/last
  const _nameParts = (userName || '').trim().split(/\s+/);
  const [firstName, setFirstName] = useState(_nameParts[0] || '');
  const [lastName, setLastName] = useState(_nameParts.slice(1).join(' ') || '');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState(userPhone || '');
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherExpanded, setVoucherExpanded] = useState(false);

  // Item quantity (add/minus in order summary, min 1)
  const [itemQuantity, setItemQuantity] = useState(1);

  // Define checkoutSlots for all tickets in the cart
  const checkoutSlots = useMemo(() => {
    const slots: { id: string; label: string; item: OrderItem; guestIndex?: number }[] = [];
    displayedItems.forEach((item, index) => {
      if (index === 0) {
        for (let q = 0; q < itemQuantity; q++) {
          slots.push({
            id: `${item.id}-${q}`,
            label: q === 0 ? `${item.category} (Buyer)` : `${item.category} (Guest ${q})`,
            item,
            guestIndex: q,
          });
        }
      } else {
        slots.push({
          id: `${item.id}-0`,
          label: item.category,
          item,
          guestIndex: 0,
        });
      }
    });
    return slots;
  }, [displayedItems, itemQuantity]);

  const formSlots = useMemo(() => checkoutSlots.filter((slot) => slot.item.requiresForm), [checkoutSlots]);
  const allGatedSlots = useMemo(
    () => formSlots.filter((slot) => getItemFormTiming(slot.item) === 'before_checkout'),
    [formSlots, getItemFormTiming],
  );
  const allDeferredSlots = useMemo(
    () => formSlots.filter((slot) => getItemFormTiming(slot.item) === 'after_checkout'),
    [formSlots, getItemFormTiming],
  );
  const checkoutFormState = useMemo<'none' | 'all_before' | 'all_after' | 'mixed'>(() => {
    if (formSlots.length === 0) return 'none';
    if (allGatedSlots.length > 0 && allDeferredSlots.length > 0) return 'mixed';
    if (allGatedSlots.length > 0) return 'all_before';
    return 'all_after';
  }, [allDeferredSlots.length, allGatedSlots.length, formSlots.length]);

  // --- Form-timing partition (Phase 1) ---
  // User-side consumes the per-item `formTiming` set by the organizer module as the
  // source of truth. `before_checkout` means the form is surfaced before payment
  // and payment stays blocked until the form is complete.
  // TODO(org-module): once the organizer module lands, reconcile this with the
  // event-level `requireFormsBeforeCheckout` flag (events.ts) — per-item wins.
  const gatedSlots = useMemo(
    () => formSlots.filter((slot) => getItemFormTiming(slot.item) === 'before_checkout' && !slot.item.formComplete),
    [formSlots, getItemFormTiming],
  );
  const pendingCheckoutFormSlots = useMemo(
    () => formSlots.filter((slot) => slot.item.requiresForm && !slot.item.formComplete),
    [formSlots],
  );
  const pendingCheckoutPreviewItems = useMemo<DeferredFormPreviewItem[]>(
    () =>
      pendingCheckoutFormSlots.map((slot) => ({
        id: slot.id,
        eventName: slot.item.eventName,
        category: slot.item.category,
        label: slot.label,
        deadline: 'May 30, 2026',
      })),
    [pendingCheckoutFormSlots],
  );

  const afterCheckoutPendingSlots = useMemo(
    () => pendingCheckoutFormSlots.filter((slot) => getItemFormTiming(slot.item) === 'after_checkout'),
    [pendingCheckoutFormSlots, getItemFormTiming],
  );
  const afterCheckoutPreviewItems = useMemo<DeferredFormPreviewItem[]>(
    () => afterCheckoutPendingSlots.map((slot) => ({
      id: slot.id,
      eventName: slot.item.eventName,
      category: slot.item.category,
      label: slot.label,
      deadline: 'May 30, 2026',
    })),
    [afterCheckoutPendingSlots],
  );

  const preCheckoutVisibleSlots = gatedSlots;

  // Form data state per slot
  interface SlotFormData {
    deliveryMethod: 'fill' | 'invite';
    entryOwner: CheckoutEntryOwner;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    uploadedFile: string | null;
    inviteEmail: string;
  }

  const [slotsData, setSlotsData] = useState<Record<string, SlotFormData>>({});

  const updateSlotFieldGlobal = (slotId: string, field: keyof SlotFormData, value: any) => {
    setSlotsData((prev) => {
      const existing = prev[slotId] || {
        deliveryMethod: 'fill',
        entryOwner: 'self' as CheckoutEntryOwner,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        uploadedFile: null,
        inviteEmail: '',
      };
      return {
        ...prev,
        [slotId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const isSelfOwnerTakenByAnotherEntry = (slotId: string) =>
    checkoutSlots.some(
      (slot) =>
        slot.id !== slotId &&
        slotsData[slot.id]?.deliveryMethod === 'fill' &&
        slotsData[slot.id]?.entryOwner === 'self',
    );

  // Shared completeness check for a slot (used by both validation and progress display).
  const emailRegexShared = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isSlotComplete = (data: SlotFormData | undefined, item: OrderItem): boolean => {
    if (!data) return false;
    if (data.deliveryMethod === 'fill') {
      const is65K = item.category.includes('65K');
      return !!(
        data.firstName.trim() &&
        data.lastName.trim() &&
        data.email.trim() &&
        emailRegexShared.test(data.email.trim()) &&
        (!is65K || data.uploadedFile)
      );
    }
    return !!(data.inviteEmail.trim() && emailRegexShared.test(data.inviteEmail.trim()));
  };

  // Progress across the consolidated pre-payment (gated) step.
  const gatedCompleteCount = useMemo(
    () => gatedSlots.filter((slot) => isSlotComplete(slotsData[slot.id], slot.item)).length,
    [gatedSlots, slotsData],
  );
  const gatedTotalCount = gatedSlots.length;
  const preCheckoutCompleteCount = useMemo(
    () => preCheckoutVisibleSlots.filter((slot) => isSlotComplete(slotsData[slot.id], slot.item)).length,
    [preCheckoutVisibleSlots, slotsData],
  );
  const preCheckoutTotalCount = preCheckoutVisibleSlots.length;

  // Initialize activeSlotId automatically
  useEffect(() => {
    if (
      showPreCheckoutForms &&
      preCheckoutVisibleSlots.length > 0 &&
      (!activeSlotId || !preCheckoutVisibleSlots.some((slot) => slot.id === activeSlotId))
    ) {
      setActiveSlotId(preCheckoutVisibleSlots[0].id);
    }
  }, [showPreCheckoutForms, preCheckoutVisibleSlots, activeSlotId]);

  // Initialize slot forms dynamically
  useEffect(() => {
    setSlotsData((prev) => {
      const next = { ...prev };
      let updated = false;
      checkoutSlots.forEach((slot) => {
        if (!next[slot.id]) {
          const isPrimary = slot.id === checkoutSlots[0]?.id;
          const nameParts = (userName || '').trim().split(/\s+/);
          next[slot.id] = {
            deliveryMethod: isPrimary ? 'fill' : 'invite',
            entryOwner: isPrimary ? 'self' : 'guest',
            firstName: isPrimary ? nameParts[0] || '' : '',
            lastName: isPrimary ? nameParts.slice(1).join(' ') || '' : '',
            email: isPrimary ? userEmail || '' : '',
            phone: isPrimary ? userPhone || '' : '',
            uploadedFile: null,
            inviteEmail: '',
          };
          updated = true;
        }
      });
      return updated ? next : prev;
    });
  }, [checkoutSlots, userName, userEmail, userPhone]);

  // Sent emails memo for final confirmation screen display
  const sentEmails = useMemo(() => {
    return Object.values(slotsData)
      .filter((s) => s.deliveryMethod === 'invite' && s.inviteEmail.trim().length > 0)
      .map((s) => s.inviteEmail.trim());
  }, [slotsData]);

  // Reservation countdown (15 min from mount)
  const [reservationEnd] = useState(() => new Date(Date.now() + 15 * 60 * 1000));
  const calcReservation = useCallback(() => {
    const diff = reservationEnd.getTime() - Date.now();
    if (diff <= 0) return '00:00';
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [reservationEnd]);
  const [reservationTime, setReservationTime] = useState(calcReservation);
  useEffect(() => {
    const interval = setInterval(() => setReservationTime(calcReservation()), 1000);
    return () => clearInterval(interval);
  }, [calcReservation]);
  const reservationUrgent = (reservationEnd.getTime() - Date.now()) < 5 * 60 * 1000;

  const currentOrderEntries: RegistrationQueueEntry[] = displayedItems.flatMap((item, index) => {
    const isTeam = item.label.toLowerCase().includes('team');
    
    // For the primary item (index 0), generate entries based on itemQuantity
    if (index === 0) {
      const ticketId = 'tkt-003';
      
      if (itemQuantity === 1) {
        const slotData = slotsData[`${item.id}-0`];
        let personName = `${firstName || userName?.split(' ')[0] || 'Ken'} ${lastName || 'Jo'}`.trim();
        let inviteEmail = email || userEmail;
        let isInvited = false;
        let entryType: RegistrationQueueEntry['type'] = 'self';
        let accessPath: TeamPlayerAccessPath = 'passport';
        let status: EntryStatus = 'attached';

        if (slotData) {
          if (slotData.deliveryMethod === 'invite') {
            personName = 'Guest (unassigned)';
            inviteEmail = slotData.inviteEmail.trim() || userEmail;
            isInvited = true;
            entryType = 'guest';
            accessPath = 'pending';
          } else {
            personName = `${slotData.firstName} ${slotData.lastName}`.trim() || personName;
            inviteEmail = slotData.email.trim() || inviteEmail;
            entryType = slotData.entryOwner === 'guest' ? 'guest' : 'self';
            accessPath = slotData.entryOwner === 'guest' ? 'guest_qr' : 'passport';
          }
        }

        if (confirmationState === 'pending') {
          status = 'pending_payment';
        } else {
          status = isInvited ? 'pending_form' : (item.requiresForm && !item.formComplete ? 'pending_form' : 'attached');
        }
        
        return [{
          id: `checkout-${item.id}-self`,
          ticketId,
          orderRef: confirmRef,
          eventName: item.eventName,
          personName,
          category: item.category,
          type: entryType,
          accessPath,
          participantIsPrimary: entryType === 'self',
          entryStatus: status,
          deadline: item.requiresForm ? 'May 30, 2026' : undefined,
          formRoute: `/orders/${ticketId}/form`,
          inviteEmail,
        }];
      } else {
        // Group purchase (multiple tickets)
        const completedCount = Array.from({ length: itemQuantity }).filter((_, q) => {
          const sd = slotsData[`${item.id}-${q}`];
          return sd && sd.deliveryMethod === 'fill' && (q === 0 || sd.firstName.trim().length > 0);
        }).length;

        let status: EntryStatus = 'attached';
        if (confirmationState === 'pending') {
          status = 'pending_payment';
        } else {
          status = completedCount === itemQuantity ? 'attached' : 'pending_form';
        }

        // Slot 0 (Buyer)
        const buyerSlot = slotsData[`${item.id}-0`];
        let personName = `${firstName || userName?.split(' ')[0] || 'Ken'} ${lastName || 'Jo'}`.trim();
        let inviteEmail = email || userEmail;
        if (buyerSlot) {
          if (buyerSlot.deliveryMethod === 'invite') {
            personName = 'Guest (unassigned)';
            inviteEmail = buyerSlot.inviteEmail.trim() || userEmail;
          } else {
            personName = `${buyerSlot.firstName} ${buyerSlot.lastName}`.trim() || personName;
            inviteEmail = buyerSlot.email.trim() || inviteEmail;
          }
        }

        const emails = Array.from({ length: itemQuantity - 1 }).map((_, idx) => {
          const sd = slotsData[`${item.id}-${idx + 1}`];
          return sd && sd.deliveryMethod === 'invite' ? sd.inviteEmail.trim() : '';
        });

        const details = Array.from({ length: itemQuantity - 1 }).map((_, idx) => {
          const sd = slotsData[`${item.id}-${idx + 1}`];
          if (sd && sd.deliveryMethod === 'fill' && sd.firstName.trim().length > 0) {
            return {
              name: `${sd.firstName} ${sd.lastName}`.trim(),
              email: sd.email.trim(),
            };
          }
          return null;
        }).filter(Boolean) as { name: string; email: string }[];

        return [{
          id: `checkout-${item.id}-group`,
          ticketId,
          orderRef: confirmRef,
          eventName: item.eventName,
          personName,
          category: item.category,
          type: 'guest' as const,
          entryStatus: status,
          deadline: item.requiresForm ? 'May 30, 2026' : undefined,
          formRoute: `/orders/${ticketId}/form`,
          inviteEmail,
          guestTotalCount: itemQuantity,
          guestCompletedCount: completedCount,
          guestEmails: emails,
          guestDetails: details,
        }];
      }
    }
    
    // For other items (index > 0)
    const slotId = `${item.id}-0`;
    const slotData = slotsData[slotId];
    let personName = `${firstName || userName?.split(' ')[0] || 'Ken'} ${lastName || 'Jo'}`.trim();
    let inviteEmail = email || userEmail;
    let isInvited = false;
    let buyerManagedGuest = false;
    let accessPath: TeamPlayerAccessPath = 'passport';

    if (slotData) {
      if (slotData.deliveryMethod === 'invite') {
        personName = 'Guest (unassigned)';
        inviteEmail = slotData.inviteEmail.trim() || userEmail;
        isInvited = true;
        accessPath = 'pending';
      } else {
        personName = `${slotData.firstName} ${slotData.lastName}`.trim() || personName;
        inviteEmail = slotData.email.trim() || inviteEmail;
        buyerManagedGuest = slotData.entryOwner === 'guest';
        accessPath = buyerManagedGuest ? 'guest_qr' : 'passport';
      }
    } else {
      if (index === 1) {
        personName = 'Mia Torres';
        inviteEmail = 'mia.torres@email.com';
      }
    }

    const ticketId = isTeam ? 'tkt-004' : 'tkt-001';
    let status: EntryStatus = 'attached';
    if (confirmationState === 'pending') {
      status = 'pending_payment';
    } else {
      status = isInvited ? 'pending_form' : (item.requiresForm && !item.formComplete ? 'pending_form' : 'attached');
    }
    
    return [{
      id: `checkout-${item.id}`,
      ticketId,
      orderRef: confirmRef,
      eventName: item.eventName,
      personName,
      category: item.category,
      type: isTeam ? ('team' as const) : (isInvited || buyerManagedGuest ? ('guest' as const) : ('self' as const)),
      accessPath: isTeam ? undefined : accessPath,
      participantIsPrimary: !isTeam && !isInvited && !buyerManagedGuest,
      entryStatus: status,
      deadline: item.requiresForm ? 'May 30, 2026' : undefined,
      formRoute: `/orders/${ticketId}/form`,
      inviteEmail,
      teamAttachedCount: isTeam ? 2 : undefined,
      teamTotalCount: isTeam ? 5 : undefined,
    }];
  });
  const confirmationEntries = confirmationState === 'registered'
    ? currentOrderEntries.map((entry) => ({ ...entry, entryStatus: 'attached' as const }))
    : currentOrderEntries;
  const pendingConfirmationEntries = confirmationEntries.filter(
    (entry) => entry.entryStatus === 'pending_form' || entry.entryStatus === 'resubmit_required',
  );
  const allOrderEntriesAttached = pendingConfirmationEntries.length === 0;
  const frontloadedFormComplete =
    allGatedSlots.length > 0 && allGatedSlots.every((slot) => slot.item.formComplete);
  const imageForConfirmationEntry = useCallback((entry: RegistrationQueueEntry) => {
    const matchedItem = displayedItems.find((item) =>
      entry.id.includes(item.id) ||
      (item.eventName === entry.eventName && item.category === entry.category)
    );
    return matchedItem?.image || image;
  }, [displayedItems, image]);
  const shouldShowInlineConfirmationForm =
    itemMode === 'single' && displayedItems.length === 1 && itemQuantity === 1;

  // Sync confirmation entries to global queue to ensure Passport and Orders tabs see updates immediately
  const confirmationEntriesJson = JSON.stringify(confirmationEntries);
  useEffect(() => {
    if (isConfirmation) {
      seedRegistrationQueue(confirmationEntries, confirmRef);
    }
  }, [isConfirmation, confirmationEntriesJson, confirmRef, seedRegistrationQueue]);

  useEffect(() => {
    if (!isConfirmation) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [isConfirmation]);

  const openFirstRequiredForm = () => {
    seedRegistrationQueue(confirmationEntries, confirmRef);
    const firstPending = pendingConfirmationEntries[0];
    if (firstPending) {
      navigate(`${firstPending.formRoute}?entryId=${firstPending.id}`);
    } else {
      navigate('/passport/events?focus=forms&mode=order');
    }
  };

  // Derived
  const subtotal = displayedItems.reduce(
    (sum, item, index) => sum + item.price * (index === 0 ? itemQuantity : 1),
    0,
  );
  const convenienceFee = Math.round(subtotal * CONVENIENCE_FEE_RATE * 100) / 100;
  const discount = appliedVoucher ? Math.min(appliedVoucher.discount, subtotal) : 0;
  const total = Math.max(0, subtotal + convenienceFee - discount);
  const confirmationSubtotal = subtotal;
  const confirmationConvenienceFee =
    Math.round(confirmationSubtotal * CONVENIENCE_FEE_RATE * 100) / 100;
  const confirmationTotal = Math.max(0, confirmationSubtotal + confirmationConvenienceFee - discount);

  const fmt = (n: number) =>
    `₱ ${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const confirmationPaymentLines = displayedItems.map((item, index) => {
    const quantity = index === 0 ? itemQuantity : 1;
    return {
      id: item.id,
      label: `${item.eventName} · ${item.category}${quantity > 1 ? ` × ${quantity}` : ''}`,
      amount: item.price * quantity,
    };
  });

  const confirmationOrderDetails = (
    <OrderPaymentSummary
      lineItems={confirmationPaymentLines}
      subtotal={confirmationSubtotal}
      fees={confirmationConvenienceFee}
      discount={discount}
      discountLabel={appliedVoucher ? `Discount - ${appliedVoucher.code}` : 'Discount'}
      total={confirmationTotal}
      paymentMeta={`Order reference - ${confirmRef}`}
      title="Order summary"
      totalLabel="Total paid"
      footerAction={
        !allOrderEntriesAttached ? (
          <SecondaryButton
            type="button"
            onClick={() => navigate('/orders')}
            className="h-[46px] w-full px-5 text-[14px]"
          >
            View order
          </SecondaryButton>
        ) : undefined
      }
    />
  );

  const applyVoucher = () => {
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;
    const d = VOUCHER_MAP[code];
    if (d !== undefined) {
      setAppliedVoucher({ code, discount: d });
      setVoucherCode('');
    } else {
      setVoucherError('Invalid voucher code');
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const handlePurchase = () => {
    if (!selectedPayment) {
      setPaymentDrawerOpen(true);
      toast.error('Payment method required', {
        description: 'Please select a payment method before proceeding.',
      });
      return;
    }
    // Persist last used on actual purchase
    writeLS(LS_LAST_USED_KEY, selectedPayment);
    setIsConfirmation(true);
  };

  // Sync confirmation state to context so RootLayout can show bottom nav
  useEffect(() => {
    setCheckoutConfirmed(isConfirmation);
    return () => setCheckoutConfirmed(false);
  }, [isConfirmation, setCheckoutConfirmed]);

  // =========================================================================
  // CONFIRMATION VIEW
  // =========================================================================
  if (isConfirmation) {
    return (
      <div className="flex flex-col gap-5 pb-28 pt-10 sm:pt-0 lg:pb-8">
        {import.meta.env.DEV && (
          <CheckoutDevTools
            confirmationState={confirmationState}
            onConfirmationStateChange={setConfirmationState}
            itemMode={itemMode}
            onItemModeChange={handleItemModeChange}
          />
        )}
        {/* --- Header --- */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold leading-none tracking-[-0.8px] text-[#111827] sm:text-[34px]">
              Confirmation
            </h1>
            <p className="mt-1.5 max-w-[520px] text-[13px] leading-relaxed text-[#64748b]">
              Your order is tied to PlanOut Passport for event-day access.
            </p>
          </div>
        </div>

        {/* --- Content --- */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* ========== FAILED STATE ====================== */}
            {confirmationState === 'failed' && (<>
              <div className="rounded-[14px] overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
                <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-[#991b1b] via-[#dc2626] to-[#b91c1c]">
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-4">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight">
                      Payment Failed
                    </h2>
                    <p className="text-sm text-white/85 mt-1 max-w-[420px]">
                      Your payment could not be processed. No charges were made to your account. Please try again or use a different payment method.
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-3.5 flex items-center justify-between border-t border-[#f3f4f6]">
                  <span className="text-[#6a7282] text-sm">Transaction Reference</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#101828] text-[15px] font-medium">{confirmRef}</span>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${holdUrgent ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#fffbeb] border-[#fde68a]'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${holdUrgent ? 'bg-[#ef4444]' : 'bg-[#d97706]'}`} />
                      <span className={`text-[12px] font-bold tabular-nums ${holdUrgent ? 'text-[#dc2626]' : 'text-[#92400e]'}`}>{holdDisplay}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-5 sm:p-6">
                <h4 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px] mb-6">What You Can Do</h4>
                <div className="flex flex-col gap-8 pl-8 relative">
                  <div className="absolute left-[12px] top-0 bottom-0 w-px bg-[#e5e7eb]" />
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#ef4444] flex items-center justify-center z-10">
                      <RefreshCw className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Retry Payment</span>
                      <p className="text-[#6a7282] text-sm mt-1">Try again with the same payment method. Your cart and details are preserved.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#e5e7eb] flex items-center justify-center z-10">
                      <span className="text-[#6a7282] text-[11px]">2</span>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Change Payment Method</span>
                      <p className="text-[#6a7282] text-sm mt-1">Switch to GCash, Maya, Card, or QRPH and try again.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#e5e7eb] flex items-center justify-center z-10">
                      <span className="text-[#6a7282] text-[11px]">3</span>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Contact Support</span>
                      <p className="text-[#6a7282] text-sm mt-1">If the issue persists, reach out to our support team for help.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <PrimaryButton
                  onClick={() => { setIsConfirmation(false); }}
                  fullWidth
                  className="py-3.5"
                >
                  Continue to Payment
                </PrimaryButton>
              </div>

              <div className={`rounded-[14px] border p-5 sm:p-6 flex flex-col gap-3 ${holdUrgent ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#fafafa] border-[rgba(0,0,0,0.08)]'} transition-colors duration-500`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${holdUrgent ? 'text-[#ef4444]' : 'text-[#d97706]'}`} />
                    <span className="text-[#101828] text-[15px] font-semibold">Reserved Items</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${holdUrgent ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#fffbeb] border-[#fde68a]'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${holdUrgent ? 'bg-[#ef4444]' : 'bg-[#d97706]'}`} />
                    <span className={`text-[13px] font-bold tabular-nums tracking-wide ${holdUrgent ? 'text-[#dc2626]' : 'text-[#92400e]'}`}>
                      {holdDisplay}
                    </span>
                  </div>
                </div>
                <p className={`text-[12px] mb-1 ${holdUrgent ? 'text-[#dc2626]' : 'text-[#6a7282]'}`}>
                  {holdUrgent
                    ? 'Hurry! Your reserved tickets will be released soon.'
                    : 'Tickets are held while you retry. They will be released when the timer expires.'}
                </p>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-[#4a5565] text-sm">{item.label} #{item.id}</span>
                    <span className="text-[#101828] text-sm font-medium tabular-nums">{fmt(item.price)}</span>
                  </div>
                ))}
                <div className="h-px bg-black/5 my-0.5" />
                <div className="flex items-center justify-between">
                  <span className="text-[#101828] text-[15px] font-bold">Total</span>
                  <span className="text-[#101828] text-[18px] font-bold tabular-nums">{fmt(Math.max(0, orderItems.reduce((s, t) => s + t.price, 0) + Math.round(orderItems.reduce((s, t) => s + t.price, 0) * CONVENIENCE_FEE_RATE * 100) / 100 - discount))}</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#177564] to-[#21a58d] rounded-[14px] p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <span className="text-white text-[17px] font-bold tracking-[-0.44px] block">Find more events?</span>
                  <span className="text-white/80 text-sm mt-1 block">Browse our catalog for more running events.</span>
                </div>
                <button onClick={() => navigate('/events')} className="px-4 py-2 bg-[#eceef2] text-[#177564] text-sm font-medium rounded-[8px] hover:bg-white transition-colors shrink-0">
                  Browse
                </button>
              </div>
            </>)}

            {/* ========== EXPIRED STATE ===================== */}
            {confirmationState === 'expired' && (<>
              <div className="rounded-[14px] overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
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
                      Your checkout session has expired and the reserved registration items have been released. No charges were made to your account.
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-3.5 flex items-center justify-between border-t border-[#f3f4f6]">
                  <span className="text-[#6a7282] text-sm">Session Reference</span>
                  <span className="text-[#94a3b8] text-[15px] font-medium line-through">{confirmRef}</span>
                </div>
              </div>

              <div className="rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-4 sm:p-5 flex gap-3">
                <div className="w-5 h-5 shrink-0 mt-0.5 text-[#64748b]">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-[#334155] text-[15px] font-semibold">Checkout Session Timed Out</span>
                  <p className="text-[#64748b] text-sm leading-relaxed">
                    Sessions expire after 30 minutes of inactivity to protect event inventory for all users. Your previously selected registration items may still be available — start a new checkout to secure them.
                  </p>
                  <p className="text-[#94a3b8] text-[12px] mt-0.5">
                    Expired: Feb 05, 2026 at 3:04 PM PHT
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-5 sm:p-6">
                <h4 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px] mb-6">What Happened</h4>
                <div className="flex flex-col gap-8 pl-8 relative">
                  <div className="absolute left-[12px] top-0 bottom-0 w-px bg-[#e5e7eb]" />
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#94a3b8] flex items-center justify-center z-10">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Items Selected</span>
                      <p className="text-[#6a7282] text-sm mt-1">{orderItems.length} registration item{orderItems.length !== 1 ? 's' : ''} were reserved in your cart.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#94a3b8] flex items-center justify-center z-10">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Session Started</span>
                      <p className="text-[#6a7282] text-sm mt-1">Checkout began at 2:34 PM with a 30-minute window.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#64748b] flex items-center justify-center z-10">
                      <TimerOff className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Session Expired</span>
                      <p className="text-[#6a7282] text-sm mt-1">No payment was completed. Reserved items were released back to inventory.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8fafc] rounded-[14px] border border-[rgba(0,0,0,0.08)] p-5 sm:p-6 flex flex-col gap-3">
                <span className="text-[#64748b] text-[13px] font-semibold uppercase tracking-[0.3px]">Released Items</span>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between opacity-60">
                    <span className="text-[#4a5565] text-sm line-through">{item.label} #{item.id}</span>
                    <span className="text-[#94a3b8] text-sm font-medium tabular-nums line-through">{fmt(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <PrimaryButton
                  onClick={handleRetryCheckout}
                  fullWidth
                  className="py-3.5"
                  loading={isRetrying}
                >
                  Start New Checkout
                </PrimaryButton>
                <button
                  onClick={() => navigate('/events')}
                  disabled={isRetrying}
                  className="w-full py-3 bg-white border border-[#e5e7eb] rounded-[8px] text-[#101828] text-[15px] font-semibold hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
                >
                  Browse Events
                </button>
              </div>

              <div className="bg-gradient-to-b from-[#177564] to-[#21a58d] rounded-[14px] p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <span className="text-white text-[17px] font-bold tracking-[-0.44px] block">Find more events?</span>
                  <span className="text-white/80 text-sm mt-1 block">Browse our catalog for more running events.</span>
                </div>
                <button onClick={() => navigate('/events')} className="px-4 py-2 bg-[#eceef2] text-[#177564] text-sm font-medium rounded-[8px] hover:bg-white transition-colors shrink-0">
                  Browse
                </button>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-5 sm:p-6 flex flex-col gap-3">
                <span className="text-[#101828] text-[15px] font-semibold">Need help?</span>
                <p className="text-[#6a7282] text-sm leading-relaxed">
                  If you believe this was an error or need assistance, contact our support team at <span className="text-[#177564] font-medium">support@planout.ph</span>
                </p>
              </div>
            </>)}

            {/* ========== REGISTERED STATE ================== */}
            {confirmationState === 'registered' && (<>
              <div className="rounded-[14px] overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
                <div className="relative h-[200px] overflow-hidden">
                  <img src={imgBannerConfirmed} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <PartyPopper className="w-8 h-8" />
                    </div>
                    <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight">
                      Registration Complete!
                    </h2>
                    <p className="text-sm text-white/90 mt-1 max-w-[420px]">
                      You're all set! We've sent a confirmation email to <span className="font-bold">{email || 'john.doe@email.com'}</span> with your registration details and receipt.
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-3.5 flex items-center justify-between border-t border-[#f3f4f6]">
                  <span className="text-[#6a7282] text-sm">Confirmation Reference</span>
                  <span className="text-[#101828] text-[15px] font-medium">{confirmRef}</span>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-5 sm:p-6">
                <h4 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px] mb-6">What Happens Next?</h4>
                <div className="flex flex-col gap-8 pl-8 relative">
                  <div className="absolute left-[12px] top-0 bottom-0 w-px bg-[#e5e7eb]" />
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#177564] flex items-center justify-center z-10">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Order Confirmed</span>
                      <p className="text-[#6a7282] text-sm mt-1">We've received your order and sent a confirmation to your email.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#e5e7eb] flex items-center justify-center z-10">
                      <span className="text-[#6a7282] text-[11px]">2</span>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Present your Passport</span>
                      <p className="text-[#6a7282] text-sm mt-1">Present your Passport QR at the gate. No separate tickets needed.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#e5e7eb] flex items-center justify-center z-10">
                      <span className="text-[#6a7282] text-[11px]">3</span>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Event Day</span>
                      <p className="text-[#6a7282] text-sm mt-1">Open your PlanOut passport at the registration booth on event day. Staff will scan the universal QR.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#fafafa] rounded-[14px] border border-[rgba(0,0,0,0.08)] p-5 sm:p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#1e9680]" />
                    <span className="text-[#101828] text-[15px] font-semibold">Order Items</span>
                  </div>
                  <span className="text-[#6a7282] text-[13px]">{orderItems.length} ticket{orderItems.length !== 1 ? 's' : ''}</span>
                </div>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-[#4a5565] text-sm">{item.label} #{item.id}</span>
                    <span className="text-[#101828] text-sm font-medium tabular-nums">{fmt(item.price)}</span>
                  </div>
                ))}
                <div className="h-px bg-black/5 my-0.5" />
                <div className="flex items-center justify-between">
                  <span className="text-[#101828] text-[15px] font-bold">Total</span>
                  <span className="text-[#101828] text-[18px] font-bold tabular-nums">{fmt(orderItems.reduce((s, t) => s + t.price, 0))}</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#177564] to-[#21a58d] rounded-[14px] p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <span className="text-white text-[17px] font-bold tracking-[-0.44px] block">Find more events?</span>
                  <span className="text-white/80 text-sm mt-1 block">Browse our catalog for more running events.</span>
                </div>
                <button onClick={() => navigate('/events')} className="px-4 py-2 bg-[#eceef2] text-[#177564] text-sm font-medium rounded-[8px] hover:bg-white transition-colors shrink-0">
                  Browse
                </button>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <span className="text-[#101828] text-[17px] font-bold tracking-[-0.44px] block">Want to organize your own event?</span>
                  <span className="text-[#6a7282] text-sm mt-1 block">Launch your own event page in minutes and accept payments instantly.</span>
                </div>
                <button onClick={() => navigate('/settings/apply-organizer')} className="px-4 py-2 bg-white border border-[#177564] text-[#177564] text-sm font-medium rounded-[8px] hover:bg-[#f0fdf9] transition-colors self-start shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]">
                  Apply as Organizer
                </button>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#1e9680]" />
                      <span className="text-[#1e9680] text-[15px] font-bold">Customer Details</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between"><span className="text-[#6a7282] text-sm">Name:</span><span className="text-[#101828] text-sm font-medium">{firstName || 'John'} {lastName || 'Doe'}</span></div>
                      <div className="flex justify-between"><span className="text-[#6a7282] text-sm">Email:</span><span className="text-[#101828] text-sm font-medium">{email || 'john.doe@email.com'}</span></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-[#1e9680]" />
                      <span className="text-[#1e9680] text-[15px] font-bold">Order Information</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between"><span className="text-[#6a7282] text-sm">Date:</span><span className="text-[#101828] text-sm font-bold">Feb 05, 2026</span></div>
                      <div className="flex justify-between"><span className="text-[#6a7282] text-sm">Status:</span><span className="text-sm font-medium text-[#1e9680]">Completed</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/orders')}
                className="w-full py-3 bg-white border border-[#177564] border-[0.539px] rounded-[8px] text-[#177564] text-[14px] font-medium tracking-[-0.1504px] hover:bg-[#f0fdfa] transition-colors shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]"
              >
                View Orders
              </button>

              <div className="bg-[#f5fbf9] rounded-[14px] border border-[rgba(0,0,0,0.1)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] p-5 sm:p-6 flex flex-col gap-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-[#4a5565] text-sm">{item.label} #{item.id}</span>
                    <span className="text-[#101828] text-sm font-medium tabular-nums">{fmt(item.price)}</span>
                  </div>
                ))}
                <div className="h-px bg-black/5 my-0.5" />
                <div className="flex justify-between"><span className="text-[#4a5565] text-sm">Subtotal ({orderItems.length} items)</span><span className="text-[#101828] text-sm font-medium tabular-nums">{fmt(orderItems.reduce((s, t) => s + t.price, 0))}</span></div>
                <div className="flex justify-between"><span className="text-[#4a5565] text-sm">Convenience Fee</span><span className="text-[#101828] text-sm font-medium tabular-nums">{fmt(Math.round(orderItems.reduce((s, t) => s + t.price, 0) * CONVENIENCE_FEE_RATE * 100) / 100)}</span></div>
                {discount > 0 && <div className="flex justify-between"><span className="text-[#1e9680] text-sm">Discount</span><span className="text-[#1e9680] text-sm font-medium tabular-nums">-{fmt(discount)}</span></div>}
                <div className="h-px bg-black/10 my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-[#101828] text-[17px] font-bold tracking-[-0.44px]">Total Amount</span>
                  <span className="text-[#1e9680] text-[22px] font-bold tabular-nums">{fmt(Math.max(0, orderItems.reduce((s, t) => s + t.price, 0) + Math.round(orderItems.reduce((s, t) => s + t.price, 0) * CONVENIENCE_FEE_RATE * 100) / 100 - discount))}</span>
                </div>
              </div>
            </>)}

            {/* ========== PENDING STATE ===================== */}
            {confirmationState === 'pending' && (<>
              <div className="rounded-[14px] overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
                <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-[#92400e] via-[#d97706] to-[#f59e0b]">
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                  <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight">
                     Waiting for Payment
                    </h2>
                    <p className="text-sm text-white/85 mt-1 max-w-[420px]">
                      Please complete your payment to confirm your order. You can pay via bank transfer or any supported method.
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-3.5 flex items-center justify-between border-t border-[#f3f4f6]">
                  <span className="text-[#6a7282] text-sm">Transaction Reference</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#101828] text-[15px] font-medium">{confirmRef}</span>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${holdUrgent ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#fffbeb] border-[#fde68a]'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${holdUrgent ? 'bg-[#ef4444]' : 'bg-[#d97706]'}`} />
                      <span className={`text-[12px] font-bold tabular-nums ${holdUrgent ? 'text-[#dc2626]' : 'text-[#92400e]'}`}>{holdDisplay}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-5 sm:p-6">
                <h4 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px] mb-6">Payment Status</h4>
                <div className="flex flex-col gap-8 pl-8 relative">
                  <div className="absolute left-[12px] top-0 bottom-0 w-px bg-[#e5e7eb]" />
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#177564] flex items-center justify-center z-10">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Order Submitted</span>
                      <p className="text-[#6a7282] text-sm mt-1">Your order has been received and tickets reserved.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#f59e0b] flex items-center justify-center z-10">
                      <span className="text-white text-[11px]">2</span>
                    </div>
                    <div>
                      <span className="text-[#101828] text-[15px] font-medium">Awaiting Payment</span>
                      <p className="text-[#6a7282] text-sm mt-1">Please complete your payment to secure your registration items.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[#e5e7eb] flex items-center justify-center z-10">
                      <span className="text-[#6a7282] text-[11px]">3</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] text-[15px] font-medium">Confirmation</span>
                      <p className="text-[#94a3b8] text-sm mt-1">Each participant's registration status updates once payment and required forms are complete.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#fafafa] rounded-[14px] border border-[rgba(0,0,0,0.08)] p-5 sm:p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="w-4 h-4 text-[#d97706]" />
                  <span className="text-[#101828] text-[15px] font-semibold">Reserved Items</span>
                  <div className="ml-auto inline-flex items-center gap-1 bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-[#d97706]" />
                    <span className="text-[#92400e] text-[10px] font-semibold uppercase">Processing</span>
                  </div>
                </div>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-[#4a5565] text-sm">{item.label} #{item.id}</span>
                    <span className="text-[#101828] text-sm font-medium tabular-nums">{fmt(item.price)}</span>
                  </div>
                ))}
                <div className="h-px bg-black/5 my-0.5" />
                <div className="flex items-center justify-between">
                  <span className="text-[#101828] text-[15px] font-bold">Total</span>
                  <span className="text-[#101828] text-[18px] font-bold tabular-nums">{fmt(Math.max(0, orderItems.reduce((s, t) => s + t.price, 0) + Math.round(orderItems.reduce((s, t) => s + t.price, 0) * CONVENIENCE_FEE_RATE * 100) / 100 - discount))}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <PrimaryButton
                  onClick={() => { setIsConfirmation(false); }}
                  fullWidth
                  className="py-3.5"
                >
                  Continue to Payment
                </PrimaryButton>
              </div>

              <div className="bg-gradient-to-b from-[#177564] to-[#21a58d] rounded-[14px] p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <span className="text-white text-[17px] font-bold tracking-[-0.44px] block">Find more events?</span>
                  <span className="text-white/80 text-sm mt-1 block">Browse our catalog for more running events.</span>
                </div>
                <button onClick={() => navigate('/events')} className="px-4 py-2 bg-[#eceef2] text-[#177564] text-sm font-medium rounded-[8px] hover:bg-white transition-colors shrink-0">
                  Browse
                </button>
              </div>

              <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-5 sm:p-6 flex flex-col gap-3">
                <span className="text-[#101828] text-[15px] font-semibold">Taking longer than expected?</span>
                <p className="text-[#6a7282] text-sm leading-relaxed">
                  Most payments confirm within minutes. If your payment hasn't confirmed within 24 hours, contact our support team at <span className="text-[#177564] font-medium">support@planout.ph</span>
                </p>
              </div>
            </>)}

            {/* ========== SUCCESS STATE ===================== */}
            {confirmationState === 'success' && (<>
              {!allOrderEntriesAttached ? (
                <>
                  {shouldShowInlineConfirmationForm ? (() => {
                    const singleSlot = formSlots[0];
                    const singleSlotData = slotsData[singleSlot?.id] || {
                      deliveryMethod: 'fill',
                      entryOwner: 'self' as CheckoutEntryOwner,
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      uploadedFile: null,
	                      inviteEmail: '',
                    };
                    return (
                      <section className="participant-form-premium participant-form-card rounded-[22px] border border-[#d9e8e5] bg-white p-5 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.52)] sm:p-6 flex flex-col gap-5">
                        <PendingFormsHeroCard
                          eyebrow="1 form needs your attention"
                          title="Finish the required forms to complete your registration."
                          description="Your spot is reserved. Add the attendee details below to attach this registration to PlanOut Passport."
                        />

                        <div className="flex flex-col gap-4">
                          <SegmentedChoice
                            size="sm"
                            value={singleSlotData.deliveryMethod}
                            onChange={(method) => updateSlotFieldGlobal(singleSlot.id, 'deliveryMethod', method)}
                            options={[
                              { value: 'fill', label: 'Fill Details Myself', icon: User },
                              { value: 'invite', label: 'Invite via Email', icon: Mail },
                            ]}
                          />

                          {singleSlotData.deliveryMethod === 'fill' && (
                            <CheckoutEntryOwnerChoice
                              name={`checkout-entry-owner-${singleSlot.id}`}
                              value={singleSlotData.entryOwner}
                              onChange={(owner) => updateSlotFieldGlobal(singleSlot.id, 'entryOwner', owner)}
                              selfTakenByAnotherEntry={isSelfOwnerTakenByAnotherEntry(singleSlot.id)}
                            />
                          )}

                          {singleSlotData.deliveryMethod === 'fill' ? (
                            <div className="flex flex-col gap-4 animate-in fade-in duration-200 mt-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormTextField
                                  label="First Name"
                                  placeholder="Jessica"
                                  value={singleSlotData.firstName}
                                  onChange={(value) => updateSlotFieldGlobal(singleSlot.id, 'firstName', value)}
                                />

                                <FormTextField
                                  label="Last Name"
                                  placeholder="Sanchez"
                                  value={singleSlotData.lastName}
                                  onChange={(value) => updateSlotFieldGlobal(singleSlot.id, 'lastName', value)}
                                />
                              </div>

                              <FormTextField
                                label="Email Address"
                                type="email"
                                placeholder="jessica@email.com"
                                value={singleSlotData.email}
                                onChange={(value) => updateSlotFieldGlobal(singleSlot.id, 'email', value)}
                              />

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormTextField
                                  label="Contact Number"
                                  placeholder="0917 123 4567"
                                  value={singleSlotData.phone}
                                  onChange={(value) => updateSlotFieldGlobal(singleSlot.id, 'phone', value)}
                                />

                                <FormTextField
                                  label="Date of Birth"
                                  placeholder="MM/DD/YYYY"
                                />
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <label className="text-[12px] font-semibold text-[#344054]">Required document</label>
                                </div>
                                <p className="text-[11px] text-[#64748b] leading-normal -mt-0.5">
                                  Upload the file requested by the organizer, such as a waiver, medical certificate, or ID.
                                </p>
                                {singleSlotData.uploadedFile ? (
                                  <div className="participant-form-upload flex items-center justify-between p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#059669]">
                                        <CheckCircle2 className="w-4.5 h-4.5" />
                                      </span>
                                      <div className="min-w-0">
                                        <p className="text-[13px] font-semibold text-[#065f46] truncate">{singleSlotData.uploadedFile}</p>
                                        <p className="text-[10px] text-[#059669]">Upload verified successfully</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => updateSlotFieldGlobal(singleSlot.id, 'uploadedFile', null)}
                                      className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => {
                                      updateSlotFieldGlobal(singleSlot.id, 'uploadedFile', 'medical_clearance_sanchez.pdf');
                                      toast.success('File Uploaded', { description: 'medical_clearance_sanchez.pdf has been attached.' });
                                    }}
                                    className="participant-form-upload border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-5 text-center flex flex-col items-center justify-center hover:bg-slate-100/50 hover:border-[#177564]/40 transition-all cursor-pointer select-none group"
                                  >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-150 shadow-sm text-slate-400 group-hover:scale-105 transition-transform mb-2">
                                      <Plus className="w-5 h-5 text-slate-450" />
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">Upload document</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 5MB</span>
                                  </div>
                                )}
                              </div>

	                            </div>
                          ) : (
                              <div className="flex flex-col gap-4 animate-in fade-in duration-200 mt-1">
                                <FormTextField
                                  label="Participant email"
                                  required
                                  type="email"
                                  placeholder="participant@email.com"
                                  value={singleSlotData.inviteEmail}
                                  onChange={(value) => updateSlotFieldGlobal(singleSlot.id, 'inviteEmail', value)}
                                />
                                <p className="text-[11px] text-[#64748b] leading-normal mt-1">
                                  We will email the form link to this participant.
                                </p>
                            </div>
                          )}

                          <PrimaryButton
                            onClick={handleInlineSubmit}
                            disabled={isSubmittingForm}
                            fullWidth
                            className="h-11 rounded-[12px] px-8 text-sm mt-1"
                          >
                            {isSubmittingForm ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>{singleSlotData.deliveryMethod === 'invite' ? 'Sending...' : 'Submitting...'}</span>
                              </div>
                            ) : (
                              singleSlotData.deliveryMethod === 'invite' ? 'Send invitation' : 'Save details'
                            )}
                          </PrimaryButton>
                        </div>
                      </section>
                    );
                  })() : (
                    <section className="overflow-hidden rounded-[20px] border border-[#d9e8e5] bg-white shadow-[0_18px_42px_-34px_rgba(15,23,42,0.52)]">
                      <div className={`grid gap-5 p-5 sm:p-6 ${displayedItems.length > 1 ? '' : 'md:grid-cols-[minmax(0,1fr)_224px]'}`}>
                        <div className="min-w-0">
                          <PendingFormsHeroCard
                            eyebrow={`${pendingConfirmationEntries.length} form${pendingConfirmationEntries.length === 1 ? '' : 's'} need your attention`}
                            title="Finish the required forms to complete your registration."
                            description="Your order is paid and reserved. Choose how each participant receives their entry: a claim link for their Passport or a buyer-filled app-less Guest QR."
                            progress={`${requiredFormsCompleted}/${requiredFormsTotal}`}
                          />

                          {sentEmails.length > 0 && (
                            <div className="mt-4 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] p-4 text-left flex gap-3 items-start">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#d1fae5] text-[#047857] mt-0.5">
                                <Send className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-[#065f46]">
                                  Player claim links sent!
                                </p>
                                <p className="text-xs text-[#047857] mt-1 leading-relaxed">
                                  Email invites have been automatically sent to <strong>{sentEmails.join(', ')}</strong> now that your payment is complete.
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="mt-5 grid gap-3">
                            {pendingConfirmationEntries.map((entry) => {
                              const statusLabel = entry.type === 'team'
                                ? 'Details pending'
                                : entry.entryStatus === 'resubmit_required'
                                  ? 'Resubmission needed'
                                  : entry.type === 'guest'
                                    ? 'Guest form needed'
                                    : '1 form needed';
                              return (
                                <button
                                  key={entry.id}
                                  type="button"
                                  aria-label={`${entry.eventName}, ${entry.category}, ${statusLabel}${entry.deadline ? `, due ${entry.deadline}` : ''}`}
                                  onClick={() => {
                                    seedRegistrationQueue(confirmationEntries, confirmRef);
                                    navigate(`${entry.formRoute}?entryId=${entry.id}`);
                                  }}
                                className="group flex w-full min-w-0 items-center gap-3 rounded-[16px] border border-[#e4edf0] bg-white p-3 text-left shadow-[0_12px_26px_-24px_rgba(15,23,42,0.38)] transition-all hover:border-[#cfe4df] hover:bg-[#fbfdfc] active:scale-[0.99]"
                                >
                                  <span className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[12px] bg-[#eef2f6]">
                                    <ImageWithFallback
                                      src={imageForConfirmationEntry(entry)}
                                      alt={entry.eventName}
                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                    />
                                  </span>
                                  <div className="min-w-0 flex-1 py-0.5">
                                  <p className="line-clamp-2 text-[13px] font-semibold leading-[1.2] text-[#181d27]">
                                      {entry.eventName}
                                      {entry.type === 'guest' && ` · ${entry.personName}`}
                                    </p>
                                  <p className="mt-1 truncate text-[12.5px] font-semibold leading-tight text-[#475569]">
                                      {entry.category}
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                      <span className="rounded-full bg-[#eef8f5] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#177564]">
                                        {statusLabel}
                                      </span>
                                      {entry.deadline && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f8fafc] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#64748b]">
                                          <CalendarDays className="h-3 w-3" strokeWidth={1.8} />
                                          Due {entry.deadline}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-1 text-[#177564]" aria-hidden="true">
                                    <span className="hidden text-[13px] font-medium sm:inline">
                                      {entry.type === 'team' ? 'Complete player details' : 'Finish form'}
                                    </span>
                                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="text-[13px] font-medium text-[#64748b] transition-colors hover:text-[#414651]"
                    >
                      Do this later
                    </button>
                  </div>

                  {confirmationOrderDetails}

                </>
              ) : (
                <>
                  <section
                    data-confirmation-success={frontloadedFormComplete ? 'frontloaded-form' : 'passport-ready'}
                    className="rounded-[22px] border border-[#d9e8e5] bg-white p-5 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.52)] sm:p-6"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cce8e2] bg-[#f5fbf9] px-2.5 py-1 text-[11px] font-semibold text-[#177564]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {frontloadedFormComplete ? 'Form completed before checkout' : 'Passport ready'}
                    </span>
                    <h2 className="mt-3 max-w-[560px] text-[28px] font-semibold leading-[1.05] tracking-[-0.9px] text-[#181d27] sm:text-[34px]">
                      Registration confirmed
                    </h2>
                    <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed text-[#64748b]">
                      {frontloadedFormComplete
                        ? 'Your participant details were completed before payment and attached to your PlanOut Passport. Present the universal QR at the venue.'
                        : 'Your registrations are attached to PlanOut Passport. Present the universal QR at the venue.'}
                    </p>
                    <div className="mt-5 grid gap-4 border-t border-[#eef2f6] pt-4 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28px] text-[#94a3b8]">
                          Order reference
                        </p>
                        <p className="mt-1 font-mono text-[13px] font-semibold text-[#181d27]">
                          {confirmRef}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28px] text-[#94a3b8]">
                          Entries
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-[#181d27]">
                          {confirmationEntries.length} attached
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28px] text-[#94a3b8]">
                          Total paid
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-[#177564]">
                          {fmt(confirmationTotal)}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[18px] border border-neutral-100 bg-white p-5 shadow-[0_16px_38px_-34px_rgba(15,23,42,0.46)]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#177564]" />
                      <h3 className="text-[17px] font-semibold tracking-[-0.35px] text-[#101828]">
                        What happens next
                      </h3>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="border-t border-[#eef2f6] pt-3">
                        <p className="text-[13px] font-semibold text-[#101828]">Check your inbox</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-[#64748b]">
                          Receipt and registration details were sent to {email || 'your email'}.
                        </p>
                      </div>
                      <div className="border-t border-[#eef2f6] pt-3">
                        <p className="text-[13px] font-semibold text-[#101828]">Use Passport at check-in</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-[#64748b]">
                          Open your PlanOut Passport and show the QR at the gate.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <PrimaryButton onClick={() => navigate('/passport')} fullWidth className="py-3.5">
                      View Passport
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => navigate('/orders')}
                      className="h-[46px] px-5 text-[14px]"
                    >
                      View orders
                    </SecondaryButton>
                  </div>

                  {confirmationOrderDetails}
                </>
              )}
            </>)}
          </div>

          {/* Right Column: Ticket Card (Desktop) */}
          <div className="hidden lg:block lg:sticky lg:top-[96px]">
            {confirmationState === 'failed' && (
              <div className="flex flex-col gap-4">
                <div className="relative rounded-[14px] overflow-hidden">
                  <div className="blur-[3px] opacity-40 pointer-events-none select-none grayscale">
                    <PassportStatusCard status="failed" passportCode={member.passportCode} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-[14px]">
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center shadow-[0px_4px_12px_rgba(239,68,68,0.12)]">
                        <XCircle className="w-6 h-6 text-[#ef4444]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[#101828] text-[16px] font-semibold tracking-[-0.3px]">Payment Failed</span>
                        <p className="text-[#6a7282] text-[13px] leading-relaxed max-w-[220px]">Retry payment to keep this registration moving.</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-[#fef2f2] border border-[#fecaca] px-3 py-1.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5 text-[#ef4444]" />
                        <span className="text-[#991b1b] text-[11px] font-semibold uppercase tracking-[0.3px]">Failed</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center justify-center gap-2 py-2.5 rounded-[10px] border ${holdUrgent ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#fffbeb] border-[#fde68a]'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${holdUrgent ? 'bg-[#ef4444]' : 'bg-[#d97706]'}`} />
                  <span className={`text-[13px] font-bold tabular-nums ${holdUrgent ? 'text-[#dc2626]' : 'text-[#92400e]'}`}>
                    Hold expires in {holdDisplay}
                  </span>
                </div>
                <PrimaryButton onClick={() => { setIsConfirmation(false); }} fullWidth className="py-3">
                  Continue to Payment
                </PrimaryButton>
              </div>
            )}

            {confirmationState === 'expired' && (
              <div className="flex flex-col gap-4">
                <div className="relative rounded-[14px] overflow-hidden">
                  <div className="blur-[3px] opacity-30 pointer-events-none select-none grayscale">
                    <PassportStatusCard status="expired" passportCode={member.passportCode} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-[14px]">
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
                        <TimerOff className="w-6 h-6 text-[#64748b]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[#101828] text-[16px] font-semibold tracking-[-0.3px]">Session Expired</span>
                        <p className="text-[#6a7282] text-[13px] leading-relaxed max-w-[220px]">Reserved items have been released.</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-1.5 rounded-full">
                        <TimerOff className="w-3.5 h-3.5 text-[#64748b]" />
                        <span className="text-[#475569] text-[11px] font-semibold uppercase tracking-[0.3px]">Expired</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setConfirmationState('success'); setIsConfirmation(false); }}
                  className="w-full py-3 bg-white border border-[#e5e7eb] rounded-[8px] text-[#101828] text-[15px] font-semibold hover:bg-[#f8fafc] transition-colors"
                >
                  Start New Checkout
                </button>
              </div>
            )}

            {confirmationState === 'registered' && <PassportStatusCard status="ready" passportCode={member.passportCode} />}

            {confirmationState === 'pending' && (
              <div className="flex flex-col gap-4">
                <div className="relative rounded-[14px] overflow-hidden">
                  <div className="blur-[2px] opacity-50 pointer-events-none select-none">
                    <PassportStatusCard status="pending" passportCode={member.passportCode} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-[14px]">
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#d97706] animate-spin" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[#101828] text-[16px] font-semibold tracking-[-0.3px]">Processing</span>
                        <p className="text-[#6a7282] text-[13px] leading-relaxed max-w-[220px]">Waiting for payment confirmation.</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-[#fffbeb] border border-[#fde68a] px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-[#d97706]" />
                        <span className="text-[#92400e] text-[11px] font-semibold uppercase tracking-[0.3px]">Verifying</span>
                      </div>
                    </div>
                  </div>
                </div>
                <PrimaryButton onClick={() => { setIsConfirmation(false); }} fullWidth className="py-3">
                  Continue to Payment
                </PrimaryButton>
              </div>
            )}

            {confirmationState === 'success' && (
              <>
                {allOrderEntriesAttached ? (
                  <PassportStatusCard status="ready" passportCode={member.passportCode} />
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="relative rounded-[14px] overflow-hidden">
                      <div className="blur-[2px] opacity-60 pointer-events-none select-none">
                        <PassportStatusCard status="locked" passportCode={member.passportCode} />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-[14px]">
                        <div className="flex flex-col items-center gap-3 px-6 text-center">
                          <div className="w-14 h-14 rounded-full bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center shadow-[0px_4px_12px_rgba(217,119,6,0.12)]">
                            <Lock className="w-6 h-6 text-[#d97706]" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#101828] text-[16px] font-semibold tracking-[-0.3px]">Forms needed</span>
                            <p className="text-[#6a7282] text-[13px] leading-relaxed max-w-[220px]">Complete the participant form before event access is ready.</p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 bg-[#fffbeb] border border-[#fde68a] px-3 py-1.5 rounded-full">
                            <Clock className="w-3.5 h-3.5 text-[#d97706]" />
                            <span className="text-[#92400e] text-[11px] font-semibold uppercase tracking-[0.3px]">Form Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {shouldShowInlineConfirmationForm ? (
                      <PrimaryButton
                        onClick={() => {
                          const inputEl = document.querySelector('input[placeholder="Jessica"]');
                          if (inputEl) {
                            (inputEl as HTMLInputElement).focus();
                            inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        fullWidth
                        className="py-3"
                      >
                        Fill form on page
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={openFirstRequiredForm}
                        fullWidth
                        className="py-3"
                      >
                        Finish details
                      </PrimaryButton>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* --- Locked Ticket Dialog --- */}
        <ConfirmDialog
          open={lockedDialogOpen}
          onOpenChange={setLockedDialogOpen}
          title="Forms needed"
          description="Complete the participant registration form before event access is ready."
          icon={<Lock className="w-6 h-6" />}
          iconVariant="warning"
          cancelLabel="Got It"
          confirmLabel="Complete Form"
          variant="default"
          onConfirm={() => {
            setLockedDialogOpen(false);
            navigate('/orders?filter=action_required');
          }}
        >
          {(() => {
            const dialogItem = orderItems.find((t) => t.id === lockedDialogTicketId);
            return (
              <div className="bg-[#f9fafb] rounded-[12px] border border-dashed border-[#e5e7eb] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#f3f4f6] flex items-center justify-center shrink-0">
                  <Lock className="w-[18px] h-[18px] text-[#9ca3af]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#6a7282] text-[13px] font-semibold truncate">
                    {dialogItem ? `${dialogItem.label} #${dialogItem.id}` : 'Entry'}
                  </p>
                  <p className="text-[#9ca3af] text-[11px] mt-0.5">
                    Form required to unlock
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 bg-[#fffbeb] border border-[#fde68a] px-2 py-1 rounded-full shrink-0">
                  <Clock className="w-3 h-3 text-[#d97706]" />
                  <span className="text-[#92400e] text-[10px] font-semibold">Pending</span>
                </div>
              </div>
            );
          })()}
        </ConfirmDialog>
      </div>
    );
  }

  // =========================================================================
  // CHECKOUT FORM (single step)
  // =========================================================================

  // Shared order summary content (used by both mobile inline + desktop sidebar)
  const renderOrderSummaryContent = (withCta: boolean) => (
    <div className="flex flex-col">
      <div className="px-5 py-3.5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-[18px] h-[18px] text-[#1e9680]" />
          <span className="text-[#1e9680] text-[17px] font-semibold tracking-[-0.44px]">
            Order Summary
          </span>
        </div>
      </div>

      <div className="border-b border-neutral-100 px-5 py-3">
        <div className={`flex items-center justify-between gap-3 rounded-[12px] border px-3 py-2.5 ${reservationUrgent ? 'border-[#fecaca] bg-[#fef2f2]' : 'border-[#fde68a] bg-[#fffbeb]'}`}>
          <div className="flex min-w-0 items-center gap-2">
            <Clock className={`h-4 w-4 shrink-0 ${reservationUrgent ? 'text-[#ef4444]' : 'text-[#d97706]'}`} />
            <span className={`truncate text-[12px] font-semibold ${reservationUrgent ? 'text-[#dc2626]' : 'text-[#92400e]'}`}>
              Cart reserved
            </span>
          </div>
          <span className={`shrink-0 text-[13px] font-bold tabular-nums ${reservationUrgent ? 'text-[#dc2626]' : 'text-[#92400e]'}`}>
            {reservationTime}
          </span>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Event items list */}
        <div className="flex flex-col gap-4">
          {displayedItems.map((item, idx) => {
            const qty = idx === 0 ? itemQuantity : 1;
            return (
              <div key={item.id} className="flex gap-3.5 items-start">
                <div className="w-[50px] h-[70px] rounded-[8px] overflow-hidden bg-neutral-100 shrink-0">
                  <ImageWithFallback src={image} alt={item.eventName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5 justify-start">
                  <span className="text-[#101828] text-[13px] font-semibold leading-snug line-clamp-2">{item.eventName}</span>
                  <span className="text-[#6a7282] text-[12px]">{item.category}</span>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 self-center">
                  <span className="text-[#101828] text-[13px] font-semibold whitespace-nowrap tabular-nums">{fmt(item.price * qty)}</span>
                  {idx === 0 && !(item.requiresForm && getItemFormTiming(item) === 'before_checkout') ? (
                    <div className="flex items-center gap-1 rounded-[8px] border border-neutral-100 bg-white p-0.5">
                      <button
                        onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                        disabled={itemQuantity <= 1}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] text-[#177564] disabled:text-[#cbd5e1] disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="min-w-[14px] select-none text-center text-[12px] font-semibold leading-none tabular-nums text-[#181d27]">
                        {itemQuantity}
                      </span>
                      <button
                        onClick={() => setItemQuantity((q) => q + 1)}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] text-[#177564] active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium leading-none">Qty: {qty}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Voucher */}
        {appliedVoucher ? (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-neutral-100 rounded-[10px]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#177564] shrink-0" />
              <span className="text-[#177564] text-xs font-bold uppercase tracking-wide">
                {appliedVoucher.code} — {fmt(appliedVoucher.discount)} off
              </span>
            </div>
            <button onClick={removeVoucher} className="text-[#64748b] hover:text-[#181d27] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : !voucherExpanded ? (
          <button
            onClick={() => setVoucherExpanded(true)}
            className="flex items-center gap-2 text-[#177564] text-sm font-medium hover:text-[#125c4f] transition-colors py-1 self-start"
          >
            <Tag className="w-3.5 h-3.5" />
            Do you have a voucher?
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-[#414651] text-sm font-medium">Voucher / Discount Code</span>
            <div className="flex gap-2">
              <input
                type="text"
                autoComplete="off"
                enterKeyHint="done"
                aria-label="Voucher or discount code"
                placeholder="Enter code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyVoucher()}
                className="flex-1 bg-white border border-[#d5d7da] rounded-[8px] px-3.5 py-2.5 text-sm text-[#181d27] placeholder:text-[rgba(24,29,39,0.5)] focus:outline-none focus:ring-2 focus:ring-[#177564]/20 focus:border-[#177564] transition-all shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                autoFocus
              />
              <PrimaryButton onClick={applyVoucher} compact className="shrink-0">Apply</PrimaryButton>
            </div>
            {voucherError && <p className="text-red-500 text-xs font-medium">{voucherError}</p>}
          </div>
        )}

        {/* Totals */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[#6a7282] text-sm">Items Subtotal</span>
            <span className="text-[#101828] text-sm tabular-nums">{fmt(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6a7282] text-sm">Convenience Fee</span>
            <span className="text-[#101828] text-sm tabular-nums">{fmt(convenienceFee)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#177564] text-sm">Discount</span>
              <span className="text-[#177564] text-sm font-medium tabular-nums">-{fmt(discount)}</span>
            </div>
          )}
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-[#101828] text-[17px] font-semibold tracking-[-0.44px]">Total</span>
          <div className="flex flex-col items-end">
            <span className="text-[#1e9680] text-[22px] font-bold tabular-nums">{fmt(total)}</span>
            <span className="text-[#94a3b8] text-[11px]">(VAT included if applicable)</span>
          </div>
        </div>

        {/* CTA Button */}
        {withCta && (
          <PrimaryButton onClick={handlePurchase} fullWidth className="py-3.5">
            Place Order {fmt(total)}
          </PrimaryButton>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-6" data-checkout-form-state={checkoutFormState}>
      {/* --- Header --- */}
      {!showPreCheckoutForms && (
        <div className="flex items-center">
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#181d27] leading-none tracking-tight">
            Checkout
          </h1>
        </div>
      )}

      {/* --- Content --- */}
      <div className={`grid grid-cols-1 gap-6 lg:gap-8 items-start ${showPreCheckoutForms ? 'lg:grid-cols-1' : 'lg:grid-cols-[1fr_360px]'}`}>
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          {/* Deferred-form awareness banner — shown on the payment screen (not during the
              gated step, which carries its own inline note) whenever forms are deferred
              to after checkout. Covers all-deferred and post-gate mixed carts. */}
          {!showPreCheckoutForms && pendingCheckoutPreviewItems.length > 0 && (
            <FormRequirementsPreview items={pendingCheckoutPreviewItems} />
          )}

          {showPreCheckoutForms && (
            <div className="participant-form-premium space-y-4 pt-[124px] lg:pt-0" data-pre-payment-gate>
              <div
                aria-hidden
                className="pointer-events-none fixed inset-x-0 top-0 z-10 h-[172px] bg-[#f8fafc]/96 lg:hidden"
              />
              <div className="fixed inset-x-0 top-[70px] z-20 border-b border-[#dce5e1] bg-[#f8fafc]/96 px-4 py-3 shadow-none sm:px-8 lg:sticky lg:left-auto lg:right-auto lg:top-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#eef8f5] text-[#177564]">
                      <ClipboardList className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[#6a817b]">
                        Required before payment
                      </p>
                      <h2 className="mt-0.5 truncate text-[14px] font-semibold leading-tight text-[#18201d]">
                        Participant details
                      </h2>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#dce5e1] bg-[#f8fafc] px-2.5 py-1 text-[12px] font-semibold text-[#34413c]">
                    {preCheckoutCompleteCount}/{preCheckoutTotalCount}
                  </span>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {preCheckoutVisibleSlots.map((slot, index) => {
                    const data = slotsData[slot.id];
                    const isActive = activeSlotId === slot.id;
                    const isComplete = isSlotComplete(data, slot.item);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setActiveSlotId(slot.id)}
                        aria-current={isActive ? 'step' : undefined}
                        className={`flex min-h-[50px] min-w-[190px] max-w-[230px] shrink-0 items-center gap-2 rounded-[11px] border px-2.5 text-left transition-colors active:scale-[0.99] sm:min-w-[210px] ${isActive ? 'border-[#b8cec7] bg-[#f8fbfa]' : 'border-[#e5ece8] bg-white hover:bg-[#f8fafc]'}`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isComplete ? 'bg-[#e4f4ef] text-[#177564]' : isActive ? 'bg-[#eef8f5] text-[#177564]' : 'bg-[#f1f5f3] text-[#6a817b]'}`}>
                          {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold leading-tight text-[#34413c]">
                            {slot.item.category}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] font-medium text-[#6a817b]">
                            {slot.item.eventName}{slot.guestIndex !== 0 ? ` · Guest ${slot.guestIndex}` : ''}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {preCheckoutVisibleSlots
                .filter((slot, index) => (activeSlotId ? slot.id === activeSlotId : index === 0))
                .map((slot) => {
                const data = slotsData[slot.id];
                if (!data) return null;

                const updateSlotField = (field: keyof SlotFormData, value: any) => {
                  setSlotsData((prev) => ({
                    ...prev,
                    [slot.id]: {
                      ...prev[slot.id],
                      [field]: value,
                    },
                  }));
                };

                const is65K = slot.item.category.includes('65K');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                const isFilledComplete = !!(
	                  data.firstName.trim() &&
	                  data.lastName.trim() &&
	                  data.email.trim() &&
	                  emailRegex.test(data.email.trim()) &&
	                  (!is65K || data.uploadedFile)
	                );

                const isInviteComplete = !!(
                  data.inviteEmail.trim() &&
                  emailRegex.test(data.inviteEmail.trim())
                );

                const isCompleted = data.deliveryMethod === 'fill' ? isFilledComplete : isInviteComplete;
                const isActive = activeSlotId === slot.id;

                return (
                  <div key={slot.id} className="participant-form-card overflow-hidden rounded-[16px] border border-[#d5e3df] bg-white shadow-[0_8px_18px_-16px_rgba(15,23,42,0.42)] transition-all duration-300">
                    {/* Header */}
	                    <div className="flex w-full items-center justify-between px-5 py-4 text-left">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="text-[16px] font-semibold leading-tight tracking-[-0.3px] text-[#181d27] truncate">
                          {slot.label}
                        </h3>
                        <p className="mt-1 truncate text-[12px] font-medium text-[#64748b]">
                          {slot.item.label}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {isCompleted ? (
                          data.deliveryMethod === 'fill' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#ecfdf5] bg-[#ecfdf5] px-2.5 py-0.5 text-[10px] font-bold text-[#047857]">
                              <CheckCircle2 className="w-3 h-3 text-[#047857]" />
                              Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-teal-50 bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700">
                              <Send className="w-3 h-3 text-teal-600" />
                              Invite: {data.inviteEmail}
                            </span>
                          )
                        ) : null}
                        
	                      </div>
	                    </div>

                    {/* Expandable Form Body */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden border-t border-slate-100 bg-white"
                        >
                          <div className="p-5 flex flex-col gap-4">
                            <SegmentedChoice
                              size="sm"
                              value={data.deliveryMethod}
                              onChange={(method) => updateSlotField('deliveryMethod', method)}
                              options={[
                                { value: 'fill', label: 'Fill Details Myself', icon: User },
                                { value: 'invite', label: 'Invite via Email', icon: Mail },
                              ]}
                            />

                            {data.deliveryMethod === 'fill' && (
                              <CheckoutEntryOwnerChoice
                                name={`checkout-entry-owner-${slot.id}`}
                                value={data.entryOwner}
                                onChange={(owner) => updateSlotField('entryOwner', owner)}
                                selfTakenByAnotherEntry={isSelfOwnerTakenByAnotherEntry(slot.id)}
                              />
                            )}

                            {data.deliveryMethod === 'fill' ? (
                              <div className="flex flex-col gap-4 animate-in fade-in duration-200 mt-1">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  <FormTextField
                                    label="First name"
                                    required
                                    placeholder="Jessica"
                                    value={data.firstName}
                                    onChange={(value) => updateSlotField('firstName', value)}
                                  />

                                  <FormTextField
                                    label="Last name"
                                    required
                                    placeholder="Sanchez"
                                    value={data.lastName}
                                    onChange={(value) => updateSlotField('lastName', value)}
                                  />

                                  <FormTextField
                                    label="Email address"
                                    required
                                    type="email"
                                    placeholder="jessica@email.com"
                                    value={data.email}
                                    onChange={(value) => updateSlotField('email', value)}
                                  />

                                  <FormTextField
                                    label="Contact number"
                                    placeholder="0917 123 4567"
                                    value={data.phone}
                                    onChange={(value) => updateSlotField('phone', value)}
                                  />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[12px] font-semibold text-[#344054]">Required document {is65K && <span className="text-red-500">*</span>}</label>
                                  </div>
                                  <p className="text-[12px] text-[#64748b] leading-normal -mt-0.5">
                                    Upload the file requested by the organizer, such as a waiver, medical certificate, or ID.
                                  </p>
                                  {data.uploadedFile ? (
                                    <div className="participant-form-upload flex items-center justify-between rounded-xl border border-[#a7f3d0] bg-[#ecfdf5] p-3">
                                      <div className="flex min-w-0 items-center gap-2">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#059669]">
                                          <CheckCircle2 className="h-4 w-4" />
                                        </span>
                                        <div className="min-w-0">
                                          <p className="truncate text-xs font-semibold text-[#065f46]">{data.uploadedFile}</p>
                                          <p className="text-[9px] text-[#059669]">Upload verified successfully</p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => updateSlotField('uploadedFile', null)}
                                        className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 cursor-pointer"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateSlotField('uploadedFile', 'medical_clearance_sanchez.pdf');
                                        toast.success('File Uploaded', { description: `medical_clearance_sanchez.pdf attached for ${slot.label}.` });
                                      }}
                                      className="participant-form-upload flex cursor-pointer select-none flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center transition-all hover:border-[#177564]/40 hover:bg-slate-50"
                                    >
                                      <span className="mb-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 shadow-xs">
                                        <Plus className="h-4.5 w-4.5" />
                                      </span>
                                      <span className="text-[12px] font-semibold text-slate-700">Upload document</span>
                                      <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 5MB</span>
                                    </button>
                                  )}
                                </div>

	                              </div>
                            ) : (
                              <div className="flex flex-col gap-3 animate-in fade-in duration-200 mt-1">
                                <FormTextField
                                  label="Participant email"
                                  required
                                  type="email"
                                  placeholder="participant@email.com"
                                  value={data.inviteEmail}
                                  onChange={(value) => updateSlotField('inviteEmail', value)}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <DeferredCheckoutFormsSummary items={afterCheckoutPreviewItems} />

              <div className="mt-1 flex flex-col gap-2">
                <PrimaryButton
                  type="button"
                  onClick={handleInlineSubmit}
                  disabled={isSubmittingForm || gatedCompleteCount < gatedTotalCount}
                  aria-disabled={isSubmittingForm || gatedCompleteCount < gatedTotalCount}
                  fullWidth
                  className="h-14 rounded-full px-8 text-sm shadow-[0_16px_28px_-18px_rgba(23,117,100,0.72)]"
                >
                  {isSubmittingForm ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save details and continue'
                  )}
                </PrimaryButton>
              </div>
            </div>
          )}

          {!showPreCheckoutForms && (
            <>
              {/* Order Summary (mobile — always visible inline) */}
              <div className="lg:hidden">
                <div className="bg-white rounded-[18px] border border-neutral-100 overflow-hidden">
                  {renderOrderSummaryContent(false)}
                </div>
              </div>

              {/* Contact Info — card display + drawer */}
              <div className="bg-white rounded-[18px] border border-neutral-100 overflow-hidden">
            <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-neutral-100">
              <h3 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px]">
                Primary Contact Information
              </h3>
            </div>

            <div className="px-5 sm:px-6 py-5 sm:py-6">
              {firstName && email && phone ? (
                <button
                  onClick={() => setContactDrawerOpen(true)}
                  className="w-full flex items-center gap-3 rounded-[12px] border-[1.5px] border-[#1e9680] bg-[#f0fdfa] px-3.5 py-3 transition-all hover:opacity-90 group"
                >
                  <div className="w-10 h-10 rounded-[8px] bg-[#def2ee] border border-[#1e9680]/20 flex items-center justify-center shrink-0">
                    <User className="w-[18px] h-[18px] text-[#1e9680]" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-[#15695a] text-sm font-semibold tracking-[-0.15px] truncate block">{firstName} {lastName}</span>
                    <span className="text-[#6a7282] text-[12px] truncate block">{email} · {phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#1e9680] group-hover:text-[#15695a] transition-colors shrink-0">
                    <span className="text-[13px] font-medium">Edit</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setContactDrawerOpen(true)}
                  className="w-full flex items-center gap-3 rounded-[12px] border-[1.5px] border-dashed border-[#d5d7da] bg-[#fafafa] px-3.5 py-3.5 transition-all hover:border-[#1e9680] hover:bg-[#f0fdfa] group"
                >
                  <div className="w-10 h-10 rounded-[8px] bg-[#f3f4f6] border border-[#e5e7eb]/60 flex items-center justify-center shrink-0 group-hover:bg-[#def2ee] group-hover:border-[#1e9680]/20 transition-colors">
                    <User className="w-[18px] h-[18px] text-[#9ca3af] group-hover:text-[#1e9680] transition-colors" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-[#414651] text-sm font-medium block">No contact details</span>
                    <span className="text-[#94a3b8] text-[12px]">Tap to fill in</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#1e9680] shrink-0">
                    <span className="text-[13px] font-medium">Fill in</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>
              </div>
            </>
          )}

          {/* Contact Info Side Drawer */}
          <AnimatePresence>
            {contactDrawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[80]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setContactDrawerOpen(false)}
                />
                {/* Drawer */}
                <motion.div
                  className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.12)] z-[81] flex flex-col"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                >
                  {/* Drawer Header */}
                  <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-[rgba(30,150,128,0.08)] flex items-center justify-center shrink-0">
                        <User className="w-[18px] h-[18px] text-[#1e9680]" />
                      </div>
                      <h3 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px]">
                        Contact Information
                      </h3>
                    </div>
                    <IconButton
                      onClick={() => setContactDrawerOpen(false)}
                      aria-label="Close contact information"
                    >
                      <X className="w-4 h-4" />
                    </IconButton>
                  </div>

                  {/* Drawer Body */}
                  <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormTextField
                        label="First Name"
                        required
                        placeholder="John"
                        value={firstName}
                        onChange={setFirstName}
                      />
                      <FormTextField
                        label="Last Name"
                        required
                        placeholder="Doe"
                        value={lastName}
                        onChange={setLastName}
                      />
                    </div>

                    <FormTextField
                      label="Email Address"
                      required
                      type="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={setEmail}
                    />

                    <FormTextField
                      label="Phone Number"
                      required
                      type="tel"
                      placeholder="+63 912 345 6789"
                      value={phone}
                      onChange={setPhone}
                    />
                  </div>

                  {/* Drawer Footer */}
                  <div className="px-5 sm:px-6 py-4 border-t border-neutral-100 shrink-0">
                    <PrimaryButton onClick={() => setContactDrawerOpen(false)} fullWidth className="py-3">
                      Save Contact Info
                    </PrimaryButton>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {!showPreCheckoutForms && (
            <>
              {/* Payment Method */}
              <div className="bg-white rounded-[18px] border border-neutral-100 overflow-hidden">
            <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-neutral-100">
              <h3 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px]">
                Payment Method
              </h3>
            </div>

            <div className="px-5 sm:px-6 py-5 sm:py-6">
              {selectedPayment ? (() => {
                const opt = PAYMENT_OPTIONS.find((o) => o.id === selectedPayment);
                if (!opt) return null;
                const isDefault = defaultPayment === selectedPayment;
                return (
                  <button
                    onClick={() => setPaymentDrawerOpen(true)}
                    className="w-full flex items-center gap-3 rounded-[12px] border-[1.5px] border-[#1e9680] bg-[#f0fdfa] px-3.5 py-3 transition-all hover:opacity-90 group"
                  >
                    {/* Uniform logo container — normalizes square & wide logos */}
                    <div className="w-10 h-10 rounded-[8px] border border-[#e5e7eb]/60 flex items-center justify-center shrink-0 overflow-hidden">
                      {opt.logoType === 'square' ? (
                        <div className="relative w-8 h-8 rounded-[4px] overflow-hidden">
                          <img src={opt.logo} alt="" className={`${opt.imgClass} pointer-events-none`} />
                        </div>
                      ) : (
                        <img src={opt.logo} alt="" className="max-w-[30px] max-h-[18px] object-contain pointer-events-none" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0 flex items-center gap-2">
                      <span className="text-[#15695a] text-sm font-semibold tracking-[-0.15px] truncate">{opt.name}</span>
                      {isDefault && (
                        <span className="px-1.5 py-[1px] bg-[#def2ee] text-[#177564] text-[9px] font-bold uppercase tracking-[0.4px] rounded shrink-0">Default</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[#1e9680] group-hover:text-[#15695a] transition-colors shrink-0">
                      <span className="text-[13px] font-medium">Change</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })() : (
                <button
                  onClick={() => setPaymentDrawerOpen(true)}
                  className="w-full flex items-center gap-3 rounded-[12px] border-[1.5px] border-dashed border-[#d5d7da] bg-[#fafafa] px-3.5 py-3.5 transition-all hover:border-[#1e9680] hover:bg-[#f0fdfa] group"
                >
                  <div className="w-10 h-10 rounded-[8px] bg-[#f3f4f6] border border-[#e5e7eb]/60 flex items-center justify-center shrink-0 group-hover:bg-[#def2ee] group-hover:border-[#1e9680]/20 transition-colors">
                    <Wallet className="w-[18px] h-[18px] text-[#9ca3af] group-hover:text-[#1e9680] transition-colors" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-[#414651] text-sm font-medium block">No payment method</span>
                    <span className="text-[#94a3b8] text-[12px]">Tap to select</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#1e9680] shrink-0">
                    <span className="text-[13px] font-medium">Select</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>
              </div>

              {/* Payment Method Side Drawer */}
              <AnimatePresence>
            {paymentDrawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[80]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setPaymentDrawerOpen(false)}
                />
                {/* Drawer */}
                <motion.div
                  className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.12)] z-[81] flex flex-col"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                >
                  {/* Drawer Header */}
                  <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-[rgba(30,150,128,0.08)] flex items-center justify-center shrink-0">
                        <CreditCard className="w-[18px] h-[18px] text-[#1e9680]" />
                      </div>
                      <h3 className="text-[#0a0a0a] text-[17px] font-medium tracking-[-0.44px]">
                        Select Payment Method
                      </h3>
                    </div>
                    <IconButton
                      onClick={() => setPaymentDrawerOpen(false)}
                      aria-label="Close payment method"
                    >
                      <X className="w-4 h-4" />
                    </IconButton>
                  </div>

                  {/* Drawer Body */}
                  <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 flex flex-col gap-6">
                    {/* Last Used Suggestion */}
                    {lastUsedPayment && lastUsedPayment !== selectedPayment && (() => {
                      const lastOpt = PAYMENT_OPTIONS.find((o) => o.id === lastUsedPayment);
                      if (!lastOpt) return null;
                      return (
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                            <span className="text-[#6a7282] text-[13px] font-medium">Last used</span>
                          </div>
                          <button
                            onClick={() => selectPaymentMethod(lastOpt.id)}
                            className="w-full flex items-center gap-3.5 rounded-[12px] border-[1.5px] border-[#e5e7eb] bg-gradient-to-r from-[#fafffe] to-[#f0fdfa] px-4 py-3.5 transition-all hover:border-[#1e9680] hover:shadow-[0_0_0_3px_rgba(30,150,128,0.06)] group"
                          >
                            <div className={lastOpt.containerClass}>
                              <img src={lastOpt.logo} alt="" className={`${lastOpt.imgClass} pointer-events-none`} />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <span className="text-[#101828] text-sm font-semibold tracking-[-0.15px] block">{lastOpt.name}</span>
                              <span className="text-[#94a3b8] text-[11px]">Use again</span>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0fdfa] border border-[#def2ee] shrink-0">
                              <Clock className="w-3 h-3 text-[#1e9680]" />
                              <span className="text-[#177564] text-[10px] font-bold uppercase tracking-[0.3px]">Recent</span>
                            </div>
                          </button>
                          <div className="h-px bg-[#e5e7eb]" />
                        </div>
                      );
                    })()}

                    {/* Pay Now Section */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#DEF2EE] border-[1.5px] border-[#1E9680] flex items-center justify-center shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#1E9680]" />
                        </div>
                        <span className="text-[#101828] text-[15px] font-semibold tracking-[-0.2px]">
                          Pay Now
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {PAYMENT_OPTIONS.map((opt) => {
                          const isSelected = selectedPayment === opt.id;
                          const isDefault = defaultPayment === opt.id;
                          const isLastUsed = lastUsedPayment === opt.id && !isSelected;
                          return (
                            <div key={opt.id} className="flex flex-col gap-0">
                              <button
                                onClick={() => selectPaymentMethod(opt.id)}
                                className={`w-full flex items-center gap-3.5 rounded-[12px] border-[1.5px] transition-all px-4 py-3.5 ${
                                  isSelected
                                    ? 'border-[#1e9680] bg-[#f0fdfa] shadow-[0_0_0_3px_rgba(30,150,128,0.08)]'
                                    : 'border-[#e5e7eb] bg-white hover:border-[#cbd5e1] hover:bg-[#fafafa]'
                                }`}
                              >
                                <div className="flex-1 flex items-center gap-3 min-w-0">
                                  <div className={opt.containerClass}>
                                    <img
                                      src={opt.logo}
                                      alt=""
                                      className={`${opt.imgClass} pointer-events-none`}
                                    />
                                  </div>
                                  <div className="flex flex-col items-start gap-0.5 min-w-0">
                                    <span
                                      className={`text-sm font-semibold tracking-[-0.15px] ${
                                        isSelected ? 'text-[#15695a]' : 'text-[#6a7282]'
                                      }`}
                                    >
                                      {opt.name}
                                    </span>
                                    {isDefault && (
                                      <span className="text-[#1e9680] text-[10px] font-bold uppercase tracking-[0.3px]">Default</span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {isLastUsed && (
                                    <span className="text-[#94a3b8] text-[10px] font-medium">Last used</span>
                                  )}
                                  {isSelected ? (
                                    <div className="w-5 h-5 rounded-full bg-[#1e9680] flex items-center justify-center">
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-[1.5px] border-[#d5d7da] bg-white" />
                                  )}
                                </div>
                              </button>

                              {/* Set as default toggle — shown when this method is selected */}
                              {isSelected && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleDefault(opt.id); }}
                                  className="flex items-center gap-2 px-4 pt-2.5 pb-1 group/def"
                                >
                                  <div className={`w-[34px] h-[20px] rounded-full transition-colors relative ${isDefault ? 'bg-[#1e9680]' : 'bg-[#d5d7da]'}`}>
                                    <div className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-transform ${isDefault ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
                                  </div>
                                  <span className={`text-[12px] font-medium transition-colors ${isDefault ? 'text-[#15695a]' : 'text-[#6a7282] group-hover/def:text-[#101828]'}`}>
                                    {isDefault ? 'Default payment method' : 'Set as default'}
                                  </span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#e5e7eb]" />

                    {/* Payment Plan (Coming Soon) */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full border-[1.5px] border-[#d5d7da] bg-white shrink-0" />
                        <span className="text-[#6a7282] text-[15px] font-semibold tracking-[-0.2px]">
                          Payment Plan
                        </span>
                        <span className="px-2 py-0.5 bg-[#f3f4f6] border border-[#e5e7eb] text-[#6a7282] text-[10px] font-bold uppercase tracking-[0.6px] rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <div className="rounded-[10px] border border-dashed border-[#e5e7eb] bg-[#fafafa] px-4 py-3.5">
                        <p className="text-[#94a3b8] text-[13px] leading-relaxed">
                          Split your payment into installments. This feature will be available soon for eligible events.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
              </AnimatePresence>
            </>
          )}

        </div>

        {/* Right Column: Order Summary (Desktop — sticky sidebar) */}
        {!showPreCheckoutForms && (
          <div className="hidden lg:block lg:sticky lg:top-[96px]">
            <div className="bg-white rounded-[18px] border border-neutral-100 overflow-hidden">
              {renderOrderSummaryContent(true)}
            </div>
          </div>
        )}
      </div>

      {/* --- Sticky Mobile CTA Bar --- */}
      {!showPreCheckoutForms && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-neutral-100 lg:hidden z-50 fixed-bottom-ios">
        <div className="max-w-[960px] mx-auto px-4 py-3 flex flex-col gap-2">

          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[#94a3b8] text-[13px] font-medium">Total</span>
            <span className="text-[#181d27] text-[22px] font-semibold tracking-tight tabular-nums">
              {fmt(total)}
            </span>
          </div>
          <PrimaryButton onClick={handlePurchase} fullWidth className="py-3.5 text-[17px] font-semibold">
            Proceed to payment
          </PrimaryButton>
        </div>
        </div>
      )}
    </div>
  );
}
