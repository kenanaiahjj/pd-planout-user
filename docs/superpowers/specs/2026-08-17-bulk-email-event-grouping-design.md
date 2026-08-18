# Bulk Email Review Event Grouping Design

**Status:** Approved for implementation  
**Date:** 2026-08-17

## Objective

Make the Orders bulk email review accurately identify the event attached to every pending participant form. Replace the current order-level context with an event-aware hierarchy that works for both one eligible event and several eligible events without changing invitation eligibility, recipient editing, validation, or sending behavior.

The selected direction is **A: group recipients by event**. The visual treatment continues the restrained Apple Invites/Lu.ma direction already used by the sheet.

## Problem

`BulkEmailReviewSheet` currently displays `order.name`. For a multi-event order, that string describes the overall purchase using the first event plus an overflow count, such as `NegOr50•50 Series 2: NUTRI-RUN 65 + 2 more`.

That context can be misleading. The pending invite visible in the sheet may belong to a different event, such as `Emerald Pickleball Cup`. The sheet should describe the events represented by the eligible invite entries, not every event contained in the order.

## Data Semantics

- Continue passing the existing eligible `entries` collection into `BulkEmailReviewSheet`.
- Derive event groups from `entries`, not from `order.name` and not from every `order.eventEntries` record.
- Group entries by `entry.ticket.id` so duplicate participant entries for the same event share one event section.
- Preserve the first occurrence order of eligible entries and preserve each event's recipient order.
- Use `entry.ticket.eventTitle` as the visible event name.
- Each event header uses its own eligible-recipient count.
- If an event title is unexpectedly empty, fall back to `Event` without parsing another display string.

## Sheet Composition

### Header

- Keep `Email pending forms` as the task title.
- Keep `Check each recipient before sending.` as the supporting instruction.
- Preserve the grabber, compact close control, dialog semantics, overlay dismissal, and current sheet motion.

### Event groups

- Render one bordered event group per distinct eligible event.
- Each event group begins with a softly tinted header containing the event title and that event's recipient count.
- Place the first event group directly below the sheet header; do not add a separate `EVENT`/`EVENTS` eyebrow or total-recipient capsule.
- Do not show the order aggregate title or `+N more` inside this sheet.
- Render the existing editable recipient email rows immediately below their event header.
- Use separators between recipients within the same event group.
- For a single eligible event, render the same component with one event group; do not introduce a separate single-event layout.
- For several eligible events, stack groups with a compact gap inside the existing scrollable sheet body.

### Supporting note and actions

- Keep the eligibility note: `Only unsent forms without Passport or Guest QR access are included.`
- Render the eligibility note as plain supporting copy with no checkmark, status icon, or leading decoration.
- Preserve `allEmailsValid`; any missing or invalid address disables the send action.
- For one recipient, use `Send invite`.
- For more than one recipient, use `Send <N> invites` so the action confirms the batch size.
- Keep Cancel visually secondary and preserve both Cancel and close-button dismissal.

## Example States

### One eligible event

```text
Emerald Pickleball Cup                     1 recipient
  Jessica Williams
  jessica@email.com
```

This is the correct state for the current `/orders/tkt-001` fixture because its only unsent form belongs to Emerald Pickleball Cup, even though the order contains three events.

### Multiple eligible events

```text
Emerald Pickleball Cup                     2 recipients
  Jessica Williams                         jessica@email.com
  Marco Reyes                              marco@email.com

Apo Island Open Water Swim                 1 recipient
  Anna Cruz                                anna@email.com
```

## Accessibility

- Keep the sheet labeled by `bulk-email-review-title` and described by the instruction and eligibility note.
- The eligibility note remains understandable as text without an icon or color cue.
- Represent every event title as real text; do not depend on color to distinguish event groups.
- Keep every email input associated with the participant label through its existing accessible label.
- Preserve visible focus states and at least the existing touch-target height for inputs and actions.
- The singular/plural labels and counts must remain accurate without visual inference.

## Responsive Behavior

- At `400 × 964`, the sheet remains within the viewport with no horizontal overflow.
- The header and footer remain fixed within the sheet while event groups scroll in the middle region.
- Long event titles may wrap to two lines; counts remain visible and do not force horizontal overflow.
- A large number of recipients or event groups increases only the scrollable body height.

## Scope Boundaries

- Do not change `getBulkEmailCandidates`, invitation status persistence, email validation, recipient editing, toast behavior, or the `onSend(draftEntries)` payload.
- Do not change order grouping, order names, overview cards, Order Details cover data, registration items, Passport ownership, or Guest QR behavior.
- Do not add a new route, schema, dependency, event image, or order-level summary to the sheet.
- Preserve unrelated dirty-worktree changes and do not stage or commit this work.

## Verification

- Add focused source regressions for eligible-entry grouping by `entry.ticket.id`, stable group order, per-event counts, the absence of a redundant event summary row, and the count-aware Send label.
- Run the focused Orders sharing and UI consistency tests through a RED/GREEN cycle.
- Run the complete Node test suite, production build, and `git diff --check`.
- Browser-check `/orders/tkt-001` at `400 × 964` and confirm the sheet begins with `Emerald Pickleball Cup` and its `1 recipient` count, without an `EVENT` eyebrow or aggregate order title.
- Exercise a deterministic multi-event eligible-entry fixture or focused test to confirm multiple groups and recipient counts.
- Confirm invalid emails disable Send, Cancel and close dismiss the sheet, no horizontal overflow occurs, and browser warnings/errors remain empty.
