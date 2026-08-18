# Passport Viewport Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow the Passport page to scroll vertically through the full passport and past-event content without clipping at the mobile viewport.

**Architecture:** Keep `PassportPage` as the shell owner and preserve its existing viewport minimum, safe-area padding, bottom navigation clearance, and child components. Replace only the root's all-axis `overflow-hidden` with `overflow-x-hidden`, allowing normal document flow to determine vertical height while still containing decorative horizontal overflow.

**Tech Stack:** React, TypeScript, Tailwind utility classes, Node `node:test` source-contract tests, Vite.

## Global Constraints

- The Passport page keeps a minimum height of the viewport.
- Vertical content may extend beyond the viewport and scroll as one natural page.
- Horizontal decorative overflow remains contained so the Passport card does not widen the page.
- Existing bottom navigation remains overlaid and the page keeps enough bottom padding to reveal the final content above it.
- The Passport card, Add a past event panel, claimed-event rows, QR actions, and copy remain unchanged in this scoped fix.
- No nested scroll container is introduced.

---

### Task 1: Remove Passport root clipping while preserving safe-area clearance

**Files:**
- Modify: `src/app/pages/PassportPage.tsx:773`
- Test: `tests/passport-past-event-card.test.mjs`

**Interfaces:**
- Consumes: the existing `PassportPage` root class and source-contract test fixture.
- Produces: a Passport root with `min-h-dvh`, `overflow-x-hidden`, existing top padding, and existing bottom-safe padding; no child API or data changes.

- [ ] **Step 1: Write the failing regression test**

Add this test after the existing compact Wallet-style hierarchy test in `tests/passport-past-event-card.test.mjs`:

```js
test('Passport shell scrolls vertically without clipping horizontal decoration', () => {
  const pageStart = source.indexOf('export function PassportPage');
  const pageSource = source.slice(pageStart);
  const rootMatch = pageSource.match(/return \(\s*<div className="([^"]+)">/);

  assert.ok(rootMatch, 'PassportPage root wrapper should be present');
  assert.match(rootMatch[1], /\bmin-h-dvh\b/);
  assert.match(rootMatch[1], /\boverflow-x-hidden\b/);
  assert.doesNotMatch(rootMatch[1], /\boverflow-hidden\b/);
  assert.match(rootMatch[1], /pb-\[calc\(118px\+env\(safe-area-inset-bottom\)\)\]/);
  assert.match(rootMatch[1], /pt-\[calc\(32px\+env\(safe-area-inset-top\)\)\]/);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
node --test tests/passport-past-event-card.test.mjs
```

Expected: the new test fails because the Passport root still uses `overflow-hidden` instead of `overflow-x-hidden`; existing tests remain passing.

- [ ] **Step 3: Apply the minimal implementation**

In `src/app/pages/PassportPage.tsx`, change only the root wrapper class from:

```tsx
<div className="min-h-dvh overflow-hidden bg-[#eef7f5] px-3 pb-[calc(118px+env(safe-area-inset-bottom))] pt-[calc(32px+env(safe-area-inset-top))]">
```

to:

```tsx
<div className="min-h-dvh overflow-x-hidden bg-[#eef7f5] px-3 pb-[calc(118px+env(safe-area-inset-bottom))] pt-[calc(32px+env(safe-area-inset-top))]">
```

Do not change the Passport card, Add a past event panel, bottom navigation, or any data and navigation behavior.

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
node --test tests/passport-past-event-card.test.mjs
```

Expected: all tests in the file pass, including the vertical-scroll regression.

- [ ] **Step 5: Run the full verification suite**

Run from the repository root:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check -- src/app/pages/PassportPage.tsx tests/passport-past-event-card.test.mjs
```

Expected: all Node tests pass, the Vite build succeeds, and `git diff --check` reports no whitespace errors. Leave unrelated existing worktree changes untouched and do not commit the implementation in this shared checkout.

