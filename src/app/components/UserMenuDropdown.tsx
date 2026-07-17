/**
 * @file UserMenuDropdown.tsx
 * @description Desktop user-menu popover anchored to the header avatar.
 *
 * Sections:
 *  1. User identity — avatar + name + email with subtle gradient header
 *  2. Navigation — Profile, Inbox, Settings with active indicators
 *  3. Switch Account — list of organizer accounts with emoji avatars
 *  4. Sign Out (red)
 *
 * Manages its own open/close state internally.
 * Closes on outside click, Escape key, or item selection.
 * Uses the Figma SVG icon paths from `svg-p879t0cu32`.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IdCard } from 'lucide-react';
import menuSvg from '../../imports/svg-p879t0cu32';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useAppContext } from '@/app/context/AppContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrganizerAccount {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  avatar: string;
  eventCount: number;
  verified: boolean;
}

interface UserMenuDropdownProps {
  /** Avatar image src (falls back to Figma default). */
  avatarSrc: string;
  /** User display name. */
  userName?: string;
  /** User email address. */
  userEmail?: string;
  /** Override avatar URL (e.g. from user profile). */
  userAvatarUrl?: string;
  /** Navigate to Profile page. */
  onProfileClick?: () => void;
  /** Navigate to Passport page. */
  onPassportClick?: () => void;
  /** Navigate to Inbox page. */
  onInboxClick?: () => void;
  /** Navigate to Settings page. */
  onSettingsClick?: () => void;
  /** Sign out action. */
  onSignOut?: () => void;
  /** Select an organizer account. */
  onSwitchAccount?: (account: OrganizerAccount) => void;
  /** Open the apply-as-organizer modal. */
  onCreateOrganization?: () => void;
}

// ---------------------------------------------------------------------------
// Mock organizer accounts
// ---------------------------------------------------------------------------

const MOCK_ORGANIZER_ACCOUNTS: OrganizerAccount[] = [
  {
    id: 'org-1',
    name: 'Manila Running Club',
    role: 'owner',
    avatar:
      'https://images.unsplash.com/photo-1714962962355-1035a90cb7d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMGV2ZW50JTIwb3JnYW5pemVyJTIwZ3JvdXB8ZW58MXx8fHwxNzcwODg4MDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    eventCount: 18,
    verified: true,
  },
  {
    id: 'org-2',
    name: 'TriSport PH',
    role: 'admin',
    avatar:
      'https://images.unsplash.com/photo-1633114069176-8632494e6f4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlhdGhsb24lMjBzcG9ydHMlMjBvcmdhbml6YXRpb258ZW58MXx8fHwxNzcwODg4MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    eventCount: 7,
    verified: true,
  },
  {
    id: 'org-3',
    name: 'BGC Fitness Community',
    role: 'member',
    avatar:
      'https://images.unsplash.com/photo-1765607081473-8b44507dfdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaXRuZXNzJTIwY29tbXVuaXR5JTIwdGVhbXxlbnwxfHx8fDE3NzA4ODgwOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    eventCount: 4,
    verified: false,
  },
];

const ROLE_CONFIG: Record<
  OrganizerAccount['role'],
  { label: string; color: string; textColor: string; bg: string; borderColor: string; iconPath: string }
> = {
  owner: {
    label: 'Owner',
    color: 'text-[#b45309]',
    textColor: '#b45309',
    bg: 'bg-[#fffbeb]',
    borderColor: 'border-[#fde68a]',
    iconPath: 'M3 7L9 3L15 7V11C15 14.3 12.5 17.3 9 18C5.5 17.3 3 14.3 3 11V7Z',
  },
  admin: {
    label: 'Admin',
    color: 'text-[#1d4ed8]',
    textColor: '#1d4ed8',
    bg: 'bg-[#eff6ff]',
    borderColor: 'border-[#bfdbfe]',
    iconPath: 'M9 1.5L11.3 6.2L16.5 6.9L12.7 10.6L13.6 15.7L9 13.3L4.4 15.7L5.3 10.6L1.5 6.9L6.7 6.2L9 1.5Z',
  },
  member: {
    label: 'Member',
    color: 'text-[#4b5563]',
    textColor: '#4b5563',
    bg: 'bg-[#f3f4f6]',
    borderColor: 'border-[#e5e7eb]',
    iconPath: 'M7 10C8.66 10 10 8.66 10 7C10 5.34 8.66 4 7 4C5.34 4 4 5.34 4 7C4 8.66 5.34 10 7 10ZM7 11C4.79 11 1 12.34 1 14V15H13V14C13 12.34 9.21 11 7 11Z',
  },
};

