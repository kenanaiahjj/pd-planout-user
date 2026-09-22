// Ticket status summarizes a purchase; form completion belongs to a participant.
export function resolveParticipantEntryStatus(ticket = {}, participant = {}, entry, accessPath) {
  if (entry) {
    // Older queues copied pending_form from the ticket onto completed people.
    // Explicit invite/revoke/access changes remain authoritative.
    const legacyPending = entry.entryStatus === 'pending_form'
      && participant.formStatus === 'completed'
      && !entry.accessPath
      && entry.claimLinkRevoked === undefined
      && (!entry.inviteStatus || entry.inviteStatus === participant.inviteStatus)
      && entry.inviteStatus !== 'invited';
    return legacyPending ? 'attached' : entry.entryStatus;
  }
  if (ticket.ticketType === 'team') {
    return accessPath && accessPath !== 'pending'
      ? 'attached'
      : participant.formStatus === 'completed' && participant.inviteStatus !== 'invited'
        ? 'attached'
        : 'pending_form';
  }
  if (['released', 'no_show', 'resubmit_required', 'pending_payment'].includes(ticket.entryStatus)) {
    return ticket.entryStatus;
  }
  return participant.formStatus === 'completed' ? 'attached' : 'pending_form';
}

function trimmed(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isParticipantFormReady(form = {}, { requiresEmail = true } = {}) {
  return Boolean(
    trimmed(form.firstName)
    && trimmed(form.lastName)
    && (!requiresEmail || trimmed(form.email))
    && form.waiver,
  );
}

export function resolveNonTeamCompletionAccess(participant = {}) {
  return participant.isPrimary === true ? 'passport' : 'guest_qr';
}

export function completeParticipantForm(participant = {}, form = {}, accessPath = 'pending') {
  const name = [trimmed(form.firstName), trimmed(form.lastName)].filter(Boolean).join(' ');

  return {
    ...participant,
    name: name || participant.name || null,
    email: trimmed(form.email) || participant.email || null,
    formStatus: 'completed',
    inviteStatus: accessPath === 'passport' ? 'accepted' : 'not_invited',
    sentToEmail: null,
    accessPath,
  };
}

export function applyParticipantToRegistrationEntry(entry, participant) {
  return {
    ...entry,
    personName: participant.name || entry.personName,
    inviteEmail: participant.sentToEmail || participant.email || null,
    inviteStatus: participant.inviteStatus,
    claimLinkRevoked: participant.claimLinkRevoked,
    accessPath: participant.accessPath,
    entryStatus: participant.formStatus === 'completed' ? 'attached' : 'pending_form',
  };
}

export function shareRegistrationFormInvite(entry, recipient) {
  return {
    ...entry,
    inviteEmail: trimmed(recipient) || null,
    inviteStatus: 'invited',
    claimLinkRevoked: false,
    accessPath: 'pending',
    entryStatus: 'pending_form',
  };
}

function updateRegistrationQueue(entries, entryId, fallbackEntry, updateEntry) {
  let found = false;
  const next = entries.map((entry) => {
    if (entry.id !== entryId) return entry;
    found = true;
    return updateEntry(entry);
  });

  if (!found && fallbackEntry) next.push(updateEntry(fallbackEntry));
  return next;
}

export function shareRegistrationInviteInQueue(entries, entryId, recipient, fallbackEntry) {
  return updateRegistrationQueue(
    entries,
    entryId,
    fallbackEntry,
    (entry) => shareRegistrationFormInvite(entry, recipient),
  );
}

export function applyParticipantToRegistrationQueue(entries, entryId, participant, fallbackEntry) {
  return updateRegistrationQueue(
    entries,
    entryId,
    fallbackEntry,
    (entry) => applyParticipantToRegistrationEntry(entry, participant),
  );
}

export function hydrateParticipantFromRegistrationEntry(participant, entry) {
  if (!entry) return participant;

  const entryName = trimmed(entry.personName);
  const meaningfulName = entryName && !/^(?:Participant|Guest) \d+$/i.test(entryName)
    ? entryName
    : participant.name;
  const inviteStatus = entry.inviteStatus || participant.inviteStatus;
  const inviteEmail = trimmed(entry.inviteEmail);

  return {
    ...participant,
    name: meaningfulName || null,
    email: inviteEmail || participant.email || null,
    formStatus: resolveParticipantEntryStatus({}, participant, entry) === 'attached'
      ? 'completed'
      : ['pending_form', 'resubmit_required'].includes(entry.entryStatus)
        ? 'not_started'
        : participant.formStatus,
    inviteStatus,
    sentToEmail: inviteStatus === 'invited' ? inviteEmail || participant.sentToEmail || null : null,
    claimLinkRevoked: entry.claimLinkRevoked ?? participant.claimLinkRevoked,
    accessPath: entry.accessPath || participant.accessPath,
  };
}
