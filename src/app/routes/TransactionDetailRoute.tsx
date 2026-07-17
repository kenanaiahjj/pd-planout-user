/**
 * Route wrapper for the Transaction Detail page.
 * Reads :txnId from the URL, looks it up in the shared mock data,
 * and renders the appropriate confirmation state (success / pending / expired).
 */
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { AuthGuard } from '@/app/components/AuthGuard';
import { TransactionDetailPage } from '@/app/pages/TransactionDetailPage';

// ---------------------------------------------------------------------------
// Shared mock data (kept in sync with TransactionsTab mock data)
// ---------------------------------------------------------------------------
const MOCK_TRANSACTIONS = [
  {
    id: 'AAA-QZCJU2',
    date: 'Mar 24, 2026',
    events: [{ name: 'Canlaon Marathon 2026', tickets: 1, ticketType: 'Straight', price: 1.0 }],
    paymentMethod: 'GCash ****4532',
    amount: 1.0,
    status: 'Completed' as const,
  },
  {
    id: 'AAA-HNIQSH',
    date: 'Mar 24, 2026',
    events: [{ name: 'Dumaguete Fun Run', tickets: 1, ticketType: 'Straight', price: 950.0 }],
    paymentMethod: 'Maya ****8821',
    amount: 950.0,
    status: 'Completed' as const,
  },
  {
    id: 'AAA-MK7T3P',
    date: 'Mar 18, 2026',
    events: [
      { name: 'Mountain Hiking Adventure', tickets: 2, ticketType: 'Standard', price: 200.0 },
      { name: 'Adventure Sports Festival', tickets: 1, ticketType: 'VIP', price: 550.0 },
    ],
    paymentMethod: 'Visa ****4532',
    amount: 950.0,
    status: 'Completed' as const,
  },
  {
    id: 'AAA-XR2PLQ',
    date: 'Mar 10, 2026',
    events: [{ name: 'City Marathon Series', tickets: 1, ticketType: 'Early Bird', price: 350.0 }],
    paymentMethod: 'GCash ****4532',
    amount: 350.0,
    status: 'Completed' as const,
  },
  {
    id: 'AAA-9WBVFN',
    date: 'Feb 28, 2026',
    events: [{ name: 'Pickleball Tournament', tickets: 3, ticketType: 'Standard', price: 300.0 }],
    paymentMethod: 'Maya ****8821',
    amount: 900.0,
    status: 'Completed' as const,
  },
  {
    id: 'AAA-L4DJYC',
    date: 'Feb 14, 2026',
    events: [{ name: 'Adventure Sports Festival', tickets: 1, ticketType: 'VIP', price: 550.0 }],
    paymentMethod: 'Visa ****4532',
    amount: 550.0,
    status: 'Pending' as const,
  },
  {
    id: 'AAA-T8KZMW',
    date: 'Jan 30, 2026',
    events: [{ name: 'Bacolod Cycling Challenge', tickets: 2, ticketType: 'Standard', price: 400.0 }],
    paymentMethod: 'GCash ****4532',
    amount: 800.0,
    status: 'Expired' as const,
  },
];

export function TransactionDetailRoute() {
  const { txnId } = useParams<{ txnId: string }>();
  const navigate = useNavigate();

  const txn = MOCK_TRANSACTIONS.find((t) => t.id === txnId);

  if (!txn) return <Navigate to="/settings/transactions" replace />;

  return (
    <AuthGuard>
      <TransactionDetailPage
        txn={txn}
        onBack={() => navigate('/settings/transactions')}
      />
    </AuthGuard>
  );
}
