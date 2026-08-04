import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  buildBulkFormEmailHref,
  buildBulkFormLinkMessage,
  buildFormEmailDraft,
  buildParticipantFormLink,
  getBulkEmailCandidates,
  getBulkEmailEntries,
  getShareableFormEntries,
} from '../src/app/data/formLinks.js';

const { claimFormEntry } = await import('../src/app/data/formLinks.js');

const ordersSource = fs.readFileSync(
  new URL('../src/app/pages/OrdersPage.tsx', import.meta.url),
  'utf8',
);
const formLinksSource = fs.readFileSync(
  new URL('../src/app/data/formLinks.js', import.meta.url),
  'utf8',
);
const guestEntrySource = fs.readFileSync(
  new URL('../src/app/pages/GuestEntryPages.tsx', import.meta.url),
  'utf8',
);
const loginRouteSource = fs.readFileSync(
  new URL('../src/app/routes/LoginRoute.tsx', import.meta.url),
  'utf8',
);
const participantFormRouteSource = fs.readFileSync(
  new URL('../src/app/routes/ParticipantFormRoute.tsx', import.meta.url),
  'utf8',
);
const participantFormSource = fs.readFileSync(
  new URL('../src/app/pages/ParticipantFormPage.tsx', import.meta.url),
  'utf8',
);

test('Orders exposes individual form email and copy actions', () => {
  assert.match(ordersSource, /Send link/);
  assert.match(ordersSource, /Copy link/);
});

test('Orders exposes a bulk form-link copy action for group chats', () => {
  assert.match(ordersSource, /Copy all/);
  assert.match(ordersSource, /buildBulkFormLinkMessage/);
});

test('order details unify bulk form sharing with registration items', () => {
  assert.match(ordersSource, /ParticipantFormShareControls/);
  assert.doesNotMatch(ordersSource, /<ParticipantFormSharingPanel order=\{order\}/);
});

test('team player setup owns its bulk form sharing controls', () => {
  assert.match(ordersSource, /ParticipantFormShareControls order=\{order\} entries=\{teamEntries\} embedded/);
  assert.match(ordersSource, /!hasTeamRegistration/);
});

test('team order copy is concise without removing the ownership cue', () => {
  assert.match(ordersSource, />\s*Email all\s*</);
  assert.match(ordersSource, />\s*Copy all\s*</);
  assert.match(ordersSource, /Fill for Guest QR, or send a link to their Passport\./);
  assert.match(ordersSource, /Review \{bulkEmailCandidates\.length\} unsent form/);
  assert.doesNotMatch(ordersSource, />\s*Share forms\s*</);
  assert.doesNotMatch(ordersSource, /Send all by email or copy all participant form links for a chat/);
});

