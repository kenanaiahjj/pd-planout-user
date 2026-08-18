# Order Registration Grouped List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace separate Registration event cards with one continuous grouped list while preserving every existing action and state.

**Architecture:** Keep `RegistrationItem`, `TeamRegistrationItem`, `PassportBanner`, and the existing state/actions as the behavior owners. Move outer surface styling to one wrapper in `OrderDetailPage`, make `RegistrationItemShell` an unboxed semantic event section, and shorten only the ready-state presentation copy.

**Tech Stack:** React, TypeScript, Tailwind CSS, existing PlanOut button primitives, Node test runner

## Global Constraints

- Use one shared Registration surface with subtle event dividers.
- Keep every event thumbnail, title, date, status, and action.
- Keep one filled primary action where a next step exists; supporting actions remain secondary.
- Preserve all form, invite, Passport QR, Guest QR, team-player, and removal behavior.
- Do not add routes, schema, dependencies, motion, or unrelated refactors.
- Preserve the dirty worktree and do not stage or commit.

---

### Task 1: Lock the grouped-list hierarchy with failing tests

**Files:**
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `tests/order-form-sharing.test.mjs`

**Interfaces:**
- Consumes: the source text of `src/app/pages/OrdersPage.tsx`.
- Produces: source contracts for `registration-event-list`, `RegistrationItemShell`, concise ready-state copy, and preserved QR actions.

- [x] **Step 1: Add the grouped-surface regression**

```js
test('registration events share one continuous grouped surface', () => {
  const registrationSource = ordersSource.slice(
    ordersSource.indexOf('function RegistrationCardHeader'),
    ordersSource.indexOf('function ShippingTracker'),
  );

  assert.match(ordersSource, /data-testid="registration-event-list"/);
  assert.match(ordersSource, /data-testid="registration-event-list"[\s\S]*divide-y divide-\[#e7ecef\]/);
  assert.match(registrationSource, /data-testid="registration-event-item"/);
  assert.doesNotMatch(registrationSource, /overflow-hidden rounded-\[16px\] border border-\[#e2e8e7\] bg-white/);
});
```

- [x] **Step 2: Add the concise ready-state regression**

```js
test('ready registration status is concise without losing QR access', () => {
  const passportBannerSource = ordersSource.slice(
    ordersSource.indexOf('function PassportBanner'),
    ordersSource.indexOf('function RegistrationItem({'),
  );

  assert.match(passportBannerSource, />\s*Ready for gate\s*</);
  assert.match(passportBannerSource, />\s*Universal QR\s*</);
  assert.doesNotMatch(passportBannerSource, /Ready for gate - staff scans your universal QR\./);
  assert.match(passportBannerSource, /<PrimaryButton[\s\S]*>\s*View QR\s*<\/PrimaryButton>/);
});
```

- [x] **Step 3: Run the focused tests and verify RED**

Run: `node --test tests/orders-ui-consistency.test.mjs tests/order-form-sharing.test.mjs`

Expected: FAIL because the shared list wrapper, unboxed item contract, and concise ready-state copy do not exist yet.

### Task 2: Implement the shared Registration surface

**Files:**
- Modify: `src/app/pages/OrdersPage.tsx`

**Interfaces:**
- Consumes: `registrationEntries`, `RegistrationItemShell`, and the existing registration state components.
- Produces: one `registration-event-list` containing semantic `registration-event-item` articles.

- [x] **Step 1: Move the outer surface to the list wrapper**

Wrap the existing `registrationEntries.map(...)` call:

```tsx
<div
  data-testid="registration-event-list"
  className="divide-y divide-[#e7ecef] overflow-hidden rounded-[20px] border border-[#dfe7e5] bg-white shadow-[0_18px_44px_-38px_rgba(15,23,42,0.5)]"
>
  {registrationEntries.map((entry) => (
    <RegistrationItem
      key={entry.id}
      entry={entry}
      orderId={order.id}
      order={order}
      teamEntries={order.eventEntries.filter((item) => item.type === 'team' && item.ticket.id === entry.ticket.id)}
    />
  ))}
</div>
```

- [x] **Step 2: Make each event shell an unboxed list item**

```tsx
function RegistrationItemShell({
  title,
  date,
  image,
  children,
}: {
  title: string;
  date: string;
  image?: string;
  children: React.ReactNode;
}) {
  return (
    <article data-testid="registration-event-item" className="bg-transparent">
      <RegistrationCardHeader title={title} date={date} image={image} />
      {children}
    </article>
  );
}
```

Remove the repeated event-card border/radius and use the shared list divider for event separation. Keep the event header transparent and compact.

- [x] **Step 3: Shorten ready-state presentation copy**

Replace the ready sentence with a compact status line:

```tsx
<div className="flex min-w-0 items-center gap-2">
  <span className="inline-flex w-fit rounded-full bg-[#e4f4ef] px-2.5 py-1 text-[11px] font-semibold text-[#177564] ring-1 ring-[#cfe3de]">
    Ready for gate
  </span>
  <span className="text-[11px] font-medium text-[#7b8b9a]">Universal QR</span>
</div>
```

- [x] **Step 4: Run focused tests and verify GREEN**

Run: `node --test tests/orders-ui-consistency.test.mjs tests/order-form-sharing.test.mjs`

Expected: both files pass with zero failures.

### Task 3: Verify the live grouped list

**Files:**
- Verify: `src/app/pages/OrdersPage.tsx`
- Verify: `tests/orders-ui-consistency.test.mjs`
- Verify: `tests/order-form-sharing.test.mjs`

**Interfaces:**
- Consumes: the completed grouped-list implementation.
- Produces: test, build, layout, interaction, and browser-console evidence.

- [x] **Step 1: Run repository verification**

Run:

```bash
node --test --test-reporter=dot tests/*.test.mjs
npm run build
git diff --check -- src/app/pages/OrdersPage.tsx tests/orders-ui-consistency.test.mjs tests/order-form-sharing.test.mjs
```

Expected: zero test failures, production build exit code 0, and no whitespace errors.

- [x] **Step 2: Browser-check the multi-event order**

At `http://localhost:5173/orders/tkt-001` with a `400 × 964` viewport, verify:

- one shared Registration surface contains all three events;
- event dividers are visible without separate card gaps;
- the ready event says `Ready for gate` and `Universal QR`;
- the pending event keeps `Fill up`, `Send link`, and `Copy link` with one filled primary action;
- `View form`, `View QR`, bulk email review, Cancel, and close still work;
- no horizontal overflow or browser warning/error is present.
