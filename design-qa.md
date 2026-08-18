# Orders event-card stack design QA

## Comparison target

- Source visual truth: `/var/folders/8l/htjpvn2d29dgr67rglqg5ft80000gn/T/codex-clipboard-f0cd32d5-2bc7-46b4-b733-c3b400d13698.png`
- Final implementation screenshot: `/Users/kenanaiahjolmfc/.codex/visualizations/2026/08/17/01a00d70-e5ba-73c0-a9b5-f640ceb1c24e/orders-event-card-stack/implementation-final.png`
- Combined focused comparison: `/Users/kenanaiahjolmfc/.codex/visualizations/2026/08/17/01a00d70-e5ba-73c0-a9b5-f640ceb1c24e/orders-event-card-stack/reference-vs-implementation.png`
- Source pixels: `736 x 1105`.
- Implementation pixels: `400 x 964` at a `400 x 964` CSS viewport and device scale factor `1`.
- Comparison normalization: the source card region (`420 x 470`) and implementation order-card region (`368 x 410`) were each placed into equal `430 x 490` CSS comparison panels; the combined macOS render is `2000 x 1200` pixels at `2x` density.
- State: Orders overview, `All` filter, first five orders visible.

## Full-view comparison evidence

The Orders overview keeps its original row height, date, title, item summary, amount, filters, and bottom navigation. The old folder illustration is replaced only inside the existing graphic slot. The final `400 x 964` capture shows no clipping, horizontal overflow, collision with order copy, or change to above-the-fold list density.

## Focused comparison evidence

The combined comparison shows the reference and implementation together. Both use a white rounded frame, real image crop, bottom-up color treatment, offset rear cards, neutral layered elevation, and a dark action-shaped footer. The implementation intentionally compresses this treatment into the existing Orders thumbnail slot and replaces the reference action copy with the relevant status. A focused crop is sufficient because the requested change is isolated to the order graphic and the full-view capture verifies surrounding layout preservation.

## Required fidelity surfaces

- Fonts and typography: the surrounding Orders hierarchy is unchanged; the status uses a compact bold optical size and remains fully readable as `Forms needed`, `Ready for gate`, `Processing`, `Complete`, or `Refunded`.
- Spacing and layout rhythm: the stack fits the existing `96 x 92` mobile slot, uses semantic one/two/three-card depth, and preserves row spacing and alignment.
- Colors and visual tokens: each artwork supplies its own lower tonal color through an image-derived masked layer; a restrained neutral vignette controls contrast, while the dark status footer uses a small semantic state dot.
- Image quality and asset fidelity: every front card uses the order's real event or merchandise image through `ImageWithFallback`; no placeholder illustration, folder asset, or generated raster was introduced.
- Copy and content: all supplied status examples are visible in full, and completed non-gate event orders receive the truthful `Complete` status.

## Interaction and runtime checks

- Opened `Dumaguete Futsal Cup Season 4` from its redesigned order row.
- Confirmed Order Details still shows `FUT-2026-002390` and the team registration item.
- Returned to the Orders overview successfully.
- Browser console errors/warnings: none.

## Comparison history

### Pass 1

- [P2] `Forms needed` and `Ready for gate` truncated inside the narrow status footer.
- [P2] A completed event order without an attached gate credential had no graphic status.

Fixes: widened the mini card within the unchanged outer slot, reduced the stack offset, removed status truncation, and added the truthful `Complete` fallback for completed event orders.

### Pass 2

Post-fix evidence: `implementation-final.png` and `reference-vs-implementation.png`. All statuses render in full, card stacks remain inside their slots, and no actionable P0, P1, or P2 differences remain.

## Follow-up polish

- P3: the reference is a large standalone hero object while the implementation is a dense list thumbnail; smaller type and tighter stack offsets are intentional consequences of preserving the approved Orders layout.

## Multi-event summary addendum

