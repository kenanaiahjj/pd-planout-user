/**
 * Route wrapper for the Orders page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { OrdersPage } from '@/app/pages/OrdersPage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function OrdersRoute() {
  return (
    <AuthGuard>
      <OrdersPage />
    </AuthGuard>
  );
}
