/**
 * Route wrapper for the Transactions page.
 * Auth-guarded — redirects to login if not authenticated.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { TransactionsPage } from '@/app/pages/TransactionsPage';
import { AuthGuard } from '@/app/components/AuthGuard';

export function TransactionsRoute() {
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <TransactionsPage onBack={() => navigate('/settings')} />
    </AuthGuard>
  );
}
