/**
 * @file InboxPage.tsx
 * @description Email-style inbox with:
 *  - Compact message list rows (sender, subject, preview, timestamp)
 *  - Tap a row → full message detail view with rich content
 *  - Inbox / Archived view toggle
 *  - Search + category filter pills
 *  - Mobile swipe-left-to-archive
 *  - Desktop hover archive action
 *  - Animated transitions between list ↔ detail
 */

import React, { useState, useMemo, useRef, useCallback, forwardRef } from 'react';
import {
  ArrowLeft,
  Inbox,
  Archive,
  Search,
  Mail,
  Tag,
  Bell,
  Check,
  X,
  ArrowRight,
  Clock,
  MailOpen,
  Copy,
  CheckCheck,
  ChevronRight,
  Trash2,
  MoreHorizontal,
  Paperclip,
  Calendar,
  MapPin,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { SegmentedChoice } from '@/app/components/SegmentedChoice';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MessageCategory = 'invite' | 'promotion' | 'update';

interface InboxMessage {
  id: string;
  category: MessageCategory;
  sender: string;
  senderEmail: string;
  senderInitials: string;
  senderAvatar?: string;
  timestamp: string;
  dateGroup: 'today' | 'yesterday' | 'earlier';
  title: string;
  preview: string;
  body: string;
  unread: boolean;
  hasAttachment?: boolean;
  // invite-specific
  orgName?: string;
  role?: string;
  quote?: string;
  // promotion-specific
  promoImage?: string;
  promoDescription?: string;
  promoCode?: string;
  // update-specific
  updateEvent?: string;
  updateDetail?: string;
  updateLocation?: string;
  updateDate?: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_MESSAGES: InboxMessage[] = [
  {
    id: 'msg-1',
    category: 'invite',
    sender: 'International Athletics Org',
    senderEmail: 'events@intl-athletics.org',
    senderInitials: 'IA',
    senderAvatar:
      'https://images.unsplash.com/photo-1714962962355-1035a90cb7d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMGV2ZW50JTIwb3JnYW5pemVyJTIwZ3JvdXB8ZW58MXx8fHwxNzcwODg4MDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    timestamp: 'Today at 9:41 AM',
    dateGroup: 'today',
    title: 'Invitation to Co-Organize Canlaon Marathon',
    preview: 'Hi there! We\'d love to have you on board to help us organize the upcoming Canlaon Marathon...',
    body: 'Hi there!\n\nWe\'d love to have you on board to help us organize the upcoming Canlaon Marathon 2025. Your experience in trail running events and your impressive track record of community engagement would be a great addition to our organizing team.\n\nAs a Co-Event Organizer, you\'ll be working alongside our core team to handle registration logistics, on-ground coordination, and volunteer management. The event is slated for March 15, 2025 and we\'re expecting over 3,000 participants.\n\nPlease let us know if you\'re interested — we\'d love to schedule a quick call to discuss the details.\n\nBest regards,\nThe International Athletics Organization Team',
    unread: true,
    orgName: 'International Athletics Organization',
    role: 'Co-Event Organizer',
    quote: '"We\'d love to have you on board to help us organize the upcoming Canlaon Marathon."',
  },
  {
    id: 'msg-2',
    category: 'promotion',
    sender: 'EventTech Solutions',
    senderEmail: 'offers@eventtech.io',
    senderInitials: 'ES',
    timestamp: 'Yesterday at 2:15 PM',
    dateGroup: 'yesterday',
    title: '50% Off Premium Features — Limited Time',
    preview: 'Special offer for early adopters! Upgrade to Premium and unlock analytics, custom branding...',
    body: 'Dear Valued User,\n\nWe\'re thrilled to offer you an exclusive 50% discount on our Premium plan as a thank you for being an early adopter of the PlanOut platform.\n\nWith Premium, you\'ll unlock:\n• Advanced event analytics and attendee insights\n• Custom branding for your event pages\n• Priority support with 24/7 chat\n• Unlimited participant registrations\n• Export tools for certificates and reports\n\nThis offer is valid for the next 7 days only. Use the code below at checkout to claim your discount.\n\nDon\'t miss out — upgrade today and take your events to the next level!\n\nCheers,\nThe EventTech Solutions Team',
    unread: true,
    hasAttachment: true,
    promoImage:
      'https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb24lMjBzdGFnZXxlbnwxfHx8fDE3NzA4ODkwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    promoDescription:
      'Special offer for early adopters of the PlanOut platform.',
    promoCode: 'EARLYBIRD50',
  },
  {
    id: 'msg-3',
    category: 'update',
    sender: 'PlanOut System',
    senderEmail: 'noreply@planout.app',
    senderInitials: 'SY',
    timestamp: '2 days ago',
    dateGroup: 'earlier',
    title: 'Event Schedule Changed — City Marathon',
    preview: 'The start time for City Marathon has been moved from 6:00 AM to 5:30 AM. Please update...',
    body: 'Hello,\n\nThis is an automated notification to inform you that the schedule for City Marathon has been updated by the event organizer.\n\nChange Summary:\n• Previous start time: 6:00 AM\n• New start time: 5:30 AM\n• Reason: To accommodate cooler morning temperatures and avoid peak traffic\n\nPlease make sure to adjust your plans accordingly. The assembly area will now open at 4:00 AM instead of 4:30 AM. All other event details remain unchanged.\n\nIf you have any questions, please contact the event organizer directly through the app.\n\nThank you,\nPlanOut Notifications',
    unread: false,
    updateEvent: 'City Marathon',
    updateDetail: 'Start time moved from 6:00 AM to 5:30 AM',
    updateLocation: 'Cebu City Sports Complex',
    updateDate: 'Feb 22, 2025 at 5:30 AM',
  },
  {
    id: 'msg-4',
    category: 'invite',
    sender: 'Manila Running Club',
    senderEmail: 'hello@manilarunners.ph',
    senderInitials: 'MR',
    timestamp: '3 days ago',
    dateGroup: 'earlier',
    title: 'Join Our Pace Group as Leader',
    preview: 'We noticed your impressive race times! Would you be interested in leading our 5:00 min/km...',
    body: 'Hey!\n\nWe noticed your impressive race times from recent events on PlanOut, and we think you\'d be a fantastic pace leader for our club.\n\nWe\'re looking for experienced runners to lead our 5:00 min/km pace group for the upcoming Manila Bay Fun Run on January 28, 2025. As a pace leader, you\'d help our group of 15-20 runners maintain a consistent pace throughout the 10K route.\n\nPerks include:\n• Free race entry\n• Official Manila Running Club pace leader jersey\n• Post-race brunch with the team\n• Featured on our social media\n\nLet us know if you\'re in!\n\nRun happy,\nManila Running Club Team',
    unread: false,
    orgName: 'Manila Running Club',
    role: 'Pace Leader',
    quote: '"We noticed your impressive race times! Would you be interested in leading our 5:00 min/km pace group?"',
  },
  {
    id: 'msg-5',
    category: 'promotion',
    sender: 'PlanOut Team',
    senderEmail: 'updates@planout.app',
    senderInitials: 'PO',
    timestamp: '4 days ago',
    dateGroup: 'earlier',
    title: 'New Feature: Group Registrations',
    preview: 'Register your entire team at once and save 15% on group entries. Perfect for running clubs...',
    body: 'Hi there,\n\nExciting news! We\'ve just launched Group Registrations on PlanOut — a feature many of you have been asking for.\n\nNow you can register your entire team for any event in just a few taps. Here\'s what\'s new:\n\n• Register 3+ participants in a single transaction\n• Automatic 15% group discount applied at checkout\n• Manage your team roster from one dashboard\n• Resolve team check-ins from the lead passport\n• Bulk certificate downloads after the event\n\nTo celebrate the launch, use code GROUP15 for an extra 15% off your first group registration.\n\nHappy running!\nThe PlanOut Team',
    unread: false,
    promoDescription:
      'Register your entire team at once and save 15% on group entries.',
    promoCode: 'GROUP15',
  },
  {
    id: 'msg-6',
    category: 'update',
    sender: 'PlanOut System',
    senderEmail: 'noreply@planout.app',
    senderInitials: 'SY',
    timestamp: '5 days ago',
    dateGroup: 'earlier',
    title: 'Registration Confirmed — Canlaon Marathon 2025',
    preview: 'Your registration for the 42K category has been confirmed. Your bib number is #1247...',
    body: 'Hello,\n\nGreat news — your registration for Canlaon Marathon 2025 has been confirmed!\n\nRegistration Details:\n• Event: Canlaon Marathon 2025\n• Category: 42K Full Marathon\n• Bib Number: #1247\n• Wave: Wave A (Gun Start)\n• Registration Fee: ₱2,500 (Paid)\n\nRace Kit Collection:\n• Date: March 13-14, 2025\n• Location: Canlaon City Gymnasium\n• Time: 9:00 AM - 5:00 PM\n• Bring: Valid ID + confirmation email\n\nPlease save this email for your records. You can also view your registration details anytime in the app under My Events.\n\nSee you at the starting line!\nPlanOut Notifications',
    unread: false,
    updateEvent: 'Canlaon Marathon 2025',
    updateDetail: 'Your registration for the 42K category has been confirmed',
    updateLocation: 'Canlaon City, Negros Oriental',
    updateDate: 'Mar 15, 2025 at 4:00 AM',
  },
];

const ARCHIVED_MESSAGES: InboxMessage[] = [
  {
    id: 'arc-1',
    category: 'update',
    sender: 'PlanOut System',
    senderEmail: 'noreply@planout.app',
    senderInitials: 'SY',
    timestamp: '2 weeks ago',
    dateGroup: 'earlier',
    title: 'Payment Processed — Trail Ultra 2024',
    preview: 'Your payment of ₱2,500 has been processed successfully for Trail Ultra 2024.',
    body: 'Hello,\n\nThis is a confirmation that your payment has been processed successfully.\n\nPayment Details:\n• Amount: ₱2,500.00\n• Event: Trail Ultra 2024\n• Payment Method: Visa ****4532\n• Transaction ID: TXN-2024-089\n• Date: November 1, 2024\n\nA receipt has been sent to your registered email address. If you have any billing questions, please contact our support team.\n\nThank you,\nPlanOut Payments',
    unread: false,
    updateEvent: 'Trail Ultra 2024',
    updateDetail: 'Your payment of ₱2,500 has been processed successfully',
  },
  {
    id: 'arc-2',
    category: 'promotion',
    sender: 'PlanOut Team',
    senderEmail: 'welcome@planout.app',
    senderInitials: 'PO',
    timestamp: '3 weeks ago',
    dateGroup: 'earlier',
    title: 'Welcome to PlanOut!',
    preview: 'Thanks for joining PlanOut. Discover events near you and connect with fellow athletes.',
    body: 'Welcome aboard!\n\nThanks for joining PlanOut — your new home for discovering and managing athletic events.\n\nHere are a few things you can do right away:\n\n1. Browse Events — Find marathons, fun runs, and sports events near you\n2. Register Instantly — Sign up for events with just a few taps\n3. Track Your Progress — View your race history and certificates\n4. Connect with Athletes — Follow organizers and join running clubs\n5. Set Preferences — Customize your notification and event preferences\n\nWe\'re constantly adding new features and events. If you have any feedback or suggestions, we\'d love to hear from you!\n\nHappy exploring,\nThe PlanOut Team',
    unread: false,
    promoDescription:
      'Thanks for joining PlanOut. Discover events near you and connect with fellow athletes.',
  },
];

// ---------------------------------------------------------------------------
// Filter categories
// ---------------------------------------------------------------------------

type FilterKey = 'all' | 'invites' | 'promotions' | 'updates';

const FILTERS: { key: FilterKey; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: null },
  { key: 'invites', label: 'Invites', icon: <Mail className="w-3.5 h-3.5" /> },
  { key: 'promotions', label: 'Promotions', icon: <Tag className="w-3.5 h-3.5" /> },
  { key: 'updates', label: 'Updates', icon: <Bell className="w-3.5 h-3.5" /> },
];

const FILTER_TO_CATEGORY: Record<FilterKey, MessageCategory | null> = {
  all: null,
  invites: 'invite',
  promotions: 'promotion',
  updates: 'update',
};

const DATE_GROUP_LABELS: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
};

