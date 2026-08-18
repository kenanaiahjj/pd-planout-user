import test from 'node:test';
import assert from 'node:assert/strict';

let participantFormState = {};
try {
  participantFormState = await import('../src/app/data/participantFormState.js');
} catch {
  // The first red run proves the production module does not exist yet.
}

test('required waiver blocks participant form submission until it is present', () => {
  assert.equal(typeof participantFormState.isParticipantFormReady, 'function');

  const withoutWaiver = {
    firstName: 'Rina',
    lastName: 'Santos',
    email: '',
    waiver: null,
  };

  assert.equal(
    participantFormState.isParticipantFormReady(withoutWaiver, { requiresEmail: false }),
    false,
  );
  assert.equal(
    participantFormState.isParticipantFormReady(
      { ...withoutWaiver, waiver: 'PlanOut_Waiver.pdf' },
      { requiresEmail: false },
    ),
    true,
  );
});

test('buyer-completed participant details persist with the Guest QR outcome', () => {
  assert.equal(typeof participantFormState.completeParticipantForm, 'function');

  const completed = participantFormState.completeParticipantForm(
    {
      id: 'p7',
      name: null,
      email: null,
      formStatus: 'not_started',
      inviteStatus: 'not_invited',
      accessPath: 'pending',
    },
    {
      firstName: 'Rina',
      lastName: 'Santos',
      email: 'rina@example.com',
      waiver: 'PlanOut_Waiver.pdf',
    },
    'guest_qr',
  );

  assert.equal(completed.name, 'Rina Santos');
  assert.equal(completed.email, 'rina@example.com');
  assert.equal(completed.formStatus, 'completed');
  assert.equal(completed.inviteStatus, 'not_invited');
  assert.equal(completed.accessPath, 'guest_qr');
  assert.equal(completed.sentToEmail, null);
});

test('registration queue mirrors the completed participant details and access', () => {
  assert.equal(typeof participantFormState.applyParticipantToRegistrationEntry, 'function');

  const updated = participantFormState.applyParticipantToRegistrationEntry(
    {
      id: 'tkt-012-p3',
      personName: 'Participant 3',
      inviteEmail: null,
      inviteStatus: 'not_invited',
      entryStatus: 'pending_form',
      accessPath: 'pending',
    },
    {
      id: 'p3',
      name: 'Rina Santos',
      email: 'rina@example.com',
      formStatus: 'completed',
      inviteStatus: 'not_invited',
      accessPath: 'guest_qr',
      sentToEmail: null,
    },
  );

  assert.equal(updated.personName, 'Rina Santos');
  assert.equal(updated.inviteEmail, 'rina@example.com');
  assert.equal(updated.inviteStatus, 'not_invited');
  assert.equal(updated.entryStatus, 'attached');
  assert.equal(updated.accessPath, 'guest_qr');
});

test('sending a form invite persists its recipient and pending claim state', () => {
  assert.equal(typeof participantFormState.shareRegistrationFormInvite, 'function');

  const invited = participantFormState.shareRegistrationFormInvite(
    {
      id: 'tkt-012-p3',
      inviteEmail: null,
      inviteStatus: 'not_invited',
      entryStatus: 'pending_form',
      accessPath: 'pending',
      claimLinkRevoked: true,
    },
    'guest3@example.com',
  );

  assert.equal(invited.inviteEmail, 'guest3@example.com');
  assert.equal(invited.inviteStatus, 'invited');
  assert.equal(invited.entryStatus, 'pending_form');
  assert.equal(invited.accessPath, 'pending');
  assert.equal(invited.claimLinkRevoked, false);
});

test('sending from an older order upserts a missing queue record', () => {
  assert.equal(typeof participantFormState.shareRegistrationInviteInQueue, 'function');

  const fallback = {
    id: 'tkt-012-p3',
    ticketId: 'tkt-012',
    orderRef: 'DNR-2026-003341',
    eventName: 'Dumaguete City Night Run',
    personName: 'Guest 3',
    category: '10K Group Entry',
    type: 'guest',
    participantId: 'p3',
    entryStatus: 'pending_form',
    formRoute: '/orders/tkt-012/form',
  };

  const next = participantFormState.shareRegistrationInviteInQueue(
    [],
    fallback.id,
    'guest3@example.com',
    fallback,
  );

  assert.equal(next.length, 1);
  assert.equal(next[0].inviteStatus, 'invited');
  assert.equal(next[0].inviteEmail, 'guest3@example.com');
});

test('completing an older order upserts a missing queue record', () => {
  assert.equal(typeof participantFormState.applyParticipantToRegistrationQueue, 'function');

  const fallback = {
    id: 'tkt-012-p3',
    ticketId: 'tkt-012',
    orderRef: 'DNR-2026-003341',
    eventName: 'Dumaguete City Night Run',
    personName: 'Guest 3',
    category: '10K Group Entry',
    type: 'guest',
    participantId: 'p3',
    entryStatus: 'pending_form',
    formRoute: '/orders/tkt-012/form',
  };

  const next = participantFormState.applyParticipantToRegistrationQueue(
    [],
    fallback.id,
    {
      id: 'p3',
      name: 'Rina Santos',
      email: 'rina@example.com',
      formStatus: 'completed',
      inviteStatus: 'not_invited',
      accessPath: 'guest_qr',
    },
    fallback,
  );

  assert.equal(next.length, 1);
  assert.equal(next[0].personName, 'Rina Santos');
  assert.equal(next[0].entryStatus, 'attached');
  assert.equal(next[0].accessPath, 'guest_qr');
});

test('a persisted queue record hydrates an older order participant on reopen', () => {
  assert.equal(typeof participantFormState.hydrateParticipantFromRegistrationEntry, 'function');

  const participant = {
    id: 'p3',
    name: null,
    email: null,
    formStatus: 'not_started',
    inviteStatus: 'not_invited',
    isPrimary: false,
  };
  const invited = participantFormState.hydrateParticipantFromRegistrationEntry(participant, {
    id: 'tkt-012-p3',
    personName: 'Guest 3',
    inviteEmail: 'guest3@example.com',
    inviteStatus: 'invited',
    entryStatus: 'pending_form',
    accessPath: 'pending',
  });

  assert.equal(invited.name, null);
  assert.equal(invited.sentToEmail, 'guest3@example.com');
  assert.equal(invited.inviteStatus, 'invited');

  const completed = participantFormState.hydrateParticipantFromRegistrationEntry(participant, {
    id: 'tkt-012-p3',
    personName: 'Rina Santos',
    inviteEmail: 'rina@example.com',
    inviteStatus: 'not_invited',
    entryStatus: 'attached',
    accessPath: 'guest_qr',
  });

  assert.equal(completed.name, 'Rina Santos');
  assert.equal(completed.email, 'rina@example.com');
  assert.equal(completed.formStatus, 'completed');
  assert.equal(completed.accessPath, 'guest_qr');
});

test('only an explicitly primary individual participant resolves to Passport', () => {
  assert.equal(typeof participantFormState.resolveNonTeamCompletionAccess, 'function');
  assert.equal(participantFormState.resolveNonTeamCompletionAccess({ isPrimary: true }), 'passport');
  assert.equal(participantFormState.resolveNonTeamCompletionAccess({ isPrimary: false }), 'guest_qr');
  assert.equal(participantFormState.resolveNonTeamCompletionAccess({}), 'guest_qr');
});
