# Order Event Card Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Orders overview folder illustrations with event-image card stacks carrying the relevant order status.

**Architecture:** Keep the change inside `OrdersPage.tsx`: derive a compact status and ordered image list from `OrderRecord`, then render a data-driven stack in the existing graphic slot. Preserve `OrderCard` as the navigation boundary and update its source regression in the existing Orders consistency suite.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner, Vite.

## Global Constraints

- Preserve the current Orders row dimensions, date, title, item summary, price, filters, and detail navigation.
- Reuse existing event and merchandise images; do not add generated or placeholder artwork.
- Status copy must remain plain-language and legible at the mobile card size.
- Rear cards are decorative and must not add nested interactive controls.

---

### Task 1: Event-image order stack

**Files:**
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `tests/orders-ui-consistency.test.mjs`

**Interfaces:**
- Consumes: `OrderRecord`, `getOrderGraphicVariant(order)`, `getOrderState(order)`, and existing `order.image`, `entry.ticket.image`, and `item.image` values.
- Produces: `getOrderGraphicImages(order): string[]` and `OrderEventCardStack({ order, state, variant })`.

- [ ] **Step 1: Write the failing regression**

Replace the existing folder-graphic source assertions with assertions that require `OrderEventCardStack`, `data-testid="order-event-card-stack"`, existing order imagery, a gradient image treatment, and the state label. Assert that `order-cardholder.svg` and `OrderFolderGraphic` are absent.

- [ ] **Step 2: Verify the regression fails for the missing component**

Run: `node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs`

Expected: the order-stack test fails because the Orders source still contains `OrderFolderGraphic` and cardholder SVG imports.

- [ ] **Step 3: Implement the minimal component**

Remove the three folder SVG imports. Expand the order-state tone union for neutral and refunded merchandise states, add `getOrderGraphicImages(order)`, and implement `OrderEventCardStack` with one to three layered white cards, `ImageWithFallback`, a bottom-up event-matched gradient, a compact status pill, neutral layered shadows, and the existing restrained hover lift. Pass the full `order` into the component from `OrderCard`.

