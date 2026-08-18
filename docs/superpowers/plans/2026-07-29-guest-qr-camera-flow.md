# Guest QR Camera Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current nested Guest QR scanner card with a camera-first proof-of-concept flow that keeps upload, manual entry, close, and demo scan paths usable without connecting a phone.

**Architecture:** Keep QR decoding and camera lifecycle inside `GuestQrScanner`; keep route state and Passport claim semantics inside `AddGuestEntryToPassportPage`. Separate close and enter-code callbacks so each action has one destination. Preserve the existing `jsqr` decoder and `?code=` navigation contract.

**Tech Stack:** React 18, TypeScript/TSX, React Router, Tailwind utility classes, `jsqr`, Node's built-in test runner, Vite.

## Global Constraints

- This is a proof-of-concept flow; do not add phone pairing, native integrations, or backend changes.
- `/passport/add-entry` opens the scanner by default; `?code=` opens the resolved entry; `?scan=1` remains supported.
- Existing `claimGuestEntryQR`, used-event history, and one-time Passport claim semantics must not change.
- Scanner controls use 44px minimum touch targets and direct, explicit labels.
- Camera/photo decoding continues to use `jsqr`; do not replace it with `BarcodeDetector`.
- Preserve unrelated dirty-worktree files and stage only task files when committing.

### Task 1: Add a failing scanner-flow regression test

**Files:**
- Create: `tests/guest-qr-scanner.test.mjs`
- Test: `src/app/pages/GuestEntryPages.tsx` source contracts

**Interfaces:**
- Consumes: the current scanner/page source.
- Produces: a focused regression suite that fails until camera-first initialization and explicit scanner actions exist.

- [x] **Step 1: Write the failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/app/pages/GuestEntryPages.tsx', import.meta.url), 'utf8');

test('add-entry opens the scanner by default while code routes stay resolved', () => {
  assert.match(source, /useState\\(searchParams\\.get\\('code'\\) \\? false : true\\)/);
  assert.match(source, /navigate\\(`\\/passport\\/add-entry\\?code=/);
});

test('scanner exposes distinct close and manual-entry actions', () => {
  assert.match(source, /onEnterCode: \\(\\) => void/);
  assert.match(source, /aria-label="Close scanner"/);
  assert.match(source, /aria-label="Upload a Guest QR image"/);
  assert.match(source, /Enter code/);
  assert.doesNotMatch(source, /capture="environment"/);
});

test('scanner includes a proof-of-concept demo scan path', () => {
  assert.match(source, /Use demo QR/);
  assert.match(source, /GE-TEMP-4021/);
});
```

- [x] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: FAIL because the current page only opens the scanner for `?scan=1`, `GuestQrScanner` has no `onEnterCode`, the input forces camera capture, and the demo scan action does not exist.

### Task 2: Implement the camera-first scanner surface and action wiring

**Files:**
- Modify: `src/app/pages/GuestEntryPages.tsx:1-320` scanner component and imports
- Modify: `src/app/pages/GuestEntryPages.tsx:868-1010` add-entry page state and callbacks

**Interfaces:**
- Consumes: `jsqr`, existing `guestQrCodeFromScan`, `claimGuestEntryQR`, and `getDemoGuestEntryQR`.
- Produces: `GuestQrScanner({ onDetected, onClose, onEnterCode })`, camera-first page initialization, and route-driven demo scan.

- [x] **Step 1: Add explicit scanner callbacks and camera-first initialization**

Change the scanner props to include `onEnterCode: () => void`. Initialize the page with:

```tsx
const [isScannerOpen, setIsScannerOpen] = useState(searchParams.get('code') ? false : true);
```

Keep `?scan=1` compatible because the no-code branch still opens the scanner.

- [x] **Step 2: Replace the white scanner card with the full-screen task surface**

Use a dark, full-height wrapper with a restrained translucent top bar, 44px close and flip buttons, one centered scan frame, live status copy, and a bottom tray containing `Upload QR`, `Enter code`, and a small `Use demo QR` proof-of-concept action. Keep the camera `<video>` and hidden `<canvas>` layered behind the chrome. Use only transform/opacity transitions and add a reduced-motion media override.

- [x] **Step 3: Make fallback actions explicit and accurate**

Wire the top close button to `onClose`, the manual action to `onEnterCode`, and upload to the file input. Remove `capture="environment"` so upload opens Photos/files instead of forcing another camera capture. Keep blocked, unsupported, photo-processing, and photo-empty states visible in the same surface.

- [x] **Step 4: Add the local proof-of-concept scan path**

Add a tertiary `Use demo QR` action that calls `onDetected('/guest-entry/GE-TEMP-4021')`. This is explicitly labeled as a prototype affordance and lets the flow reach the existing resolved-entry and claim screens without a connected phone.

- [x] **Step 5: Run the focused regression test**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: PASS with 3 tests.

### Task 3: Verify the flow in the real app

**Files:**
- Inspect: `src/app/layouts/RootLayout.tsx`
- Inspect: `src/app/pages/PassportPage.tsx`
- Verify: `src/app/pages/GuestEntryPages.tsx`

**Interfaces:**
- Consumes: the implemented scanner route and the current in-app browser session.
- Produces: fresh build/test/browser evidence for camera-first entry, fallback actions, demo scan, resolved entry, and claim completion.

- [x] **Step 1: Run all tests and build**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: Vite exits with code 0.

- [x] **Step 2: Check formatting and diff scope**

Run: `git diff --check -- src/app/pages/GuestEntryPages.tsx tests/guest-qr-scanner.test.mjs docs/superpowers/plans/2026-07-29-guest-qr-camera-flow.md`

Expected: no whitespace errors. Confirm unrelated dirty files are not staged.

- [x] **Step 3: Verify the actual route in the in-app browser**

Navigate to `http://localhost:5175/passport/add-entry` and confirm the camera-first surface is visible without `?scan=1`. Confirm:

1. Close returns to `/passport`.
2. Enter code reveals the manual form.
3. Use demo QR navigates to `?code=GE-TEMP-4021`.
4. The resolved entry shows `Add to my Passport`.
5. Claim reaches `Entry added to Passport`.

- [x] **Step 4: Stop temporary visual companion state**

Stop the brainstorming server and remove only `.superpowers/brainstorm/19488-1785304296/` after browser verification. Leave the committed design and implementation plan docs intact.
