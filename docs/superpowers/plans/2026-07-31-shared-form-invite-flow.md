# Shared Form Invite Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route shared participant form links through the existing login and participant-form UI while retaining first-submit-wins Passport claiming and draft-preserving conflicts.

**Architecture:** Keep `/ticket-claim/:claimRef` as a compatibility entry point that redirects to the normal `/login` or `/orders/:ticketId/form` route. Pass invite metadata through query parameters and navigation state, then let the existing participant form call `claimRegistrationEntry` on submit. Keep the product's existing buyer-managed Guest QR path unchanged.

**Tech Stack:** React 18, React Router, TypeScript, Tailwind utility classes, Motion, Node's built-in test runner, Vite, Figma HTML capture workflow.

## Global Constraints

- Shared links do not reserve an entry; the first completed submission owns it.
- The invited email is informational only; the authenticated account is the claimant.
- The normal login and participant-form surfaces are the only recipient-facing flow screens.
- A duplicate submit must preserve the local form values and must not overwrite the first Passport owner.
- Buyer-filled entries continue to produce app-less Guest QR access.
- Use existing PlanOut colors, controls, typography, and responsive layout; do not introduce a second claim-specific visual system.
- Remove temporary browser/Figma capture hooks before handoff.

---

### Task 1: Add failing routing and delegation tests

**Files:**
- Modify: `tests/order-form-sharing.test.mjs`
- Modify: `tests/guest-qr-access.test.mjs`
- Test source: `src/app/data/formLinks.js`, `src/app/pages/GuestEntryPages.tsx`, `src/app/routes/LoginRoute.tsx`, `src/app/routes/ParticipantFormRoute.tsx`, `src/app/pages/ParticipantFormPage.tsx`

**Interfaces:**
- The tests read source for route-level wiring and import the pure URL helper.
- The tests must describe the public behavior without depending on browser storage or React rendering.

- [ ] **Step 1: Write the failing tests**

Add assertions that:

```js
assert.match(formLinksSource, /invite=1/);
assert.match(guestEntrySource, /GuestTicketClaimPage[\s\S]*Navigate/);
assert.doesNotMatch(guestEntrySource, /Claim your shared ticket/);
assert.match(loginRouteSource, /location\.state/);
assert.match(participantFormRouteSource, /invite=1|isInvite/);
assert.match(participantFormSource, /claimRegistrationEntry/);
```

Also assert the canonical form link resolves to the normal route after its claim reference:

```js
assert.equal(
  buildParticipantFormLink(entries[0], order.id, 'https://planout.test'),
  'https://planout.test/ticket-claim/CLM-TKT013P5?order=tkt-013&entry=tkt-013-p5',
);
```

- [ ] **Step 2: Run the focused tests to verify RED**

Run:

```bash
node --test tests/order-form-sharing.test.mjs tests/guest-qr-access.test.mjs
```

Expected: FAIL because the route still contains the custom claim shell and does not yet expose invite-mode delegation.

### Task 2: Redirect shared links into normal login and form routes

**Files:**
- Modify: `src/app/data/formLinks.js`
- Modify: `src/app/pages/GuestEntryPages.tsx`
- Modify: `src/app/routes/LoginRoute.tsx`
- Modify: `src/app/routes/ParticipantFormRoute.tsx`

**Interfaces:**
- `buildParticipantFormLink(entry, orderId, origin)` remains the public link builder.
- `GuestTicketClaimPage` resolves `order`, `entry`, and `claimRef` and redirects to a route containing `entryId`, `participantId`, and `invite=1`.
- `LoginRoute` reads `location.state.returnTo` and falls back to context `returnTo`.

- [ ] **Step 1: Replace the claim-shell render with a redirect adapter**

Keep the existing route name for old links, but return a React Router `Navigate` to `/login` when signed out and to the standard form path when authenticated. Build the form path from the resolved ticket and participant, for example:

```ts
const params = new URLSearchParams({
  entryId: entry.queueEntry?.id || entry.id,
  invite: '1',
});
if (entry.ticket.ticketType === 'team') params.set('participantId', entry.participantId);
const formPath = `/orders/${entry.ticket.id}/form?${params.toString()}`;
return isAuthenticated
  ? <Navigate to={formPath} replace />
  : <Navigate to="/login" replace state={{ returnTo: formPath }} />;
```

The adapter must not render the previous “Claim your shared ticket” heading or the custom emergency-contact form.

- [ ] **Step 2: Read the navigation return path in LoginRoute**

Use `useLocation()` and resolve the destination in this order:

