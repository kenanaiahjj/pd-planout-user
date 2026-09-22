/**
 * @file AuthGuard.tsx
 * @description Redirects unauthenticated users to /login, preserving the
 * current path in `returnTo` so they come back after logging in.
 */
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAppContext } from '@/app/context/AppContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setReturnTo } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setReturnTo(`${location.pathname}${location.search}${location.hash}`);
    }
  }, [isAuthenticated, location.pathname, location.search, location.hash, setReturnTo]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ returnTo: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  return <>{children}</>;
}
