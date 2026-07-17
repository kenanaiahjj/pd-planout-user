/**
 * Route wrapper for the My Account page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { MyAccountPage } from '@/app/pages/MyAccountPage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function MyAccountRoute() {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <MyAccountPage onBack={() => navigate('/settings')} />
    </AuthGuard>
  );
}