- Evidence: `/Users/kenanaiahjolmfc/.codex/visualizations/2026/08/17/01a00d70-e5ba-73c0-a9b5-f640ceb1c24e/orders-event-card-stack/multi-event-order.png`.
- At `400 x 964`, the multi-event order reads `NegOr50•50 Series 2: NUTRI-RUN 65 + 2 more` with the supporting line `3 events · 3 registration items`.
- Three distinct event-image layers are visible without overflowing the graphic slot or colliding with the order copy.
- Opening the row still reaches Order Details with all three registration items; returning to Orders succeeds and the browser console remains clean.

## Premium image-derived color addendum

- Replaced the title-keyword color presets with a treatment derived from each card layer's own image: a softly blurred, slightly saturated lower repeat plus a restrained neutral vignette.
- Live browser QA at `400 x 964` covered the futsal, merchandise, relay, tennis, marathon, night-run, woodland, basketball, cycling, pickleball, refunded merchandise, and three-event stack examples.
- Bright artwork no longer receives a neon color band, dark photography retains subject detail, merchandise stays neutral, and each visible multi-event layer keeps its own tonal identity.
- Status text remains fully readable in the unchanged dark footer. The three-event order still opens Order Details with all three registration items, returning to Orders succeeds, and browser console warnings/errors remain empty.

## First-event full-card theme addendum

- The complete order surface now resolves from the first event's explicit `EventBrandTheme`, which is the same palette catalog used by Event Details. Merchandise-only and unbranded orders use the dedicated PlanOut teal gradient.
- Live computed-style inspection covered the first thirteen rows and confirmed distinct football, PlanOut, beach, court, heritage, stride, arena, and velo gradients. Every inspected palette resolved to a white high-contrast foreground.
- The Basketball row uses the Event Details maroon gradient; both merchandise rows use the PlanOut fallback; and the three-event order deterministically uses its first event's stride palette.
- The previously verified `400 x 964` card geometry and density are unchanged: only the button surface, border, shadow, and text tokens changed. The current full-surface visual pass also showed clear event photography, readable metadata and price, and status chips remaining secondary to the order title.
- Runtime checks passed for `All`, `Pending` (`7` rows), and `Complete` (`8` rows). Opening the Futsal row still reached `/orders/tkt-013`; `Fill up` still reached the targeted Player 8 form with `returnTo=order`, `participantId=tkt-013-player-8`, and `playerOnly=1`.
- Browser console warnings/errors remained empty. No actionable P0, P1, or P2 issues were found.

final result: passed

## Apple-like frosted material addendum

- Each order card now uses one low-opacity, softly blurred first-event image beneath one event-brand tint, one restrained frosted veil, and one specular edge. Multi-event orders remain deterministically themed by their first event; merchandise-only orders retain the PlanOut teal fallback.
- Live computed-style inspection covered the Futsal dark-green, PlanOut teal, Canlaon earth, and Basketball maroon cards. The material resolved to `blur(16px) saturate(1.3)`, the ambient image to `0.22` opacity, and the compact status material to `blur(10px) saturate(1.35)` over `rgba(7,12,18,0.66)`.
- All ambient, tint, veil, and highlight layers are pointer-inert and hidden from assistive technology. The browser accessibility snapshot contains the complete order labels and statuses without exposing decorative layers.
- Reduced-transparency removes the ambient image and backdrop filter in favor of a solid branded surface. Increased-contrast strengthens the card edge and muted metadata. Reduced-motion removes the hover lift.
- Runtime checks passed for `Pending` (`7` rows), `Complete` (`8` rows), and `All` (`15` rows). The Futsal row opened `/orders/tkt-013`; `Fill up` opened `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`.
- Browser console warnings/errors remained empty. No actionable P0, P1, or P2 issues were found.

## Full-bleed event image revision

