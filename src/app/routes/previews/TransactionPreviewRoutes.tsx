/**
 * Preview routes for Transaction Detail pages — one per status.
 *  /settings/transactions/AAA-QZCJU2  →  Completed
 *  /settings/transactions/AAA-L4DJYC  →  Pending
 *  /settings/transactions/AAA-T8KZMW  →  Expired
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { AuthGuard } from '@/app/components/AuthGuard';
import { TransactionDetailPage } from '@/app/pages/TransactionDetailPage';
import type { Transaction } from '@/app/pages/TransactionDetailPage';

const TXN_COMPLETED: Transaction = {
  id: 'AAA-QZCJU2',
  date: 'Mar 24, 2026',
  events: [{ name: 'Canlaon Marathon 2026', tickets: 1, ticketType: 'Straight', price: 1.0 }],
  paymentMethod: 'GCash ****4532',
  amount: 1.0,
  status: 'Completed',
};

const TXN_PENDING: Transaction = {
  id: 'AAA-L4DJYC',
  date: 'Feb 14, 2026',
  events: [{ name: 'Adventure Sports Festival', tickets: 1, ticketType: 'VIP', price: 550.0 }],
  paymentMethod: 'Visa ****4532',
  amount: 550.0,
  status: 'Pending',
};

const TXN_EXPIRED: Transaction = {
  id: 'AAA-T8KZMW',
  date: 'Jan 30, 2026',
  events: [
    { name: 'Bacolod Cycling Challenge', tickets: 2, ticketType: 'Standard', price: 400.0 },
  ],
  paymentMethod: 'GCash ****4532',
  amount: 800.0,
  status: 'Expired',
};

function TxnPreview({ txn }: { txn: Transaction }) {
  const navigate = useNavigate();
  return (
    <AuthGuard>
      <TransactionDetailPage txn={txn} onBack={() => navigate('/settings/transactions')} />
    </AuthGuard>
  );
}

export function TransactionCompletedPreviewRoute() {
  return <TxnPreview txn={TXN_COMPLETED} />;
}

export function TransactionPendingPreviewRoute() {
  return <TxnPreview txn={TXN_PENDING} />;
}

export function TransactionExpiredPreviewRoute() {
  return <TxnPreview txn={TXN_EXPIRED} />;
}
