/**
 * @file BottomNav.tsx
 * @description Mobile-only floating icon tab bar.
 *
 * Shrinks on scroll down, restores on scroll up or scroll stop.
 * Features an Instagram-style neutral icon rail with a Passport center action.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Home, Calendar, IdCard, ShoppingBag, User } from 'lucide-react';
import imgAvatar from '@/assets/abde7b942aa982263d4cf69ea8ef217b427c3047.png';

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
  pendingPassportCount = 0,
  isAuthenticated = true,
  ticketActionCount = 0,
  userAvatarUrl,
}: BottomNavProps) {
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
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const getTabIcon = (tab: NavTab, isActive: boolean) => {
    const color = isActive ? '#111827' : '#8b95a5';
    const strokeWidth = isActive ? 2.55 : 2.15;

    switch (tab) {
      case 'home':
        return (
          <Home
            className="h-[21px] w-[21px]"
            color={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
      case 'events':
        return (
          <Calendar
            className="h-[21px] w-[21px]"
            color={color}
            strokeWidth={strokeWidth}
          />
        );
      case 'orders':
        return (
          <ShoppingBag
            className="h-[21px] w-[21px]"
            color={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
      default:
        return null;
    }
  };

  const renderTab = (tab: NavTab, icon: React.ReactNode, count?: number) => {
    const isActive = activeTab === tab;
    return (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className="relative flex h-[46px] min-w-0 flex-1 items-center justify-center rounded-[18px] text-[#8b95a5] transition-all duration-200 ease-out active:scale-[0.94]"
        aria-label={tab === 'passport' ? 'Open Passport' : tab.charAt(0).toUpperCase() + tab.slice(1)}
      >
        <div className={`relative flex h-[42px] items-center justify-center rounded-full transition-all duration-200 ${
          isActive
            ? 'min-w-[64px] bg-[#f1f2f4] px-5 text-[#111827] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]'
            : 'min-w-[40px] px-2.5 text-[#8b95a5] hover:bg-slate-100/70'
        }`}>
          {icon}
          {count !== undefined && count > 0 && (
            <span className="absolute -top-1.5 -right-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#f43f5e] px-1 text-[9px] font-bold leading-none text-white shadow-[0_4px_10px_-6px_rgba(244,63,94,0.85)]">
              {count}
            </span>
          )}
        </div>
      </button>
    );
  };

  const renderPassportOrb = () => {
    const isActive = activeTab === 'passport';
    return (
      <button
        onClick={() => onTabChange('passport')}
        className="relative flex h-[46px] min-w-0 flex-1 items-center justify-center transition-transform active:scale-[0.94] cursor-pointer"
        aria-label="Open Passport"
      >
        <div
          className={`absolute left-1/2 top-[-20px] flex h-[56px] w-[56px] -translate-x-1/2 items-center justify-center rounded-full border border-white/55 text-white transition-all duration-200 ease-out ${
            isActive
              ? 'scale-105 shadow-[0_14px_26px_-12px_rgba(17,24,39,0.45),inset_0_2px_3px_rgba(255,255,255,0.44)] brightness-105'
              : 'shadow-[0_12px_22px_-13px_rgba(17,24,39,0.34),inset_0_2px_3px_rgba(255,255,255,0.32)] hover:scale-105'
          }`}
          style={{
            backgroundImage: `linear-gradient(135deg, #3cd4b9 0%, #177564 100%)`,
          }}
        >
          <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none z-[1] opacity-70">
            <div className="absolute w-[150%] h-[150%] -left-[25%] -top-[25%] bg-[radial-gradient(circle_at_center,rgba(251,254,112,0.35)_0%,transparent_60%)] animate-subtle-glow" />
          </div>

          <IdCard className="relative h-[25px] w-[25px] z-[2]" strokeWidth={2} />
          <span className="absolute inset-0 rounded-[inherit] border border-white/25 shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.45)] z-[1] pointer-events-none" />
        </div>
      </button>
    );
  };

  const renderProfileTab = () => {
    const isActive = activeTab === 'settings';
    return (
      <button
        onClick={() => onTabChange('settings')}
        className="relative flex h-[46px] min-w-0 flex-1 items-center justify-center rounded-[18px] transition-all duration-200 ease-out cursor-pointer select-none active:scale-[0.94]"
        aria-label="Settings"
      >
        <div className={`relative flex h-[38px] min-w-[40px] items-center justify-center rounded-full px-1 transition-all duration-200 ${
          isActive ? 'scale-105' : 'hover:bg-slate-100/70'
        }`}>
          <div className={`relative flex items-center justify-center shrink-0 w-[26px] h-[26px] rounded-full transition-all duration-200 ${
          isActive
            ? 'bg-white border-2 border-[#111827] shadow-sm'
            : 'bg-slate-100 border border-slate-200/50'
        }`}>
            <img
              src={userAvatarUrl || imgAvatar}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`fixed bottom-[calc(14px+env(safe-area-inset-bottom,0px))] left-3 right-3 z-50 sm:hidden max-w-[420px] mx-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isShrunk
          ? 'scale-[0.9] translate-y-2 hover:scale-100 hover:translate-y-0'
          : 'scale-100 translate-y-0'
      }`}
    >
      <style>{`
        @keyframes subtle-glow {
          0% { transform: translate(-10%, -10%) scale(0.9); opacity: 0.5; }
          50% { transform: translate(10%, 10%) scale(1.1); opacity: 0.85; }
          100% { transform: translate(-10%, -10%) scale(0.9); opacity: 0.5; }
        }
        .animate-subtle-glow {
          animation: subtle-glow 8s ease-in-out infinite;
        }
      `}</style>
      {/* Floating icon tab bar */}
      <div className="relative flex h-[58px] items-center justify-between rounded-[29px] border border-slate-200/75 bg-white/[0.94] px-2.5 py-1.5 shadow-[0_18px_42px_-25px_rgba(15,23,42,0.45),0_10px_22px_-20px_rgba(15,23,42,0.34)] backdrop-blur-[22px]">
        {renderTab('home', getTabIcon('home', activeTab === 'home'))}
        {renderTab('events', getTabIcon('events', activeTab === 'events'))}
        {renderPassportOrb()}
        {isAuthenticated && renderTab('orders', getTabIcon('orders', activeTab === 'orders'), activeTab === 'orders' ? undefined : ticketActionCount)}
        {isAuthenticated && renderProfileTab()}
      </div>
    </div>
  );
}
