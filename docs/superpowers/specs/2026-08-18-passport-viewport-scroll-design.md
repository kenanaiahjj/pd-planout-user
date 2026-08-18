# Passport Viewport Scroll Design

## Goal

Ensure the Passport page can render its full card and past-event section on mobile by allowing natural vertical page scrolling instead of clipping content at the viewport boundary.

## Approved behavior

- The Passport page keeps a minimum height of the viewport.
- Vertical content may extend beyond the viewport and scroll as one natural page.
- Horizontal decorative overflow remains contained so the Passport card does not widen the page.
- Existing bottom navigation remains overlaid and the page keeps enough bottom padding to reveal the final content above it.
- The Passport card, Add a past event panel, claimed-event rows, QR actions, and copy remain unchanged in this scoped fix.
- No nested scroll container is introduced.

## Alternatives considered

1. **Natural page scrolling (selected):** Replace all-axis clipping with horizontal-only containment on the Passport page root. This preserves normal document flow and avoids a second scroll surface.
2. **Nested `100dvh` scroller:** Make an inner content region scroll independently. This risks confusing mobile gestures and complicates fixed navigation overlap.
3. **Scale-to-fit:** Reduce the Passport and panel sizes until they fit one viewport. This harms QR readability and creates a fragile layout for shorter devices.

## Architecture

`PassportPage` remains the owner of the shell. Its existing `min-h-dvh`, top safe-area padding, and bottom navigation clearance remain. Only the root overflow rule changes from all-axis clipping to horizontal containment, allowing the existing flex/grid content to determine document height naturally.

No Passport data, QR generation, navigation, or child component APIs change.

## Responsive and accessibility behavior

- Preserve `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` values.
- Keep the bottom navigation visually overlaid while ensuring content ends above its clearance area.
- Preserve existing touch targets, focus styles, and reduced-motion behavior.
- Verify the full page at the reported mobile viewport and at a shorter viewport; the final content must be reachable without horizontal scrolling or clipping.

## Verification

- Add a source-contract regression asserting the Passport root uses horizontal-only overflow containment and retains viewport/bottom-safe sizing.
- Run the focused Passport tests, full Node test suite, production build, and `git diff --check`.
- Visually verify that the full Passport card and Add a past event section are reachable below the fold.

