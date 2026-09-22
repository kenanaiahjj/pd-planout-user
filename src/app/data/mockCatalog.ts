import { MOCK_EVENTS, EVENT_BRANDS, type EventData } from '@/app/data/events';
import {
  MY_TICKETS,
  type MyTicket,
  type Participant,
  type RegistrationQueueEntry,
} from '@/app/data/tickets';
import { hydrateParticipantFromRegistrationEntry } from '@/app/data/participantFormState.js';
import type { MockStoreState } from '@/app/data/mockStore';

const fallbackImage = MY_TICKETS.find((ticket) => ticket.image)?.image || '';

function makeStandaloneTicket({
  id,
  eventId,
  eventTitle,
  eventDate,
  eventLocation,
  organizer,
  labels,
  ticketType,
  ticketTypeName,
  entryStatus,
  confirmationRef,
  category,
  participant,
  additionalParticipants = [],
  quantity = 1,
}: {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  organizer: string;
  labels: string[];
  ticketType: MyTicket['ticketType'];
  ticketTypeName: string;
  entryStatus: MyTicket['entryStatus'];
  confirmationRef: string;
  category: string;
  participant: Participant;
  additionalParticipants?: Participant[];
  quantity?: number;
}): MyTicket {
  return {
    id,
    eventId,
    eventTitle,
    eventDate,
    eventLocation,
    organizer,
    brand: EVENT_BRANDS.stride,
    image: fallbackImage,
    labels,
    ticketType,
    ticketTypeName,
    entryStatus,
    status: entryStatus === 'attached' ? 'confirmed' : 'action_required',
    quantity,
    participants: [participant, ...additionalParticipants],
    confirmationRef,
    purchaseDate: 'Registration in progress',
    deadline: undefined,
    coachName: undefined,
    coachEmail: undefined,
  };
}

/** Queue-only scenarios still need complete ticket identity for every consumer. */
export const STANDALONE_REGISTRATION_TICKETS: MyTicket[] = [
  makeStandaloneTicket({
    id: 'guest-swim-relay',
    eventId: 'apo-island-open-water-swim-relay',
    eventTitle: 'Apo Island Open Water Swim Relay',
    eventDate: 'June 14, 2026 at 6:00 AM',
    eventLocation: 'Apo Island, Dauin, Negros Oriental',
    organizer: 'Swim Philippines',
    labels: ['Swimming', 'Relay'],
    ticketType: 'multiple',
    ticketTypeName: '2 participant entries',
    entryStatus: 'pending_form',
    confirmationRef: 'SWM-2026-007744',
    category: '2 participant entries',
    quantity: 2,
    participant: {
      id: 'p1',
      name: 'Naomi Tanaka',
      email: 'naomi.tanaka@email.com',
      formStatus: 'not_started',
      inviteStatus: 'invited',
      isPrimary: true,
    },
    additionalParticipants: [{
      id: 'p2',
      name: null,
      email: null,
      formStatus: 'not_started',
      inviteStatus: 'not_invited',
      isPrimary: false,
    }],
  }),
  makeStandaloneTicket({
    id: 'released-tennis-form',
    eventId: 'clay-court-doubles-clinic',
    eventTitle: 'Clay Court Doubles Clinic',
    eventDate: 'May 18, 2026 at 9:00 AM',
    eventLocation: 'Green Court Club, Taguig, Metro Manila',
    organizer: 'Green Court Athletic Club',
    labels: ['Tennis', 'Clinic'],
    ticketType: 'single',
    ticketTypeName: 'Clinic Entry',
    entryStatus: 'released',
    confirmationRef: 'REL-2026-000771',
    category: 'Clinic Entry',
    participant: {
      id: 'p1',
      name: 'Jessica Williams',
      email: 'jessica@email.com',
      formStatus: 'completed',
      inviteStatus: 'accepted',
      isPrimary: true,
    },
  }),
  makeStandaloneTicket({
    id: 'resubmit-aquathlon',
    eventId: 'bay-aquathlon-challenge',
    eventTitle: 'Bay Aquathlon Challenge',
    eventDate: 'June 1, 2026 at 6:00 AM',
    eventLocation: 'Dumaguete Baywalk, Dumaguete City',
    organizer: 'PlanOut Organizer',
    labels: ['Aquathlon'],
    ticketType: 'single',
    ticketTypeName: 'Individual Entry',
    entryStatus: 'resubmit_required',
    confirmationRef: 'FRM-2026-003221',
    category: 'Individual Entry',
    participant: {
      id: 'p1',
      name: 'Jessica Williams',
      email: 'jessica@email.com',
      formStatus: 'not_started',
      inviteStatus: 'not_invited',
      isPrimary: true,
    },
  }),
  makeStandaloneTicket({
    id: 'past-noshow-trail',
    eventId: 'ridge-trail-12k',
    eventTitle: 'Ridge Trail 12K',
    eventDate: 'February 1, 2026 at 6:00 AM',
    eventLocation: 'Mount Talinis Trail, Valencia, Negros Oriental',
    organizer: 'PlanOut Organizer',
    labels: ['Trail Running'],
    ticketType: 'single',
    ticketTypeName: '12K Trail',
    entryStatus: 'no_show',
    confirmationRef: 'NSH-2026-001145',
    category: '12K Trail',
    participant: {
      id: 'p1',
      name: 'Jessica Williams',
      email: 'jessica@email.com',
      formStatus: 'completed',
      inviteStatus: 'accepted',
      isPrimary: true,
    },
  }),
];

