/**
 * @file TransactionsPage.tsx
 * @description Standalone transactions page accessed from Settings > Transactions.
 * Wraps the TransactionsTab component with a page header and back navigation.
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TransactionsTab } from '@/app/components/settings/TransactionsTab';

interface TransactionsPageProps {
  onBack: () => void;
}

export function TransactionsPage({ onBack }: TransactionsPageProps) {
  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#181d27] leading-none tracking-tight">
            Transactions
          </h1>
          <p className="mt-1 max-w-[560px] text-[#64748b] text-[13px] leading-relaxed tracking-[-0.15px]">
            A payment ledger for charges, pending payment sessions, expired attempts, and receipts.
          </p>
        </div>
      </div>

      {/* Content */}
      <TransactionsTab />
    </div>
  );
}
