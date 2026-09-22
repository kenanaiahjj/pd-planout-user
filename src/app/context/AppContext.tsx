import { hasAccountSession } from '@/app/data/session.js';
/**
 * @file AppContext.tsx
 * @description Shared application state accessible to all route components.
 *
 * Provides user profile, authentication status, onboarding step,
 * desktop peek panel / drawer state, checkout intent, and constants.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { type EventData } from '@/app/data/events';
import {
  MY_TICKETS,
  createRegistrationQueueEntries,
  getActionRequiredCount,
  getOrderFormActionEntries,
  getPendingFormCount,
  retiredRegistrationEntryIds,
  type GuestEntryQR,
  type Participant,
  type RegistrationQueueEntry,
  type TeamPlayerAccessPath,
} from '@/app/data/tickets';
import { getMockTicketById } from '@/app/data/mockCatalog';
import {
  MOCK_STORE_STORAGE_KEY,
  createMockStoreState,
  findGuestEntryQRInState,
  readMockStoreState,
  resetMockStoreState,
  writeMockStoreState,
  type MockStoreState,
  type StorageLike,
} from '@/app/data/mockStore';
import { claimFormEntry, rescindFormInvite } from '@/app/data/formLinks.js';
import {
  applyParticipantToRegistrationQueue,
  resolveParticipantEntryStatus,
  shareRegistrationInviteInQueue,
} from '@/app/data/participantFormState.js';
import { attachTeamPlayerToPassport, normalizeTeamPlayerState } from '@/app/data/teamAccess.js';
import { INITIAL_CART, createCartEventFromAddition, mergeCartEvents } from '@/app/data/cart.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  sessionMode?: 'account' | 'guest';
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
  eventName?: string;
  image?: string;
}

export interface CheckoutIntent {
  eventName: string;
  category: string;
  price: number;
  image: string;
  items?: CheckoutIntentItem[];
}

export interface CartItem {
  id: string;
  name: string;
  tier?: string;
  wave?: string;
  price: number;
  quantity: number;
  image: string;
  countdownEnd?: Date;
  holdingEnd?: Date;
}

export interface CartEvent {
  id: string;
  eventName: string;
  date: string;
  location: string;
  items: CartItem[];
}

export interface CartAddition {
  eventId: string;
  eventName: string;
  date: string;
  location: string;
  image: string;
  items: CheckoutIntentItem[];
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

export type TeamPlayerAccess = Record<string, TeamPlayerAccessPath | undefined>;
export type TeamPlayerRoster = Record<string, Participant[] | undefined>;

export type RegistrationEntryClaimResult =
  | { ok: true }
  | { ok: false; reason: 'already_claimed' | 'invite_revoked'; ownerName: string };

export type GuestEntryClaimResult =
  | { ok: true; qr: GuestEntryQRRecord }
  | { ok: false; reason: 'not_found' | 'revoked' | 'already_claimed' };

/**
 * Stable case data used by the public Guest QR previews. Keeping these
 * records in the shared context means a preview link can continue through
 * the same claim path as a QR generated from Orders.
 */
