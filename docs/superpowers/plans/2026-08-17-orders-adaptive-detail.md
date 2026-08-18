# Orders Adaptive Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved overview count/status capsules and a production-feasible adaptive Order Details cover that represents single-, multi-event, merchandise, and fallback orders truthfully.

**Architecture:** Keep order state and data derivation in `OrdersPage.tsx`, extract the repeated semantic status material into `OrderStatusLabel.tsx`, and add a prop-driven `OrderCover.tsx` that renders one, two, or three-plus media cells with CSS Grid. Deduplicate cover events by ticket ID, cap requested images at three, use brand gradients as deterministic fallbacks, and leave every registration/payment/form interaction in its current component and route.

**Tech Stack:** React, TypeScript, Tailwind CSS, CSS media queries, Node test runner, Vite.

## Global Constraints

- Preserve order grouping, totals, state calculation, Passport ownership, Guest QR behavior, form persistence, share actions, player management, payment details, and routes.
- Keep overview dates, summaries, prices, `18px` radius, `120px` mobile minimum height, and first-event imagery unchanged.
- Use distinct event IDs; never parse `order.name` or count repeated team-player entries to derive event identity.
- Request at most three cover images and add no generated collage, canvas processing, palette extraction, carousel, slideshow, dependency, or API.
- Keep cover imagery decorative and status/count labels readable without relying on color.
- Preserve reduced-motion, reduced-transparency, increased-contrast, focus, safe-area, and desktop sticky-payment behavior.
- Preserve unrelated dirty-worktree changes. Do not stage or commit.

---

### Task 1: Shared status material and overview count capsule

**Files:**
- Create: `src/app/components/OrderStatusLabel.tsx`
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `src/styles/index.css`
- Test: `tests/orders-ui-consistency.test.mjs`

**Interfaces:**
- Produces: `OrderStatusTone = 'warning' | 'ready' | 'neutral' | 'refunded'`.
- Produces: `OrderStatusLabel({ label, tone, className?, testId? })`.
- Produces: `getOrderOverviewTitle(order: OrderRecord): { primary: string; additionalCount: number }`.
- Consumes: existing `getDistinctEventCount`, `getOrderState`, and `getOrderStateDotClass` semantics.

- [x] **Step 1: Write failing overview regressions**

Read `OrderStatusLabel.tsx` in `tests/orders-ui-consistency.test.mjs` and replace the old plain-status/multi-event expectations with assertions that require:

```js
assert.match(ordersSource, /function getOrderOverviewTitle\(order: OrderRecord\)/);
assert.match(ordersSource, /const eventCount = getDistinctEventCount\(order\)/);
assert.match(ordersSource, /primary: order\.eventEntries\[0\]\?\.ticket\.eventTitle \|\| order\.name/);
assert.match(orderCardSource, /data-testid="order-additional-events"/);
assert.match(orderCardSource, /`\+\$\{additionalCount\} more`/);
assert.match(orderCardSource, /aria-label=\{order\.name\}/);
assert.match(orderCardSource, /min-w-0 flex-1/);
assert.match(orderCardSource, /shrink-0/);
assert.match(orderCardSource, /<OrderStatusLabel/);
assert.match(statusLabelSource, /order-status-label/);
assert.match(statusLabelSource, /backdrop-blur-\[8px\]/);
assert.match(statusLabelSource, /tone === 'warning'/);
assert.match(statusLabelSource, /tone === 'ready'/);
assert.match(statusLabelSource, /tone === 'refunded'/);
```

Keep the current assertions that title, date, summary, price, card geometry, first-event image/theme, and all status strings remain present.

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: the new overview tests fail because the count is still flattened into `order.name` and the status remains an exposed dot/label.

- [x] **Step 3: Add the shared status component**

Create `src/app/components/OrderStatusLabel.tsx` with one non-interactive semantic material:

