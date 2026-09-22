/**
 * Route wrapper for the Settings page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import { createGuestProfile } from '@/app/data/session.js';
import React from 'react';
import { useNavigate } from 'react-router';
import { SettingsPage } from '@/app/components/SettingsPage';
import { useAppContext } from '@/app/context/AppContext';
import { AuthGuard } from '@/app/components/AuthGuard';

export function SettingsRoute() {
  const navigate = useNavigate();
  const { setUserProfile, userProfile } = useAppContext();

  return (
    <AuthGuard>
      <SettingsPage
        onBack={() => navigate('/')}
        onGoToMyAccount={() => navigate('/settings/account')}
        onGoToTransactions={() => navigate('/settings/transactions')}
        onGoToInbox={() => navigate('/settings/inbox')}
        onGoToProfile={() => navigate('/profile')}
        onGoToApplyOrganizer={() => navigate('/settings/apply-organizer')}
        onGoToPassportCases={() => navigate('/passport-cases')}
        userName={userProfile.name}
        onSignOut={() => {
          setUserProfile(createGuestProfile());
          navigate('/login');
        }}
      />
    </AuthGuard>
  );
}