export function getDemoGuestEntryQR(ref: string): GuestEntryQRRecord | undefined {
  const normalizedRef = ref.trim().toUpperCase();
  const base: GuestEntryQRRecord = {
    id: `demo-${normalizedRef}`,
    orderId: 'CFR-2026-008823',
    entryId: 'tkt-010-p2',
    attendeeName: 'Emily Park',
    eventName: 'Canlaon Marathon 2026',
    eventDate: 'June 27, 2026 at 5:00 AM',
    category: '42K Full Marathon',
    gate: 'Main Gate',
    ref: normalizedRef,
    isActive: true,
    expiresAt: '2026-06-27T23:59:59.000Z',
    buyerName: 'Jessica Sanchez',
    recipientUrl: `/guest-entry/${normalizedRef}`,
  };

  if (normalizedRef === 'GE-TEMP-4021' || normalizedRef.startsWith('GE-TEMP-4021-')) {
    return { ...base, attendeeName: 'Arthur Sanchez', onBehalfSignedBy: 'Jessica Sanchez' };
  }
  if (normalizedRef === 'GE-CANLAON-42K') {
    return { ...base, onBehalfSignedBy: 'Jessica Sanchez' };
  }
  if (normalizedRef === 'GE-USED-4218') {
    return {
      ...base,
      usedAt: '2026-06-27T04:18:00.000Z',
      scanGate: 'Main Gate',
    };
  }
  if (normalizedRef === 'GE-REVOKED-4218') {
    return { ...base, isActive: false };
  }
  return undefined;
}

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

  // Cart state and event-ticket handoff
  cart: CartEvent[];
  setCart: React.Dispatch<React.SetStateAction<CartEvent[]>>;
  addCartItems: (addition: CartAddition) => void;

  // Checkout confirmed (confirmation step reached — controls bottom nav visibility)
  checkoutConfirmed: boolean;
  setCheckoutConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  resetMockState: () => void;

  // Pending organizer application
  pendingOrgApplication: PendingOrgApplication | null;
  setPendingOrgApplication: React.Dispatch<React.SetStateAction<PendingOrgApplication | null>>;

  // Registration queue
  registrationQueueEntries: RegistrationQueueEntry[];
  activeRegistrationOrderRef: string | null;
  seedRegistrationQueue: (entries: RegistrationQueueEntry[], orderRef: string) => void;
  completeRegistrationEntry: (entryId: string, accessPath?: TeamPlayerAccessPath) => void;
  claimRegistrationEntry: (input: {
    entryId: string;
    ticketId?: string;
    participantId?: string;
  }) => RegistrationEntryClaimResult;
  rescindRegistrationInvite: (entryId: string) => void;
  sendRegistrationInvite: (entryId: string, recipient?: string, fallbackEntry?: RegistrationQueueEntry) => void;
  updateRegistrationParticipant: (entryId: string, participant: Participant, fallbackEntry?: RegistrationQueueEntry) => void;
  setRegistrationEntryAccessPath: (entryId: string, accessPath: TeamPlayerAccessPath) => void;
  updateRegistrationEntryStatus: (entryId: string, status: RegistrationQueueEntry['entryStatus']) => void;
  entryAttendance: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs: Record<string, GuestEntryQRRecord | undefined>;
  teamPlayerAccess: TeamPlayerAccess;
  setTeamPlayerAccess: (ticketId: string, participantId: string, accessPath: TeamPlayerAccessPath) => void;
  canAttachTeamPlayerToPassport: (ticketId: string, participantId: string) => boolean;
  teamPlayerRoster: TeamPlayerRoster;
  setTeamPlayerRoster: (ticketId: string, participants: Participant[]) => void;
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
    forceNew?: boolean;
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
const USER_PROFILE_STORAGE_KEY = 'planout.user.profile.v1';

function isPlaceholderDisplayName(value: unknown) {
  if (typeof value !== 'string') return true;
  const normalized = value.trim().toLowerCase();
  return !normalized || normalized === 'user' || /preview/i.test(normalized);
}