```tsx
import React from 'react';

export type OrderStatusTone = 'warning' | 'ready' | 'neutral' | 'refunded';

const toneClasses: Record<OrderStatusTone, string> = {
  warning: 'border-[#f4c95d]/35 bg-[#33270e]/70 text-[#fff4c5]',
  ready: 'border-[#75e3bf]/30 bg-[#09241e]/70 text-[#ddfff4]',
  neutral: 'border-[#9bc5ff]/30 bg-[#0b1b2d]/70 text-[#e7f2ff]',
  refunded: 'border-[#ff8f9c]/35 bg-[#32131b]/70 text-[#ffe8ec]',
};

const dotClasses: Record<OrderStatusTone, string> = {
  warning: 'bg-[#f4c95d]',
  ready: 'bg-[#75e3bf]',
  neutral: 'bg-[#9bc5ff]',
  refunded: 'bg-[#ff8f9c]',
};

export function OrderStatusLabel({
  label,
  tone,
  className = '',
  testId = 'order-state-label',
}: {
  label: string;
  tone: OrderStatusTone;
  className?: string;
  testId?: string;
}) {
  return (
    <span
      data-testid={testId}
      className={`order-status-label inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[10.5px] font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[8px] backdrop-saturate-[125%] sm:text-[11px] ${toneClasses[tone]} ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClasses[tone]}`} />
      <span>{label}</span>
    </span>
  );
}
```

- [x] **Step 4: Separate the overview title and use the shared status**

In `OrdersPage.tsx`, import `OrderStatusLabel`. Add:

```tsx
function getOrderOverviewTitle(order: OrderRecord) {
  const eventCount = getDistinctEventCount(order);
  return {
    primary: order.eventEntries[0]?.ticket.eventTitle || order.name,
    additionalCount: Math.max(0, eventCount - 1),
  };
}
```

In `OrderCard`, derive `primary` and `additionalCount`, replace the status markup with:

```tsx
{state ? <OrderStatusLabel label={state.label} tone={state.tone} /> : <span aria-hidden="true" />}
```

Replace the flattened title with:

```tsx
<h2
  aria-label={order.name}
  className="flex max-w-[82%] items-end gap-1.5 text-[18px] font-bold leading-[1.08] tracking-[-0.45px] text-[var(--order-card-fg)] [text-shadow:0_1px_2px_rgba(0,0,0,0.18)] sm:text-[20px] sm:leading-[1.1]"
>
  <span aria-hidden="true" className="line-clamp-2 min-w-0 flex-1">{primary}</span>
  {additionalCount > 0 && (
    <span
      data-testid="order-additional-events"
      aria-hidden="true"
      className="mb-0.5 shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[10.5px] font-semibold leading-none tracking-[-0.1px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[8px] backdrop-saturate-[120%] sm:text-[11px]"
    >
      {`+${additionalCount} more`}
    </span>
  )}
</h2>
```

- [x] **Step 5: Add accessibility fallbacks for the small materials**

Extend `src/styles/index.css`:

```css
@media (prefers-reduced-transparency: reduce) {
  .order-status-label,
  [data-testid="order-additional-events"] {
    background: rgba(7, 12, 18, 0.94);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .order-status-label,
  [data-testid="order-additional-events"] {
    border-color: rgba(255, 255, 255, 0.72);
  }
}
```

- [x] **Step 6: Run the focused test and confirm GREEN**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: every focused Orders test passes.

---

### Task 2: Production-feasible adaptive Order Details cover

**Files:**
- Create: `src/app/components/OrderCover.tsx`
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `src/styles/index.css`
- Test: `tests/orders-ui-consistency.test.mjs`

**Interfaces:**
- Consumes: `OrderStatusLabel` and `OrderStatusTone` from Task 1.
- Produces: `OrderCoverItem = { id: string; title: string; image?: string; gradientFrom: string; gradientTo: string }`.
- Produces: `OrderCover(props)` with title, order/status metadata, item summary, total, cover items, and total media count.
- Produces: `getUniqueOrderEvents(order: OrderRecord): OrderCoverItem[]`.
- Produces: `getOrderCoverPresentation(order: OrderRecord, registrationCount: number)`.

