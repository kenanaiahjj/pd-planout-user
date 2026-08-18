/**
 * @file ApplyOrganizerModal.tsx
 * @description Shared modal for applying as an event organizer.
 * Used in both SettingsPage and CheckoutPage confirmation.
 */
import React, { useState } from 'react';
import { Building2, Check, X } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { IconButton } from './IconButton';
import { useAppContext } from '@/app/context/AppContext';

const ORG_TYPES = [
  'Running Club',
  'Sports League',
  'Fitness Studio',
  'Event Company',
  'Community Group',
  'Other',
];

interface ApplyOrganizerModalProps {
  onClose: () => void;
}

export function ApplyOrganizerModal({ onClose }: ApplyOrganizerModalProps) {
  const { setPendingOrgApplication } = useAppContext();
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-[16px] w-full max-w-[420px] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#def2ee] flex items-center justify-center">
              <Check className="w-8 h-8 text-[#177564]" />
            </div>
            <h3 className="text-[#181d27] text-[20px] font-semibold tracking-tight">
              Application Submitted!
            </h3>
            <p className="text-[#64748b] text-sm leading-relaxed">
              We'll review your application and get back to you within 2-3 business days. You'll
              receive a notification once approved.
            </p>
            <PrimaryButton onClick={onClose} fullWidth className="mt-2 py-3">
              Got It
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-[20px] sm:rounded-[16px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 fade-in duration-300">
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#e2e8f0]" />
        </div>
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#def2ee] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#177564]" />
            </div>
            <div>
              <h3 className="text-[#181d27] text-[18px] font-semibold tracking-tight">
                Apply as Organizer
              </h3>
              <p className="text-[#94a3b8] text-[12px]">Create your organization page</p>
            </div>
          </div>
          <IconButton
            onClick={onClose}
            aria-label="Close organizer application"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>
        <div className="px-5 sm:px-6 pb-6 flex flex-col gap-5">
          <div className="bg-[#f0fdf9] rounded-[10px] p-4 flex flex-col gap-2.5">
            <p className="text-[#177564] text-[13px] font-semibold">As an organizer, you can:</p>
            {[
              'Create and manage events',
              'Sell tickets and track registrations',
              'Build your community of athletes',
              'Access analytics and insights',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#177564] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-[#364153] text-[13px]">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#414651] text-sm font-medium">
                Organization Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                autoComplete="organization"
                enterKeyHint="done"
                aria-label="Organization name"
                placeholder="e.g. Metro Manila Runners"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-white border border-[#d5d7da] rounded-[8px] px-3.5 py-2.5 text-[#181d27] text-sm placeholder:text-[rgba(24,29,39,0.5)] focus:outline-none focus:ring-2 focus:ring-[#177564]/20 focus:border-[#177564] transition-all shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#414651] text-sm font-medium">
                Organization Type <span className="text-[#ef4444]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ORG_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrgType(type)}
                    className={`px-3 py-2 rounded-[8px] text-[13px] font-medium border transition-all ${
                      orgType === type
                        ? 'bg-[#def2ee] border-[#177564] text-[#177564]'
                        : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#177564]/40'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <PrimaryButton
            onClick={() => {
              setPendingOrgApplication({
                orgName: orgName.trim(),
                orgType,
                submittedAt: new Date().toISOString(),
              });
              setSubmitted(true);
            }}
            fullWidth
            className="py-3"
            disabled={!orgName.trim() || !orgType}
          >
            Submit Application
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
