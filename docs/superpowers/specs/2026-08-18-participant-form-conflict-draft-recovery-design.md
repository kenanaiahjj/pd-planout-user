# Participant Form Conflict Draft Recovery Design

**Date:** 2026-08-18

## Goal

Let a participant who loses a first-submit-wins claim-link race reuse their text answers on a fresh unused form link without copying each field manually. Recovery must never overwrite the winning Passport entry, attach answers to the wrong event, or restore uploaded documents.

## Product Contract

A participant form link represents one registration slot. Opening a link does not reserve that slot. The first authenticated account whose completed submission is accepted owns the slot. A later submission remains rejected and cannot replace the winning owner.

When a later submission is rejected, PlanOut saves a recovery draft for the losing account. PlanOut offers that draft only when the same account opens an unused participant link for the same event and the same form version. The participant chooses whether to restore the draft, reviews the restored values, re-uploads required documents, and submits normally.

## Scope

This change covers claim-link participant forms rendered through `ParticipantFormPage` and `ParticipantFormRoute`.

It includes:

- saving recoverable text answers after an `already_claimed` conflict;
- detecting a matching draft on a later unused claim link;
- a one-tap restore action and a dismiss-for-this-form action;
- automatic cleanup after a successful restored submission;
- a plain-text copy fallback;
- tests for matching, merging, expiry, cleanup, and UI integration.

It does not include:

- creating a new registration slot for the buyer;
- changing the first-submit-wins ownership rule;
- transferring the winning entry;
- restoring files or browser file handles;
- restoring answers across unrelated events or form versions;
- a production backend or cross-device synchronization.

## Approaches Considered

### 1. Scoped recovery-draft adapter — selected

Persist a small structured draft behind a dedicated adapter. Match it by authenticated member, event, and form version. The prototype adapter uses browser storage, while its interface can later be backed by an account service.

This provides automatic field restoration with a narrow change surface and no new backend schema.

### 2. Clipboard-only recovery

Keep a single copied text block and ask the participant to paste each answer manually. This is easy to implement but slow, error-prone, and unable to map fields safely. It remains only as a fallback.

### 3. Server-backed account drafts

Persist conflict drafts in the PlanOut backend so restoration works across devices. This is the production target, but it is outside this prototype because the repository has no production account-form schema or API.

## Architecture

Create `src/app/data/participantFormDrafts.js` as the isolated recovery adapter. It owns serialization, matching, expiry, merge behavior, and browser persistence. UI code consumes the adapter through explicit functions rather than reading browser storage directly.

`ParticipantFormRoute` supplies stable recovery context to `ParticipantFormPage`:

- `memberId`: authenticated Passport member ID;
- `eventId`: ticket/event ID;
- `formVersion`: the current organizer form version, with `default-v1` as the prototype fallback;
- `entryId`: the current registration slot ID.

`ParticipantFormPage` saves a draft when `onInviteSubmit` returns `already_claimed`, checks for a matching draft when an unused invite form opens, restores matching fields on request, and removes the draft only after a successful submission from a different entry.

## Recovery Draft Shape

```ts
type ParticipantFormRecoveryDraft = {
  id: string;
  memberId: string;
  eventId: string;
  formVersion: string;
  sourceEntryId: string;
  savedAt: string;
  expiresAt: string;
  answers: Record<string, string>;
};
```

The adapter stores only non-empty text answers. The current form maps these stable field IDs:

- `firstName`
- `lastName`
- `email`
- `birthday`

`waiver` is never serialized. Future organizer fields must opt in with their stable field ID and a string value.

Draft IDs are derived from `memberId`, `eventId`, and `formVersion`. A newer conflict for the same scope replaces the older draft. Drafts expire seven days after `savedAt`.

## Matching Rules

A draft is eligible only when all of these conditions are true:

1. `draft.memberId` equals the authenticated member ID.
2. `draft.eventId` equals the opened form's event ID.
3. `draft.formVersion` equals the opened form's form version.
4. `draft.sourceEntryId` differs from the opened unused entry ID.
5. `expiresAt` is in the future.
6. The opened link has not already been completed, claimed, or revoked.

