/**
 * @file NotificationsPage.tsx
 * @description Notification center showing event updates, ticket reminders,
 * promotional messages, and review prompts for completed events.
 *
 * Mobile: swipe left to reveal a red delete action behind each card.
 * Desktop: trash icon appears on hover.
 *
 * Currently uses mock notification data. When Supabase is connected, replace
 * `MOCK_NOTIFICATIONS` with a real-time subscription query.
 */

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Megaphone,
  Trash2,
  Star,
  Award,
  ChevronRight,
  UserPlus,
  Mail,
  PartyPopper,
  ClipboardList,
} from 'lucide-react';
import { ConfirmDialog } from '@/app/components/ConfirmDialog';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { SegmentedChoice } from '@/app/components/SegmentedChoice';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NotificationType = 'reminder' | 'confirmation' | 'update' | 'promo' | 'review' | 'invite' | 'form_update';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  cta?: string;
  href?: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'form-update-aqua',
    type: 'form_update',
    title: 'Registration form updated — action required',
    message:
      'The organiser of Bay Aquathlon Challenge has updated the registration form. Review the changes and resubmit to keep your registration valid.',
    time: '20 min ago',
    read: false,
    cta: 'Review changes',
    href: '/forms/resubmit-aquathlon/diff',
  },
  {
    id: 'inv-1',
    type: 'invite',
    title: 'Organizer Invitation',
    message:
      'International Athletics Org has invited you to co-organize the Canlaon Marathon 2025. Check your inbox for details.',
    time: '30 min ago',
    read: false,
  },
  {
    id: 'rev-1',
    type: 'review',
    title: 'Leave a Review',
    message:
      "You've completed Mt. Pulag Trail Run 2025! Leave a quick review to unlock your certificate.",
    time: '1 hour ago',
    read: false,
  },
  {
    id: '1',
    type: 'reminder',
    title: 'Event Tomorrow',
    message:
      "City Half Marathon 2025 starts at 5:00 AM. Don't forget your race bib!",
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'confirmation',
    title: 'Registration Confirmed',
    message:
      'Your registration for Grand Slam Tennis Open has been confirmed. Ticket #TEN-7721.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'rev-2',
    type: 'review',
    title: 'Certificate Ready',
    message:
      'Thanks for reviewing Ronda Pilipinas Cycling Stage 3! Your certificate is now ready to download.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '3',
    type: 'update',
    title: 'Action Required',
    message:
      'Please complete the participant form for National Basketball League Finals before July 5.',
    time: '2 days ago',
    read: false,
  },
  {
    id: 'inv-2',
    type: 'invite',
    title: 'Pace Leader Invitation',
    message:
      'Manila Running Club wants you to lead the 5:00 min/km pace group for the Manila Bay Fun Run. View the full invite in your inbox.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '4',
    type: 'promo',
    title: 'Early Bird Discount',
    message:
      'Register for Ironman 70.3 Triathlon before Nov 15 and save 20% with code EARLY20.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'confirmation',
    title: 'Payment Successful',
    message:
      'Payment of PHP 1,500 for CrossFit Games Qualifiers was processed via GCash.',
    time: '5 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Event This Weekend',
    message:
      'Beach Volleyball Open is this Saturday at 9:00 AM. Check the event page for parking info.',
    time: '1 week ago',
    read: true,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map notification type to its icon. */
function getNotificationMeta(type: NotificationType) {
  switch (type) {
    case 'reminder':
      return { icon: <Clock className="w-[18px] h-[18px]" strokeWidth={1.8} /> };
    case 'confirmation':
      return { icon: <CheckCircle2 className="w-[18px] h-[18px]" strokeWidth={1.8} /> };
    case 'update':
      return { icon: <AlertCircle className="w-[18px] h-[18px]" strokeWidth={1.8} /> };
    case 'promo':
      return { icon: <Megaphone className="w-[18px] h-[18px]" strokeWidth={1.8} /> };
    case 'review':
      return { icon: <Star className="w-[18px] h-[18px]" strokeWidth={1.8} /> };
    case 'invite':
      return { icon: <UserPlus className="w-[18px] h-[18px]" strokeWidth={1.8} /> };

    case 'form_update':
      return { icon: <ClipboardList className="w-[18px] h-[18px]" strokeWidth={1.8} /> };
  }
}

// ---------------------------------------------------------------------------
// Swipeable Notification Item
// ---------------------------------------------------------------------------

const SWIPE_THRESHOLD = 72; // px to fully reveal action
const DELETE_THRESHOLD = 160; // px to auto-delete on release

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

function NotificationItem({
  notification: n,
  onMarkAsRead,
  onDismiss,
  onAction,
}: NotificationItemProps) {
  const meta = getNotificationMeta(n.type);

  // -- Swipe state --
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isTracking = useRef(false);
  const directionLocked = useRef<'horizontal' | 'vertical' | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isTracking.current = true;
    directionLocked.current = null;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isTracking.current) return;

    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Lock direction after 8px movement
    if (directionLocked.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      directionLocked.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
    }

    // If vertical scroll, abort swipe
    if (directionLocked.current === 'vertical') {
      isTracking.current = false;
      setSwiping(false);
      setOffsetX(0);
      return;
    }

    if (directionLocked.current === 'horizontal') {
      // Prevent page scroll during horizontal swipe
      e.preventDefault();
      // Only allow swipe left (negative), with rubber-band resistance for right
      const clampedDx = dx > 0 ? dx * 0.2 : Math.max(dx, -DELETE_THRESHOLD - 30);
      setOffsetX(clampedDx);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isTracking.current = false;
    setSwiping(false);

    if (offsetX < -DELETE_THRESHOLD) {
      // Fast swipe — animate out and delete
      setDismissed(true);
      setTimeout(() => onDismiss(n.id), 300);
    } else if (offsetX < -SWIPE_THRESHOLD / 2) {
      // Snap to reveal position
      setOffsetX(-SWIPE_THRESHOLD);
    } else {
      // Snap back
      setOffsetX(0);
    }
  }, [offsetX, n.id, onDismiss]);

  const handleDeleteClick = useCallback(() => {
    setDismissed(true);
    setTimeout(() => onDismiss(n.id), 300);
  }, [n.id, onDismiss]);

  const handleCardClick = useCallback(() => {
    // If swiped open, close it instead of marking as read
    if (offsetX !== 0) {
      setOffsetX(0);
      return;
    }
    onMarkAsRead(n.id);
    // Actionable notifications navigate to their target
    if ((n.type === 'review' || n.type === 'invite' || n.type === 'form_update') && onAction) {
      onAction(n);
    }
  }, [offsetX, n, onMarkAsRead, onAction]);

  return (
    <div
      className={`relative overflow-hidden rounded-[18px] transition-all ${
        dismissed ? 'max-h-0 opacity-0 mb-0' : 'max-h-[240px] opacity-100 mb-2'
      }`}
      style={{
        transitionDuration: dismissed ? '300ms' : '0ms',
        transitionProperty: 'max-height, opacity, margin',
      }}
    >
      {/* ---- Delete action behind the card (mobile) ---- */}
      <div
        className="absolute inset-y-0 right-0 flex w-[80px] items-center justify-center rounded-r-[18px] bg-[#ef4444] transition-opacity sm:hidden"
        style={{
          opacity: offsetX < -4 ? 1 : 0,
          pointerEvents: offsetX < -4 ? 'auto' : 'none',
        }}
      >
        <button
          onClick={handleDeleteClick}
          className="w-full h-full flex items-center justify-center"
          aria-label="Delete notification"
        >
          <Trash2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* ---- Swipeable card surface ---- */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
        className="relative z-10 w-full text-left flex items-start gap-3 p-4 rounded-[18px] border border-neutral-100 bg-white group cursor-pointer"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? 'none' : 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)',
          willChange: 'transform',
        }}
      >
        {/* Icon Container (Apple-like styled badge) */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors group-hover:bg-slate-100 group-hover:text-slate-700">
          {meta.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-[14px] truncate ${n.read ? 'font-medium text-[#94a3b8]' : 'font-semibold text-[#181d27]'}`}>
              {n.title}
            </p>
            {!n.read && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#177564] shrink-0" />
            )}
          </div>
          <p className="text-[#94a3b8] text-[12px] mt-0.5 line-clamp-2">
            {n.message}
          </p>
          {/* Review CTA */}
          {n.type === 'review' && !n.read && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#def2ee] px-2.5 py-1 text-[11px] font-semibold text-[#177564]">
              <Star className="w-3 h-3 fill-[#177564]" />
              Write Review
            </span>
          )}
          {n.type === 'review' && n.read && n.title === 'Certificate Ready' && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#def2ee] px-2.5 py-1 text-[11px] font-semibold text-[#177564]">
              <Award className="w-3 h-3" />
              Certificate Available
            </span>
          )}
          {/* Invite CTA */}
          {n.type === 'invite' && !n.read && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-1 text-[11px] font-semibold text-[#3b82f6]">
              <Mail className="w-3 h-3" />
              View in Inbox
            </span>
          )}
          {n.type === 'invite' && n.read && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-1 text-[11px] font-semibold text-[#3b82f6]">
              <UserPlus className="w-3 h-3" />
              Invitation
            </span>
          )}
          {/* Generic CTA */}
          {n.cta && !n.read && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#def2ee] px-2.5 py-1 text-[11px] font-semibold text-[#177564]">
              {n.cta}
            </span>
          )}
          <p className="text-[#cbd5e1] text-[11px] mt-1.5">{n.time}</p>
        </div>

        {/* Desktop hover trash */}
        <ConfirmDialog
          trigger={
            <button
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex w-7 h-7 items-center justify-center rounded-[6px] text-[#cbd5e1] hover:text-[#ef4444] hover:bg-[#fef2f2] opacity-0 group-hover:opacity-100 transition-all shrink-0 self-center"
              aria-label="Delete notification"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          }
          icon={<Trash2 className="w-6 h-6" />}
          iconVariant="destructive"
          title="Delete Notification?"
          description={
            <>
              Are you sure you want to delete the <strong>{n.title}</strong> notification? This action cannot be undone.
            </>
          }
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          variant="destructive"
          onConfirm={handleDeleteClick}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NotificationsPageProps {
  /** Navigate back to the previous page. */
  onBack: () => void;
  /** Navigate to the completed tickets tab (for review notifications). */
  onGoToCompletedTickets?: () => void;
  /** Navigate to the inbox page (for invite notifications). */
  onGoToInbox?: () => void;
  /** Flag to indicate if rendered inside a drawer (preserves back button). */
  isDrawer?: boolean;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function NotificationsPage({
  onBack,
  onGoToCompletedTickets,
  onGoToInbox,
  isDrawer = false,
}: NotificationsPageProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => !n.read);

  /** Mark a single notification as read. */
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  /** Mark every notification as read. */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  /** Remove a notification from the list. */
  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDrawer && (
            <button
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-100 bg-white text-[#64748b] hover:bg-slate-50 active:scale-[0.97] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h1 className="text-[28px] font-semibold text-[#181d27] leading-none tracking-[-0.6px]">
            Notifications
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[#177564] text-[13px] font-semibold"
          >
            Mark all read
          </button>
        )}
      </div>

      <SegmentedChoice
        size="sm"
        value={filter}
        onChange={setFilter}
        columnsClass="grid-cols-2 max-w-[240px]"
        options={[
          { value: 'all', label: 'All' },
          { value: 'unread', label: 'Unread', badge: unreadCount > 0 ? unreadCount : undefined },
        ]}
      />

      {/* Notification list */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center py-14 text-center">
          <EmptyStateGraphic kind="no-notifications" className="h-32 w-32" />
          <p className="mt-2 text-[15px] font-semibold text-[#181d27]">
            {filter === 'unread'
              ? 'No unread notifications'
              : 'No notifications yet'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {displayed.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={markAsRead}
              onDismiss={dismiss}
              onAction={() => {
                if (n.href) {
                  navigate(n.href);
                } else if (n.type === 'review') {
                  onGoToCompletedTickets?.();
                } else if (n.type === 'invite') {
                  onGoToInbox?.();
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
