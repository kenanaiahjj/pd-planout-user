import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as formLinks from '../src/app/data/formLinks.js';
const {
  buildBulkFormEmailHref,
  buildBulkFormLinkMessage,
  buildFormEmailDraft,
  buildParticipantFormLink,
  getBulkEmailCandidates,
  getBulkEmailEntries,
  getShareableFormEntries,
  groupBulkEmailEntriesByEvent,
} = formLinks;

const { claimFormEntry } = await import('../src/app/data/formLinks.js');

const ordersSource = fs.readFileSync(
  new URL('../src/app/pages/OrdersPage.tsx', import.meta.url),
  'utf8',
);
const registrationSource = fs.readFileSync(
  new URL('../src/app/components/RegistrationItemComponents.tsx', import.meta.url),
  'utf8',
);
const ordersContractSource = `${ordersSource}\n${registrationSource}`;
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
  assert.match(ordersContractSource, /Send link/);
  assert.match(ordersContractSource, /Copy link/);
});

test('Orders exposes a bulk form-link copy action for group chats', () => {
  assert.match(ordersContractSource, /Copy all/);
  assert.match(ordersContractSource, /buildBulkFormLinkMessage/);
});

test('order details unify bulk form sharing with registration items', () => {
  assert.match(ordersContractSource, /ParticipantFormShareControls/);
  assert.doesNotMatch(ordersContractSource, /<ParticipantFormSharingPanel order=\{order\}/);
});

test('team player setup owns its bulk form sharing controls', () => {
  assert.match(ordersContractSource, /<ParticipantFormShareControls[\s\S]*order=\{order\}[\s\S]*entries=\{teamEntries\}[\s\S]*onShareEntries=\{sharePlayerInvites\}/);
  assert.match(ordersContractSource, /!hasTeamRegistration/);
});

test('team order copy is concise without removing the ownership cue', () => {
  assert.match(ordersContractSource, />\s*Send all\s*</);
  assert.match(ordersContractSource, />\s*Copy all\s*</);
  assert.match(ordersContractSource, /Fill for Guest QR, or send a link to their Passport\./);
  assert.match(ordersContractSource, /bulkEmailCandidates\.length\} unsent form/);
  assert.doesNotMatch(ordersContractSource, />\s*Share forms\s*</);
  assert.doesNotMatch(ordersContractSource, /Send all by email or copy all participant form links for a chat/);
});

