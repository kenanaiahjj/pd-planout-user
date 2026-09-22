import React from 'react';
import { Navigate, useParams } from 'react-router';
import { AuthGuard } from '@/app/components/AuthGuard';
import { useAppContext } from '@/app/context/AppContext';
import { buildOrders } from '@/app/pages/OrdersPage';
import { getGuestQrDestination } from '@/app/data/navigation.js';

/** Resolve the legacy Passport Guest QR URL to its current order entry. */
export function StubRoute() {
  const { entryId } = useParams();
  const context = useAppContext();
  const destination = getGuestQrDestination(entryId, buildOrders(context));
  return <AuthGuard><Navigate to={destination} replace /></AuthGuard>;
}
