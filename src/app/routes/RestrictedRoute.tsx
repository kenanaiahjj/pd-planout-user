/**
 * @file RestrictedRoute.tsx
 * @description Route wrapper for the /exclusive restricted access page.
 * Rendered standalone — outside RootLayout — so it has no app chrome.
 */
import React from 'react';
import { RestrictedPage } from '@/app/pages/RestrictedPage';

export function RestrictedRoute() {
  return <RestrictedPage />;
}
