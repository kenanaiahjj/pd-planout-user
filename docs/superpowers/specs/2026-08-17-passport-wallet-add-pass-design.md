# Passport Wallet-Style Add-Pass Surface

## Goal

Refine Passport's “Add a past event” section so it feels closer to Apple Wallet: compact, pass-oriented, calm, and immediately understandable. Preserve the existing past-event recovery flow and data semantics.

## Scope

- Redesign only the “Add a past event” surface in `PassportPage.tsx`.
- Keep the existing `/passport/add-entry?scan=1` destination.
- Keep the scanner responsible for both live QR scanning and saved-photo upload.
- Keep claimed past events in the same section when history exists.
- Do not change Guest QR claiming, scanner decoding, storage, or routing.

## Approved Direction

Use one compact Wallet-style add-pass sheet instead of the current large bordered card with a nested green action card.

### Visual structure

- Use a warm white, softly elevated surface with a large but restrained corner radius.
- Add a subtle bright top edge and quiet neutral shadow to suggest a physical Wallet sheet without glass blur or decorative gradients.
- Use a compact circular scan/pass symbol at the leading edge.
- Keep the heading and description together in one concise identity row.
- Present “Scan event QR” as the single full-width action row, with a trailing chevron and immediate press-scale feedback.
- Place “Camera or saved QR photo” as secondary metadata inside the action row instead of a separate explanatory paragraph.
- Remove the empty “Claimed events will appear…” message. The add action is the zero-state guidance.

### History state

- Render “Past events” only when `claimedGuestEntries.length > 0`.
- Keep each claimed event as a compact pass-like row with event name, category/history metadata, and an “Added” status.
- Separate history from the add action with one subtle divider; do not create nested cards.

## Content

- Heading: `Add a past event`
- Supporting text: `Save an event you attended to your Passport.`
- Primary action: `Scan event QR`
- Action metadata: `Camera or saved QR photo`
- History heading: `Past events`

## Interaction and accessibility

- The action remains a semantic button and navigates to `/passport/add-entry?scan=1`.
- Preserve a minimum 56px action height and clear keyboard focus treatment.
- Use one scan icon on the surface; do not repeat it inside nested controls.
- Keep pointer feedback under 200ms and limited to transform/opacity-compatible properties.
- Preserve readable contrast and `text-balance`/`text-pretty` treatment for compact mobile widths.

## Verification

- Add a focused source-level regression test for the Wallet-style composition and unchanged scanner route.
- Verify the empty state and claimed-history state do not render redundant guidance or nested action cards.
- Run the focused Passport test, the complete test suite, and the production build.
- Inspect `/passport` at the current mobile viewport and activate the scan action to confirm `/passport/add-entry?scan=1` opens.

## Out of scope

- Changes to the Passport holder graphic or its controls.
- Changes to the scanner, QR decoding, claim result screens, or Guest QR data model.
- New animation systems, image assets, or backend behavior.
