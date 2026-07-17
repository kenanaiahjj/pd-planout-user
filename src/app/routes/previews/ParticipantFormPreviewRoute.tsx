/** Preview route for /orders/tkt-002/form — renders the Participant Form for ticket 'tkt-002'. */
import React from 'react';
import { useNavigate } from 'react-router';
import { ParticipantFormPage } from '@/app/pages/ParticipantFormPage';
import { MY_TICKETS } from '@/app/data/tickets';
import { AuthGuard } from '@/app/components/AuthGuard';

export function ParticipantFormPreviewRoute() {
  const navigate = useNavigate();
  const ticket = MY_TICKETS.find((t) => t.id === 'tkt-002')!;

  return (
    <AuthGuard>
      <ParticipantFormPage
        ticket={ticket}
        onBack={() => navigate('/orders')}
        onGoToTickets={() => navigate('/orders')}
      />
    </AuthGuard>
  );
}
