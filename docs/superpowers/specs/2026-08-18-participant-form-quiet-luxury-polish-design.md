# Participant Form Quiet-Luxury Polish Design

**Status:** Approved for implementation  
**Date:** 2026-08-18

## Objective

Polish the existing participant forms opened from Orders, Checkout, Passport, Home, registration queues, and claim links so they feel more premium and are easier to read and fill in. Apply the approved **Quiet luxury** direction while preserving the current form layout, content order, behavior, state transitions, routes, and destination-specific return behavior.

This is a visual-system refinement, not a form redesign.

## Approved Direction

Quiet luxury uses warm neutral surfaces, deep emerald actions, restrained depth, crisp green-gray edges, and stronger text hierarchy. The finish should feel deliberate and calm rather than decorative.

The forms retain their current PlanOut identity:

- warm off-white page and card surfaces;
- dark neutral primary text with high-contrast labels;
- restrained emerald for focus, selection, successful states, and primary actions;
- red and amber only for error, deadline, and warning semantics;
- minimal shadows and no gradients except the existing restrained primary-action treatment;
- no glass blur, ornamental texture, or animation added to the form.

## Scope

Apply the shared finish to participant-form controls and states in:

- `src/app/pages/ParticipantFormPage.tsx`, including single-entry, selected team-player, buyer-filled guest, invite, completed, sent, resubmission, and claim-link states;
- the pre-payment participant-details gate in `src/app/components/CheckoutPage.tsx`, including its current participant switcher and buyer-fill/invite variants;
- shared controls used by those surfaces, primarily `src/app/components/FormTextField.tsx` and `src/app/components/SegmentedChoice.tsx`, through an opt-in participant-form appearance rather than an app-wide restyle.

The same appearance must remain consistent regardless of whether the participant form was reached from Orders, Checkout, Passport, Home, the registration queue, or a claim link.

## Layout and Behavior Preservation

Keep all current structure and behavior unchanged:

- event header placement and content;
- participant identity/status card placement;
- deadline and ownership explanation placement;
- `Fill Details Myself` and `Invite via Email` segmented control;
- `This entry is for` ownership choices;
- field order, field grouping, and responsive column behavior;
- document-upload placement and behavior;
- `Save details`, `Cancel`, `Submit Form`, `Save details and continue`, and `Fill up later` placement and behavior;
- participant/slot switcher placement and behavior in Checkout;
- completed, invite-sent, conflict, resubmission, and read-only layouts;
- validation timing, persistence, submission, ownership, Guest QR, Passport, and invite semantics;
- all route parameters, return destinations, and authentication behavior.

Do not add steps, accordions, progressive disclosure, new fields, new actions, sticky controls, auto-save, or new completion logic.

## Visual System

### Surfaces

- Use a warm neutral page background close to the current app shell.
- Keep event and form cards white or subtly warm white.
- Replace low-contrast nested gray boxes with restrained green-gray borders and very light neutral fills while retaining the same containers.
- Use one controlled card shadow, approximately a soft low-opacity ambient lift. Do not stack multiple strong shadows.
- Keep current corner-radius families, but make borders, fills, and shadows consistent across the event card, participant card, form frame, upload control, and state panels.

### Typography

- Preserve the current typeface and content hierarchy.
- Keep the page title and event title sizes structurally unchanged.
- Render field labels at a clearly readable `13px` minimum, semibold, with dark neutral text.
- Render inputs at `14–16px` depending on the existing responsive context; mobile text inputs must avoid visually tiny text.
- Render helper and explanatory copy at a readable `12px` minimum where space permits, with stronger contrast than the current light slate treatment.
- Keep required markers close to their labels and use semantic red without increasing their visual weight.
- Preserve all existing copy exactly unless a text change is required for accessibility; no product-language rewrite is in scope.

### Text Fields and Textareas

- Preserve current dimensions and responsive placement.
- Use a warm-white input surface, a crisp neutral border, and minimal inset depth.
- On hover, strengthen the neutral border without changing layout.
- On focus, use an emerald border plus a visible low-opacity `2px` focus ring.
- Keep the label readable during focus; emerald label color may reinforce focus but must not be the only focus indicator.
- Preserve warning highlighting and disabled behavior while improving their text and border contrast.
- Keep placeholders visibly secondary but readable.

### Segmented Controls and Ownership Choices

- Preserve all current options, labels, icons, dimensions, and click targets.
- Use a quiet green-gray segmented-control track.
- Use a warm-white selected segment with a fine edge and restrained shadow; unselected text remains readable.
- Use a pale emerald selected ownership surface, a clear emerald edge, and a strongly visible radio state.
- Keep unselected ownership choices white with a neutral border.
- Preserve the current access-path explanations under `For me` and `For someone else`.

### Upload Control

- Preserve the existing upload interaction, accepted file types, upload states, and placement.
- Use a quiet warm-white surface with a refined green-gray dashed edge.
- Give the upload icon a pale emerald well rather than a prominent floating treatment.
- Strengthen the upload action label and keep file guidance clearly secondary but readable.
- Preserve completed-upload, remove-file, verification, and error behavior.

