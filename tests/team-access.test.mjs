import test from 'node:test';
import assert from 'node:assert/strict';
import * as teamAccess from '../src/app/data/teamAccess.js';
import { canAddTeamPlayer, canRemoveTeamPlayer } from '../src/app/data/teamPlayers.js';
const teamPlayersModule = await import('../src/app/data/teamPlayers.js');

const {
  normalizeTeamPlayerState,
  resolveTeamPlayerAccess,
  teamPlayerDisplayName,
} = teamAccess;

test('buyer-completed player resolves to an app-less Guest QR path', () => {
  assert.equal(
    resolveTeamPlayerAccess({
      formStatus: 'completed',
      accessPath: 'guest_qr',
    }),
    'guest_qr',
  );
});

test('claim-link player stays pending until the recipient completes their own form', () => {
  assert.equal(
    resolveTeamPlayerAccess({
      formStatus: 'pending',
      inviteStatus: 'invited',
    }),
    'pending',
  );
});

test('claimed player resolves to that player\'s Passport', () => {
  assert.equal(
    resolveTeamPlayerAccess({
      formStatus: 'completed',
      accessPath: 'passport',
    }),
    'passport',
  );
});

test('an email address alone never infers Passport ownership', () => {
  assert.equal(
    resolveTeamPlayerAccess({
      formStatus: 'completed',
      email: 'player@example.com',
    }),
    'pending',
  );
});

test('team entries use a stable player slot label instead of an optional form name', () => {
  assert.equal(typeof teamAccess.teamPlayerLabel, 'function');
  if (typeof teamAccess.teamPlayerLabel === 'function') {
    assert.equal(teamAccess.teamPlayerLabel(0), 'Player 1');
    assert.equal(teamAccess.teamPlayerLabel(7), 'Player 8');
  }
});

test('named team players use their Passport or participant name before the slot label', () => {
  assert.equal(
    teamPlayerDisplayName({
      participant: { name: 'Mia Torres', passportDisplayName: 'Mia Torres' },
      participantIndex: 1,
      accessPath: 'passport',
    }),
    'Mia Torres',
  );
  assert.equal(
    teamPlayerDisplayName({
      participant: { name: null },
      participantIndex: 5,
      accessPath: 'pending',
    }),
    'Player 6',
  );
});

test('prototype identity metadata supplies a custom-form display name without label inference', () => {
  assert.equal(
    teamPlayerDisplayName({
      participant: {
        name: null,
        prototypeIdentity: { displayName: 'Mia Torres', source: 'form' },
      },
      participantIndex: 1,
      accessPath: 'guest_qr',
    }),
    'Mia Torres',
  );
  assert.equal(
    teamPlayerDisplayName({
      participant: {
        name: 'Roster alias',
        prototypeIdentity: { displayName: 'Jessica Williams', source: 'passport' },
        passportDisplayName: 'Jessica Williams',
      },
      participantIndex: 0,
      accessPath: 'passport',
    }),
    'Jessica Williams',
  );
});

test('Passport claims record the authenticated member separately from form details', () => {
  assert.equal(typeof teamAccess.attachTeamPlayerToPassport, 'function');
  if (typeof teamAccess.attachTeamPlayerToPassport === 'function') {
    const claimed = teamAccess.attachTeamPlayerToPassport(
      {
        id: 'p1',
        name: 'Optional roster label',
        email: null,
        formStatus: 'pending',
        inviteStatus: 'invited',
      },
      { memberId: 'member-7', displayName: 'Ava Tan' },
    );

    assert.equal(claimed.accessPath, 'passport');
    assert.equal(claimed.formStatus, 'completed');
    assert.equal(claimed.inviteStatus, 'accepted');
    assert.equal(claimed.passportMemberId, 'member-7');
    assert.equal(claimed.passportDisplayName, 'Ava Tan');
    assert.equal(claimed.name, 'Optional roster label');
  }
});

test('a team Passport member can own only one player slot', () => {
  assert.equal(typeof normalizeTeamPlayerState, 'function');
  const normalized = normalizeTeamPlayerState({
    ticketId: 'tkt-013',
    memberId: 'member-7',
    participants: [
      {
        id: 'p5',
        name: 'Andre Santos',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        accessPath: 'passport',
        passportMemberId: 'member-7',
        passportDisplayName: 'Ava Tan',
      },
      {
        id: 'p7',
        name: 'Player Seven',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        accessPath: 'passport',
        passportMemberId: 'member-7',
        passportDisplayName: 'Ava Tan',
      },
    ],
    access: {
      'tkt-013:p5': 'passport',
      'tkt-013:p7': 'passport',
    },
  });

  assert.equal(normalized.participants[0].accessPath, 'passport');
  assert.equal(normalized.participants[1].accessPath, 'guest_qr');
  assert.equal(normalized.participants[1].passportMemberId, undefined);
  assert.equal(normalized.access['tkt-013:p5'], 'passport');
  assert.equal(normalized.access['tkt-013:p7'], 'guest_qr');
});

