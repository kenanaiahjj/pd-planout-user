/**
 * Route wrapper for the Inbox page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { InboxPage } from '@/app/pages/InboxPage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function InboxRoute() {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <InboxPage onBack={() => navigate('/settings')} />
    </AuthGuard>
  );
}
