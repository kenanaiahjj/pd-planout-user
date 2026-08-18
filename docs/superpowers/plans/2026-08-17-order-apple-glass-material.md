# Apple-Like Order Glass Material Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the event-themed Orders overview cards into Apple-like frosted materials while preserving event identity, card density, status semantics, and every existing Orders/forms interaction.

**Architecture:** Keep first-event brand resolution and order grouping unchanged. Layer one softly blurred first-event image, one brand tint, one frosted material veil, and one specular highlight inside each existing order button; keep the card content in a separate foreground layer. Add narrowly scoped reduced-transparency and increased-contrast fallbacks in the shared stylesheet, then verify the existing Orders and form routes.

**Tech Stack:** React, TypeScript, Tailwind CSS, CSS media queries, Node test runner, Vite.

## Global Constraints

- The first event in `order.eventEntries` remains the sole theme owner for a multi-event order.
- Merchandise-only and unbranded orders continue to use `PLANOUT_EVENT_BRAND`.
- Use one ambient image layer and one frosted veil per order card; do not add multi-step progressive blur stacks.
- Reuse existing images and brand tokens; add no dependency, canvas extraction, generated asset, or remote image-processing service.
- Preserve the existing `18px` radius, card dimensions, mobile list/desktop grid, filters, title, summary, price, status wording, status-dot meaning, detail navigation, and form routes.
- Keep all decorative layers pointer-inert and hidden from assistive technology.
- Under reduced motion, remove hover lift. Under reduced transparency, remove the ambient image and blur. Under increased contrast, strengthen the edge and muted text.
- Do not commit or stage changes in the user's existing dirty `main` checkout.

---

### Task 1: Apple-like frosted order material

**Files:**
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `src/styles/index.css`
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: `getOrderCardBrand(order: OrderRecord)`, `getOrderGraphicImages(order): string[]`, `alpha(hex: string, opacity: number)`, and the existing `ImageWithFallback` component.
- Produces: `getOrderAmbientImage(order: OrderRecord): string`, expanded CSS variables from `getOrderCardStyle(order)`, the `.order-glass-card` material shell, and accessibility media-query fallbacks.

- [x] **Step 1: Write the failing source regression**

Extend `tests/orders-ui-consistency.test.mjs` with stylesheet input and an Apple-material test:

```js
const stylesSource = fs.readFileSync(
  new URL('../src/styles/index.css', import.meta.url),
  'utf8',
);

test('Orders cards use one Apple-like frosted material with accessible fallbacks', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderAmbientImage('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(orderCardSource, /function getOrderAmbientImage\(order: OrderRecord\)/);
  assert.match(orderCardSource, /getOrderGraphicImages\(order\)\[0\] \|\| ''/);
  assert.match(orderCardSource, /data-testid="order-glass-ambient"/);
  assert.match(orderCardSource, /data-testid="order-glass-tint"/);
  assert.match(orderCardSource, /data-testid="order-glass-material"/);
  assert.match(orderCardSource, /data-testid="order-glass-highlight"/);
  assert.match(orderCardSource, /blur-\[18px\]/);
  assert.match(orderCardSource, /backdrop-blur-\[16px\]/);
  assert.match(orderCardSource, /backdrop-saturate-\[130%\]/);
  assert.match(orderCardSource, /className="relative z-10 grid/);
  assert.match(orderCardSource, /bg-white\/70 backdrop-blur-\[14px\]/);
  assert.match(orderCardSource, /bg-\[rgba\(7,12,18,0\.66\)\] backdrop-blur-\[10px\]/);
  assert.match(orderCardSource, /--order-card-tint-from/);
  assert.match(orderCardSource, /--order-card-solid/);
  assert.match(orderCardSource, /order-glass-card/);
  assert.doesNotMatch(orderCardSource, /gradient-blur|nth-of-type\(6\)|blur\(64px\)/);

  assert.match(stylesSource, /@media \(prefers-reduced-transparency: reduce\)/);
  assert.match(stylesSource, /\.order-glass-card \[data-testid="order-glass-ambient"\][\s\S]*?display: none/);
  assert.match(stylesSource, /backdrop-filter: none/);
  assert.match(stylesSource, /@media \(prefers-contrast: more\)/);
  assert.match(stylesSource, /\.order-glass-card \.order-card-muted/);
});
```

