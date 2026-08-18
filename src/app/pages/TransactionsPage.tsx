/**
 * @file TransactionsPage.tsx
 * @description Standalone transactions page accessed from Settings > Transactions.
 * Wraps the TransactionsTab component with a page header and back navigation.
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TransactionsTab } from '@/app/components/settings/TransactionsTab';
import { IconButton } from '@/app/components/IconButton';

interface TransactionsPageProps {
  onBack: () => void;
}

export function TransactionsPage({ onBack }: TransactionsPageProps) {
  return (
    <div className="transactions-page-shell mx-auto flex w-full max-w-[680px] flex-col gap-7 px-4 pb-6 sm:px-6">
      {/* Header */}
      <header className="flex items-start gap-3">
        <IconButton onClick={onBack} aria-label="Go back" tone="neutral" className="mt-0.5 h-11 w-11">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </IconButton>
        <div>
          <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.03em] text-slate-950">Transactions</h1>
          <p className="mt-1 max-w-[560px] text-[13px] leading-5 text-slate-500">
            Charges, payment sessions, and receipts.
          </p>
        </div>
      </header>

      {/* Content */}
      <TransactionsTab />
    </div>
  );
}
