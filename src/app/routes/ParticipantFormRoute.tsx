import { ticketFromRegistrationEntry } from '@/app/data/registrationTickets';
/**
 * Route wrapper for the Participant Form page.
 * Auth-guarded — redirects to login if not authenticated.
 * Looks up ticket by :ticketId param from the canonical mock catalog.
 */
import React from 'react';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router';
import { ParticipantFormPage } from '@/app/pages/ParticipantFormPage';
import {
  type MyTicket,
  type Participant,
  type RegistrationQueueEntry,
} from '@/app/data/tickets';
import { getMockTicketById, getTicketParticipants } from '@/app/data/mockCatalog';
import { AuthGuard } from '@/app/components/AuthGuard';
import { useAppContext } from '@/app/context/AppContext';
import { shareTeamPlayerInvite, unsendTeamPlayerInvite } from '@/app/data/teamPlayers.js';
import { resolveNonTeamCompletionAccess } from '@/app/data/participantFormState.js';


function registrationQueueFallback(
  ticket: MyTicket,
  participant: Participant,
  fallbackEntryId = `${ticket.id}-${participant.id}`,
): RegistrationQueueEntry {
  const participantIndex = Math.max(ticket.participants.findIndex((candidate) => candidate.id === participant.id), 0);

  return {
    id: fallbackEntryId,
    ticketId: ticket.id,
    orderRef: ticket.confirmationRef,
    eventName: ticket.eventTitle,
    personName: participant.name || `Participant ${participantIndex + 1}`,
    category: ticket.ticketTypeName,
    type: ticket.ticketType === 'team'
      ? 'team'
      : participant.isPrimary === false ? 'guest' : 'self',
    participantId: participant.id,
    accessPath: participant.accessPath || 'pending',
    entryStatus: participant.formStatus === 'completed' ? 'attached' : ticket.entryStatus || 'pending_form',
    deadline: ticket.deadline,
    formRoute: `/orders/${ticket.id}/form`,
    inviteEmail: participant.sentToEmail || participant.email || null,
    inviteStatus: participant.inviteStatus,
    claimLinkRevoked: participant.claimLinkRevoked,
    participantIsPrimary: participant.isPrimary,
    teamTotalCount: ticket.ticketType === 'team' ? ticket.participants.length : undefined,
  };
}

