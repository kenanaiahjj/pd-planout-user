# Order Event Image Card Design

## Goal

Make each Orders overview row feel like a premium, Apple-like event card by integrating the first event photograph into the complete card surface. Remove the redundant thumbnail stack while preserving the existing order hierarchy, density, status meaning, and every Orders/Form interaction.

## Approved Visual Direction

- Remove the overview thumbnail, its rear-card layers, its white frame, and its dark status footer.
- Use the first event or merchandise image as one full-bleed layer inside the order card.
- Theme the complete row from the first event's explicit `EventBrandTheme`, matching Event Details. Merchandise-only and unbranded orders use `PLANOUT_EVENT_BRAND`.
- Show status once, as a semantic colored dot followed by the existing status label. Give it no pill, footer, border, or independent background.
- Keep the date, title, item summary, price, order-detail route, and card tap behavior unchanged.
- Preserve the existing `18px` radius, responsive list/grid, and approximately `120px` mobile card height.

## Behavior and Data

`getOrderState(order)` remains the single source for registration, merchandise, refund, and gate-readiness status. `getOrderGraphicImages(order)` continues collecting unique existing event, merchandise, and fallback order images. `getOrderAmbientImage(order)` selects the first image for the full-card surface.

The design introduces no new controls, network dependencies, runtime canvas extraction, remote image processing, or generated assets. It reuses the existing image and brand data.

### Multi-event orders

- Keep the first event name as the recognition anchor, followed by `+ N more`.
- Use `N events · N registration items` as the supporting line when the order contains more than one distinct event.
- Use only the first event image and first event theme on the overview card; do not blend several photographs or palettes.
- Keep the aggregate status action-oriented: any unresolved form makes the order `Forms needed`; otherwise retain the truthful ready or complete state.
- Reveal the complete event breakdown only after opening Order Details.

## Full-Bleed Material Composition

### Cinematic premium refinement

- Render the selected photograph edge to edge with `object-cover`, `center` positioning, a `1.03` scale, `0.78` opacity, `1.12` saturation, and `1.04` contrast. Do not blur the photograph; it is the visual hero rather than ambient texture.
- Replace the even brand wash with one combined cinematic scrim. The horizontal component uses the event's darker brand color at `0.90` alpha on the text-leading edge, the main brand color at `0.56` through the middle, and the darker brand color at `0.24` on the image-revealing edge.
- In the same scrim element, add a neutral vertical gradient from `rgba(3,8,12,0.68)` at the bottom through `rgba(3,8,12,0.10)` at `62%` to `rgba(255,255,255,0.05)` at the top. This protects the title, summary, and price without flattening the photograph.
- Express the glass through light behavior instead of uniform blur: use one nearly transparent white veil, retain mild saturation, and remove backdrop blur from the default card. The image should stay crisp.
- Strengthen the upper-left specular highlight while shortening its reach so it reads as a light-catching edge, not a cloudy overlay.
- Use a precise `0.48` white top inset, a restrained `0.16` dark bottom inset, and one compact exterior shadow extending no more than `26px`. Do not add another border, nested card, glow, grain, or progressive-blur stack.

## Information Hierarchy

- Replace the two-column thumbnail/text grid with one full-width foreground stack.
- Put the status dot and label at the upper-left, with the date at the upper-right on the same metadata row.
- Anchor the order title and item summary toward the lower-left.
- Keep the price at the lower-right without wrapping it in another surface.
- Increase the mobile title to `18px` and the larger-breakpoint title to `20px`, with approximately `-0.45px` tracking and tight `1.08–1.12` leading. Limit the title to `82%` width so the photograph retains a visible focal region.
- Keep metadata between `10.5px` and `11px`, raise its contrast slightly, and give the title and price only a restrained `0 1px 2px rgba(0,0,0,0.18)` text shadow. Do not shadow every line of text.
- Preserve current title clamping, multi-event copy, summary, price, status wording, and status-dot colors.
- Keep the order ID off the overview and available on Order Details only.

## Accessibility and Motion

- Keep the full-bleed photograph decorative with `aria-hidden="true"`, empty alternative text, and pointer-inert layers; the order button already exposes the event name and status as text.
- Keep the tint, veil, vignette, and highlight pointer-inert and hidden from assistive technology.
- Preserve the visible focus ring and the order button as the single interaction boundary.
- On pointer hover, raise the card by at most `1px`, scale the photograph from `1.03` to `1.045`, and strengthen only the existing highlight. Preserve the compact press feedback.
- Keep transitions within `150–220ms` and animate only opacity, transform, filter, and shadow.
- Under `prefers-reduced-motion`, remove the hover lift.
- Under `prefers-reduced-transparency`, hide the photograph and use the existing solid event-colored fallback with no backdrop blur.
- Under `prefers-contrast: more`, retain the stronger edge and muted-text contrast.

## Scope

- Remove `OrderEventCardStack` and the overview-only variant/depth presentation from `OrdersPage.tsx`.
- Update source regressions to require the full-bleed image and plain status metadata and to reject the removed stack, frame, footer, and heavy ambient blur.
- Do not change filters, order grouping, status calculation, order detail content, participant-form links, Guest QR behavior, Passport ownership, or any Orders/Form route.
- Do not add dependencies or modify unrelated dirty-worktree files.
- Do not stage or commit changes in the user's existing dirty `main` checkout.

## Verification

- Run the focused Orders UI regression test through a confirmed RED/GREEN cycle.
- Run the complete Node test suite, production build, and `git diff --check`.
- Browser QA at `400 x 964` must cover dark-green Futsal, PlanOut teal merchandise, earth Canlaon, and maroon Basketball cards.
- Confirm that the event photograph is recognizable, no thumbnail or nested status surface remains, and the title, summary, price, status, and date remain readable.
- Confirm `All` shows `15`, `Pending` shows `7`, and `Complete` shows `8` orders.
- Confirm the Futsal order opens `/orders/tkt-013` and Player 8 `Fill up` opens `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`.
- Confirm decorative layers do not appear in the accessibility tree or intercept clicks, and browser warnings/errors remain empty.
