/**
 * @file CartPage.tsx
 * @description Shopping cart page with event-grouped items, quantity stepper,
 * item selection checkboxes, voucher code entry (SAVE100, SPORT50, RUN200),
 * and an order summary sidebar.
 *
 * Cart state is shared through AppContext so event ticket selections survive
 * navigation and the header badge stays aligned with the rendered cart.
 *
 * Mobile layout includes a glassmorphism sticky bottom action bar.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  LogIn,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { PrimaryButton } from './PrimaryButton';
import { ConfirmDialog } from './ConfirmDialog';
import {
  useAppContext,
  type CartItem,
  type CheckoutIntentItem,
} from '@/app/context/AppContext';
import { useNavigate } from 'react-router';
import { toast } from "sonner";

const VOUCHER_MAP: Record<string, number> = {
  SAVE100: 100,
  SPORT50: 50,
  RUN200: 200,
};

const CONVENIENCE_FEE_RATE = 0.03; // 3%
const ENABLE_CART_RESERVATION_HOLDS = false;

// --- Countdown Hook ---
function useCountdown(target?: Date) {
  const calc = useCallback(() => {
    if (!target) return null;
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [target]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(interval);
  }, [target, calc]);

  return time;
}

// --- Holding Countdown (seconds only when < 60s) ---
function useHoldingCountdown(target?: Date) {
  const calc = useCallback(() => {
    if (!target) return null;
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / 1000);
  }, [target]);

  const [secs, setSecs] = useState<number | null>(calc);

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => setSecs(calc()), 500);
    return () => clearInterval(interval);
  }, [target, calc]);

  return secs;
}

// --- Holding Badge ---
function HoldingBadge({ target }: { target?: Date }) {
  const secs = useHoldingCountdown(target);
  if (secs === null) return null;

  const urgent = secs !== null && secs <= 30;
  const fmt = (s: number) => {
    if (s >= 3600) {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      return `${h}h ${m}m`;
    }
    if (s >= 60) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}m ${String(sec).padStart(2, '0')}s`;
    }
    return `${s}s`;
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums transition-colors ${
        urgent
          ? 'bg-red-50 border border-red-200 text-red-600'
          : 'bg-amber-50 border border-amber-200 text-amber-600'
      }`}
    >
      <Clock className="w-3 h-3" />
      {secs > 0 ? fmt(secs) : 'Hold expired'}
    </span>
  );
}

// --- Countdown Badge ---
function CountdownBadge({ target }: { target?: Date }) {
  const time = useCountdown(target);
  if (!time) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-semibold tabular-nums">
      <Clock className="w-3 h-3" />
      {time}
    </span>
  );
}

// --- Hold Expired Modal ---
interface ExpiredItem {
  eventId: string;
  item: CartItem;
  eventName: string;
}

function HoldExpiredModal({
  expired,
  onClose,
  onAddBack,
  isReAdding,
}: {
  expired: ExpiredItem | null;
  onClose: () => void;
  onAddBack: (item: ExpiredItem) => void;
  isReAdding: boolean;
}) {
  return (
    <AnimatePresence>
      {expired && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
            onClick={!isReAdding ? onClose : undefined}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-[61] flex items-center justify-center px-5 pointer-events-none"
          >
            <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[340px] overflow-hidden pointer-events-auto">
              
              <div className="px-6 pt-6 pb-7 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h2 className="text-[#181d27] text-[18px] font-bold tracking-tight mb-2">
                  Reservation Expired
                </h2>
                <p className="text-[#64748b] text-[13px] leading-snug mb-6">
                  The hold for <span className="font-semibold text-[#181d27]">"{expired.item.name}"</span> in <span className="font-semibold text-[#181d27]">{expired.eventName}</span> has expired. It's been removed from your cart, but you can try adding it again if still available.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <PrimaryButton 
                    onClick={() => onAddBack(expired)} 
                    fullWidth
                    loading={isReAdding}
                  >
                    Try Adding Again
                  </PrimaryButton>
                  <button 
                    onClick={onClose}
                    disabled={isReAdding}
                    className="py-2.5 text-[14px] font-semibold text-[#64748b] hover:text-[#181d27] transition-colors disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Component ---
interface CartPageProps {
  onClose: () => void;
  onCheckout?: (items: CheckoutIntentItem[], totalAmount: number) => void;
  /** When true, suppresses the built-in slide animation (used inside DrawerPanel). */
  isDrawer?: boolean;
}

