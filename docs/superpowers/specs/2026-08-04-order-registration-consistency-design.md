# Order registration consistency

## Goal

Make individual and team registration items feel like the same Orders product. The order page should use one visual grammar for event identity, state, and actions while preserving the different operational details of a single participant versus a team roster.

## Design

### Shared registration surface

`RegistrationItem` owns one shared card shell for every registration item:

- one event header with the event title and date;
- one content area with a consistent inset state panel or compact state row;
- one shared action treatment using the existing PlanOut primary, secondary, and destructive states;
- the same borders, radii, spacing, typography, and semantic state colors.

The shell remains an order-level registration item. It does not introduce a separate Forms page or a second team-management destination.

### Individual entries

Individual content is rendered inside the shared shell as one participant state:

- Passport-ready entries use the same calm ready treatment and a `View Passport` action;
- buyer-managed Guest QR entries use the same ready treatment and `Manage QR` or `Generate & send QR` action;
- pending claim-link entries use the shared pending treatment, with the recipient and claim-link actions grouped together;
- form-needed entries use the shared action-required treatment with `Fill up`, `Send link`, and `Copy link` where applicable;
- resubmit, released, and no-show states keep their existing semantics but use the shared state panel vocabulary.

The existing product rules remain unchanged: a buyer-filled form produces Guest QR access, while a recipient-completed claim form attaches to that recipient's Passport.

### Team entries

Team content uses the same shell and event header, then adds the team-specific information inside the shared content area:

- a compact `Players` summary with setup progress;
- the bulk sharing controls directly below that summary;
- flat player rows with the same action sizing and status treatment used by individual entries;
- the existing player actions for form completion, invite sending/unsending, Passport access, Guest QR management, and buyer-owned form viewing;
- `Add player` remains a slot action below the roster, not a direct form navigation.

The team remains one purchase and one financial registration item. Player rows are operational sub-items, not separate order cards.

## Component boundaries

- `RegistrationItem`: shared shell and event header; chooses the content renderer.
- `RegistrationStatePanel`: shared state surface for individual access/form states and reusable team summary states.
- `RegistrationActionRow`: shared button layout and sizing for form/access actions.
- `TeamRegistrationContent`: team summary, bulk controls, roster, and add-player behavior.
- Existing data helpers and access semantics remain the source of truth; this is a presentation refactor, not a state-model rewrite.

## Interaction and accessibility

- Every action keeps a 44px minimum touch target and visible focus ring.
- State copy stays concise and describes the next action rather than implementation details.
- Primary actions remain teal; indigo is reserved for claim/access ownership state; amber and red remain reserved for action-required and invalidated states.
- No new modal or route is introduced for this consistency pass.
- Existing email review, bulk email review, copy-link, Guest QR, Passport, unsend, and add-player behavior must remain intact.

## Verification

- Add or update source-level tests for shared shell usage and consistent action labels.
- Run the complete Node test suite and production build.
- Verify `/orders/tkt-011` and a team order such as `/orders/tkt-013` at a 456px viewport.
- Confirm no horizontal overflow, no console errors after a clean reload, and correct navigation for Passport, Guest QR, form, invite, and roster actions.

## Scope exclusions

- No change to purchase totals, participant ownership, claim concurrency, invite eligibility, or QR generation rules.
- No redesign of the Guest QR detail screen or the participant form itself.
- No removal of the existing mock order states needed to demonstrate the flows.
