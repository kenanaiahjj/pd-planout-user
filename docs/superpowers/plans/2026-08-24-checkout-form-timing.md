# Checkout form timing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make mixed-event checkout disclose all form timing before payment while showing only before-payment forms in the active gate.

**Architecture:** Keep `getItemFormTiming` as the source of truth. Derive separate pending collections for gated (`before_checkout`) and deferred (`after_checkout`) entries. Render gated entries in the existing pre-payment navigator, add a neutral inline summary for deferred entries, and reuse the existing payment-screen reminder after the gate.

**Tech Stack:** React, TypeScript, Tailwind utility classes, Node test runner, Vite, in-app browser verification.

## Global Constraints

- Preserve each event's configured form timing.
- Show only `before_checkout` entries in the pre-payment progress and editable tabs.
- Disclose every pending `after_checkout` form before payment.
- Use the existing participant form surface tokens: white fields, `#f8fafc` muted surfaces, `#dce5e1` borders, and restrained PlanOut green.
- Do not change the underlying order schema or infer timing from event names.
- Keep the existing `Fill up later` behavior and payment flow.

---

### Task 1: Add failing regression coverage

**Files:**
- Modify: `tests/checkout-confirmation.test.mjs`
- Modify: `tests/participant-form-neutral-surface.test.mjs`

**Interfaces:**
- Consumes: the current `CheckoutPage.tsx` source and participant form style block.
- Produces: failing tests that require separate gated/deferred collections and field-aligned segmented-choice styles.

- [ ] **Step 1: Add the mixed-timing source test**

Append this test to `tests/checkout-confirmation.test.mjs`:

```js
test('mixed checkout separates required-now forms from after-payment forms', () => {
  const gateStart = checkoutSource.indexOf('{showPreCheckoutForms && (');
  const gateEnd = checkoutSource.indexOf('{!showPreCheckoutForms && (', gateStart);
  const gateSource = checkoutSource.slice(gateStart, gateEnd);

  assert.match(checkoutSource, /const preCheckoutVisibleSlots = gatedSlots;/);
  assert.match(checkoutSource, /const afterCheckoutPendingSlots = useMemo/);
  assert.match(checkoutSource, /const afterCheckoutPreviewItems = useMemo/);
  assert.match(gateSource, /<DeferredCheckoutFormsSummary/);
  assert.match(gateSource, /Required before payment/);
  assert.doesNotMatch(checkoutSource, /const preCheckoutVisibleSlots = pendingCheckoutFormSlots/);
});
```

- [ ] **Step 2: Replace the stale segmented-choice expectation**

Update the selected-state test in `tests/participant-form-neutral-surface.test.mjs` so that owner choices can retain their semantic green tint while the shared delivery-mode control uses field-aligned white selection:

```js
test('participant form keeps selection states distinct without a tinted segmented track', () => {
  assert.match(participantFormStyles, /\.participant-form-owner-choice\[data-selected\][\s\S]*?background:\s*#edf8f4/i);
  assert.match(participantFormStyles, /\.segmented-choice\s*\{[\s\S]*?background:\s*#f8fafc/i);
  assert.match(participantFormStyles, /\.segmented-choice__item\[data-selected\][\s\S]*?background:\s*#ffffff/i);
  assert.match(participantFormStyles, /\.segmented-choice__item\[data-selected\][\s\S]*?border-color:\s*var\(--participant-border-strong\)/i);
});
```

- [ ] **Step 3: Run the focused tests and confirm they fail**

Run:

```bash
node --test tests/checkout-confirmation.test.mjs tests/participant-form-neutral-surface.test.mjs
```

Expected: FAIL because the current pre-payment collection is `pendingCheckoutFormSlots`, the deferred summary is not rendered in the gate, and the segmented choice still uses `#e9efec` / `#edf8f4`.

### Task 2: Split gated and deferred form data and add the summary component

**Files:**
- Modify: `src/app/components/CheckoutPage.tsx:200-310, 936-980`

**Interfaces:**
- Consumes: `DeferredFormPreviewItem`, `formSlots`, `getItemFormTiming`, and `gatedSlots`.
- Produces: `DeferredCheckoutFormsSummary({ items })` and `afterCheckoutPreviewItems` for the pre-payment gate.

- [ ] **Step 1: Add the neutral deferred-summary component**

Place this component beside `FormRequirementsPreview`:

