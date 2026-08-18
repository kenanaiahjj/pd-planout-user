/**
 * @file MyAccountPage.tsx
 * @description Dedicated account management page with a 3-tab layout:
 *  Account, Preferences, Certificates.
 *
 * Extracted from SettingsPage so Settings remains a clean hub/menu page.
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Settings2,
  Award,
} from 'lucide-react';

// Tab content components
import { AccountTab } from '@/app/components/settings/AccountTab';
import { PreferencesTab } from '@/app/components/settings/PreferencesTab';
import { CertificatesTab } from '@/app/components/settings/CertificatesTab';
import { IconButton } from '@/app/components/IconButton';

// ---------------------------------------------------------------------------
// Tab definition
// ---------------------------------------------------------------------------

type AccountSettingsTab = 'account' | 'preferences' | 'certificates';

const TABS = [
  { value: 'account', label: 'Account', icon: User },
  { value: 'preferences', label: 'Preferences', icon: Settings2 },
  { value: 'certificates', label: 'Certificates', icon: Award },
] satisfies Array<{ value: AccountSettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MyAccountPageProps {
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MyAccountPage({ onBack }: MyAccountPageProps) {
  const [activeTab, setActiveTab] = useState<AccountSettingsTab>('account');

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-7 px-4 pb-6 sm:px-6">
      {/* Header */}
      <header className="flex items-start gap-3">
        <IconButton onClick={onBack} aria-label="Go back" tone="neutral" className="mt-0.5 h-11 w-11">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </IconButton>
        <div>
          <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.03em] text-slate-950">My Account</h1>
          <p className="mt-1 text-[13px] leading-5 text-slate-500">Profile, preferences, and certificates.</p>
        </div>
      </header>

      <nav className="account-settings-tabs -mb-1 flex w-full overflow-x-auto border-b border-slate-200/80" aria-label="Account settings">
        {TABS.map(({ value, label, icon: Icon }) => {
          const isActive = activeTab === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#177564]/35 sm:flex-none sm:px-4 sm:text-[14px] ${
                isActive
                  ? 'border-[#177564] text-slate-950'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'certificates' && <CertificatesTab />}
      </div>
    </div>
  );
}
