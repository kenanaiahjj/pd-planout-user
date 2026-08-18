# Team Player Access Accuracy Implementation Plan

> **For agentic workers:** Implement this plan inline with test-first checkpoints. Preserve unrelated worktree changes.

**Goal:** Make team purchases represent independent player access paths: buyer-filled players use an app-less Guest QR, while players who claim an invitation receive the entry on their own Passport; no team-wide credential or team-lead roster-management state remains.

**Architecture:** Keep the existing team purchase and player-entry records, but add an explicit per-player access path and persist it in the shared registration queue. Orders will render each player from that state, Guest QR generation will remain keyed to the player entry, and Passport Events will render only players whose access path is Passport. The team form will stop presenting itself as a team-lead roster manager and will use the existing individual form/claim actions.

**Tech Stack:** React 18, TypeScript, React Router, Vite, Node built-in test runner for pure access-state tests.

## Global Constraints

- Preserve unrelated existing user changes in the working tree.
- Do not add a team-wide QR, team-lead Passport credential, Lead Transfer route, or Manage Roster surface.
- Keep `Guest QR` app-less and buyer-managed; it must not imply Passport ownership.
- A Passport path requires the recipient to sign in/create an account and complete their own form.
- Use explicit user-managed states such as pending, claim link sent, and Guest QR ready/sent.

### Task 1: Define and test per-player access resolution

**Files:**
- Create: `src/app/data/teamAccess.js`
- Create: `tests/team-access.test.mjs`

- [ ] Write failing tests for buyer-filled, claim-link-pending, claim-link-completed, and unassigned player states.
- [ ] Run `node --test tests/team-access.test.mjs` and confirm the new expectations fail before the helper exists.
- [ ] Implement a small pure resolver that returns `pending`, `guest_qr`, or `passport` without inferring Passport ownership from an email address alone.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Persist individual team-player state

**Files:**
- Modify: `src/app/data/tickets.ts`
- Modify: `src/app/context/AppContext.tsx`
- Modify: `src/app/routes/ParticipantFormRoute.tsx`
- Modify: `src/app/pages/GuestEntryPages.tsx`

- [ ] Add an optional per-player access path and participant identifier to registration entries.
- [ ] Seed team player entries with their actual participant IDs instead of one unaddressable team summary when constructing the queue.
- [ ] Add a context update method that persists one player’s form/access outcome in local storage.
- [ ] Make buyer-filled completion set `guest_qr`; make claim-link completion set `passport` only after the authenticated recipient completes the claim form.
- [ ] Keep Guest QR claiming as a separate one-time history action and do not convert a buyer-managed pass into a team-wide credential.

### Task 3: Align visible Orders and form UI

**Files:**
- Modify: `src/app/pages/OrdersPage.tsx`
- Modify: `src/app/pages/ParticipantFormPage.tsx`

- [ ] Match Orders rows to the specific team player entry and render the correct Passport or Guest QR action from persisted access state.
- [ ] Remove/retire team-lead roster-management wording and controls; retain only the individual player form and claim/Guest QR actions required by the approved flow.
- [ ] Ensure a team player who completes a claim link is never offered a buyer-managed Guest QR for the same access path.
- [ ] Update success and helper copy to use the approved wording consistently.

### Task 4: Align Passport and verify the complete flow

**Files:**
- Modify: `src/app/pages/PassportPage.tsx`
- Modify: `src/app/pages/OrdersPage.tsx`

- [ ] Render a team player in Passport Events only when that specific player has `passport` access.
- [ ] Keep buyer-managed team players in Orders with Guest QR controls and out of the buyer’s Passport.
- [ ] Run the focused state tests, `npm run build`, and source assertions for removed team-lead/roster-management copy.
- [ ] Inspect the final diff and report any remaining unrelated worktree changes without modifying them.