test('team player count can grow only up to the organizer maximum', () => {
  assert.equal(canAddTeamPlayer(9, 10), true);
  assert.equal(canAddTeamPlayer(10, 10), false);
});

test('adding a team player creates an empty slot without entering a form', () => {
  assert.equal(typeof teamPlayersModule.createTeamPlayerSlot, 'function');
  if (typeof teamPlayersModule.createTeamPlayerSlot === 'function') {
    const slot = teamPlayersModule.createTeamPlayerSlot('tkt-013', [
      { id: 'tkt-013-player-1', name: null, email: null, formStatus: 'not_started', inviteStatus: 'not_invited' },
      { id: 'tkt-013-player-2', name: null, email: null, formStatus: 'not_started', inviteStatus: 'not_invited' },
    ]);

    assert.deepEqual(slot, {
      id: 'tkt-013-player-3',
      name: null,
      email: null,
      formStatus: 'not_started',
      inviteStatus: 'not_invited',
    });
  }
});

test('unsent team player entries can be removed only above the organizer minimum', () => {
  assert.equal(canRemoveTeamPlayer({ participantCount: 6, minParticipants: 5, formStatus: 'not_started', inviteStatus: 'not_invited' }), true);
  assert.equal(canRemoveTeamPlayer({ participantCount: 5, minParticipants: 5, formStatus: 'not_started', inviteStatus: 'not_invited' }), false);
  assert.equal(canRemoveTeamPlayer({ participantCount: 6, minParticipants: 5, formStatus: 'completed', inviteStatus: 'accepted' }), false);
});

test('removing a team player slot only mutates an eligible unsent extra slot', () => {
  assert.equal(typeof teamPlayersModule.removeTeamPlayerSlot, 'function');
  if (typeof teamPlayersModule.removeTeamPlayerSlot === 'function') {
    const roster = [
      { id: 'p1', name: 'Ava Tan', formStatus: 'completed', inviteStatus: 'accepted' },
      { id: 'p2', name: 'Ben Cruz', formStatus: 'not_started', inviteStatus: 'invited', sentToEmail: 'ben@example.com' },
      { id: 'p3', name: null, formStatus: 'not_started', inviteStatus: 'not_invited' },
      { id: 'p4', name: null, formStatus: 'not_started', inviteStatus: 'not_invited' },
      { id: 'p5', name: null, formStatus: 'not_started', inviteStatus: 'not_invited' },
      { id: 'p6', name: null, formStatus: 'not_started', inviteStatus: 'not_invited' },
    ];

    assert.deepEqual(
      teamPlayersModule.removeTeamPlayerSlot(roster, 'p6', { minParticipants: 5 }),
      roster.slice(0, -1),
    );
    assert.deepEqual(
      teamPlayersModule.removeTeamPlayerSlot(roster, 'p1', { minParticipants: 5 }),
      roster,
    );
    assert.deepEqual(
      teamPlayersModule.removeTeamPlayerSlot(roster.slice(0, -1), 'p5', { minParticipants: 5 }),
      roster.slice(0, -1),
    );
  }
});

test('an unaccepted team invite can be unsent for buyer completion', () => {
  assert.equal(typeof teamPlayersModule.unsendTeamPlayerInvite, 'function');
  if (typeof teamPlayersModule.unsendTeamPlayerInvite === 'function') {
    const reset = teamPlayersModule.unsendTeamPlayerInvite({
      id: 'p4',
      name: 'Niko Santos',
      email: 'niko.santos@email.com',
      sentToEmail: 'niko.santos@email.com',
      formStatus: 'not_started',
      inviteStatus: 'invited',
      accessPath: 'pending',
    });

    assert.equal(reset.name, null);
    assert.equal(reset.email, null);
    assert.equal(reset.sentToEmail, null);
    assert.equal(reset.inviteStatus, 'not_invited');
    assert.equal(reset.formStatus, 'not_started');
    assert.equal(reset.accessPath, 'pending');
  }
});

test('sharing a team player link marks the slot as sent for both copy and email flows', () => {
  assert.equal(typeof teamPlayersModule.shareTeamPlayerInvite, 'function');
  if (typeof teamPlayersModule.shareTeamPlayerInvite === 'function') {
    const copied = teamPlayersModule.shareTeamPlayerInvite({
      id: 'p8',
      name: null,
      email: null,
      formStatus: 'not_started',
      inviteStatus: 'not_invited',
    });
    const emailed = teamPlayersModule.shareTeamPlayerInvite(copied, 'player@example.com');

    assert.equal(copied.inviteStatus, 'invited');
    assert.equal(copied.accessPath, 'pending');
    assert.equal(copied.claimLinkRevoked, false);
    assert.equal(emailed.sentToEmail, 'player@example.com');
    assert.equal(emailed.email, 'player@example.com');
  }
});