export function CartPage({ onClose, onCheckout, isDrawer }: CartPageProps) {
  const { isAuthenticated, setReturnTo, cart, setCart } = useAppContext();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    () => new Set(cart.flatMap((e) => e.items.map((i) => i.id)))
  );
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherExpanded, setVoucherExpanded] = useState(false);
  const [expiredItem, setExpiredItem] = useState<ExpiredItem | null>(null);
  const firedRef = useRef<Set<string>>(new Set());

  const [isReAdding, setIsReAdding] = useState(false);

  const addItem = useCallback((eventId: string, item: CartItem, simulateFailure = false) => {
    if (simulateFailure) {
      toast.error('Item No Longer Available', {
        description: `We're sorry, but "${item.name}" has just sold out and is no longer available.`,
        duration: 4000,
      });
      return false;
    }
    setCart((prev) => {
      // Find event
      const eventIdx = prev.findIndex((e) => e.id === eventId);
      if (eventIdx > -1) {
        return prev.map((evt) =>
          evt.id !== eventId
            ? evt
            : {
                ...evt,
                items: [
                  ...evt.items,
                  {
                    ...item,
                    holdingEnd: ENABLE_CART_RESERVATION_HOLDS
                      ? new Date(Date.now() + 5 * 60 * 1000)
                      : undefined,
                  },
                ],
              }
        );
      }
      return prev; // For now just adding back to existing event group
    });
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
    firedRef.current.delete(item.id);
    return true;
  }, []);

  const handleReAdd = (expired: ExpiredItem) => {
    setIsReAdding(true);
    // Simulate a check with the server
    setTimeout(() => {
      // 70% chance of failure for "no longer available" state as requested
      const shouldFail = Math.random() < 0.7; 
      
      const success = addItem(expired.eventId, expired.item, shouldFail);
      setIsReAdding(false);
      
      if (success) {
        setExpiredItem(null);
        toast.success(`"${expired.item.name}" added back to cart!`, {
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
        });
      }
      // If failed, we keep the modal or toast handles it. 
      // User said "give me a failure state that it is no longer available"
      // Let's close the modal if it fails so they can see the toast and the empty cart
      if (!success) {
        setExpiredItem(null);
      }
    }, 1500);
  };

  const removeItem = useCallback((eventId: string, itemId: string) => {
    setCart((prev) =>
      prev
        .map((evt) =>
          evt.id !== eventId
            ? evt
            : { ...evt, items: evt.items.filter((i) => i.id !== itemId) }
        )
        .filter((evt) => evt.items.length > 0)
    );
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  }, []);

  // Reservation expiry is disabled for now. Re-enable this flag to restore
  // automatic hold expiration, item removal, and the expired-reservation modal.
  useEffect(() => {
    if (!ENABLE_CART_RESERVATION_HOLDS) return;

    const interval = setInterval(() => {
      const now = Date.now();
      for (const evt of cart) {
        for (const item of evt.items) {
          if (
            item.holdingEnd &&
            item.holdingEnd.getTime() <= now &&
            !firedRef.current.has(item.id)
          ) {
            firedRef.current.add(item.id);
            const expired = { 
              eventId: evt.id,
              item: { ...item },
              eventName: evt.eventName 
            };
            removeItem(evt.id, item.id);
            setExpiredItem(expired);
          }
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [cart, removeItem]);

  // --- Derived ---
  const allItemIds = cart.flatMap((e) => e.items.map((i) => i.id));
  const totalItems = allItemIds.length;
  const allSelected = totalItems > 0 && allItemIds.every((id) => selectedItems.has(id));

  const selectedCartItems = cart.flatMap((e) =>
    e.items.filter((i) => selectedItems.has(i.id))
  );
  const selectedCheckoutItems: CheckoutIntentItem[] = cart.flatMap((event) =>
    event.items
      .filter((item) => selectedItems.has(item.id))
      .map((item) => ({
        ticketId: item.id,
        qty: item.quantity,
        category: item.name,
        price: item.price,
        eventName: event.eventName,
        image: item.image,
      }))
  );
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const convenienceFee = subtotal > 0 ? Math.round(subtotal * CONVENIENCE_FEE_RATE * 100) / 100 : 0;
  const discount = appliedVoucher ? Math.min(appliedVoucher.discount, subtotal) : 0;
  const totalAmount = Math.max(0, subtotal + convenienceFee - discount);

  // --- Handlers ---
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allItemIds));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateQuantity = (eventId: string, itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((evt) =>
        evt.id !== eventId
          ? evt
          : {
              ...evt,
              items: evt.items.map((item) =>
                item.id !== itemId
                  ? item
                  : { ...item, quantity: Math.max(1, item.quantity + delta) }
              ),
            }
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedItems(new Set());
    setAppliedVoucher(null);
  };

  const applyVoucher = () => {
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;
    const discountVal = VOUCHER_MAP[code];
    if (discountVal !== undefined) {
      setAppliedVoucher({ code, discount: discountVal });
      setVoucherCode('');
    } else {
      setVoucherError('Invalid voucher code');
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  // Format currency
  const fmt = (n: number) =>
    `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <motion.div
      initial={isDrawer ? {} : { x: '100%', opacity: 0 }}
      animate={isDrawer ? {} : { x: 0, opacity: 1 }}
      transition={isDrawer ? {} : { type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col gap-6 pb-6"
    >
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-semibold text-[#181d27] leading-none tracking-[-0.6px]">
          Your Cart
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cart"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-100 bg-white text-[#64748b]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ---- Guest Login Banner ---- */}
      {!isAuthenticated && cart.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-white border border-neutral-100 rounded-[14px]">
          <LogIn className="w-[18px] h-[18px] text-[#64748b] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[#64748b] text-[13px] font-medium leading-snug">
              You'll need to log in or sign up before checking out.
            </p>
            <button
              onClick={() => {
                setReturnTo('/cart');
                navigate('/login');
              }}
              className="text-[#177564] text-[13px] font-semibold mt-1"
            >
              Log in or Sign up
            </button>
          </div>
        </div>
      )}

      {/* ---- Select All / Clear Cart ---- */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={toggleSelectAll}
            aria-pressed={allSelected}
            className="flex min-h-11 items-center gap-2.5 group"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                allSelected
                  ? 'bg-[#177564] border-[#177564]'
                  : 'border-[#cbd5e1] group-hover:border-[#177564]'
              }`}
            >
              {allSelected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-[#181d27] font-medium">
              Select All Items
            </span>
          </button>
          <ConfirmDialog
            trigger={
              <button className="text-sm font-semibold text-[#94a3b8]">
                Clear Cart
              </button>
            }
            title="Clear Cart?"
            description="This will remove all items from your cart. This action cannot be undone."
            confirmLabel="Yes, Clear Cart"
            variant="destructive"
            onConfirm={clearCart}
          />
        </div>
      )}

      {/* ---- Event Groups ---- */}
      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[22px] border border-neutral-100">
          <EmptyStateGraphic kind="empty-cart" className="h-36 w-36 mb-1" />
          <p className="text-[#181d27] text-[16px] font-semibold">Your cart is empty</p>
          <p className="text-[#94a3b8] text-sm mt-1">
            Browse events and add tickets to get started
          </p>
          <PrimaryButton
            onClick={onClose}
            className="mt-6"
          >
            Browse Events
          </PrimaryButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-[22px] border border-neutral-100 overflow-hidden"
            >
              {/* Event Header */}
              <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 flex flex-col gap-2">
                <h3 className="text-[#181d27] text-[16px] sm:text-[17px] font-semibold leading-snug">
                  {evt.eventName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5 text-[#64748b]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#64748b]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">{evt.location}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-100 mx-4 sm:mx-5" />

              {/* Items */}
              <div className="flex flex-col">
                {evt.items.map((item, idx) => (
                  <div key={item.id}>
                    <div className="px-4 sm:px-5 py-4 flex gap-3 sm:gap-4">
                      {/* Selection Radio */}
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        aria-label={`${selectedItems.has(item.id) ? 'Deselect' : 'Select'} ${item.name}`}
                        aria-pressed={selectedItems.has(item.id)}
                        className="mt-[-4px] flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 focus-visible:ring-offset-2"
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selectedItems.has(item.id)
                              ? 'bg-[#177564] border-[#177564]'
                              : 'border-[#cbd5e1] hover:border-[#177564]'
                          }`}
                        >
                          {selectedItems.has(item.id) && (
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                              className="text-white"
                            >
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </button>

                      {/* Thumbnail */}
                      <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-[12px] overflow-hidden bg-neutral-100 shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details + Actions */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        {/* Top: Name + Price */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[#181d27] text-sm font-semibold leading-snug line-clamp-2">
                              {item.name}
                            </p>
                            {/* Tier & Wave */}
                            {(item.tier || item.wave) && (
                              <p className="text-[#177564] text-xs mt-0.5">
                                {[item.tier, item.wave]
                                  .filter(Boolean)
                                  .join(' \u2022 ')}
                              </p>
                            )}
                            {/* Priority Timer: Hold Reservation > Registration Deadline */}
                            {((ENABLE_CART_RESERVATION_HOLDS && item.holdingEnd) || item.countdownEnd) && (
                              <div className="mt-1.5">
                                {ENABLE_CART_RESERVATION_HOLDS && item.holdingEnd ? (
                                  <HoldingBadge target={item.holdingEnd} />
                                ) : (
                                  <CountdownBadge target={item.countdownEnd} />
                                )}
                              </div>
                            )}
                          </div>
                          <span className="text-[#181d27] text-sm font-bold whitespace-nowrap">
                            {fmt(item.price)}
                          </span>
                        </div>

                        {/* Bottom: Remove + Quantity */}
                        <div className="flex items-center justify-between mt-auto">
                          <ConfirmDialog
                            trigger={
                              <button
                                className="text-[#177564] text-xs font-medium hover:text-[#136354] transition-colors"
                              >
                                Remove
                              </button>
                            }
                            icon={<Trash2 className="w-6 h-6" />}
                            iconVariant="destructive"
                            title="Remove Item?"
                            description={
                              <>
                                Are you sure you want to remove <strong>{item.name}</strong> from your cart?
                              </>
                            }
                            confirmLabel="Yes, Remove"
                            cancelLabel="Cancel"
                            variant="destructive"
                            onConfirm={() => removeItem(evt.id, item.id)}
                          />
                          <div className="flex items-center gap-1 rounded-[10px] border border-neutral-100 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(evt.id, item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[7px] text-[#177564] disabled:text-[#cbd5e1] disabled:cursor-not-allowed active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="min-w-[18px] select-none text-center text-[13px] font-semibold leading-none tabular-nums text-[#181d27]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(evt.id, item.id, 1)}
                              aria-label={`Increase ${item.name} quantity`}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[7px] text-[#177564] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Item Separator (not after last item) */}
                    {idx < evt.items.length - 1 && (
                      <div className="h-px bg-neutral-100 mx-4 sm:mx-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Voucher Section ---- */}
      {cart.length > 0 && (
        <div className="flex flex-col gap-3">
          {appliedVoucher ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-neutral-100 rounded-[14px]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#177564] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#177564] text-xs font-bold uppercase tracking-wide">
                    {appliedVoucher.code} APPLIED
                  </span>
                  <span className="text-[#177564] text-[11px]">
                    {fmt(appliedVoucher.discount)} off
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeVoucher}
                aria-label="Remove applied voucher"
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#64748b] hover:text-[#181d27] hover:bg-[#def2ee] transition-colors"
              >
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
                  onChange={(e) => {
                    setVoucherCode(e.target.value);
                    setVoucherError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && applyVoucher()}
                  className="flex-1 bg-white border border-[#d5d7da] rounded-[8px] px-3.5 py-2.5 text-sm text-[#181d27] placeholder:text-[rgba(24,29,39,0.5)] focus:outline-none focus:ring-2 focus:ring-[#177564]/20 focus:border-[#177564] transition-all shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
                  autoFocus
                />
                <PrimaryButton onClick={applyVoucher} compact className="shrink-0">Apply</PrimaryButton>
              </div>
              {voucherError && <p className="text-red-500 text-xs font-medium">{voucherError}</p>}
            </div>
          )}
        </div>
      )}

      {/* ---- Order Summary ---- */}
      {cart.length > 0 && (
        <div className="flex flex-col gap-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-[#475569] text-sm">
              Subtotal ({selectedCartItems.reduce((s, i) => s + i.quantity, 0)}{' '}
              {selectedCartItems.reduce((s, i) => s + i.quantity, 0) === 1
                ? 'item'
                : 'items'}
              )
            </span>
            <span className="text-[#181d27] text-sm font-medium tabular-nums">
              {fmt(subtotal)}
            </span>
          </div>

          {/* Convenience Fee */}
          <div className="flex items-center justify-between">
            <span className="text-[#475569] text-sm">Convenience Fee</span>
            <span className="text-[#181d27] text-sm font-medium tabular-nums">
              {fmt(convenienceFee)}
            </span>
          </div>

          {/* Discount */}
          {appliedVoucher && discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#177564] text-sm">Voucher Discount</span>
              <span className="text-[#177564] text-sm font-medium tabular-nums">
                -{fmt(discount)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-neutral-100 hidden lg:block" />

          {/* Total — hidden on mobile; sticky bar handles it there */}
          <div className="hidden lg:flex items-center justify-between">
            <span className="text-[#177564] text-sm font-medium">
              Total Amount
            </span>
            <span className="text-[#181d27] text-[22px] font-bold tracking-tight tabular-nums">
              {fmt(totalAmount)}
            </span>
          </div>
        </div>
      )}

      {/* ---- Checkout Button (Desktop in-flow) ---- */}
      {cart.length > 0 && (
        <div className="hidden lg:block">
          <PrimaryButton
            onClick={() => onCheckout?.(selectedCheckoutItems, totalAmount)}
            disabled={selectedCheckoutItems.length === 0}
            fullWidth
            className="py-3.5"
          >
            Proceed to Checkout
          </PrimaryButton>
        </div>
      )}

      {/* ---- Sticky Mobile Checkout Bar ---- */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-neutral-100 lg:hidden z-50 fixed-bottom-ios">
          <div className="max-w-[960px] mx-auto flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[#94a3b8] text-[13px] font-medium">Total</span>
              <span className="text-[#181d27] text-[22px] font-semibold tracking-tight tabular-nums">
                {fmt(totalAmount)}
              </span>
            </div>
            <PrimaryButton
              onClick={() => onCheckout?.(selectedCheckoutItems, totalAmount)}
              disabled={selectedCheckoutItems.length === 0}
              fullWidth
              className="py-3.5 text-[17px] font-semibold"
            >
              Proceed to Checkout
            </PrimaryButton>
          </div>
        </div>
      )}
      
      <HoldExpiredModal 
        expired={expiredItem} 
        onClose={() => setExpiredItem(null)} 
        onAddBack={handleReAdd}
        isReAdding={isReAdding}
      />
    </motion.div>
  );
}
