/**
 * @file PreferencesTab.tsx
 * @description Preferences tab — notification toggles, privacy settings,
 * and language & region configuration.
 */
import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Newspaper,
  Eye,
  Globe,
  Check,
  ChevronDown,
} from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';

// --- Toggle Switch ---
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[44px] h-[24px] rounded-full transition-all duration-200 shrink-0 active:scale-95 ${
        enabled ? 'bg-[#177564] shadow-[0_2px_8px_rgba(23,117,100,0.2)]' : 'bg-slate-200'
      }`}
    >
      <div
        className={`absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-[0_2px_4px_rgba(15,23,42,0.1)] transition-transform duration-200 ${
          enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 flex flex-col gap-5 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
      {children}
    </div>
  );
}

function ToggleRow({
  icon,
  iconColor,
  iconBg,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="flex-1 min-w-0">
        <p className="text-[#181d27] text-[14px] font-semibold">{label}</p>
        <p className="text-[#94a3b8] text-[13px] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

export function PreferencesTab() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [eventReminders, setEventReminders] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Notifications */}
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fef2f2] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div>
            <h3 className="text-[#181d27] text-[16px] font-semibold">Notifications</h3>
            <p className="text-[#94a3b8] text-[13px]">Manage how you receive notifications about events and updates.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 divide-y divide-[#f3f4f6]">
          <ToggleRow
            icon={<Mail className="w-4 h-4" />}
            label="Email Notifications"
            description="Receive email updates about events you're interested in"
            enabled={emailNotifs}
            onToggle={() => setEmailNotifs(!emailNotifs)}
          />
          <div className="pt-4">
            <ToggleRow
              icon={<Smartphone className="w-4 h-4" />}
              label="SMS Notifications"
              description="Get text messages for urgent event updates"
              enabled={smsNotifs}
              onToggle={() => setSmsNotifs(!smsNotifs)}
            />
          </div>
          <div className="pt-4">
            <ToggleRow
              icon={<Bell className="w-4 h-4" />}
              label="Event Reminders"
              description="Receive reminders for events you've registered for"
              enabled={eventReminders}
              onToggle={() => setEventReminders(!eventReminders)}
            />
          </div>
          <div className="pt-4">
            <ToggleRow
              icon={<Newspaper className="w-4 h-4" />}
              label="Newsletter Subscription"
              description="Stay updated with PlanOut's monthly newsletter"
              enabled={newsletter}
              onToggle={() => setNewsletter(!newsletter)}
            />
          </div>
        </div>
      </SectionCard>

      {/* Privacy */}
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#def2ee] flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4 text-[#177564]" />
          </div>
          <div>
            <h3 className="text-[#181d27] text-[16px] font-semibold">Privacy</h3>
            <p className="text-[#94a3b8] text-[13px]">Control who can see your profile and event activity.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setPrivacy('public')}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.005] ${
              privacy === 'public'
                ? 'border-[#177564] bg-[#f0fdf9]/60 backdrop-blur-sm shadow-[0_4px_16px_rgba(23,117,100,0.03)]'
                : 'border-slate-200/80 bg-white hover:border-slate-350 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#181d27] text-[14px] font-semibold">Public</p>
                <p className="text-[#94a3b8] text-[13px] mt-0.5">Anyone can see your profile and event activity</p>
              </div>
              {privacy === 'public' && (
                <div className="w-5 h-5 rounded-full bg-[#177564] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(23,117,100,0.2)]">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => setPrivacy('private')}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.005] ${
              privacy === 'private'
                ? 'border-[#177564] bg-[#f0fdf9]/60 backdrop-blur-sm shadow-[0_4px_16px_rgba(23,117,100,0.03)]'
                : 'border-slate-200/80 bg-white hover:border-slate-350 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#181d27] text-[14px] font-semibold">Private</p>
                <p className="text-[#94a3b8] text-[13px] mt-0.5">Only you can see your profile and event history</p>
              </div>
              {privacy === 'private' && (
                <div className="w-5 h-5 rounded-full bg-[#177564] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(23,117,100,0.2)]">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </button>
        </div>
      </SectionCard>

      {/* Language & Region */}
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ecfeff] flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <div>
            <h3 className="text-[#181d27] text-[16px] font-semibold">Language & Region</h3>
            <p className="text-[#94a3b8] text-[13px]">Set your preferred language and region settings.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="preferred-language" className="text-[#414651] text-[13px] font-semibold">Preferred Language</label>
          <div className="relative">
            <select
              id="preferred-language"
              autoComplete="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200/80 rounded-full px-4 py-2.5 pr-10 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#177564]/10 focus:border-[#177564] transition-all shadow-sm cursor-pointer"
            >
              <option>English</option>
              <option>Filipino</option>
              <option>Cebuano</option>
              <option>Spanish</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
          </div>
        </div>
      </SectionCard>

      {/* Save */}
      <div>
        <PrimaryButton onClick={handleSave}>
          <Check className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Preferences'}
        </PrimaryButton>
      </div>
    </div>
  );
}
