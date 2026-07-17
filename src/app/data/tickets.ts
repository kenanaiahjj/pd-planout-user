/**
 * @file tickets.ts
 * @description Shared ticket types and mock data used by MyEventsPage
 * and ParticipantFormPage.
 *
 * Three ticket types:
 *  1. Single  — 1 ticket, 1 user. Buyer fills form or sends to someone else.
 *  2. Multiple — 1 buyer, many owned tickets. Each ticket resolves from the
 *                assigned member passport at scan time.
 *  3. Team — 1 ticket covers many participants. Coach manages roster but is NOT a
 *            participant. Coach submits once all participant forms are done/sent.
 *            Staff scans the lead passport and can check in one or all members.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TicketStatus = 'confirmed' | 'pending' | 'action_required' | 'completed';
export type EntryStatus =
  | 'pending_form'
  | 'pending_payment'
  | 'attached'
  | 'released'
  | 'no_show'
  | 'resubmit_required';
export type TicketType = 'single' | 'multiple' | 'team';
export type InviteStatus = 'not_invited' | 'invited' | 'accepted' | 'declined';
export type EventScheduleType = 'single_day' | 'consecutive_days' | 'non_consecutive_days';
export type TicketAccessScope = 'single_session' | 'selected_sessions' | 'all_sessions';

export interface GuestEntryQR {
  id: string;
  entryId: string;
  attendeeName: string;
  eventName: string;
  eventDate: string;
  category: string;
  gate: string;
  /** Format: GE-XXXX-XXXX */
  ref: string;
  isActive: boolean;
  revokedAt?: Date;
  expiresAt: Date;
  sharedAt?: Date;
  sharedVia?: string;
}


export interface FormVersion {
  version: number;
  updatedAt: Date;
  changes: FormFieldChange[];
}

export interface FormFieldChange {
  fieldId: string;
  fieldLabel: string;
  type: 'new' | 'updated' | 'removed' | 'unchanged';
  oldValue?: string;
  newValue?: string;
}

export interface TicketAttendance {
  attendingWith: 'self' | 'together' | 'not_attending';
  guestQR?: GuestEntryQR;
}

export type RegistrationQueueEntryType = 'self' | 'guest' | 'team';

export interface RegistrationQueueEntry {
  id: string;
  ticketId: string;
  orderRef: string;
  eventName: string;
  personName: string;
  category: string;
  type: RegistrationQueueEntryType;
  entryStatus: EntryStatus;
  deadline?: string;
  formRoute: string;
  inviteEmail?: string;
  guestCompletedCount?: number;
  guestTotalCount?: number;
  guestEmails?: string[];
  guestDetails?: { name: string; email: string }[];
  teamAttachedCount?: number;
  teamTotalCount?: number;
  price?: number;
  /** True only when this form action is known to block the logged-in user's own Passport access. */
  personalAccessConfirmed?: boolean;
}

export interface Participant {
  id: string;
  name: string | null;
  email: string | null;
  formStatus: 'completed' | 'pending' | 'not_started';
  /** Invite tracking — mainly used for "multiple" type tickets */
  inviteStatus: InviteStatus;
  /** Whether this participant is the primary contact (buyer / coach) */
  isPrimary?: boolean;
  /** Email the form was sent to (if sent via email) */
  sentToEmail?: string | null;
}

export interface TicketSession {
  id: string;
  date: string;
  label?: string;
  location?: string;
}

