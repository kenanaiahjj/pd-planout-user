# Order Registration Grouped List Design

**Status:** Approved for implementation  
**Date:** 2026-08-17

## Objective

Replace the stack of separate Registration cards on Order Details with one continuous event list. The result should feel calmer and more coherent with Apple Invites and Lu.ma while preserving every existing form, invitation, Passport QR, Guest QR, team-player, and removal flow.

## Approved Direction

Use one shared Registration surface with subtle dividers between events. Each event remains a semantic `article`, keeps its thumbnail, title, date, status, and actions, and uses the same component for one-event and multi-event orders.

The primary reading path is:

1. Registration heading and aggregate pending-form state.
2. Optional bulk form-sharing controls.
3. Event identity.
4. Current registration status.
5. The most important action, with recovery or sharing actions visually secondary.

## Surface Composition

- Add one `registration-event-list` container around all registration entries.
- The list owns the rounded corners, border, white material, clipping, and shadow.
- `RegistrationItemShell` becomes an unboxed event section inside the shared surface.
- Adjacent event sections use one subtle divider. They do not repeat rounded corners, borders, or card shadows.
- The first and last event inherit the outer surface's clipping.
- The existing Registration heading and bulk-sharing controls stay outside the list so they continue to describe the whole order.

## Event Identity

- Keep a 40px event thumbnail, two-line event title, and date.
- Use a transparent header instead of a second white card header.
- Keep the identity block compact enough that three normal individual events fit comfortably in the mobile viewport.
- Long titles may wrap to two lines without pushing actions outside the viewport.

## Status and Action Hierarchy

- Status is concise, semantic, and adjacent to the controls it describes.
- Ready individual entries use `Ready for gate` with `Universal QR` as quiet supporting context. Remove the repeated sentence `Ready for gate - staff scans your universal QR.`
- Pending individual entries retain `Form needed` and the specific reason, but no additional warning panel or repeated heading.
- Claim-link, Guest QR, resubmission, released, and team-player states keep their current meanings and behavior.
- Each state keeps one filled primary action where an obvious next step exists. Supporting actions stay secondary.
- Do not hide or remove `View form`, `Fill up`, `Send link`, `Copy link`, `View QR`, revoke, player-add, or player-remove capabilities.

## Team Events

- A team event remains one event section within the same shared list.
- Team progress and bulk-sharing controls remain nested below the event identity.
- Player rows retain their existing dividers, status logic, QR actions, Passport actions, invitation controls, and removal confirmation.
- The event-to-event divider must remain visually stronger than the dividers between players inside a team event.

## Responsive and Accessibility Requirements

- Preserve semantic `article`, `section`, heading, progressbar, button, and dialog behavior.
- Preserve DOM order as the visual reading and keyboard order.
- At `400 × 964`, the Registration surface must not create horizontal overflow.
- Action rows may wrap on narrow screens; the filled primary action remains visually clear.
- No new motion is required. Existing button press feedback and dialogs remain unchanged.

## Scope Boundaries

- Do not change registration data, eligibility, invitation persistence, form routes, QR generation, Passport ownership, Guest QR ownership, payment information, or Order cover behavior.
- Do not add a new route, schema, dependency, or event-level disclosure interaction.
- Preserve unrelated dirty-worktree changes and do not stage or commit this work.

## Verification

- Add a source-contract regression requiring one shared `registration-event-list` surface and unboxed event sections.
- Add a regression requiring concise ready-state copy and preserving the primary QR action.
- Run the focused Orders UI and form-sharing tests through a RED/GREEN cycle.
- Run the complete Node test suite, production build, and focused `git diff --check`.
- Browser-check `/orders/tkt-001` at `400 × 964`, including the multi-event list, the pending event actions, the bulk email review, and browser warning/error logs.
