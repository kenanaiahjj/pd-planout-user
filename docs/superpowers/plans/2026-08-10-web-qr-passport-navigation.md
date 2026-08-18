# Web QR Add-to-Passport and Desktop Passport Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a camera-free Guest QR entry surface for web/desktop widths and move Passport beside the desktop profile avatar without changing mobile behavior.

**Architecture:** Keep `GuestQrScanner` as the mobile-only camera surface. Add a separate `GuestQrWebEntry` in `GuestEntryPages.tsx` that handles local photo decoding and presents the existing manual lookup path. Move the desktop Passport action in `Header.tsx` and remove its duplicate from `UserMenuDropdown.tsx`; `RootLayout.tsx` remains the navigation owner.

**Tech Stack:** React, TypeScript, React Router, Tailwind utility classes, `jsQR`, Node test runner, Vite.

## Global Constraints

- Web/desktop means viewport widths `768px` and above; mobile widths below `768px` retain the existing camera-first flow.
- Desktop must not mount a component that calls `navigator.mediaDevices.getUserMedia`.
- QR images decode locally with the existing `jsQR` dependency and normalize through `guestQrCodeFromScan`.
- Existing `/passport/add-entry`, `?scan=1`, `?code=<ref>`, claim, revoked, and already-claimed states remain compatible.
- The mobile BottomNav Passport tile and mobile header remain unchanged.
- Preserve unrelated dirty-worktree changes and stage only the files named in each commit.

## File Map

- Modify `src/app/pages/GuestEntryPages.tsx`: add the web-only entry surface, share the existing photo decode path, and branch between web and mobile with `useIsMobile`.
- Modify `src/app/components/layout/Header.tsx`: move the desktop Passport button beside the avatar and preserve active/dark-header styling.
- Modify `src/app/components/UserMenuDropdown.tsx`: remove Passport from the secondary avatar menu.
- Modify `tests/guest-qr-scanner.test.mjs`: assert desktop/web behavior and mobile preservation.
- Create `tests/header-passport-navigation.test.mjs`: assert the desktop header placement and menu removal.

### Task 1: Add the web-only Guest QR entry surface

**Files:**
- Modify: `src/app/pages/GuestEntryPages.tsx`
- Test: `tests/guest-qr-scanner.test.mjs`

**Interfaces:**
- `GuestQrWebEntry` consumes `onDetected`, `onClose`, `code`, `onCodeChange`, `onLookup`, and `codeInputRef` from `AddGuestEntryToPassportPage`.
- `GuestQrWebEntry` produces the same normalized value callback used by `GuestQrScanner`, so `AddGuestEntryToPassportPage.handleScan` remains the single route transition owner.

- [ ] **Step 1: Write the failing tests**

Add assertions that the source contains a separate `GuestQrWebEntry`, imports `useIsMobile`, does not pass `enableLiveCamera` to the web component, and renders upload/manual copy for the desktop branch while retaining `GuestQrScanner` and `enableLiveCamera` for the mobile branch.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: FAIL because `GuestQrWebEntry` and the responsive branch do not yet exist.

- [ ] **Step 3: Implement the smallest web branch**

Import `useIsMobile` from `@/app/components/ui/use-mobile`. Keep `GuestQrScanner` and its camera effect intact for mobile. Add `GuestQrWebEntry` with this concrete photo-input contract:

```tsx
type GuestQrWebEntryProps = {
  onDetected: (value: string) => void;
  onClose: () => void;
  code: string;
  onCodeChange: (value: string) => void;
  onLookup: () => void;
  codeInputRef: React.RefObject<HTMLInputElement | null>;
};

function GuestQrWebEntry({
  onDetected,
  onClose,
  code,
  onCodeChange,
  onLookup,
  codeInputRef,
}: GuestQrWebEntryProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'processing' | 'empty'>('idle');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPhotoStatus('processing');
    decodeGuestQrPhoto(file).then((rawValue) => {
      if (rawValue) onDetected(rawValue);
      else setPhotoStatus('empty');
    });
  };

  return (
    <section aria-labelledby="web-add-entry-title">
      <button type="button" onClick={onClose} aria-label="Close add to Passport">Close</button>
      <h1 id="web-add-entry-title">Add a Guest QR to Passport</h1>
      <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} aria-label="Upload a Guest QR image" />
      <button type="button" onClick={() => photoInputRef.current?.click()}>Upload QR photo</button>
      <label htmlFor="guest-qr-code">Enter Guest QR code</label>
      <input ref={codeInputRef} id="guest-qr-code" value={code} onChange={(event) => onCodeChange(event.target.value)} />
      <button type="button" onClick={onLookup}>Find</button>
      {photoStatus === 'processing' && <p aria-live="polite">Reading QR from image…</p>}
      {photoStatus === 'empty' && <p aria-live="polite">No QR found in that image.</p>}
    </section>
  );
}
```

