# Orders Overview and Adaptive Order Details Design

**Status:** Approved direction; awaiting written-spec review  
**Date:** 2026-08-17

## Objective

Extend the cinematic Orders visual system into Order Details without letting a single event misrepresent a multi-event purchase. Improve the overview hierarchy for multi-event counts and order status at the same time, while preserving all existing order, registration, Passport, Guest QR, form-sharing, payment, and navigation behavior.

The experience should feel photo-led and premium like Apple Invites, but remain an operational PlanOut surface: the order is the stable identity, event imagery supplies context, and unresolved registration work remains immediately understandable.

## Product Principles

- Keep the order—not the first event—as the stable identity on Order Details.
- Use event imagery to create emotion and recognition without obscuring forms, access, or payment state.
- Represent every included event truthfully on multi-event orders.
- Keep action-required states explicit and scannable.
- Use one adaptive structure for single-event, multi-event, merchandise, refunded, and missing-image orders.
- Preserve the current mobile-first reading order and desktop sticky payment behavior.
- Do not introduce an event carousel, generated collage asset, image analysis, or a new API dependency.

## Orders Overview Refinements

### Multi-event title

- Keep the first event title as the recognition anchor.
- Render the remaining count as a separate compact glass capsule immediately after the title, using the existing copy format `+2 more`.
- Derive the count from distinct event IDs rather than parsing `order.name` or counting repeated player entries.
- Keep the capsule visually quieter than the title: approximately `10.5–11px`, semibold, high-contrast text, a restrained dark translucent fill, a fine light edge, and no hover or button affordance.
- Render the title and capsule in one bottom-aligned flex row: the title receives the flexible two-line region and the capsule remains `shrink-0`. This guarantees the count remains visible without increasing card height.
- Preserve the accessible order name as one coherent label, including the overflow count.

### Overview status

- Replace the exposed dot-and-label treatment with a compact semantic glass label in the same upper-left position.
- Retain the semantic dot and current wording: `Forms needed`, `Ready for gate`, `Processing`, `Complete`, `Shipped`, `Delivered`, or `Refunded`.
- Use one neutral dark glass material for legibility over photography; let the existing dot color carry the semantic tone. Do not turn the label into a button.
- Use a fine white edge, subtle top inset, and sufficient opaque fallback under reduced transparency.
- Keep the date on the opposite side of the same metadata row.

## Adaptive Order Cover

### Stable hierarchy

Every Order Details variant uses the same cover shell and text hierarchy:

1. Aggregate order status in a compact semantic label.
2. Order reference and purchase date as supporting metadata.
3. A primary title that describes the purchase truthfully.
4. Registration count—or merchandise quantity for merchandise-only orders—and total as the closing summary.

For a single-event order, the primary title is the event name. For a multi-event order, it is `<N>-event order`; individual event names remain visible in the registration items below. For merchandise-only orders, use the merchandise order name and merchandise quantity instead of showing `0 registration items`. The global page context and back navigation continue to identify the route as Order Details.

### Dynamic event source

Create one selector that builds a unique ordered event collection from `order.eventEntries`:

- Deduplicate by `entry.ticket.id` so team-player rows do not repeat artwork.
- Preserve first occurrence order.
- Expose event ID, title, image, event date, and brand theme.
- Never parse display strings to recover event identity.
- In a production API, the same component can consume a normalized `events[]` collection with the same shape.

The mosaic is assembled with ordinary responsive image elements and CSS Grid. It does not require pre-compositing or generating a new image.

### Cover modes

- **No event or merchandise artwork:** render theme panels for events that still provide brand data; use the existing PlanOut teal fallback only when neither artwork nor an event theme is available.
- **One event or one merchandise image:** render one full-bleed image.
- **Two distinct events:** use a `58 / 42` vertical split, with the first event in the larger region.
- **Three or more distinct events:** use a `62%` dominant region on the leading side and two equal stacked regions on the trailing side.
- **More than three events:** render only the first three images and place a non-interactive `+N` count label over the third tile.

Cap the cover at three requested images. Missing or failed images fall back to that event's theme panel; if no event theme is available, use the PlanOut fallback. Duplicate image URLs are allowed when they belong to distinct events, because event identity is based on event ID rather than pixels.

### Cover material

- Use a `24px` mobile radius and a `28px` larger-screen radius.
- Target approximately `248px` height on mobile and `300px` on larger screens.
- Crop images with `object-cover`; allow future event data to provide an optional focal position without requiring it now.
- Apply one shared neutral bottom scrim across the full cover so the order hierarchy reads as one object rather than separate image cards.
- A single-event cover may add a restrained event-theme wash. A multi-event cover uses the neutral shared scrim only so the first event does not own the entire order palette.
- Use thin internal seams between mosaic cells, one outer light-catching edge, and one controlled shadow. Do not stack additional glass cards over the cover.

