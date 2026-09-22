/**
 * Route wrapper for the Login page.
 * After successful login, navigates to the returnTo path (or /).
 * Offers a "Continue as Guest" option that opens the visitor view without an account.
 */
import React from 'react';
import { createAccountProfile, createGuestProfile } from '@/app/data/session.js';
import { getLoginDestination } from '@/app/data/navigation.js';
import { useLocation, useNavigate } from 'react-router';
import { LoginPage } from '@/app/pages/LoginPage';
import { useAppContext } from '@/app/context/AppContext';

export function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserProfile, setOnboardingStep, returnTo, setReturnTo, member } = useAppContext();
  const stateReturnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const destination = stateReturnTo || returnTo || '/';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#def2ee] selection:text-[#177564]">
      <LoginPage
        onLoginComplete={(method, value) => {
          setUserProfile((previous) => createAccountProfile({
            method, value, displayName: member.displayName, previous,
          }));
          setOnboardingStep('done');
          setReturnTo(null);
          navigate(getLoginDestination(destination, true), { replace: true });
        }}
        onContinueAsGuest={() => {
          setUserProfile(createGuestProfile());
          setOnboardingStep('done');
          setReturnTo(null);
          navigate(getLoginDestination(destination, false), { replace: true });
        }}
      />
    </div>
  );
}
