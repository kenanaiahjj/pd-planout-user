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

const PASSPORT_SHINE_SVG = `url('data:image/svg+xml;utf8,<svg viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="url(%23specular)" opacity="0.65"/><rect x="0" y="0" width="100%" height="100%" fill="url(%23bounce)" opacity="0.25"/><defs><radialGradient id="specular" cx="30%" cy="20%" r="40%"><stop stop-color="white" offset="0%"/><stop stop-color="rgba(255,255,255,0)" offset="100%"/></radialGradient><radialGradient id="bounce" cx="70%" cy="80%" r="40%"><stop stop-color="white" offset="0%"/><stop stop-color="rgba(255,255,255,0)" offset="100%"/></radialGradient></defs></svg>')`;
const PASSPORT_MESH_BACKGROUND = [
  'radial-gradient(circle at 25% 20%, rgba(221, 255, 247, 0.72) 0%, rgba(115, 237, 213, 0.48) 16%, rgba(23, 117, 100, 0) 43%)',
  'radial-gradient(circle at 83% 76%, rgba(71, 219, 187, 0.78) 0%, rgba(23, 117, 100, 0) 48%)',
  'radial-gradient(circle at 78% 16%, rgba(5, 91, 84, 0.88) 0%, rgba(23, 117, 100, 0) 44%)',
  'linear-gradient(145deg, #0b7067 0%, #138c7b 46%, #075f56 100%)',
].join(', ');

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
      className={`fixed-bottom-ios fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-[420px] transition-transform duration-200 ease-out motion-reduce:transition-none md:hidden ${
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
        .animate-mesh-rotate { animation: mesh-rotate 16s infinite linear; transform-origin: center center; }
        .animate-mesh-blob-1 { animation: mesh-blob-1 8s infinite ease-in-out; }
        .animate-mesh-blob-2 { animation: mesh-blob-2 9s infinite ease-in-out; }
        .animate-mesh-blob-3 { animation: mesh-blob-3 7s infinite ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .animate-mesh-rotate, .animate-mesh-blob-1, .animate-mesh-blob-2, .animate-mesh-blob-3 { animation: none; }
        }
      `}</style>
      <div className="relative flex h-14 items-center justify-around rounded-full border border-slate-200/70 bg-white/86 px-2 backdrop-blur-[18px] shadow-[0_8px_10px_-8px_rgba(15,23,42,0.32)]">

        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center py-1 transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 focus-visible:ring-offset-2"
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
          className="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center py-1 transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 focus-visible:ring-offset-2"
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
          className="relative -mt-6 flex h-full flex-1 items-center justify-center transition-transform active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 focus-visible:ring-offset-2"
          aria-label="Open Passport"
        >
          <div
            className={`relative flex h-[54px] w-[54px] items-center justify-center text-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              activeTab === 'passport'
                ? 'translate-y-[-5px] scale-[1.02] drop-shadow-[0_18px_28px_rgba(9,99,88,0.38)]'
                : 'drop-shadow-[0_12px_18px_rgba(9,99,88,0.3)] hover:scale-[1.02]'
            }`}
            data-testid="passport-nav-tile-shell"
          >
            <span className="pointer-events-none absolute -inset-3 z-0 rounded-full bg-[radial-gradient(circle,rgba(92,239,216,0.7)_0%,rgba(92,239,216,0.22)_38%,transparent_72%)] blur-[8px]" />
            <span
              className="relative flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-[18px] border border-white/50"
              style={{ backgroundImage: PASSPORT_MESH_BACKGROUND }}
              data-testid="passport-nav-tile"
            >
              <span className="pointer-events-none absolute inset-0 z-0 animate-mesh-rotate opacity-90">
                <span className="absolute -left-[15%] -top-[15%] h-[52px] w-[52px] rounded-full bg-[#0b5d58] mix-blend-multiply blur-[12px] animate-mesh-blob-1" />
                <span className="absolute -bottom-[15%] -right-[15%] h-[46px] w-[46px] rounded-full bg-[#5debd1] mix-blend-screen blur-[10px] animate-mesh-blob-2" />
                <span className="absolute right-[5%] top-[15%] h-[42px] w-[42px] rounded-full bg-[#1ba58f] mix-blend-screen blur-[10px] animate-mesh-blob-3" />
              </span>
              <span className="pointer-events-none absolute inset-0 z-[1] opacity-75 mix-blend-overlay" style={{ backgroundImage: PASSPORT_SHINE_SVG }} />
              <span className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-transparent via-white/15 to-white/35 mix-blend-overlay" />
              <IdCard className="relative z-[2] h-[25px] w-[25px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]" strokeWidth={2.1} />
              <span className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] border border-white/30 shadow-[inset_0_2px_5px_rgba(255,255,255,0.55)]" />
            </span>
          </div>
        </button>

        {/* Orders */}
        {isAuthenticated && (
          <button
            onClick={() => onTabChange('orders')}
            className="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center py-1 transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 focus-visible:ring-offset-2"
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
            className="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center py-1 transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 focus-visible:ring-offset-2"
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
