# Camera-first Guest QR claim flow

## Context

The current `/passport/add-entry?scan=1` screen still shows the original white card scanner. The earlier camera surface was a visual companion mockup only; it did not change the app source. This update brings the approved direction into the proof-of-concept app itself.

## Goal

Make claiming an app-less Guest QR feel like a focused, camera-first Passport task. The user should be able to open the camera immediately, upload a QR image, enter a code, or close back to Passport without needing a connected phone or native camera integration.

## Scope

- `/passport/add-entry` opens directly into the scanner.
- `?scan=1` remains supported as a compatibility URL.
- A full-screen dark scan surface gives the live preview priority.
- Top controls provide close/cancel, private-state context, and camera flip.
- A bottom control tray provides `Upload QR` and `Enter code` with mobile-sized touch targets.
- Camera permission and unsupported states preserve the same upload/manual recovery paths.
- Successful camera or image decoding navigates to the existing `?code=` resolved-entry state.
- Existing one-time Guest QR eligibility, used-event history, claim transition, and Passport ownership semantics remain unchanged.

## Non-goals

- Connecting to or testing a physical phone.
- Native camera APIs, device pairing, or backend changes.
- Changing QR payload formats or claim rules.
- Adding a separate staff check-in scanner.

## Interaction design

1. The user opens `/passport/add-entry` from Passport and lands directly in the scanner.
2. The camera starts automatically with the environment-facing camera where available.
3. The scanner continuously looks for the existing Guest QR payload.
4. A successful decode navigates to `/passport/add-entry?code=<ref>` and shows the current resolved entry card.
5. `Upload QR` opens the device image picker and runs the same local decoder.
6. `Enter code` closes the scanner surface and reveals the existing manual code form.
7. Close/cancel returns to `/passport`.
8. A blocked or unsupported camera shows an inline explanation while keeping upload and manual entry available.
9. The existing claim action remains the only action that mutates Passport state.

## Visual direction

- The scanner is a full-height task surface rather than a nested white card.
- Use a near-black live-preview stage, restrained translucent chrome, and one clear scan frame.
- Keep the top bar quiet: close on the left, private context centered, camera flip on the right.
- Use a bottom translucent tray for the two fallback actions. They remain visible without competing with automatic scanning.
- Keep copy direct: `Scan your Guest QR`, `Hold the code inside the frame`, `Upload QR`, and `Enter code`.
- Use 44px minimum hit areas, visible focus states, semantic labels, and reduced-motion-safe opacity/color transitions.

## Component/data boundaries

`GuestQrScanner` owns camera lifecycle, frame decoding, image decoding, status, and facing-mode switching. `AddGuestEntryToPassportPage` owns URL state, navigation, manual lookup, resolved record rendering, and the existing claim operation. The scanner exposes separate callbacks for detection, close, and entering code so those paths cannot be conflated.

## Validation

- Add source-level regression coverage for camera-first initialization, explicit enter-code/close callbacks, upload input behavior, and fallback copy.
- Run the focused scanner test first and observe it fail before implementation.
- Run all existing Node tests and `npm run build`.
- Use the in-app browser to verify `/passport/add-entry`, close, enter-code, upload fallback, and the existing decoded-code-to-claim route using the prototype's local/demo states.
- Confirm no console errors and stop/remove temporary visual-companion capture state before handoff.
