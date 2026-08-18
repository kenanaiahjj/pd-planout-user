# Single-Participant Form Implementation Plan

> **For agentic workers:** Execute this plan inline with the existing PlanOut prototype conventions. Use a failing regression test before each production behavior change.

**Goal:** Make every participant-form route a self-contained form for exactly one individual, with no participant switching or roster-management UI inside the form.

**Architecture:** Orders remains the buyer-managed surface for participant lists, invitations, access status, and team slot management. `ParticipantFormRoute` will require a selected participant for `multiple` and `team` tickets and redirect ambiguous legacy form URLs to the corresponding Orders detail. `ParticipantFormPage` will render only the selected participant while retaining the existing individual submit, invite, Passport, Guest QR, resubmission, and return navigation behaviors.

**Tech Stack:** React, TypeScript/TSX, React Router, Node built-in test runner, Vite.

## Global Constraints

- Preserve the existing per-player access model: self-submitted player → Passport QR; buyer-filled player → app-less Guest QR.
- Keep Orders as the management surface for participant lists, bulk links, invites, add/remove player slots, and access status.
- Do not infer Passport ownership from an email address alone.
- Preserve checkout, invite, resubmission, and `returnTo=order` behavior.
- Preserve the existing dirty worktree; do not reset or overwrite unrelated user changes.

---

### Task 1: Lock the single-participant route contract

**Files:**
- Modify: `tests/guest-qr-access.test.mjs`
- Modify: `tests/order-form-sharing.test.mjs`
- Modify: `src/app/routes/ParticipantFormRoute.tsx`

**Interfaces:**
- Consumes the existing `ticketId`, `participantId`, `entryId`, `invite`, `buyerFill`, and `returnTo` query parameters.
- Produces a route contract where team/multiple forms without a participant target redirect to `/orders/:ticketId` and targeted forms pass one participant to the page.

- [ ] **Step 1: Write the failing assertions**

Add source-level assertions that the route redirects ambiguous multiple/team forms and that the form page no longer receives the old roster callbacks or `newPlayer` mode.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test tests/guest-qr-access.test.mjs tests/order-form-sharing.test.mjs
```

Expected: the new assertions fail against the existing manager/switcher implementation.

- [ ] **Step 3: Implement the narrow route contract**

Resolve one `completionParticipantId` from `participantId`/`entry.participantId`. For `team` and `multiple`, redirect when it is absent except for an invite route that already resolves its invite participant. Pass only the selected participant data and the existing access/submit callbacks into `ParticipantFormPage`; stop passing roster mutation and new-player props from the route.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same command and confirm the new route-contract assertions pass without breaking the existing invite/access assertions.

---

### Task 2: Remove participant switching and manager UI from the form page

**Files:**
- Modify: `src/app/pages/ParticipantFormPage.tsx`
- Modify: `tests/guest-qr-access.test.mjs`

**Interfaces:**
- Consumes one `ticket` whose `participants` collection contains the selected individual, plus `initialParticipantId` when needed for existing route compatibility.
- Produces a self-contained form with one active participant, one submit action, and one return/cancel path.

- [ ] **Step 1: Write the failing assertions**

Assert that the page source no longer contains `Next Participant`, `goToNextIncomplete`, `nextIncompleteIdx`, `isTeamManager`, `isMultiEditor`, `Save player access`, or the participant-switching panel. Retain assertions for Passport/Guest QR ownership and the single participant form fields.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test tests/guest-qr-access.test.mjs
```

Expected: the new removal assertions fail while the existing access-path assertions remain informative.

- [ ] **Step 3: Simplify the page state and render branches**

Replace the participant-array/active-index manager path with the selected participant as the only form subject. Remove participant navigation, add/remove player controls, multi-entry progress panels, send-all views, manager success summaries, and the team “save player access” footer. Keep the selected participant’s ownership choice, form fields, invite mode, buyer-fill review, completion state, Guest QR action, Passport outcome, and Orders return action.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
node --test tests/guest-qr-access.test.mjs tests/order-form-sharing.test.mjs
```

Expected: all focused tests pass and no old participant-switching strings remain in the production form page.

---

### Task 3: Verify route states in the browser and full repository checks

**Files:**
- Read/verify: `src/app/pages/OrdersPage.tsx`
- Read/verify: `src/app/routes/ParticipantFormRoute.tsx`
- Read/verify: `src/app/pages/ParticipantFormPage.tsx`
- Read/verify: `tests/*.test.mjs`

- [ ] **Step 1: Exercise representative routes**

Verify `/orders/tkt-013/form?returnTo=order&participantId=p7&playerOnly=1`, `/orders/tkt-013/form?returnTo=order&participantId=p1&playerOnly=1`, an invite form, a buyer-filled Guest QR form, and `/orders/tkt-013/form?returnTo=order` redirecting to the order detail.

- [ ] **Step 2: Verify the visual contract at desktop and mobile widths**

Confirm the form shows one participant identity, no participant tabs/next action/roster summary, the submit action remains reachable, and completion returns to Orders or Checkout as appropriate.

- [ ] **Step 3: Run final checks**

Run:

```bash
node --test tests/*.test.mjs
npm run build
node .agents/skills/impeccable/scripts/detect.mjs --json $(git diff --name-only --diff-filter=ACMR | rg '^src/.*\.(tsx|ts|css|html)$')
git diff --check
```

Expected: all tests pass, the production build succeeds, the Impeccable detector returns `[]`, and the diff has no whitespace errors.
