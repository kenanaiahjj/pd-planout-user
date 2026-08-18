# Bulk Email Review Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Orders bulk invite review into a compact, event-first Apple Invites/Lu.ma-inspired sheet without changing recipient eligibility, email validation, or send behavior.

**Architecture:** Keep `BulkEmailReviewSheet` and its existing state/handlers in `OrdersPage.tsx`. Recompose only its presentation into a concise header, a dedicated order context strip, a compact recipient list, an inline eligibility note, and a primary-action footer; source-contract tests protect the hierarchy and behavior.

**Tech Stack:** React, TypeScript, Tailwind CSS, Motion, Lucide React, Node test runner

## Global Constraints

- Preserve `getBulkEmailCandidates`, email validation, `onSend(draftEntries)`, overlay dismissal, and Cancel behavior.
- Keep the order name visible but visually secondary to the invite task.
- Use one clear primary Send action and a quieter Cancel action.
- Preserve mobile keyboard safety, focus styles, dialog semantics, and reduced-motion behavior already supplied by shared components and Motion.
- Do not add dependencies, routes, schema changes, or invitation behavior.
- Preserve unrelated dirty-worktree changes; do not stage or commit this work.

---

### Task 1: Refine the bulk invite review hierarchy

**Files:**
- Modify: `tests/order-form-sharing.test.mjs`
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `src/app/pages/OrdersPage.tsx:906-1040`

**Interfaces:**
- Consumes: `BulkEmailReviewSheet({ order, entries, open, onClose, onSend })`, `PrimaryButton`, and existing `OrderEventEntry` data.
- Produces: stable `bulk-email-event-context`, `bulk-email-recipient-list`, `bulk-email-eligibility-note`, and `bulk-email-actions` test hooks; singular/plural Send label.

- [x] **Step 1: Write failing source-contract tests**

Add assertions that the bulk sheet renders the four semantic regions, places `order.name` in a two-line event context next to a recipient-count capsule, uses a Lucide `X` close icon, retains compact email fields, and chooses `Send invite` or `Send invites` from `entries.length`.

- [x] **Step 2: Run the focused tests and verify RED**

Run: `node --test tests/order-form-sharing.test.mjs tests/orders-ui-consistency.test.mjs`

Expected: FAIL because the new semantic hooks, recipient-count copy, Lucide close icon, and singular/plural CTA do not yet exist in `BulkEmailReviewSheet`.

- [x] **Step 3: Implement the presentation-only refinement**

Update the existing JSX so the sheet has:

- a restrained title/subtitle header with a compact icon close control;
- a separate order context strip with a two-line order name and recipient-count capsule;
- a white, divided recipient list with compact labels and email fields;
- a quiet inline eligibility note;
- a lightly frosted footer with one prominent Send button and a plain Cancel action.

Do not change `emailDrafts`, `draftEntries`, `allEmailsValid`, or the `onSend` payload.

- [x] **Step 4: Run focused tests and verify GREEN**

Run: `node --test tests/order-form-sharing.test.mjs tests/orders-ui-consistency.test.mjs`

Expected: both files pass with no warnings or errors.

- [x] **Step 5: Verify the live sheet and full repository**

Open `/orders/tkt-001` at `400 × 964`, activate `Email all`, and confirm the long multi-event order name, recipient count, recipient email rows, eligibility note, disabled/active Send state, Cancel, overlay close, and browser console. Then run `node --test --test-reporter=dot tests/*.test.mjs`, `npm run build`, and `git diff --check`.

Expected: no clipping or horizontal overflow, all flows remain functional, all tests and build pass, and browser warnings/errors remain empty.
