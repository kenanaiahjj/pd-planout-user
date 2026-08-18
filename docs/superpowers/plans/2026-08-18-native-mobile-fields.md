# Native Mobile Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove PlanOut's simulated iOS keyboard and make every customer-facing field remain visible, reachable, and natively usable across narrow and short mobile viewports.

**Architecture:** Remove the simulator at its single root mount, then enforce native mobile sizing and focus clearance through the global stylesheet and shared field component. Audit raw controls for correct platform semantics and repair only the fixed or constrained containers that fail route-level mobile verification; keep real `visualViewport` accommodation for native keyboards.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 4, browser-native form controls and `VisualViewport`, Node `node:test`, Playwright, Vite.

## Global Constraints

- Cover every customer-facing editable control, including login, OTP, onboarding, search, cart, checkout, Orders, participant forms, Guest Entry, profile/settings, organizer forms, reviews, Messenger, filters, selects, and uploads.
- Delete the iOS keyboard simulation, its mount, flags, storage hooks, fake key behavior, and simulator-specific tests.
- Keep real native-keyboard viewport accommodation; do not fabricate keyboard dimensions.
- Use at least `16px` field text on viewports narrower than `768px`.
- Use at least a `44px` interactive height for visible text, email, telephone, numeric, date, search, textarea, and select controls.
- Preserve visible focus, semantic labels, keyboard order, and existing form behavior.
- Preserve all unrelated and pre-existing dirty-worktree changes, especially in `FormTextField.tsx`, `OrdersPage.tsx`, `ParticipantFormPage.tsx`, and their tests.
- Verify at `393x852` and `320x568`, then run representative desktop checks.

---

### Task 1: Remove the global iOS keyboard simulator

**Files:**
- Create: `tests/native-mobile-fields.test.mjs`
- Delete: `src/app/components/IOSKeyboard.tsx`
- Modify: `src/app/layouts/AppProviderLayout.tsx:1-56`
- Modify: `tests/order-form-sharing.test.mjs:38-45,224-229`

**Interfaces:**
- Consumes: the existing `AppProviderLayout` route boundary and `Toaster` mount.
- Produces: an app shell with no simulated keyboard component, query flag, storage key, focus listener, fake key dispatch, or fixed keyboard overlay.

- [ ] **Step 1: Write the failing removal contract**

Create `tests/native-mobile-fields.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const appProviderSource = fs.readFileSync(
  new URL('../src/app/layouts/AppProviderLayout.tsx', import.meta.url),
  'utf8',
);
const orderFormSharingSource = fs.readFileSync(
  new URL('./order-form-sharing.test.mjs', import.meta.url),
  'utf8',
);

test('the app has no simulated iOS keyboard surface or simulator hooks', () => {
  assert.equal(
    fs.existsSync(new URL('../src/app/components/IOSKeyboard.tsx', import.meta.url)),
    false,
  );
  assert.doesNotMatch(appProviderSource, /IOSKeyboard|keyboard simulation/i);
  assert.doesNotMatch(orderFormSharingSource, /iosKeyboardSource|simulated keyboard Done key/i);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```bash
node --test tests/native-mobile-fields.test.mjs
```

Expected: FAIL because `IOSKeyboard.tsx` exists and `AppProviderLayout.tsx` still imports and renders it.

- [ ] **Step 3: Remove the simulator and its test coupling**

In `src/app/layouts/AppProviderLayout.tsx`, change the file description to:

```tsx
/**
 * @file AppProviderLayout.tsx
 * @description Root route layout that renders the global Toaster alongside
 * the router Outlet.
 */
```

Remove `import { IOSKeyboard } from '@/app/components/IOSKeyboard';`, the simulator comment, and the `<IOSKeyboard />` mount while leaving `<Outlet />` and `<Toaster />` unchanged. Delete `src/app/components/IOSKeyboard.tsx`. In `tests/order-form-sharing.test.mjs`, remove the `iosKeyboardSource` fixture and the `the simulated keyboard Done key dismisses single-line inputs` test only.

- [ ] **Step 4: Run the focused tests and verify GREEN**

```bash
node --test tests/native-mobile-fields.test.mjs tests/order-form-sharing.test.mjs
```

Expected: both files pass and no test reads a deleted source file.

---

### Task 2: Establish the shared native mobile field contract

**Files:**
- Modify: `tests/native-mobile-fields.test.mjs`
- Modify: `src/styles/index.css:1-16`
- Modify: `src/app/components/FormTextField.tsx:3-112`

**Interfaces:**
- Consumes: raw native controls throughout `src/app`, plus the existing `FormTextField` and `FormTextarea` props.
- Produces: a mobile CSS contract for `.native-mobile-field`, native text-entry controls, and shared props `inputMode`, `autoComplete`, `enterKeyHint`, `name`, and `id`.

- [ ] **Step 1: Add failing shared-contract assertions**

Append these fixtures and tests to `tests/native-mobile-fields.test.mjs`:

```js
const stylesSource = fs.readFileSync(
  new URL('../src/styles/index.css', import.meta.url),
  'utf8',
);
const formTextFieldSource = fs.readFileSync(
  new URL('../src/app/components/FormTextField.tsx', import.meta.url),
  'utf8',
);