export interface MyTicket {
  id: string;
  eventId: string;
  entryStatus?: EntryStatus;
  ownerMemberId?: string;
  buyerMemberId?: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  organizer: string;
  image: string;
  labels: string[];
  ticketType: TicketType;
  ticketTypeName: string;
  /** Event date structure and which dates this ticket grants access to. */
  schedule?: {
    type: EventScheduleType;
    sessions: TicketSession[];
    accessScope: TicketAccessScope;
    accessSessionIds?: string[];
  };
  status: TicketStatus;
  quantity: number;
  participants: Participant[];
  confirmationRef: string;
  purchaseDate: string;
  checkedInAt?: string;
  groupLeadOf?: string;
  /** For completed events: tracks whether user has submitted a review */
  reviewStatus?: 'none' | 'submitted';
  /** Team tickets: minimum participants allowed by organizer */
  minParticipants?: number;
  /** Team tickets: maximum participants allowed by organizer */
  maxParticipants?: number;
  /** Deadline for form completion */
  deadline?: string;
  /** Team tickets: coach name (the person managing the roster — not a participant) */
  coachName?: string;
  /** Team tickets: coach email */
  coachEmail?: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

export const MY_TICKETS: MyTicket[] = [
  // ── 1. TEAM TICKET ─ Pickleball Coaching Certification Series ──────────
  {
    id: 'tkt-002',
    eventId: '2',
    eventTitle: 'Pickleball Coaching Certification Series',
    eventDate: 'June 5, 2026 at 9:00 AM',
    eventLocation: 'Araw Sports Club Dumaguete, Valencia, Negros Oriental',
    organizer: 'Pickleball Global Academy (PGA)',
    image:
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrdXQlMjBjb3VydHxlbnwxfHx8fDE3NzAxODc2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Pickleball', 'Team'],
    ticketType: 'team',
    ticketTypeName: 'Coach Certification Course',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'pga-coaching', date: 'June 5, 2026 at 9:00 AM' }],
    },
    entryStatus: 'released',
    status: 'action_required',
    quantity: 1,
    coachName: 'Jessica Williams',
    coachEmail: 'jessica@email.com',
    minParticipants: 5,
    maxParticipants: 10,
    deadline: 'June 2, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Mark Reyes',
        email: 'mark.r@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p2',
        name: 'Carlos Santos',
        email: 'carlos@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p3',
        name: 'Andre Johnson',
        email: 'andre.j@email.com',
        formStatus: 'pending',
        inviteStatus: 'accepted',
      },
      {
        id: 'p4',
        name: null,
        email: 'tyrone.w@email.com',
        formStatus: 'not_started',
        inviteStatus: 'invited',
        sentToEmail: 'tyrone.w@email.com',
      },
      {
        id: 'p5',
        name: null,
        email: null,
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'PGA-2026-005678',
    purchaseDate: 'Jan 20, 2026',
  },

  // ── 2. SINGLE TICKET ─ NegOr50•50 Series 2: NUTRI-RUN 65 (Confirmed) ────
  {
    id: 'tkt-001',
    eventId: '1',
    eventTitle: 'NegOr50•50 Series 2: NUTRI-RUN 65',
    eventDate: 'July 4, 2026 at 5:00 AM',
    eventLocation: 'Quezon Park, Dumaguete City, Negros Oriental',
    organizer: 'NORSPORTS',
    image:
      'https://images.unsplash.com/photo-1714962747379-93714999d5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjBjcm93ZHxlbnwxfHx8fDE3NzAxODc2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Running', 'Ultramarathon'],
    ticketType: 'single',
    ticketTypeName: '65K Ultramarathon',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'nutri-run', date: 'July 4, 2026 at 5:00 AM' }],
    },
    entryStatus: 'attached',
    status: 'confirmed',
    quantity: 1,
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
    ],
    confirmationRef: 'MNL-2026-001234',
    purchaseDate: 'Jan 15, 2026',
  },

  // ── 3. MULTIPLE TICKETS ─ VisMin Super Cup Basketball Finals (Action Required) ──
  {
    id: 'tkt-008',
    eventId: '8',
    eventTitle: 'VisMin Super Cup Basketball Finals',
    eventDate: 'July 10, 2026 at 7:00 PM',
    eventLocation: 'Lamberto Macias Sports Complex, Dumaguete City',
    organizer: 'VisMin Super League',
    image:
      'https://images.unsplash.com/photo-1559369064-c4d65141e408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZSUyMGluZG9vciUyMGFyZW5hfGVufDF8fHx8MTc3MDE4NzYxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Basketball', 'Tournament'],
    ticketType: 'multiple',
    ticketTypeName: 'VIP Courtside Pass',
    schedule: {
      type: 'non_consecutive_days',
      accessScope: 'selected_sessions',
      accessSessionIds: ['vms-day-1', 'vms-day-3'],
      sessions: [
        { id: 'vms-day-1', date: 'July 10, 2026 at 7:00 PM', label: 'Opening Game' },
        { id: 'vms-day-2', date: 'July 11, 2026 at 2:00 PM', label: 'Game 2' },
        { id: 'vms-day-3', date: 'July 17, 2026 at 5:00 PM', label: 'Finals Game' },
      ],
    },
    entryStatus: 'released',
    status: 'action_required',
    quantity: 4,
    deadline: 'July 8, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
      {
        id: 'p2',
        name: 'Mia Torres',
        email: 'mia.t@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p3',
        name: null,
        email: 'leo.garcia@email.com',
        formStatus: 'not_started',
        inviteStatus: 'invited',
        sentToEmail: 'leo.garcia@email.com',
      },
      {
        id: 'p4',
        name: null,
        email: null,
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'VMS-2026-004400',
    purchaseDate: 'Feb 02, 2026',
  },

  // ── 4. MULTIPLE TICKETS ─ Dumaguete City Night Run (Mixed: self + invite + guest QR) ──
  {
    id: 'tkt-011',
    eventId: '11',
    eventTitle: 'Dumaguete City Night Run',
    eventDate: 'August 14, 2026 at 6:30 PM',
    eventLocation: 'Rizal Boulevard, Dumaguete City',
    organizer: 'Dumaguete Runners Club',
    image:
      'https://images.unsplash.com/photo-1502904550040-7534597429ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwcnVubmVycyUyMG5pZ2h0fGVufDF8fHx8MTc3MDE4NzYxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Running', 'Night Run'],
    ticketType: 'multiple',
    ticketTypeName: '10K Group Entry',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'dgt-night-run', date: 'August 14, 2026 at 6:30 PM' }],
    },
    status: 'action_required',
    quantity: 3,
    deadline: 'August 10, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
      {
        id: 'p2',
        name: null,
        email: 'daniel.cruz@email.com',
        formStatus: 'not_started',
        inviteStatus: 'invited',
        sentToEmail: 'daniel.cruz@email.com',
      },
      {
        id: 'p3',
        name: 'Mia Torres',
        email: 'mia.t@email.com',
        formStatus: 'completed',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'DNR-2026-008512',
    purchaseDate: 'Feb 05, 2026',
  },

  // ── 5. MULTIPLE TICKETS ─ Dumaguete City Night Run (Prior state: self + invite + undecided guest) ──
  {
    id: 'tkt-012',
    eventId: '11',
    eventTitle: 'Dumaguete City Night Run - setup in progress',
    eventDate: 'August 14, 2026 at 6:30 PM',
    eventLocation: 'Rizal Boulevard, Dumaguete City',
    organizer: 'Dumaguete Runners Club',
    image:
      'https://images.unsplash.com/photo-1502904550040-7534597429ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwcnVubmVycyUyMG5pZ2h0fGVufDF8fHx8MTc3MDE4NzYxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Running', 'Night Run'],
    ticketType: 'multiple',
    ticketTypeName: '10K Group Entry',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'dgt-night-run', date: 'August 14, 2026 at 6:30 PM' }],
    },
    status: 'action_required',
    quantity: 3,
    deadline: 'August 10, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
      {
        id: 'p2',
        name: null,
        email: 'daniel.cruz@email.com',
        formStatus: 'not_started',
        inviteStatus: 'invited',
        sentToEmail: 'daniel.cruz@email.com',
      },
      {
        id: 'p3',
        name: null,
        email: null,
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'DNR-2026-008511',
    purchaseDate: 'Feb 04, 2026',
  },

  // ── 6. TEAM TICKET ─ Dumaguete Futsal Cup Season 4 (Roster forms needed) ──
  {
    id: 'tkt-013',
    eventId: '13',
    eventTitle: 'Dumaguete Futsal Cup Season 4',
    eventDate: 'August 22, 2026 at 4:00 PM',
    eventLocation: 'Foundation University Gym, Dumaguete City',
    organizer: 'Dumaguete Futsal Association',
    image:
      'https://images.unsplash.com/photo-1518604666860-9ed391f76460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    labels: ['Futsal', 'Team'],
    ticketType: 'team',
    ticketTypeName: 'Team of 8',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'futsal-season-4', date: 'August 22, 2026 at 4:00 PM' }],
    },
    entryStatus: 'pending_form',
    status: 'action_required',
    quantity: 1,
    coachName: 'Jessica Williams',
    coachEmail: 'jessica@email.com',
    minParticipants: 5,
    maxParticipants: 8,
    deadline: 'August 18, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p2',
        name: 'Mia Torres',
        email: 'mia.t@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p3',
        name: 'Paolo Reyes',
        email: 'paolo.reyes@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p4',
        name: 'Carlo Lim',
        email: 'carlo.lim@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p5',
        name: 'Andre Santos',
        email: 'andre.santos@email.com',
        formStatus: 'pending',
        inviteStatus: 'invited',
        sentToEmail: 'andre.santos@email.com',
      },
      {
        id: 'p6',
        name: null,
        email: 'bea.cruz@email.com',
        formStatus: 'not_started',
        inviteStatus: 'invited',
        sentToEmail: 'bea.cruz@email.com',
      },
      {
        id: 'p7',
        name: null,
        email: null,
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
      },
      {
        id: 'p8',
        name: null,
        email: null,
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'FUT-2026-002390',
    purchaseDate: 'Feb 13, 2026',
  },

  // ── 7. TEAM TICKET ─ Grand Slam Tennis Open (Team ready for check-in) ──
  {
    id: 'tkt-014',
    eventId: '14',
    eventTitle: 'Grand Slam Tennis Open',
    eventDate: 'August 29, 2026 at 8:00 AM',
    eventLocation: 'Green Court Club, Taguig, Metro Manila',
    organizer: 'Green Court Athletic Club',
    image:
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    labels: ['Tennis', 'Team'],
    ticketType: 'team',
    ticketTypeName: 'Team of 6',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'grand-slam-team', date: 'August 29, 2026 at 8:00 AM' }],
    },
    entryStatus: 'attached',
    status: 'confirmed',
    quantity: 1,
    coachName: 'Jessica Williams',
    coachEmail: 'jessica@email.com',
    minParticipants: 4,
    maxParticipants: 6,
    deadline: 'August 25, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p2',
        name: 'Emily Park',
        email: 'emily.p@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p3',
        name: 'Mia Torres',
        email: 'mia.t@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p4',
        name: 'Noah Cruz',
        email: 'noah.cruz@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p5',
        name: 'Sofia Lim',
        email: null,
        formStatus: 'completed',
        inviteStatus: 'not_invited',
      },
      {
        id: 'p6',
        name: 'Marco Tan',
        email: null,
        formStatus: 'completed',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'GST-2026-004785',
    purchaseDate: 'Feb 10, 2026',
  },

  // ── 8. TEAM TICKET ─ Cebu Coastal Relay (Lead transferred to this user) ──
  {
    id: 'tkt-015',
    eventId: '15',
    eventTitle: 'Cebu Coastal Relay',
    eventDate: 'September 12, 2026 at 6:00 AM',
    eventLocation: 'South Road Properties, Cebu City',
    organizer: 'Cebu Endurance Club',
    image:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    labels: ['Running', 'Team'],
    ticketType: 'team',
    ticketTypeName: 'Relay Team of 5',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'cebu-coastal-relay', date: 'September 12, 2026 at 6:00 AM' }],
    },
    entryStatus: 'pending_form',
    status: 'action_required',
    quantity: 1,
    coachName: 'Jessica Williams',
    coachEmail: 'jessica@email.com',
    minParticipants: 4,
    maxParticipants: 5,
    deadline: 'September 8, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
      {
        id: 'p2',
        name: 'Carlo Reyes',
        email: 'carlo.reyes@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p3',
        name: 'Lara Mendoza',
        email: 'lara.m@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p4',
        name: null,
        email: 'niko.santos@email.com',
        formStatus: 'not_started',
        inviteStatus: 'invited',
        sentToEmail: 'niko.santos@email.com',
      },
      {
        id: 'p5',
        name: null,
        email: null,
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'CCR-2026-006204',
    purchaseDate: 'Feb 11, 2026',
  },

  // ── 6. SINGLE TICKET ─ Emerald Pickleball Cup (Pending form) ───────────
  {
    id: 'tkt-003',
    eventId: '3',
    eventTitle: 'Emerald Pickleball Cup',
    eventDate: 'June 11, 2026 at 5:00 PM',
    eventLocation: 'FRNDS 2.0 Pickleball, Sibulan, Negros Oriental',
    organizer: 'Emerald Stakes Corporation',
    image:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBwbGF5ZXIlMjBhY3Rpb24lMjBjb3VydHxlbnwxfHx8fDE3NzAxNTE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Pickleball', 'Tournament'],
    ticketType: 'single',
    ticketTypeName: 'Doubles Team Entry',
    schedule: {
      type: 'consecutive_days',
      accessScope: 'single_session',
      accessSessionIds: ['epc-day-1'],
      sessions: [
        { id: 'epc-day-1', date: 'June 11, 2026 at 5:00 PM', label: 'Elimination Round' },
        { id: 'epc-day-2', date: 'June 12, 2026 at 2:00 PM', label: 'Semifinals' },
        { id: 'epc-day-3', date: 'June 13, 2026 at 3:00 PM', label: 'Finals' },
      ],
    },
    entryStatus: 'pending_form',
    status: 'pending',
    quantity: 1,
    deadline: 'June 8, 2026',
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
        isPrimary: true,
      },
    ],
    confirmationRef: 'MNL-2026-001234',
    purchaseDate: 'Jan 15, 2026',
  },
  // ── 5. TEAM TICKET ─ Liptong Woodland 20th Anniversary (Action Required) ──
  {
    id: 'tkt-004',
    eventId: '4',
    eventTitle: 'Liptong Woodland 20th Anniversary',
    eventDate: 'June 5, 2026 at 9:00 PM',
    eventLocation: 'Liptong Woodland, Bacong, Negros Oriental',
    organizer: 'Liptong Woodland',
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBjYW1waW5nfGVufDF8fHx8MTc3MDk1NzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Community', 'Team'],
    ticketType: 'team',
    ticketTypeName: 'Group Cabin Pass',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [
        { id: 'liptong-main', date: 'June 5, 2026 at 9:00 PM' },
      ],
    },
    entryStatus: 'released',
    status: 'action_required',
    quantity: 1,
    coachName: 'Jessica Williams',
    coachEmail: 'jessica@email.com',
    minParticipants: 4,
    maxParticipants: 6,
    deadline: 'June 3, 2026',
    participants: [
      {
        id: 'p2',
        name: 'Sarah Chen',
        email: 'sarah.c@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
      {
        id: 'p3',
        name: 'Diego Santos',
        email: 'diego@email.com',
        formStatus: 'pending',
        inviteStatus: 'accepted',
      },
      {
        id: 'p4',
        name: null,
        email: null,
        formStatus: 'not_started',
        inviteStatus: 'not_invited',
      },
    ],
    confirmationRef: 'LPT-2026-003456',
    purchaseDate: 'Feb 05, 2026',
  },

  // ── 6. SINGLE TICKET ─ Apo Island Open Water Swim (Confirmed) ──────────
  {
    id: 'tkt-009',
    eventId: '9',
    eventTitle: 'Apo Island Open Water Swim',
    eventDate: 'July 22, 2026 at 6:00 AM',
    eventLocation: 'Apo Island, Dauin, Negros Oriental',
    organizer: 'Swim Philippines',
    image:
      'https://images.unsplash.com/photo-1707401252805-9019f342604b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjB5b2dhJTIwcmV0cmVhdCUyMGJlYWNofGVufDF8fHx8MTc3MDk1NzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Swimming', 'Aquatics'],
    ticketType: 'single',
    ticketTypeName: '5K Open Water Swimmer',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'apo-swim', date: 'July 22, 2026 at 6:00 AM' }],
    },
    entryStatus: 'attached',
    status: 'confirmed',
    quantity: 1,
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
    ],
    confirmationRef: 'MNL-2026-001234',
    purchaseDate: 'Jan 15, 2026',
  },

  // ── 7. MULTIPLE TICKETS ─ Canlaon Marathon 2026 (Confirmed - all done) ──
  {
    id: 'tkt-010',
    eventId: '7',
    eventTitle: 'Canlaon Marathon 2026',
    eventDate: 'June 27, 2026 at 5:00 AM',
    eventLocation: 'Canlaon City Sports Complex, Negros Oriental',
    organizer: 'Intl. Athletics Org',
    image:
      'https://images.unsplash.com/photo-1714962747379-93714999d5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjBjcm93ZHxlbnwxfHx8fDE3NzAxODc2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Running', 'Marathon'],
    ticketType: 'multiple',
    ticketTypeName: '42K Full Marathon',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'canlaon-run', date: 'June 27, 2026 at 5:00 AM' }],
    },
    entryStatus: 'attached',
    status: 'confirmed',
    quantity: 2,
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
      {
        id: 'p2',
        name: 'Emily Park',
        email: 'emily.p@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
      },
    ],
    confirmationRef: 'CFR-2026-008823',
    purchaseDate: 'Feb 08, 2026',
  },

  // ── 8. SINGLE TICKET ─ Asia Mountain Bike Series – Dirt Heroes International (Confirmed) ──
  {
    id: 'tkt-005',
    eventId: '5',
    eventTitle: 'Asia Mountain Bike Series – Dirt Heroes International',
    eventDate: 'June 18, 2026 at 8:00 AM',
    eventLocation: 'Balili Bike Park, Sibulan, Negros Oriental',
    organizer: 'NORSPORTS / UCI',
    image:
      'https://images.unsplash.com/photo-1586280246643-9e2f01e3c14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcmFjZSUyMHJvYWQlMjBiaWtlc3xlbnwxfHx8fDE3NzAwOTE2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Mountain Biking', 'Elite'],
    ticketType: 'single',
    ticketTypeName: 'Elite Cross Country Entry',
    schedule: {
      type: 'consecutive_days',
      accessScope: 'all_sessions',
      sessions: [
        { id: 'mtb-practice', date: 'June 18, 2026 at 8:00 AM', label: 'Official Practice' },
        { id: 'mtb-race', date: 'June 19, 2026 at 9:00 AM', label: 'Race Day' },
      ],
    },
    entryStatus: 'attached',
    status: 'confirmed',
    quantity: 1,
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
    ],
    confirmationRef: 'IRN-2026-007890',
    purchaseDate: 'Jan 28, 2026',
  },

  // ── 9. SINGLE TICKET ─ Valencia Ridge Trail Ultra 2025 (Completed, review pending) ─
  {
    id: 'tkt-006',
    eventId: 'past-2',
    eventTitle: 'Valencia Ridge Trail Ultra 2025',
    eventDate: 'May 14, 2025 at 5:30 AM',
    eventLocation: 'Mount Talinis Trail, Valencia, Negros Oriental',
    organizer: 'NORSPORTS',
    image:
      'https://images.unsplash.com/photo-1566147592116-5e51b670137a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbCUyMHJ1bm5pbmclMjBtb3VudGFpbiUyMHJhY2V8ZW58MXx8fHwxNzcwODg2NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Trail Running', '50K'],
    ticketType: 'single',
    ticketTypeName: '50K Ultramarathon Pass',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'valencia-run', date: 'May 14, 2025 at 5:30 AM' }],
    },
    entryStatus: 'attached',
    status: 'completed',
    quantity: 1,
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
    ],
    confirmationRef: 'MTP-2025-012345',
    purchaseDate: 'Oct 02, 2025',
    reviewStatus: 'none',
  },

  // ── 10. SINGLE TICKET ─ Sibulan Mountain Bike Enduro 2025 (Completed, reviewed) ──
  {
    id: 'tkt-007',
    eventId: 'past-4',
    eventTitle: 'Sibulan Mountain Bike Enduro 2025',
    eventDate: 'January 18, 2025 at 7:00 AM',
    eventLocation: 'Balili Park trails, Sibulan, Negros Oriental',
    organizer: 'Sibulan Cycling Club',
    image:
      'https://images.unsplash.com/photo-1720749407269-b92e86cffb68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcmFjZSUyMG91dGRvb3IlMjByb2FkfGVufDF8fHx8MTc3MDg4NjYzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    labels: ['Cycling', 'Enduro'],
    ticketType: 'single',
    ticketTypeName: 'Individual Enduro Rider',
    schedule: {
      type: 'single_day',
      accessScope: 'all_sessions',
      sessions: [{ id: 'sibulan-enduro', date: 'January 18, 2025 at 7:00 AM' }],
    },
    entryStatus: 'attached',
    status: 'completed',
    quantity: 1,
    participants: [
      {
        id: 'p1',
        name: 'Jessica Williams',
        email: 'jessica@email.com',
        formStatus: 'completed',
        inviteStatus: 'accepted',
        isPrimary: true,
      },
    ],
    confirmationRef: 'RDP-2025-006789',
    purchaseDate: 'Sep 10, 2025',
    reviewStatus: 'submitted',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count tickets that need user action (action_required or pending). */
export function getActionRequiredCount(tickets: MyTicket[] = MY_TICKETS): number {
  return tickets.filter(
    (t) => t.status === 'action_required' || t.status === 'pending',
  ).length;
}

export function getPassportPendingEntries(tickets: MyTicket[] = MY_TICKETS): MyTicket[] {
  return tickets.filter(
    (ticket) => ticket.entryStatus === 'pending_form' || ticket.entryStatus === 'resubmit_required',
  );
}

export function isPassportFormActionEntry(entry: RegistrationQueueEntry) {
  return Boolean(entry.personalAccessConfirmed) && (
    entry.entryStatus === 'pending_form' ||
    entry.entryStatus === 'resubmit_required'
  );
}

export const retiredRegistrationEntryIds = new Set([
  'guest-obstacle-race',
  'self-cycling-sportive',
  'guest-trail-buddy',
]);

export function isOrderFormActionEntry(entry: RegistrationQueueEntry) {
  return (
    !retiredRegistrationEntryIds.has(entry.id) &&
    (entry.entryStatus === 'pending_form' || entry.entryStatus === 'resubmit_required')
  );
}

export function getOrderFormActionEntries(entries: RegistrationQueueEntry[]): RegistrationQueueEntry[] {
  return entries
    .filter(isOrderFormActionEntry)
    .sort((a, b) => parseEntryDeadline(a.deadline) - parseEntryDeadline(b.deadline));
}

const passportFormKindOrder: RegistrationQueueEntryType[] = ['self', 'guest', 'team'];

function parseEntryDeadline(deadline?: string) {
  if (!deadline) return Number.MAX_SAFE_INTEGER;
  const parsed = new Date(`${deadline} 23:59:59`);
  return Number.isNaN(parsed.getTime()) ? Number.MAX_SAFE_INTEGER : parsed.getTime();
}

export function getPassportFormActionEntries(
  entries: RegistrationQueueEntry[],
  options: { entryId?: string | null; ticketId?: string | null } = {},
): RegistrationQueueEntry[] {
  const byType = new Map<RegistrationQueueEntryType, RegistrationQueueEntry>();

  entries
    .filter(isPassportFormActionEntry)
    .filter((entry) => !retiredRegistrationEntryIds.has(entry.id))
    .forEach((entry) => {
      const current = byType.get(entry.type);
      if (!current) {
        byType.set(entry.type, entry);
        return;
      }

      const entryMatchesFocus =
        (options.entryId && entry.id === options.entryId) ||
        (!options.entryId && options.ticketId && entry.ticketId === options.ticketId);
      const currentMatchesFocus =
        (options.entryId && current.id === options.entryId) ||
        (!options.entryId && options.ticketId && current.ticketId === options.ticketId);

      if (entryMatchesFocus !== currentMatchesFocus) {
        if (entryMatchesFocus) byType.set(entry.type, entry);
        return;
      }

      if (parseEntryDeadline(entry.deadline) < parseEntryDeadline(current.deadline)) {
        byType.set(entry.type, entry);
      }
    });

  return passportFormKindOrder
    .map((type) => byType.get(type))
    .filter((entry): entry is RegistrationQueueEntry => Boolean(entry));
}

export function getPassportPendingSummary(tickets: MyTicket[] = MY_TICKETS) {
  const pendingEntries = getPassportPendingEntries(tickets);
  const deadlines = pendingEntries
    .map((ticket) => (ticket.deadline ? new Date(`${ticket.deadline} 23:59:59`) : null))
    .filter((deadline): deadline is Date => Boolean(deadline) && !Number.isNaN(deadline.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    pendingCount: pendingEntries.length,
    nearestDeadline: deadlines[0],
  };
}

export function createRegistrationQueueEntries(tickets: MyTicket[] = MY_TICKETS): RegistrationQueueEntry[] {
  const entries = tickets
    .filter((ticket) => Boolean(ticket.entryStatus))
    .flatMap((ticket) => {
      if (ticket.ticketType === 'team') {
        const attachedCount = ticket.participants.filter((participant) => participant.formStatus === 'completed').length;
        return [{
          id: `${ticket.id}-team`,
          ticketId: ticket.id,
          orderRef: ticket.confirmationRef,
          eventName: ticket.eventTitle,
          personName: ticket.coachName || ticket.participants[0]?.name || 'Team lead',
          category: ticket.ticketTypeName,
          type: 'team' as const,
          entryStatus: ticket.entryStatus || 'pending_form',
          deadline: ticket.deadline,
          formRoute: `/orders/${ticket.id}/form`,
          inviteEmail: ticket.coachEmail,
          teamAttachedCount: attachedCount,
          teamTotalCount: ticket.maxParticipants || ticket.quantity,
        }];
      }

      return ticket.participants.map((participant, index) => {
        const isGuest = !participant.isPrimary && ticket.ticketType !== 'team';
        const ticketWideStatus =
          ticket.entryStatus === 'released' ||
          ticket.entryStatus === 'no_show';
        const isPendingParticipant =
          ticket.entryStatus === 'pending_form' ||
          ticket.entryStatus === 'resubmit_required' ||
          participant.formStatus !== 'completed';

        return {
          id: `${ticket.id}-${participant.id || index}`,
          ticketId: ticket.id,
          orderRef: ticket.confirmationRef,
          eventName: ticket.eventTitle,
          personName: participant.name || participant.email || `Participant ${index + 1}`,
          category: ticket.ticketTypeName,
          type: isGuest ? 'guest' as const : 'self' as const,
          entryStatus: ticketWideStatus ? ticket.entryStatus! : isPendingParticipant ? (ticket.entryStatus || 'pending_form') : 'attached',
          deadline: ticket.deadline,
          formRoute: `/orders/${ticket.id}/form`,
          inviteEmail: participant.sentToEmail || participant.email || undefined,
        };
      });
    });

  return [
    ...entries,
    // ── Multiple entries: buyer can fill or send participant forms ──────
    {
      id: 'guest-swim-relay',
      ticketId: 'guest-swim-relay',
      orderRef: 'SWM-2026-007744',
      eventName: 'Apo Island Open Water Swim Relay',
      personName: 'Naomi Tanaka',
      category: '2 participant entries',
      type: 'guest' as const,
      entryStatus: 'pending_form' as const,
      deadline: 'June 8, 2026',
      formRoute: '/orders/guest-swim-relay/form',
      inviteEmail: 'naomi.tanaka@email.com',
      guestCompletedCount: 0,
      guestTotalCount: 2,
    },
    // ── Team entry: futsal roster still needs forms ─────────────────────
    {
      id: 'team-futsal-league',
      ticketId: 'team-futsal-league',
      orderRef: 'FUT-2026-002390',
      eventName: 'Dumaguete Futsal Cup Season 4',
      personName: 'Jessica Williams',
      category: 'Team of 8',
      type: 'team' as const,
      entryStatus: 'pending_form' as const,
      deadline: 'June 20, 2026',
      formRoute: '/orders/team-futsal-league/form',
      inviteEmail: 'jessica@email.com',
      teamAttachedCount: 3,
      teamTotalCount: 8,
    },

    {
      id: 'released-tennis-form',
      ticketId: 'released-tennis-form',
      orderRef: 'REL-2026-000771',
      eventName: 'Clay Court Doubles Clinic',
      personName: 'Jessica Williams',
      category: 'Clinic Entry',
      type: 'self',
      entryStatus: 'released',
      deadline: 'May 18, 2026',
      formRoute: '/events/3',
      price: 1200,
    },
    {
      id: 'resubmit-aquathlon',
      ticketId: 'resubmit-aquathlon',
      orderRef: 'FRM-2026-003221',
      eventName: 'Bay Aquathlon Challenge',
      personName: 'Jessica Williams',
      category: 'Individual Entry',
      type: 'self',
      entryStatus: 'resubmit_required',
      deadline: 'June 1, 2026',
      formRoute: '/forms/resubmit-aquathlon/diff',
      price: 1800,
    },
    {
      id: 'past-noshow-trail',
      ticketId: 'past-noshow-trail',
      orderRef: 'NSH-2026-001145',
      eventName: 'Ridge Trail 12K',
      personName: 'Jessica Williams',
      category: '12K Trail',
      type: 'self',
      entryStatus: 'no_show',
      deadline: 'February 1, 2026',
      formRoute: '/events/10',
      price: 1600,
    },
  ];
}
