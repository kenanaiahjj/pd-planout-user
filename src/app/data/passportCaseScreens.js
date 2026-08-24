/**
 * Every app screen the Passport cases page documents, as a still screenshot.
 *
 * The cases page is a documentation surface, not a playground: each step shows a
 * captured screen state rather than an embedded, interactable app. This module
 * is the single source of truth for that set, imported by both the page and
 * scratch/capture_purchase_intent_screens.mjs so the two cannot drift.
 *
 * `route` is the real app URL the screenshot was taken at. `scrollToText`
 * captures a section further down the same route. `viewport` overrides the
 * default phone frame for surfaces that only exist at desktop widths.
 */
export const CASE_SCREEN_BASE = '/passport-cases/screens';

export const CASE_SCREENS = [
  // ── Passport ──
  { id: 'passport', route: '/passport' },
  { id: 'passport-add-pass', route: '/passport', scrollToText: 'Add a past event' },
  { id: 'passport-events', route: '/passport/events' },
  { id: 'passport-events-status', route: '/passport/events', scrollToText: 'Status updates' },
  { id: 'passport-events-past', route: '/passport/events', scrollToText: 'Past events' },

  // ── Add a Guest QR to Passport ──
  { id: 'add-entry-scanner', route: '/passport/add-entry' },
  { id: 'add-entry-past', route: '/passport/add-entry?code=GE-USED-4218' },
  { id: 'add-entry-added', route: '/passport/add-entry?code=GE-TEMP-4021&demoState=added' },
  { id: 'add-entry-revoked', route: '/passport/add-entry?code=GE-REVOKED-4218' },
  { id: 'add-entry-desktop', route: '/passport/add-entry', viewport: { width: 860, height: 1180 }, wide: true },

  // ── Orders ──
  { id: 'orders', route: '/orders' },
  { id: 'order-team-preview', route: '/orders/tkt-002' },
  { id: 'order-single', route: '/orders/tkt-003' },
  { id: 'order-multi', route: '/orders/tkt-009' },
  { id: 'order-mixed-ready', route: '/orders/tkt-011' },
  { id: 'order-mixed-setup', route: '/orders/tkt-012' },
  { id: 'order-team', route: '/orders/tkt-013' },
  { id: 'order-team-full', route: '/orders/tkt-014' },

  // ── Guest QR, buyer side ──
  { id: 'guest-manager', route: '/orders/tkt-008/guest-manager' },
  { id: 'guest-manager-mixed', route: '/orders/tkt-011/guest-manager' },
  { id: 'guest-qr-pass', route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr' },
  { id: 'guest-qr-revoked', route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=revoked' },
  { id: 'group-share', route: '/order-share/tkt-011' },

  // ── Guest QR, recipient side ──
  { id: 'public-pass-active', route: '/guest-entry/GE-CANLAON-42K' },
  { id: 'public-pass-used', route: '/guest-entry/GE-USED-4218' },
  { id: 'public-pass-revoked', route: '/guest-entry/GE-REVOKED-4218' },
  { id: 'public-pass-onbehalf', route: '/guest-entry/GE-TEMP-4021' },

  // ── Participant forms ──
  { id: 'form-individual', route: '/orders/tkt-003/form?returnTo=orders' },
  // The form route now needs an explicit participantId: without one it
  // redirects to the order rather than opening a slot picker.
  { id: 'form-group', route: '/orders/tkt-012/form?participantId=p3' },
  // /ticket-claim is a redirector by design: it resolves the order and entry
  // and hands off to the standard form in invite mode.
  { id: 'form-invite', route: '/ticket-claim/CLM-CANLAON-42K?order=tkt-011&entry=tkt-011-p2', expectRedirect: true },
  { id: 'form-player-pending', route: '/orders/tkt-013/form?returnTo=order&participantId=p7&playerOnly=1' },
  { id: 'form-player-done', route: '/orders/tkt-013/form?returnTo=order&participantId=p1&playerOnly=1' },
  { id: 'form-player-invited', route: '/orders/tkt-013/form?returnTo=order&participantId=p5&playerOnly=1' },
  { id: 'form-diff', route: '/forms/tkt-011-p1/diff' },
  { id: 'form-diff-resubmit', route: '/forms/resubmit-aquathlon/diff' },

  // ── Payment ledger ──
  { id: 'txn-paid', route: '/settings/transactions/AAA-QZCJU2' },
  { id: 'txn-pending', route: '/settings/transactions/AAA-L4DJYC' },
  { id: 'txn-expired', route: '/settings/transactions/AAA-T8KZMW' },

  // ── Entry points ──
  { id: 'cart', route: '/cart' },
  { id: 'login', route: '/login' },
  { id: 'notifications', route: '/notifications' },
  { id: 'event-page', route: '/events/1' },
];

const BY_ROUTE = new Map();
for (const screen of CASE_SCREENS) {
  // A scrolled variant is addressed as "route#Section heading"; the bare route
  // keeps the unscrolled screenshot, so first entry wins there.
  if (screen.scrollToText) {
    BY_ROUTE.set(`${screen.route}#${screen.scrollToText}`, screen);
  } else if (!BY_ROUTE.has(screen.route)) {
    BY_ROUTE.set(screen.route, screen);
  }
}

const BY_ID = new Map(CASE_SCREENS.map((screen) => [screen.id, screen]));

/** Screen for a route, or null when nothing has been captured for it. */
export function screenForRoute(route) {
  return BY_ROUTE.get(route) || null;
}

export function screenById(id) {
  return BY_ID.get(id) || null;
}

export function screenSrc(id) {
  return `${CASE_SCREEN_BASE}/${id}.png`;
}
