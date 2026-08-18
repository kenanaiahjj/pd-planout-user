import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(
  new URL('../src/app/components/SettingsPage.tsx', import.meta.url),
  'utf8',
);

test('settings uses one calm grouped-list shell', () => {
  assert.match(source, /max-w-\[680px\]/);
  assert.match(source, />General<|title="General"/);
  assert.match(source, />Workspaces<|title="Workspaces"/);
  assert.match(source, />Support<|title="Support"/);
  assert.match(source, />About<|title="About"/);
  assert.match(source, /min-h-\[44px\]|min-h-11/);
  assert.match(source, /Check className/);
  assert.match(source, /onGoToMyAccount|onGoToTransactions|onGoToInbox|onGoToApplyOrganizer|onGoToPassportCases|onSignOut/);
  assert.doesNotMatch(source, /grid-cols-1 lg:grid-cols-2/);
  assert.doesNotMatch(source, /uppercase tracking-\[0\.8px\]/);
  assert.doesNotMatch(source, /animate=\{\{ rotate: 360 \}\}/);
  assert.doesNotMatch(source, /Switch<\/|>Active<\//);
});

test('settings switching respects reduced motion', () => {
  assert.match(source, /prefers-reduced-motion|motion-reduce/);
  assert.match(source, /Switching account|Switching to/);
});
