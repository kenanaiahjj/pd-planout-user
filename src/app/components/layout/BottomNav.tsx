/**
 * @file BottomNav.tsx
 * @description Mobile-only floating glass tab bar with 5 tabs:
 * Home, Events, Passport, Orders, and Settings.
 *
 * Shrinks on scroll down, restores on scroll up or scroll stop.
 * Features label-less active indicators (tiny bottom dots) and high-end glassmorphism.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Home, Calendar, IdCard, ShoppingBag } from 'lucide-react';
import imgAvatar from '@/assets/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png';

// Radial shine overlay (simulates overhead spotlight reflection on curved glass)
const PASSPORT_SHINE_SVG = `url('data:image/svg+xml;utf8,<svg viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="url(%23specular)" opacity="0.65"/><rect x="0" y="0" width="100%" height="100%" fill="url(%23bounce)" opacity="0.25"/><defs><radialGradient id="specular" cx="30%" cy="20%" r="40%"><stop stop-color="white" offset="0%"/><stop stop-color="rgba(255,255,255,0)" offset="100%"/></radialGradient><radialGradient id="bounce" cx="70%" cy="80%" r="40%"><stop stop-color="white" offset="0%"/><stop stop-color="rgba(255,255,255,0)" offset="100%"/></radialGradient></defs></svg>')`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NavTab = 'home' | 'events' | 'passport' | 'orders' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingPassportCount?: number;
  isAuthenticated?: boolean;
  ticketActionCount?: number;
  userAvatarUrl?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BottomNav({
  activeTab,
  onTabChange,
  isAuthenticated = true,
  ticketActionCount = 0,
  userAvatarUrl,
}: BottomNavProps) {
  const activeColor = '#177564';
  const inactiveColor = '#5f6f86';

  const [isShrunk, setIsShrunk] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        // Scrolling down -> Shrink
        setIsShrunk(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> Restore
        setIsShrunk(false);
      }

      lastScrollY = currentScrollY;

      // Restore to normal when scroll stops
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsShrunk(false);
      }, 1000); // Wait 1 second of inactivity before restoring
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-4 right-4 z-50 sm:hidden max-w-[420px] mx-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isShrunk
          ? 'scale-[0.9] translate-y-2 hover:scale-100 hover:translate-y-0'
          : 'scale-100 translate-y-0'
      }`}
    >
      <style>{`
        @keyframes mesh-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes mesh-blob-1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(12px, -8px) scale(1.15); }
          66% { transform: translate(-8px, 10px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes mesh-blob-2 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-12px, 8px) scale(0.85); }
          66% { transform: translate(8px, -6px) scale(1.2); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes mesh-blob-3 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-8px, 8px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-mesh-rotate {
          animation: mesh-rotate 16s infinite linear;
          transform-origin: center center;
        }
        .animate-mesh-blob-1 {
          animation: mesh-blob-1 8s infinite ease-in-out;
        }
        .animate-mesh-blob-2 {
          animation: mesh-blob-2 9s infinite ease-in-out;
        }
        .animate-mesh-blob-3 {
          animation: mesh-blob-3 7s infinite ease-in-out;
        }
      `}</style>
      {/* Floating Glassmorphism Tab Bar */}
      <div className="backdrop-blur-[24px] bg-white/72 border border-slate-200/50 rounded-full shadow-[0_12px_40px_rgba(15,23,42,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.7)] h-[56px] px-2 flex items-center justify-around relative">

        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className="relative flex h-full flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 cursor-pointer"
          aria-label="Home"
        >
          <div className="transition-transform hover:scale-105">
            <Home
              className="h-[22px] w-[22px]"
              color={activeTab === 'home' ? activeColor : inactiveColor}
              strokeWidth={2}
            />
          </div>
          {activeTab === 'home' && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#177564]" />
          )}
        </button>

        {/* Events */}
        <button
          onClick={() => onTabChange('events')}
          className="relative flex h-full flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 cursor-pointer"
          aria-label="Events"
        >
          <div className="transition-transform hover:scale-105">
            <Calendar
              className="h-[22px] w-[22px]"
              color={activeTab === 'events' ? activeColor : inactiveColor}
              strokeWidth={2}
            />
          </div>
          {activeTab === 'events' && (
            <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#177564]" />
          )}
        </button>

        {/* Passport - Prominent Floating Center Action */}
        <button
          onClick={() => onTabChange('passport')}
          className="relative -mt-6 flex h-full items-center justify-center flex-1 transition-transform active:scale-[0.94]"
          aria-label="Open Passport"
        >
          <div
            className={`relative flex h-[54px] w-[54px] items-center justify-center rounded-[18px] border border-white/45 text-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${
              activeTab === 'passport'
                ? 'translate-y-[-4px] scale-105 shadow-[0_16px_36px_rgba(23,117,100,0.6),0_0_24px_rgba(34,211,238,0.4),inset_0_2.5px_4px_rgba(255,255,255,0.75)] brightness-110'
                : 'shadow-[0_10px_24px_rgba(23,117,100,0.45),0_0_16px_rgba(34,211,238,0.25),inset_0_2px_3.5px_rgba(255,255,255,0.55)] hover:scale-105 hover:shadow-[0_12px_28px_rgba(23,117,100,0.5),0_0_20px_rgba(34,211,238,0.35)]'
            }`}
            style={{
              backgroundImage: 'linear-gradient(135deg, #3cd4b9 0%, #177564 100%)',
            }}
          >
            {/* Animated Mesh Gradient Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-90 animate-mesh-rotate">
              <div 
                className="absolute w-[52px] h-[52px] rounded-full bg-[#115e59] mix-blend-multiply filter blur-[12px] animate-mesh-blob-1"
                style={{
                  top: '-15%',
                  left: '-15%',
                }}
              />
              <div 
                className="absolute w-[46px] h-[46px] rounded-full bg-[#3cd4b9] mix-blend-screen filter blur-[10px] animate-mesh-blob-2"
                style={{
                  bottom: '-15%',
                  right: '-15%',
                }}
              />
              <div 
                className="absolute w-[42px] h-[42px] rounded-full bg-[#177564] mix-blend-screen filter blur-[10px] animate-mesh-blob-3"
                style={{
                  top: '15%',
                  right: '5%',
                }}
              />
            </div>
            {/* Spotlight overlay shine */}
            <div 
              className="absolute inset-0 z-[1] pointer-events-none opacity-85 mix-blend-overlay"
              style={{ backgroundImage: PASSPORT_SHINE_SVG }}
            />
            {/* Gloss Highlight Overlay */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-tr from-transparent via-white/15 to-white/35 mix-blend-overlay" />
            <IdCard className="relative h-[25px] w-[25px] z-[2] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]" strokeWidth={2.2} />
            <span className="absolute inset-0 rounded-[inherit] border border-white/30 shadow-[inset_0_2px_3px_rgba(255,255,255,0.55)] z-[1] pointer-events-none" />
          </div>
        </button>

        {/* Orders */}
        {isAuthenticated && (
          <button
            onClick={() => onTabChange('orders')}
            className="relative flex h-full flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 cursor-pointer"
            aria-label="Orders"
          >
            <div className="h-[22px] w-[22px] relative transition-transform hover:scale-105">
              <ShoppingBag
                className="h-full w-full"
                color={activeTab === 'orders' ? activeColor : inactiveColor}
                strokeWidth={2}
              />
              {ticketActionCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#f43f5e] text-[8.5px] font-bold text-white px-[3px] leading-none shadow-sm">
                  {ticketActionCount}
                </span>
              )}
            </div>
            {activeTab === 'orders' && (
              <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#177564]" />
            )}
          </button>
        )}

        {/* Settings */}
        {isAuthenticated && (
          <button
            onClick={() => onTabChange('settings')}
            className="relative flex h-full flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 cursor-pointer"
            aria-label="Settings"
          >
            <div className="transition-transform hover:scale-105">
              <div
                className={`w-[24px] h-[24px] rounded-full overflow-hidden border transition-all duration-300 ${
                  activeTab === 'settings'
                    ? 'border-[#177564] ring-2 ring-[#177564]/20 shadow-[0_0_8px_rgba(23,117,100,0.25)]'
                    : 'border-slate-300'
                }`}
              >
                <img
                  src={userAvatarUrl || imgAvatar}
                  alt="Settings"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {activeTab === 'settings' && (
              <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#177564]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
