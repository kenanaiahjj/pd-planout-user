function claimRefFor(value) {
  return `CLM-${String(value).replace(/[^A-Z0-9]/gi, '').toUpperCase()}`;
}

function encode(value) {
  return encodeURIComponent(value ?? '');
}

function entryLabel(entry, index) {
  return entry.participantLabel || entry.participantName || `Participant ${index + 1}`;
}

export function getShareableFormEntries(entries = []) {
  return entries.filter((entry) => (
    entry.status !== 'attached'
    && entry.status !== 'released'
    && entry.status !== 'no_show'
  ));
}

export function getBulkEmailCandidates(entries = []) {
  return getShareableFormEntries(entries).filter((entry) => {
    const alreadySent = entry.inviteStatus === 'invited' || Boolean(entry.sentToEmail);
    const alreadyHasAccess = entry.accessPath === 'passport' || entry.accessPath === 'guest_qr';

    return !alreadySent && !alreadyHasAccess;
  });
}

export function getBulkEmailEntries(entries = []) {
  return getBulkEmailCandidates(entries).filter((entry) => (
    Boolean(entry.attendeeEmail)
  ));
}

export function groupBulkEmailEntriesByEvent(entries = []) {
  const groups = [];
  const groupsById = new Map();

  entries.forEach((entry) => {
    const eventId = entry.ticket?.id || entry.id;
    let group = groupsById.get(eventId);

    if (!group) {
      group = {
        id: eventId,
        title: entry.ticket?.eventTitle?.trim() || 'Event',
        entries: [],
      };
      groupsById.set(eventId, group);
      groups.push(group);
    }

    group.entries.push(entry);
  });

  return groups;
}

/**
 * Return an unclaimed entry to buyer-managed form mode.
 *
 * The previous link stays invalid after the buyer takes the entry back. The
 * buyer can then fill the form on the order and create the appropriate
 * Guest QR/Passport outcome from that new submission.
 */
export function rescindFormInvite(entry) {
  return {
    ...entry,
    inviteEmail: null,
    inviteStatus: 'not_invited',
    claimLinkRevoked: true,
    accessPath: 'pending',
    entryStatus: 'pending_form',
  };
}

export function buildParticipantFormLink(entry, orderId, origin = '') {
  return `${origin}/ticket-claim/${claimRefFor(entry.id)}?order=${encode(entry.orderId || orderId)}&entry=${encode(entry.id)}`;
}

/**
 * Resolve ownership for a shared form submission.
 *
 * Opening a link does not reserve an entry. The first completed submission
 * owns it; later submissions must keep the original owner intact.
 */
export function claimFormEntry(entry, claimant) {
  const currentOwnerId = entry.claimedByMemberId || entry.passportMemberId;
  const alreadyAttached = entry.entryStatus === 'attached' || entry.accessPath === 'passport';

  if (currentOwnerId && currentOwnerId !== claimant.memberId) {
    return {
      ok: false,
      reason: 'already_claimed',
      ownerName: entry.claimedByDisplayName || entry.passportDisplayName || 'another Passport',
      entry,
    };
  }

  if (alreadyAttached && currentOwnerId !== claimant.memberId) {
    return {
      ok: false,
      reason: 'already_claimed',
      ownerName: entry.claimedByDisplayName || entry.passportDisplayName || 'another Passport',
      entry,
    };
  }

  return {
    ok: true,
    entry: {
      ...entry,
      entryStatus: 'attached',
      accessPath: 'passport',
      claimedAt: claimant.claimedAt || new Date().toISOString(),
      claimedByMemberId: claimant.memberId,
      claimedByDisplayName: claimant.displayName,
      passportMemberId: claimant.memberId,
      passportDisplayName: claimant.displayName,
    },
  };
}

export function buildBulkFormLinkMessage(order, entries, origin = '') {
  const lines = [
    `Please complete your PlanOut form for ${order.name}:`,
    '',
  ];

  entries.forEach((entry, index) => {
    lines.push(`${entryLabel(entry, index)}:`, buildParticipantFormLink(entry, order.id, origin), '');
  });

  return lines.join('\n').trim();
}

export function buildFormEmailDraft(entry, order, origin = '') {
  const recipient = entry.attendeeEmail || '';
  const label = entryLabel(entry, 0);
  const subject = `Complete your ${order.name} form`;
  const link = buildParticipantFormLink(entry, order.id, origin);
  const body = `Hi ${label},\n\nPlease complete your PlanOut registration form here:\n${link}\n\nThank you.`;

  return { recipient, subject, body, link };
}

export function buildFormEmailHref(entry, order, origin = '') {
  const { recipient, subject, body } = buildFormEmailDraft(entry, order, origin);

  return `mailto:${recipient}?subject=${encode(subject)}&body=${encode(body)}`;
}

export function buildBulkFormEmailHref(order, entries, origin = '') {
  const recipients = entries
    .map((entry) => entry.attendeeEmail)
    .filter(Boolean)
    .join(',');
  const subject = `Complete your ${order.name} forms`;
  const body = buildBulkFormLinkMessage(order, entries, origin);

  return `mailto:${recipients}?subject=${encode(subject)}&body=${encode(body)}`;
}
