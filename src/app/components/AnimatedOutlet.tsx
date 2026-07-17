/**
 * @file AnimatedOutlet.tsx
 * @description iOS 26-style page transition wrapper for React Router's Outlet.
 *
 * Detects navigation direction (push / pop / tab-switch) from:
 *   1. React Router's `useNavigationType()` (POP → back)
 *   2. Comparing route depth (segment count) to the previous route
 *
 * Transition variants:
 *  - **Push** — page fades up from below (entering a deeper screen)
 *  - **Pop**  — page fades in with a subtle scale (returning)
 *  - **Tab**  — soft cross-fade rising from the bottom
 *
 * Only enter animations are used (no exit). The old page unmounts instantly
 * and the new page covers it — matching how iOS stacks view controllers.
 */

import React, { useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router';
import { motion } from 'motion/react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return a numeric "depth" for a pathname based on its segment count. */
function getDepth(pathname: string): number {
  return pathname.split('/').filter(Boolean).length;
}

/** Bottom-nav tab routes — lateral siblings, not a push/pop hierarchy. */
const TAB_ROOTS = new Set(['/', '/events', '/orders', '/settings']);

function isTabRoot(pathname: string): boolean {
  return TAB_ROOTS.has(pathname);
}

// ---------------------------------------------------------------------------
// Direction-specific animation presets
// All transforms use transformOrigin: 'top center' on the motion.div
// so scale/y never create a gap above the content.
// ---------------------------------------------------------------------------

const VARIANTS = {
  push: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  pop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  tab: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
} as const;

/** Quick fade transition. */
const TWEEN = {
  type: 'tween' as const,
  duration: 0.2,
  ease: 'easeOut' as const,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnimatedOutlet() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevDepthRef = useRef(getDepth(location.pathname));
  const prevPathnameRef = useRef(location.pathname);
  const isFirstRender = useRef(true);

  // Compute direction from nav type + depth delta
  const depth = getDepth(location.pathname);
  const prevDepth = prevDepthRef.current;
  const prevPathname = prevPathnameRef.current;

  let direction: 'push' | 'pop' | 'tab';

  // Switching between bottom-nav tabs is always a lateral "tab" transition
  if (isTabRoot(location.pathname) && isTabRoot(prevPathname)) {
    direction = 'tab';
  } else if (navigationType === 'POP') {
    direction = 'pop';
  } else if (depth > prevDepth) {
    direction = 'push';
  } else if (depth < prevDepth) {
    direction = 'pop';
  } else {
    direction = 'tab';
  }

  // Update refs after direction is computed
  useEffect(() => {
    prevDepthRef.current = depth;
    prevPathnameRef.current = location.pathname;
  }, [depth, location.pathname]);

  // Track first render so we can skip the enter animation on initial load
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const variant = VARIANTS[direction];

  return (
    <motion.div
      key={location.pathname}
      initial={isFirstRender.current ? false : variant.initial}
      animate={variant.animate}
      transition={TWEEN}
    >
      <Outlet />
    </motion.div>
  );
}
