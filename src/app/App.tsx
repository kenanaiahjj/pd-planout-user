/**
 * @file App.tsx
 * @description Root entry point for PlanOut Sports.
 *
 * AppProvider wraps RouterProvider so that ALL route components
 * (including layout routes) always have access to shared context,
 * even during HMR refresh cycles.
 *
 * The route tree is defined in `/src/app/router.tsx`.
 * The persistent layout shell (header, footer, bottom nav, drawers, modals)
 * is in `/src/app/layouts/RootLayout.tsx`.
 */

import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}