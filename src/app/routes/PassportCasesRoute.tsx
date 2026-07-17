/**
 * Route wrapper for the Passport cases showcase page.
 * Unauthenticated — accessible directly via URL.
 */
import React from 'react';
import { PassportCasesPage } from '@/app/pages/PassportCasesPage';

export function PassportCasesRoute() {
  return <PassportCasesPage />;
}
