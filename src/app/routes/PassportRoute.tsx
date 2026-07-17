/**
 * Route wrapper for the dedicated Passport QR page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { PassportEventsPage, PassportPage } from '@/app/pages/PassportPage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function PassportRoute() {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <PassportPage onBack={() => navigate(-1)} />
    </AuthGuard>
  );
}

export function PassportEventsRoute() {
  return (
    <AuthGuard>
      <PassportEventsPage />
    </AuthGuard>
  );
}
