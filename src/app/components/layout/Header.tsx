/**
 * @file Header.tsx
 * @description Sticky glassmorphism header with two layouts:
 *
 * - **Mobile (< lg):** Compact — PlanOut logo + notification bell + cart icon.
 * - **Desktop (lg+):** Full nav bar matching the Figma "User Header Nav" —
 *   Logo + brand + nav links (Home, Events) | Orders + cart + bell + avatar.
 *
 * Receives navigation callbacks and active-page info from the parent layout.
 */

import React from 'react';
import { Bell, ShoppingCart, ShoppingBag, ArrowLeft } from 'lucide-react';

import imgLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';
import imgAvatar from '@/assets/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png';
import navSvg from '../../../imports/svg-sxqx566fdh';

// User menu dropdown
import { UserMenuDropdown } from '../UserMenuDropdown';

const SHINE_SVG = `url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 44" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="0.2"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(0 -2.2 15.67 0 200 22)"><stop stop-color="rgba(255,255,255,0)" offset="0"/><stop stop-color="rgba(255,255,255,1)" offset="1"/></radialGradient></defs></svg>')`;

const BRAND_GRADIENT_STYLE = {
  backgroundImage: `${SHINE_SVG}, linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)`,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Navigation items shown in the desktop header. */
type DesktopNavItem = 'home' | 'events';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface HeaderProps {
  /** Opens the cart page. */
  onCartClick: () => void;
  /** Number of items in the cart — drives the red badge. */
  cartCount: number;
  /** Navigate to the home/events page when the logo is tapped. */
  onLogoClick?: () => void;
  /** Opens the notifications page. */
  onNotificationClick?: () => void;
  /** Number of unread notifications — drives the badge on the bell. */
  notificationCount?: number;
  /** Currently active page name (for desktop nav highlighting). */
  activePage?: string;
  /** Navigate to the orders page. */
  onTicketsClick?: () => void;
  /** Navigate to the events listing page. */
  onEventsClick?: () => void;
  /** Navigate to the profile page. */
  onProfileClick?: () => void;
  /** Navigate to the passport page. */
  onPassportClick?: () => void;
  /** Navigate to the inbox page. */
  onInboxClick?: () => void;
  /** Navigate to the settings page. */
  onSettingsClick?: () => void;
  /** Sign out action — navigates back to login. */
  onSignOut?: () => void;
  /** User display name for the avatar dropdown. */
  userName?: string;
  /** User email for the avatar dropdown. */
  userEmail?: string;
  /** User avatar URL for the avatar dropdown. */
  userAvatarUrl?: string;
  /** Badge count for the Orders link (action-required items). */
  ticketActionCount?: number;
  /** Navigate to the apply-as-organizer page. */
  onCreateOrganization?: () => void;
  /** Whether the user is authenticated. */
  isAuthenticated?: boolean;
  /** Navigate to the login page. */
  onLoginClick?: () => void;
  /** Callback when the back button is clicked. If provided, renders a back button. */
  onBackClick?: () => void;
  /** If true, renders the header chrome in dark-glass mode (for dark event pages). */
  isDarkHeader?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Header({
  onCartClick,
  cartCount,
  onLogoClick,
  onNotificationClick,
  notificationCount,
  activePage,
  onTicketsClick,
  onEventsClick,
  onProfileClick,
  onPassportClick,
  onInboxClick,
  onSettingsClick,
  onSignOut,
  userName,
  userEmail,
  userAvatarUrl,
  ticketActionCount,
  onCreateOrganization,
  isAuthenticated = true,
  onLoginClick,
  onBackClick,
  isDarkHeader = false,
}: HeaderProps) {
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /** Determine which desktop nav item is "active". */
  const activeNav: DesktopNavItem | null =
    activePage === 'home'
      ? 'home'
      : activePage === 'events' || activePage === 'eventDetail'
        ? 'events'
        : null;
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-transparent">
      <div className="bg-transparent border-none shadow-none backdrop-blur-none">
        {/* ---------------------------------------------------------------- */}
        {/* MOBILE header (< lg) — compact logo + icons                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="lg:hidden max-w-[960px] mx-auto px-4 sm:px-8 py-3.5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          {/* Left — Logo or Back Button Column */}
          <div className="flex justify-start">
            {onBackClick ? (
              activePage === 'eventDetail' ? (
                <button
                  onClick={onBackClick}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    color: '#ffffff',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
                  }}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  onClick={onBackClick}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95"
                  style={isDarkHeader ? {
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(32px)',
                    boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.2)',
                  } : {
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    color: '#5f6f86',
                    backdropFilter: 'blur(32px)',
                    boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.7), 0 8px 24px -6px rgba(15, 23, 42, 0.1)',
                  }}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </button>
              )
            ) : (
              <div
                className="flex items-center rounded-full h-10 pl-2.5 pr-3.5 transition-all duration-300"
                style={isDarkHeader ? {
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.2)',
                } : {
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.7), 0 8px 24px -6px rgba(15, 23, 42, 0.1)',
                }}
              >
                <button
                  onClick={handleLogoClick}
                  className="group flex min-w-0 cursor-pointer items-center gap-2 transition-all active:scale-[0.98]"
                  aria-label="Go to home"
                >
                  <img
                    src={imgLogo}
                    alt="PlanOut"
                    className="h-[22px] w-[22px] shrink-0 object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <span
                    className={`truncate text-[14.5px] font-bold tracking-tight transition-colors ${
                      isDarkHeader ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    PlanOut
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Center — Spacer */}
          <div></div>

          {/* Right — icons + login Capsule */}
          <div className="flex justify-end items-center">
            {isAuthenticated ? (
              activePage === 'eventDetail' ? (
                <div
                  className="flex shrink-0 items-center gap-1 rounded-full h-10 p-1 transition-all duration-300"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
                  }}
                >
                  {/* Notification Bell */}
                  <button
                    onClick={onNotificationClick}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-[0.94] cursor-pointer text-white hover:bg-white/10"
                    aria-label="Open notifications"
                  >
                    <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
                    {notificationCount != null && notificationCount > 0 && (
                      <span className="absolute top-0 right-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#f43f5e] text-[8.5px] font-bold text-white px-0.5 leading-none shadow-sm">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    onClick={onCartClick}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-[0.94] cursor-pointer text-white hover:bg-white/10"
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2} />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#f43f5e] text-[8.5px] font-bold text-white px-0.5 leading-none shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <div
                  className="flex shrink-0 items-center gap-1 rounded-full h-10 p-1 transition-all duration-300"
                  style={isDarkHeader ? {
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(32px)',
                    boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.2)',
                  } : {
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(32px)',
                    boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.7), 0 8px 24px -6px rgba(15, 23, 42, 0.1)',
                  }}
                >
                  {/* Notification Bell */}
                  <button
                    onClick={onNotificationClick}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-[0.94] cursor-pointer ${
                      isDarkHeader
                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                        : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'
                    }`}
                    aria-label="Open notifications"
                  >
                    <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
                    {notificationCount != null && notificationCount > 0 && (
                      <span className="absolute top-0 right-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#f43f5e] text-[8.5px] font-bold text-white px-0.5 leading-none shadow-sm">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    onClick={onCartClick}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-[0.94] cursor-pointer ${
                      isDarkHeader
                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                        : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'
                    }`}
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2} />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#f43f5e] text-[8.5px] font-bold text-white px-0.5 leading-none shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={onLoginClick}
                className="relative flex items-center justify-center h-10 px-4 text-white rounded-full shadow-[0_2px_8px_rgba(23,117,100,0.2)] transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer"
                style={BRAND_GRADIENT_STYLE}
              >
                <span className="relative z-[1] text-[12px] font-semibold tracking-[-0.2px] leading-none whitespace-nowrap">
                  Log in
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none"
                />
              </button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* DESKTOP header (lg+) — full nav bar                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-[80px] px-8 max-w-[1280px] mx-auto py-3.5 gap-4">
          {/* Left Column — Logo or Back Button */}
          <div className="flex justify-start items-center">
            {onBackClick ? (
              <button
                onClick={onBackClick}
                className="flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-95"
                style={isDarkHeader ? {
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  color: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.2)',
                } : {
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  color: '#5f6f86',
                  backdropFilter: 'blur(32px)',
                  boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.7), 0 8px 24px -6px rgba(15, 23, 42, 0.1)',
                }}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
              </button>
            ) : (
              <div
                className="flex items-center rounded-full h-12 pl-3.5 pr-4.5 transition-all duration-300"
                style={isDarkHeader ? {
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.2)',
                } : {
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.7), 0 8px 24px -6px rgba(15, 23, 42, 0.1)',
                }}
              >
                <button
                  onClick={handleLogoClick}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <img
                    src={imgLogo}
                    alt="PlanOut"
                    className="w-[26px] h-[26px] object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <span
                    className={`text-[16px] font-bold tracking-tight leading-none transition-colors ${
                      isDarkHeader ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    PlanOut
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Center Column — Nav Links */}
          <div className="flex justify-center items-center">
            <nav
              className="flex items-center gap-1 rounded-full h-12 p-1 transition-all duration-300"
              style={isDarkHeader ? {
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(32px)',
                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.2)',
              } : {
                border: '1px solid rgba(15, 23, 42, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(32px)',
                boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.7), 0 8px 24px -6px rgba(15, 23, 42, 0.1)',
              }}
            >
              {/* Home */}
              <button
                onClick={handleLogoClick}
                className={`flex items-center justify-center h-10 px-4.5 rounded-full text-[14px] font-semibold tracking-[-0.2px] leading-none transition-all duration-300 cursor-pointer ${
                  isDarkHeader
                    ? activeNav === 'home'
                      ? 'bg-white/16 text-white shadow-sm'
                      : 'text-white/72 hover:bg-white/10 hover:text-white'
                    : activeNav === 'home'
                      ? 'bg-white text-[#177564] shadow-[0_2px_6px_rgba(15,23,42,0.04)] border border-slate-200/10'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                Home
              </button>

              {/* Events */}
              <button
                onClick={onEventsClick || handleLogoClick}
                className={`flex items-center justify-center h-10 px-4.5 rounded-full text-[14px] font-semibold tracking-[-0.2px] leading-none transition-all duration-300 cursor-pointer ${
                  isDarkHeader
                    ? activeNav === 'events'
                      ? 'bg-white/16 text-white shadow-sm'
                      : 'text-white/72 hover:bg-white/10 hover:text-white'
                    : activeNav === 'events'
                      ? 'bg-white text-[#177564] shadow-[0_2px_6px_rgba(15,23,42,0.04)] border border-slate-200/10'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                Events
              </button>

              {/* Orders — only for authenticated users */}
              {isAuthenticated && (
                <button
                  onClick={onTicketsClick}
                  className={`flex items-center justify-center h-10 px-4.5 rounded-full text-[14px] font-semibold tracking-[-0.2px] leading-none transition-all duration-300 relative cursor-pointer ${
                    isDarkHeader
                      ? activePage === 'orders'
                        ? 'bg-white/16 text-white shadow-sm'
                        : 'text-white/72 hover:bg-white/10 hover:text-white'
                      : activePage === 'orders'
                        ? 'bg-white text-[#177564] shadow-[0_2px_6px_rgba(15,23,42,0.04)] border border-slate-200/10'
                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                  }`}
                >
                  <span>Orders</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Column — Actions Capsule */}
          <div className="flex justify-end items-center">
            {isAuthenticated ? (
              <div
                className="flex items-center gap-1.5 rounded-full h-12 p-1 transition-all duration-300"
                style={isDarkHeader ? {
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.2)',
                } : {
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(32px)',
                  boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.7), 0 8px 24px -6px rgba(15, 23, 42, 0.1)',
                }}
              >
                {/* Cart icon */}
                <button
                  onClick={onCartClick}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
                    isDarkHeader
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'
                  }`}
                  aria-label="Open cart"
                >
                  <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2} />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f43f5e] text-[9px] font-bold text-white px-1 leading-none shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Notification bell */}
                <button
                  onClick={onNotificationClick}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
                    isDarkHeader
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'
                  }`}
                  aria-label="Open notifications"
                >
                  <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
                  {notificationCount != null && notificationCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f43f5e] text-[9px] font-bold text-white px-1 leading-none shadow-sm">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* User avatar */}
                <div className="pl-0.5 pr-0.5">
                  <UserMenuDropdown
                     avatarSrc={imgAvatar}
                     onProfileClick={onProfileClick}
                     onPassportClick={onPassportClick}
                     onInboxClick={onInboxClick}
                     onSettingsClick={onSettingsClick}
                     onSignOut={onSignOut}
                     userName={userName}
                     userEmail={userEmail}
                     userAvatarUrl={userAvatarUrl}
                     onCreateOrganization={onCreateOrganization}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="relative flex items-center justify-center h-12 px-5 text-white rounded-full shadow-[0_2px_8px_rgba(23,117,100,0.2)] transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer"
                style={BRAND_GRADIENT_STYLE}
              >
                <span className="relative z-[1] text-[13.5px] font-semibold tracking-[-0.2px] leading-none whitespace-nowrap">
                  Login or Register
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
