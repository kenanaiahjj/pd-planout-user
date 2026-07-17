import React from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';
import { LeadTransferPage } from '@/app/pages/LeadTransferPage';

export function LeadTransferRoute() {
  return (
    <AuthGuard>
      <LeadTransferPage />
    </AuthGuard>
  );
}