- [x] **Step 1: Write failing adaptive-cover regressions**

Read `OrderCover.tsx` in the test and require:

```js
assert.match(ordersSource, /function getUniqueOrderEvents\(order: OrderRecord\)/);
assert.match(ordersSource, /seen\.has\(entry\.ticket\.id\)/);
assert.match(ordersSource, /seen\.add\(entry\.ticket\.id\)/);
assert.match(ordersSource, /function getOrderCoverPresentation/);
assert.match(ordersSource, /eventCount > 1 \? `\$\{eventCount\}-event order`/);
assert.match(ordersSource, /<OrderCover/);
assert.match(orderCoverSource, /data-testid="order-detail-cover"/);
assert.match(orderCoverSource, /items\.slice\(0, 3\)/);
assert.match(orderCoverSource, /data-cover-mode=\{mode\}/);
assert.match(orderCoverSource, /grid-cols-\[58fr_42fr\]/);
assert.match(orderCoverSource, /grid-cols-\[62fr_38fr\]/);
assert.match(orderCoverSource, /row-span-2/);
assert.match(orderCoverSource, /overflowCount > 0/);
assert.match(orderCoverSource, /`\+\$\{overflowCount\}`/);
assert.match(orderCoverSource, /aria-hidden="true"/);
assert.match(orderCoverSource, /alt=""/);
assert.match(orderCoverSource, /onError/);
assert.match(orderCoverSource, /<h1/);
assert.match(ordersSource, />Registration</);
```

Preserve the existing assertions for Order Details reference, payment summary, team/player actions, route targets, and bottom-navigation spacing.

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: adaptive-cover assertions fail because Order Details still begins with the plain transaction header.

- [x] **Step 3: Create the adaptive cover component**

Create `src/app/components/OrderCover.tsx`. It must:

