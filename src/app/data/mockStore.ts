import type {
  CartEvent,
  CheckoutIntent,
  EntryAttendanceDecision,
  GuestEntryQRRecord,
  TeamPlayerAccess,
  TeamPlayerRoster,
} from '@/app/context/AppContext';
import type { RegistrationQueueEntry } from '@/app/data/tickets';

export const MOCK_STORE_VERSION = 1 as const;
export const MOCK_STORE_STORAGE_KEY = 'planout.mock.store.v1';

export interface MockStoreState {
  version: typeof MOCK_STORE_VERSION;
  cart: CartEvent[];
  checkoutIntent: CheckoutIntent | null;
  checkoutConfirmed: boolean;
  registrationQueueEntries: RegistrationQueueEntry[];
  activeRegistrationOrderRef: string | null;
  entryAttendance: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs: Record<string, GuestEntryQRRecord | undefined>;
  teamPlayerAccess: TeamPlayerAccess;
  teamPlayerRoster: TeamPlayerRoster;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const LEGACY_STORAGE_KEYS = {
  cart: 'planout.cart.v1',
  checkoutIntent: 'planout.checkout.intent.v1',
  checkoutConfirmed: 'planout.checkout.confirmed.v1',
  registrationQueueEntries: 'planout.registration.queue.v1',
  activeRegistrationOrderRef: 'planout.registration.activeOrder.v1',
  entryAttendance: 'planout.entry.attendance.v1',
  guestEntryQRs: 'planout.guest.entry.qrs.v1',
  teamPlayerAccess: 'planout.team.player.access.v1',
  teamPlayerRoster: 'planout.team.player.roster.v1',
} as const;

const LEGACY_KEYS = Object.values(LEGACY_STORAGE_KEYS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function reviveDate(value: unknown): unknown {
  if (value instanceof Date) return new Date(value.getTime());
  if (typeof value !== 'string' && typeof value !== 'number') return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date;
}

function reviveCart(cart: unknown, fallback: CartEvent[]): CartEvent[] {
  if (!Array.isArray(cart)) return clone(fallback);

  return cart.map((event) => {
    if (!isRecord(event)) return event as CartEvent;
    const items = Array.isArray(event.items)
      ? event.items.map((item) => {
          if (!isRecord(item)) return item;
          return {
            ...item,
            ...(item.countdownEnd !== undefined ? { countdownEnd: reviveDate(item.countdownEnd) } : {}),
            ...(item.holdingEnd !== undefined ? { holdingEnd: reviveDate(item.holdingEnd) } : {}),
          };
        })
      : [];
    return { ...event, items } as CartEvent;
  });
}

function parseJson(storage: StorageLike | undefined, key: string): unknown {
  if (!storage) return undefined;
  try {
    const raw = storage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function cloneRecord<T>(value: unknown, fallback: Record<string, T | undefined>) {
  return isRecord(value) ? clone(value) as Record<string, T | undefined> : clone(fallback);
}

function cloneCheckoutIntent(value: unknown, fallback: CheckoutIntent | null): CheckoutIntent | null {
  if (value === null) return null;
  return isRecord(value) ? clone(value) as CheckoutIntent : clone(fallback);
}

function normalizeState(value: unknown, fallback: MockStoreState): MockStoreState | null {
  if (!isRecord(value) || value.version !== MOCK_STORE_VERSION) return null;

  const next = createMockStoreState({
    cart: reviveCart(value.cart, fallback.cart),
    checkoutIntent: cloneCheckoutIntent(value.checkoutIntent, fallback.checkoutIntent),
    checkoutConfirmed: typeof value.checkoutConfirmed === 'boolean'
      ? value.checkoutConfirmed
      : fallback.checkoutConfirmed,
    registrationQueueEntries: Array.isArray(value.registrationQueueEntries)
      ? clone(value.registrationQueueEntries)
      : fallback.registrationQueueEntries,
    activeRegistrationOrderRef: typeof value.activeRegistrationOrderRef === 'string' || value.activeRegistrationOrderRef === null
      ? value.activeRegistrationOrderRef
      : fallback.activeRegistrationOrderRef,
    entryAttendance: cloneRecord<EntryAttendanceDecision>(value.entryAttendance, fallback.entryAttendance),
    guestEntryQRs: cloneRecord<GuestEntryQRRecord>(value.guestEntryQRs, fallback.guestEntryQRs),
    teamPlayerAccess: cloneRecord<TeamPlayerAccess[string]>(value.teamPlayerAccess, fallback.teamPlayerAccess),
    teamPlayerRoster: cloneRecord<TeamPlayerRoster[string]>(value.teamPlayerRoster, fallback.teamPlayerRoster),
  });

  return next;
}

export function createMockStoreState(seed: Partial<MockStoreState> = {}): MockStoreState {
  return {
    version: MOCK_STORE_VERSION,
    cart: Array.isArray(seed.cart) ? clone(seed.cart) : [],
    checkoutIntent: seed.checkoutIntent === undefined ? null : clone(seed.checkoutIntent),
    checkoutConfirmed: Boolean(seed.checkoutConfirmed),
    registrationQueueEntries: Array.isArray(seed.registrationQueueEntries)
      ? clone(seed.registrationQueueEntries)
      : [],
    activeRegistrationOrderRef: seed.activeRegistrationOrderRef ?? null,
    entryAttendance: clone(seed.entryAttendance || {}),
    guestEntryQRs: clone(seed.guestEntryQRs || {}),
    teamPlayerAccess: clone(seed.teamPlayerAccess || {}),
    teamPlayerRoster: clone(seed.teamPlayerRoster || {}),
  };
}

function removeLegacyKeys(storage: StorageLike | undefined) {
  if (!storage) return;
  for (const key of LEGACY_KEYS) storage.removeItem(key);
}

export function writeMockStoreState(storage: StorageLike | undefined, state: MockStoreState): MockStoreState {
  const next = createMockStoreState(state);
  if (storage) {
    storage.setItem(MOCK_STORE_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function migrateLegacyMockState(storage: StorageLike | undefined, seed: MockStoreState): MockStoreState {
  const next = createMockStoreState(seed);
  let migrated = false;

  const legacyCart = parseJson(storage, LEGACY_STORAGE_KEYS.cart);
  if (legacyCart !== undefined) {
    next.cart = reviveCart(legacyCart, next.cart);
    migrated = Array.isArray(legacyCart) || migrated;
  }

  const legacyCheckoutIntent = parseJson(storage, LEGACY_STORAGE_KEYS.checkoutIntent);
  if (legacyCheckoutIntent !== undefined) {
    next.checkoutIntent = cloneCheckoutIntent(legacyCheckoutIntent, next.checkoutIntent);
    migrated = isRecord(legacyCheckoutIntent) || legacyCheckoutIntent === null || migrated;
  }

  const legacyCheckoutConfirmed = parseJson(storage, LEGACY_STORAGE_KEYS.checkoutConfirmed);
  if (legacyCheckoutConfirmed !== undefined) {
    next.checkoutConfirmed = typeof legacyCheckoutConfirmed === 'boolean'
      ? legacyCheckoutConfirmed
      : next.checkoutConfirmed;
    migrated = typeof legacyCheckoutConfirmed === 'boolean' || migrated;
  }

  const legacyQueue = parseJson(storage, LEGACY_STORAGE_KEYS.registrationQueueEntries);
  if (Array.isArray(legacyQueue)) {
    next.registrationQueueEntries = clone(legacyQueue);
    migrated = true;
  }

  const legacyActiveOrder = storage?.getItem(LEGACY_STORAGE_KEYS.activeRegistrationOrderRef) ?? null;
  if (legacyActiveOrder !== null) {
    next.activeRegistrationOrderRef = legacyActiveOrder;
    migrated = true;
  }

  const legacyAttendance = parseJson(storage, LEGACY_STORAGE_KEYS.entryAttendance);
  if (isRecord(legacyAttendance)) {
    next.entryAttendance = clone(legacyAttendance) as MockStoreState['entryAttendance'];
    migrated = true;
  }

  const legacyQrs = parseJson(storage, LEGACY_STORAGE_KEYS.guestEntryQRs);
  if (isRecord(legacyQrs)) {
    next.guestEntryQRs = clone(legacyQrs) as MockStoreState['guestEntryQRs'];
    migrated = true;
  }

  const legacyAccess = parseJson(storage, LEGACY_STORAGE_KEYS.teamPlayerAccess);
  if (isRecord(legacyAccess)) {
    next.teamPlayerAccess = clone(legacyAccess) as TeamPlayerAccess;
    migrated = true;
  }

  const legacyRoster = parseJson(storage, LEGACY_STORAGE_KEYS.teamPlayerRoster);
  if (isRecord(legacyRoster)) {
    next.teamPlayerRoster = clone(legacyRoster) as TeamPlayerRoster;
    migrated = true;
  }

  if (migrated) {
    writeMockStoreState(storage, next);
    removeLegacyKeys(storage);
  }

  return next;
}

export function readMockStoreState(storage: StorageLike | undefined, seed: MockStoreState): MockStoreState {
  const fallback = createMockStoreState(seed);
  const hasNewRecord = storage?.getItem(MOCK_STORE_STORAGE_KEY) !== null;

  if (hasNewRecord) {
    const stored = normalizeState(parseJson(storage, MOCK_STORE_STORAGE_KEY), fallback);
    return stored || fallback;
  }

  return migrateLegacyMockState(storage, fallback);
}

export function resetMockStoreState(storage: StorageLike | undefined, seed: MockStoreState): MockStoreState {
  const next = writeMockStoreState(storage, createMockStoreState(seed));
  removeLegacyKeys(storage);
  return next;
}

export function findGuestEntryQRInState(
  guestEntryQRs: Record<string, GuestEntryQRRecord | undefined>,
  ref: string,
): GuestEntryQRRecord | undefined {
  const normalizedRef = ref.trim().toUpperCase();
  return Object.values(guestEntryQRs).find((qr) => qr?.ref.toUpperCase() === normalizedRef);
}
