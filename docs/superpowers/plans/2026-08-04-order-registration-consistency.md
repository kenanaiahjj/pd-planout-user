# Order Registration Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make individual and team registration items use one shared Orders visual language without changing access, ownership, invite, QR, or payment behavior.

**Architecture:** Keep the existing `OrdersPage.tsx` data and route model. Add small presentational primitives in that file for the shared registration card header, state panel, and action row; use them from both the individual `RegistrationItem` path and the team `TeamRegistrationItem` path. Preserve `PassportBanner` as the state decision point, but make every active state render through the shared primitives.

**Tech Stack:** React, TypeScript/TSX, Tailwind utility classes, lucide-react, Motion, Node test runner, Vite.

## Global Constraints

- One shared registration-card shell for every registration item.
- The existing product rules remain unchanged: a buyer-filled form produces Guest QR access, while a recipient-completed claim form attaches to that recipient's Passport.
- The team remains one purchase and one financial registration item; player rows are operational sub-items, not separate order cards.
- Every action keeps a 44px minimum touch target and visible focus ring.
- Primary actions remain teal; indigo is reserved for claim/access ownership state; amber and red remain reserved for action-required and invalidated states.
- Existing email review, bulk email review, copy-link, Guest QR, Passport, unsend, and add-player behavior must remain intact.
- No new modal, route, purchase-data change, ownership-data change, or QR-generation rule is in scope.

---

### Task 1: Add failing consistency assertions

**Files:**
- Modify: `/Users/kenanaiahjolmfc/Desktop/PlanOut Prototype/tests/order-form-sharing.test.mjs`
- Test: `/Users/kenanaiahjolmfc/Desktop/PlanOut Prototype/tests/order-form-sharing.test.mjs`

**Interfaces:**
- Consumes: the existing source-string assertions for `OrdersPage.tsx` and the existing team/individual behavior tests.
- Produces: red tests that require shared `RegistrationCardHeader`, `RegistrationStatePanel`, and `RegistrationActionRow` usage from both registration paths.

- [ ] **Step 1: Write the failing test**

Add this test after the existing `team order copy is concise without removing the ownership cue` test:

```js
test('individual and team registration items share the same visual primitives', () => {
  assert.match(ordersSource, /function RegistrationCardHeader/);
  assert.match(ordersSource, /function RegistrationStatePanel/);
  assert.match(ordersSource, /function RegistrationActionRow/);
  assert.match(ordersSource, /<RegistrationCardHeader[\\s\\S]*summary\\.title/);
  assert.match(ordersSource, /<RegistrationCardHeader[\\s\\S]*entry\\.entryName/);
  assert.match(ordersSource, /<RegistrationStatePanel[\\s\\S]*Ready for gate/);
  assert.match(ordersSource, /<RegistrationStatePanel[\\s\\S]*Claim link sent/);
  assert.match(ordersSource, /<RegistrationStatePanel[\\s\\S]*Guest QR ready/);
  assert.match(ordersSource, /<RegistrationActionRow/);
  assert.doesNotMatch(ordersSource, /bg-\\[linear-gradient\\(180deg,#f7fcfb/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
node --test tests/order-form-sharing.test.mjs
```

Expected: FAIL in the new consistency test because the shared primitives do not exist yet and the team header still uses its bespoke gradient.

- [ ] **Step 3: Do not modify production code in this task**

The red test is the contract for the next task. Keep the existing state and action behavior unchanged until the primitives are introduced.

- [ ] **Step 4: Confirm only the intended test is red**

Run:

```bash
node --test tests/order-form-sharing.test.mjs 2>&1 | tail -40
```

Expected: the new consistency test fails; the existing form-sharing and ownership tests remain green.

- [ ] **Step 5: Commit the test contract**

```bash
git add tests/order-form-sharing.test.mjs
git commit -m "test: define shared order registration presentation"
```

### Task 2: Add shared registration presentation primitives

**Files:**
- Modify: `/Users/kenanaiahjolmfc/Desktop/PlanOut Prototype/src/app/pages/OrdersPage.tsx:1121-1525`
- Test: `/Users/kenanaiahjolmfc/Desktop/PlanOut Prototype/tests/order-form-sharing.test.mjs`

**Interfaces:**
- Consumes: `OrderEventEntry`, `OrderRecord`, existing `PrimaryButton`, `SecondaryButton`, and the current state-specific navigation callbacks.
- Produces:
  - `RegistrationCardHeader({ title, date }: { title: string; date: string })`;
  - `RegistrationStatePanel({ tone, children }: { tone: 'ready' | 'claim' | 'pending' | 'warning' | 'danger'; children: React.ReactNode })`;
  - `RegistrationActionRow({ children }: { children: React.ReactNode })`.

- [ ] **Step 1: Add the primitives directly above `PassportBanner`**

Use one shared shell vocabulary:

```tsx
type RegistrationStateTone = 'ready' | 'claim' | 'pending' | 'warning' | 'danger';

function RegistrationCardHeader({ title, date }: { title: string; date: string }) {
  return (
    <header className="border-b border-[#e6efec] bg-[#fbfdfc] px-4 py-4 sm:px-5">
      <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.2px] text-[#181d27]">
        {title}
      </h3>
      <p className="mt-1 text-[12px] font-semibold text-[#8a9bb1]">{date}</p>
    </header>
  );
}

function RegistrationStatePanel({
  tone,
  children,
}: {
  tone: RegistrationStateTone;
  children: React.ReactNode;
}) {
  const toneClasses = {
    ready: 'border-[#bfe5de] bg-[#ecfdf8]',
    claim: 'border-[#d8ddff] bg-[#f5f7ff]',
    pending: 'border-[#dfe9e6] bg-[#f8fcfb]',
    warning: 'border-[#fde68a] bg-[#fffbeb]',
    danger: 'border-[#fecaca] bg-[#fef2f2]',
  }[tone];

  return <div className={`mt-3 rounded-[14px] border p-3.5 ${toneClasses}`}>{children}</div>;
}

function RegistrationActionRow({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>;
}
```

