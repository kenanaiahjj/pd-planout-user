/**
 * @file SettingsPage.tsx
 * @description User settings hub with profile card, organizations switcher,
 * navigation to My Account page, support links and sign-out.
 */
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Info,
  Plus,
  Check,
  Users,
  ArrowRightLeft,
  Crown,
  Star,
  Inbox,
  Receipt,
  Clock,
  Loader2,
  LayoutList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ConfirmDialog } from './ConfirmDialog';
import { IconButton } from './IconButton';
import { useAppContext } from '@/app/context/AppContext';
import imgLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';

// ---------------------------------------------------------------------------
// Organizations data & types
// ---------------------------------------------------------------------------

interface Organization {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  avatar: string;
  initials: string;
  accentColor: string;
  memberCount: number;
  eventCount: number;
  verified: boolean;
}

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Manila Running Club',
    role: 'owner',
    avatar:
      'https://images.unsplash.com/photo-1714962962355-1035a90cb7d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMGV2ZW50JTIwb3JnYW5pemVyJTIwZ3JvdXB8ZW58MXx8fHwxNzcwODg4MDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    initials: 'MR',
    accentColor: '#177564',
    memberCount: 1240,
    eventCount: 18,
    verified: true,
  },
  {
    id: 'org-2',
    name: 'TriSport PH',
    role: 'admin',
    avatar:
      'https://images.unsplash.com/photo-1633114069176-8632494e6f4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlhdGhsb24lMjBzcG9ydHMlMjBvcmdhbml6YXRpb258ZW58MXx8fHwxNzcwODg4MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    initials: 'TS',
    accentColor: '#3b82f6',
    memberCount: 560,
    eventCount: 7,
    verified: true,
  },
  {
    id: 'org-3',
    name: 'BGC Fitness Community',
    role: 'member',
    avatar:
      'https://images.unsplash.com/photo-1765607081473-8b44507dfdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaXRuZXNzJTIwY29tbXVuaXR5JTIwdGVhbXxlbnwxfHx8fDE3NzA4ODgwOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    initials: 'BF',
    accentColor: '#8b5cf6',
    memberCount: 320,
    eventCount: 4,
    verified: false,
  },
];