```tsx
function DeferredCheckoutFormsSummary({ items }: { items: DeferredFormPreviewItem[] }) {
  if (items.length === 0) return null;

  const eventCount = new Set(items.map((item) => item.eventName)).size;

  return (
    <section
      className="participant-form-deferred-summary overflow-hidden rounded-[16px] border border-[#dce5e1] bg-[#f8fafc]"
      aria-labelledby="after-payment-forms-heading"
    >
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#177564] ring-1 ring-[#e5ece8]">
          <ClipboardList className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6a817b]">
            After payment
          </p>
          <h3 id="after-payment-forms-heading" className="mt-1 text-[14px] font-semibold text-[#18201d]">
            {items.length} more form{items.length === 1 ? '' : 's'} from {eventCount} event{eventCount === 1 ? '' : 's'}
          </h3>
          <p className="mt-1 text-[12px] leading-relaxed text-[#5f6f68]">
            These forms do not block payment. You can complete them from confirmation, Orders, or Passport.
          </p>
        </div>
      </div>
      <div className="divide-y divide-[#e5ece8] border-t border-[#e5ece8] bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#b8cec7]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[#34413c]">{item.eventName}</p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-[#6a817b]">{item.category} · {item.label}</p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold text-[#6a817b]">After payment</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Derive only pending deferred slots for the summary**

Keep the existing `pendingCheckoutFormSlots` for the payment-screen reminder, then add:

```tsx
  const afterCheckoutPendingSlots = useMemo(
    () => pendingCheckoutFormSlots.filter((slot) => getItemFormTiming(slot.item) === 'after_checkout'),
    [pendingCheckoutFormSlots, getItemFormTiming],
  );
  const afterCheckoutPreviewItems = useMemo<DeferredFormPreviewItem[]>(
    () => afterCheckoutPendingSlots.map((slot) => ({
      id: slot.id,
      eventName: slot.item.eventName,
      category: slot.item.category,
      label: slot.label,
      deadline: 'May 30, 2026',
    })),
    [afterCheckoutPendingSlots],
  );
```

- [ ] **Step 3: Scope the pre-payment collection to gated slots**

Replace the current assignment:

```tsx
  const preCheckoutVisibleSlots = gatedSlots;
