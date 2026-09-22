import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';

const result = await build({
  stdin: {
    contents: `export * from './src/app/data/mockStore.ts';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  format: 'cjs',
  platform: 'node',
  write: false,
  packages: 'external',
  alias: { '@': path.resolve('src') },
});

const mod = { exports: {} };
const require = createRequire(import.meta.url);
new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, mod, mod.exports);

const {
  MOCK_STORE_STORAGE_KEY,
  createMockStoreState,
  readMockStoreState,
  resetMockStoreState,
  writeMockStoreState,
} = mod.exports;

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

const seed = createMockStoreState({
  cart: [{ id: 'evt-1', items: [] }],
  registrationQueueEntries: [{ id: 'entry-1', ticketId: 'tkt-1', entryStatus: 'pending_form' }],
});

test('writes and reads the complete mock state through one versioned key', () => {
  const storage = createStorage();
  writeMockStoreState(storage, seed);
  assert.deepEqual(readMockStoreState(storage, createMockStoreState()), seed);
  assert.equal(storage.getItem(MOCK_STORE_STORAGE_KEY) !== null, true);
});

test('revives persisted cart dates after JSON serialization', () => {
  const storage = createStorage();
  const state = createMockStoreState({
    cart: [{ id: 'evt-1', items: [{ id: 'item-1', countdownEnd: new Date('2026-09-22T00:00:00.000Z') }] }],
  });
  writeMockStoreState(storage, state);
  const restored = readMockStoreState(storage, createMockStoreState());
  assert.equal(restored.cart[0].items[0].countdownEnd instanceof Date, true);
  assert.equal(restored.cart[0].items[0].countdownEnd.toISOString(), '2026-09-22T00:00:00.000Z');
});

test('migrates legacy state only when the new store key is absent', () => {
  const storage = createStorage({
    'planout.registration.queue.v1': JSON.stringify([{ id: 'legacy-entry' }]),
    'planout.team.player.access.v1': JSON.stringify({ 'tkt-1:p1': 'passport' }),
  });
  const state = readMockStoreState(storage, createMockStoreState());
  assert.equal(state.registrationQueueEntries[0].id, 'legacy-entry');
  assert.equal(state.teamPlayerAccess['tkt-1:p1'], 'passport');
  assert.equal(storage.getItem('planout.registration.queue.v1'), null);
});

test('invalid stored data falls back to the deterministic seed', () => {
  const storage = createStorage({ [MOCK_STORE_STORAGE_KEY]: '{bad json' });
  const fallback = createMockStoreState({ registrationQueueEntries: [{ id: 'seed-entry' }] });
  assert.deepEqual(readMockStoreState(storage, fallback), fallback);
});

test('reset replaces all mutable demo state and removes legacy keys', () => {
  const storage = createStorage({
    [MOCK_STORE_STORAGE_KEY]: JSON.stringify({ version: 1, cart: [{ id: 'changed' }] }),
    'planout.registration.queue.v1': JSON.stringify([{ id: 'legacy' }]),
  });
  const resetSeed = createMockStoreState({ cart: [{ id: 'seed' }] });
  const reset = resetMockStoreState(storage, resetSeed);
  assert.deepEqual(reset, resetSeed);
  assert.equal(JSON.parse(storage.getItem(MOCK_STORE_STORAGE_KEY)).cart[0].id, 'seed');
  assert.equal(storage.getItem('planout.registration.queue.v1'), null);
});