const ROLE_CONFIG: Record<
  Organization['role'],
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  owner: {
    label: 'Owner',
    color: 'text-[#b45309]',
    bg: 'bg-[#fffbeb] border-[#fde68a]',
    icon: <Crown className="w-3 h-3" />,
  },
  admin: {
    label: 'Admin',
    color: 'text-[#1d4ed8]',
    bg: 'bg-[#eff6ff] border-[#bfdbfe]',
    icon: <Star className="w-3 h-3" />,
  },
  member: {
    label: 'Member',
    color: 'text-[#4b5563]',
    bg: 'bg-[#f3f4f6] border-[#e5e7eb]',
    icon: <Users className="w-3 h-3" />,
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function OrgCard({
  org,
  isActive,
  onSwitch,
}: {
  org: Organization;
  isActive: boolean;
  onSwitch: () => void;
}) {
  const role = ROLE_CONFIG[org.role];
  return (
    <div
      className={`relative flex items-center gap-3 px-3.5 py-3.5 transition-colors ${
        isActive ? 'bg-[#f0fdf9]' : 'hover:bg-[#f8fafc]'
      }`}
    >
      <div className="relative w-10 h-10 rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
        <ImageWithFallback src={org.avatar} alt={org.name} className="w-full h-full object-cover" />
        {isActive && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#177564] border-2 border-white flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[#181d27] text-[14px] font-semibold truncate">{org.name}</p>
          {org.verified && (
            <svg className="w-3.5 h-3.5 text-[#177564] shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.3 1.1a1 1 0 011.4 0l1.1 1.1a1 1 0 00.6.3l1.5.2a1 1 0 01.9.9l.2 1.5a1 1 0 00.3.6l1.1 1a1 1 0 010 1.5l-1.1 1a1 1 0 00-.3.7l-.2 1.5a1 1 0 01-.9.8l-1.5.2a1 1 0 00-.6.3l-1.1 1.1a1 1 0 01-1.4 0l-1.1-1.1a1 1 0 00-.6-.3l-1.5-.2a1 1 0 01-.9-.8l-.2-1.5a1 1 0 00-.3-.7l-1-1a1 1 0 010-1.5l1-1a1 1 0 00.3-.6l.2-1.5a1 1 0 01.9-.9l1.5-.2a1 1 0 00.6-.3L7.3 1.1zM11 6.3a.5.5 0 10-.7-.7L7 8.8 5.7 7.5a.5.5 0 10-.7.7l2 2L11 6.4z" />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${role.bg} ${role.color}`}
          >
            {role.icon}
            {role.label}
          </span>
          <span className="text-[#94a3b8] text-[11px]">{org.eventCount} events</span>
        </div>
      </div>
      {isActive ? (
        <span className="px-2.5 py-1 bg-[#def2ee] text-[#177564] text-[11px] font-bold rounded-full shrink-0">
          Active
        </span>
      ) : (
        <button
          onClick={onSwitch}
          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#e2e8f0] text-[#64748b] text-[11px] font-semibold rounded-full hover:border-[#177564] hover:text-[#177564] transition-colors shrink-0"
        >
          <ArrowRightLeft className="w-3 h-3" />
          Switch
        </button>
      )}
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[#94a3b8] text-[11px] font-semibold uppercase tracking-[0.8px] px-1 mb-1">
        {title}
      </p>
      <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden divide-y divide-[#f3f4f6]">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({
  icon,
  iconBg,
  label,
  value,
  onClick,
  trailing,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-[#f8fafc] transition-colors"
    >
      <div
        className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#181d27] text-[14px] font-medium truncate">{label}</p>
        {value && <p className="text-[#94a3b8] text-[12px] truncate mt-0.5">{value}</p>}
      </div>
      {trailing || <ChevronRight className="w-4 h-4 text-[#cbd5e1] shrink-0" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Settings Page
// ---------------------------------------------------------------------------

export function SettingsPage({ onBack, onGoToMyAccount, onGoToInbox, onGoToProfile, onGoToApplyOrganizer, onGoToTransactions, onGoToPassportCases, onSignOut, userName }: { onBack: () => void; onGoToMyAccount?: () => void; onGoToInbox?: () => void; onGoToProfile?: () => void; onGoToApplyOrganizer?: () => void; onGoToTransactions?: () => void; onGoToPassportCases?: () => void; onSignOut?: () => void; userName?: string }) {
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchingToOrgId, setSwitchingToOrgId] = useState<string | null>(null);

  const handleSwitchOrg = (orgId: string | null) => {
    setSwitchingToOrgId(orgId);
    setIsSwitching(true);
    setTimeout(() => {
      setActiveOrgId(orgId);
      setIsSwitching(false);
      setSwitchingToOrgId(null);
    }, 1200);
  };

  const { pendingOrgApplication } = useAppContext();
  const displayName = userName || 'Jessica Sanchez';
  const initials = displayName.split(' ').map((w: string) => w.charAt(0)).join('').slice(0, 2).toUpperCase() || 'JS';

  return (
    <>
      <AnimatePresence>
        {isSwitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="relative flex items-center justify-center w-20 h-20">
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-[3px] border-[#177564]/10 border-t-[#177564]"
                />
                {/* Inner logo pulsing */}
                <motion.div
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(23,117,100,0.15)]"
                >
                  <img src={imgLogo} alt="PlanOut" className="w-8 h-8 object-cover ml-0.5" />
                </motion.div>
              </div>
              <div className="text-center">
                <p className="text-[#181d27] text-[16px] font-semibold">
                  Switching account
                </p>
                <p className="text-[#64748b] text-[13px] mt-1">
                  {switchingToOrgId
                    ? `Connecting to ${MOCK_ORGANIZATIONS.find(o => o.id === switchingToOrgId)?.name}...`
                    : 'Returning to Personal Account...'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconButton
          onClick={onBack}
          aria-label="Go back"
          tone="brand"
        >
          <ArrowLeft className="w-4 h-4" />
        </IconButton>
        <div>
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#181d27] leading-none tracking-tight">
            Settings
          </h1>
          <p className="text-[#94a3b8] text-[13px] mt-1 hidden sm:block">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {/* Profile card — shows current context (personal or org) */}
      {activeOrgId ? (
        (() => {
          const org = MOCK_ORGANIZATIONS.find((o) => o.id === activeOrgId)!;
          const role = ROLE_CONFIG[org.role];
          return (
            <div className="bg-white rounded-[12px] border border-[#177564]/20 p-3.5 flex items-center gap-3 ring-1 ring-[#177564]/10">
              <div className="relative w-10 h-10 rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                <ImageWithFallback
                  src={org.avatar}
                  alt={org.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[#181d27] text-[14px] font-semibold truncate">{org.name}</p>
                  {org.verified && (
                    <svg
                      className="w-3.5 h-3.5 text-[#177564] shrink-0"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M7.3 1.1a1 1 0 011.4 0l1.1 1.1a1 1 0 00.6.3l1.5.2a1 1 0 01.9.9l.2 1.5a1 1 0 00.3.6l1.1 1a1 1 0 010 1.5l-1.1 1a1 1 0 00-.3.7l-.2 1.5a1 1 0 01-.9.8l-1.5.2a1 1 0 00-.6.3l-1.1 1.1a1 1 0 01-1.4 0l-1.1-1.1a1 1 0 00-.6-.3l-1.5-.2a1 1 0 01-.9-.8l-.2-1.5a1 1 0 00-.3-.7l-1-1a1 1 0 010-1.5l1-1a1 1 0 00.3-.6l.2-1.5a1 1 0 01.9-.9l1.5-.2a1 1 0 00.6-.3L7.3 1.1zM11 6.3a.5.5 0 10-.7-.7L7 8.8 5.7 7.5a.5.5 0 10-.7.7l2 2L11 6.4z" />
                    </svg>
                  )}
                </div>
                <p className="text-[#94a3b8] text-[12px] truncate">
                  Managing as <span className={`font-semibold ${role.color}`}>{role.label}</span>
                </p>
              </div>
              <button
                onClick={() => handleSwitchOrg(null)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f3f4f6] text-[#64748b] text-[11px] font-semibold rounded-full hover:bg-[#e2e8f0] transition-colors shrink-0"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Personal
              </button>
            </div>
          );
        })()
      ) : (
        <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden">
          <button
            onClick={onGoToProfile}
            className="w-full p-3.5 flex items-center gap-3 hover:bg-[#f8fafc] transition-colors text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#177564] to-[#21a58d] flex items-center justify-center text-white text-[14px] font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#181d27] text-[14px] font-semibold truncate">{displayName}</p>
              <p className="text-[#94a3b8] text-[12px] truncate">Personal Account</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#cbd5e1] shrink-0" />
          </button>

          {/* Quick switch to last used organization */}
          {MOCK_ORGANIZATIONS.length > 0 && (() => {
            const lastOrg = MOCK_ORGANIZATIONS[0];
            const orgRole = ROLE_CONFIG[lastOrg.role];
            return (
              <>
                <div className="h-px bg-[#f1f5f9] mx-3.5" />
                <button
                  onClick={() => handleSwitchOrg(lastOrg.id)}
                  className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-[#f8fafc] transition-colors group cursor-pointer"
                >
                  <div className="relative w-7 h-7 rounded-[7px] overflow-hidden shrink-0 bg-gray-100">
                    <ImageWithFallback
                      src={lastOrg.avatar}
                      alt={lastOrg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[#45556c] text-[12px] font-medium truncate">
                        Switch to {lastOrg.name}
                      </p>
                      {lastOrg.verified && (
                        <svg className="w-3 h-3 text-[#177564] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M7.3 1.1a1 1 0 011.4 0l1.1 1.1a1 1 0 00.6.3l1.5.2a1 1 0 01.9.9l.2 1.5a1 1 0 00.3.6l1.1 1a1 1 0 010 1.5l-1.1 1a1 1 0 00-.3.7l-.2 1.5a1 1 0 01-.9.8l-1.5.2a1 1 0 00-.6.3l-1.1 1.1a1 1 0 01-1.4 0l-1.1-1.1a1 1 0 00-.6-.3l-1.5-.2a1 1 0 01-.9-.8l-.2-1.5a1 1 0 00-.3-.7l-1-1a1 1 0 010-1.5l1-1a1 1 0 00.3-.6l.2-1.5a1 1 0 01.9-.9l1.5-.2a1 1 0 00.6-.3L7.3 1.1zM11 6.3a.5.5 0 10-.7-.7L7 8.8 5.7 7.5a.5.5 0 10-.7.7l2 2L11 6.4z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-px rounded-full text-[10px] font-semibold border ${orgRole.bg} ${orgRole.color}`}>
                      {orgRole.icon}
                      {orgRole.label}
                    </span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#cbd5e1] group-hover:text-[#177564] transition-colors" />
                  </div>
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* ---- My Account Navigation ---- */}
      <SettingsSection title="General">
        <SettingsRow
          icon={<User className="w-4 h-4 text-[#177564]" />}
          iconBg="bg-[#def2ee]"
          label="My Account"
          value="Profile, preferences & certificates"
          onClick={onGoToMyAccount}
        />

        <SettingsRow
          icon={<Receipt className="w-4 h-4 text-[#177564]" />}
          iconBg="bg-[#def2ee]"
          label="Transactions"
          value="Payment ledger & receipts"
          onClick={onGoToTransactions}
        />
        <SettingsRow
          icon={<Inbox className="w-4 h-4 text-[#7d8490]" />}
          iconBg="bg-[#f3f4f6]"
          label="Inbox"
          value="Invitations, promotions & updates"
          onClick={onGoToInbox}
        />
      </SettingsSection>

      {/* ---- Organizations Section ---- */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <p className="text-[#94a3b8] text-[11px] font-semibold uppercase tracking-[0.8px]">
            Organizations
          </p>
          <span className="text-[#94a3b8] text-[11px]">
            {MOCK_ORGANIZATIONS.length} org{MOCK_ORGANIZATIONS.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="bg-white rounded-[12px] border border-[#e2e8f0] overflow-hidden">
          {/* Personal account row */}
          <div
            className={`flex items-center gap-3 px-3.5 py-3.5 border-b border-[#f3f4f6] transition-colors ${
              !activeOrgId ? 'bg-[#f0fdf9]' : 'hover:bg-[#f8fafc]'
            }`}
          >
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#177564] to-[#21a58d] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
              {initials}
              {!activeOrgId && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#177564] border-2 border-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#181d27] text-[14px] font-semibold truncate">{displayName}</p>
              <p className="text-[#94a3b8] text-[11px]">Personal Account</p>
            </div>
            {!activeOrgId ? (
              <span className="px-2.5 py-1 bg-[#def2ee] text-[#177564] text-[11px] font-bold rounded-full shrink-0">
                Active
              </span>
            ) : (
              <button
                onClick={() => handleSwitchOrg(null)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#e2e8f0] text-[#64748b] text-[11px] font-semibold rounded-full hover:border-[#177564] hover:text-[#177564] transition-colors shrink-0"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Switch
              </button>
            )}
          </div>

          {/* Org list */}
          {MOCK_ORGANIZATIONS.map((org) => (
            <div key={org.id} className="border-b border-[#f3f4f6] last:border-b-0">
              <OrgCard
                org={org}
                isActive={activeOrgId === org.id}
                onSwitch={() => handleSwitchOrg(org.id)}
              />
            </div>
          ))}

          {/* Pending org application */}
          {pendingOrgApplication && (
            <div className="border-b border-[#f3f4f6]">
              <div className="flex items-center gap-3 px-3.5 py-3.5 bg-[#fffbeb]/40">
                <div className="relative w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/10 border border-[#fde68a] flex items-center justify-center shrink-0">
                  <span className="text-[#b45309] text-[13px] font-bold">
                    {pendingOrgApplication.orgName.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#181d27] text-[14px] font-semibold truncate">{pendingOrgApplication.orgName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border bg-[#fffbeb] border-[#fde68a] text-[#b45309] shrink-0 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      Under Review
                    </span>
                    <span className="text-[#94a3b8] text-[11px] truncate">
                      Submitted {new Date(pendingOrgApplication.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#fffbeb] text-[#b45309] text-[11px] font-bold rounded-full border border-[#fde68a] shrink-0">
                  Pending
                </span>
              </div>
            </div>
          )}

          {/* Create org */}
          <div className="border-t border-[#e2e8f0] bg-[#fafbfc]">
            <button
              onClick={onGoToApplyOrganizer}
              className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-[#f0fdf9] transition-colors"
            >
              <div className="w-10 h-10 rounded-[10px] border-2 border-dashed border-[#177564]/30 bg-[#f0fdf9] flex items-center justify-center shrink-0">
                <Plus className="w-4.5 h-4.5 text-[#177564]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#177564] text-[14px] font-semibold">Create Organization</p>
                <p className="text-[#94a3b8] text-[12px]">Apply to become an event organizer</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#177564]/40 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* ---- Support & About ---- */}
      <SettingsSection title="Support">
        <SettingsRow
          icon={<HelpCircle className="w-4 h-4 text-[#f59e0b]" />}
          iconBg="bg-[#fffbeb]"
          label="Help Center"
          value="FAQs and support"
        />
        <SettingsRow
          icon={<Shield className="w-4 h-4 text-[#177564]" />}
          iconBg="bg-[#def2ee]"
          label="Privacy Policy"
        />
        <SettingsRow
          icon={<FileText className="w-4 h-4 text-[#64748b]" />}
          iconBg="bg-[#f3f4f6]"
          label="Terms of Service"
        />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsRow
          icon={<Info className="w-4 h-4 text-[#94a3b8]" />}
          iconBg="bg-[#f3f4f6]"
          label="App Version"
          value="1.0.0 (Build 2026.02)"
          trailing={<span className="text-[#94a3b8] text-[12px] font-mono">v1.0.0</span>}
        />
      </SettingsSection>

      {/* ---- Prototype / Stakeholder tools ---- */}
      {onGoToPassportCases && (
        <SettingsSection title="Prototype">
          <SettingsRow
            icon={<LayoutList className="w-4 h-4 text-[#8b5cf6]" />}
            iconBg="bg-[#f5f3ff]"
            label="Passport Cases Board"
            value="All 34 registration & access scenarios"
            onClick={onGoToPassportCases}
          />
        </SettingsSection>
      )}

      {/* Sign Out */}
      <ConfirmDialog
        trigger={
          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px] border border-[#fecaca] bg-[#fef2f2] text-[#dc2626] text-sm font-semibold hover:bg-[#fee2e2] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        }
        title="Sign Out?"
        description="Are you sure you want to sign out? You'll need to log back in to access your account, tickets, and event registrations."
        icon={<LogOut className="w-6 h-6" />}
        iconVariant="destructive"
        confirmLabel="Yes, Sign Out"
        variant="destructive"
        onConfirm={() => onSignOut?.()}
      />

      <div className="h-4" />
    </div>
    </>
  );
}
