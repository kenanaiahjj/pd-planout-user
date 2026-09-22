import React from 'react';
import { useNavigate } from 'react-router';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';

export function NotFoundRoute() {
  const navigate = useNavigate();
  return (
    <section className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-[26px] font-semibold text-[#181d27]">Page not found</h1>
      <p className="text-[14px] text-[#64748b]">This link is no longer available.</p>
      <div className="mt-2 flex gap-2">
        <PrimaryButton onClick={() => navigate('/')}>Go to Home</PrimaryButton>
        <SecondaryButton onClick={() => navigate('/events')}>Browse events</SecondaryButton>
      </div>
    </section>
  );
}
