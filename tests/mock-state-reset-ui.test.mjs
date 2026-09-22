import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const settingsSource = readFileSync(new URL('../src/app/components/SettingsPage.tsx', import.meta.url), 'utf8');

test('Settings exposes a confirmed demo-state reset action', () => {
  assert.match(settingsSource, /resetMockState/);
  assert.match(settingsSource, /Reset demo data/);
  assert.match(settingsSource, /This restores the prototype's registrations/);
  assert.match(settingsSource, /Your account stays signed in/);
  assert.match(settingsSource, /<ConfirmDialog[\s\S]*isResetOpen/);
});