Do not add a shadow or new gradient to these primitives. Keep the state surfaces readable at 456px.

- [ ] **Step 2: Run the focused test before consumer changes**

Run:

```bash
node --test tests/order-form-sharing.test.mjs
```

Expected: the primitive-name assertions turn green, while consumer-usage assertions may remain red until Task 3.

- [ ] **Step 3: Commit the primitives**

```bash
git add src/app/pages/OrdersPage.tsx
git commit -m "refactor: add shared order registration primitives"
```

### Task 3: Render individual and team entries through the shared language

**Files:**
- Modify: `/Users/kenanaiahjolmfc/Desktop/PlanOut Prototype/src/app/pages/OrdersPage.tsx:1121-1645`
- Test: `/Users/kenanaiahjolmfc/Desktop/PlanOut Prototype/tests/order-form-sharing.test.mjs`

**Interfaces:**
- Consumes: the three primitives from Task 2 and all existing callbacks/navigation.
- Produces: visually consistent individual and team registration items with unchanged behavior.

- [ ] **Step 1: Replace individual header markup with `RegistrationCardHeader`**

In `RegistrationItem`, replace the hand-written individual `<header>` with:

```tsx
<RegistrationCardHeader title={entry.entryName} date={entry.ticket.eventDate} />
```

Keep the outer article classes unchanged so the order-level card remains one surface.

- [ ] **Step 2: Route active individual status surfaces through `RegistrationStatePanel`**

Update the active branches in `PassportBanner` without changing their conditions or handlers:

- `entry.status === 'attached'`: `tone="ready"`, existing ready copy, and `RegistrationActionRow` around `View Passport`;
- Guest QR ready: `tone="ready"`, existing QR copy, and `RegistrationActionRow` around `Manage QR` or `Generate & send QR`;
- invited claim link: `tone="claim"`, existing recipient text, claim-link actions in `RegistrationActionRow`;
- pending form: `tone="warning"`, existing form-needed copy, and `RegistrationActionRow` around the current form button;
- released/resubmit states: same existing copy/actions, only swap the outer container for the shared panel and action row.

Keep `ParticipantFormLinkActions` as the source of `Send link` and `Copy link`; do not duplicate those handlers.

- [ ] **Step 3: Replace the team-specific gradient header with `RegistrationCardHeader`**

In `TeamRegistrationItem`, replace the bespoke gradient header with:

```tsx
<RegistrationCardHeader title={summary.title} date={entry.ticket.eventDate} />
```

Keep the Players summary, bulk controls, roster rows, and Add player behavior intact. The summary remains the team-specific content inside the same card shell.

- [ ] **Step 4: Use `RegistrationActionRow` for team row actions where the row has actions**

Wrap the existing per-player action groups in `RegistrationActionRow` only where it is structurally safe. Preserve the current responsive `justify-end` behavior by adding `sm:justify-end` to the row's parent when needed. Do not change labels, navigation, or invite state transitions.

- [ ] **Step 5: Run focused tests and inspect the diff**

Run:

```bash
node --test tests/order-form-sharing.test.mjs
git diff --check
```

Expected: all focused tests pass and the diff contains no whitespace errors.

- [ ] **Step 6: Commit the shared presentation refactor**

```bash
git add src/app/pages/OrdersPage.tsx tests/order-form-sharing.test.mjs
git commit -m "refactor: unify individual and team order items"
```

### Task 4: Verify both order variants in the browser

**Files:**
- Modify: none unless verification finds a concrete defect.
- Test: `/Users/kenanaiahjolmfc/Desktop/PlanOut Prototype/tests/*.test.mjs`

**Interfaces:**
- Consumes: the unified order-item UI from Task 3.
- Produces: verified individual/team presentation and preserved interactions.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check
```

Expected: all tests pass, Vite production build succeeds, and only existing chunk-size warnings remain.

- [ ] **Step 2: Inspect `/orders/tkt-011` at 456px**

Confirm that the individual registration cards share the same header, panel radius, spacing, border treatment, and action-row geometry as the team card. Confirm claim-link, Guest QR, Passport, and form-needed states remain visible and actionable.

- [ ] **Step 3: Inspect `/orders/tkt-013` at 456px**

Confirm that the team card uses the same event header and outer shell as the individual card, while keeping the Players summary, bulk Email all/Copy all controls, roster actions, and Add player slot action.

- [ ] **Step 4: Exercise one action in each state family**

Verify:

- `View Passport` routes to `/passport`;
- Guest QR action routes to the entry Guest QR page;
- `Send link` opens the individual email review sheet;
- `Email all` opens the bulk review sheet;
- `Copy link` and `Copy all` preserve their toast behavior;
- `Add player` adds a slot without opening a form.

- [ ] **Step 5: Check runtime health**

After a clean reload of each route, confirm no console errors and no horizontal overflow at 456px. Leave the currently inspected order page open for handoff.