```tsx
import React, { useMemo, useState } from 'react';
import { OrderStatusLabel, type OrderStatusTone } from '@/app/components/OrderStatusLabel';

export type OrderCoverItem = {
  id: string;
  title: string;
  image?: string;
  gradientFrom: string;
  gradientTo: string;
};

export function OrderCover({
  title,
  reference,
  purchaseDate,
  itemSummary,
  total,
  state,
  items,
  totalMediaCount,
}: {
  title: string;
  reference: string;
  purchaseDate: string;
  itemSummary: string;
  total: string;
  state: { label: string; tone: OrderStatusTone } | null;
  items: OrderCoverItem[];
  totalMediaCount: number;
}) {
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());
  const visibleItems = useMemo(() => items.slice(0, 3), [items]);
  const mode = totalMediaCount <= 1 ? 'single' : totalMediaCount === 2 ? 'double' : 'mosaic';
  const overflowCount = Math.max(0, totalMediaCount - 3);

  return (
    <section
      data-testid="order-detail-cover"
      data-cover-mode={mode}
      className="order-cover relative isolate min-h-[248px] overflow-hidden rounded-[24px] bg-[#0c493f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(0,0,0,0.18),0_22px_42px_-30px_rgba(4,24,19,0.72)] sm:min-h-[300px] sm:rounded-[28px]"
    >
      <div
        aria-hidden="true"
        className={`order-cover-media pointer-events-none absolute inset-0 grid ${mode === 'double' ? 'grid-cols-[58fr_42fr]' : mode === 'mosaic' ? 'grid-cols-[62fr_38fr] grid-rows-2' : 'grid-cols-1'}`}
      >
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className={`relative overflow-hidden ${mode === 'mosaic' && index === 0 ? 'row-span-2' : ''} ${index > 0 ? 'border-l border-white/20' : ''} ${mode === 'mosaic' && index === 2 ? 'border-t border-white/20' : ''}`}
            style={{ background: `linear-gradient(145deg, ${item.gradientFrom}, ${item.gradientTo})` }}
          >
            {item.image && !failedIds.has(item.id) && (
              <img
                src={item.image}
                alt=""
                draggable={false}
                onError={() => setFailedIds((current) => new Set(current).add(item.id))}
                className="order-cover-image h-full w-full object-cover contrast-[1.03] saturate-[1.08]"
              />
            )}
            {index === 2 && overflowCount > 0 && (
              <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-[8px]">
                {`+${overflowCount}`}
              </span>
            )}
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,8,12,0.90)_0%,rgba(3,8,12,0.34)_52%,rgba(3,8,12,0.08)_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(128deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_20%,transparent_44%)]" />

      <div className="relative z-10 flex min-h-[248px] flex-col p-5 sm:min-h-[300px] sm:p-7">
        <div className="flex items-start justify-between gap-3">
          {state ? <OrderStatusLabel label={state.label} tone={state.tone} testId="order-cover-status" /> : <span />}
          <span className="text-[11px] font-semibold text-white/78">{purchaseDate}</span>
        </div>
        <div className="mt-auto max-w-[92%]">
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.04em] text-white/68">Order {reference}</p>
          <h1 className="mt-2 text-balance text-[28px] font-bold leading-[1.02] tracking-[-0.75px] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.32)] sm:text-[36px]">{title}</h1>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[12px] font-semibold text-white/78 sm:text-[13px]">
            <span>{itemSummary}</span><span aria-hidden="true">·</span><span className="text-[16px] font-bold text-white sm:text-[18px]">{total}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [x] **Step 4: Add deterministic cover derivation**

In `OrdersPage.tsx`, import `OrderCover` and `OrderCoverItem`. Add helpers that deduplicate events by ticket ID, resolve each event's stored brand with `getEventBrand`, and create one PlanOut merchandise/fallback item when there are no events:

```tsx
function getUniqueOrderEvents(order: OrderRecord): OrderCoverItem[] {
  const seen = new Set<string>();
  const events: OrderCoverItem[] = [];
  order.eventEntries.forEach((entry) => {
    if (seen.has(entry.ticket.id)) return;
    seen.add(entry.ticket.id);
    const brand = getEventBrand({ brand: entry.ticket.brand || PLANOUT_EVENT_BRAND });
    events.push({
      id: entry.ticket.id,
      title: entry.ticket.eventTitle,
      image: entry.ticket.image,
      gradientFrom: brand.pageBackground,
      gradientTo: brand.pageBackgroundTo,
    });
  });
  return events;
}

function getOrderCoverPresentation(order: OrderRecord, registrationCount: number) {
  const events = getUniqueOrderEvents(order);
  const eventCount = events.length;
  const fallbackBrand = getEventBrand({ brand: PLANOUT_EVENT_BRAND });
  const merchandiseQuantity = order.merchItems.reduce((sum, item) => sum + item.quantity, 0);
  const items = eventCount > 0 ? events : [{
    id: order.merchItems[0]?.id || order.id,
    title: order.name,
    image: getOrderGraphicImages(order)[0],
    gradientFrom: fallbackBrand.pageBackground,
    gradientTo: fallbackBrand.pageBackgroundTo,
  }];

  return {
    title: eventCount > 1 ? `${eventCount}-event order` : items[0]?.title || order.name,
    itemSummary: eventCount > 0
      ? `${registrationCount} registration item${registrationCount === 1 ? '' : 's'}`
      : `${merchandiseQuantity} item${merchandiseQuantity === 1 ? '' : 's'}`,
    items,
    totalMediaCount: eventCount || 1,
  };
}
```

- [x] **Step 5: Replace the plain detail header and add registration hierarchy**

In `OrderDetailPage`, derive `state`, `cover`, and pending-form count after `registrationEntries`:

```tsx
const state = getOrderState(order);
const cover = getOrderCoverPresentation(order, registrationEntries.length);
const pendingFormCount = order.eventEntries.filter((entry) => (
  entry.status === 'pending_form' || entry.status === 'resubmit_required'
)).length;
```

Replace the existing header with:

```tsx
<OrderCover
  title={cover.title}
  reference={order.ref}
  purchaseDate={order.date}
  itemSummary={cover.itemSummary}
  total={formatMoney(getOrderTotal(order))}
  state={state}
  items={cover.items}
  totalMediaCount={cover.totalMediaCount}