In the existing `Orders overview uses event-image card stacks with the order state in the action position` test, replace the old button-owned grid assertion:

```js
assert.match(ordersSource, /grid w-full grid-cols-\[96px_minmax\(0,1fr\)\]/);
```

with the new foreground-grid assertion:

```js
assert.match(ordersSource, /className="relative z-10 grid grid-cols-\[96px_minmax\(0,1fr\)\]/);
```

In the existing first-event theme test, replace the assertions for the old radial background with assertions for the material tint tokens:

```js
assert.match(orderCardSource, /--order-card-tint-from/);
assert.match(orderCardSource, /--order-card-tint-to/);
assert.match(orderCardSource, /linear-gradient\(135deg, \$\{brand\.pageBackground\} 0%, \$\{brand\.pageBackgroundTo\} 100%\)/);
```

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
```

Expected: the new material test fails because `getOrderAmbientImage`, the glass layers, and the accessibility fallbacks do not exist.

- [x] **Step 3: Expand the material tokens and ambient-image helper**

In `src/app/pages/OrdersPage.tsx`, import `alpha` and replace the current flat surface style with explicit material tokens:

```tsx
import { alpha, getEventBrand, PLANOUT_EVENT_BRAND } from '@/app/data/eventBrand';

function getOrderAmbientImage(order: OrderRecord) {
  return getOrderGraphicImages(order)[0] || '';
}

function getOrderCardStyle(order: OrderRecord) {
  const brand = getOrderCardBrand(order);

  return {
    '--order-card-fg': brand.pageForeground,
    '--order-card-muted': brand.pageMuted,
    '--order-card-subtle': brand.pageSubtle,
    '--order-card-border': brand.pageBorder,
    '--order-card-surface': brand.surface,
    '--order-card-accent': brand.accent,
    '--order-card-tint-from': alpha(brand.pageBackground, 0.76),
    '--order-card-tint-to': alpha(brand.pageBackgroundTo, 0.88),
    '--order-card-solid': brand.pageBackgroundTo,
    '--order-card-shadow': brand.accentShadow,
    background: `linear-gradient(135deg, ${brand.pageBackground} 0%, ${brand.pageBackgroundTo} 100%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.34), inset 0 0 0 1px rgba(255,255,255,0.10), 0 8px 8px -8px ${brand.accentShadow}`,
    color: brand.pageForeground,
  } as React.CSSProperties;
}
```

- [x] **Step 4: Build the single-layer frosted material shell**

Inside `OrderCard`, keep the button as the interaction boundary, make it an isolated clipped material shell, add four aria-hidden decorative layers, and wrap the unchanged layout in a foreground grid:

```tsx
const ambientImage = getOrderAmbientImage(order);

<button
  type="button"
  onClick={onOpen}
  style={getOrderCardStyle(order)}
  className="order-glass-card group relative isolate w-full overflow-hidden rounded-[18px] text-left transition-[filter,transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:brightness-[1.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef4f4] active:translate-y-0 active:scale-[0.99] motion-reduce:hover:translate-y-0"
