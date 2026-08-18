# Settings Apple + Luma Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the authenticated `/settings` hub as a calm, grouped native-style list with Apple-like interaction and Luma-like editorial restraint while preserving every existing callback and route.

**Architecture:** Keep the existing `SettingsPage` data and callback contract, but replace the duplicated profile/organization cards and two-column layout with focused primitives: `SettingsSection`, `SettingsRow`, `WorkspaceRow`, and a quiet switching overlay. Keep all organization mock data in the page and make visual state changes local to the component.

**Tech Stack:** React 18, TypeScript, lucide-react, Motion, Tailwind utility classes, Node's built-in test runner, Vite.

## Global Constraints

- Preserve all current `SettingsPage` callback props and route behavior.
- Keep existing user-owned dirty files untouched; modify only `src/app/components/SettingsPage.tsx`, the focused settings test, and this plan/spec documentation.
- Use one responsive column capped at `max-w-[680px]`; do not add a new dependency.
- Use system typography, restrained neutral surfaces, 44px+ touch targets, visible focus rings, and reduced-motion-safe transitions.
- No gradients, rotating logo/ring loaders, rainbow icon tiles, pill role badges, nested cards, or desktop-only duplicate content.

### Task 1: Add a failing settings visual-contract test

**Files:**
- Create: `tests/settings-ui-polish.test.mjs`

**Interfaces:**
- Consumes: `src/app/components/SettingsPage.tsx` source text.
- Produces: repeatable assertions for the redesigned settings structure.

- [ ] **Step 1: Write the failing test**

Create a Node test that asserts the target source contains the centered single-column shell, `General`, `Workspaces`, `Support`, `About`, `Prototype`, 44px row sizing, active-workspace check state, and existing callback names. Assert it no longer contains the two-column grid, uppercase tracked section labels, pill-based active/switch labels, or the rotating spinner animation.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(
  new URL('../src/app/components/SettingsPage.tsx', import.meta.url),
  'utf8',
);

test('settings uses one calm grouped-list shell', () => {
  assert.match(source, /max-w-\[680px\]/);
  assert.match(source, />General<|title="General"/);
  assert.match(source, />Workspaces<|title="Workspaces"/);
  assert.match(source, />Support<|title="Support"/);
  assert.match(source, />About<|title="About"/);
  assert.match(source, /min-h-\[44px\]|min-h-11/);
  assert.match(source, /Check className/);
  assert.match(source, /onGoToMyAccount|onGoToTransactions|onGoToInbox|onGoToApplyOrganizer|onGoToPassportCases|onSignOut/);
  assert.doesNotMatch(source, /grid-cols-1 lg:grid-cols-2/);
  assert.doesNotMatch(source, /uppercase tracking-\[0\.8px\]/);
  assert.doesNotMatch(source, /animate=\{\{ rotate: 360 \}\}/);
  assert.doesNotMatch(source, /Switch<\/|>Active<\//);
});

test('settings switching respects reduced motion', () => {
  assert.match(source, /prefers-reduced-motion|motion-reduce/);
  assert.match(source, /Switching account|Switching to/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run `node --test tests/settings-ui-polish.test.mjs`.

Expected: FAIL because the current source still uses the two-column grid, tracked uppercase section labels, pill labels, and rotating spinner.

### Task 2: Replace the SettingsPage presentation while preserving behavior

**Files:**
- Modify: `src/app/components/SettingsPage.tsx`

**Interfaces:**
- Consumes: existing `SettingsPage` props, `useAppContext().pendingOrgApplication`, `MOCK_ORGANIZATIONS`, and `ConfirmDialog`.
- Produces: the same navigation callbacks and organization switch state with new grouped-list markup.

- [ ] **Step 1: Keep the existing data and callback contract**

Retain `Organization`, `MOCK_ORGANIZATIONS`, `activeOrgId`, `isSwitching`, `switchingToOrgId`, `handleSwitchOrg`, and every existing optional callback prop. Remove only imports and helper code that exist solely for the old decorative treatment.

- [ ] **Step 2: Implement native-style primitives**

Use a sentence-case section label and a flat list container:

```tsx
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2" aria-labelledby={`settings-${title.toLowerCase().replace(/\\s+/g, '-')}`}>
      <h2 id={`settings-${title.toLowerCase().replace(/\\s+/g, '-')}`} className="px-1 text-[13px] font-medium text-slate-500">
        {title}
      </h2>
      <div className="overflow-hidden rounded-[14px] border border-slate-200/80 bg-white divide-y divide-slate-200/70">
        {children}
      </div>
    </section>
  );
}
```

Make every interactive row `min-h-[44px]`, use a monochrome 28px leading icon slot, and expose `focus-visible:ring-2` with the PlanOut green ring.

- [ ] **Step 3: Implement the single-column page frame and identity row**

Render a `mx-auto w-full max-w-[680px] px-4 sm:px-6` shell with a compact back/title row, one personal identity button wired to `onGoToProfile`, and no duplicated profile card. Keep the name/initials fallback behavior.

- [ ] **Step 4: Implement one Workspaces group**

Render Personal Account, each organization, pending applications, and Create Organization in one list. Use a green check icon and light green row tint for the active workspace; use a right chevron for inactive workspace rows. Keep role/event metadata as plain secondary text (for example, `Owner · 18 events`) and preserve `handleSwitchOrg` calls.

- [ ] **Step 5: Replace the switching animation with a quiet overlay**

Keep the 1200ms mock transition but render a fixed white/96 overlay with a small static green progress bar or dot and text `Switching to …`. Add `motion-reduce:transition-none` / `motion-reduce:animate-none` classes and do not use `rotate`, pulsing logo, or scale choreography.

- [ ] **Step 6: Add General, Support, About, Prototype, and Sign Out groups**

Wire rows to the existing callbacks and preserve the `ConfirmDialog` trigger and copy for sign out. Use concise supporting values, a separate red text sign-out row, and conditionally render Prototype only when `onGoToPassportCases` exists.

- [ ] **Step 7: Run the focused test to verify it passes**

Run `node --test tests/settings-ui-polish.test.mjs`.

Expected: PASS with both settings visual-contract tests green.

### Task 3: Verify responsive behavior and production integrity

**Files:**
- Modify: none beyond the Task 2 source/test files.

**Interfaces:**
- Consumes: the redesigned `/settings` route and focused source test.
- Produces: build/test evidence and documented baseline limitations if unrelated dirty files prevent boot.

- [ ] **Step 1: Run the focused test and production build**

Run `node --test tests/settings-ui-polish.test.mjs` and `npm run build`.

Expected: the focused test passes. If the build still fails on the pre-existing deleted `src/app/pages/LoginPage.tsx`, record that exact baseline failure separately from the settings change.

- [ ] **Step 2: Boot the local app if the baseline allows it**

Use the existing Vite dev server or start `npm run dev -- --host 127.0.0.1`, navigate to `/settings`, and inspect at approximately 390px and 1280px widths. Confirm there is one reading order, no horizontal overflow, 44px touch rows, and the bottom nav remains visible on mobile.

- [ ] **Step 3: Exercise the primary interactions**

Verify the identity row opens `/profile`, My Account/Transactions/Inbox route callbacks remain wired, organization switching shows the quiet overlay and updates the active check, Create Organization remains present, Passport Cases remains conditional, and sign out still opens the confirmation dialog.

- [ ] **Step 4: Commit the implementation and focused test**

Stage only `src/app/components/SettingsPage.tsx` and `tests/settings-ui-polish.test.mjs`, then commit with `feat: unslopify settings hub`.
