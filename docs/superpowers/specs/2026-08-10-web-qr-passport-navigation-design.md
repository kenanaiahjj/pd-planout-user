# Web QR Add-to-Passport and Desktop Passport Navigation

**Status:** Approved for implementation  
**Date:** 2026-08-10

## Goal

Make adding a Guest QR from the web browser feel web-native and make Passport directly discoverable in the desktop header, while preserving the existing mobile camera flow.

## Approved design

### Web add-entry surface

At viewport widths of `768px` and above, `/passport/add-entry` opens a light web entry surface instead of a camera preview. It does not call `getUserMedia`, render a video element, or show a camera-flip control.

The surface provides two visible paths:

1. Upload a saved QR image. The image is decoded locally with the existing `jsQR` path and then uses the existing Guest QR normalization and `?code=<ref>` resolution flow.
2. Enter a Guest QR code manually. The existing input, `Find` behavior, demo records, unresolved-code message, and claim states remain the source of truth.

The existing close action returns to Passport. Resolved QR states, claim success, revoked records, already-claimed records, and the `?scan=1` compatibility route are unchanged.

At viewport widths below `768px`, the current `GuestQrScanner` camera-first surface remains unchanged, including its camera/upload/manual recovery behavior and `live=1` opt-in.

### Desktop Passport navigation

At desktop header widths, Passport is removed from the centered Home / Events / Orders navigation and removed from the avatar dropdown. A labeled Passport button is placed directly before the profile avatar in the right actions capsule, with the same active and dark-header treatment as the surrounding header controls.

The mobile BottomNav Passport tile is unchanged. The mobile header is unchanged.

## Architecture and boundaries

- Keep `GuestQrScanner` as the mobile-only camera surface.
- Add a separate web-only entry component in `GuestEntryPages.tsx` so desktop never mounts the camera effect.
- Reuse the existing QR image decoder and `guestQrCodeFromScan` normalization rather than adding a second QR format.
- Keep navigation and claim state in `AddGuestEntryToPassportPage`.
- Keep desktop Passport navigation in `Header.tsx`; keep the avatar menu focused on secondary account actions in `UserMenuDropdown.tsx`.

## Acceptance criteria

- Desktop `/passport/add-entry` shows upload-photo and manual-code actions without requesting camera access.
- Desktop upload of a valid QR image resolves to the existing `?code=` route.
- Desktop manual code lookup continues to resolve and claim records.
- Mobile `/passport/add-entry` retains the existing camera-first UI and behavior.
- Desktop header exposes exactly one standalone `Open Passport` control beside the avatar, and Passport is not present as a dropdown item or centered nav item.
- Mobile BottomNav still exposes `Open Passport`.
- Existing tests, production build, and browser console remain clean.

## Non-goals

- No real camera integration changes for mobile.
- No changes to Guest QR data, claim rules, or QR payload generation.
- No changes to the Messenger prototype, which remains hidden pending stakeholder clarification.
