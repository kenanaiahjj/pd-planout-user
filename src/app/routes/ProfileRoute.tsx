/**
 * Route wrapper for the Profile page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { ProfilePage } from '@/app/pages/ProfilePage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function ProfileRoute() {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <ProfilePage
        onEventSelect={(eventId) => navigate(`/events/${eventId}`)}
      />
    </AuthGuard>
  );
}
