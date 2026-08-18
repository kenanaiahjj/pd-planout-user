# Order Full-Bleed Event Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the redundant Orders thumbnail stack and integrate the first event image into each complete order card as a readable, Apple-like full-bleed surface.

**Architecture:** Keep order grouping, first-event brand resolution, status calculation, and navigation unchanged. Simplify `OrderCard` to one full-bleed image, one brand tint, one vignette, one light material veil, and one full-width foreground stack; render status once as plain metadata. Update the existing source regression and shared reduced-transparency selector, then browser-verify the unchanged Orders/Form flows.

**Tech Stack:** React, TypeScript, Tailwind CSS, CSS media queries, Node test runner, Vite.

## Global Constraints

- The first event image and first event theme remain the sole visual owners for a multi-event order.
- Merchandise-only and unbranded orders continue to use `PLANOUT_EVENT_BRAND`.
- Preserve status wording, status-dot colors, card radius, card height, filters, titles, summaries, prices, detail navigation, form links, Guest QR behavior, and Passport ownership.
- Remove `OrderEventCardStack`, `OrderGraphicVariant`, and `getOrderGraphicVariant`; do not retain hidden rear-card or thumbnail presentation.
- Keep every decorative layer pointer-inert and hidden from assistive technology.
- Keep reduced-transparency, increased-contrast, and reduced-motion behavior.
- Add no dependency, generated asset, canvas extraction, or remote image processing.
- Do not stage or commit changes in the user's existing dirty `main` checkout.

---

### Task 1: Simplify Orders cards to one full-bleed event image

**Files:**
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `src/styles/index.css`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: `getOrderState(order: OrderRecord): OrderState`, `getOrderGraphicImages(order: OrderRecord): string[]`, `getOrderCardBrand(order: OrderRecord)`, `ImageWithFallback`.
- Produces: `getOrderStateDotClass(state: OrderState): string`, the `order-card-image` decorative layer, the `order-glass-vignette` contrast layer, and a full-width `OrderCard` foreground stack.

- [x] **Step 1: Write the failing source regression**

Replace the stack-specific overview tests in `tests/orders-ui-consistency.test.mjs` with assertions that require exactly one full-card image treatment and reject the old stack:

```js
test('Orders overview integrates one event image into the complete card surface', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderAmbientImage('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(orderCardSource, /getOrderGraphicImages\(order\)\[0\] \|\| ''/);
  assert.match(orderCardSource, /data-testid="order-card-image"/);
  assert.match(orderCardSource, /absolute inset-0 opacity-\[0\.46\]/);
  assert.match(orderCardSource, /scale-\[1\.02\] object-cover saturate-\[1\.08\]/);
  assert.match(orderCardSource, /data-testid="order-glass-vignette"/);
  assert.match(orderCardSource, /backdrop-blur-\[3px\]/);
  assert.match(orderCardSource, /relative z-10 flex min-h-\[120px\] flex-col/);
  assert.match(orderCardSource, /data-testid="order-state-label"/);
  assert.match(orderCardSource, /getOrderStateDotClass\(state\)/);
  assert.doesNotMatch(orderCardSource, /OrderEventCardStack|order-event-card-stack|order-image-tonal-layer/);
  assert.doesNotMatch(orderCardSource, /OrderGraphicVariant|getOrderGraphicVariant/);
  assert.doesNotMatch(orderCardSource, /blur-\[18px\]|bg-\[rgba\(7,12,18,0\.66\)\]/);
});
```

Update the existing Apple-material test to require `order-card-image`, `order-glass-vignette`, `backdrop-blur-[3px]`, the full-width foreground flex stack, and the reduced-transparency selector for `order-card-image`. Remove assertions for the old `order-glass-ambient`, `backdrop-blur-[16px]`, mini-card frame, and dark status footer.

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: the new full-bleed test fails because `order-card-image`, `order-glass-vignette`, and the full-width foreground stack do not exist, and the old stack still exists.

