/**
 * @file AppContext.tsx
 * @description Shared application state accessible to all route components.
 *
 * Provides user profile, authentication status, onboarding step,
 * desktop peek panel / drawer state, checkout intent, and constants.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { type EventData } from '@/app/data/events';
import {
  createRegistrationQueueEntries,
  getActionRequiredCount,
  getOrderFormActionEntries,
  retiredRegistrationEntryIds,
  type GuestEntryQR,
  type RegistrationQueueEntry,
} from '@/app/data/tickets';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthdate?: string;
  avatarUrl?: string;
  loginMethod: 'email' | 'phone';
  interests?: string[];
  secondaryEmails?: { email: string; verified: boolean }[];
}

export interface Member {
  memberId: string;
  passportCode: string;
  qrPayload: string;
  qrVersion: number;
  createdAt: string;
  displayName: string;
  avatarUrl?: string;
}

export interface CheckoutIntentItem {
  ticketId: string;
  qty: number;
  category: string;
  price: number;
}

export interface CheckoutIntent {
  eventName: string;
  category: string;
  price: number;
  image: string;
  items?: CheckoutIntentItem[];
}

export interface PendingOrgApplication {
  orgName: string;
  orgType: string;
  submittedAt: string; // ISO date string
}

export type EntryAttendanceDecision = 'together' | 'not_attending';

export interface GuestEntryQRRecord extends Omit<GuestEntryQR, 'revokedAt' | 'expiresAt' | 'sharedAt'> {
  orderId: string;
  buyerName: string;
  recipientUrl: string;
  usedAt?: string;
  revokedAt?: string;
  expiresAt: string;
  sharedAt?: string;
  onBehalfSignedBy?: string;
  scanGate?: string;
  /** A Guest QR may become Passport history exactly once. */
  claimedAt?: string;
  claimedByMemberId?: string;
}

export type GuestEntryClaimResult =
  | { ok: true; qr: GuestEntryQRRecord }
  | { ok: false; reason: 'not_found' | 'revoked' | 'already_claimed' };

interface AppContextValue {
  // User profile
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;

  // Universal passport identity
  member: Member;
  qrPayload: string;
  qrVersion: number;
  rotatePassportQr: () => void;

  // Return-to path (for post-login redirect)
  returnTo: string | null;
  setReturnTo: React.Dispatch<React.SetStateAction<string | null>>;

  // Onboarding
  onboardingStep: 'profile' | 'connect' | 'done';
  setOnboardingStep: React.Dispatch<React.SetStateAction<'profile' | 'connect' | 'done'>>;

  // Desktop peek panel
  peekEvent: EventData | null;
  setPeekEvent: React.Dispatch<React.SetStateAction<EventData | null>>;

  // Desktop drawers (cart / notifications)
  activeDrawer: 'cart' | 'notifications' | null;
  setActiveDrawer: React.Dispatch<React.SetStateAction<'cart' | 'notifications' | null>>;

  // Checkout intent (transient data for /checkout)
  checkoutIntent: CheckoutIntent | null;
  setCheckoutIntent: React.Dispatch<React.SetStateAction<CheckoutIntent | null>>;

  // Checkout confirmed (confirmation step reached — controls bottom nav visibility)
  checkoutConfirmed: boolean;
  setCheckoutConfirmed: React.Dispatch<React.SetStateAction<boolean>>;

  // Pending organizer application
  pendingOrgApplication: PendingOrgApplication | null;
  setPendingOrgApplication: React.Dispatch<React.SetStateAction<PendingOrgApplication | null>>;

  // Registration queue
  registrationQueueEntries: RegistrationQueueEntry[];
  activeRegistrationOrderRef: string | null;
  seedRegistrationQueue: (entries: RegistrationQueueEntry[], orderRef: string) => void;
  completeRegistrationEntry: (entryId: string) => void;
  updateRegistrationEntryStatus: (entryId: string, status: RegistrationQueueEntry['entryStatus']) => void;
  entryAttendance: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs: Record<string, GuestEntryQRRecord | undefined>;
  setEntryAttendance: (entryId: string, decision: EntryAttendanceDecision) => void;
  generateGuestEntryQR: (input: {
    orderId: string;
    entryId: string;
    attendeeName: string;
    eventName: string;
    eventDate: string;
    category: string;
    gate?: string;
    buyerName: string;
    onBehalfSignedBy?: string;
  }) => GuestEntryQRRecord;
  revokeGuestEntryQR: (entryId: string) => void;
  markGuestEntryQRUsed: (entryId: string, scanGate?: string) => void;
  findGuestEntryQRByRef: (ref: string) => GuestEntryQRRecord | undefined;
  claimGuestEntryQR: (ref: string) => GuestEntryClaimResult;
  // Utilities
  isDesktop: () => boolean;

