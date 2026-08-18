# Passport Surface and QR Polish Design

## Goal

Make the Passport experience read as one intentional white page, clarify the holder branding, and give the QR credential a more premium physical treatment without changing its payload or flow.

## Approved behavior

- The authenticated `/passport` route shell and the Passport page content surface use solid white so no tinted inset rectangle or page break is visible.
- The related `/passport/add-entry` scanner surface inherits the same white route shell for visual continuity.
- The holder stamp changes from `Passport Holder` to `PlanOut Passport`.
- The compact and expanded QR presentations share a cleaner premium treatment: crisp square modules, a deliberate quiet zone, a layered white/mint frame, and a restrained depth shadow.
- QR payload generation, click-to-expand behavior, drag/reveal behavior, download behavior, and all existing action tabs remain unchanged.
- The forest-green holder, metallic QR card, colorful tabs, add-event section, and bottom navigation keep their current geometry and interactions.

## Visual treatment

- Page surface: `#ffffff` at both the route shell and Passport page wrapper.
- QR modules: retain the dark PlanOut ink color and finder-pattern geometry; remove the soft rounded-module appearance that makes the code feel like a generic illustration.
- QR tile: use a white enamel-like surface with a subtle mint border/ring, a defined quiet zone around the modules, and a compact shadow that separates it from the metallic card without competing with the code.
- Expanded QR: reuse the same QR tile language at the larger size rather than introducing a separate visual system.
- Branding: render `PlanOut Passport` as the holder wordmark; no other Passport copy changes.

## Architecture

`RootLayout` owns the route-level surface color and applies white to the `/passport` route family. `PassportPage` owns the page wrapper and removes its mint background. `PlanOutPassportCard` remains the owner of the QR rendering and holder branding; only QR presentation classes/geometry and the wordmark copy change. No data model, route behavior, or action handler changes are required.

## Responsive and accessibility behavior

- Preserve the current Passport card scale, mobile scrolling, safe-area spacing, and bottom navigation overlay.
- Keep the QR button's accessible label and keyboard/tap target intact.
- Keep enough quiet zone around the code for visual clarity and future scanner compatibility.
- Respect existing reduced-motion behavior and do not add decorative motion.
- Maintain contrast between dark QR modules, the white tile, and the mint frame at both compact and expanded sizes.

## Verification

- Add source-contract regressions for the white route/page surfaces, `PlanOut Passport` copy, and premium QR presentation classes while asserting the QR payload and interaction hooks remain present.
- Run focused Passport tests, the full Node test suite, production build, and `git diff --check`.
- Visually inspect `/passport` and `/passport/add-entry?scan=1` at mobile width to confirm one continuous white surface and a coherent QR treatment.
