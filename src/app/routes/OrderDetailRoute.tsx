import React from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';
import { OrderDetailPage } from '@/app/pages/OrdersPage';

export function OrderDetailRoute() {
  return (
    <AuthGuard>
      <OrderDetailPage />
    </AuthGuard>
  );
}