### Actions

- Preserve every action's current label, order, dimensions, and enabled/disabled logic.
- Use deep emerald for the existing primary action and warm white with a neutral border for existing secondary actions.
- Keep disabled controls visibly inactive without making their labels unreadable.
- Preserve current hover, active, and focus behavior; reduce visual movement to a subtle press state.
- Do not promote `Save details` over `Submit Form` or alter the existing action hierarchy.

### Status and Feedback States

- Retain existing semantic colors and wording for not-started, completed, invite-sent, deadline, warning, conflict, upload-success, and validation states.
- Use tinted surfaces and fine edges rather than saturated blocks.
- Do not rely on color alone: icons, labels, and existing status text remain present.
- Toasts, dialogs, and confirmation behavior remain unchanged; only participant-form-local surfaces receive the shared finish.

## Shared Implementation Boundary

Use an opt-in participant-form appearance for shared controls. Do not silently change every use of `FormTextField`, `FormTextarea`, or `SegmentedChoice` elsewhere in the product.

The opt-in appearance may be implemented with scoped classes, data attributes, or an explicit visual-variant prop. It must:

- produce the same styling in `ParticipantFormPage` and the Checkout participant gate;
- leave DOM order and component behavior intact;
- avoid duplicating a separate field component in each surface;
- preserve existing component defaults for non-participant forms;
- add no dependency.

## Responsive Behavior

### Mobile

- Preserve the current single-column reading order and current stacked field behavior.
- Keep all interactive targets at least `44px` where the current control category permits.
- Ensure labels, helper copy, selected states, and disabled actions remain legible at `393px` width.
- Preserve safe-area, header, footer, bottom-navigation, and Messenger clearance.

### Desktop

- Preserve the current participant-form widths, sidebar/event context, field rows, Checkout gate grid, and participant switcher.
- Do not turn the form into a new panel arrangement or change the number of columns.
- Keep focus and selected states as visible on desktop as on mobile.

## Accessibility

- Meet WCAG AA contrast for primary text, labels, helper text, control borders where required, state text, and button labels.
- Preserve semantic labels, radio groups, button roles, required markers, and keyboard order.
- Provide a clearly visible `:focus-visible` treatment for buttons, segmented options, ownership choices, fields, upload controls, and icon actions.
- Ensure selected, error, warning, disabled, and completed states remain understandable without color alone.
- Do not add motion. Respect the product's existing reduced-motion behavior.

## Error Handling and Data Flow

No data-flow or validation changes are part of this work.

- Existing local form state remains the source of field values.
- Existing callbacks continue to handle field updates, ownership changes, participant invites, uploads, saves, and submission.
- Existing `ParticipantFormRoute` parameters and return destinations remain unchanged.
- Existing Checkout slot state, completion counts, validation, deferral, and payment continuation remain unchanged.
- Existing validation messages, invite conflicts, claim results, and submission states are restyled only where they already render within the form.

## Scope Boundaries

- Do not redesign the Passport card or Passport page in this change.
- Do not change Orders, Checkout, Passport, Home, registration-queue, or claim-link navigation.
- Do not change field order, grouping, requiredness, defaults, validation rules, submission, persistence, ownership, or access-path semantics.
- Do not add a stepper, accordion, sticky action bar, progress model, auto-save, new upload mechanism, or new field.
- Do not change copy, email behavior, Guest QR behavior, Passport attachment, or invite ownership.
- Do not globally restyle unrelated forms.
- Do not add dependencies.
- Preserve all unrelated dirty-worktree changes and commit only this design document at the specification stage.

## Verification

### Source and automated checks

- Add focused assertions for the opt-in participant-form appearance and preservation of existing control labels and actions.
- Keep existing participant-form state, team-access, checkout-confirmation, form-link, and ownership tests passing.
- Run the complete Node test suite, production build, and `git diff --check` before completion.

### Browser checks

Verify the actual rendered product, not only source classes, at representative mobile and desktop sizes:

- `/orders/tkt-003/form?returnTo=orders` for a standard buyer form;
- `/orders/tkt-013/form?returnTo=order&participantId=p7&playerOnly=1` for a selected team-player form and ownership choice;
- `/orders/tkt-013/form?returnTo=order&participantId=p1&playerOnly=1` for a completed/read-only form;
- `/orders/tkt-013/form?returnTo=order&participantId=p5&playerOnly=1` for an invite-sent state;
- `/checkout#demo` for the pre-payment participant-details gate and participant switcher.

On those routes, confirm:

- event, participant, deadline, explanation, segmented control, ownership choices, fields, upload, and actions remain in their current positions;
- default, hover, focus-visible, filled, warning, invalid, disabled, selected, uploaded, completed, and invite-sent states are legible;
- switching tabs and ownership still changes the same state;
- filling fields, uploading, saving, deferring, inviting, and submitting still use the current callbacks and destinations;
- mobile and desktop layouts match their current structure;
- there are no new console errors or warnings.