- [x] **Step 3: Implement the full-bleed image and plain status metadata**

In `src/app/pages/OrdersPage.tsx`, delete `OrderGraphicVariant`, `getOrderGraphicVariant`, and `OrderEventCardStack`. Add the semantic dot resolver:

```tsx
function getOrderStateDotClass(state: OrderState) {
  return state?.tone === 'warning'
    ? 'bg-[#f4c95d]'
    : state?.tone === 'ready'
      ? 'bg-[#75e3bf]'
      : state?.tone === 'refunded'
        ? 'bg-[#ff8f9c]'
        : 'bg-[#9bc5ff]';
}
```

Change the tint tokens in `getOrderCardStyle` to:

```tsx
'--order-card-tint-from': alpha(brand.pageBackground, 0.55),
'--order-card-tint-to': alpha(brand.pageBackgroundTo, 0.82),
```

Build `OrderCard` from the existing button shell with this layer order and foreground composition:

```tsx
const ambientImage = getOrderAmbientImage(order);
const state = getOrderState(order);

{ambientImage && (
  <span data-testid="order-card-image" aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.46]">
    <ImageWithFallback
      src={ambientImage}
      alt=""
      draggable={false}
      className="h-full w-full scale-[1.02] object-cover saturate-[1.08]"
    />
  </span>
)}
<span
  data-testid="order-glass-tint"
  aria-hidden="true"
  className="pointer-events-none absolute inset-0"
  style={{ background: 'linear-gradient(105deg, var(--order-card-tint-from) 0%, var(--order-card-tint-to) 100%)' }}
/>
<span
  data-testid="order-glass-vignette"
  aria-hidden="true"
  className="pointer-events-none absolute inset-0"
  style={{ background: 'linear-gradient(to top, rgba(5,10,15,0.36) 0%, rgba(5,10,15,0.10) 48%, transparent 78%)' }}
/>
<span data-testid="order-glass-material" aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/[0.045] backdrop-blur-[3px] backdrop-saturate-[120%]" />
```

Use one `relative z-10 flex min-h-[120px] flex-col px-4 py-3.5 sm:min-h-[136px] sm:px-5 sm:py-4` foreground. Its first row contains the plain `order-state-label` dot/label at left and the date at right. Its lower block contains the unchanged title and a final row with the unchanged item summary at left and price at right.

- [x] **Step 4: Update the reduced-transparency selector**

In `src/styles/index.css`, replace the old ambient selector with:

```css
@media (prefers-reduced-transparency: reduce) {
  .order-glass-card [data-testid="order-card-image"] {
    display: none;
  }

  .order-glass-card [data-testid="order-glass-material"] {
    background: color-mix(in srgb, var(--order-card-solid) 94%, black 6%);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
```

- [x] **Step 5: Run focused verification and confirm GREEN**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: all focused Orders UI tests pass with zero failures.

- [x] **Step 6: Run complete automated verification**

Run:

```bash
node --test --test-reporter=spec tests/*.test.mjs
npm run build
git diff --check
```

Expected: all tests pass, Vite exits successfully, and diff check reports no whitespace errors. Existing mixed-import and chunk-size warnings may remain.

- [x] **Step 7: Perform live Orders and Form QA**

At `http://localhost:5173/orders`, inspect Futsal dark green, PlanOut teal, Canlaon earth, and Basketball maroon. Confirm the first image is recognizable within the full card, no thumbnail or nested status surface remains, the status is plain dot-and-label metadata, and all copy is readable.

Confirm `Pending` has `7` rows, `Complete` has `8`, and `All` has `15`. Open Futsal and confirm `/orders/tkt-013`; use Player 8 `Fill up` and confirm `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`. Confirm decorative layers are absent from the accessibility snapshot and the browser warning/error log is empty. Append the observed result to `design-qa.md`.
