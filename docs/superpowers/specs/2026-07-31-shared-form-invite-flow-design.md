# Shared Form Invite Flow Design

## Goal

Make copied form links and form-email links enter the same PlanOut journey as every other authenticated form: login or account creation first, then the standard participant form, with Passport ownership assigned only when the recipient submits.

## User-visible behavior

1. A recipient opens a shared form link from email or a group chat.
2. If they are signed out, PlanOut shows the existing login/create-account screen. The invite is carried as the return destination; no claim-specific page is shown.
3. After authentication, PlanOut opens the existing participant form route with the invited participant selected.
4. The recipient completes the regular form and submits it.
5. The first completed submission claims the entry for that account's Passport. A buyer-managed form still resolves to the existing Guest QR path.
6. If another account completed the same shared entry first, the later recipient remains in the standard form surface. Their answers stay available in the current tab, submission is not retried, and an inline conflict message explains that the entry is already attached.

The invited email is informational only. The account authenticated through the shared link is the claimant, because a link can be reposted in a group chat and cannot safely identify one recipient before submission.

## Architecture

- `GuestTicketClaimPage` becomes a route adapter, not a second form experience. It resolves the shared entry, builds the normal participant-form URL, and redirects signed-out users to `/login` with that URL in navigation state. Signed-in users go directly to the form.
- `LoginRoute` consumes an invite return destination from navigation state before falling back to the existing context return path. It clears the destination after successful login or guest continuation.
- `ParticipantFormRoute` recognizes an invite mode from query parameters and passes claim metadata into `ParticipantFormPage` without changing the normal form layout.
- `ParticipantFormPage` keeps the existing fields and progress UI. In invite mode it submits through `claimRegistrationEntry`, reports a first-submit-wins conflict inline, and preserves the current form state. It does not expose buyer-only participant-management or invitation controls for the invited participant.
- `formLinks.js` owns the canonical shared-form URL builder so email, copy, bulk-copy, and the route adapter all agree on the same return parameters.

## Error and edge states

- Missing or invalid shared-entry data redirects to Orders, matching the existing route guard.
- A signed-in recipient skips login and opens the standard form directly.
- A duplicate claimant never overwrites the first claimant. The form values remain editable only if the existing form allows it, but the submit action is disabled after conflict and a copy-answers affordance remains available.
- Guest QR behavior remains unchanged for buyer-filled entries.

## Verification

- Source-level tests assert that shared links resolve to the standard form route, the custom claim copy is gone from the route adapter, LoginRoute accepts navigation-state return paths, and invite mode delegates submission to `claimRegistrationEntry`.
- Existing tests continue to cover first-submit-wins ownership, bulk link formatting, buyer-managed Guest QR, and Passport attachment.
- Browser verification covers signed-out link → login → standard form, direct signed-in link → standard form, and duplicate submission preservation.
- Figma Section 4 removes the obsolete claim-shell captures and replaces them with the normal login, normal form, success, and preserved-conflict states.
