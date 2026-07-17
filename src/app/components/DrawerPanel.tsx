/**
 * @file DrawerPanel.tsx
 * @description Reusable right-side slide-in drawer panel for desktop.
 *
 * Provides a backdrop overlay, spring-animated slide transition, body scroll
 * lock, and Escape-to-close. Content is rendered inside a scrollable area.
 * Used by App.tsx to present Cart and Notifications as drawers on lg+ screens.
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DrawerPanelProps {
  /** Drawer content. */
  children: React.ReactNode;
  /** Called when the user clicks the backdrop or presses Escape. */
  onClose: () => void;
  /** Max width of the drawer panel. Defaults to 480px. */
  maxWidth?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DrawerPanel({
  children,
  onClose,
  maxWidth = '480px',
}: DrawerPanelProps) {
  // Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-full bg-[#f8fafc] flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.12)]"
        style={{ maxWidth }}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}