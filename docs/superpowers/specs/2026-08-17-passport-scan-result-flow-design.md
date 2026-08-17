# Passport Scan Result Flow Redesign

## Goal

Make the Passport Guest QR recovery flow feel focused, native, and coherent with the Wallet-inspired Passport surface. Remove the invalid hybrid state that shows a scan error and a previously resolved event at the same time.

## Problem

The add-entry page stores the scanned reference separately from the route. When a user selects **Scan another Guest QR**, navigation changes to `?scan=1`, but the previous reference remains in component state. The page then renders the no-scan fallback and the stale event result together. This duplicates status, weakens hierarchy, and makes the user unsure whether they are scanning or reviewing an event.

## Considered directions

1. **Restyle the hybrid state.** Lowest implementation effort, but it preserves contradictory information and does not repair browser back/forward behavior.
2. **Make the route canonical.** `?scan=1` always means the focused scanner; direct `?code=<ref>` links mean one resolved event-review state. Retrying clears the old result before navigation.
3. **Wrap the flow in a modal sheet.** Visually closer to an iOS sheet, but it adds navigation complexity to a task that already owns the full-screen route.
4. **Claim immediately after a successful scan.** Approved. The scanner performs the one-time claim, returns to Passport, and confirms the added event with a toast. Direct code links retain the review state for recovery and shared-link entry.

## Approved design

Use directions 2 and 4. The route determines the screen, with no mixed scanner/result composition, while successful camera/photo scans complete the claim without an extra confirmation screen.

### Scan state

- `/passport/add-entry?scan=1` opens the existing full-screen, camera-first scanner.
- Do not show the page eyebrow, explanatory document header, stale event card, or separate retry card behind the scanner.
- Invalid camera or photo input remains inside the scanner as concise inline feedback, preserving the user's context.
- A recognized, eligible Guest QR is claimed immediately, persisted to Passport, and followed by replacement navigation to `/passport`.
- Passport shows an **Entry added to Passport** success toast with the event name.
- Missing, revoked, or already-claimed codes remain in the scanner and show a specific error toast.
- Close returns to Passport. Upload and sample-scan recovery paths remain available.

### Resolved event state

- Direct `/passport/add-entry?code=<ref>` links show the existing compact event-review composition.
- The event identity and semantic outcome appear once.
- Available entries show one primary add action. Already-added entries show **View Passport**. Unavailable entries show **Return to Passport**.
- **Scan another Guest QR** is a quiet secondary action and fully clears the previous result.

### State model

- Derive the submitted Guest QR reference from the current `code` query parameter.
- Keep only transient interaction state locally, such as a successful claim result.
- Synchronize scanner visibility with the route so browser navigation cannot recreate a stale hybrid.
- Scanner detection calls `claimGuestEntryQR(scannedCode)` before navigating. Navigation occurs only after a successful claim.
- Prototype state switching continues to navigate to an explicit code and state query.

### Repeatable sample scan

- Every activation of **Use sample QR** generates a fresh prototype reference in the `GE-TEMP-4021-<unique>` namespace.
- The demo fixture recognizes that namespace as an eligible Canlaon Marathon entry, so each sample activation exercises the same claim, persistence, Passport return, and success-toast path as a new QR.
- Sample claims reuse one stable demo entry slot in Passport. A later sample replaces the earlier sample record instead of accumulating duplicate Canlaon cards.
- Real Guest QR references retain normal one-time claim protection; the repeatable behavior applies only to the explicit sample action.

### Visual treatment

- Preserve the dark neutral scanner stage so the QR frame remains the only high-contrast target.
- Preserve the warm-white, compact event-review surface already used by the redesigned resolved state.
- Use PlanOut green for the primary action and restrained semantic color only for status.
- Maintain 44px minimum targets, visible focus states, safe-area spacing, and reduced-motion behavior.

## Acceptance criteria

- Selecting **Scan another Guest QR** from any resolved state displays only the scanner.
- The previous event name, attendee, reference, and status are absent from `?scan=1`.
- Scanning a valid, eligible QR adds the record, navigates with replacement to `/passport`, and shows an **Entry added to Passport** toast containing the event name.
- Scanning a missing, revoked, or already-claimed code stays on the scanner and shows the matching error toast.
- Opening a direct `?code=<ref>` link continues to render one event-review state.
- Browser back/forward navigation does not combine scanner and resolved content.
- Existing camera, photo upload, sample QR, claim, Passport return, and prototype preview flows remain functional.
- **Use sample QR** can be repeated indefinitely and reaches the successful Passport state every time without creating duplicate sample cards.
- Focused tests, the full test suite, production build, and mobile browser verification pass.
