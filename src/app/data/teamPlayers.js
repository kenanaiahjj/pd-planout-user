/**
 * Rules for changing the number of player entries before access is sent or
 * completed. Team access itself is still resolved independently per player.
 */

export function canAddTeamPlayer(participantCount, maxParticipants) {
  return participantCount < maxParticipants;
}

export function createTeamPlayerSlot(ticketId, participants = []) {
  const existingIds = new Set(participants.map((participant) => participant.id));
  let nextNumber = participants.length + 1;
  while (existingIds.has(`${ticketId}-player-${nextNumber}`)) nextNumber += 1;

  return {
    id: `${ticketId}-player-${nextNumber}`,
    name: null,
    email: null,
    formStatus: 'not_started',
    inviteStatus: 'not_invited',
  };
}

/**
 * Return a pending team player to buyer-managed form mode before the claim
 * link is accepted. Clear both email fields so Orders does not imply that an
 * invite was sent after the buyer takes the entry back.
 */
export function unsendTeamPlayerInvite(participant) {
  return {
    ...participant,
    name: null,
    email: null,
    sentToEmail: null,
    formStatus: 'not_started',
    inviteStatus: 'not_invited',
    accessPath: 'pending',
    claimLinkRevoked: true,
  };
}

export function shareTeamPlayerInvite(participant, recipient) {
  return {
    ...participant,
    inviteStatus: 'invited',
    accessPath: 'pending',
    claimLinkRevoked: false,
    ...(recipient
      ? {
          email: recipient,
          sentToEmail: recipient,
        }
      : {}),
  };
}

export function canRemoveTeamPlayer({
  participantCount,
  minParticipants,
  formStatus,
  inviteStatus,
  sentToEmail,
  isPrimary = false,
} = {}) {
  const hasBeenSent = inviteStatus === 'invited' || Boolean(sentToEmail);
  const hasBeenCompleted = formStatus === 'completed';

  return participantCount > minParticipants
    && !isPrimary
    && !hasBeenSent
    && !hasBeenCompleted;
}

/**
 * Remove a buyer-managed team slot only when it is still an unsent,
 * incomplete extra entry. Returning the original array for an ineligible
 * request keeps callers from accidentally removing a claimed or submitted
 * player when state has changed between render and confirmation.
 */
export function removeTeamPlayerSlot(participants = [], participantId, { minParticipants = 0 } = {}) {
  const participant = participants.find((candidate) => candidate.id === participantId);
  if (!participant) return participants;

  const canRemove = canRemoveTeamPlayer({
    participantCount: participants.length,
    minParticipants,
    formStatus: participant.formStatus,
    inviteStatus: participant.inviteStatus,
    sentToEmail: participant.sentToEmail,
    isPrimary: participant.isPrimary,
  });
  if (!canRemove) return participants;

  return participants.filter((candidate) => candidate.id !== participantId);
}
