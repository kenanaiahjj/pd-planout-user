/**
 * @file SettingsPage.tsx
 * @description Calm settings hub for personal and organization workspaces.
 */
import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  Inbox,
  LayoutList,
  LifeBuoy,
  LogOut,
  Plus,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ConfirmDialog } from './ConfirmDialog';
import { IconButton } from './IconButton';
import { OrganizerContactWidget, type ContactTarget } from './OrganizerContactWidget';
import { useAppContext } from '@/app/context/AppContext';

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

const ROLE_LABEL: Record<Organization['role'], string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

const PLANOUT_SUPPORT_CONTACT: ContactTarget = {
  id: 'planout-support',
  name: 'PlanOut Support',
  email: 'support@planout.ph',
  logoColor: '#177564',
  logoInitials: 'PO',
};

const PLANOUT_SUPPORT_SUGGESTED_TOPICS = [
  'How do I buy tickets?',
  'Where can I find my ticket?',
  'I need help with an order',
  'How do I become an organizer?',
];

const PLANOUT_SUPPORT_SUGGESTED_TOPIC_REPLIES: Record<string, string> = {
  'How do I buy tickets?': 'Open an event and tap Get Tickets. Choose your tickets, complete the participant details, and finish checkout.',
  'Where can I find my ticket?': 'Open Passport to find your QR ticket. You can also open Orders, select the order, and view its QR access.',
  'I need help with an order': 'Open Orders and select the affected order. Share the order number and the issue so support can help with forms, payment, access, or refunds.',
  'How do I become an organizer?': 'Open Settings, tap Create Organization, and submit your organization details for review.',
};

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const sectionId = `settings-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <section className="space-y-2" aria-labelledby={sectionId}>
      <h2 id={sectionId} className="px-1 text-[13px] font-medium text-slate-500">
        {title}
      </h2>
      <div className="overflow-hidden rounded-[14px] border border-slate-200/80 bg-white divide-y divide-slate-200/70">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
  trailing,
  tone = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  tone?: 'default' | 'accent';
}) {
  const RowTag = onClick ? 'button' : 'div';
  const rowProps = onClick ? { type: 'button' as const, onClick } : {};

  return (
    <RowTag
      {...rowProps}
      className={`group flex min-h-[44px] w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
        onClick ? 'cursor-pointer hover:bg-slate-50 active:bg-slate-100' : ''
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#177564]/35`}
    >
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center ${
          tone === 'accent' ? 'text-[#177564]' : 'text-slate-500'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium leading-5 text-slate-900">
          {label}
        </span>
        {value && <span className="mt-0.5 block truncate text-[12px] leading-4 text-slate-500">{value}</span>}
      </span>
      {trailing || (onClick ? <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-300" /> : null)}
    </RowTag>
  );
}

function WorkspaceRow({
  name,
  subtitle,
  avatar,
  initials,
  isActive,
  onSelect,
}: {
  name: string;
  subtitle: string;
  avatar?: string;
  initials: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`group flex min-h-[60px] w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#177564]/35 ${
        isActive ? 'bg-[#f0faf7]' : 'hover:bg-slate-50 active:bg-slate-100'
      }`}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-slate-100 text-[12px] font-semibold text-slate-600">
        {avatar ? <ImageWithFallback src={avatar} alt="" className="h-full w-full object-cover" /> : initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium leading-5 text-slate-900">{name}</span>
        <span className="block truncate text-[12px] leading-4 text-slate-500">{subtitle}</span>
      </span>
      {isActive ? (
        <Check aria-label="Active workspace" className="h-[18px] w-[18px] shrink-0 text-[#177564]" strokeWidth={2.2} />
      ) : (
        <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Settings Page
// ---------------------------------------------------------------------------

interface SettingsPageProps {
  onBack: () => void;
  onGoToMyAccount?: () => void;
  onGoToInbox?: () => void;
  onGoToProfile?: () => void;
  onGoToApplyOrganizer?: () => void;
  onGoToTransactions?: () => void;
  onGoToPassportCases?: () => void;
  onSignOut?: () => void;
  userName?: string;
}

export function SettingsPage({
  onBack,
  onGoToMyAccount,
  onGoToInbox,
  onGoToProfile,
  onGoToApplyOrganizer,
  onGoToTransactions,
  onGoToPassportCases,
  onSignOut,
  userName,
}: SettingsPageProps) {
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchingToOrgId, setSwitchingToOrgId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { pendingOrgApplication } = useAppContext();

  const displayName = userName || 'Jessica Sanchez';
  const initials =
    displayName
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'JS';

  const handleSwitchOrg = (orgId: string | null) => {
    setSwitchingToOrgId(orgId);
    setIsSwitching(true);
    window.setTimeout(() => {
      setActiveOrgId(orgId);
      setIsSwitching(false);
      setSwitchingToOrgId(null);
    }, 1200);
  };

  const switchingTarget = switchingToOrgId
    ? MOCK_ORGANIZATIONS.find((org) => org.id === switchingToOrgId)?.name
    : 'Personal Account';

  return (
    <>
      <AnimatePresence>
        {isSwitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-live="polite"
            className="fixed inset-0 z-50 grid place-items-center bg-white/90 px-6 backdrop-blur-[6px] motion-reduce:transition-none"
          >
            <div className="flex w-full max-w-[260px] flex-col items-center gap-4 rounded-[16px] border border-slate-200/80 bg-white px-6 py-5 text-center shadow-[0_12px_32px_-24px_rgba(15,23,42,0.4)]">
              <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                <motion.div
                  animate={{ scaleX: [0.25, 1, 0.25] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                  className="h-full origin-left rounded-full bg-[#177564] motion-reduce:animate-none"
                />
              </div>
              <div>
                <p className="text-[15px] font-medium text-slate-900">Switching account</p>
                <p className="mt-1 text-[12px] text-slate-500">Connecting to {switchingTarget}…</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-7 px-4 pb-6 sm:px-6">
        <header className="flex items-start gap-3">
          <IconButton onClick={onBack} aria-label="Go back" tone="neutral" className="mt-0.5 h-11 w-11">
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </IconButton>
          <div>
            <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.03em] text-slate-950">Settings</h1>
            <p className="mt-1 text-[13px] leading-5 text-slate-500">Your account, workspaces, and preferences.</p>
          </div>
        </header>

        <button
          type="button"
          onClick={onGoToProfile}
          aria-label={`Open profile for ${displayName}`}
          className="group flex min-h-[64px] w-full items-center gap-3 rounded-[16px] border border-slate-200/80 bg-white px-3.5 py-3 text-left transition-colors hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#177564] text-[13px] font-semibold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-medium leading-5 text-slate-950">{displayName}</span>
            <span className="mt-0.5 block truncate text-[12px] leading-4 text-slate-500">Personal Account</span>
          </span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
        </button>

        <div className="flex flex-col gap-7">
          <SettingsSection title="General">
            <SettingsRow
              icon={<UserRound className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="My Account"
              value="Profile, preferences, and certificates"
              onClick={onGoToMyAccount}
              tone="accent"
            />
            <SettingsRow
              icon={<ReceiptText className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="Transactions"
              value="Receipts and payment history"
              onClick={onGoToTransactions}
            />
            <SettingsRow
              icon={<Inbox className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="Inbox"
              value="Invitations and updates"
              onClick={onGoToInbox}
            />
          </SettingsSection>

          <SettingsSection title="Workspaces">
            <WorkspaceRow
              name={displayName}
              subtitle="Personal Account"
              initials={initials}
              isActive={!activeOrgId}
              onSelect={() => activeOrgId && handleSwitchOrg(null)}
            />
            {MOCK_ORGANIZATIONS.map((org) => (
              <WorkspaceRow
                key={org.id}
                name={org.name}
                subtitle={`${ROLE_LABEL[org.role]} · ${org.eventCount} events${org.verified ? ' · Verified' : ''}`}
                avatar={org.avatar}
                initials={org.initials}
                isActive={activeOrgId === org.id}
                onSelect={() => activeOrgId !== org.id && handleSwitchOrg(org.id)}
              />
            ))}

            {pendingOrgApplication && (
              <div className="flex min-h-[60px] items-center gap-3 bg-[#fffaf0] px-3.5 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#fff1cf] text-[12px] font-semibold text-[#9a6700]">
                  {pendingOrgApplication.orgName
                    .split(' ')
                    .map((word) => word.charAt(0))
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium leading-5 text-slate-900">
                    {pendingOrgApplication.orgName}
                  </span>
                  <span className="block truncate text-[12px] leading-4 text-[#9a6700]">
                    Under review · Submitted{' '}
                    {new Date(pendingOrgApplication.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </span>
                <Clock3 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#b27b13]" />
              </div>
            )}

            <SettingsRow
              icon={<Plus className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="Create Organization"
              value="Apply to become an event organizer"
              onClick={onGoToApplyOrganizer}
              tone="accent"
            />
          </SettingsSection>

          <SettingsSection title="Support">
            <SettingsRow
              icon={<LifeBuoy className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="Help Center"
              value="FAQs and support"
              onClick={() => setIsHelpOpen(true)}
              tone="accent"
            />
            <SettingsRow
              icon={<ShieldCheck className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="Privacy Policy"
            />
            <SettingsRow
              icon={<FileText className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="Terms of Service"
            />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsRow
              icon={<Info className="h-[18px] w-[18px]" strokeWidth={1.8} />}
              label="App Version"
              value="Build 2026.02"
              trailing={<span className="shrink-0 text-[12px] tabular-nums text-slate-500">v1.0.0</span>}
            />
          </SettingsSection>

          {onGoToPassportCases && (
            <SettingsSection title="Prototype">
              <SettingsRow
                icon={<LayoutList className="h-[18px] w-[18px]" strokeWidth={1.8} />}
                label="Passport Cases Board"
                value="34 registration and access scenarios"
                onClick={onGoToPassportCases}
              />
            </SettingsSection>
          )}

          <ConfirmDialog
            trigger={
              <button
                type="button"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[14px] border border-red-200/80 bg-white px-4 py-2.5 text-[14px] font-medium text-red-600 transition-colors hover:bg-red-50 active:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
              >
                <LogOut className="h-[17px] w-[17px]" strokeWidth={1.8} />
                Sign Out
              </button>
            }
            title="Sign Out?"
            description="Are you sure you want to sign out? You'll need to log back in to access your account, tickets, and event registrations."
            icon={<LogOut className="h-6 w-6" />}
            iconVariant="destructive"
            confirmLabel="Yes, Sign Out"
            variant="destructive"
            onConfirm={() => onSignOut?.()}
          />
        </div>
      </div>

      {isHelpOpen && (
        <OrganizerContactWidget
          contact={PLANOUT_SUPPORT_CONTACT}
          theme="messenger"
          brandLogo="planout"
          title="PlanOut Help"
          recipientLabel="support"
          initiallyOpen
          showLauncher={false}
          showContactMethods={false}
          suggestedTopics={PLANOUT_SUPPORT_SUGGESTED_TOPICS}
          suggestedTopicReplies={PLANOUT_SUPPORT_SUGGESTED_TOPIC_REPLIES}
          fullScreenOnMobile={true}
          onOpenChange={(open) => {
            if (!open) setIsHelpOpen(false);
          }}
        />
      )}
    </>
  );
}
