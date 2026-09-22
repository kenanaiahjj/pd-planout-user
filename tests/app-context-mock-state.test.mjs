import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';

const appContextSource = readFileSync(new URL('../src/app/context/AppContext.tsx', import.meta.url), 'utf8');

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
  createMockStoreState,
  readMockStoreState,
  writeMockStoreState,
} = mod.exports;

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

test('AppContext exposes one reset action without resetting account identity', () => {
  assert.match(appContextSource, /resetMockState/);
  assert.match(appContextSource, /MOCK_STORE_STORAGE_KEY/);
  const resetImplementation = appContextSource.match(/const resetMockState = useCallback\(\(\) => \{[\s\S]*?\n  \}, \[[^\]]*\]\);/)?.[0] || '';
  assert.match(resetImplementation, /resetMockStoreState/);
  assert.doesNotMatch(resetImplementation, /setUserProfileState/);
});

test('mock mutations persist as one complete state record', () => {
  const storage = createStorage();
  const initial = createMockStoreState({ registrationQueueEntries: [] });
  const next = {
    ...initial,
    registrationQueueEntries: [{ id: 'entry-1' }],
    guestEntryQRs: { 'entry-1': { ref: 'GE-0000-0001' } },
  };
  writeMockStoreState(storage, next);
  const restored = readMockStoreState(storage, initial);
  assert.equal(restored.registrationQueueEntries[0].id, 'entry-1');
  assert.equal(restored.guestEntryQRs['entry-1'].ref, 'GE-0000-0001');
});