An expired draft is removed when read. A mismatched draft remains stored until expiry so it may still match the correct fresh link.

## Restore and Merge Rules

Selecting **Restore answers** copies each recognized draft value into its matching form field. Because restoration is an explicit participant action, restored values replace any prefilled values for those matching fields. Unknown field IDs are ignored.

The restore action never:

- changes ownership or claim state;
- marks the form complete;
- submits the form;
- restores a document;
- writes into a different event or form version.

After restoration, normal validation remains authoritative. The participant must review the fields, upload required documents again, and submit.

## User Interface

### Conflict state

The existing amber ownership-conflict notice remains. Beneath it, add a calm recovery confirmation:

- title: **Your answers are saved**
- body: **Open a fresh form link for this event to restore your text answers. Documents must be uploaded again.**
- fallback action: **Copy answer summary**

The original **Copy my answers** label is removed because it implies automatic structured transfer from the clipboard.

### Fresh matching link

Place a recovery card above the form fields and below the participant identity/deadline area:

- eyebrow: **Saved draft**
- title: **Previous answers found**
- body: **Restore your text answers from the form that could not be submitted. Review them and upload required documents again.**
- primary action: **Restore answers**
- secondary action: **Not now**

Selecting **Restore answers** fills the matching fields and replaces the card with a compact success message:

- **Answers restored. Review your details before submitting.**

Selecting **Not now** hides the offer for the current mounted form only. It does not delete the stored draft.

## Draft Lifecycle

1. Two authenticated accounts open the same claim link.
2. The first completed submission succeeds and owns the entry.
3. The second completed submission returns `already_claimed`.
4. PlanOut saves the second account's text answers and shows the conflict recovery confirmation.
5. The buyer provides that participant with a different unused link for the same event and form version.
6. PlanOut offers the matching draft.
7. The participant restores answers, re-uploads documents, and submits.
8. On successful submission, PlanOut deletes the matching recovery draft.

If submission loses another race, the current answers replace the prior recovery draft and the cycle can repeat.

## Failure Handling

- If browser persistence is unavailable, the conflict UI keeps the entered values visible and offers **Copy answer summary**.
- If the stored payload is malformed, the adapter removes it and the form opens normally.
- If no fields match, no restore offer appears.
- If a link is revoked or already completed, the existing link-state behavior takes precedence and no draft is applied.
- Clipboard failure does not clear the visible form or the stored recovery draft.

## Prototype and Production Boundary

The prototype adapter stores drafts in the current browser. Recovery therefore works only for the same browser profile and authenticated prototype account. The UI must not claim cross-device recovery.

Production should keep the same adapter contract but use an authenticated server-side draft store with an atomic ownership check. The server must derive `memberId` from the session rather than trusting client input, encrypt stored answers, apply retention rules, and audit deletion after successful submission.

## Accessibility

- The recovery offer uses a labelled region and clear text rather than color alone.
- Actions remain keyboard reachable and use existing shared buttons.
- The restored-success message uses `role="status"`.
- The conflict notice keeps `role="alert"`.
- Focus remains in the current form; restoration does not unexpectedly navigate or submit.

## Testing

Unit tests for the draft adapter cover:

- serializing text fields while excluding `waiver`;
- exact member/event/form-version matching;
- rejecting the same source entry;
- ignoring and removing expired or malformed drafts;
- merging only recognized text fields;
- clearing after successful recovery.

Source-contract tests cover:

- conflict save behavior;
- **Your answers are saved** and **Copy answer summary** copy;
- **Previous answers found**, **Restore answers**, and **Not now** controls;
- the re-upload document explanation;
- successful-submit cleanup.

Browser verification covers:

- mobile and desktop recovery cards;
- restoration populating matching fields;
- documents remaining empty;
- submit validation continuing to require the document;
- dismissal lasting only for the current form mount;
- no console errors.

