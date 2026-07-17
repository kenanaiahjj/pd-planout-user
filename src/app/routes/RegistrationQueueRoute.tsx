import React from 'react';
import { Navigate, useSearchParams } from 'react-router';
import { AuthGuard } from '@/app/components/AuthGuard';

export function RegistrationQueueRoute() {
  const [searchParams] = useSearchParams();
  const nextParams = new URLSearchParams(searchParams);
  nextParams.set('focus', 'forms');

  return (
    <AuthGuard>
      <Navigate to={`/passport/events?${nextParams.toString()}`} replace />
    </AuthGuard>
  );
}