/>
```

At the start of the registration section, add:

```tsx
<div className="flex items-end justify-between gap-4 px-1">
  <div>
    <h2 className="text-[19px] font-semibold tracking-[-0.35px] text-[#181d27]">Registration</h2>
    <p className="mt-1 text-[12px] font-medium text-[#64748b]">Forms and access for this order</p>
  </div>
  {pendingFormCount > 0 && (
    <span className="shrink-0 text-[11px] font-semibold text-[#8a5b08]">
      {pendingFormCount} form{pendingFormCount === 1 ? '' : 's'} needed
    </span>
  )}
</div>
```

Do not move or alter `ParticipantFormShareControls`, `RegistrationItem`, merchandise, refund, Payment Summary, receipt, or help actions.

- [x] **Step 6: Add cover accessibility fallbacks**

Extend `src/styles/index.css`:

```css
@media (prefers-reduced-transparency: reduce) {
  .order-cover-media .order-cover-image {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .order-cover-image {
    transform: none !important;
    transition: none !important;
  }
}

@media (prefers-contrast: more) {
  .order-cover {
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.74);
  }
}
```

- [x] **Step 7: Run the focused test and confirm GREEN**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: all focused Orders UI tests pass with zero failures.

---

### Task 3: Live visual/flow QA and complete verification

**Files:**
- Modify: `design-qa.md`
- Modify: `docs/superpowers/plans/2026-08-17-orders-adaptive-detail.md`

**Interfaces:**
- Consumes: completed overview and detail UI from Tasks 1–2.
- Produces: browser evidence for representative cover modes, preserved actions, clean accessibility output, and clean console output.

- [x] **Step 1: Browser-check the Orders overview at `400 × 964`**

Confirm:

- `+2 more` is a separate visible capsule on the three-event order.
- Every status is a readable semantic glass label and remains informational.
- Date, summary, price, card height, photography, and filters remain unchanged.
- `All`, `Pending`, and `Complete` render `15`, `7`, and `8` cards.

- [x] **Step 2: Browser-check representative Order Details covers**

Confirm:

- `/orders/tkt-013` uses a single Futsal image cover and retains all eight player rows.
- `/orders/tkt-001` uses three distinct event images, says `3-event order`, and retains all three registration items.
- Merchandise-only and refunded orders use one PlanOut-themed image/fallback cover and an item quantity rather than `0 registration items`.
- A deterministic missing-image preview renders a theme panel without a broken-image icon.
- Mobile has no clipping or bottom-navigation collision; desktop retains the sticky `380px` payment column.

- [x] **Step 3: Re-check critical actions**

Confirm:

- Futsal opens `/orders/tkt-013`.
- Player 8 `Fill up` opens `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`.
- The three-event order opens `/orders/tkt-001` and preserves all payment lines.
- Existing form share, QR, receipt, and help controls remain actionable.
- Decorative cover images are absent from the accessibility snapshot and browser warnings/errors are empty.

- [x] **Step 4: Record design QA**

Append a dated `Adaptive Order Details` section to `design-qa.md` with the visual states inspected, computed cover modes, route/action results, accessibility findings, and console result.

- [x] **Step 5: Run fresh complete verification**

Run:

```bash
node --test --test-reporter=spec tests/*.test.mjs && npm run build && git diff --check
```

Expected: all tests pass, Vite exits `0` with only the existing bundle/import warnings, and `git diff --check` produces no output.

- [x] **Step 6: Complete the checklist without git mutation**

Mark every plan checkbox complete after evidence exists. Do not stage, commit, reset, or alter unrelated dirty-worktree files.
