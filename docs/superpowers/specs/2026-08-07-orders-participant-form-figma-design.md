# Orders and Participant Form Figma Handoff Design

## Goal

Export the current PlanOut Orders and participant-form route families into the supplied Figma design file as mobile-only, 393px-wide, editable frames with connected prototype interactions and representative app-representable states.

## Scope

The handoff covers only the screens rendered by these route families:

- `/orders`
- `/orders/:orderId`
- `/orders/:ticketId/form`

The frame set includes the state branches exposed by the current source and mock data: all/pending/complete order filters, filtered-empty results, single/multiple/team order details, ready/Passport, form-needed, claim-link, buyer-managed Guest QR, resubmit, released, refund/merchandise, not-found, invite review sheets, bulk invite review, reminder/view-form dialogs, player ownership choice, add/remove player, completed success, invite conflict, and revoked-link states.

Screens outside these routes are not rebuilt as full screens. Actions that leave the scoped route family are represented as outbound prototype destinations in the interaction ledger, including Passport, Guest QR, event detail, help/inbox, and receipt actions.

## Recommended approach

Use the live web app as the visual source of truth at a 393px viewport. Capture each meaningful route state into the existing Figma file, use the capture as a pixel-accurate reference, and finish the handoff with editable Figma layer trees rather than screenshot-only image frames. Repeated controls should be native Figma components or instances where practical; text, cards, icons, imagery, fields, dialogs, and state labels must remain editable.

The capture workflow may temporarily add the HTML-to-design hook to `index.html` and run Vite locally. Temporary source changes, capture scripts, local export files, and the dev server must be removed or stopped before handoff.

## Figma organization

- Target file: `ZOaDqfYD1FKadGrrrzxGGS`
- Starting target node: `12284:37`
- Mobile frame width: exactly `393px`
- Top-level frame names use ordered prefixes and route/state names, for example `Orders / 01 — All`, `Orders / Detail — Mixed registration`, and `Forms / Team — Guest QR choice`.
- Screens are grouped into clearly named sections for Orders overview, Order detail, Participant forms, Overlays, and Interaction ledger.
- Frames use the product's current typography, colors, imagery, and spacing from the live source. The source uses Inter-family text styles and the existing PlanOut teal/indigo/amber/red state vocabulary.

## Screen and state inventory

### Orders overview

1. All orders with the current order cards and state labels.
2. Pending filter with pending orders.
3. Complete filter with complete orders.
4. A filtered-empty state showing `No orders here` and the filter recovery action.

### Order detail

1. Single ready order with registration form and Passport/gate actions.
2. Multiple-ticket mixed order showing self, invited claim-link, and buyer-managed Guest QR entries.
3. Multiple-ticket prior/pending state showing an unassigned form-needed entry.
4. Team order with player progress, pending player, invited player, and buyer-managed player actions.
5. Team order with mixed Passport-owned and Guest QR-owned players, including recorded owner labels.
6. Resubmit-required entry with `Review changes`.
7. Released entry with deadline explanation and slot-availability action.
8. Merchandise/refund detail with payment status and refund explanation where the current order data provides it.
9. Invalid order with `Order not found` and `Back to Orders`.
10. Individual email review sheet, including recipient editing and send/cancel actions.
11. Bulk email review sheet, including recipient list editing and send/cancel actions.
12. Remove-player confirmation dialog.

### Participant forms

1. Single-ticket form: blank/partially filled, field validation affordances, waiver upload, and save/submit actions.
2. Single-ticket completed form and submitted success surface.
3. Single-ticket `Send form` mode with recipient editing, send confirmation, and undo/change-email path.
4. Multiple-ticket participant manager with participant tabs and progress summary.
5. Multiple-ticket pending invite state with View, Resend, Reminder, Undo, and Change email actions.
6. Multiple-ticket completed participant state with View form and completed-information modal.
7. Multiple-ticket `Send all` mode with eligible and completed participant rows plus send/cancel actions.
8. Team manager with player progress, player tabs, deadline/count information, and Add player.
9. Team player form with Passport versus Guest QR ownership choice.
10. Team player form after ownership choice is locked by a completed Passport entry.
11. New-player form state after adding an eligible slot.
12. Remove-player confirmation dialog for an eligible unsent slot.
13. Resubmission form with prefilled information and `Save changes`.
14. Shared invite form using the normal form surface, with the invited participant selected and buyer-only controls hidden.
15. Shared invite success state attaching the entry to the recipient's Passport.
16. Shared invite conflict state preserving answers and exposing `Copy my answers`.
17. Revoked shared-link state explaining that the buyer took the form back.
18. Reminder and View form modal states.

## Interaction model

Native prototype connections cover every in-scope action that changes the visible state:

- Orders filter tabs switch between all, pending, complete, and filtered-empty frames.
- Order cards open their corresponding detail frames.
- Detail form actions open the matching form frame or form mode.
- Send link, Email all, Copy link, Copy all, Revoke, Resend, Undo, Change email, Add player, Remove, Generate QR, and View QR actions connect to their next visible state or overlay.
- Participant tabs switch the active participant/player frame.
- Fill details, Send form, and Send all modes switch within the participant-form set.
- Ownership selection switches between Passport and Guest QR states and locks after completion where the source does.
- Submit/save actions connect to completed, pending, conflict, revoked, or resubmission states as appropriate.
- Actions that leave the scoped route family are labeled with their outbound route destination instead of receiving a full rebuilt destination screen.

Transient toasts are represented only where they materially explain an interaction outcome; the primary handoff remains centered on persistent screens, overlays, and route states.

## Verification

Before handoff, verify:

1. Every top-level screen frame is 393px wide and contains editable text and native layers rather than a flattened screenshot.
2. Frame names and ordering match the inventory above.
3. Representative first, middle, and last screens in each section render without clipped text, overlap, or horizontal overflow.
4. Prototype links exist for filter, card, form, modal, participant, ownership, invite, and completion transitions.
5. Current source copy and state labels match the live app, including the distinction between recipient-owned Passport access and buyer-managed Guest QR access.
6. No temporary capture hook, capture-only route branch, local export artifact, or running dev server remains after cleanup.

