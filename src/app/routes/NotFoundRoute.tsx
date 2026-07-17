/**
 * Catch-all 404 route — redirects to the home page.
 */
import React from 'react';
import { Navigate } from 'react-router';

export function NotFoundRoute() {
  return <Navigate to="/" replace />;
}