```ts
const stateReturnTo = (location.state as { returnTo?: string } | null)?.returnTo;
const destination = stateReturnTo || returnTo || '/';
```

Clear both navigation state through `setReturnTo(null)` and navigate to the destination on either login completion or guest continuation.

- [ ] **Step 3: Mark canonical shared links as invite links at form entry**

Keep the public `/ticket-claim/...` URL stable for copied links and email templates, but make the redirect target the normal form route with `invite=1`. Preserve the `order` and `entry` query data long enough for the adapter to resolve the correct ticket slot.

- [ ] **Step 4: Run the focused tests**

Run:

```bash
node --test tests/order-form-sharing.test.mjs tests/guest-qr-access.test.mjs
```

Expected: PASS for the new routing assertions and all existing ownership assertions.

### Task 3: Submit invite forms through Passport claim logic

**Files:**
- Modify: `src/app/routes/ParticipantFormRoute.tsx`
- Modify: `src/app/pages/ParticipantFormPage.tsx`

**Interfaces:**
- Add optional `inviteEntryId`, `inviteParticipantId`, `onInviteSubmit`, or an equivalent narrow callback to `ParticipantFormPage`.
- The callback returns `{ ok: true }` or `{ ok: false, ownerName: string }` so the page can render success or conflict without replacing the form.

- [ ] **Step 1: Add the failing delegation assertion**

Assert that invite form submission calls the claim path and that the normal buyer-managed save path remains available for non-invite forms.

- [ ] **Step 2: Pass invite metadata from ParticipantFormRoute**

Read `invite=1`, resolve the selected participant, and pass a callback that calls:

```ts
claimRegistrationEntry({
  entryId: entryId || entry?.id || '',
  ticketId: ticket?.ticketType === 'team' ? ticket.id : undefined,
  participantId: ticket?.ticketType === 'team' ? participantId : undefined,
});
```

Keep `AuthGuard` around the normal form route, so a direct form URL still returns to login if the session is absent.

- [ ] **Step 3: Add the invite-mode submit state to ParticipantFormPage**

In invite mode, select the target participant, hide buyer-only “Fill details / Send claim link / Send all” controls, and keep the existing field layout. On submit:

```ts
const result = onInviteSubmit?.();
if (!result?.ok) {
  setInviteConflictOwner(result?.ownerName || 'another Passport');
  setInviteConflict(true);
  return;
}
setSubmitted(true);
```

Persist the in-progress form values under a route-specific session key while invite mode is active. After a successful claim, clear that key. After a conflict, keep it and disable the submit action while showing an inline warning and “Copy my answers” action.

- [ ] **Step 4: Keep standard success UI**

Use the existing `submitted` success surface and copy it to explain that the entry is now available from Passport. Do not add a custom invite-only completion page.

- [ ] **Step 5: Run all tests and build**

Run:

```bash
node --test tests/*.mjs
npm run build
git diff --check
```

Expected: all tests pass, Vite build succeeds, and diff check is clean.

### Task 4: Verify the live flow and update Figma

**Files:**
- Modify: `index.html` only temporarily for HTML-to-design capture; remove the temporary script before handoff.
- Figma file: `ZOaDqfYD1FKadGrrrzxGGS`, Section `12255:50`.

**Interfaces:**
- Capture the existing `/login` route, standard invite-mode `/orders/tkt-013/form?...` route, normal success state, and duplicate-conflict state.
- Remove obsolete custom claim-shell frames and labels from Section 4.

- [ ] **Step 1: Verify signed-out and signed-in routes in the browser**

Use the existing local server and app browser to open a fresh shared link. Confirm the first visible screen is `/login`, then complete the mock login and confirm the next screen is the standard participant form with the correct participant selected. Open the same link while authenticated and confirm it skips login.

- [ ] **Step 2: Verify first-submit-wins behavior**

Complete the form once as the first mock account, open the same link as a second mock account, and confirm the second form remains populated, reports that another Passport claimed the entry, and leaves the first owner intact.

- [ ] **Step 3: Replace the obsolete Figma captures**

Delete the custom claim-shell frames and labels from Section 4. Capture and label the standard login, standard form, Passport success, and preserved-conflict states. Keep the Orders entry/share surface and ensure the section title explains that the link flows through login and the regular form.

- [ ] **Step 4: Remove capture hooks and verify cleanup**

Remove any temporary HTML-to-design script from `index.html`, confirm no `captureMode` or capture-only query branches remain, and run:

```bash
rg -n "html-to-design|captureMode|capture=conflict" index.html src tests
```

Expected: no temporary capture hooks are present.