- Removed the overview thumbnail stack, rear-card depth, white thumbnail frame, tonal repeat, and dark status footer. Live DOM inspection found `0` `order-event-card-stack` elements and exactly one `order-card-image` layer for each of the `15` order cards.
- The first event or merchandise image now spans the complete card at `0.46` opacity with a subtle `1.02` scale. It sits beneath the first-event brand tint, one bottom vignette, a `blur(3px) saturate(1.2)` material veil, and the existing specular highlight.
- Status now appears once as a semantic dot and plain label in the upper metadata row. Computed styles confirmed a transparent background and no backdrop filter for `Forms needed`, `Processing`, `Ready for gate`, and `Complete`.
- Live visual inspection covered the Futsal dark-green, PlanOut teal, Canlaon earth, and Basketball maroon cards. Photography remains recognizable, text and prices remain legible, and the card height remains `136px` at the desktop grid breakpoint; the mobile class retains the specified `120px` minimum.
- The accessibility snapshot exposes status, date, title, summary, and price as one button label without exposing the decorative image, tint, vignette, material, or highlight layers.
- Runtime checks passed for `Pending` (`7` rows), `Complete` (`8` rows), and `All` (`15` rows). The Futsal row opened `/orders/tkt-013`; `Fill up` opened `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`.
- Browser console warnings/errors remained empty. No actionable P0, P1, or P2 issues were found.

## Cinematic premium refinement

- Increased the full-bleed event image to `0.78` opacity with a `1.03` crop, `contrast(1.04)`, and `saturate(1.12)`, preserving the first-event image and theme for multi-event orders.
- Replaced the even tint plus separate vignette with one combined brand-directional and bottom-up cinematic scrim. Live inspection confirmed distinct Futsal dark-green, PlanOut teal, Canlaon earth, and Basketball maroon treatments.
- Removed the default backdrop blur. The material is now a nearly transparent white veil with `saturate(1.12)`, a shorter upper-left highlight, a brighter top inset, and a controlled dark lower edge.
- Strengthened the title to `18px` on mobile and `20px` at the desktop breakpoint, reduced its measure to `82%`, and limited the subtle text shadow to the title and price. Status remains a transparent dot-and-label treatment.
- Reduced-motion freezes the image at its resting `1.03` scale; reduced-transparency and increased-contrast fallbacks remain intact.
- Live mobile QA at `400 x 964` confirmed readable photography, metadata, titles, summaries, and prices with no card clipping or added overview clutter. DOM inspection found `15` full-card images, `15` status labels, `0` folder graphics, and `0` separate vignette layers.
- Runtime checks passed for `Pending` (`7` rows), `Complete` (`8` rows), and `All` (`15` rows). The Futsal row opened `/orders/tkt-013`; `Fill up` opened `/orders/tkt-013/form?returnTo=order&participantId=tkt-013-player-8&playerOnly=1`.
- Browser console warnings/errors remained empty. No actionable P0, P1, or P2 issues were found.

## Adaptive Orders overview and detail refinement

- The multi-event overview title now keeps the first event as the primary label and renders `+2 more` as a quiet translucent capsule within the existing two-line title area. Status uses the same compact semantic glass component across overview and detail: amber for forms, mint for gate-ready, blue for processing/neutral states, and rose for refunds.
- Live `400 x 964` overview QA confirmed `15` status labels, one multi-event count capsule, unchanged `120px` minimum card geometry, and no overlap among date, title, summary, or price.
- Single-event Order Details QA on `/orders/tkt-013` confirmed `data-cover-mode="single"`, one decorative image with an empty alt, the team registration card, all eight player rows, the pending-form count, bulk email/copy actions, and the payment summary.
- Multi-event Order Details QA confirmed `data-cover-mode="mosaic"`, three distinct cover images, the order-level title `3-event order`, three registration cards, and preserved per-entry form/QR actions. The layout uses a `62/38` dominant-and-stacked grid so the first event establishes visual continuity without misrepresenting the order as a single event.
- Merchandise-only Order Details QA confirmed `data-cover-mode="single"`, the title `PlanOut Official Gear`, the truthful summary `3 items`, no Registration heading, both merchandise line items, and the existing payment summary.
- The cover derives distinct events from `ticket.id`, requests at most three images, uses existing event-brand gradients when imagery fails, and adds no canvas, generated collage, carousel, dependency, or API requirement.
- Reduced-transparency hides cover photography while retaining deterministic gradients; increased-contrast strengthens the cover edge; reduced-motion removes cover-image transforms and transitions.
- Focused Orders tests passed `32/32`; the production build passed. Live browser logs contained no runtime warning or error entries (only Vite/React development messages). No actionable P0, P1, or P2 issues were found.
