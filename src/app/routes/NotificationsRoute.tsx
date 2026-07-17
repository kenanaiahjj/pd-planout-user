/**
 * Route wrapper for the Notifications page (full-page, mobile).
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { NotificationsPage } from '@/app/pages/NotificationsPage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function NotificationsRoute() {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <NotificationsPage
        onBack={() => navigate('/')}
        onGoToCompletedTickets={() => navigate('/orders')}
        onGoToInbox={() => navigate('/settings/inbox')}
      />
    </AuthGuard>
  );
}