function readUserProfile(): UserProfile {
  const defaultProfile = { name: '', email: '', phone: '', loginMethod: 'email' };
  if (typeof window === 'undefined') return defaultProfile;
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return { ...defaultProfile, ...parsed };
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
    if (isPlaceholderDisplayName(cached.displayName)) {
      cached.displayName = createDefaultMember().displayName;
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
  cart: [],
  setCart: noop as any,
  addCartItems: noop as any,
  checkoutConfirmed: false,
  setCheckoutConfirmed: noop as any,
  resetMockState: noop,
  pendingOrgApplication: null,
  setPendingOrgApplication: noop as any,
  registrationQueueEntries: [],
  activeRegistrationOrderRef: null,
  seedRegistrationQueue: noop as any,
  completeRegistrationEntry: noop as any,
  claimRegistrationEntry: noop as any,
  rescindRegistrationInvite: noop as any,
  sendRegistrationInvite: noop as any,
  updateRegistrationParticipant: noop as any,
  setRegistrationEntryAccessPath: noop as any,
  updateRegistrationEntryStatus: noop as any,
  entryAttendance: {},
  guestEntryQRs: {},
  teamPlayerAccess: {},
  setTeamPlayerAccess: noop as any,
  canAttachTeamPlayerToPassport: () => true,
  teamPlayerRoster: {},
  setTeamPlayerRoster: noop as any,
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

const MOCK_NOTIFICATION_COUNT = 4;

function getMockStorage(): StorageLike | undefined {
  return typeof window === 'undefined' ? undefined : window.localStorage;
}

function createSeedMockState(): MockStoreState {
  return createMockStoreState({
    cart: INITIAL_CART as CartEvent[],
    registrationQueueEntries: createRegistrationQueueEntries(),
    checkoutIntent: null,
    checkoutConfirmed: false,
  });
}

function normalizeMockStateForMember(state: MockStoreState, memberId: string): MockStoreState {
  const nextAccess = { ...state.teamPlayerAccess };
  const nextRoster = { ...state.teamPlayerRoster };
  const ticketIds = new Set([
    ...MY_TICKETS.filter((ticket) => ticket.ticketType === 'team').map((ticket) => ticket.id),
    ...Object.keys(nextRoster),
  ]);

  ticketIds.forEach((ticketId) => {
    const ticket = getMockTicketById(ticketId);
    const participants = nextRoster[ticketId] || ticket?.participants;
    if (!participants) return;

    const normalized = normalizeTeamPlayerState({
      ticketId,
      participants,
      access: nextAccess,
      memberId,
    });
    Object.assign(nextAccess, normalized.access);
    if (state.teamPlayerRoster[ticketId]) nextRoster[ticketId] = normalized.participants;
  });

  return {
    ...state,
    teamPlayerAccess: nextAccess,
    teamPlayerRoster: nextRoster,
  };
}

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

  // Pending organizer application
  const [pendingOrgApplication, setPendingOrgApplication] = useState<PendingOrgApplication | null>({
    orgName: 'Urban Fitness Team',
    orgType: 'club',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  });

  const [mockState, setMockState] = useState<MockStoreState>(() => normalizeMockStateForMember(
    readMockStoreState(getMockStorage(), createSeedMockState()),
    passportMember.memberId,
  ));
  const mockStateRef = useRef(mockState);

  const commitMockState = useCallback((next: MockStoreState) => {
    mockStateRef.current = next;
    setMockState(next);
    writeMockStoreState(getMockStorage(), next);
  }, []);

  const updateMockState = useCallback((update: (state: MockStoreState) => MockStoreState) => {
    const next = update(mockStateRef.current);
    commitMockState(next);
  }, [commitMockState]);

  const {
    cart,
    checkoutIntent,
    checkoutConfirmed,
    registrationQueueEntries,
    activeRegistrationOrderRef,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
  } = mockState;

  const setCart = useCallback((value: React.SetStateAction<CartEvent[]>) => {
    updateMockState((state) => ({
      ...state,
      cart: typeof value === 'function' ? (value as (cart: CartEvent[]) => CartEvent[])(state.cart) : value,
    }));
  }, [updateMockState]);

  const addCartItems = useCallback((addition: CartAddition) => {
    const cartEvent = createCartEventFromAddition(addition) as CartEvent;
    updateMockState((state) => ({
      ...state,
      cart: mergeCartEvents(state.cart, cartEvent) as CartEvent[],
    }));
  }, [updateMockState]);

  const setCheckoutIntent = useCallback((value: React.SetStateAction<CheckoutIntent | null>) => {
    updateMockState((state) => ({
      ...state,
      checkoutIntent: typeof value === 'function'
        ? (value as (intent: CheckoutIntent | null) => CheckoutIntent | null)(state.checkoutIntent)
        : value,
    }));
  }, [updateMockState]);

  const setCheckoutConfirmed = useCallback((value: React.SetStateAction<boolean>) => {
    updateMockState((state) => ({
      ...state,
      checkoutConfirmed: typeof value === 'function'
        ? (value as (confirmed: boolean) => boolean)(state.checkoutConfirmed)
        : value,
    }));
  }, [updateMockState]);

  // Desktop media query check
  const isDesktop = useCallback(() => {
    return window.matchMedia('(min-width: 1024px)').matches;
  }, []);

  // Derived auth state
  const isAuthenticated = hasAccountSession(userProfile);
  const member: Member = {
    ...passportMember,
    displayName: isPlaceholderDisplayName(userProfile.name)
      ? passportMember.displayName
      : userProfile.name,
    avatarUrl: userProfile.avatarUrl || passportMember.avatarUrl,
  };

  const seedRegistrationQueue = useCallback((entries: RegistrationQueueEntry[], orderRef: string) => {
    updateMockState((state) => ({
      ...state,
      registrationQueueEntries: [
        ...state.registrationQueueEntries.filter((entry) => entry.orderRef !== orderRef),
        ...entries,
      ],
      activeRegistrationOrderRef: orderRef,
    }));
  }, [updateMockState]);

  const completeRegistrationEntry = useCallback((entryId: string, accessPath?: TeamPlayerAccessPath) => {
    updateMockState((state) => ({
      ...state,
      registrationQueueEntries: state.registrationQueueEntries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              entryStatus: 'attached' as const,
              ...(accessPath ? { accessPath } : {}),
              teamAttachedCount: entry.teamTotalCount || entry.teamAttachedCount,
            }
          : entry,
      ),
    }));
  }, [updateMockState]);

  const claimRegistrationEntry = useCallback(({
    entryId,
    ticketId,
    participantId,
  }: {
    entryId: string;
    ticketId?: string;
    participantId?: string;
  }): RegistrationEntryClaimResult => {
    // Re-read persisted state at submission time so two tabs/devices sharing
    // the same mock store still model first-submit-wins instead of each tab
    // claiming its own stale in-memory copy.
    const persistedState = normalizeMockStateForMember(
      readMockStoreState(getMockStorage(), createSeedMockState()),
      member.memberId,
    );
    const currentState = persistedState.registrationQueueEntries.some((entry) => entry.id === entryId)
      ? persistedState
      : mockStateRef.current;
    const currentEntries = currentState.registrationQueueEntries;
    const persistedTeamPlayerAccess = currentState.teamPlayerAccess;
    const persistedTeamPlayerRoster = currentState.teamPlayerRoster;
    const queueEntry = currentEntries.find((entry) => entry.id === entryId);
    const teamKey = ticketId && participantId ? `${ticketId}:${participantId}` : undefined;
    const currentParticipants = ticketId
      ? persistedTeamPlayerRoster[ticketId]
        || getMockTicketById(ticketId)?.participants
      : undefined;
    const participant = currentParticipants?.find((item) => item.id === participantId);
    const participantForClaim = participant
      ? { ...participant, accessPath: teamKey ? persistedTeamPlayerAccess[teamKey] || participant.accessPath : participant.accessPath }
      : undefined;
    if (queueEntry?.claimLinkRevoked || participant?.claimLinkRevoked) {
      return { ok: false, reason: 'invite_revoked', ownerName: 'the buyer' };
    }
    const claimSource = queueEntry || participantForClaim || { id: entryId, entryStatus: 'pending_form' };
    const claimedAt = new Date().toISOString();
    const claimant = {
      memberId: member.memberId,
      displayName: member.displayName,
      claimedAt,
    };

    for (const source of [queueEntry, participantForClaim].filter(Boolean)) {
      const result = claimFormEntry(source!, claimant);
      if (!result.ok) return result;
    }

    const claimedSource = claimFormEntry(claimSource, claimant);
    if (!claimedSource.ok) return claimedSource;

    if (queueEntry) {
      const nextQueueEntry = {
        ...claimedSource.entry,
        ...(queueEntry.type === 'team' && queueEntry.teamTotalCount
          ? { teamAttachedCount: Math.min(queueEntry.teamTotalCount, (queueEntry.teamAttachedCount || 0) + 1) }
          : {}),
      } as RegistrationQueueEntry;
      currentState.registrationQueueEntries = currentEntries.map((entry) => entry.id === entryId ? nextQueueEntry : entry);
    }

    let nextState = currentState;
    if (ticketId && participantId) {
      if (teamKey) {
        const nextAccess = { ...persistedTeamPlayerAccess, [teamKey]: 'passport' as const };
        nextState = { ...nextState, teamPlayerAccess: nextAccess };
      }

      if (participant) {
        const nextParticipants = (currentParticipants || []).map((item) => {
          if (item.id !== participantId) return item;
          return {
            ...attachTeamPlayerToPassport(item, member),
            claimedAt,
            claimedByMemberId: member.memberId,
            claimedByDisplayName: member.displayName,
          };
        });
        const nextRoster = { ...persistedTeamPlayerRoster, [ticketId]: nextParticipants };
        nextState = { ...nextState, teamPlayerRoster: nextRoster };
      }
    }

    commitMockState(nextState);
    return { ok: true };
  }, [commitMockState, member]);

  const rescindRegistrationInvite = useCallback((entryId: string) => {
    updateMockState((state) => ({
      ...state,
      registrationQueueEntries: state.registrationQueueEntries.map((entry) => (
        entry.id === entryId ? rescindFormInvite(entry) : entry
      )),
    }));
  }, [updateMockState]);

  const sendRegistrationInvite = useCallback((entryId: string, recipient?: string, fallbackEntry?: RegistrationQueueEntry) => {
    updateMockState((state) => ({
      ...state,
      registrationQueueEntries: shareRegistrationInviteInQueue(
        state.registrationQueueEntries,
        entryId,
        recipient,
        fallbackEntry,
      ),
    }));
  }, [updateMockState]);

  const updateRegistrationParticipant = useCallback((entryId: string, participant: Participant, fallbackEntry?: RegistrationQueueEntry) => {
    updateMockState((state) => ({
      ...state,
      registrationQueueEntries: applyParticipantToRegistrationQueue(
        state.registrationQueueEntries,
        entryId,
        participant,
        fallbackEntry,
      ),
    }));
  }, [updateMockState]);

  const setRegistrationEntryAccessPath = useCallback((entryId: string, accessPath: TeamPlayerAccessPath) => {
    updateMockState((state) => ({
      ...state,
      registrationQueueEntries: state.registrationQueueEntries.map((entry) => (
        entry.id === entryId ? { ...entry, accessPath } : entry
      )),
    }));
  }, [updateMockState]);

  const updateRegistrationEntryStatus = useCallback((entryId: string, status: RegistrationQueueEntry['entryStatus']) => {
    updateMockState((state) => ({
      ...state,
      registrationQueueEntries: state.registrationQueueEntries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              entryStatus: status,
            }
          : entry,
      ),
    }));
  }, [updateMockState]);

  const setEntryAttendance = useCallback((entryId: string, decision: EntryAttendanceDecision) => {
    updateMockState((state) => ({
      ...state,
      entryAttendance: { ...state.entryAttendance, [entryId]: decision },
    }));
  }, [updateMockState]);

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
    forceNew?: boolean;
  }) => {
    const existing = mockStateRef.current.guestEntryQRs[input.entryId];
    if (existing && !input.forceNew && (existing.isActive || existing.claimedAt)) {
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

    commitMockState({
      ...mockStateRef.current,
      guestEntryQRs: { ...mockStateRef.current.guestEntryQRs, [input.entryId]: next },
    });
    return next;
  }, [commitMockState]);

  const revokeGuestEntryQR = useCallback((entryId: string) => {
    const current = mockStateRef.current.guestEntryQRs[entryId];
    if (!current) return;
    commitMockState({
      ...mockStateRef.current,
      guestEntryQRs: {
        ...mockStateRef.current.guestEntryQRs,
        [entryId]: {
          ...current,
          isActive: false,
          revokedAt: new Date().toISOString(),
        },
      },
    });
  }, [commitMockState]);

  const markGuestEntryQRUsed = useCallback((entryId: string, scanGate = 'Main Gate') => {
    const current = mockStateRef.current.guestEntryQRs[entryId];
    if (!current) return;
    commitMockState({
      ...mockStateRef.current,
      guestEntryQRs: {
        ...mockStateRef.current.guestEntryQRs,
        [entryId]: {
          ...current,
          usedAt: new Date().toISOString(),
          scanGate,
        },
      },
    });
  }, [commitMockState]);

  const findGuestEntryQRByRef = useCallback((ref: string) => {
    const normalizedRef = ref.trim().toUpperCase();
    return findGuestEntryQRInState(mockStateRef.current.guestEntryQRs, normalizedRef)
      || getDemoGuestEntryQR(normalizedRef);
  }, []);

  const claimGuestEntryQR = useCallback((ref: string): GuestEntryClaimResult => {
    const normalizedRef = ref.trim().toUpperCase();
    const current = findGuestEntryQRInState(mockStateRef.current.guestEntryQRs, normalizedRef)
      || getDemoGuestEntryQR(normalizedRef);
    if (!current) return { ok: false, reason: 'not_found' };
    if (current.claimedAt) return { ok: false, reason: 'already_claimed' };
    if (!current.isActive) return { ok: false, reason: 'revoked' };

    const claimed: GuestEntryQRRecord = {
      ...current,
      isActive: false,
      claimedAt: new Date().toISOString(),
      claimedByMemberId: member.memberId,
    };
    const updated = { ...mockStateRef.current.guestEntryQRs, [current.entryId]: claimed };
    commitMockState({ ...mockStateRef.current, guestEntryQRs: updated });
    return { ok: true, qr: claimed };
  }, [commitMockState, member.memberId]);

  const canAttachTeamPlayerToPassport = useCallback((ticketId: string, participantId: string) => {
    const participants = mockStateRef.current.teamPlayerRoster[ticketId]
      || getMockTicketById(ticketId)?.participants
      || [];

    return !participants.some((participant) => {
      if (participant.id === participantId) return false;
      const key = `${ticketId}:${participant.id}`;
      const effectiveAccess = mockStateRef.current.teamPlayerAccess[key] || participant.accessPath;
      return effectiveAccess === 'passport' && participant.passportMemberId === member.memberId;
    });
  }, [member.memberId]);

  const setTeamPlayerAccess = useCallback((ticketId: string, participantId: string, requestedAccessPath: TeamPlayerAccessPath) => {
    const accessPath = requestedAccessPath === 'passport' && !canAttachTeamPlayerToPassport(ticketId, participantId)
      ? 'guest_qr'
      : requestedAccessPath;
    const key = `${ticketId}:${participantId}`;
    const currentState = mockStateRef.current;
    const currentParticipants = currentState.teamPlayerRoster[ticketId]
      || (accessPath === 'passport' ? getMockTicketById(ticketId)?.participants : undefined);
    if (!currentParticipants) return;

    const nextParticipants = currentParticipants.map((participant) => {
      if (participant.id !== participantId) return participant;
      if (accessPath === 'passport') {
        return attachTeamPlayerToPassport(participant, member);
      }
      const {
        passportMemberId: _passportMemberId,
        passportDisplayName: _passportDisplayName,
        ...withoutPassportOwner
      } = participant;
      return {
        ...withoutPassportOwner,
        accessPath,
      };
    });

    commitMockState({
      ...currentState,
      teamPlayerAccess: { ...currentState.teamPlayerAccess, [key]: accessPath },
      teamPlayerRoster: { ...currentState.teamPlayerRoster, [ticketId]: nextParticipants },
    });
  }, [canAttachTeamPlayerToPassport, commitMockState, member]);

  const setTeamPlayerRoster = useCallback((ticketId: string, participants: Participant[]) => {
    updateMockState((state) => {
      const attachedCount = participants.filter((participant) => participant.formStatus === 'completed').length;
      return {
        ...state,
        teamPlayerRoster: { ...state.teamPlayerRoster, [ticketId]: participants },
        registrationQueueEntries: state.registrationQueueEntries.map((entry) => entry.ticketId === ticketId && entry.type === 'team'
          ? {
              ...entry,
              entryStatus: attachedCount === participants.length ? 'attached' : 'pending_form',
              teamAttachedCount: attachedCount,
              teamTotalCount: participants.length,
            }
          : entry,
        ),
      };
    });
  }, [updateMockState]);

  const resetMockState = useCallback(() => {
    const next = normalizeMockStateForMember(
      resetMockStoreState(getMockStorage(), createSeedMockState()),
      member.memberId,
    );
    commitMockState(next);
  }, [commitMockState, member.memberId]);

  const passportPendingSummary = useMemo(() => {
    const pendingEntries = getOrderFormActionEntries(registrationQueueEntries);
    const deadlines = pendingEntries
      .map((entry) => (entry.deadline ? new Date(`${entry.deadline} 23:59:59`) : null))
      .filter((deadline): deadline is Date => Boolean(deadline) && !Number.isNaN(deadline.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    return {
      pendingCount: pendingEntries.reduce((sum, entry) => sum + getPendingFormCount(entry), 0),
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
        cart,
        setCart,
        addCartItems,
        checkoutConfirmed,
        setCheckoutConfirmed,
        resetMockState,
        pendingOrgApplication,
        setPendingOrgApplication,
        registrationQueueEntries,
        activeRegistrationOrderRef,
        seedRegistrationQueue,
        completeRegistrationEntry,
        claimRegistrationEntry,
        rescindRegistrationInvite,
        sendRegistrationInvite,
        updateRegistrationParticipant,
        setRegistrationEntryAccessPath,
        updateRegistrationEntryStatus,
        entryAttendance,
        guestEntryQRs,
        teamPlayerAccess,
        setTeamPlayerAccess,
        canAttachTeamPlayerToPassport,
        teamPlayerRoster,
        setTeamPlayerRoster,
        setEntryAttendance,
        generateGuestEntryQR,
        revokeGuestEntryQR,
        markGuestEntryQRUsed,
        findGuestEntryQRByRef,
        claimGuestEntryQR,
        isDesktop,
        cartCount: cart.reduce(
          (total, event) => total + event.items.reduce((eventTotal, item) => eventTotal + item.quantity, 0),
          0,
        ),
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
