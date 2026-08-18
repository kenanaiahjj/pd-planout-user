import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ordersSource = fs.readFileSync(new URL('../src/app/pages/OrdersPage.tsx', import.meta.url), 'utf8');
const participantFormSource = fs.readFileSync(new URL('../src/app/pages/ParticipantFormPage.tsx', import.meta.url), 'utf8');

test('team entry status uses plain language instead of implementation terminology', () => {
  assert.match(ordersSource, /Player entry needed/);
  assert.doesNotMatch(ordersSource, /This player still needs an access path/);
});

test('team guest QR actions live in the player form instead of a separate order manager', () => {
  assert.match(participantFormSource, /Guest QR ready/);
  assert.match(participantFormSource, />\s*Open QR\s*</);
  assert.doesNotMatch(ordersSource, /Manage guest QRs/);
});