Use the existing `decodeGuestQr` helper and `guestQrCodeFromScan` through `onDetected`. In `AddGuestEntryToPassportPage`, branch only at the open-entry surface:

```tsx
const isMobile = useIsMobile();

{isMobile ? (
  <GuestQrScanner
    onDetected={handleScan}
    onClose={() => navigate('/passport')}
    onEnterCode={handleEnterCode}
    enableLiveCamera={searchParams.get('live') === '1'}
  />
) : (
  <GuestQrWebEntry
    onDetected={handleScan}
    onClose={() => navigate('/passport')}
    code={code}
    onCodeChange={(value) => setCode(value.toUpperCase())}
    onLookup={lookup}
    codeInputRef={codeInputRef}
  />
)}
```

Keep `?code=` rendering and the non-open manual fallback unchanged. The web surface should expose a clear `Upload QR photo` action, `Enter Guest QR code` input, `Find` button, local-processing status, and no sample/camera affordance.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `node --test tests/guest-qr-scanner.test.mjs`

Expected: all scanner tests pass, including the assertions that the mobile branch still passes `enableLiveCamera`.

- [ ] **Step 5: Commit the focused scanner change**

```bash
git add src/app/pages/GuestEntryPages.tsx tests/guest-qr-scanner.test.mjs
git commit -m "feat: add desktop web QR entry flow"
```

### Task 2: Move Passport beside the desktop avatar

**Files:**
- Modify: `src/app/components/layout/Header.tsx`
- Modify: `src/app/components/UserMenuDropdown.tsx`
- Create: `tests/header-passport-navigation.test.mjs`

**Interfaces:**
- `Header` keeps `onPassportClick?: () => void` and owns the standalone desktop `Open Passport` control.
- `UserMenuDropdown` no longer consumes or renders `onPassportClick`; its menu remains for Profile, Inbox, Settings, account switching, and sign out.

- [ ] **Step 1: Write the failing tests**

Assert that `Header.tsx` imports `IdCard`, contains an `aria-label="Open Passport"` control in the right action area, and no longer renders the centered `/* Passport — only for authenticated users */` block. Assert that `UserMenuDropdown.tsx` no longer defines a Passport nav item.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/header-passport-navigation.test.mjs`

Expected: FAIL because Passport is currently in the centered nav and avatar menu.

- [ ] **Step 3: Implement the desktop placement**

In `Header.tsx`, remove the centered Passport nav button and add a button immediately before `UserMenuDropdown` in the desktop right actions capsule. Use the existing active-page and dark-header color conventions, with an `IdCard` icon and the `Passport` label visible at large widths. Do not change the mobile header or `BottomNav`.

In `UserMenuDropdown.tsx`, remove only the `onPassportClick` prop and Passport item; leave the rest of the dropdown behavior unchanged.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `node --test tests/header-passport-navigation.test.mjs`

Expected: all header navigation assertions pass.

- [ ] **Step 5: Commit the focused header change**

```bash
git add src/app/components/layout/Header.tsx src/app/components/UserMenuDropdown.tsx tests/header-passport-navigation.test.mjs
git commit -m "feat: place Passport beside desktop avatar"
```

### Task 3: Verify responsive behavior and regression safety

**Files:**
- No new production files.

- [ ] **Step 1: Run the complete test suite**

Run: `node --test tests/*.test.mjs`

Expected: zero failures.

- [ ] **Step 2: Build the production bundle**

Run: `npm run build`

Expected: Vite exits with code 0. Existing chunk-size or import warnings may remain but must not be new errors.

- [ ] **Step 3: Verify the desktop browser route**

At a desktop viewport, open `/passport/add-entry` and confirm the page shows upload-photo and manual-code controls, does not show `Open camera`, `Flip camera`, or a video element, and does not change the URL when first opened. Upload a valid QR image and confirm it resolves to `/passport/add-entry?code=<ref>`. Confirm the header exposes one `Open Passport` control beside the avatar and the avatar menu no longer contains Passport.

- [ ] **Step 4: Verify the mobile browser route**

At a viewport below `768px`, open `/passport/add-entry` and confirm the existing camera-first UI, upload/manual recovery controls, and mobile BottomNav behavior remain present. Confirm the mobile `Open Passport` BottomNav action still navigates to `/passport`.

- [ ] **Step 5: Check browser console and diff hygiene**

Read browser console logs and run:

```bash
git diff --check -- src/app/pages/GuestEntryPages.tsx src/app/components/layout/Header.tsx src/app/components/UserMenuDropdown.tsx tests/guest-qr-scanner.test.mjs tests/header-passport-navigation.test.mjs
```

Expected: no browser errors and no whitespace errors in the focused files.