```

The existing `gatedCompleteCount`, `gatedTotalCount`, `preCheckoutCompleteCount`, and `preCheckoutTotalCount` then all refer to the same required-now set.

- [ ] **Step 4: Run the focused data/component tests**

Run:

```bash
node --test tests/checkout-confirmation.test.mjs
```

Expected: the new source test still fails only for the missing gate render and UI copy; the data-scope assertions pass.

### Task 3: Redesign the pre-payment gate UI

**Files:**
- Modify: `src/app/components/CheckoutPage.tsx:2668-2980`

**Interfaces:**
- Consumes: `preCheckoutVisibleSlots`, `preCheckoutCompleteCount`, `preCheckoutTotalCount`, and `afterCheckoutPreviewItems`.
- Produces: a compact fixed mobile header, gated-only navigator, active form, and visible deferred summary.

- [ ] **Step 1: Replace the gate header hierarchy**

Use this structure inside the existing `showPreCheckoutForms` branch:

```tsx
<div className="participant-form-premium space-y-4 pt-[116px] lg:pt-0" data-pre-payment-gate>
  <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-10 h-[172px] bg-[#f8fafc]/96 lg:hidden" />
  <div className="fixed left-3 right-3 top-[70px] z-20 rounded-[14px] border border-[#dce5e1] bg-white px-3 py-3 shadow-[0_8px_18px_-16px_rgba(20,39,32,0.42)] sm:left-8 sm:right-8 lg:sticky lg:left-auto lg:right-auto lg:top-3">
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#eef8f5] text-[#177564]">
          <ClipboardList className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6a817b]">Required before payment</p>
          <h2 className="mt-0.5 truncate text-[14px] font-semibold leading-tight text-[#18201d]">Participant details</h2>
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-[#dce5e1] bg-[#f8fafc] px-2.5 py-1 text-[12px] font-semibold text-[#34413c]">
        {preCheckoutCompleteCount}/{preCheckoutTotalCount}
      </span>
    </div>

    <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {preCheckoutVisibleSlots.map((slot, index) => {
        const data = slotsData[slot.id];
        const isActive = activeSlotId === slot.id;
        const isComplete = isSlotComplete(data, slot.item);
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => setActiveSlotId(slot.id)}
            aria-current={isActive ? 'step' : undefined}
            className={`flex min-h-[50px] min-w-[190px] max-w-[230px] shrink-0 items-center gap-2 rounded-[11px] border px-2.5 text-left transition-colors active:scale-[0.99] sm:min-w-[210px] ${isActive ? 'border-[#b8cec7] bg-[#f8fbfa]' : 'border-[#e5ece8] bg-white hover:bg-[#f8fafc]'}`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isComplete ? 'bg-[#e4f4ef] text-[#177564]' : isActive ? 'bg-[#eef8f5] text-[#177564]' : 'bg-[#f1f5f3] text-[#6a817b]'}`}>
              {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-semibold leading-tight text-[#34413c]">{slot.item.category}</span>
              <span className="mt-0.5 block truncate text-[10px] font-medium text-[#6a817b]">{slot.item.eventName}</span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add the after-payment summary below the active form**

Render this immediately after the gated form map and before the primary/secondary gate actions:

```tsx
  <DeferredCheckoutFormsSummary items={afterCheckoutPreviewItems} />

  <div className="mt-1 flex flex-col gap-2">
```

Keep the existing `Save details and continue` and `Fill up later` handlers unchanged.

- [ ] **Step 3: Run the focused UI/source tests**

Run:

```bash
node --test tests/checkout-confirmation.test.mjs tests/participant-form-neutral-surface.test.mjs
```

Expected: PASS.

### Task 4: Align the shared segmented control with form fields

**Files:**
- Modify: `src/styles/index.css:157-175`

**Interfaces:**
- Consumes: the existing `participant-form-premium` token variables.
- Produces: a neutral track and white selected option for both checkout and participant forms.

- [ ] **Step 1: Replace the green-gray segmented palette**

Update the existing rules to:

```css
.participant-form-premium .segmented-choice {
  background: var(--participant-surface-muted);
  border: 1px solid var(--participant-border);
  border-radius: 12px;
  gap: 3px;
  padding: 3px;
}

.participant-form-premium .segmented-choice__item {
  color: var(--participant-muted);
  border-radius: 10px;
}

.participant-form-premium .segmented-choice__item[data-selected] {
  background: var(--participant-surface);
  border-color: var(--participant-border-strong);
  color: var(--participant-accent);
  box-shadow: 0 1px 2px rgba(20, 39, 32, 0.06);
}
```

- [ ] **Step 2: Run the style test**

Run:

```bash
node --test tests/participant-form-neutral-surface.test.mjs
```

Expected: PASS.

### Task 5: Verify the mixed-event behavior and finish

**Files:**
- Test: `tests/checkout-confirmation.test.mjs`
- Test: `tests/participant-form-neutral-surface.test.mjs`
- Verify: `src/app/components/CheckoutPage.tsx`
- Verify: `src/styles/index.css`

- [ ] **Step 1: Run the complete test suite**

```bash
node --test --test-reporter=dot tests/*.test.mjs
```

Expected: exit code `0`.

- [ ] **Step 2: Build the production bundle**

```bash
npm run build
```

Expected: exit code `0`; existing Vite chunk/dynamic-import warnings may remain.

- [ ] **Step 3: Check whitespace and inspect the focused diff**

```bash
git diff --check
git diff -- src/app/components/CheckoutPage.tsx src/styles/index.css tests/checkout-confirmation.test.mjs tests/participant-form-neutral-surface.test.mjs
```

Expected: no whitespace errors and only the scoped checkout/style/test changes.

- [ ] **Step 4: Verify the live mixed cart in the browser**

Open `http://localhost:5173/checkout` in the in-app browser with the multiple-event fixture. Confirm:

- The gate count reflects only before-payment forms.
- Gated tabs do not include after-payment entries.
- The after-payment summary names the deferred event(s) before payment.
- `Fill up later` still returns to payment.
- The segmented choice uses a neutral track and white selected option.
- No browser errors or warnings are logged.

- [ ] **Step 5: Commit the focused implementation**

```bash
git add src/app/components/CheckoutPage.tsx src/styles/index.css tests/checkout-confirmation.test.mjs tests/participant-form-neutral-surface.test.mjs
git commit -m "feat: clarify mixed checkout form timing"
```
