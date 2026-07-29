# Passport Past Event Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the Passport past-event entry card into a compact, scan-first launcher while preserving all existing routes and claimed-entry data.

**Architecture:** Keep the card inline in `PassportPage.tsx`; no new component or data contract is needed for this small surface. Add a source-level contract test that verifies the intended copy, action hierarchy, and unchanged navigation targets.

**Tech Stack:** React, TypeScript, Tailwind utility classes, lucide-react, Node's built-in test runner.

## Global Constraints

- Do not change `/passport/add-entry` scanner behavior or camera/phone integration.
- Preserve `navigate('/passport/add-entry?scan=1')` for `Scan QR`.
- Preserve `navigate('/passport/add-entry')` for `Enter code`.
- Preserve `claimedGuestEntries` rendering and the `Added` status.
- Keep interactive targets at least 44px high.

---

### Task 1: Add the Passport card contract test

**Files:**
- Create: `tests/passport-past-event-card.test.mjs`
- Read: `src/app/pages/PassportPage.tsx`

**Interfaces:**
- Consumes: the rendered source contract in `PassportPage.tsx`.
- Produces: a focused regression test for copy, action hierarchy, routes, and history semantics.

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/app/pages/PassportPage.tsx', import.meta.url), 'utf8');

test('Passport past-event card is scan-first and keeps both entry routes', () => {
  assert.match(source, />Add a past event<\/p>/);
  assert.match(source, /Bring a past event into your Passport\./);
  assert.match(source, /Scan QR/);
  assert.match(source, /Enter code/);
  assert.match(source, /navigate\('\/passport\/add-entry\?scan=1'\)/);
  assert.match(source, /navigate\('\/passport\/add-entry'\)/);
  assert.match(source, /claimedGuestEntries\.length > 0/);
  assert.match(source, /Added from Guest QR/);
  assert.match(source, /bg-\[#177564\]/);
});

test('Passport card keeps the secondary manual action visually subordinate', () => {
  const primaryAction = source.indexOf('>Scan QR</button>');
  const secondaryAction = source.indexOf('>Enter code</button>');

  assert.notEqual(primaryAction, -1);
  assert.notEqual(secondaryAction, -1);
  assert.ok(primaryAction < secondaryAction);
  assert.match(source.slice(primaryAction - 900, primaryAction), /w-full/);
  assert.match(source.slice(secondaryAction - 900, secondaryAction), /text-\[#177564\]/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/passport-past-event-card.test.mjs`

Expected: FAIL because the existing supporting copy and full-width action hierarchy do not yet match the approved design.

### Task 2: Implement the revised card

**Files:**
- Modify: `src/app/pages/PassportPage.tsx:835-873`
- Test: `tests/passport-past-event-card.test.mjs`

**Interfaces:**
- Consumes: existing `navigate`, `claimedGuestEntries`, `ScanLine`, and `Keyboard` values.
- Produces: the same routes and claimed-entry semantics with the revised visual hierarchy.

- [ ] **Step 1: Replace the existing card markup**

Use a tighter section with a compact scan-launcher row, a full-width teal `Scan QR` button, an inline secondary `Enter code` action, and a labeled history divider. Keep both existing `onClick` routes unchanged.

- [ ] **Step 2: Run the focused test to verify it passes**

Run: `node --test tests/passport-past-event-card.test.mjs`

Expected: PASS.

### Task 3: Verify the whole surface

**Files:**
- Read: `src/app/pages/PassportPage.tsx`
- Read: `tests/passport-past-event-card.test.mjs`

- [ ] **Step 1: Run all tests**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Build the app**

Run: `npm run build`

Expected: Vite exits 0; existing chunk-size or dynamic-import warnings may remain.

- [ ] **Step 3: Inspect the live Passport route**

Open `/passport` at the existing local dev server and confirm the card has one filled `Scan QR` action, a quieter `Enter code` action, and the history area below. Confirm clicking the two actions still reaches `/passport/add-entry?scan=1` and `/passport/add-entry` respectively.

- [ ] **Step 4: Check the diff**

Run: `git diff --check -- src/app/pages/PassportPage.tsx tests/passport-past-event-card.test.mjs docs/superpowers/specs/2026-07-29-passport-past-event-card-design.md docs/superpowers/plans/2026-07-29-passport-past-event-card.md`

Expected: no whitespace errors.
