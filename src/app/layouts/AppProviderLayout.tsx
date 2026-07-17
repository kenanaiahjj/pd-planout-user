/**
 * @file AppProviderLayout.tsx
 * @description Root route layout that renders global utilities (Toaster,
 * IOSKeyboard) alongside the router Outlet.
 *
 * AppProvider now lives in App.tsx above the router, so this layout
 * no longer wraps children in a provider — it's just a passthrough
 * for global UI elements.
 */

import React from 'react';
import { Outlet, useRouteError, isRouteErrorResponse } from 'react-router';
import { IOSKeyboard } from '@/app/components/IOSKeyboard';
import { Toaster } from 'sonner';

// ---------------------------------------------------------------------------
// Error Boundary — context is always available because AppProvider is in App.tsx
// ---------------------------------------------------------------------------
export function RootErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-[400px] rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_16px_36px_0px_rgba(0,0,0,0.06)] text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fef2f2] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-[18px] text-[#181d27] tracking-[-0.36px] mb-2">Something went wrong</h2>
        <p className="text-[14px] text-[#64748b] leading-[1.5] mb-5">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-[8px] px-4 py-[10px] text-[14px] text-white cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
          style={{ backgroundImage: 'linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)' }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export function AppProviderLayout() {
  return (
    <>
      <Outlet />
      {/* iOS keyboard simulation for desktop mobile previews only.
          Real touch devices keep their native keyboard. */}
      <IOSKeyboard />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#181d27',
            border: '1px solid #def2ee',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            padding: '14px 16px',
            boxShadow: '0px 16px 36px 0px rgba(0,0,0,0.06), 0px 0px 0px 1px rgba(23,117,100,0.08)',
            gap: '12px',
          },
          classNames: {
            title: 'text-[#181d27] font-semibold text-[13px]',
            description: 'text-[#64748b] text-[12px] mt-0.5',
            icon: 'text-[#177564]',
          },
        }}
      />
    </>
  );
}