test('individual and team registration items share the same visual primitives', () => {
  assert.match(ordersSource, /function RegistrationCardHeader/);
  assert.match(ordersSource, /function RegistrationStatePanel/);
  assert.match(ordersSource, /function RegistrationActionRow/);
  assert.match(ordersSource, /<RegistrationCardHeader[\s\S]*summary\.title/);
  assert.match(ordersSource, /<RegistrationCardHeader[\s\S]*entry\.entryName/);
  assert.match(ordersSource, /<RegistrationStatePanel[\s\S]*Ready for gate/);
  assert.match(ordersSource, /<RegistrationStatePanel[\s\S]*Claim link sent/);
  assert.match(ordersSource, /<RegistrationStatePanel[\s\S]*Guest QR ready/);
  assert.match(ordersSource, /<RegistrationActionRow/);
  assert.doesNotMatch(ordersSource, /bg-\[linear-gradient\(180deg,#f7fcfb/);
});

test('individual sharing actions use compact labels', () => {
  const individualActionsSource = ordersSource.slice(
    ordersSource.indexOf('function ParticipantFormLinkActions'),
    ordersSource.indexOf('function ParticipantFormShareControls'),
  );
  assert.match(individualActionsSource, />\s*Send link\s*</);
  assert.match(individualActionsSource, />\s*Copy link\s*</);
  assert.doesNotMatch(individualActionsSource, />\s*Send form link\s*</);
  assert.doesNotMatch(individualActionsSource, />\s*Copy form link\s*</);
});

test('individual email sharing opens a review step before the email handoff', () => {
  assert.match(ordersSource, /EmailReviewSheet/);
  assert.match(ordersSource, /data-testid="email-review-sheet"/);
  assert.match(ordersSource, />\s*Send form link\s*</);
  assert.match(ordersSource, />\s*Send invite\s*</);
  assert.doesNotMatch(ordersSource, />\s*Continue to email\s*</);
  assert.match(ordersSource, /setEmailReviewOpen\(true\)/);
  assert.match(ordersSource, /buildFormEmailHref\(draftEntry, order, appOrigin\(\)\)/);
});

test('email review keeps the invite template implicit and asks only for the recipient email', () => {
  const reviewSource = ordersSource.slice(
    ordersSource.indexOf('function EmailReviewSheet'),
    ordersSource.indexOf('function ParticipantFormLinkActions'),
  );

  assert.match(reviewSource, /type="email"/);
  assert.match(reviewSource, /Recipient email/);
  assert.match(reviewSource, /onOpenEmail\(recipient\.trim\(\)\)/);
  assert.doesNotMatch(reviewSource, />\s*Message\s*</);
  assert.doesNotMatch(reviewSource, /draft\.body/);
});

test('email review does not auto-open the keyboard and stays above it on mobile', () => {
  const reviewSource = ordersSource.slice(
    ordersSource.indexOf('function EmailReviewSheet'),
    ordersSource.indexOf('function ParticipantFormLinkActions'),
  );

  assert.doesNotMatch(reviewSource, /autoFocus/);
  assert.match(reviewSource, /visualViewport/);
  assert.match(reviewSource, /keyboardInset/);
  assert.match(reviewSource, /maxHeight/);
});

test('shared form links redirect into the standard login and participant form flow', () => {
  assert.match(formLinksSource, /buildParticipantFormLink/);
  assert.match(guestEntrySource, /invite:\s*'1'/);
  assert.match(guestEntrySource, /<Navigate to="\/login"/);
  assert.doesNotMatch(guestEntrySource, /Claim your shared ticket/);
  assert.match(loginRouteSource, /location\.state/);
  assert.match(participantFormRouteSource, /invite=1|isInvite/);
  assert.match(participantFormRouteSource, /ticketType: 'single'/);
  assert.match(participantFormRouteSource, /participants: \[inviteParticipant\]/);
  assert.match(participantFormSource, /onInviteSubmit|inviteConflict/);
});

const order = { id: 'tkt-013', name: 'Dumaguete Futsal Cup Season 4' };
const entries = [
  { id: 'tkt-013-p1', type: 'team', participantLabel: 'Player 1', status: 'attached', attendeeEmail: 'one@example.com' },
  { id: 'tkt-013-p5', type: 'team', participantLabel: 'Player 5', status: 'pending_form', attendeeEmail: 'five@example.com' },
  { id: 'tkt-013-p7', type: 'team', participantLabel: 'Player 7', status: 'pending_form' },
];

test('only pending participant entries receive shareable form links', () => {
  const shareable = getShareableFormEntries(entries);

  assert.deepEqual(shareable.map((entry) => entry.id), ['tkt-013-p5', 'tkt-013-p7']);
  assert.equal(
    buildParticipantFormLink(shareable[0], order.id, 'https://planout.test'),
    'https://planout.test/ticket-claim/CLM-TKT013P5?order=tkt-013&entry=tkt-013-p5',
  );
});

test('bulk copy formats each participant link on its own labeled block', () => {
  const message = buildBulkFormLinkMessage(order, getShareableFormEntries(entries), 'https://planout.test');

  assert.match(message, /Please complete your PlanOut form for Dumaguete Futsal Cup Season 4/);
  assert.match(message, /Player 5:\nhttps:\/\/planout\.test\/ticket-claim\/CLM-TKT013P5/);
  assert.match(message, /Player 7:\nhttps:\/\/planout\.test\/ticket-claim\/CLM-TKT013P7/);
});

test('bulk email uses known participant addresses and the same formatted links', () => {
  const href = buildBulkFormEmailHref(order, getShareableFormEntries(entries), 'https://planout.test');

  assert.match(href, /^mailto:five@example\.com\?/);
  assert.match(decodeURIComponent(href), /Player 7:\nhttps:\/\/planout\.test\/ticket-claim\/CLM-TKT013P7/);
});

test('bulk email includes only unsent pending forms with no access yet', () => {
  const emailEntries = [
    { id: 'passport-entry', type: 'team', status: 'attached', accessPath: 'passport', attendeeEmail: 'owner@example.com', inviteStatus: 'accepted' },
    { id: 'sent-entry', type: 'team', status: 'pending_form', accessPath: 'pending', attendeeEmail: 'sent@example.com', inviteStatus: 'invited', sentToEmail: 'sent@example.com' },
    { id: 'ready-entry', type: 'team', status: 'pending_form', accessPath: 'pending', attendeeEmail: 'ready@example.com', inviteStatus: 'not_invited' },
    { id: 'guest-qr-entry', type: 'team', status: 'attached', accessPath: 'guest_qr', attendeeEmail: 'qr@example.com', inviteStatus: 'not_invited' },
  ];

  assert.deepEqual(getBulkEmailEntries(emailEntries).map((entry) => entry.id), ['ready-entry']);
});

test('bulk email review includes unsent pending forms even when an address is missing', () => {
  const emailEntries = [
    { id: 'sent-entry', type: 'team', status: 'pending_form', accessPath: 'pending', attendeeEmail: 'sent@example.com', inviteStatus: 'invited' },
    { id: 'ready-entry', type: 'team', status: 'pending_form', accessPath: 'pending', attendeeEmail: 'ready@example.com', inviteStatus: 'not_invited' },
    { id: 'missing-email-entry', type: 'team', status: 'pending_form', accessPath: 'pending', attendeeEmail: '', inviteStatus: 'not_invited' },
  ];

  assert.deepEqual(
    getBulkEmailCandidates(emailEntries).map((entry) => entry.id),
    ['ready-entry', 'missing-email-entry'],
  );
});

test('bulk email uses a review sheet before handing off to the email app', () => {
  assert.match(ordersSource, /BulkEmailReviewSheet/);
  assert.match(ordersSource, /Send invites/);
  assert.match(ordersSource, /getBulkEmailCandidates/);
  assert.doesNotMatch(ordersSource, /disabled=!canEmailAll/);
});

test('email review drafts expose the recipient, subject, body, and link', () => {
  const draft = buildFormEmailDraft(entries[0], order, 'https://planout.test');

  assert.equal(draft.recipient, 'one@example.com');
  assert.equal(draft.subject, 'Complete your Dumaguete Futsal Cup Season 4 form');
  assert.match(draft.body, /Please complete your PlanOut registration form here/);
  assert.match(draft.body, /https:\/\/planout\.test\/ticket-claim\/CLM-TKT013P1/);
  assert.equal(draft.link, 'https://planout.test/ticket-claim/CLM-TKT013P1?order=tkt-013&entry=tkt-013-p1');
});

test('the first person to submit a shared form owns it and a later submit keeps the first owner', () => {
  assert.equal(typeof claimFormEntry, 'function');

  const pendingEntry = {
    id: 'tkt-013-p7',
    entryStatus: 'pending_form',
  };

  const firstClaim = claimFormEntry(pendingEntry, {
    memberId: 'member-ana',
    displayName: 'Ana Cruz',
    claimedAt: '2026-07-31T09:00:00.000Z',
  });

  assert.equal(firstClaim.ok, true);
  assert.equal(firstClaim.entry.claimedByMemberId, 'member-ana');
  assert.equal(firstClaim.entry.claimedByDisplayName, 'Ana Cruz');

  const laterClaim = claimFormEntry(firstClaim.entry, {
    memberId: 'member-ben',
    displayName: 'Ben Lee',
    claimedAt: '2026-07-31T09:01:00.000Z',
  });

  assert.deepEqual(laterClaim, {
    ok: false,
    reason: 'already_claimed',
    ownerName: 'Ana Cruz',
    entry: firstClaim.entry,
  });
});