>
  {ambientImage && (
    <span data-testid="order-glass-ambient" aria-hidden="true" className="pointer-events-none absolute inset-[-14px] opacity-[0.22]">
      <ImageWithFallback
        src={ambientImage}
        alt=""
        draggable={false}
        className="h-full w-full scale-110 object-cover blur-[18px] saturate-[125%]"
      />
    </span>
  )}
  <span
    data-testid="order-glass-tint"
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
    style={{ background: 'linear-gradient(135deg, var(--order-card-tint-from) 0%, var(--order-card-tint-to) 100%)' }}
  />
  <span data-testid="order-glass-material" aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/[0.055] backdrop-blur-[16px] backdrop-saturate-[130%]" />
  <span
    data-testid="order-glass-highlight"
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-200 ease-out group-hover:opacity-100 motion-reduce:transition-none"
    style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.075) 28%, transparent 52%, rgba(0,0,0,0.10) 100%)' }}
  />

  <div className="relative z-10 grid grid-cols-[96px_minmax(0,1fr)] gap-3.5 px-3.5 py-3.5 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-4 sm:px-4 sm:py-4">
    <div className="h-[92px] w-[96px] shrink-0 sm:h-[104px] sm:w-[112px]">
      <OrderEventCardStack order={order} state={getOrderState(order)} variant={getOrderGraphicVariant(order)} />
    </div>

    <div className="flex min-w-0 min-h-[92px] flex-col justify-between sm:min-h-[104px]">
      <div>
        <p className="order-card-muted text-right text-[11px] font-semibold text-[var(--order-card-muted)]">{order.date}</p>
        <h2 className="mt-1.5 line-clamp-2 text-[16px] font-bold leading-[1.12] tracking-[-0.3px] text-[var(--order-card-fg)] sm:text-[18px] sm:leading-[1.15]">
          {order.name}
        </h2>
        <p className="order-card-muted mt-1 line-clamp-1 text-[12.5px] font-semibold leading-none text-[var(--order-card-muted)] sm:text-[13px]">
          {getItemSummary(order)}
        </p>
      </div>

      <div className="mt-2.5 flex min-w-0 items-center justify-end gap-3">
        <span className="shrink-0 tabular-nums text-[15px] font-bold leading-none tracking-[-0.2px] text-[var(--order-card-fg)] sm:text-[16px]">
          {formatMoney(getOrderTotal(order))}
        </span>
      </div>
    </div>
  </div>
</button>
```

Apply `order-card-muted` to the date and summary elements in addition to their existing text-variable class so the contrast fallback can target them.

- [x] **Step 5: Frost the mini card frame and status material**

Replace only the opaque material classes in `OrderEventCardStack`:

```tsx
className="absolute h-[86px] w-[82px] overflow-hidden rounded-[13px] bg-white/70 p-[3px] pb-[23px] backdrop-blur-[14px] backdrop-saturate-[125%] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),inset_0_0_0_1px_rgba(255,255,255,0.38),0_2px_8px_rgba(7,12,18,0.18)] sm:h-[98px] sm:w-[92px] sm:rounded-[15px] sm:pb-[25px]"
```

```tsx
className="absolute inset-x-[5px] bottom-[4px] flex h-[15px] items-center justify-center gap-1 whitespace-nowrap rounded-[5px] bg-[rgba(7,12,18,0.66)] px-1 text-center text-[7px] font-bold leading-none tracking-[-0.12px] text-white backdrop-blur-[10px] backdrop-saturate-[135%] shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_1px_3px_rgba(0,0,0,0.18)] sm:bottom-[5px] sm:h-[16px] sm:text-[8px]"
```

- [x] **Step 6: Add reduced-transparency and increased-contrast fallbacks**

Append to `src/styles/index.css`:

```css
@media (prefers-reduced-transparency: reduce) {
  .order-glass-card [data-testid="order-glass-ambient"] {
    display: none;
  }

  .order-glass-card [data-testid="order-glass-material"] {
    background: color-mix(in srgb, var(--order-card-solid) 94%, black 6%);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .order-glass-card {
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.58);
  }

  .order-glass-card .order-card-muted {
    color: rgba(255, 255, 255, 0.92);
  }
}
```

- [x] **Step 7: Run focused and complete verification**

Run:

```bash
node --test --test-reporter=spec tests/orders-ui-consistency.test.mjs
node --test --test-reporter=spec tests/*.test.mjs
npm run build
git diff --check
```

Expected: the focused test and all project tests pass with zero failures; Vite exits successfully; diff check prints no errors. Existing Vite chunk-size and mixed dynamic/static import warnings may remain.

- [x] **Step 8: Perform live visual and flow QA**

At the Orders route, inspect the dark-green Futsal card, PlanOut teal merchandise card, earth Canlaon card, and maroon Basketball card. Confirm:

- the event color and ambient image remain recognizable beneath the material;
- the title, date, summary, amount, and status remain readable;
- the mini event stack is crisp and visibly frosted rather than opaque;
- no decorative layer intercepts clicks or appears in the accessibility tree;
- Pending still contains `7` rows and Complete still contains `8` rows;
- the Futsal order still opens `/orders/tkt-013`;
- Player 8 `Fill up` still opens `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`;
- the browser console remains free of warnings and errors.

Append the observed result and any corrected P0/P1/P2 issues to `design-qa.md`.
