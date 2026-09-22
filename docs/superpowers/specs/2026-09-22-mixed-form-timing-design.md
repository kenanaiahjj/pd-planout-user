# Mixed form timing for event registration

## Context

The registration flow supports two valid organizer policies:

- Some events require participant forms before payment.
- Other events collect participant forms after payment, as the earlier model did.

The current implementation only models this policy explicitly for NUTRI-RUN and relies on checkout fallback logic for the remaining demo items. That makes the behavior depend on the checkout item position and prevents an event's policy from surviving the event → cart → checkout handoff.

## Goals

1. Store form timing as part of the shared event mock data.
2. Preserve the timing when a user selects tickets, adds them to the cart, and starts checkout.
3. Make checkout derive its form state from the selected event data rather than item order or event-name heuristics.
4. Keep both existing experiences working:
   - `before_checkout` blocks payment until the required form is complete.
   - `after_checkout` allows payment and shows the post-payment form reminder.
5. Add regression coverage for the fixture mix and the full handoff.

## Data contract

Introduce a shared `FormTiming` type:

```ts
export type FormTiming = 'before_checkout' | 'after_checkout';
```

Add an optional `formTiming?: FormTiming` field to:

- `EventData`
- `CheckoutIntentItem`
- cart ticket items

Keep `requireFormsBeforeCheckout?: boolean` on `EventData` for compatibility with existing callers and persisted fixtures. Resolve the effective value with this precedence:

1. `formTiming`, when present.
2. `requireFormsBeforeCheckout === true` → `before_checkout`.
3. Otherwise → `after_checkout`.

This keeps older mock objects valid while making `formTiming` the source of truth for new data.

## Mock event mix

The following active mock events will explicitly declare their policy.

### Forms before checkout

- `NegOr50•50 Series 2: NUTRI-RUN 65`
- `National Basketball League Finals`
- `Premier Soccer Cup`

### Forms after checkout

- `Grand Slam Tennis Open`
- `Regional Swimming Championship`
- `Tour de City Cycling Race`
- `Beach Volleyball Open`
- `Badminton Doubles Tournament`
- `Apo Island Open Water Swim`

Events without an explicit policy, including legacy cart-only fixtures, resolve to `after_checkout` through the compatibility default.

## Flow changes

### Event selection

When `EventDetailsPage` or `EventPeekPanel` creates checkout items, copy the selected event's `formTiming` into every item. The ticket picker remains responsible only for ticket selection and pricing.

### Cart

When event ticket items are transformed into cart rows, retain `formTiming`. When selected cart rows become a checkout intent, copy it back into the intent items.

### Checkout

Use the shared resolver for every checkout item. Remove the fallback that marks the first item as `before_checkout` solely because it is first. Demo-only fallback items may retain explicit timing values, but they must use the same `FormTiming` contract as real event selections.

For a mixed checkout, process each item independently:

- Any incomplete `before_checkout` item keeps payment blocked and appears in the pre-payment required-form warning.
- `after_checkout` items do not block payment and appear in the confirmation screen's post-payment form reminder.

The existing warning colors and floating reminder remain unchanged by this data-flow update.

## Verification

Add or update tests to verify:

1. The mock event fixtures contain both `before_checkout` and `after_checkout` values with the mapping above.
2. Event detail and peek-panel checkout items carry the event timing.
3. Cart transformations preserve timing in both directions.
4. Checkout resolves legacy `requireFormsBeforeCheckout` correctly.
5. Checkout does not infer timing from item index.
6. A mixed checkout still blocks on incomplete pre-payment forms and keeps post-payment forms in the confirmation reminder.
7. The focused tests, full test suite, production build, and browser flow pass.

## Non-goals

- Redesigning the form reminder or confirmation UI.
- Adding a server-backed form policy.
- Changing form completion, reset, or shared mock-state behavior beyond carrying the timing field.
