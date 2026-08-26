import React from 'react';
import { Navigate } from 'react-router';
import { AuthGuard } from '@/app/components/AuthGuard';
import { ORDERS_PENDING_PATH } from '@/app/data/navigation.js';

export function RegistrationQueueRoute() {
  return (
    <AuthGuard>
      <Navigate to={ORDERS_PENDING_PATH} replace />
    </AuthGuard>
  );
}