export const MOCK_TICKETS: MyTicket[] = [...MY_TICKETS, ...STANDALONE_REGISTRATION_TICKETS];

const ticketsById = new Map(MOCK_TICKETS.map((ticket) => [ticket.id, ticket]));

function eventFromTicket(ticket: MyTicket): EventData {
  return {
    id: ticket.eventId,
    title: ticket.eventTitle,
    date: ticket.eventDate,
    location: ticket.eventLocation,
    organizer: ticket.organizer,
    rating: 0,
    labels: ticket.labels,
    image: ticket.image,
    brand: ticket.brand,
    isPast: ticket.status === 'completed',
  };
}

function queueEntriesForTicket(ticketId: string, state: Pick<MockStoreState, 'registrationQueueEntries'>) {
  return (state.registrationQueueEntries || []).filter((entry) => entry.ticketId === ticketId);
}

function queueEntryForParticipant(ticketId: string, participantId: string, state: Pick<MockStoreState, 'registrationQueueEntries'>) {
  return queueEntriesForTicket(ticketId, state).find((entry) => entry.participantId === participantId);
}

function participantFromQueueEntry(entry: RegistrationQueueEntry): Participant {
  return hydrateParticipantFromRegistrationEntry({
    id: entry.participantId || entry.id,
    name: null,
    email: null,
    formStatus: 'not_started',
    inviteStatus: 'not_invited',
  }, entry) as Participant;
}

export function getMockEventById(eventId: string): EventData | undefined {
  const ticket = MOCK_TICKETS.find((candidate) => candidate.eventId === eventId);
  if (ticket) {
    const discoveryEvent = MOCK_EVENTS.find((event) => event.id === eventId);
    return discoveryEvent
      && discoveryEvent.title === ticket.eventTitle
      && discoveryEvent.location === ticket.eventLocation
      ? discoveryEvent
      : eventFromTicket(ticket);
  }
  return MOCK_EVENTS.find((event) => event.id === eventId);
}

export function getMockTicketById(ticketId: string): MyTicket | undefined {
  return ticketsById.get(ticketId);
}

export function getTicketEvent(ticket: MyTicket): EventData | undefined {
  const event = getMockEventById(ticket.eventId);
  if (event && event.title === ticket.eventTitle && event.location === ticket.eventLocation) return event;
  return eventFromTicket(ticket);
}

export function getTicketParticipants(
  ticket: MyTicket,
  state: Pick<MockStoreState, 'registrationQueueEntries' | 'teamPlayerRoster'>,
): Participant[] {
  const roster = state.teamPlayerRoster?.[ticket.id];
  const seedParticipants = Array.isArray(roster) ? roster : ticket.participants;
  const queueEntries = queueEntriesForTicket(ticket.id, state);
  const participants = seedParticipants.map((participant) => {
    const entry = queueEntryForParticipant(ticket.id, participant.id, state);
    return entry ? hydrateParticipantFromRegistrationEntry(participant, entry) as Participant : participant;
  });

  if (participants.length) return participants;
  return queueEntries
    .filter((entry) => entry.participantId)
    .map(participantFromQueueEntry);
}

export function getTicketParticipant(
  ticket: MyTicket,
  participantId: string,
  state: Pick<MockStoreState, 'registrationQueueEntries' | 'teamPlayerRoster'>,
): Participant | undefined {
  const participant = getTicketParticipants(ticket, state).find((candidate) => candidate.id === participantId);
  if (participant) return participant;

  const entry = queueEntryForParticipant(ticket.id, participantId, state);
  return entry ? participantFromQueueEntry(entry) : undefined;
}
