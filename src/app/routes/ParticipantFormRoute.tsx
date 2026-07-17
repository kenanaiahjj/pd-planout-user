/**
 * Route wrapper for the Participant Form page.
 * Auth-guarded — redirects to login if not authenticated.
 * Looks up ticket by :ticketId param from MY_TICKETS.
 */
import React from 'react';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router';
import { ParticipantFormPage } from '@/app/pages/ParticipantFormPage';
import {
  MY_TICKETS,
  type MyTicket,
  type Participant,
  type RegistrationQueueEntry,
} from '@/app/data/tickets';
import { AuthGuard } from '@/app/components/AuthGuard';
import { useAppContext } from '@/app/context/AppContext';

const fallbackImage = MY_TICKETS.find((ticket) => ticket.image)?.image || '';

function buildParticipantsFromEntry(entry: RegistrationQueueEntry): Participant[] {
  if (entry.type === 'self') {
    const isCompleted = entry.entryStatus === 'attached';
    const isInvited = !!(entry.inviteEmail && entry.personName.toLowerCase().includes('guest'));
    return [{
      id: entry.id,
      name: isInvited ? null : entry.personName,
      email: entry.inviteEmail || null,
      formStatus: isCompleted ? 'completed' : 'not_started',
      inviteStatus: isInvited ? 'invited' : 'not_invited',
      isPrimary: true,
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
          formStatus: isInvited ? ('not_started' as const) : ('completed' as const),
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

function ticketFromRegistrationEntry(entry: RegistrationQueueEntry): MyTicket {
  const isTeam = entry.type === 'team';
  const isMultiple = entry.type === 'guest';
  const participants = buildParticipantsFromEntry(entry);
  const sourceTicket = MY_TICKETS.find((ticket) => ticket.id === entry.ticketId);

  return {
    id: entry.ticketId,
    eventId: entry.ticketId,
    entryStatus: entry.entryStatus,
    eventTitle: entry.eventName,
    eventDate: entry.deadline ? `Date to be announced` : 'Date to be announced',
    eventLocation: 'Location to be announced',
    organizer: 'PlanOut Organizer',
    image: fallbackImage,
    labels: [entry.category],
    ticketType: isTeam ? 'team' : isMultiple ? 'multiple' : 'single',
    ticketTypeName: entry.category,
    status: entry.entryStatus === 'attached' ? 'completed' : 'action_required',
    quantity: isTeam ? 1 : participants.length,
    participants,
    confirmationRef: entry.orderRef,
    purchaseDate: 'Registration in progress',
    deadline: entry.deadline,
    coachName: isTeam ? entry.personName : undefined,
    coachEmail: isTeam ? entry.inviteEmail : undefined,
    minParticipants: isTeam ? sourceTicket?.minParticipants ?? 1 : undefined,
    maxParticipants: isTeam ? sourceTicket?.maxParticipants ?? (entry.teamTotalCount || participants.length) : undefined,
  };
}

export function ParticipantFormRoute() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeRegistrationEntry, registrationQueueEntries } = useAppContext();

  const returnToQueue = searchParams.get('returnTo') === 'registration-queue';
  const returnToPassport = searchParams.get('returnTo') === 'passport';
  const returnToPassportEvents = searchParams.get('returnTo') === 'passport-events';
  const returnToHome = searchParams.get('returnTo') === 'home';
  const returnToCheckout = searchParams.get('returnTo') === 'checkout';
  const resubmission = searchParams.get('resubmit') === '1';
  const entryId = searchParams.get('entryId');

  if (returnToCheckout) {
    return <Navigate to="/checkout" replace />;
  }

  const entry = registrationQueueEntries.find((item) =>
    (entryId && item.id === entryId) || (!entryId && ticketId && item.ticketId === ticketId),
  );
  
  const rawTicket = (entryId && entry && entry.id.startsWith('checkout-'))
    ? ticketFromRegistrationEntry(entry)
    : (MY_TICKETS.find((t) => t.id === ticketId) || (entry ? ticketFromRegistrationEntry(entry) : undefined));
  const ticket = (rawTicket && returnToCheckout)
    ? {
        ...rawTicket,
        status: 'action_required' as const,
        entryStatus: 'pending_form' as const,
        participants: rawTicket.participants.map(p => ({
          ...p,
          formStatus: 'not_started' as const,
          name: '',
          email: '',
        }))
      }
    : rawTicket;

  const passportEventsParams = new URLSearchParams({ focus: 'forms' });
  if (entryId) passportEventsParams.set('entryId', entryId);
  if (ticketId) passportEventsParams.set('ticketId', ticketId);
  const passportEventsPath = `/passport/events?${passportEventsParams.toString()}`;

  const goToQueueOrOrders = () => {
    if (returnToCheckout) {
      navigate('/checkout?formFilled=1');
      return;
    }
    if (returnToHome) {
      if (entryId) completeRegistrationEntry(entryId);
      navigate('/');
      return;
    }
    if (returnToPassport) {
      if (entryId) completeRegistrationEntry(entryId);
      navigate('/passport');
      return;
    }
    if (returnToQueue || returnToPassportEvents) {
      if (entryId) completeRegistrationEntry(entryId);
      navigate(passportEventsPath);
      return;
    }
    navigate('/orders');
  };

  if (!ticket) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <AuthGuard>
      <ParticipantFormPage
        ticket={ticket}
        onBack={() => {
          if (returnToCheckout) {
            navigate('/checkout');
          } else {
            navigate(returnToQueue || returnToPassportEvents ? passportEventsPath : returnToPassport ? '/passport' : returnToHome ? '/' : '/orders');
          }
        }}
        onGoToTickets={goToQueueOrOrders}
        resubmission={resubmission}
        isPreCheckout={returnToCheckout}
      />
    </AuthGuard>
  );
}
