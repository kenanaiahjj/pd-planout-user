# Meta Messenger Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable Meta Messenger-style floating button and local-only popover conversation to most authenticated PlanOut prototype screens.

**Architecture:** Create one self-contained `MessengerWidget` with local open state and ephemeral canned-reply state. Mount it once in `RootLayout` when the authenticated app shell is active; keep it below full-screen drawers and above the mobile bottom navigation. Use existing React, Tailwind, `lucide-react`, and `motion/react` dependencies only.

**Tech Stack:** React 18, TypeScript/TSX, React Router layout, Tailwind CSS v4 utilities, `lucide-react`, `motion/react`, Node built-in test runner, Vite.

## Global Constraints

- No real Messenger integration, Meta SDK, network call, external logo asset, or navigation away from the current route.
- Hide the widget on `/passport/add-entry` while the full-screen QR scanner is active; render it on authenticated app-shell routes including cart, checkout, and settings.
- Keep full-screen drawers in front: `DrawerPanel` uses `z-[70]`; the widget must use a lower stacking level.
- Preserve all unrelated dirty-worktree changes. Stage only the widget, its layout mount, its source-level test, and this plan/spec when committing.
- Use safe-area-aware mobile offsets and keep the widget keyboard accessible with explicit labels and Escape support.

---

## File Map

- Create: `src/app/components/MessengerWidget.tsx` — floating trigger, popover, canned replies, responsive positioning, and keyboard dismissal.
- Modify: `src/app/components/FloatCard.tsx:25-35, 41` — export the existing route-hide predicate so the shared layout can derive whether the pending form card is actually visible.
- Modify: `src/app/layouts/RootLayout.tsx:19-20, 113-124, 291-313` — import the widget/helper, derive the shared pending-card visibility flag, and mount the widget once in the shared authenticated shell.
- Create: `tests/messenger-widget.test.mjs` — source-level contract tests for the new component and its RootLayout integration, matching the repository's existing Node test style.
- Create: `docs/superpowers/specs/2026-08-10-messenger-widget-design.md` — approved feature design, already committed.

## Task 1: Define the widget contract with failing source tests

**Files:**
- Create: `tests/messenger-widget.test.mjs`
- Test target: `src/app/components/MessengerWidget.tsx` and `src/app/layouts/RootLayout.tsx`

**Interfaces:**
- The component must export `MessengerWidget` and accept `{ hasPendingFormCard?: boolean }`.
- The layout must render `<MessengerWidget` with `isAuthenticated && !useFullScreenOverlay` as the visibility guard and pass the route-aware `showPendingFormCard` flag.

- [ ] **Step 1: Write the failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const widgetSource = fs.readFileSync(
  new URL('../src/app/components/MessengerWidget.tsx', import.meta.url),
  'utf8',
);
const layoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);
const floatCardSource = fs.readFileSync(
  new URL('../src/app/components/FloatCard.tsx', import.meta.url),
  'utf8',
);

test('MessengerWidget exposes the prototype conversation contract', () => {
  assert.match(widgetSource, /export function MessengerWidget/);
  assert.match(widgetSource, /hasPendingFormCard\?: boolean/);
  assert.match(widgetSource, /PlanOut Messenger/);
  assert.match(widgetSource, /Prototype only/);
  assert.match(widgetSource, /role="dialog"/);
  assert.match(widgetSource, /Escape/);
  assert.match(widgetSource, /QUICK_REPLIES/);
});