export function ParticipantFormRoute() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    claimRegistrationEntry,
    completeRegistrationEntry,
    registrationQueueEntries,
    rescindRegistrationInvite,
    sendRegistrationInvite,
    setRegistrationEntryAccessPath,
    teamPlayerAccess,
    teamPlayerRoster,
    setTeamPlayerAccess,
    setTeamPlayerRoster,
    updateRegistrationParticipant,
  } = useAppContext();

  const returnToQueue = searchParams.get('returnTo') === 'registration-queue';
  const returnToPassport = searchParams.get('returnTo') === 'passport';
  const returnToPassportEvents = searchParams.get('returnTo') === 'passport-events';
  const returnToHome = searchParams.get('returnTo') === 'home';
  const returnToCheckout = searchParams.get('returnTo') === 'checkout';
  const returnToOrder = searchParams.get('returnTo') === 'order';
  const resubmission = searchParams.get('resubmit') === '1';
  const isInvite = searchParams.get('invite') === '1';
  const entryId = searchParams.get('entryId');
  const participantId = searchParams.get('participantId') || undefined;
  const playerOnly = searchParams.get('playerOnly') === '1';
  const buyerFill = searchParams.get('buyerFill') === '1';

  const entry = registrationQueueEntries.find((item) =>
    (entryId && item.id === entryId) || (!entryId && ticketId && item.ticketId === ticketId),
  );
  
  const summaryEntry = registrationQueueEntries.find((item) => item.ticketId === ticketId && !item.participantId)
    || registrationQueueEntries.find((item) => item.ticketId === ticketId);
  const canonicalTicket = ticketId ? getMockTicketById(ticketId) : undefined;
  const rawTicket = (entryId && entry && entry.id.startsWith('checkout-'))
    ? ticketFromRegistrationEntry(entry)
    : (canonicalTicket
      ? {
          ...canonicalTicket,
          participants: getTicketParticipants(canonicalTicket, {
            registrationQueueEntries,
            teamPlayerRoster,
          }),
        }
      : (summaryEntry ? ticketFromRegistrationEntry(summaryEntry) : undefined));
  const buyerFillParticipantId = participantId || entry?.participantId;
  const buyerFillParticipant = rawTicket?.participants.find(
    (participant) => participant.id === buyerFillParticipantId,
  );
  const canBuyerFill = Boolean(
    buyerFill
    && buyerFillParticipant
    && buyerFillParticipant.formStatus !== 'completed'
    && buyerFillParticipant.accessPath !== 'passport'
    && buyerFillParticipant.accessPath !== 'guest_qr',
  );
  const buyerFillTicket = rawTicket && canBuyerFill && buyerFillParticipantId
    ? {
        ...rawTicket,
        participants: rawTicket.participants.map((participant) => (
          participant.id === buyerFillParticipantId
            ? {
                ...participant,
                name: null,
                email: null,
                sentToEmail: null,
                formStatus: 'not_started' as const,
                inviteStatus: 'not_invited' as const,
                accessPath: 'pending' as const,
                claimLinkRevoked: true,
              }
            : participant
        )),
      }
    : rawTicket;
  const ticket = buyerFillTicket;

  const passportEventsParams = new URLSearchParams({ focus: 'forms' });
  if (entryId) passportEventsParams.set('entryId', entryId);
  if (ticketId) passportEventsParams.set('ticketId', ticketId);
  const passportEventsPath = `/passport/events?${passportEventsParams.toString()}`;
  const completionEntryId = entryId || entry?.id;
  const completionParticipantId = participantId || entry?.participantId;
  const completionParticipant = ticket?.participants.find((participant) => participant.id === completionParticipantId)
    || ticket?.participants[0];
  const completionAccessPath = ticket?.ticketType === 'team'
    ? undefined
    : resolveNonTeamCompletionAccess(completionParticipant);

  const persistBuyerCompletion = () => {
    if (!isInvite && completionEntryId && ticket?.ticketType === 'single') {
      completeRegistrationEntry(completionEntryId, completionAccessPath);
    }
  };

  const goToQueueOrOrders = () => {
    if (returnToCheckout) {
      persistBuyerCompletion();
      navigate('/checkout?formFilled=1');
      return;
    }
    if (returnToOrder) {
      persistBuyerCompletion();
      navigate(`/orders/${ticket.id}`);
      return;
    }
    if (returnToHome) {
      persistBuyerCompletion();
      navigate('/');
      return;
    }
    if (returnToPassport) {
      persistBuyerCompletion();
      navigate('/passport');
      return;
    }
    if (returnToQueue || returnToPassportEvents) {
      persistBuyerCompletion();
      navigate(passportEventsPath);
      return;
    }
    persistBuyerCompletion();
    navigate('/orders');
  };

  if (!ticket) {
    return <Navigate to="/orders" replace />;
  }

  // Orders owns participant selection. A multi-entry form requires an explicit
  // participant target; stale multi-entry links return to the order.
  if ((ticket.ticketType === 'team' || ticket.ticketType === 'multiple') && !completionParticipantId && !isInvite) {
    return <Navigate to={`/orders/${ticket.id}`} replace />;
  }

  const formParticipants = getTicketParticipants(ticket, {
    registrationQueueEntries,
    teamPlayerRoster,
  });
  const formParticipantsWithAccess = formParticipants.map((participant) => ({
    ...participant,
    accessPath: ticket.ticketType === 'team'
      ? teamPlayerAccess[`${ticket.id}:${participant.id}`] || participant.accessPath
      : participant.accessPath,
  }));
  const selectedParticipant = completionParticipantId
    ? formParticipantsWithAccess.find((participant) => participant.id === completionParticipantId)
    : undefined;
  if ((ticket.ticketType === 'team' || ticket.ticketType === 'multiple') && !selectedParticipant && !isInvite) {
    return <Navigate to={`/orders/${ticket.id}`} replace />;
  }
  const inviteParticipant = isInvite
    ? formParticipantsWithAccess.find((participant) => participant.id === completionParticipantId)
      || formParticipantsWithAccess[0]
    : undefined;
  const ticketForForm = isInvite && inviteParticipant
    ? {
        ...ticket,
        ticketType: 'single' as const,
        ticketTypeName: 'INDIVIDUAL',
        quantity: 1,
        participants: [inviteParticipant],
        minParticipants: undefined,
        maxParticipants: undefined,
        coachName: undefined,
        coachEmail: undefined,
      }
    : selectedParticipant
    ? {
        ...ticket,
        quantity: 1,
        participants: [selectedParticipant],
      }
    : { ...ticket, participants: formParticipantsWithAccess };

  const formPage = (
      <ParticipantFormPage
        ticket={ticketForForm}
        onBack={() => {
          if (returnToCheckout) {
            navigate('/checkout');
          } else {
            navigate(returnToQueue || returnToPassportEvents ? passportEventsPath : returnToPassport ? '/passport' : returnToHome ? '/' : returnToOrder ? `/orders/${ticket.id}` : '/orders');
          }
        }}
        onGoToTickets={goToQueueOrOrders}
        initialParticipantId={selectedParticipant?.id || inviteParticipant?.id || completionParticipantId}
        playerOnly={playerOnly || Boolean(selectedParticipant && !isInvite)}
        onPlayerAccessChange={(participantId, accessPath) => {
          if (ticket.ticketType === 'team') {
            setTeamPlayerAccess(ticket.id, participantId, accessPath);
          }
        }}
        onParticipantAccessChange={(participantId, accessPath) => {
          if (ticket.ticketType === 'team') return;
          const targetEntry = registrationQueueEntries.find((item) => item.ticketId === ticket.id && item.participantId === participantId)
            || (entry?.participantId || ticket.ticketType === 'single' ? entry : undefined);
          if (targetEntry) setRegistrationEntryAccessPath(targetEntry.id, accessPath);
        }}
        onParticipantChange={(nextParticipant) => {
          if (ticket.ticketType === 'team') {
            const roster = teamPlayerRoster[ticket.id] || ticket.participants;
            setTeamPlayerRoster(ticket.id, roster.map((participant) => (
              participant.id === nextParticipant.id ? nextParticipant : participant
            )));
            setTeamPlayerAccess(ticket.id, nextParticipant.id, nextParticipant.accessPath || 'pending');
            return;
          }
          const targetEntry = registrationQueueEntries.find((item) => item.ticketId === ticket.id && item.participantId === nextParticipant.id)
            || (entry?.participantId || ticket.ticketType === 'single' ? entry : undefined);
          const fallbackEntry = registrationQueueFallback(
            ticket,
            nextParticipant,
            ticket.ticketType === 'single' && entryId ? entryId : `${ticket.id}-${nextParticipant.id}`,
          );
          updateRegistrationParticipant(targetEntry?.id || fallbackEntry.id, nextParticipant, fallbackEntry);
        }}
        onParticipantInvite={(nextParticipantId, recipient, participantName) => {
          if (ticket.ticketType === 'team') {
            const roster = teamPlayerRoster[ticket.id] || ticket.participants;
            setTeamPlayerRoster(ticket.id, roster.map((participant) => (
              participant.id === nextParticipantId
                ? {
                    ...shareTeamPlayerInvite(participant, recipient),
                    ...(participantName ? { name: participantName } : {}),
                  }
                : participant
            )));
            setTeamPlayerAccess(ticket.id, nextParticipantId, 'pending');
            return;
          }
          const invitedParticipant = formParticipantsWithAccess.find((participant) => participant.id === nextParticipantId);
          if (!invitedParticipant) return;
          const targetEntry = registrationQueueEntries.find((item) => item.ticketId === ticket.id && item.participantId === nextParticipantId)
            || (entry?.participantId || ticket.ticketType === 'single' ? entry : undefined);
          const fallbackEntry = registrationQueueFallback(
            ticket,
            invitedParticipant,
            ticket.ticketType === 'single' && entryId ? entryId : `${ticket.id}-${nextParticipantId}`,
          );
          sendRegistrationInvite(targetEntry?.id || fallbackEntry.id, recipient, fallbackEntry);
        }}
        onParticipantInviteRevoke={(nextParticipantId) => {
          if (ticket.ticketType === 'team') {
            const roster = teamPlayerRoster[ticket.id] || ticket.participants;
            setTeamPlayerRoster(ticket.id, roster.map((participant) => (
              participant.id === nextParticipantId ? unsendTeamPlayerInvite(participant) : participant
            )));
            setTeamPlayerAccess(ticket.id, nextParticipantId, 'pending');
            return;
          }
          const targetEntry = registrationQueueEntries.find((item) => item.ticketId === ticket.id && item.participantId === nextParticipantId)
            || (entry?.participantId || ticket.ticketType === 'single' ? entry : undefined);
          if (targetEntry) rescindRegistrationInvite(targetEntry.id);
        }}
        onInviteSubmit={isInvite ? () => claimRegistrationEntry({
          entryId: completionEntryId || '',
          ticketId: ticket?.ticketType === 'team' ? ticket.id : undefined,
          participantId: ticket?.ticketType === 'team' ? completionParticipantId : undefined,
        }) : undefined}
        resubmission={resubmission}
        isPreCheckout={returnToCheckout}
      />
  );

  return <AuthGuard>{formPage}</AuthGuard>;
}