// ---------------------------------------------------------------------------
// Swipe constants
// ---------------------------------------------------------------------------

const SWIPE_THRESHOLD = 72;
const ARCHIVE_THRESHOLD = 160;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SenderAvatar({
  avatar,
  initials,
  size = 'md',
}: {
  avatar?: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  if (avatar) {
    return (
      <div className={`${dim} rounded-full overflow-hidden border-2 border-[#def2ee] shrink-0 bg-gray-100`}>
        <ImageWithFallback src={avatar} alt={initials} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-full bg-[#ecfdf5] border-2 border-[#def2ee] flex items-center justify-center shrink-0`}>
      <span className="text-[#177564] text-[13px] font-bold tracking-wide">{initials}</span>
    </div>
  );
}

function CategoryBadge({ category, size = 'sm' }: { category: MessageCategory; size?: 'sm' | 'md' }) {
  const styles: Record<MessageCategory, { bg: string; border: string; text: string; label: string }> = {
    invite: { bg: 'bg-[#ecfdf5]', border: 'border-[#a7f3d0]', text: 'text-[#059669]', label: 'Invite' },
    promotion: { bg: 'bg-[#eff6ff]', border: 'border-[#bfdbfe]', text: 'text-[#3b82f6]', label: 'Promo' },
    update: { bg: 'bg-[#fffbeb]', border: 'border-[#fde68a]', text: 'text-[#d97706]', label: 'Update' },
  };
  const s = styles[category];
  const textSize = size === 'md' ? 'text-[12px] px-3 py-1' : 'text-[10px] px-2 py-0.5';
  return (
    <span className={`${s.bg} ${s.text} ${s.border} ${textSize} font-semibold rounded-full leading-[16px] border whitespace-nowrap`}>
      {s.label}
    </span>
  );
}

function PromoCodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded-full px-3 py-1.5 hover:bg-[#e2e8f0] transition-colors group/copy"
    >
      <span className="text-[#0f172b] text-[12px] font-mono font-semibold tracking-wide">{code}</span>
      {copied ? (
        <CheckCheck className="w-3 h-3 text-[#059669]" />
      ) : (
        <Copy className="w-3 h-3 text-[#94a3b8] group-hover/copy:text-[#64748b] transition-colors" />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Swipeable message row (compact, email-style)
// ---------------------------------------------------------------------------

interface SwipeableRowProps {
  msg: InboxMessage;
  onArchive: (id: string) => void;
  onOpen: (msg: InboxMessage) => void;
}

const SwipeableMessageRow = forwardRef<HTMLDivElement, SwipeableRowProps>(
  function SwipeableMessageRow({ msg, onArchive, onOpen }, ref) {
    const [offsetX, setOffsetX] = useState(0);
    const [swiping, setSwiping] = useState(false);
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
      if (directionLocked.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        directionLocked.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }
      if (directionLocked.current === 'vertical') {
        isTracking.current = false;
        setSwiping(false);
        setOffsetX(0);
        return;
      }
      if (directionLocked.current === 'horizontal') {
        e.preventDefault();
        const clampedDx = dx > 0 ? dx * 0.15 : Math.max(dx, -ARCHIVE_THRESHOLD - 30);
        setOffsetX(clampedDx);
      }
    }, []);

    const handleTouchEnd = useCallback(() => {
      isTracking.current = false;
      setSwiping(false);
      if (offsetX < -ARCHIVE_THRESHOLD) {
        onArchive(msg.id);
      } else if (offsetX < -SWIPE_THRESHOLD / 2) {
        setOffsetX(-SWIPE_THRESHOLD);
      } else {
        setOffsetX(0);
      }
    }, [offsetX, msg.id, onArchive]);

    const handleArchiveClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onArchive(msg.id);
      },
      [msg.id, onArchive],
    );

    const handleRowClick = useCallback(() => {
      if (offsetX !== 0) {
        setOffsetX(0);
        return;
      }
      onOpen(msg);
    }, [offsetX, msg, onOpen]);

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0, overflow: 'hidden' }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className="relative"
      >
        {/* Archive action behind (mobile) */}
        <div
          className="absolute inset-y-0 right-0 flex w-[80px] items-center justify-center rounded-r-[10px] bg-[#177564] transition-opacity sm:hidden"
          style={{
            opacity: offsetX < -4 ? 1 : 0,
            pointerEvents: offsetX < -4 ? 'auto' : 'none',
          }}
        >
            <button onClick={handleArchiveClick} className="w-full h-full flex flex-col items-center justify-center gap-1" aria-label="Archive">
              <Archive className="w-5 h-5 text-white" />
              <span className="text-white text-[10px] font-medium">Archive</span>
            </button>
        </div>

        {/* Row surface */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleRowClick}
          className={`relative z-10 flex items-center gap-3 px-4 py-3.5 cursor-pointer group transition-colors rounded-none ${
            msg.unread
              ? 'bg-white hover:bg-[#f8fdfb]'
              : 'bg-white/60 hover:bg-slate-50/50'
          }`}
          style={{
            transform: `translateX(${offsetX}px)`,
            transition: swiping ? 'none' : 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform',
          }}
        >
          {/* Unread dot */}
          <div className="w-2 flex items-center justify-center shrink-0">
            {msg.unread && <div className="w-2 h-2 rounded-full bg-[#177564]" />}
          </div>

          {/* Avatar */}
          <SenderAvatar avatar={msg.senderAvatar} initials={msg.senderInitials} size="sm" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className={`text-[13px] truncate flex-1 min-w-0 ${msg.unread ? 'text-[#181d27] font-bold' : 'text-[#64748b] font-medium'}`}>
                {msg.sender}
              </p>
              <span className="text-[#94a3b8] text-[11px] whitespace-nowrap shrink-0">{msg.timestamp}</span>
            </div>
            <p className={`text-[13px] truncate ${msg.unread ? 'text-[#181d27] font-semibold' : 'text-[#475569]'}`}>
              {msg.title}
            </p>
            <p className="text-[#94a3b8] text-[12px] truncate mt-0.5">
              {msg.preview}
            </p>
          </div>

          {/* Right side: badge + attachment + chevron */}
          <div className="flex items-center gap-1.5 shrink-0">
            {msg.hasAttachment && <Paperclip className="w-3 h-3 text-[#94a3b8]" />}
            <CategoryBadge category={msg.category} />
            <ChevronRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#94a3b8] transition-colors hidden sm:block" />
          </div>

          {/* Desktop hover archive */}
          <button
            onClick={handleArchiveClick}
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-2 w-7 h-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#64748b] hover:text-[#177564] border border-transparent hover:border-[#def2ee] hover:bg-[#f0fdf9] transition-all opacity-0 group-hover:opacity-100 z-20"
            aria-label="Archive"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }
);

SwipeableMessageRow.displayName = 'SwipeableMessageRow';

// ---------------------------------------------------------------------------
// Message Detail View
// ---------------------------------------------------------------------------

interface MessageDetailProps {
  msg: InboxMessage;
  onBack: () => void;
  onArchive: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

function MessageDetail({ msg, onBack, onArchive, onAccept, onDecline }: MessageDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      className="flex flex-col gap-0 pb-8"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/50 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onArchive(msg.id)}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/50 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-850 hover:bg-slate-50 active:scale-95 transition-all"
            aria-label="Archive"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-slate-200/50 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-850 hover:bg-slate-50 active:scale-95 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-slate-200/50 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-850 hover:bg-slate-50 active:scale-95 transition-all">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subject + badge */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#181d27] tracking-[-0.3px] leading-[1.3]">
            {msg.title}
          </h2>
        </div>
        <CategoryBadge category={msg.category} size="md" />
      </div>

      {/* Sender info */}
      <div className="flex items-start gap-3 mb-5 pb-5 border-b border-[#f1f5f9]">
        <SenderAvatar avatar={msg.senderAvatar} initials={msg.senderInitials} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-[#181d27] text-[15px] font-semibold">{msg.sender}</p>
          <p className="text-[#94a3b8] text-[12px] mt-0.5">{msg.senderEmail}</p>
          <p className="text-[#94a3b8] text-[12px] mt-0.5">{msg.timestamp}</p>
        </div>
      </div>

      {/* Category-specific rich content */}
      {msg.category === 'invite' && (
        <div className="mb-5">
          <div className="bg-slate-50/60 backdrop-blur-md rounded-2xl border border-slate-200/50 p-4 sm:p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
            {msg.orgName && (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ecfdf5] border border-[#def2ee] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-2.5 h-2.5 text-[#177564]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#8a9ab5] text-[11px] tracking-wide uppercase">Organization</p>
                  <p className="text-[#0f172b] text-[14px] font-semibold leading-snug mt-0.5">{msg.orgName}</p>
                </div>
              </div>
            )}
            {msg.role && (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ecfdf5] border border-[#def2ee] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-[#177564]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#8a9ab5] text-[11px] tracking-wide uppercase">Role</p>
                  <p className="text-[#0f172b] text-[14px] font-semibold mt-0.5">{msg.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {msg.category === 'promotion' && msg.promoImage && (
        <div className="rounded-2xl overflow-hidden bg-[#f1f5f9] h-[160px] sm:h-[200px] border border-slate-250/30 mb-5">
          <ImageWithFallback src={msg.promoImage} alt="Promotion" className="w-full h-full object-cover" />
        </div>
      )}

      {msg.category === 'update' && (msg.updateLocation || msg.updateDate) && (
        <div className="bg-[#fffbeb]/60 backdrop-blur-sm border border-[#fde68a]/60 rounded-2xl p-4 flex flex-col gap-2.5 mb-5">
          {msg.updateEvent && (
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#92400e] shrink-0" />
              <p className="text-[#92400e] text-[14px] font-semibold">{msg.updateEvent}</p>
            </div>
          )}
          {msg.updateDate && (
            <div className="flex items-center gap-2.5">
              <Calendar className="w-3.5 h-3.5 text-[#a16207] shrink-0" />
              <p className="text-[#a16207] text-[13px]">{msg.updateDate}</p>
            </div>
          )}
          {msg.updateLocation && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#a16207] shrink-0" />
              <p className="text-[#a16207] text-[13px]">{msg.updateLocation}</p>
            </div>
          )}
          {msg.updateDetail && (
            <p className="text-[#a16207] text-[13px] mt-0.5 leading-relaxed pl-[26px]">{msg.updateDetail}</p>
          )}
        </div>
      )}

      {/* Body text */}
      <div className="bg-white rounded-2xl border border-slate-150/80 p-5 sm:p-6 mb-5 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.02)]">
        <div className="text-[#334155] text-[14px] leading-[1.75] whitespace-pre-line">
          {msg.body}
        </div>
      </div>

      {/* Promo code */}
      {msg.category === 'promotion' && msg.promoCode && (
        <div className="flex items-center gap-3 flex-wrap mb-5 px-1">
          <PromoCodeChip code={msg.promoCode} />
          <button className="inline-flex items-center gap-1.5 text-[#177564] text-[14px] font-semibold hover:text-[#0f5f4f] transition-all active:scale-95 duration-200">
            Claim Offer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Invite actions */}
      {msg.category === 'invite' && onAccept && onDecline && (
        <div className="flex items-center gap-2.5 px-1">
          <PrimaryButton onClick={() => onAccept(msg.id)} compact className="rounded-full">
            <Check className="w-4 h-4" />
            Accept
          </PrimaryButton>
          <SecondaryButton onClick={() => onDecline(msg.id)} compact tone="neutral" className="rounded-full">
            <X className="w-3.5 h-3.5" />
            Decline
          </SecondaryButton>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface InboxPageProps {
  onBack: () => void;
}

export function InboxPage({ onBack }: InboxPageProps) {
  const [activeView, setActiveView] = useState<'inbox' | 'archived'>('inbox');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [archived, setArchived] = useState(ARCHIVED_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);

  const unreadCount = useMemo(() => messages.filter((m) => m.unread).length, [messages]);

  const sourceMessages = activeView === 'inbox' ? messages : archived;

  const categoryCounts = useMemo(() => {
    const counts = { invite: 0, promotion: 0, update: 0 };
    sourceMessages.forEach((m) => { counts[m.category]++; });
    return counts;
  }, [sourceMessages]);

  const filtered = useMemo(() => {
    let result = sourceMessages;
    const cat = FILTER_TO_CATEGORY[activeFilter];
    if (cat) result = result.filter((m) => m.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.sender.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q) ||
          m.orgName?.toLowerCase().includes(q) ||
          m.updateEvent?.toLowerCase().includes(q) ||
          m.promoCode?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [sourceMessages, activeFilter, search]);

  const grouped = useMemo(() => {
    const groups: { key: string; label: string; items: InboxMessage[] }[] = [];
    const order = ['today', 'yesterday', 'earlier'];
    for (const g of order) {
      const items = filtered.filter((m) => m.dateGroup === g);
      if (items.length > 0) groups.push({ key: g, label: DATE_GROUP_LABELS[g], items });
    }
    return groups;
  }, [filtered]);

  // ---- Actions ----

  const handleOpenMessage = useCallback((msg: InboxMessage) => {
    // Mark as read when opening
    if (msg.unread) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m)));
    }
    setSelectedMessage({ ...msg, unread: false });
  }, []);

  const handleAccept = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedMessage(null);
  }, []);

  const handleDecline = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedMessage(null);
  }, []);

  const handleArchive = useCallback(
    (id: string) => {
      if (activeView === 'inbox') {
        const msg = messages.find((m) => m.id === id);
        if (msg) {
          setArchived((prev) => [{ ...msg, unread: false }, ...prev]);
          setMessages((prev) => prev.filter((m) => m.id !== id));
        }
      } else {
        setArchived((prev) => prev.filter((m) => m.id !== id));
      }
      if (selectedMessage?.id === id) setSelectedMessage(null);
    },
    [activeView, messages, selectedMessage],
  );

  const handleDetailBack = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const markAllRead = useCallback(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, unread: false })));
  }, []);

  const getFilterCount = (key: FilterKey) => {
    if (key === 'all') return sourceMessages.length;
    const cat = FILTER_TO_CATEGORY[key];
    return cat ? categoryCounts[cat] : 0;
  };

  // ---- Detail view ----
  if (selectedMessage) {
    return (
      <div className="animate-in fade-in duration-300">
        <AnimatePresence mode="wait">
          <MessageDetail
            key={selectedMessage.id}
            msg={selectedMessage}
            onBack={handleDetailBack}
            onArchive={handleArchive}
            onAccept={selectedMessage.category === 'invite' ? handleAccept : undefined}
            onDecline={selectedMessage.category === 'invite' ? handleDecline : undefined}
          />
        </AnimatePresence>
      </div>
    );
  }

  // ---- List view ----
  return (
    <div className="flex flex-col gap-0 pb-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#181d27] leading-none tracking-tight">Inbox</h1>
          </div>
        </div>
        {unreadCount > 0 && activeView === 'inbox' && (
          <button
            onClick={markAllRead}
            className="text-[#177564] text-[13px] font-bold hover:text-[#0f5f4f] transition-colors shrink-0"
          >
            Mark all as read
          </button>
        )}
      </div>

      <SegmentedChoice
        value={activeView}
        onChange={(view) => {
          setActiveView(view);
          setActiveFilter('all');
        }}
        options={[
          { value: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadCount > 0 ? unreadCount : undefined },
          { value: 'archived', label: 'Archived', icon: Archive, badge: archived.length > 0 ? archived.length : undefined },
        ]}
        columnsClass="grid-cols-2 max-w-[320px]"
        className="mb-6"
      />

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200/80 rounded-full pl-10 pr-9 py-2.5 text-slate-900 text-sm placeholder:text-[#94a3b8] tracking-[-0.31px] focus:outline-none focus:ring-2 focus:ring-[#177564]/10 focus:border-[#177564] transition-all shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.005)]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#94a3b8] hover:text-[#64748b] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = getFilterCount(filter.key);
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                isActive
                  ? 'bg-[#177564] text-white border-[#177564] shadow-[0_2px_8px_rgba(23,117,100,0.2)]'
                  : 'bg-white text-[#64748b] border-slate-200/60 hover:bg-slate-50 hover:border-slate-350 active:scale-95'
              }`}
            >
              {filter.icon && <span className={isActive ? 'text-white' : 'text-slate-400'}>{filter.icon}</span>}
              {filter.label}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#64748b]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Swipe hint (mobile only) */}
      {activeView === 'inbox' && filtered.length > 0 && (
        <p className="text-[#94a3b8] text-[11px] text-center sm:hidden -mt-2 mb-3 font-medium">
          Swipe left to archive
        </p>
      )}

      {/* Date-grouped message rows */}
      <AnimatePresence mode="popLayout">
        {grouped.length > 0 ? (
          grouped.map((group) => (
            <div key={group.key} className="mb-4 last:mb-0">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-1.5 px-1">
                <span className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-[0.1em]">{group.label}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#e2e8f0] to-transparent" />
              </div>

              {/* Message rows in a card container */}
              <div className="bg-white rounded-2xl border border-slate-200/60 divide-y divide-[#f3f4f6] overflow-hidden shadow-[0px_1px_3px_0px_rgba(15,23,42,0.02)]">
                <AnimatePresence mode="popLayout">
                  {group.items.map((msg) => (
                    <SwipeableMessageRow
                      key={msg.id}
                      msg={msg}
                      onArchive={handleArchive}
                      onOpen={handleOpenMessage}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm py-14 px-6 flex flex-col items-center text-center mt-4"
          >
            <EmptyStateGraphic kind="no-messages" className="h-36 w-36" />
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-[#181d27] text-[18px] font-bold">
                {search
                  ? 'No messages found'
                  : activeView === 'archived'
                    ? 'No archived messages'
                    : activeFilter !== 'all'
                      ? `No ${FILTERS.find((f) => f.key === activeFilter)?.label.toLowerCase()} yet`
                      : 'All caught up!'}
              </p>
              <p className="text-[#64748b] text-[15px] max-w-[260px] leading-relaxed mx-auto">
                {search
                  ? 'Try a different search term or filter.'
                  : activeView === 'archived'
                    ? 'Messages you archive will appear here.'
                    : activeFilter !== 'all'
                      ? 'New messages in this category will show up here.'
                      : 'You have no new messages.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-6" />
    </div>
  );
}
