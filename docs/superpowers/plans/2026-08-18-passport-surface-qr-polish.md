# Passport Surface and QR Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Passport one continuous white surface, rename its holder stamp, and give the QR credential a crisp, premium frame without changing its payload or interactions.

**Architecture:** `RootLayout` owns the route-level surface color, `PassportPage` owns the page wrapper, and `PlanOutPassportCard` owns QR rendering and holder branding. A focused source-contract test covers those three owners; no route, data, or event-handler refactor is needed.

**Tech Stack:** React, TypeScript, Tailwind utility classes, Node's built-in test runner, Vite.

## Global Constraints

- Keep `/passport` and `/passport/add-entry` on a solid white surface.
- Render the holder wordmark as `PlanOut Passport`.
- Preserve the QR payload, `Open Passport QR` label, click/drag/reveal behavior, and download behavior.
- Keep QR modules dark and square with a visible quiet zone.
- Keep the forest-green holder, metallic card, colorful action tabs, add-event section, and bottom navigation unchanged.
- Preserve current scaling, safe-area spacing, scrolling, and reduced-motion behavior.

---

### Task 1: Lock the Passport surface, branding, and QR presentation contract

**Files:**
- Create: `tests/passport-surface-qr-polish.test.mjs`
- Modify: `src/app/layouts/RootLayout.tsx:108-230`
- Modify: `src/app/pages/PassportPage.tsx:773`
- Modify: `src/app/components/PlanOutPassportCard.tsx:23-111,381-430,470-485`

**Interfaces:**
- Consumes: Existing route shell, Passport page wrapper, QR renderer, and holder wordmark.
- Produces: A white Passport route family, `PlanOut Passport` branding, and shared premium QR styling with existing interaction hooks intact.

- [ ] **Step 1: Write the failing source-contract tests**

Create `tests/passport-surface-qr-polish.test.mjs` with:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rootLayoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);
const passportPageSource = fs.readFileSync(
  new URL('../src/app/pages/PassportPage.tsx', import.meta.url),
  'utf8',
);
const passportCardSource = fs.readFileSync(
  new URL('../src/app/components/PlanOutPassportCard.tsx', import.meta.url),
  'utf8',
);

test('Passport route family uses one continuous white surface', () => {
  assert.match(rootLayoutSource, /const isPassportRoute = pathname\.startsWith\('\/passport'\);/);
  assert.match(rootLayoutSource, /backgroundColor: isGuestQrPage \|\| isPassportRoute \? '#ffffff' : '#f8fafc'/);
  assert.match(passportPageSource, /min-h-dvh overflow-x-hidden bg-white/);
  assert.doesNotMatch(passportPageSource, /min-h-dvh overflow-x-hidden bg-\[#eef7f5\]/);
});

test('Passport holder uses the PlanOut Passport wordmark', () => {
  assert.match(passportCardSource, />PlanOut Passport<\/span>/);
  assert.doesNotMatch(passportCardSource, />Passport Holder<\/span>/);
});

test('Passport QR keeps its payload hooks and uses a premium crisp tile', () => {
  assert.match(passportCardSource, /function PassportQrMini/);
  assert.match(passportCardSource, /data-qr-material="premium"/);
  assert.match(passportCardSource, /shapeRendering="crispEdges"/);
  assert.match(passportCardSource, /fill="#0f172b"/);
  assert.match(passportCardSource, /#d9ebe6/);
  assert.match(passportCardSource, /ring-1 ring-\[#177564\]\/10/);
  assert.match(passportCardSource, /Open Passport QR/);
  assert.match(passportCardSource, /qr-code-button/);
  assert.match(passportCardSource, /createPassportQrSvg/);
  assert.doesNotMatch(passportCardSource, /backdrop-blur-sm/);
  assert.doesNotMatch(passportCardSource, /rx="0\.5"/);
});
```

- [ ] **Step 2: Run the focused tests and verify they fail against the current UI source**

Run:

```bash
node --test tests/passport-surface-qr-polish.test.mjs
```

Expected: all three tests fail because the route still uses `#f8fafc`/`#eef7f5`, the holder still says `Passport Holder`, and the QR renderer has no premium marker or crisp-edge contract.

- [ ] **Step 3: Make the route and page surfaces white**

In `src/app/layouts/RootLayout.tsx`, add this derived flag next to the existing route flags:

```tsx
const isPassportRoute = pathname.startsWith('/passport');
```

Update the non-event shell style to:

```tsx
style={currentEvent ? getBrandSurfaceStyle(currentEvent) : { backgroundColor: isGuestQrPage || isPassportRoute ? '#ffffff' : '#f8fafc' }}
```

In `src/app/pages/PassportPage.tsx`, change the page root from:

```tsx
<div className="min-h-dvh overflow-x-hidden bg-[#eef7f5] px-3 pb-[calc(118px+env(safe-area-inset-bottom))] pt-[calc(32px+env(safe-area-inset-top))]">
```

to:

```tsx
<div className="min-h-dvh overflow-x-hidden bg-white px-3 pb-[calc(118px+env(safe-area-inset-bottom))] pt-[calc(32px+env(safe-area-inset-top))]">
```

- [ ] **Step 4: Upgrade the QR tile and rename the holder stamp**

In `PassportQrMini`, make each active module crisp and the SVG tile premium:

```tsx
<rect
  key={`${r}-${c}`}
  x={c * cellSize}
  y={r * cellSize}
  width={cellSize * 0.86}
  height={cellSize * 0.86}
  fill="#0f172b"
/>
```

```tsx
<svg
  data-qr-material="premium"
  viewBox="0 0 100 100"
  shapeRendering="crispEdges"
  className={`h-full w-full aspect-square rounded-[15px] border border-[#d9ebe6] bg-white p-2.5 shadow-[0_14px_28px_-20px_rgba(15,23,42,0.52),inset_0_1px_0_rgba(255,255,255,0.98)] ring-1 ring-[#177564]/10 ${className || ''}`}
>
```

Remove `rx="0.5"` and `backdrop-blur-sm` from the compact QR renderer. Apply the same white/mint frame language to the compact and expanded QR wrapper classes, preserving their existing dimensions and `qr-code-button` class. Change the holder wordmark text to:

```tsx
<span className="mt-1 text-[8.5px] font-bold uppercase tracking-[3.5px] text-[#b8ddd5]/70">
  PlanOut Passport
</span>
```

Keep `createPassportQrSvg`, `qrPayload`, `Open Passport QR`, drag/reveal callbacks, and all action tabs intact.

- [ ] **Step 5: Run focused tests and verify the contract passes**

Run:

```bash
node --test tests/passport-surface-qr-polish.test.mjs tests/cardholder-components.test.mjs tests/passport-past-event-card.test.mjs
```

Expected: all focused Passport tests pass.

- [ ] **Step 6: Run full verification**

Run:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check -- src/app/layouts/RootLayout.tsx src/app/pages/PassportPage.tsx src/app/components/PlanOutPassportCard.tsx tests/passport-surface-qr-polish.test.mjs
```

Expected: the full Node suite passes, Vite produces a successful production build, and `git diff --check` reports no whitespace errors. Leave implementation changes uncommitted so existing unrelated worktree changes remain untouched.
