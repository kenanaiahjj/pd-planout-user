/**
 * @file MyAccountPage.tsx
 * @description Dedicated account management page with a 3-tab layout:
 *  Account, Preferences, Certificates.
 *
 * Extracted from SettingsPage so Settings remains a clean hub/menu page.
 */

import React, { useState, useRef, useEffect } from 'react';
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
import { SegmentedChoice } from '@/app/components/SegmentedChoice';

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
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#181d27] leading-none tracking-tight">
            My Account
          </h1>
          <p className="text-[#94a3b8] text-[13px] tracking-[-0.15px]">
            Manage your profile and preferences.
          </p>
        </div>
      </div>

      <SegmentedChoice
        value={activeTab}
        onChange={setActiveTab}
        options={TABS}
        columnsClass="grid-cols-3 max-w-[420px]"
        className="mb-2"
        size="sm"
        wrapLabels
      />

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'certificates' && <CertificatesTab />}
      </div>
    </div>
  );
}