- [ ] **Step 4: Verify focused and complete behavior**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
node --test --test-reporter=spec tests/*.test.mjs
npm run build
git diff --check
```

Expected: all tests pass, Vite exits successfully, and the diff check prints no errors.

- [ ] **Step 5: Perform browser and design QA**

At `http://localhost:5173/orders` with a `400 x 964` viewport, capture the Orders overview, verify the status remains readable over each event image, open the first order to confirm navigation, and check console errors/warnings. Compare a focused crop of the supplied reference and the rendered Orders graphic together, record any P0/P1/P2 fixes, repeat if needed, and save the passing evidence in the task-specific QA report without overwriting unrelated QA work.

---

### Task 2: Multi-event order summary

**Files:**
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `tests/orders-ui-consistency.test.mjs`

**Interfaces:**
- Consumes: grouped `tickets` in `buildOrders`, `OrderRecord.eventEntries`, and `getOrderGraphicImages(order)`.
- Produces: the compact title `First event + N more`, a conditional `N events · N registration items` summary, and up to three distinct event-image layers.

- [ ] **Step 1: Write the failing regression**

Require the compact `+ N more` title, distinct-event and registration-item counts in `getItemSummary`, and stack depth derived from the distinct event count with a maximum of three layers. Reject the previous `other event(s)` title.

- [ ] **Step 2: Verify the regression fails**

Run: `node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs`

Expected: FAIL because the source still emits `other event(s)`, category-heavy summaries, and only variant-based stack depth.

- [ ] **Step 3: Implement the approved summary**

Add small helpers for distinct event count and registration-item count, return the count summary only for multi-event orders, shorten the grouped order title, and set stack depth to the greater of semantic variant depth and distinct-event count, capped at three.

- [ ] **Step 4: Verify behavior**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
node --test --test-reporter=spec tests/*.test.mjs
npm run build
git diff --check
```

Expected: all tests pass, Vite exits successfully, and the diff check prints no errors.

- [ ] **Step 5: Verify the live multi-event card**

At `400 x 964`, open the multi-event order in the Orders overview. Confirm its title uses `+ N more`, its supporting line shows both counts, its stack uses distinct artwork, and the card still opens the complete order details without console errors.

---

### Task 3: Image-derived premium gradient treatment

**Files:**
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: the per-layer `image` selected inside `OrderEventCardStack`.
- Produces: an image-derived lower color layer plus a restrained neutral vignette; removes `getOrderGradientClass(order)` and its title-keyword presets.

- [x] **Step 1: Write the failing source regression**

Require a second `ImageWithFallback` for the per-layer tonal color, a bottom-up CSS mask, a bounded blur/saturation treatment, and a separate neutral vignette. Reject `getOrderGradientClass`, the event-title keyword checks, and the saturated `from-[#...]` preset classes.

- [x] **Step 2: Run the focused test and confirm RED**

Run: `node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs`

Expected: FAIL because `OrderEventCardStack` still calls `getOrderGradientClass(order)` and renders the fixed category-color overlay.

- [x] **Step 3: Implement the image-derived treatment**

Delete `getOrderGradientClass`. In each image frame, keep the crisp base image, add an aria-hidden repeated image with `scale`, `blur`, and slight saturation, fade it with a bottom-up mask, then add a neutral bottom vignette with restrained opacity. Keep all overlays pointer-inert and preserve the existing image bounds, frame, status footer, stack depth, and motion.

- [x] **Step 4: Run focused and complete verification**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
node --test --test-reporter=spec tests/*.test.mjs
npm run build
git diff --check
```

Expected: all tests pass, Vite exits successfully, and the diff check prints no errors.

- [x] **Step 5: Compare representative artwork in the browser**

At `400 x 964`, inspect at least the futsal, gear, relay, tennis, and marathon rows. Confirm that each lower treatment inherits the photograph's own color, the upper image stays crisp, subjects remain identifiable, rear layers stay distinct, status copy remains readable, navigation still works, and the browser console remains clean. Save passing evidence and append the result to `design-qa.md`.

---

### Task 4: First-event themed order surfaces

**Files:**
- Modify: `src/app/data/events.ts`
- Modify: `src/app/data/eventBrand.ts`
- Modify: `src/app/data/tickets.ts`
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: the first item in `OrderRecord.eventEntries`, the shared `EventBrandTheme` catalog, and the existing `getEventBrand` contrast resolver.
- Produces: explicit ticket brand metadata, a PlanOut fallback brand, and a full-card themed surface whose foreground tokens follow the resolved palette.

- [x] **Step 1: Write the failing regression**

Require exported shared event-brand palettes, an explicit PlanOut fallback palette, optional ticket brand metadata, first-event theme selection, full-card gradient styling, and theme-derived foreground variables. Reject title-keyword theme inference and a fixed white order-card background.

- [x] **Step 2: Run the focused test and confirm RED**

Run: `node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs`

Expected: FAIL because Orders has no first-event theme resolver and still renders every order row with a white background.

- [x] **Step 3: Implement the shared brand contract**

Export the existing Event Details brand catalog, add a dedicated PlanOut fallback palette, add optional `brand` metadata to `MyTicket`, and annotate the prototype tickets with the appropriate shared event palette. Keep the fallback for unbranded and merchandise-only records.

- [x] **Step 4: Theme the whole order row**

Resolve the card palette only from `order.eventEntries[0]?.ticket.brand`, pass it through `getEventBrand`, and apply the resulting page gradient, ambient accent, foreground, muted, border, surface, and shadow values as order-card CSS variables. Keep the photo stack natural, preserve semantic status dots, and leave layout and navigation unchanged.

- [x] **Step 5: Run focused and complete verification**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
node --test --test-reporter=spec tests/*.test.mjs
npm run build
git diff --check
```

Expected: all tests pass, Vite exits successfully, and the diff check prints no errors.

- [x] **Step 6: Verify the live themed cards**

At `400 x 964`, compare at least the default PlanOut teal, maroon, green, and earth palettes. Confirm readable text and prices, recognizable photography, visible but secondary status, a deterministic first-event theme on multi-event orders, unchanged tabs and detail navigation, and a clean browser console. Append the result to `design-qa.md`.