## Order Details Content Hierarchy

### Reading order

1. Adaptive order cover.
2. Registration summary and unresolved work.
3. Registration items and their existing actions.
4. Merchandise or refund information when present.
5. Payment summary, receipt, and help.

The cover supplies identity; the registration content remains the primary task surface.

### Registration section

- Add a clear `Registration` section heading below the cover with aggregate progress or unresolved-form copy.
- Preserve the existing `ParticipantFormShareControls`, `RegistrationItem`, team-player panels, Guest QR actions, Passport actions, claim-link actions, and player-management behavior.
- Keep each distinct event visibly identifiable through its current image, title, date, and a restrained event-theme accent.
- Do not place the existing registration cards inside another rounded parent card. Use proximity and section rhythm instead of nested containers.
- For a single team order, keep the team summary and player rows together as one registration item.
- For multi-event orders, preserve the current registration-item grouping exactly; the cover must not merge, split, or reorder registration records.

### Payment and support

- Keep Payment Summary visually quieter than Registration and tied to the entire order.
- Preserve all line items, subtotal, fees, discounts, total, payment method, payment date, and status semantics.
- Preserve the existing desktop sticky payment column.
- Keep Download receipt and Get help as secondary actions after the payment summary.
- Do not collapse payment information or add new disclosure behavior in this change.

## Responsive Behavior

### Mobile

- The cover spans the available content width beneath the existing back/header controls.
- Text sits within the shared bottom scrim and respects safe readable insets.
- Registration follows in normal document flow; bottom navigation and Messenger must not cover the final actions.
- Long event titles, a `+N` overview capsule, and `3-event order` must remain readable at `400 × 964` and narrower supported widths.

### Desktop

- The cover spans the full content region above the current two-column detail layout.
- Registration remains in the flexible leading column.
- Payment Summary remains in the sticky `380px` trailing column.
- The cover does not become a separate side panel or create a different information order from mobile.

## Accessibility and Motion

- Mosaic images are decorative: empty alternative text, `aria-hidden="true"`, and pointer-inert.
- Event names remain available as real text in registration items; the cover exposes the order title, status, reference, purchase date, relevant item count, and total.
- Status and additional-event labels remain readable without relying on color alone.
- Maintain visible focus, one interaction boundary per actionable control, and existing touch-target sizes.
- Use no automatic slideshow, parallax, or looping animation.
- Any cover entrance or hover treatment is limited to opacity or a subtle image scale and is removed under `prefers-reduced-motion`.
- Under `prefers-reduced-transparency`, use opaque semantic labels and a solid cover fallback with no backdrop blur.
- Under `prefers-contrast: more`, strengthen label edges and supporting-text contrast.

## Production Feasibility

The adaptive cover is production-safe because it is a deterministic view over ordinary order data:

- A normalized production payload can provide `events[]`; the prototype derives the equivalent collection from `eventEntries[]`.
- The client requests at most three responsive CDN thumbnail variants.
- CSS Grid handles layout selection from the unique event count.
- Theme metadata is stored with the event; no runtime palette extraction or cross-origin canvas work is required.
- Missing imagery, failed loads, duplicate team entries, merchandise-only orders, and large event counts all have explicit fallbacks.

## Scope Boundaries

- Do not change order grouping, totals, status calculation, payment state, event ownership, Passport ownership, Guest QR behavior, form persistence, sharing behavior, or any route.
- Do not add a carousel, slideshow, downloadable collage, image generation, image-upload flow, Maps, Weather, playlist, RSVP, or other Apple Invites product features.
- Do not add dependencies.
- Preserve existing unrelated dirty-worktree changes and do not stage or commit this work.

## Verification

- Add source regressions for distinct-event derivation, the overview `+N` capsule, the overview semantic status material, the fallback/one/two/three-plus cover modes, and the more-than-three overflow label.
- Confirm a RED/GREEN cycle for the focused Orders UI tests.
- Run the complete Node test suite, production build, and `git diff --check`.
- Browser-check at `400 × 964`:
  - single-event team order;
  - three-event order;
  - merchandise-only order;
  - refunded merchandise order;
  - missing-image fallback through a deterministic focused fixture or preview state.
- Confirm `All` shows `15`, `Pending` shows `7`, and `Complete` shows `8` orders.
- Confirm the Futsal order opens `/orders/tkt-013` and Player 8 `Fill up` opens `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`.
- Confirm the three-event order opens `/orders/tkt-001` with all three registration items and a complete payment summary.
- Confirm no decorative mosaic layers appear in the accessibility tree and browser warnings/errors remain empty.
