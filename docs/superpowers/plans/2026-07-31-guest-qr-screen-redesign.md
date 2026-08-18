# Guest QR Screen Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the buyer-managed Guest QR screen into a calm, scannable “Quiet Credential” pass while preserving every existing QR state and action.

**Architecture:** Keep the behavior and state derivation inside `BuyerGuestQrContent` and replace only its presentational hierarchy. The screen will use one primary pass surface, a QR-first information block, a compact status row, and an action hierarchy that keeps share primary and revoke subordinate. Existing state branches remain intact and reuse the same structural layout.

**Tech Stack:** React + TypeScript, Tailwind utility classes, existing Lucide icons, Node test runner, Vite build, live localhost browser verification.

## Global Constraints

- Preserve active, scanned, revoked, and claimed Guest QR behavior and copy.
- Keep `Share`, `Resend`, `Mark scanned`, `Revoke`, `View guest receipt`, and `Generate new QR` actions functional.
- Keep mobile touch targets at least 44px and preserve visible focus states.
- Use existing PlanOut teal and system sans; do not add dependencies or a new visual system.
- Avoid decorative page-load choreography; any press feedback must stay within 200ms and respect reduced motion.
- Verify at 390px mobile width with no horizontal overflow or console errors.

---

### Task 1: Add the visual regression contract first

**Files:**
- Modify: `tests/guest-qr-access.test.mjs`
- Test: `tests/guest-qr-access.test.mjs`

**Interfaces:**
- Consumes: the existing `guestEntrySource` string loaded from `src/app/pages/GuestEntryPages.tsx`.
- Produces: source-level contracts for the Quiet Credential landmark and action hierarchy.

- [x] **Step 1: Write the failing test**

Append this test after the existing Guest QR route tests:

```js
test('Guest QR screen uses a QR-first credential hierarchy', () => {
  assert.match(guestEntrySource, /data-testid="guest-qr-pass"/);
  assert.match(guestEntrySource, /data-testid="guest-qr-primary-action"/);
  assert.match(guestEntrySource, /Ready to scan/);
  assert.match(guestEntrySource, /Share Guest QR/);
  assert.match(guestEntrySource, /Guest QR pass/);
});
```

- [x] **Step 2: Run the focused test and verify it fails for the intended reason**

Run:

```bash
node --test tests/guest-qr-access.test.mjs
```

Expected: the existing tests pass, and the new test fails because the current screen has no `guest-qr-pass`, `guest-qr-primary-action`, `Ready to scan`, `Share Guest QR`, or `Guest QR pass` contract yet.

### Task 2: Implement the Quiet Credential surface

**Files:**
- Modify: `src/app/pages/GuestEntryPages.tsx:492-754`

**Interfaces:**
- Consumes: `qr`, `isClaimed`, `isUsed`, `isRevoked`, and the existing callbacks already computed by `BuyerGuestQrContent`.
- Produces: the same action callbacks and state branches with the new visual hierarchy and stable test landmarks.

- [x] **Step 1: Replace the active header and QR card shell**

Use one quiet page canvas and a single primary pass surface. The pass root must include `data-testid="guest-qr-pass"`, use a restrained surface/shadow, and keep state-specific accent classes. The top of the pass should use a compact event context row, an explicit `Guest QR pass` label, the attendee name, and the existing state pill. Keep `entry.ticket.eventTitle`, `entry.category`, `entry.participantName`, and `qr.ref` visible without changing their values.

- [x] **Step 2: Make the QR the primary visual object**

Place `EntryQr value={qr.ref}` inside a centered mint-tinted QR stage with generous padding and no competing text above it. Keep the existing claimed/scanned/revoked overlay logic unchanged. Keep the reference code below the QR in a mono style, but reduce its visual weight relative to the attendee name.

- [x] **Step 3: Consolidate metadata into one readable status row**

Replace the two bordered `Validity`/`Status` boxes with a compact row containing:

```tsx
<div className="flex items-center justify-between gap-3 border-t border-[#e6eeeb] pt-4 text-[12px]">
  <span className="inline-flex items-center gap-2 font-semibold text-[#177564]">
    <span className="size-2 rounded-full bg-current" aria-hidden="true" />
    {isClaimed ? 'Claimed to Passport' : isRevoked ? 'QR revoked' : isUsed ? 'Scanned at gate' : 'Ready to scan'}
  </span>
  <span className="font-medium text-[#516173]">{validDateCopy(qr.eventDate).replace('One-time use - ', '')}</span>
</div>
```

Use the existing state color branches so revoked, scanned, and claimed remain semantically distinct.

- [x] **Step 4: Reorder and label the action hierarchy**

Keep the active action branch behavior but make the primary button carry `data-testid="guest-qr-primary-action"` and the visible label `Share Guest QR`. Keep `Resend` and `Mark scanned` as 44px secondary controls. Keep `Revoke` below the pass actions as an explicit destructive text/button treatment. Preserve `View guest receipt` and `Generate new QR` in their existing state branches.

- [x] **Step 5: Add restrained interaction feedback**

Use only compositor-friendly `transform` press feedback already consistent with the app, capped at 200ms. Keep focus-visible rings on every action. Add a local reduced-motion override only if the new class needs a transition; do not add looping animation.

- [x] **Step 6: Run the focused test and confirm green**

Run:

```bash
node --test tests/guest-qr-access.test.mjs
```

Expected: all Guest QR and access-path tests pass, including the new QR-first hierarchy test.

### Task 3: Verify the screen in the live app

**Files:**
- Verify only: `src/app/pages/GuestEntryPages.tsx`, `tests/guest-qr-access.test.mjs`

**Interfaces:**
- Consumes: the implemented Guest QR route and existing preview query states.
- Produces: verified active, scanned, and revoked screen states with no browser console errors.

- [x] **Step 1: Run the production build and diff checks**

Run:

```bash
npm run build
git diff --check
```

Expected: Vite exits 0 and `git diff --check` reports no whitespace errors. Existing chunk-size warnings are acceptable if no new errors appear.

- [x] **Step 2: Browser-check the active state**

Open:

```text
http://localhost:5173/orders/tkt-010/entry/tkt-010-p2/guest-qr
```

Verify the QR is the visual focus, `Emily Park` and `Canlaon Marathon 2026` remain readable, `Ready to scan` is visible, `Share Guest QR` is the primary action, and there is no horizontal overflow at 390px.

- [x] **Step 3: Browser-check the scanned and revoked states**

Open:

```text
http://localhost:5173/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=used
http://localhost:5173/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=revoked
```

Verify the QR overlays, status copy, and state-specific actions remain present and semantically distinct.

- [x] **Step 4: Read browser logs and final test suite**

Run:

```bash
node --test tests/*.mjs
```

Then read the active tab’s browser logs and confirm there are no page errors or console errors. Report the exact test count and build result.
