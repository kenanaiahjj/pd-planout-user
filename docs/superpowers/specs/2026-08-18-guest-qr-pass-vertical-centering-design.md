# Guest QR Pass Vertical Centering Design

## Goal

Center the buyer-facing Guest QR pass vertically within the usable space between the page heading and the bottom-safe action stack, without changing the pass content or overlay behavior.

## Approved behavior

- On the full-page buyer Guest QR route, the page heading remains at the top and the Guest QR pass is centered in the flexible middle region.
- The Share Guest QR and Regenerate QR actions remain bottom-safe and reachable above the device safe-area inset.
- The pass keeps its existing dimensions, QR size, typography, colors, and animation.
- Claimed and revoked states keep their existing content and placement rules.
- Overlay mode remains unchanged; it keeps its compact content-driven layout rather than inheriting full-page centering.
- Short viewports must allow natural scrolling instead of clipping the pass or actions.

## Alternatives considered

1. **Flexible center region (selected):** Use the existing column layout, add a flexible middle wrapper, and center the pass within it. This is responsive and keeps the action stack in normal flow.
2. **Absolute viewport centering:** Position the pass at the viewport midpoint. This can overlap the heading or actions when the card or controls grow.
3. **Fixed margin tuning:** Increase top and bottom margins. This is brittle across device heights and safe-area sizes.

## Architecture

The existing `BuyerGuestQrContent` page remains the single owner of the layout. For the non-overlay page, the outer column becomes a full usable-height layout with three regions: a shrink-to-content heading, a `flex-1` middle region that centers the pass, and the existing bottom action/state region. The overlay branch retains its current content-driven spacing and does not receive the centering wrapper.

The pass component remains presentational and unchanged. No QR generation, sharing, regeneration, claimed-state, or revoked-state data flow changes are required.

## Responsive and accessibility behavior

- Use flex layout rather than absolute positioning so the pass and controls remain in document flow.
- Preserve `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` padding.
- Preserve the existing reduced-motion rule for the ticket entrance animation.
- Keep all existing buttons and labels unchanged, including keyboard focus styles and touch targets.
- If the content exceeds the viewport, the page may scroll; no content is hidden to force centering.

## Verification

- Add a source-contract regression to assert the non-overlay layout owns a flexible center region and the pass is centered inside it.
- Assert that overlay mode does not receive the new centering class.
- Run the focused Guest QR tests, the full Node test suite, the production build, and `git diff --check`.
- Visually verify the buyer Guest QR route at the reported mobile viewport and at a shorter viewport to confirm no overlap or clipping.