test('mobile text-entry controls prevent iOS zoom and retain focus clearance', () => {
  assert.match(stylesSource, /\.native-mobile-field/);
  assert.match(stylesSource, /font-size:\s*16px\s*!important/);
  assert.match(stylesSource, /min-block-size:\s*44px/);
  assert.match(stylesSource, /scroll-margin-block:/);
  assert.match(stylesSource, /max-inline-size:\s*100%/);
});

test('shared fields forward native keyboard semantics', () => {
  assert.match(formTextFieldSource, /inputMode\?:/);
  assert.match(formTextFieldSource, /autoComplete\?:/);
  assert.match(formTextFieldSource, /enterKeyHint\?:/);
  assert.match(formTextFieldSource, /inputMode=\{inputMode\}/);
  assert.match(formTextFieldSource, /autoComplete=\{autoComplete\}/);
  assert.match(formTextFieldSource, /enterKeyHint=\{enterKeyHint\}/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```bash
node --test tests/native-mobile-fields.test.mjs
```

Expected: FAIL because the global mobile contract and shared semantic props do not exist.

- [ ] **Step 3: Add the global mobile field rules**

Inside the existing `@media (max-width: 767px)` block in `src/styles/index.css`, add:

```css
  .native-mobile-field,
  input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='file']):not([type='hidden']):not([type='color']),
  textarea,
  select {
    box-sizing: border-box;
    max-inline-size: 100%;
    min-block-size: 44px;
    font-size: 16px !important;
    scroll-margin-block: max(96px, 22dvh);
  }

  [role='dialog'] {
    max-inline-size: calc(100vw - 16px);
  }
```

Do not apply the minimum height to hidden file controls, checkboxes, radios, ranges, or color wells; their visible trigger or label owns the touch target.

- [ ] **Step 4: Forward native semantic attributes through shared fields**

Add these optional properties to `FormTextFieldProps`:

```tsx
inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
autoComplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete'];
enterKeyHint?: React.InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
name?: string;
id?: string;
```

Add the equivalent properties using `React.TextareaHTMLAttributes<HTMLTextAreaElement>` to `FormTextareaProps`. Destructure them and pass them to the native control:

```tsx
<input
  id={id}
  name={name}
  type={type}
  inputMode={inputMode}
  autoComplete={autoComplete}
  enterKeyHint={enterKeyHint}
  className={`native-mobile-field form-text-field__input ...`}
/>
```

```tsx
<textarea
  id={id}
  name={name}
  inputMode={inputMode}
  autoComplete={autoComplete}
  enterKeyHint={enterKeyHint}
  className={`native-mobile-field form-textarea__input ...`}
/>
```

Retain the current optional `placeholder` change and every existing class and callback.

- [ ] **Step 5: Run the focused tests and verify GREEN**

```bash
node --test tests/native-mobile-fields.test.mjs tests/participant-form-polish.test.mjs
```

Expected: all shared-field and participant-form tests pass.

---

### Task 3: Correct native semantics on customer-facing fields

**Files:**
- Modify: `tests/native-mobile-fields.test.mjs`
- Modify as required by the audit: `src/app/pages/HomePage.tsx`, `src/app/pages/EventsPage.tsx`, `src/app/components/LocationDropdown.tsx`, `src/app/pages/LoginPage.tsx`, `src/app/components/OnboardingScreen.tsx`, `src/app/components/MessengerWidget.tsx`, `src/app/pages/GuestEntryPages.tsx`, `src/app/pages/OrdersPage.tsx`, `src/app/pages/ParticipantFormPage.tsx`, `src/app/components/CheckoutPage.tsx`, `src/app/components/ConnectContactModal.tsx`, `src/app/components/ProfileSetupModal.tsx`, `src/app/components/settings/AccountTab.tsx`, `src/app/components/settings/CertificatesTab.tsx`, `src/app/pages/ApplyOrganizerPage.tsx`, `src/app/components/ApplyOrganizerModal.tsx`, `src/app/components/ReviewModal.tsx`, `src/app/pages/OrganizerProfilePage.tsx`, `src/app/pages/InboxPage.tsx`, `src/app/pages/ProfilePage.tsx`, `src/app/components/CartPage.tsx`, and `src/app/components/MobileFilters.tsx`.

**Interfaces:**
- Consumes: existing values, change handlers, validation, and submit handlers.
- Produces: platform-appropriate field semantics without changing state transitions or copy.

- [ ] **Step 1: Add failing representative semantic assertions**

Append a helper and representative assertions to `tests/native-mobile-fields.test.mjs`:

```js
function readSource(relativePath) {
  return fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

test('search, login, OTP, email, phone, and message fields expose native hints', () => {
  assert.match(readSource('../src/app/pages/HomePage.tsx'), /type="search"[\s\S]*enterKeyHint="search"/);
  assert.match(readSource('../src/app/pages/LoginPage.tsx'), /autoComplete="username"/);
  assert.match(readSource('../src/app/pages/LoginPage.tsx'), /autoComplete=\{i === 0 \? 'one-time-code' : 'off'\}/);
  assert.match(readSource('../src/app/components/OnboardingScreen.tsx'), /autoComplete="tel"/);
  assert.match(readSource('../src/app/components/OnboardingScreen.tsx'), /autoComplete="email"/);
  assert.match(readSource('../src/app/components/MessengerWidget.tsx'), /enterKeyHint="send"/);
  assert.match(readSource('../src/app/pages/OrdersPage.tsx'), /type="email"[\s\S]*autoComplete="email"/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```bash
node --test tests/native-mobile-fields.test.mjs
```

Expected: FAIL on the missing native semantic hints.

- [ ] **Step 3: Apply semantics without changing behavior**

Use this mapping across every visible editable field:

| Field purpose | Required attributes |
| --- | --- |
| Search | `type="search"`, `inputMode="search"`, `enterKeyHint="search"`, `autoComplete="off"` |
| Login identifier | `type="text"`, existing dynamic `inputMode`, `autoComplete="username"`, `enterKeyHint="next"` |
| Email | `type="email"`, `inputMode="email"`, `autoComplete="email"`, `enterKeyHint="next"` or `"send"` matching its action |
| Phone | `type="tel"`, `inputMode="tel"`, `autoComplete="tel"`, `enterKeyHint="next"` |
| OTP | `type="text"`, `inputMode="numeric"`, first cell `autoComplete="one-time-code"`, remaining cells `autoComplete="off"` |
| Given/family name | `type="text"`, `autoComplete="given-name"` or `"family-name"`, `enterKeyHint="next"` or `"done"` |
| Birth date | `type="date"`, `autoComplete="bday"` |
| Message composer | `type="text"`, `autoComplete="off"`, `enterKeyHint="send"` |
| Multiline review/message | retain `<textarea>` and use `enterKeyHint="enter"` only when Enter creates a newline |

For example, change the Home search to:

```tsx
<input
  type="search"
  inputMode="search"
  enterKeyHint="search"
  autoComplete="off"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  placeholder="Search running, cycling, swimming..."
  className="native-mobile-field h-10 min-w-0 w-full ..."
/>
```

Apply equivalent attributes to every customer-facing raw or shared field in the inventory. Do not alter file inputs beyond verifying that their visible buttons are at least `44px` high.

- [ ] **Step 4: Run semantic and existing focused tests**

```bash
node --test tests/native-mobile-fields.test.mjs tests/login-identifier.test.mjs tests/order-form-sharing.test.mjs tests/participant-form-polish.test.mjs tests/guest-qr-scanner.test.mjs tests/messenger-widget.test.mjs
```

Expected: all files pass with the current form state and navigation behavior intact.

---

### Task 4: Repair constrained mobile surfaces found by runtime audit

**Files:**
- Modify: `tests/native-mobile-fields.test.mjs` only when a source regression test can lock an observed failure.
- Modify only failing surfaces among `src/app/pages/OrdersPage.tsx`, `src/app/pages/ParticipantFormPage.tsx`, `src/app/components/CheckoutPage.tsx`, `src/app/components/OnboardingScreen.tsx`, `src/app/components/ProfileSetupModal.tsx`, `src/app/components/ConnectContactModal.tsx`, `src/app/components/ReviewModal.tsx`, `src/app/components/ApplyOrganizerModal.tsx`, `src/app/components/MessengerWidget.tsx`, `src/app/pages/GuestEntryPages.tsx`, `src/app/pages/ApplyOrganizerPage.tsx`, and `src/app/components/settings/AccountTab.tsx`.

**Interfaces:**
- Consumes: existing dialog markup, real `window.visualViewport` events, safe-area CSS, and submit/cancel handlers.
- Produces: scrollable form surfaces whose focused control and completion action remain reachable at `393x852` and `320x568`.

- [ ] **Step 1: Start the app and record the assigned port**

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL. Use that exact port for the browser audit.

- [ ] **Step 2: Audit both mobile viewports**

At `393x852` and `320x568`, visit the field-bearing routes and open their interactive states: `/login`, `/`, `/events`, `/cart`, `/checkout#demo`, `/orders`, `/orders/tkt-013/form?returnTo=orders`, `/profile`, `/settings`, `/settings/account`, `/settings/inbox`, `/settings/apply-organizer`, `/organizers/city-striders`, Guest Entry claim and scanner recovery routes, Orders individual/bulk email sheets, contact/profile/review modals, and Messenger.

For each visible enabled `input`, `textarea`, or `select`, collect:

```js
const result = await page.locator('input:not([type="hidden"]):visible, textarea:visible, select:visible').evaluateAll((fields) => ({
  documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  fields: fields.map((field) => {
    const rect = field.getBoundingClientRect();
    const style = getComputedStyle(field);
    return {
      label: field.getAttribute('aria-label') || field.getAttribute('name') || field.getAttribute('placeholder') || field.tagName,
      width: rect.width,
      height: rect.height,
      fontSize: Number.parseFloat(style.fontSize),
      maxRight: rect.right,
    };
  }),
}));
```

Expected: `documentOverflow <= 1`; text-entry field height is at least `44`; text-entry font size is at least `16`; `maxRight` does not exceed the viewport width.

- [ ] **Step 3: Reproduce each visibility failure with a focused assertion**

For each failing surface, first add a focused source contract or Playwright assertion that captures the observed container issue, then run it to confirm RED. Use the actual failing component and do not add speculative container changes.

- [ ] **Step 4: Apply the smallest container repair**

Use the matching repair pattern only where the runtime audit proves it is needed:

```tsx
// Full-height form surface
className="min-h-dvh overflow-x-hidden overflow-y-auto pb-[calc(24px+env(safe-area-inset-bottom))]"

// Fixed overlay frame
className="fixed inset-0 flex items-end overflow-y-auto p-2 pb-[calc(8px+env(safe-area-inset-bottom))] sm:items-center sm:p-5"

// Dialog body
className="relative max-h-[calc(100dvh-16px)] min-w-0 w-full overflow-y-auto"

// Sticky/fixed action row
className="pb-[calc(12px+env(safe-area-inset-bottom))]"
```

Keep the Orders individual email sheet's existing `window.visualViewport` inset calculation. If another fixed sheet is demonstrably hidden by the real visible viewport, reuse that calculation rather than adding a simulated height.

- [ ] **Step 5: Re-run the two viewport audits and desktop smoke checks**

Expected: every audited control and associated action remains reachable, there is no fake keyboard, and desktop dialog centering and form layouts remain intact.

---

### Task 5: Complete regression verification and worktree review

**Files:**
- Verify all task files and preserve all pre-existing dirty files.

**Interfaces:**
- Consumes: completed simulator removal, global field contract, semantic hints, and runtime container fixes.
- Produces: verified native mobile form behavior with no unrelated change loss.

- [ ] **Step 1: Confirm simulator removal by source search**

```bash
rg -n -i "IOSKeyboard|planout\.keyboard\.simulation|iosKeyboard|simulated keyboard|keyboard simulation" src tests
```

Expected: no matches.

- [ ] **Step 2: Run all automated tests**

```bash
node --test --test-reporter=dot tests/*.test.mjs
```

Expected: exit code `0`.

- [ ] **Step 3: Run the production build and whitespace check**

```bash
npm run build
git diff --check
```

Expected: both commands exit `0`.

- [ ] **Step 4: Review the final diff against the starting dirty state**

```bash
git status --short
git diff -- src/app/components/FormTextField.tsx src/app/pages/OrdersPage.tsx src/app/pages/ParticipantFormPage.tsx tests/orders-ui-consistency.test.mjs tests/participant-form-polish.test.mjs
```

Expected: all pre-existing placeholder, participant-label, button-style, and test changes remain present; task additions are limited to simulator removal, native field semantics, mobile contract styles, and evidence-backed container fixes.
