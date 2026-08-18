/**
 * Per-player access resolution for team purchases.
 *
 * `email` and a completed form are deliberately insufficient to infer
 * Passport ownership. The buyer can complete a player's form on their behalf,
 * which produces an app-less Guest QR instead.
 */

export const TEAM_ACCESS_PATHS = Object.freeze({
  PENDING: 'pending',
  GUEST_QR: 'guest_qr',
  PASSPORT: 'passport',
});

export function teamPlayerLabel(index) {
  return `Player ${index + 1}`;
}

export function teamPlayerDisplayName({
  participant,
  participantIndex,
  accessPath,
} = {}) {
  const slotLabel = teamPlayerLabel(participantIndex || 0);
  const prototypeIdentity = participant?.prototypeIdentity;
  const prototypeName = typeof prototypeIdentity?.displayName === 'string'
    && prototypeIdentity.displayName.trim()
    ? prototypeIdentity.displayName.trim()
    : null;
  if (accessPath === TEAM_ACCESS_PATHS.PASSPORT) {
    return participant?.passportDisplayName
      || (prototypeIdentity?.source === 'passport' ? prototypeName : null)
      || participant?.name
      || slotLabel;
  }
  return (prototypeIdentity?.source === 'form' ? prototypeName : null)
    || participant?.name
    || slotLabel;
}

export function attachTeamPlayerToPassport(participant, member) {
  return {
    ...participant,
    formStatus: 'completed',
    inviteStatus: 'accepted',
    accessPath: TEAM_ACCESS_PATHS.PASSPORT,
    passportMemberId: member.memberId,
    passportDisplayName: member.displayName,
  };
}

/**
 * A Passport member can represent only one player in a team order. Older
 * prototype state could persist the same member against multiple slots, so
 * keep the first assignment and turn later completed slots into buyer-owned
 * Guest QR entries (or pending slots when their form is not complete).
 */
export function normalizeTeamPlayerState({
  ticketId,
  participants = [],
  access = {},
  memberId,
} = {}) {
  const nextAccess = { ...access };
  let buyerPassportOwnerId = null;

  const nextParticipants = participants.map((participant) => {
    const key = ticketId && participant?.id ? `${ticketId}:${participant.id}` : null;
    const effectiveAccess = key
      ? nextAccess[key] || participant.accessPath
      : participant.accessPath;
    const isBuyerPassport = effectiveAccess === TEAM_ACCESS_PATHS.PASSPORT
      && participant.passportMemberId === memberId;

    if (!isBuyerPassport) return participant;

    if (!buyerPassportOwnerId) {
      buyerPassportOwnerId = participant.id;
      if (key) nextAccess[key] = TEAM_ACCESS_PATHS.PASSPORT;
      return {
        ...participant,
        accessPath: TEAM_ACCESS_PATHS.PASSPORT,
      };
    }

    const fallbackAccess = participant.formStatus === 'completed'
      ? TEAM_ACCESS_PATHS.GUEST_QR
      : TEAM_ACCESS_PATHS.PENDING;
    if (key) nextAccess[key] = fallbackAccess;

    const {
      passportMemberId: _passportMemberId,
      passportDisplayName: _passportDisplayName,
      ...withoutPassportOwner
    } = participant;

    return {
      ...withoutPassportOwner,
      accessPath: fallbackAccess,
    };
  });

  return {
    participants: nextParticipants,
    access: nextAccess,
  };
}

export function resolveTeamPlayerAccess({
  accessPath,
  formStatus,
  inviteStatus,
  email,
  buyerFilled = false,
} = {}) {
  if (accessPath === TEAM_ACCESS_PATHS.GUEST_QR || accessPath === TEAM_ACCESS_PATHS.PASSPORT) {
    return accessPath;
  }

  if (inviteStatus === 'invited' || (buyerFilled === false && !email && formStatus !== 'completed')) {
    return TEAM_ACCESS_PATHS.PENDING;
  }

  if (buyerFilled && formStatus === 'completed') {
    return TEAM_ACCESS_PATHS.GUEST_QR;
  }

  if (inviteStatus === 'not_invited' && formStatus === 'completed') {
    return TEAM_ACCESS_PATHS.GUEST_QR;
  }

  if (inviteStatus === 'accepted' && formStatus === 'completed') {
    return TEAM_ACCESS_PATHS.PASSPORT;
  }

  return TEAM_ACCESS_PATHS.PENDING;
}
