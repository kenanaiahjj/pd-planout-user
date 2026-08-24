# Checkout form timing and pre-payment gate

## Problem

Mixed carts can contain event entries that require participant details before payment and entries whose details can be completed after payment. The current pre-payment surface uses all pending form slots for its counter and tabs, so it can present a count such as `0/2` even when only one form is required before payment. This makes the payment requirement ambiguous and can make later forms feel like a surprise.

## Goals

- Make the before-payment requirement explicit and accurate.
- Tell the buyer about every after-payment form before payment is submitted.
- Preserve each event's configured form timing.
- Keep the pre-payment form surface focused on the forms that block payment.
- Use the same calm field-aligned visual language as the participant form controls.

## Design

### Form scope

- `before_checkout` entries are the only entries shown as editable tabs in the pre-payment gate.
- The progress indicator counts only those gated entries, using copy such as `0/1 required before payment`.
- `after_checkout` entries are excluded from the pre-payment progress count and editable tabs.
- A visible after-payment summary lists the deferred event and category names before payment. It states that the forms remain available from confirmation, Orders, or Passport.
- The existing payment-screen form reminder continues to show deferred forms after the gate has been completed.

### Pre-payment layout

The pre-payment section uses a clear sequence:

1. A compact header with a clipboard icon, `Participant details`, and the gated-form progress.
2. A horizontally scrollable event/entry navigator containing only gated entries. Each item shows the category, event name, and a clear `Required now` or completed state.
3. The active form card.
4. An inline `After payment` summary using the same white surface, neutral border, and restrained PlanOut accent as the form fields. The summary is visible without opening a separate panel and lists deferred forms by event.

The section should not use a saturated hero gradient or a warning-colored card for ordinary deferred work. Amber remains reserved for deadlines or problems that require attention.

### State and interaction

- Selecting a gated entry changes the active form without changing the page route.
- Completing a gated form updates the count and its navigator state immediately.
- The buyer can still defer gated forms using the existing action. The deferred summary remains visible and explains that the buyer can finish from the order after payment.
- If no gated entries remain, the gate is skipped and the payment surface is shown directly with the deferred-form reminder when applicable.

## Implementation boundaries

- Reuse `gatedSlots`, `allDeferredSlots`, `SegmentedChoice`, `FormTextField`, and the existing order/payment summary.
- Change the pre-payment navigator and progress to consume the gated subset rather than all pending form slots.
- Add a focused deferred-form summary component or adapt the existing preview component without changing the underlying order schema.
- Keep checkout item timing derived from `getItemFormTiming`; do not infer timing from event names or visual state.

## Verification

- Add source-level regression coverage proving that pre-payment navigation uses gated slots and that the deferred summary is rendered for mixed carts.
- Verify a mixed cart with one before-payment form and at least one after-payment form at mobile width.
- Verify an all-before cart and an all-after cart do not show irrelevant sections.
- Run the full test suite, production build, `git diff --check`, and browser console checks.