  // Constants
  cartCount: number;
  notificationCount: number;
  ticketActionCount: number;
  passportPendingCount: number;
  nearestPassportDeadline?: Date;
}

// ---------------------------------------------------------------------------
// Default / fallback value (used during HMR refresh before provider mounts)
// ---------------------------------------------------------------------------

const noop = () => {};
const MOCK_MEMBER_ID = '7c4f1a92-3b7e-4a11-9d2b-1e8b0c4f6a23';
const MOCK_PASSPORT_CODE = 'PO-7K2M-9XQA';
const PASSPORT_STORAGE_KEY = 'planout.passport.member.v1';
const REGISTRATION_QUEUE_STORAGE_KEY = 'planout.registration.queue.v1';
const ACTIVE_REGISTRATION_ORDER_KEY = 'planout.registration.activeOrder.v1';
const ENTRY_ATTENDANCE_STORAGE_KEY = 'planout.entry.attendance.v1';
const GUEST_ENTRY_QR_STORAGE_KEY = 'planout.guest.entry.qrs.v1';
const USER_PROFILE_STORAGE_KEY = 'planout.user.profile.v1';

function readUserProfile(): UserProfile {
  const defaultProfile = { name: '', email: '', phone: '', loginMethod: 'email' };
  if (typeof window === 'undefined') return defaultProfile;
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function cacheUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function createMockQrSignature(memberId: string, qrVersion: number) {
  const input = `${memberId}|${qrVersion}|planout-prototype-secret`;
  let hash = 0x811c9dc5;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

function createQrPayload(memberId: string, qrVersion: number) {
  const sig = createMockQrSignature(memberId, qrVersion);
  return `https://planout.app/m/${memberId}?v=${qrVersion}&sig=${sig}`;
}

function createDefaultMember(): Member {
  return {
    memberId: MOCK_MEMBER_ID,
    passportCode: MOCK_PASSPORT_CODE,
    qrVersion: 1,
    qrPayload: createQrPayload(MOCK_MEMBER_ID, 1),
    createdAt: '2026-01-12T08:00:00.000Z',
    displayName: 'Jessica Sanchez',
  };
}

function readCachedMember(): Member {
  if (typeof window === 'undefined') return createDefaultMember();

  try {
    const raw = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (!raw) return createDefaultMember();

    const cached = JSON.parse(raw) as Partial<Member>;
    if (cached.displayName && /preview/i.test(cached.displayName)) {
      cached.displayName = 'User';
    }
    const memberId = cached.memberId || MOCK_MEMBER_ID;
    const qrVersion = cached.qrVersion || 1;

    return {
      ...createDefaultMember(),
      ...cached,
      memberId,
      qrVersion,
      qrPayload: cached.qrPayload || createQrPayload(memberId, qrVersion),
    };
  } catch {
    return createDefaultMember();
  }
}

function cacheMember(member: Member) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(member));
}

function readRegistrationQueueEntries(): RegistrationQueueEntry[] {
  const defaults = createRegistrationQueueEntries();
  if (typeof window === 'undefined') return defaults;

  try {
    const raw = window.localStorage.getItem(REGISTRATION_QUEUE_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaults;
    const cached = parsed.filter((entry: RegistrationQueueEntry) => !retiredRegistrationEntryIds.has(entry.id));
    const cachedIds = new Set(cached.map((entry: RegistrationQueueEntry) => entry.id));
    return [...cached, ...defaults.filter((entry) => !cachedIds.has(entry.id))];
  } catch {
    return defaults;
  }
}

function cacheRegistrationQueueEntries(entries: RegistrationQueueEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REGISTRATION_QUEUE_STORAGE_KEY, JSON.stringify(entries));
}

