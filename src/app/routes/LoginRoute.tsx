/**
 * Route wrapper for the Login page.
 * After successful login, navigates to the returnTo path (or /).
 * Offers a "Continue as Guest" option that creates a preview session for QA.
 */
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LoginPage } from '@/app/pages/LoginPage';
import { useAppContext } from '@/app/context/AppContext';

export function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserProfile, setOnboardingStep, returnTo, setReturnTo } = useAppContext();
  const stateReturnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const destination = stateReturnTo || returnTo || '/';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#def2ee] selection:text-[#177564]">
      <LoginPage
        onLoginComplete={(method, value) => {
          setUserProfile((prev) => ({
            ...prev,
            name: prev.name || 'User',
            loginMethod: method,
            email: method === 'email' ? value : prev.email,
            phone: method === 'phone' ? value : prev.phone,
          }));
          setOnboardingStep('done');
          setReturnTo(null);
          navigate(destination);
        }}
        onContinueAsGuest={() => {
          setUserProfile((prev) => ({
            ...prev,
            name: prev.name || 'User',
            loginMethod: prev.loginMethod || 'email',
          }));
          setOnboardingStep('done');
          setReturnTo(null);
          navigate(destination);
        }}
      />
    </div>
  );
}
