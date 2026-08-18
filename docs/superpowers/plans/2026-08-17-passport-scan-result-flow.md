# Passport Scan Result Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make an eligible Guest QR scan add the entry immediately, return to Passport, and confirm success without an extra review step.

**Architecture:** Keep `code` query parameters as the review path for direct or shared links. For camera, upload, and sample scans, parse the value, call the existing synchronous `claimGuestEntryQR` mutation, remain in the scanner on a claim error, and replace the route with `/passport` after the claim has persisted.

**Tech Stack:** React 18, React Router, TypeScript, Tailwind CSS, Node test runner, Vite

## Global Constraints

- `/passport/add-entry?scan=1` must render only the focused scanner.
- An eligible camera, photo, or sample scan must claim immediately, replace the route with `/passport`, and show an `Entry added to Passport` toast with the event name.
- Missing, revoked, or already-claimed scans must remain in the scanner and show the corresponding error toast.
- `/passport/add-entry?code=<ref>` must continue to render one resolved event-review state for direct and shared links.
- Existing camera, QR photo upload, Passport persistence, and prototype state-preview behaviors must remain functional.
- Do not introduce dependencies or change the Guest QR data model.
- Preserve 44px minimum targets, visible focus states, safe-area spacing, and reduced-motion behavior.

---

### Task 1: Claim scanner results immediately

**Files:**
- Modify: `src/app/pages/GuestEntryPages.tsx:1220-1375`
- Test: `tests/guest-qr-scanner.test.mjs`

**Interfaces:**
- Consumes: `useSearchParams()`, `guestQrCodeFromScan(value: string)`, `GuestQrScanner`, `GuestQrWebEntry`, and `ScannedGuestEntryState`.
- Produces: an immediate scanner claim flow plus the existing direct-link review flow controlled by `code` in the current URL.

- [ ] **Step 1: Write the failing regression test**

```js
test('successful scans claim immediately and return to Passport', () => {
  const addEntryStart = source.indexOf('export function AddGuestEntryToPassportPage');
  const addEntryEnd = source.indexOf('\nexport function MultiGuestManagerPage', addEntryStart);
  const addEntrySource = source.slice(addEntryStart, addEntryEnd);
  const handleScanStart = addEntrySource.indexOf('const handleScan = useCallback');
  const handleScanEnd = addEntrySource.indexOf('\n\n  const handlePrototypeStateChange', handleScanStart);
  const handleScanSource = addEntrySource.slice(handleScanStart, handleScanEnd);

  assert.match(handleScanSource, /const result = claimGuestEntryQR\(scannedCode\);/);
  assert.match(handleScanSource, /if \(!result\.ok\)/);
  assert.match(handleScanSource, /navigate\('\/passport', \{ replace: true \}\);/);
  assert.match(handleScanSource, /toast\.success\('Entry added to Passport', \{ description: result\.qr\.eventName \}\);/);
  assert.doesNotMatch(handleScanSource, /\/passport\/add-entry\?code=/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: FAIL because scans still navigate to the direct-link review route instead of calling `claimGuestEntryQR`.

- [ ] **Step 3: Implement immediate scan claiming**

Replace the scan handler with the existing claim mutation and error semantics:

```tsx
const handleScan = useCallback((value: string) => {
  const scannedCode = guestQrCodeFromScan(value);
  if (!scannedCode) return;

  const result = claimGuestEntryQR(scannedCode);
  if (!result.ok) {
    toast.error(
      result.reason === 'already_claimed'
        ? 'This entry has already been claimed.'
        : result.reason === 'revoked'
          ? 'This Guest QR is no longer valid.'
          : 'Guest QR not found.',
    );
    return;
  }

  navigate('/passport', { replace: true });
  toast.success('Entry added to Passport', { description: result.qr.eventName });
}, [claimGuestEntryQR, navigate]);
```

Leave the direct `?code=<ref>` review and explicit claim action unchanged.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: all Guest QR scanner tests pass.

- [ ] **Step 5: Verify the live flow**

Open `http://localhost:5173/passport/add-entry?scan=1`, scan an eligible fixture, and confirm the app returns to `/passport`, the new record appears under **Past events**, and the success toast names the event. Scan an already-claimed fixture and confirm the scanner stays open with the specific error toast.

- [ ] **Step 6: Run regression verification**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass.

Run: `npm run build`

Expected: Vite production build succeeds.

Run: `git diff --check -- src/app/pages/GuestEntryPages.tsx tests/guest-qr-scanner.test.mjs docs/superpowers/plans/2026-08-17-passport-scan-result-flow.md`

Expected: no whitespace errors.

---

### Task 2: Make the explicit sample scan repeatable

**Files:**
- Modify: `src/app/pages/GuestEntryPages.tsx:150-280`
- Modify: `src/app/context/AppContext.tsx:140-170`
- Test: `tests/guest-qr-scanner.test.mjs`

**Interfaces:**
- Consumes: `GuestQrScanner.onDetected(value: string)` and `getDemoGuestEntryQR(ref: string)`.
- Produces: `freshDemoGuestQrRef(): string`, returning a new `GE-TEMP-4021-<unique>` reference for each explicit sample activation.

- [ ] **Step 1: Write the failing regression test**

Add the AppContext source fixture and replace the fixed-sample assertion:

```js
const appContextSource = fs.readFileSync(new URL('../src/app/context/AppContext.tsx', import.meta.url), 'utf8');

test('sample scan generates a fresh claimable demo QR every time', () => {
  assert.match(source, /function freshDemoGuestQrRef\(\)/);
  assert.match(source, /crypto\.randomUUID\(\)/);
  assert.match(source, /onDetected\(`\/guest-entry\/\$\{freshDemoGuestQrRef\(\)\}`\);/);
  assert.doesNotMatch(source, /onDetected\('\/guest-entry\/GE-TEMP-4021'\);/);
  assert.match(appContextSource, /normalizedRef === 'GE-TEMP-4021' \|\| normalizedRef\.startsWith\('GE-TEMP-4021-'\)/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: FAIL because the sample action still emits the fixed `GE-TEMP-4021` reference and the demo fixture recognizes only that exact reference.

- [ ] **Step 3: Generate a fresh sample reference**

Add a focused helper and use it only from the explicit sample action:

```tsx
function freshDemoGuestQrRef() {
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase();
  return `GE-TEMP-4021-${suffix}`;
}

const handleDemoScan = () => {
  setStatus('scanning');
  onDetected(`/guest-entry/${freshDemoGuestQrRef()}`);
};
```

- [ ] **Step 4: Make fresh sample references claimable**

Expand only the explicit prototype namespace in `getDemoGuestEntryQR`:

```tsx
if (normalizedRef === 'GE-TEMP-4021' || normalizedRef.startsWith('GE-TEMP-4021-')) {
  return { ...base, attendeeName: 'Arthur Sanchez', onBehalfSignedBy: 'Jessica Sanchez' };
}
```

The existing stable `entryId: 'tkt-010-p2'` intentionally makes each successful sample claim replace the previous sample record instead of adding duplicate Passport cards.

- [ ] **Step 5: Verify focused and regression coverage**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: all scanner tests pass.

Run: `node --test tests/*.test.mjs`

Expected: all tests pass.

Run: `npm run build`

Expected: Vite production build succeeds.

Run: `git diff --check -- src/app/pages/GuestEntryPages.tsx src/app/context/AppContext.tsx tests/guest-qr-scanner.test.mjs docs/superpowers/plans/2026-08-17-passport-scan-result-flow.md`

Expected: no whitespace errors.
