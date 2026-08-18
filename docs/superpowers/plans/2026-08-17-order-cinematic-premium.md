# Order Cinematic Premium Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the full-bleed Orders cards with crisper photography, an art-directed cinematic scrim, more precise light-catching edges, and stronger typography without changing card structure or behavior.

**Architecture:** Keep the existing one-image `OrderCard` and first-event theme ownership. Replace its even tint plus separate vignette with three brand-derived scrim variables rendered as one combined horizontal/vertical scrim; remove default backdrop blur, strengthen optical edges, and refine image/typography classes. Add a reduced-motion rule for image scale, update the source regression first, and verify all existing Orders/Form flows.

**Tech Stack:** React, TypeScript, Tailwind CSS, CSS media queries, Node test runner, Vite.

## Global Constraints

- Preserve one full-bleed first-event image, first-event theme ownership, PlanOut merchandise fallback, status semantics, `18px` radius, `120px` mobile height, responsive layout, filters, detail navigation, and participant-form routes.
- Keep the status as a plain dot and label; add no thumbnail, pill, nested card, grain, glow, or new control.
- Use one combined scrim element and one nearly transparent material veil; do not add progressive blur or duplicate the photograph.
- Keep every decorative layer pointer-inert and hidden from assistive technology.
- Keep reduced-transparency, increased-contrast, and reduced-motion fallbacks.
- Add no dependency, generated asset, canvas extraction, or remote image processing.
- Do not stage or commit changes in the user's existing dirty `main` checkout.

---

### Task 1: Cinematic image, scrim, edge, and type polish

**Files:**
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `src/styles/index.css`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: `getOrderCardBrand(order: OrderRecord)`, `getOrderAmbientImage(order: OrderRecord)`, `alpha(hex: string, opacity: number)`, and the existing `OrderCard` structure.
- Produces: `--order-card-scrim-leading`, `--order-card-scrim-middle`, `--order-card-scrim-trailing`, `--order-card-meta`, `.order-card-image-media`, and the updated single `order-glass-tint` scrim.

- [x] **Step 1: Write the failing source regression**

Update the full-bleed and Apple-material assertions in `tests/orders-ui-consistency.test.mjs`, and add this focused contract:

```js
test('Orders cards use cinematic photography and a directional brand scrim', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderAmbientImage('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(orderCardSource, /--order-card-scrim-leading/);
  assert.match(orderCardSource, /alpha\(brand\.pageBackgroundTo, 0\.90\)/);
  assert.match(orderCardSource, /alpha\(brand\.pageBackground, 0\.56\)/);
  assert.match(orderCardSource, /alpha\(brand\.pageBackgroundTo, 0\.24\)/);
  assert.match(orderCardSource, /absolute inset-0 opacity-\[0\.78\]/);
  assert.match(orderCardSource, /order-card-image-media h-full w-full scale-\[1\.03\] object-cover contrast-\[1\.04\] saturate-\[1\.12\]/);
  assert.match(orderCardSource, /group-hover:scale-\[1\.045\]/);
  assert.match(orderCardSource, /linear-gradient\(to top, rgba\(3,8,12,0\.68\)/);
  assert.match(orderCardSource, /linear-gradient\(96deg, var\(--order-card-scrim-leading\)/);
  assert.doesNotMatch(orderCardSource, /data-testid="order-glass-vignette"|backdrop-blur-\[3px\]/);
  assert.match(orderCardSource, /bg-white\/\[0\.018\] backdrop-saturate-\[112%\]/);
  assert.match(orderCardSource, /max-w-\[82%\] text-\[18px\][\s\S]*?tracking-\[-0\.45px\][\s\S]*?sm:text-\[20px\]/);
  assert.match(orderCardSource, /\[text-shadow:0_1px_2px_rgba\(0,0,0,0\.18\)\]/);
  assert.match(stylesSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.order-card-image-media/);
});
```

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: the cinematic contract fails because the current card still uses `0.46` image opacity, a separate vignette, `3px` backdrop blur, and the earlier typography.

- [x] **Step 3: Implement brand scrim tokens and precise elevation**

In `getOrderCardStyle`, replace the two tint variables with:

```tsx
'--order-card-meta': alpha(brand.pageForeground, 0.82),
'--order-card-scrim-leading': alpha(brand.pageBackgroundTo, 0.90),
'--order-card-scrim-middle': alpha(brand.pageBackground, 0.56),
'--order-card-scrim-trailing': alpha(brand.pageBackgroundTo, 0.24),
```

Use this elevation:

```tsx
boxShadow: `inset 0 1px 0 rgba(255,255,255,0.48), inset 0 -1px 0 rgba(0,0,0,0.16), 0 14px 26px -20px ${brand.accentShadow}`,
```

- [x] **Step 4: Implement the cinematic layers and typography**

Set the image wrapper to `opacity-[0.78]` and the image to:

```tsx
className="order-card-image-media h-full w-full scale-[1.03] object-cover contrast-[1.04] saturate-[1.12] transition-transform duration-200 ease-out group-hover:scale-[1.045]"
```

Delete the separate `order-glass-vignette` span. Give `order-glass-tint` this combined background:

```tsx
style={{
  background: [
    'linear-gradient(to top, rgba(3,8,12,0.68) 0%, rgba(3,8,12,0.10) 62%, rgba(255,255,255,0.05) 100%)',
    'linear-gradient(96deg, var(--order-card-scrim-leading) 0%, var(--order-card-scrim-middle) 48%, var(--order-card-scrim-trailing) 100%)',
  ].join(', '),
}}
```

Use `bg-white/[0.018] backdrop-saturate-[112%]` for the material with no default blur. Shorten the highlight to `linear-gradient(128deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.09) 16%, transparent 40%)`.

Use `text-[var(--order-card-meta)]` for the status and date. Change the title to `max-w-[82%] text-[18px] leading-[1.08] tracking-[-0.45px] sm:text-[20px] sm:leading-[1.1]` and add `[text-shadow:0_1px_2px_rgba(0,0,0,0.18)]` to the title and price only.

- [x] **Step 5: Add reduced-motion image behavior**

Append to `src/styles/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .order-card-image-media {
    scale: 1.03 !important;
    transition: none !important;
  }
}
```

- [x] **Step 6: Run focused verification and confirm GREEN**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: all focused Orders UI tests pass with zero failures.

- [x] **Step 7: Run complete verification and live QA**

Run `node --test --test-reporter=spec tests/*.test.mjs`, `npm run build`, and `git diff --check`. Browser-check the dark-green Futsal, PlanOut teal, earth Canlaon, and maroon Basketball cards; filters `7/8/15`; `/orders/tkt-013`; Player 8 `Fill up`; accessibility; and console warnings/errors. Append results to `design-qa.md`.