test('individual and team registration items share the same visual primitives', () => {
  assert.match(ordersContractSource, /function RegistrationItemShell/);
  assert.match(ordersContractSource, /function RegistrationCardHeader/);
  assert.match(ordersContractSource, /function RegistrationStatePanel/);
  assert.match(ordersContractSource, /function RegistrationActionRow/);
  assert.match(ordersContractSource, /<RegistrationItemShell[\s\S]*summary\.title/);
  assert.match(ordersContractSource, /<RegistrationItemShell[\s\S]*entry\.entryName/);
  assert.match(ordersContractSource, /<RegistrationStatePanel[\s\S]*Ready for gate/);
  assert.match(ordersContractSource, /<RegistrationStatePanel[\s\S]*Claim link sent/);
  assert.match(ordersContractSource, /<RegistrationStatePanel[\s\S]*Guest QR ready/);
  assert.match(ordersContractSource, /<RegistrationActionRow/);
  assert.match(ordersContractSource, /<PrimaryButton[\s\S]*entry\/\$\{playerEntry\.id\}\/guest-qr[\s\S]*>\s*View QR\s*<\/PrimaryButton>/);
  assert.doesNotMatch(ordersContractSource, />\s*Guest QR\s*<\/PrimaryButton>/);
  assert.doesNotMatch(ordersContractSource, /<RegistrationStatePanel tone="warning">\s*<p className="text-\[12\.5px\] font-semibold text-\[#92400e\]">Form needed<\/p>/);
  assert.match(ordersContractSource, /function RegistrationActionRow[\s\S]*flex flex-wrap items-center justify-end gap-2/);
  assert.doesNotMatch(ordersContractSource, /border-t border-\[#f1e4bd\] pt-3/);
  assert.match(ordersContractSource, /bg-\[#fff7d6\].*text-\[#8a5b08\]/);
  assert.match(ordersContractSource, /order=\{order\}\s*compact(?:\s*primary=\{[^}]+\})?\s*onShare=/);
  assert.doesNotMatch(ordersContractSource, /bg-\[linear-gradient\(180deg,#f7fcfb/);
});

test('ready registration status is concise without losing QR access', () => {
  const passportBannerSource = registrationSource.slice(
    registrationSource.indexOf('function PassportBanner'),
    registrationSource.indexOf('function RegistrationItem({'),
  );

  assert.match(passportBannerSource, /Ready for gate/);
  assert.match(passportBannerSource, />\s*PlanOut Passport\s*</);
  assert.doesNotMatch(passportBannerSource, />\s*Universal QR\s*</);
  assert.doesNotMatch(passportBannerSource, /Ready for gate - staff scans your universal QR\./);
  assert.match(passportBannerSource, /<PrimaryButton[\s\S]*>\s*View QR\s*<\/PrimaryButton>/);
});

test('orders use the shared registration section without a redundant heading', () => {
  assert.doesNotMatch(ordersContractSource, /const showRegistrationItemsHeading/);
  assert.doesNotMatch(ordersContractSource, /function RegistrationItemsHeader\(/);
  assert.match(ordersContractSource, /aria-label="Registration items"/);
});

test('unclaimed claim links share one buyer recovery surface across entry types', () => {
  assert.match(ordersContractSource, /function ClaimLinkStatePanel/);
  assert.match(ordersContractSource, /<ClaimLinkStatePanel[\s\S]*entry=\{entry\}/);
  assert.match(ordersContractSource, /<ClaimLinkStatePanel[\s\S]*entry=\{playerEntry\}/);
  assert.match(ordersContractSource, /rescindRegistrationInvite/);
  assert.match(ordersContractSource, /Revoke/);
  const claimLinkPanelSource = registrationSource.slice(
    registrationSource.indexOf('export function ClaimLinkStatePanel'),
    registrationSource.indexOf('export function EmailReviewSheet'),
  );
  assert.doesNotMatch(claimLinkPanelSource, />\s*Fill up\s*</);
  assert.doesNotMatch(claimLinkPanelSource, /indigo|violet|#f5f7ff|#d8ddff/i);
  assert.doesNotMatch(claimLinkPanelSource, /entry\.attendeeEmail/);
  assert.match(ordersContractSource, /hasPendingInvite\s*\n?\s*\?\s*\(playerEntry\.attendeeEmail/);
  assert.match(ordersContractSource, /const canSharePendingForm = entry\.status !== 'attached'/);
  assert.match(ordersContractSource, /entry\.type === 'self'\s*\n\s*\|\| getShareableFormEntries\(\[entry\]\)\.length > 0/);
  assert.equal(typeof formLinks.rescindFormInvite, 'function');
  if (typeof formLinks.rescindFormInvite === 'function') {
    const reset = formLinks.rescindFormInvite({
      id: 'tkt-011-p2',
      inviteStatus: 'invited',
      inviteEmail: 'daniel@example.com',
      accessPath: 'pending',
      entryStatus: 'pending_form',
    });

    assert.equal(reset.inviteStatus, 'not_invited');
    assert.equal(reset.inviteEmail, null);
    assert.equal(reset.claimLinkRevoked, true);
    assert.equal(reset.accessPath, 'pending');
  }
});

test('buyer recovery reopens the standard form in buyer-filled mode', () => {
  assert.match(ordersContractSource, /buyerFill=1/);
  assert.match(participantFormRouteSource, /buyerFill/);
  assert.match(participantFormRouteSource, /claimLinkRevoked: true/);
});

test('submitted Guest QR forms open in review mode', () => {
  assert.match(ordersContractSource, /const isBuyerFillRequired = entry\.type === 'guest'/);
  assert.match(ordersContractSource, /entry\.status !== 'attached'/);
  assert.match(ordersContractSource, /entry\.accessPath !== 'guest_qr'/);
  assert.match(ordersContractSource, /isBuyerFillRequired \? '&buyerFill=1'/);
  assert.match(participantFormRouteSource, /const canBuyerFill = Boolean\(/);
  assert.match(participantFormRouteSource, /formStatus !== 'completed'/);
  assert.match(participantFormRouteSource, /accessPath !== 'guest_qr'/);
  assert.match(participantFormSource, /isSentOrDone/);
  assert.match(participantFormSource, /Completed Information/);
});

test('individual sharing actions use compact labels', () => {
  const individualActionsSource = registrationSource.slice(
    registrationSource.indexOf('function ParticipantFormLinkActions'),
    registrationSource.indexOf('function ParticipantFormShareControls'),
  );
  assert.match(individualActionsSource, /<Share2[\s\S]*\/?>[\s\S]*Share form/);
  assert.match(individualActionsSource, /<DropdownMenuItem[\s\S]*>\s*Send link\s*</);
  assert.match(individualActionsSource, /<DropdownMenuItem[\s\S]*>\s*Copy link\s*</);
  assert.doesNotMatch(individualActionsSource, />\s*Send form link\s*</);
  assert.doesNotMatch(individualActionsSource, />\s*Copy form link\s*</);
});

test('pending self entries expose direct sharing actions from their own row', () => {
  const registrationItemSource = registrationSource.slice(
    registrationSource.indexOf('function RegistrationItem({'),
    registrationSource.indexOf('function TeamRegistrationItem'),
  );
  assert.match(registrationItemSource, /entry\.type === 'self'/);
  assert.match(registrationItemSource, /shareActions=\{isShareable \? \([\s\S]*<ParticipantFormLinkActions/);
});

test('individual email sharing stays in-app after the invite review', () => {
  assert.match(ordersContractSource, /EmailReviewSheet/);
  assert.match(ordersContractSource, /data-testid="email-review-sheet"/);
  assert.match(ordersContractSource, />\s*Send form link\s*</);
  assert.match(ordersContractSource, /Send invite/);
  assert.doesNotMatch(ordersContractSource, />\s*Continue to email\s*</);
  assert.match(ordersContractSource, /setEmailReviewOpen\(true\)/);
  assert.doesNotMatch(ordersContractSource, /window\.location\.href\s*=\s*buildFormEmailHref/);
  assert.match(ordersContractSource, /toast\.success\('Invite sent'/);
});

test('email review keeps the invite template implicit and asks only for the recipient email', () => {
  const reviewSource = registrationSource.slice(
    registrationSource.indexOf('function EmailReviewSheet'),
    registrationSource.indexOf('function ParticipantFormLinkActions'),
  );

  assert.match(reviewSource, /type="email"/);
  assert.match(reviewSource, /Recipient email/);
  assert.match(reviewSource, /onSendInvite\(recipient\.trim\(\)\)/);
  assert.doesNotMatch(reviewSource, />\s*Message\s*</);
  assert.doesNotMatch(reviewSource, /draft\.body/);
});

test('bulk invite review stays in-app instead of using a mailto handoff', () => {
  assert.doesNotMatch(ordersContractSource, /window\.location\.href\s*=\s*buildBulkFormEmailHref/);
  assert.match(ordersContractSource, /toast\.success\('Invites sent'/);
  assert.match(ordersContractSource, /onShareEntries\?\.\(draftEntries\)/);
});

test('individual Orders invites persist through the shared registration state', () => {
  assert.match(ordersContractSource, /sendRegistrationInvite/);
  assert.match(ordersContractSource, /onShare=\{\(recipient\) => sendRegistrationInvite/);
  assert.match(ordersContractSource, /!hasTeamRegistration[\s\S]*onShareEntries=\{/);
  assert.match(ordersContractSource, /\^\(\?:Participant\|Guest\) \\d\+/);
});

test('participant forms persist completion and invite changes before returning to Orders', () => {
  assert.match(participantFormRouteSource, /updateRegistrationParticipant/);
  assert.match(participantFormRouteSource, /onParticipantChange=/);
  assert.match(participantFormRouteSource, /onParticipantInvite=/);
  assert.match(participantFormRouteSource, /onParticipantInviteRevoke=/);
});

test('email review does not auto-open the keyboard and stays above it on mobile', () => {
  const reviewSource = registrationSource.slice(
    registrationSource.indexOf('function EmailReviewSheet'),
    registrationSource.indexOf('function ParticipantFormLinkActions'),
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

test('pending self entries also receive bulk form links', () => {
  const shareable = getShareableFormEntries([
    { id: 'tkt-003-p1', type: 'self', status: 'pending_form', attendeeEmail: 'jessica@example.com' },
  ]);

  assert.deepEqual(shareable.map((entry) => entry.id), ['tkt-003-p1']);
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

test('bulk email entries group by event while preserving event and recipient order', () => {
  assert.equal(typeof groupBulkEmailEntriesByEvent, 'function');

  const grouped = groupBulkEmailEntriesByEvent([
    { id: 'a-1', ticket: { id: 'event-a', eventTitle: 'Emerald Pickleball Cup' } },
    { id: 'b-1', ticket: { id: 'event-b', eventTitle: '' } },
    { id: 'a-2', ticket: { id: 'event-a', eventTitle: 'Emerald Pickleball Cup' } },
  ]);

  assert.deepEqual(grouped.map((group) => ({
    id: group.id,
    title: group.title,
    entryIds: group.entries.map((entry) => entry.id),
  })), [
    { id: 'event-a', title: 'Emerald Pickleball Cup', entryIds: ['a-1', 'a-2'] },
    { id: 'event-b', title: 'Event', entryIds: ['b-1'] },
  ]);
});

test('bulk email uses a review sheet before handing off to the email app', () => {
  assert.match(ordersContractSource, /BulkEmailReviewSheet/);
  assert.match(ordersContractSource, /entries\.length === 1 \? 'Send invite' : `Send \$\{entries\.length\} invites`/);
  assert.match(ordersContractSource, /getBulkEmailCandidates/);
  assert.doesNotMatch(ordersContractSource, /disabled=!canEmailAll/);
});

test('bulk email review uses a compact event-first recipient hierarchy', () => {
  const reviewSource = registrationSource.slice(
    registrationSource.indexOf('function BulkEmailReviewSheet'),
    registrationSource.indexOf('function ParticipantFormLinkActions'),
  );

  assert.match(reviewSource, /const eventGroups = groupBulkEmailEntriesByEvent\(draftEntries\)/);
  assert.doesNotMatch(reviewSource, /data-testid="bulk-email-event-summary"/);
  assert.match(reviewSource, /data-testid="bulk-email-event-groups"/);
  assert.match(reviewSource, /data-testid="bulk-email-event-groups"[\s\S]*className="mt-4 grid gap-2\.5"/);
  assert.match(reviewSource, /data-testid="bulk-email-eligibility-note"/);
  assert.match(reviewSource, /data-testid="bulk-email-actions"/);
  assert.match(reviewSource, /\{group\.title\}/);
  assert.match(reviewSource, /\{group\.entries\.length\} recipient/);
  assert.match(reviewSource, /group\.entries\.map/);
  assert.doesNotMatch(reviewSource, /order\.name|order: OrderRecord|<Check/);
  assert.match(reviewSource, /<X className="h-4 w-4"/);
  assert.doesNotMatch(reviewSource, />\s*×\s*</);
  assert.match(reviewSource, /rounded-\[12px\] border border-\[#dce7e4\] bg-\[#f7f9f8\]/);
  assert.match(reviewSource, /onSend\(draftEntries\)/);
  assert.match(reviewSource, /disabled=\{!allEmailsValid\}/);
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
