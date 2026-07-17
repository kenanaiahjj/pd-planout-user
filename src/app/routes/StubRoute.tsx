import React from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';

export function StubRoute() {
  return (
    <AuthGuard>
      {null}
    </AuthGuard>
  );
}
