/**
 * Route wrapper for the Apply as Organizer page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { ApplyOrganizerPage } from '@/app/pages/ApplyOrganizerPage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function ApplyOrganizerRoute() {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <ApplyOrganizerPage onBack={() => navigate('/settings')} />
    </AuthGuard>
  );
}
