# Shared persisted mock state design

## Goal

Make the PlanOut prototype behave like one connected product flow. Event discovery, cart, checkout, Orders, participant forms, Passport, team access, and Guest QR must read and mutate the same mock state. The state must survive a page reload and provide a deterministic reset for QA.

## Current context

The prototype already exposes shared state through `src/app/context/AppContext.tsx`, including cart items, registration queue entries, team-player access, team rosters, Guest QRs, attendance, and checkout intent. Those layers are persisted independently in `localStorage`.

The remaining disconnects are:

- `src/app/data/events.ts` and `src/app/data/tickets.ts` contain separate event and purchase snapshots.
- `src/app/data/tickets.ts` also appends synthetic registration entries that do not have matching ticket records.
- Orders and Passport derive from different combinations of `MY_TICKETS`, queue entries, team state, and QR state.
- Several routes still resolve ticket and participant data directly from static fixtures instead of a shared selector.

## Design decision

Use a hybrid store:

1. Keep event and ticket fixtures as readable seed data.
2. Normalize fixture relationships by stable event IDs and ticket IDs.
3. Put all mutable prototype state behind one versioned `MockStoreState` owned by `AppContext`.
4. Derive Orders, Passport, forms, and Guest QR views through shared selectors instead of rebuilding relationships locally.
5. Persist the store as one versioned record, with a migration from the existing independent storage keys.

This avoids duplicating the large fixture files while making every interaction update the same state graph.

## Shared state contract

The persisted state will contain the mutable domain and transient flow state:

```ts
interface MockStoreState {
  version: 1;
  cart: CartEvent[];
  checkoutIntent: CheckoutIntent | null;
  checkoutConfirmed: boolean;
  registrationQueueEntries: RegistrationQueueEntry[];
  activeRegistrationOrderRef: string | null;
  entryAttendance: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs: Record<string, GuestEntryQRRecord | undefined>;
  teamPlayerAccess: TeamPlayerAccess;
  teamPlayerRoster: TeamPlayerRoster;
}
```

The user profile and Passport identity remain separate account/session state. Resetting demo data must not unexpectedly log the user out or replace their Passport identity.

## Relationship rules

- Every purchased ticket references one canonical `eventId` from `MOCK_EVENTS`.
- Ticket-specific category, price, quantity, schedule, and participant data remain on the ticket fixture.
- Orders resolve event and ticket metadata through shared selectors. They must not manufacture an unrelated fallback event when a known fixture exists.
- Registration queue entries reference the ticket ID and participant ID they mutate. Synthetic scenarios must include an explicit ticket fixture or remain clearly scoped as standalone form scenarios.
- Participant form updates mutate the queue or team roster record used by Orders and Passport.
- Team access changes update both the team access map and the participant roster overlay.
- Guest QR generation, revocation, use, and claiming update the same QR record that Orders, Guest QR pages, and Passport history read.
- Checkout seeding must upsert into the shared registration state instead of creating a separate checkout-only copy.

## Persistence and migration

Add a versioned storage adapter in `src/app/data/mockStore.ts`:

- `createInitialMockStoreState()` returns deterministic seed state.
- `readMockStoreState()` reads the new single key.
- `writeMockStoreState(state)` persists the complete mutable state.
- `migrateLegacyMockState()` imports the current queue, cart, attendance, Guest QR, team-access, team-roster, checkout, and active-order keys when the new key is absent.
- Invalid or incompatible data falls back to the deterministic seed state.
- `resetMockStoreState()` replaces the persisted store with the seed state and returns the new state.

The reset must be exposed through `AppContext` as `resetMockState()`. The visible QA control should use a confirmation step and clearly say that it resets demo registrations, participant forms, team access, Guest QRs, cart, and checkout progress.

## Consumer boundaries

`AppContext` is the only mutable-state owner. Pages and components consume:

- shared state and mutation methods from `useAppContext()`;
- selectors for event, ticket, order, participant, and Passport projections;
- fixture constants only for immutable seed data or display catalogs.

The first migration targets `OrdersPage.tsx`, `PassportPage.tsx`, `ParticipantFormRoute.tsx`, `CheckoutPage.tsx`, and `GuestEntryPages.tsx`, because those surfaces currently combine the most independent snapshots.

## Error handling

- A missing event or ticket ID must produce a typed unavailable result or a visible not-found state, not a silently mismatched event.
- State writes must be functional and update the in-memory ref used by claim and QR operations so multiple tabs do not act on stale state.
- Reset and migration must be safe when `window` or `localStorage` is unavailable during tests or server rendering.

## Verification criteria

Add regression coverage for:

1. Event → cart → checkout preserves event identity and ticket metadata.
2. Completing a participant form updates Orders and Passport after navigation.
3. Sending or revoking a team invite updates Orders and the form route.
4. Generating, claiming, revoking, and using a Guest QR updates every connected surface.
5. Reloading restores the shared state.
6. Resetting restores the seed state and clears all mutable demo layers while preserving account identity.
7. Existing full-suite QA remains green.

The implementation must preserve the current 277-test baseline and the existing production build.