test('MessengerWidget uses Meta Messenger visual and accessible trigger cues', () => {
  assert.match(widgetSource, /Open Messenger/);
  assert.match(widgetSource, /Close Messenger/);
  assert.match(widgetSource, /#00b2ff|#006aff/);
  assert.match(widgetSource, /aria-expanded/);
  assert.match(widgetSource, /safe-area-inset-bottom/);
  assert.match(widgetSource, /md:bottom-\[152px\]/);
  assert.match(widgetSource, /bottom-\[calc\(220px\+env\(safe-area-inset-bottom\)\)\]/);
});

test('RootLayout mounts MessengerWidget only for the authenticated shell', () => {
  assert.match(layoutSource, /import \{ MessengerWidget \} from '@\/app\/components\/MessengerWidget'/);
  assert.match(layoutSource, /isAuthenticated && !useFullScreenOverlay/);
  assert.match(layoutSource, /const showPendingFormCard/);
  assert.match(layoutSource, /hasPendingFormCard=\{showPendingFormCard\}/);
  assert.match(floatCardSource, /export function shouldHideFloatCardOnRoute/);
});
```

- [ ] **Step 2: Run the focused test and verify it fails because the widget does not exist yet**

Run: `node --test tests/messenger-widget.test.mjs`

Expected: FAIL with an `ENOENT` error for `src/app/components/MessengerWidget.tsx`, before any implementation exists.

## Task 2: Build the reusable MessengerWidget

**Files:**
- Create: `src/app/components/MessengerWidget.tsx`

**Interfaces:**
- Produces `MessengerWidget({ hasPendingFormCard?: boolean }): JSX.Element` for `RootLayout`.
- Quick replies replace the current ephemeral exchange rather than accumulating an unbounded transcript.

- [ ] **Step 1: Add the component with the exact local-only conversation model**

Use the following implementation shape and copy:

```tsx
import React, { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MessageCircle, Send, X, Zap } from 'lucide-react';

interface MessengerWidgetProps {
  hasPendingFormCard?: boolean;
}

interface QuickReply {
  label: string;
  message: string;
  response: string;
}

const QUICK_REPLIES: QuickReply[] = [
  {
    label: 'Find an event',
    message: 'I want to find an event.',
    response: 'Open Events to browse races and activities near you.',
  },
  {
    label: 'Manage my Passport',
    message: 'How do I manage my Passport?',
    response: 'Your Passport keeps the entries and events you can personally access.',
  },
  {
    label: 'Question about my order',
    message: 'I have a question about my order.',
    response: 'Orders keeps the tickets and forms your account bought or manages.',
  },
];

function MessengerMark({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} aria-hidden="true">
      <MessageCircle className="h-full w-full" fill="currentColor" strokeWidth={1.5} />
      <Zap className="absolute h-[44%] w-[44%] fill-current text-white" strokeWidth={2.5} />
    </span>
  );
}