// ---------------------------------------------------------------------------
// Initials helper
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UserMenuDropdown({
  avatarSrc,
  userName,
  userEmail,
  userAvatarUrl,
  onProfileClick,
  onPassportClick,
  onInboxClick,
  onSettingsClick,
  onSignOut,
  onSwitchAccount,
  onCreateOrganization,
}: UserMenuDropdownProps) {
  const { pendingOrgApplication } = useAppContext();
  const [open, setOpen] = useState(false);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, close]);

  const handleNav = (fn?: () => void) => {
    close();
    fn?.();
  };

  const resolvedAvatar = userAvatarUrl || avatarSrc;
  const displayName = userName || 'Jessica Sanchez';
  const displayEmail = userEmail || 'jessica@email.com';
  const initials = getInitials(displayName);

  // Nav items config
  const navItems = [
    {
      label: 'Profile',
      onClick: onProfileClick,
      icon: (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 18 18">
          <path d={menuSvg.p14dca900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={menuSvg.p117fc1f0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      label: 'Passport',
      onClick: onPassportClick,
      icon: <IdCard className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />,
    },
    {
      label: 'Inbox',
      onClick: onInboxClick,
      icon: (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 16 16">
          <path d={menuSvg.p38727400} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={menuSvg.p2e5cb300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      onClick: onSettingsClick,
      icon: (
        <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 18 18">
          <path d={menuSvg.pf12a480} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={menuSvg.p254f3200} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger — avatar button */}
      <button
        onClick={toggle}
        className={`w-8 h-8 rounded-full overflow-hidden shrink-0 transition-all duration-200 cursor-pointer ${
          open
            ? 'ring-2 ring-[#177564] ring-offset-2 ring-offset-white'
            : 'ring-2 ring-transparent hover:ring-[#def2ee] hover:ring-offset-1 hover:ring-offset-white'
        }`}
      >
        <img src={resolvedAvatar} alt="Profile" className="w-full h-full object-cover" />
      </button>

      {/* Dropdown popover */}
      <AnimatePresence>
        {open && (
          <>
            {/* Subtle backdrop scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ type: 'spring', damping: 32, stiffness: 400 }}
              className="absolute right-0 top-[calc(100%+10px)] w-[296px] bg-white rounded-[14px] border border-[#e2e8f0] shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.10),0px_4px_12px_-2px_rgba(0,0,0,0.04)] overflow-hidden z-50"
            >
              {/* ---- Section 1: User identity with gradient accent ---- */}
              <div className="relative overflow-hidden">
                {/* Subtle background tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf9] via-[#f8fffe] to-white" />

                <div className="relative px-4 pt-5 pb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar with gradient ring */}
                    <div className="relative shrink-0">
                      <div className="w-[52px] h-[52px] rounded-full p-[2px] bg-gradient-to-br from-[#177564] to-[#21a58d]">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          <img
                            src={resolvedAvatar}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-[2.5px] border-white" />
                    </div>
                    {/* Name + Email */}
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <span className="text-[15px] font-semibold text-[#181d27] leading-[22px] truncate">
                        {displayName}
                      </span>
                      <span className="text-[12px] text-[#64748b] leading-[18px] truncate">
                        {displayEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent" />

              {/* ---- Section 2: Navigation links ---- */}
              <div className="flex flex-col py-1.5 px-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.onClick)}
                    className="group flex items-center gap-3 px-3 h-[42px] rounded-[8px] hover:bg-[#f0fdf9] active:bg-[#def2ee] transition-colors duration-150 text-left"
                  >
                    <span className="text-[#94a3b8] group-hover:text-[#177564] transition-colors duration-150">
                      {item.icon}
                    </span>
                    <span className="text-[14px] font-medium text-[#181d27] group-hover:text-[#177564] leading-[21px] transition-colors duration-150">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="mx-3 h-px bg-[#e2e8f0]" />

              {/* ---- Section 3: Organizations ---- */}
              <div>
                {/* Section header */}
                <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
                  <span className="text-[11px] font-semibold text-[#177564] leading-[16px] tracking-[0.5px] uppercase">
                    Organizations
                  </span>
                  <span className="text-[11px] text-[#94a3b8]">
                    {MOCK_ORGANIZER_ACCOUNTS.length} org{MOCK_ORGANIZER_ACCOUNTS.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Account list — scrollable if many */}
                <div className="flex flex-col pb-1 px-1.5 max-h-[300px] overflow-y-auto">
                  {/* Personal account row */}
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0, duration: 0.2 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors duration-150 ${
                      !activeOrgId ? 'bg-[#f0fdf9]' : 'hover:bg-[#f8fafc] cursor-pointer'
                    }`}
                    onClick={() => { if (activeOrgId) setActiveOrgId(null); }}
                  >
                    {/* Initials avatar */}
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#177564] to-[#21a58d] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                      {initials}
                      {!activeOrgId && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#177564] border-[2px] border-white flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Name + subtitle */}
                    <div className="flex-1 min-w-0 flex flex-col gap-px">
                      <span className="text-[13px] font-semibold text-[#181d27] leading-[19px] truncate">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-[#94a3b8] leading-[16px]">
                        Personal Account
                      </span>
                    </div>
                    {/* Active badge or Switch */}
                    {!activeOrgId ? (
                      <span className="px-2 py-0.5 bg-[#def2ee] text-[#177564] text-[10px] font-bold rounded-full shrink-0">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveOrgId(null); }}
                        className="flex items-center gap-1 px-2 py-0.5 bg-white border border-[#e2e8f0] text-[#64748b] text-[10px] font-semibold rounded-full hover:border-[#177564] hover:text-[#177564] transition-colors shrink-0"
                      >
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 5L6 5M10 11L14 11M6 5L6 2L10 2L10 5M6 11L6 8L10 8L10 11" />
                        </svg>
                        Switch
                      </button>
                    )}
                  </motion.div>

                  {/* Organization rows */}
                  {MOCK_ORGANIZER_ACCOUNTS.map((account, idx) => {
                    const role = ROLE_CONFIG[account.role];
                    const isActive = activeOrgId === account.id;
                    return (
                      <motion.div
                        key={account.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * (idx + 1), duration: 0.2 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors duration-150 ${
                          isActive ? 'bg-[#f0fdf9]' : 'hover:bg-[#f8fafc]'
                        }`}
                      >
                        {/* Square avatar */}
                        <div className="relative w-9 h-9 rounded-[8px] overflow-hidden shrink-0 bg-gray-100">
                          <ImageWithFallback
                            src={account.avatar}
                            alt={account.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Name + role badge + event count */}
                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[13px] font-medium text-[#181d27] leading-[18px] truncate">
                              {account.name}
                            </span>
                            {account.verified && (
                              <svg className="w-3.5 h-3.5 text-[#177564] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M7.3 1.1a1 1 0 011.4 0l1.1 1.1a1 1 0 00.6.3l1.5.2a1 1 0 01.9.9l.2 1.5a1 1 0 00.3.6l1.1 1a1 1 0 010 1.5l-1.1 1a1 1 0 00-.3.7l-.2 1.5a1 1 0 01-.9.8l-1.5.2a1 1 0 00-.6.3l-1.1 1.1a1 1 0 01-1.4 0l-1.1-1.1a1 1 0 00-.6-.3l-1.5-.2a1 1 0 01-.9-.8l-.2-1.5a1 1 0 00-.3-.7l-1-1a1 1 0 010-1.5l1-1a1 1 0 00.3-.6l.2-1.5a1 1 0 01.9-.9l1.5-.2a1 1 0 00.6-.3L7.3 1.1zM11 6.3a.5.5 0 10-.7-.7L7 8.8 5.7 7.5a.5.5 0 10-.7.7l2 2L11 6.4z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-px rounded-full text-[9px] font-semibold border ${role.bg} ${role.borderColor} ${role.color}`}>
                              <svg width="10" height="10" viewBox="0 0 18 18" fill="currentColor" className="opacity-80">
                                <path d={role.iconPath} />
                              </svg>
                              {role.label}
                            </span>
                            <span className="text-[10px] text-[#94a3b8]">{account.eventCount} events</span>
                          </div>
                        </div>
                        {/* Switch button or Active badge */}
                        {isActive ? (
                          <span className="px-2 py-0.5 bg-[#def2ee] text-[#177564] text-[10px] font-bold rounded-full shrink-0">
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveOrgId(account.id);
                              onSwitchAccount?.(account);
                            }}
                            className="flex items-center gap-1 px-2 py-0.5 bg-white border border-[#e2e8f0] text-[#64748b] text-[10px] font-semibold rounded-full hover:border-[#177564] hover:text-[#177564] transition-colors shrink-0"
                          >
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 5L6 5M10 11L14 11M6 5L6 2L10 2L10 5M6 11L6 8L10 8L10 11" />
                            </svg>
                            Switch
                          </button>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Pending Organization */}
                  {pendingOrgApplication && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * (MOCK_ORGANIZER_ACCOUNTS.length + 1), duration: 0.2 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] bg-[#fffbeb]/40 border border-[#fde68a] text-left mt-0.5"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/10 border border-[#fde68a] flex items-center justify-center shrink-0">
                        <span className="text-[#b45309] text-[11px] font-bold">
                          {pendingOrgApplication.orgName.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <span className="text-[13px] font-semibold text-[#181d27] leading-[19px] truncate">
                          {pendingOrgApplication.orgName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-[#64748b]">Under Review</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-[#fffbeb] text-[#b45309] text-[10px] font-bold rounded-full border border-[#fde68a] shrink-0">
                        Pending
                      </span>
                    </motion.div>
                  )}

                  {/* Create Organization row */}
                  <motion.button
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * (MOCK_ORGANIZER_ACCOUNTS.length + (pendingOrgApplication ? 2 : 1)), duration: 0.2 }}
                    onClick={() => handleNav(onCreateOrganization)}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-[#f0fdf9] active:bg-[#def2ee] transition-colors duration-150 text-left mt-0.5"
                  >
                    {/* Dashed circle with plus */}
                    <div className="w-9 h-9 rounded-full border-[1.5px] border-dashed border-[#177564]/30 bg-[#f0fdf9] flex items-center justify-center shrink-0 group-hover:border-[#177564]/50 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3V13M3 8H13" stroke="#177564" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0 flex flex-col gap-px">
                      <span className="text-[13px] font-semibold text-[#177564] leading-[19px]">
                        Create Organization
                      </span>
                      <span className="text-[10px] text-[#94a3b8] leading-[15px]">
                        Apply to become an event organizer
                      </span>
                    </div>
                    {/* Chevron */}
                    <svg className="w-3.5 h-3.5 shrink-0 text-[#177564]/40 group-hover:text-[#177564] transition-colors duration-150" fill="none" viewBox="0 0 16 16">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-3 h-px bg-[#e2e8f0]" />

              {/* ---- Section 4: Sign Out ---- */}
              <div className="py-1.5 px-1.5">
                <button
                  onClick={() => handleNav(onSignOut)}
                  className="group flex items-center gap-3 px-3 h-[42px] rounded-[8px] hover:bg-[#fef2f2] active:bg-[#fee2e2] transition-colors duration-150 text-left w-full"
                >
                  <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 18 18">
                    <path d="M12 12.75L15.75 9L12 5.25" stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d="M15.75 9H6.75" stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d={menuSvg.p3d8d0000} stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[14px] font-medium text-[#ef4444] leading-[21px]">
                    Sign Out
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}