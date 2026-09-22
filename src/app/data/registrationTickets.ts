import { type MyTicket, type Participant, type RegistrationQueueEntry } from './tickets';
import { getMockTicketById } from './mockCatalog';

const fallbackImage = getMockTicketById('tkt-001')?.image || '';

export function buildParticipantsFromEntry(entry: RegistrationQueueEntry): Participant[] {
  if (entry.type === 'self' || entry.participantId || (entry.type === 'guest' && !entry.guestTotalCount)) {
    const isCompleted = entry.entryStatus === 'attached';
    const isInvited = entry.inviteStatus === 'invited' || !!(entry.inviteEmail && entry.personName.toLowerCase().includes('guest'));
    return [{
      id: entry.participantId || entry.id,
      name: isInvited ? null : entry.personName,
      email: entry.inviteEmail || null,
      formStatus: isCompleted ? 'completed' : 'not_started',
      inviteStatus: isInvited ? 'invited' : 'not_invited',
      isPrimary: entry.participantIsPrimary ?? entry.type === 'self',
      accessPath: entry.accessPath,
      sentToEmail: isInvited ? entry.inviteEmail : null,
    }];
  }

  if (entry.type === 'guest') {
    const total = Math.max(entry.guestTotalCount || 2, 1);
    const emails = entry.guestEmails || [];
    const details = entry.guestDetails || [];

    return Array.from({ length: total }, (_, index) => {
      const isBuyer = index === 0;

      if (isBuyer) {
        const isInvited = !!(entry.inviteEmail && entry.personName.toLowerCase().includes('guest'));
        return {
          id: `${entry.id}-guest-1`,
          name: isInvited ? null : entry.personName,
          email: entry.inviteEmail || null,
          formStatus: !isInvited && (entry.guestCompletedCount || 0) > 0 ? ('completed' as const) : ('not_started' as const),
          inviteStatus: isInvited ? ('invited' as const) : ('not_invited' as const),
          isPrimary: true,
          sentToEmail: isInvited ? entry.inviteEmail : null,
        };
      }

      const guestEmail = emails[index - 1] || null;
      const guestDetail = details.find(d => d && d.email === guestEmail) || details[index - 1] || null;
      const hasDetail = !!(guestDetail && guestDetail.name);

      return {
        id: `${entry.id}-guest-${index + 1}`,
        name: hasDetail ? guestDetail.name : null,
        email: hasDetail ? guestDetail.email : guestEmail,
        formStatus: hasDetail ? ('completed' as const) : ('not_started' as const),
        inviteStatus: hasDetail
          ? ('accepted' as const)
          : guestEmail
            ? ('invited' as const)
            : ('not_invited' as const),
        isPrimary: false,
        sentToEmail: guestEmail,
      };
    });
  }

  const total = Math.max(entry.teamTotalCount || 1, 1);
  const completed = Math.min(entry.teamAttachedCount || 0, total);

  return Array.from({ length: total }, (_, index) => ({
    id: `${entry.id}-member-${index + 1}`,
    name: index === 0 ? entry.personName : null,
    email: index === 0 ? entry.inviteEmail || null : null,
    formStatus: index < completed ? 'completed' : 'not_started',
    inviteStatus: index === 0 && entry.inviteEmail ? 'invited' : 'not_invited',
    isPrimary: index === 0,
    sentToEmail: index === 0 ? entry.inviteEmail || null : null,
  }));
}

export function ticketFromRegistrationEntry(entry: RegistrationQueueEntry): MyTicket {
  const isTeam = entry.type === 'team';
  const isMultiple = entry.type === 'guest' && (entry.guestTotalCount || 0) > 1;
  const participants = buildParticipantsFromEntry(entry);
  const sourceTicket = getMockTicketById(entry.ticketId);

  return {
    id: entry.ticketId,
    eventId: sourceTicket?.eventId || entry.ticketId,
    entryStatus: entry.entryStatus,
    eventTitle: sourceTicket?.eventTitle || entry.eventName,
    eventDate: sourceTicket?.eventDate || 'Date to be announced',
    eventLocation: sourceTicket?.eventLocation || 'Location to be announced',
    organizer: sourceTicket?.organizer || 'PlanOut Organizer',
    image: sourceTicket?.image || fallbackImage,
    labels: sourceTicket?.labels?.length ? sourceTicket.labels : [entry.category],
    ticketType: isTeam ? 'team' : isMultiple ? 'multiple' : 'single',
    ticketTypeName: sourceTicket?.ticketTypeName || entry.category,
    status: entry.entryStatus === 'attached' ? 'completed' : 'action_required',
    quantity: isTeam ? 1 : participants.length,
    participants,
    confirmationRef: entry.orderRef || sourceTicket?.confirmationRef || entry.ticketId,
    purchaseDate: sourceTicket?.purchaseDate || 'Registration in progress',
    deadline: entry.deadline || sourceTicket?.deadline,
    coachName: isTeam ? entry.personName : sourceTicket?.coachName,
    coachEmail: isTeam ? entry.inviteEmail : sourceTicket?.coachEmail,
    minParticipants: isTeam ? sourceTicket?.minParticipants ?? 1 : undefined,
    maxParticipants: isTeam ? sourceTicket?.maxParticipants ?? (entry.teamTotalCount || participants.length) : undefined,
  };
}