export function MessengerWidget({ hasPendingFormCard = false }: MessengerWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReply, setSelectedReply] = useState<QuickReply | null>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const bottomOffset = hasPendingFormCard
    ? 'bottom-[calc(220px+env(safe-area-inset-bottom))] md:bottom-[152px]'
    : 'bottom-[calc(88px+env(safe-area-inset-bottom))] md:bottom-6';

  return (
    <div className={`fixed right-4 z-[60] sm:right-6 md:right-8 ${bottomOffset}`}>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            key="messenger-panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            className="absolute bottom-[calc(100%+12px)] right-0 flex w-[min(360px,calc(100vw-32px))] max-h-[min(520px,calc(100dvh-180px))] flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.42)]"
          >
            <header className="flex items-center justify-between gap-3 bg-[linear-gradient(135deg,#00b2ff_0%,#006aff_100%)] px-4 py-3.5 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <MessengerMark className="h-9 w-9 shrink-0 text-white" />
                <div className="min-w-0">
                  <h2 id={titleId} className="truncate text-[14px] font-semibold leading-tight">PlanOut Messenger</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b8ffdc]" /> Typically replies instantly
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80" aria-label="Close Messenger">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="scrollbar-none flex-1 space-y-3 overflow-y-auto bg-[#f4f7fb] px-4 py-4">
              <div className="max-w-[84%] rounded-[18px] rounded-tl-md bg-white px-3.5 py-3 text-[13px] leading-[1.45] text-slate-700 shadow-sm">
                Hi! I’m the PlanOut team. How can we help with your registration?
              </div>
              {selectedReply && (
                <React.Fragment key={selectedReply.label}>
                  <div className="ml-auto max-w-[84%] rounded-[18px] rounded-tr-md bg-[#006aff] px-3.5 py-3 text-[13px] leading-[1.45] text-white shadow-sm">
                    {selectedReply.message}
                  </div>
                  <div className="max-w-[84%] rounded-[18px] rounded-tl-md bg-white px-3.5 py-3 text-[13px] leading-[1.45] text-slate-700 shadow-sm">
                    {selectedReply.response}
                  </div>
                </React.Fragment>
              )}
              <div className="pt-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Quick replies</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button key={reply.label} type="button" onClick={() => setSelectedReply(reply)} className="rounded-full border border-[#b7d8ff] bg-white px-3 py-2 text-left text-[11px] font-semibold text-[#006aff] transition-colors hover:bg-[#eaf4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006aff]/45">
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-3.5 pb-3.5 pt-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-400">
                <input type="text" disabled placeholder="Message PlanOut" aria-label="Message PlanOut (prototype only)" className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-slate-400 disabled:cursor-not-allowed" />
                <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
              </div>
              <p className="mt-2 px-1 text-[10px] text-slate-400">Prototype only · Messenger is not connected</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Messenger' : 'Open Messenger'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#00b2ff_0%,#006aff_100%)] text-white shadow-[0_16px_34px_-12px_rgba(0,106,255,0.75)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#006aff]/25 active:scale-95 motion-reduce:transition-none"
      >
        <MessengerMark className="h-8 w-8" />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Run the focused source tests**

Run: `node --test tests/messenger-widget.test.mjs`

Expected: PASS for the component contract tests. If TypeScript or JSX syntax is malformed, fix the component before proceeding; do not weaken the source assertions.

## Task 3: Mount the widget in RootLayout

**Files:**
- Modify: `src/app/components/FloatCard.tsx:25-35, 41` to export the existing route-hide predicate without changing its visual behavior.
- Modify: `src/app/layouts/RootLayout.tsx:19-20, 113-124, 291-313` for the helper import, route-aware flag, and shared-shell mount.

**Interfaces:**
- Consumes `isAuthenticated`, `useFullScreenOverlay`, `passportPendingCount`, and `shouldHideFloatCardOnRoute(pathname)` already derived or imported by `RootLayout`.
- Produces a single global `MessengerWidget` instance for the authenticated shell.

- [ ] **Step 1: Add the import beside the other layout components**

```tsx
import { MessengerWidget } from '@/app/components/MessengerWidget';
```

- [ ] **Step 2: Derive one route-aware pending-card flag after `hideBottomNav`**

```tsx
  const showPendingFormCard =
    isAuthenticated &&
    !useFullScreenOverlay &&
    passportPendingCount > 0 &&
    !pathname.startsWith('/cart') &&
    !pathname.startsWith('/settings') &&
    !pathname.startsWith('/checkout') &&
    !shouldHideFloatCardOnRoute(pathname);
```

- [ ] **Step 3: Mount it after `BottomNav` and before `FloatCard`**

```tsx
      {!hideBottomNav && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingPassportCount={passportPendingCount}
          isAuthenticated={isAuthenticated}
          ticketActionCount={ticketActionCount}
          userAvatarUrl={userProfile.avatarUrl || member.avatarUrl}
        />
      )}

      {isAuthenticated && !useFullScreenOverlay && (
        <MessengerWidget hasPendingFormCard={showPendingFormCard} />
      )}

      {showPendingFormCard && (
        <FloatCard
          pendingCount={passportPendingCount}
          nearestDeadline={nearestPassportDeadline}
          onPress={() => navTo('/orders')}
          accentColor={currentEvent ? getEventBrand(currentEvent).accent : undefined}
          accentDarkColor={currentEvent ? getEventBrand(currentEvent).accentDark : undefined}
        />
      )}
```

- [ ] **Step 4: Re-run focused tests**

Run: `node --test tests/messenger-widget.test.mjs`

Expected: PASS, including the RootLayout visibility, route-aware pending-card flag, and desktop/mobile offset assertions.

## Task 4: Verify build, routes, interaction, and clean scope

**Files:**
- Verify: `src/app/components/MessengerWidget.tsx`
- Verify: `src/app/components/FloatCard.tsx`
- Verify: `src/app/layouts/RootLayout.tsx`
- Verify: `tests/messenger-widget.test.mjs`

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: Vite completes successfully with no TypeScript/JSX compilation errors.

- [ ] **Step 2: Start a temporary local preview for browser verification**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite reports a local URL. Use the in-app browser/Playwright against the reported URL; stop the server after verification.

- [ ] **Step 3: Verify authenticated route coverage**

Check `/`, `/events`, `/orders`, `/passport`, `/settings`, and one `/events/:id` route. On each route assert exactly one accessible trigger matching `Open Messenger` or `Close Messenger`, and assert that the pathname remains unchanged after opening the popover.

- [ ] **Step 4: Verify the popover interaction**

Click `Open Messenger`; assert `role="dialog"`, visible `PlanOut Messenger`, `Prototype only`, and all three quick-reply labels. Click one quick reply and assert both its user message and canned response appear. Click the trigger or close button, then reopen and press Escape; assert the dialog is hidden.

- [ ] **Step 5: Verify responsive and exclusion states**

At a mobile viewport, confirm the trigger sits above the bottom nav and, when the existing pending form card is visible, above that card as well. Visit `/passport/add-entry` and assert no `Open Messenger` trigger exists. Inspect the browser console and confirm no new errors are introduced.

- [ ] **Step 6: Verify the focused diff and commit only scoped files**

Run: `git diff --check -- src/app/components/MessengerWidget.tsx src/app/components/FloatCard.tsx src/app/layouts/RootLayout.tsx tests/messenger-widget.test.mjs`

Run: `git status --short`

Expected: the source diff contains only the new widget, the shared route-aware FloatCard predicate/mount, and the new test; unrelated pre-existing modifications remain untouched. If committing, stage explicit paths only:

```bash
git add -- src/app/components/MessengerWidget.tsx src/app/components/FloatCard.tsx src/app/layouts/RootLayout.tsx tests/messenger-widget.test.mjs
git commit -m "feat: add prototype Messenger widget"
```