function readActiveRegistrationOrderRef(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACTIVE_REGISTRATION_ORDER_KEY);
}

function cacheActiveRegistrationOrderRef(orderRef: string | null) {
  if (typeof window === 'undefined') return;
  if (orderRef) window.localStorage.setItem(ACTIVE_REGISTRATION_ORDER_KEY, orderRef);
  else window.localStorage.removeItem(ACTIVE_REGISTRATION_ORDER_KEY);
}

function readRecord<T>({ key, fallback }: { key: string; fallback: Record<string, T | undefined> }) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, T | undefined> : fallback;
  } catch {
    return fallback;
  }
}

function cacheRecord<T>(key: string, value: Record<string, T | undefined>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createGuestEntryRef(entryId: string) {
  const input = `${entryId}|${Date.now()}|guest-entry`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const value = (hash >>> 0).toString(36).toUpperCase().padStart(8, '0').slice(0, 8);
  return `GE-${value.slice(0, 4)}-${value.slice(4, 8)}`;
}

const DEFAULT_MEMBER = createDefaultMember();

const DEFAULT_CONTEXT: AppContextValue = {
  userProfile: { name: '', email: '', phone: '', loginMethod: 'email' },
  setUserProfile: noop as any,
  isAuthenticated: false,
  member: DEFAULT_MEMBER,
  qrPayload: DEFAULT_MEMBER.qrPayload,
  qrVersion: DEFAULT_MEMBER.qrVersion,
  rotatePassportQr: noop,
  returnTo: null,
  setReturnTo: noop as any,
  onboardingStep: 'done',
  setOnboardingStep: noop as any,
  peekEvent: null,
  setPeekEvent: noop as any,
  activeDrawer: null,
  setActiveDrawer: noop as any,
  checkoutIntent: null,
  setCheckoutIntent: noop as any,
  checkoutConfirmed: false,
  setCheckoutConfirmed: noop as any,
  pendingOrgApplication: null,
  setPendingOrgApplication: noop as any,
  registrationQueueEntries: [],
  activeRegistrationOrderRef: null,
  seedRegistrationQueue: noop as any,
  completeRegistrationEntry: noop as any,
  updateRegistrationEntryStatus: noop as any,
  entryAttendance: {},
  guestEntryQRs: {},
  setEntryAttendance: noop as any,
  generateGuestEntryQR: noop as any,
  revokeGuestEntryQR: noop as any,
  markGuestEntryQRUsed: noop as any,
  findGuestEntryQRByRef: noop as any,
  claimGuestEntryQR: noop as any,
  isDesktop: () => false,
  cartCount: 0,
  notificationCount: 0,
  ticketActionCount: 0,
  passportPendingCount: 0,
  nearestPassportDeadline: undefined,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AppContext = createContext<AppContextValue>(DEFAULT_CONTEXT);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAppContext(): AppContextValue {
  return useContext(AppContext);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/** Mock constants — will be replaced by real state later. */
const MOCK_CART_COUNT = 3;
const MOCK_NOTIFICATION_COUNT = 4;

export function AppProvider({ children }: { children: React.ReactNode }) {
  // User profile
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => readUserProfile());

  const setUserProfile = useCallback((profile: React.SetStateAction<UserProfile>) => {
    setUserProfileState((prev) => {
      const next = typeof profile === 'function' ? (profile as Function)(prev) : profile;
      cacheUserProfile(next);
      return next;
    });
  }, []);

  const [passportMember, setPassportMember] = useState<Member>(() => readCachedMember());

  // Return-to path for post-login redirect
  const [returnTo, setReturnTo] = useState<string | null>(null);

  // Onboarding
  const [onboardingStep, setOnboardingStep] = useState<'profile' | 'connect' | 'done'>('done');

  // Desktop overlays
  const [peekEvent, setPeekEvent] = useState<EventData | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<'cart' | 'notifications' | null>(null);

  // Checkout intent
  const [checkoutIntent, setCheckoutIntent] = useState<CheckoutIntent | null>(null);

  // Checkout confirmed
  const [checkoutConfirmed, setCheckoutConfirmed] = useState<boolean>(false);

  // Pending organizer application
  const [pendingOrgApplication, setPendingOrgApplication] = useState<PendingOrgApplication | null>({
    orgName: 'Urban Fitness Team',
    orgType: 'club',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  });
  const [registrationQueueEntries, setRegistrationQueueEntries] = useState<RegistrationQueueEntry[]>(() =>
    readRegistrationQueueEntries(),
  );
  const [activeRegistrationOrderRef, setActiveRegistrationOrderRef] = useState<string | null>(() =>
    readActiveRegistrationOrderRef(),
  );
  const [entryAttendance, setEntryAttendanceState] = useState<Record<string, EntryAttendanceDecision | undefined>>(() =>
    readRecord<EntryAttendanceDecision>({ key: ENTRY_ATTENDANCE_STORAGE_KEY, fallback: {} }),
  );
  const [guestEntryQRs, setGuestEntryQRs] = useState<Record<string, GuestEntryQRRecord | undefined>>(() =>
    readRecord<GuestEntryQRRecord>({ key: GUEST_ENTRY_QR_STORAGE_KEY, fallback: {} }),
  );
  const guestEntryQRsRef = useRef(guestEntryQRs);

  // Desktop media query check
  const isDesktop = useCallback(() => {
    return window.matchMedia('(min-width: 1024px)').matches;
  }, []);

  // Derived auth state
  const isAuthenticated = userProfile.name.length > 0 || onboardingStep !== 'done';
  const member: Member = {
    ...passportMember,
    displayName: userProfile.name || passportMember.displayName,
    avatarUrl: userProfile.avatarUrl || passportMember.avatarUrl,
  };

  const seedRegistrationQueue = useCallback((entries: RegistrationQueueEntry[], orderRef: string) => {
    setRegistrationQueueEntries((prev) => {
      const next = [...prev.filter((entry) => entry.orderRef !== orderRef), ...entries];
      cacheRegistrationQueueEntries(next);
      return next;
    });
    setActiveRegistrationOrderRef(orderRef);
    cacheActiveRegistrationOrderRef(orderRef);
  }, []);

  const completeRegistrationEntry = useCallback((entryId: string) => {
    setRegistrationQueueEntries((prev) => {
      const next = prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              entryStatus: 'attached' as const,
              teamAttachedCount: entry.teamTotalCount || entry.teamAttachedCount,
            }
          : entry,
      );
      cacheRegistrationQueueEntries(next);
      return next;
    });
  }, []);

  const updateRegistrationEntryStatus = useCallback((entryId: string, status: RegistrationQueueEntry['entryStatus']) => {
    setRegistrationQueueEntries((prev) => {
      const next = prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              entryStatus: status,
            }
          : entry,
      );
      cacheRegistrationQueueEntries(next);
      return next;
    });
  }, []);

  const setEntryAttendance = useCallback((entryId: string, decision: EntryAttendanceDecision) => {
    setEntryAttendanceState((prev) => {
      const next = { ...prev, [entryId]: decision };
      cacheRecord(ENTRY_ATTENDANCE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const generateGuestEntryQR = useCallback((input: {
    orderId: string;
    entryId: string;
    attendeeName: string;
    eventName: string;
    eventDate: string;
    category: string;
    gate?: string;
    buyerName: string;
    onBehalfSignedBy?: string;
  }) => {
    const existing = guestEntryQRs[input.entryId];
    if (existing && (existing.isActive || existing.claimedAt)) {
      return existing;
    }

    const ref = createGuestEntryRef(input.entryId);
    const next: GuestEntryQRRecord = {
      id: `guest-${input.entryId}-${Date.now()}`,
      orderId: input.orderId,
      entryId: input.entryId,
      attendeeName: input.attendeeName,
      eventName: input.eventName,
      eventDate: input.eventDate,
      category: input.category,
      gate: input.gate || 'Main Gate',
      ref,
      isActive: true,
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      buyerName: input.buyerName,
      recipientUrl: `/guest-entry/${ref}`,
      onBehalfSignedBy: input.onBehalfSignedBy || input.buyerName,
    };

    setGuestEntryQRs((prev) => {
      const updated = { ...prev, [input.entryId]: next };
      guestEntryQRsRef.current = updated;
      cacheRecord(GUEST_ENTRY_QR_STORAGE_KEY, updated);
      return updated;
    });
    return next;
  }, [guestEntryQRs]);

  const revokeGuestEntryQR = useCallback((entryId: string) => {
    setGuestEntryQRs((prev) => {
      const current = prev[entryId];
      if (!current) return prev;
      const updated = {
        ...prev,
        [entryId]: {
          ...current,
          isActive: false,
          revokedAt: new Date().toISOString(),
        },
      };
      guestEntryQRsRef.current = updated;
      cacheRecord(GUEST_ENTRY_QR_STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const markGuestEntryQRUsed = useCallback((entryId: string, scanGate = 'Main Gate') => {
    setGuestEntryQRs((prev) => {
      const current = prev[entryId];
      if (!current) return prev;
      const updated = {
        ...prev,
        [entryId]: {
          ...current,
          usedAt: new Date().toISOString(),
          scanGate,
        },
      };
      guestEntryQRsRef.current = updated;
      cacheRecord(GUEST_ENTRY_QR_STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const findGuestEntryQRByRef = useCallback((ref: string) => {
    return Object.values(guestEntryQRs).find((qr) => qr?.ref === ref);
  }, [guestEntryQRs]);

  const claimGuestEntryQR = useCallback((ref: string): GuestEntryClaimResult => {
    const current = Object.values(guestEntryQRsRef.current).find((qr) => qr?.ref.toUpperCase() === ref.trim().toUpperCase());
    if (!current) return { ok: false, reason: 'not_found' };
    if (current.claimedAt) return { ok: false, reason: 'already_claimed' };
    if (!current.isActive) return { ok: false, reason: 'revoked' };

    const claimed: GuestEntryQRRecord = {
      ...current,
      isActive: false,
      claimedAt: new Date().toISOString(),
      claimedByMemberId: member.memberId,
    };
    const updated = { ...guestEntryQRsRef.current, [current.entryId]: claimed };
    guestEntryQRsRef.current = updated;
    cacheRecord(GUEST_ENTRY_QR_STORAGE_KEY, updated);
    setGuestEntryQRs(updated);
    return { ok: true, qr: claimed };
  }, [member.memberId]);

  const passportPendingSummary = useMemo(() => {
    const pendingEntries = getOrderFormActionEntries(registrationQueueEntries);
    const deadlines = pendingEntries
      .map((entry) => (entry.deadline ? new Date(`${entry.deadline} 23:59:59`) : null))
      .filter((deadline): deadline is Date => Boolean(deadline) && !Number.isNaN(deadline.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    return {
      pendingCount: pendingEntries.length,
      nearestDeadline: deadlines[0],
    };
  }, [registrationQueueEntries]);

  const rotatePassportQr = useCallback(() => {
    setPassportMember((prev) => {
      const qrVersion = prev.qrVersion + 1;
      const next = {
        ...prev,
        qrVersion,
        qrPayload: createQrPayload(prev.memberId, qrVersion),
      };
      cacheMember(next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        isAuthenticated,
        member,
        qrPayload: member.qrPayload,
        qrVersion: member.qrVersion,
        rotatePassportQr,
        returnTo,
        setReturnTo,
        onboardingStep,
        setOnboardingStep,
        peekEvent,
        setPeekEvent,
        activeDrawer,
        setActiveDrawer,
        checkoutIntent,
        setCheckoutIntent,
        checkoutConfirmed,
        setCheckoutConfirmed,
        pendingOrgApplication,
        setPendingOrgApplication,
        registrationQueueEntries,
        activeRegistrationOrderRef,
        seedRegistrationQueue,
        completeRegistrationEntry,
        updateRegistrationEntryStatus,
        entryAttendance,
        guestEntryQRs,
        setEntryAttendance,
        generateGuestEntryQR,
        revokeGuestEntryQR,
        markGuestEntryQRUsed,
        findGuestEntryQRByRef,
        claimGuestEntryQR,
        isDesktop,
        cartCount: MOCK_CART_COUNT,
        notificationCount: MOCK_NOTIFICATION_COUNT,
        ticketActionCount: getActionRequiredCount(),
        passportPendingCount: passportPendingSummary.pendingCount,
        nearestPassportDeadline: passportPendingSummary.nearestDeadline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
