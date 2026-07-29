# Passport Past Event Card Design

## Goal

Make the Passport page's past-event entry point feel like a calm, scan-first mobile action rather than a generic two-button form.

## Design

- Keep the existing `Add a past event` purpose, but tighten the supporting copy to one sentence: `Bring a past event into your Passport.`
- Give the section a distinct scan-launcher treatment using the existing PlanOut teal, with a compact scan icon tile and a short `Guest QR` label so the primary action is visually obvious without recreating the full-screen scanner.
- Make `Scan QR` the only filled, full-width action and keep `Enter code` as an inline secondary action with a keyboard icon. Both preserve their existing routes.
- Replace the long empty-state footer sentence with a quieter one-line history hint. Keep claimed entries in the same section, but separate them from the launcher with a labeled divider so the card has one clear job at a time.
- Preserve the existing claimed-entry data, `Added` status, accessibility semantics, and navigation behavior.
- Use compact Apple-like hierarchy: one strong title, one short explanation, one obvious next step, and secondary recovery paths nearby but visually subordinate.

## Out of scope

- No phone connection, real camera permission, QR decoding, or scanner behavior changes.
- No Passport card, bottom-navigation, route, data-model, or global design-system refactor.

## Success criteria

1. The card is scannable at a glance on a narrow mobile viewport.
2. `Scan QR` remains the easiest action to find and tap.
3. `Enter code` remains visible and reachable without competing with the primary action.
4. Claimed entries still render exactly from `claimedGuestEntries`.
5. Existing route behavior and browser flow continue to work.
