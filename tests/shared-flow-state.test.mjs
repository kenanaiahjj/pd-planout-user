import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';

const ordersSource = readFileSync(new URL('../src/app/pages/OrdersPage.tsx', import.meta.url), 'utf8');
const passportSource = readFileSync(new URL('../src/app/pages/PassportPage.tsx', import.meta.url), 'utf8');
const formRouteSource = readFileSync(new URL('../src/app/routes/ParticipantFormRoute.tsx', import.meta.url), 'utf8');
const checkoutSource = readFileSync(new URL('../src/app/components/CheckoutPage.tsx', import.meta.url), 'utf8');
const guestSource = readFileSync(new URL('../src/app/pages/GuestEntryPages.tsx', import.meta.url), 'utf8');
const rootLayoutSource = readFileSync(new URL('../src/app/layouts/RootLayout.tsx', import.meta.url), 'utf8');

const result = await build({
  stdin: {
    contents: `
      export { buildOrders } from './src/app/pages/OrdersPage';
      export { getMockTicketById, getTicketParticipant } from './src/app/data/mockCatalog.ts';
      export { createMockStoreState, findGuestEntryQRInState } from './src/app/data/mockStore.ts';
    `,
    resolveDir: process.cwd(),
    loader: 'tsx',
  },
  bundle: true,
  format: 'cjs',
  platform: 'node',
  write: false,
  packages: 'external',
  alias: { '@': path.resolve('src') },
  loader: { '.png': 'dataurl', '.svg': 'dataurl', '.css': 'empty' },
});
const mod = { exports: {} };
const require = createRequire(import.meta.url);
new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, mod, mod.exports);

const {
  buildOrders,
  createMockStoreState,
  findGuestEntryQRInState,
  getMockTicketById,
  getTicketParticipant,
} = mod.exports;

test('all flow consumers use the canonical ticket and state selectors', () => {
  assert.match(ordersSource, /getMockTicketById/);
  assert.match(passportSource, /getMockTicketById/);
  assert.match(formRouteSource, /getMockTicketById/);
  assert.match(checkoutSource, /seedRegistrationQueue/);
  assert.match(guestSource, /buildOrders/);
  assert.match(rootLayoutSource, /getMockEventById/);
});

test('a participant completion is visible in the Orders projection and shared participant selector', () => {
  const state = createMockStoreState({
    registrationQueueEntries: [{
      id: 'tkt-011-p2',
      ticketId: 'tkt-011',
      participantId: 'p2',
      personName: 'Mia Torres',
      entryStatus: 'attached',
      accessPath: 'guest_qr',
    }],
  });
  const ticket = getMockTicketById('tkt-011');
  const participant = getTicketParticipant(ticket, 'p2', state);
  const order = buildOrders(state).find((candidate) => candidate.id === 'tkt-011');
  const entry = order.eventEntries.find((candidate) => candidate.participantId === 'p2');

  assert.equal(participant.name, 'Mia Torres');
  assert.equal(participant.accessPath, 'guest_qr');
  assert.equal(entry.participantName, 'Mia Torres');
  assert.equal(entry.accessPath, 'guest_qr');
  assert.equal(entry.status, 'attached');
});

test('a generated Guest QR is resolved from the same state map by public consumers', () => {
  const state = createMockStoreState({
    guestEntryQRs: {
      'tkt-011-p3': {
        entryId: 'tkt-011-p3',
        ref: 'GE-0000-0001',
        isActive: true,
      },
    },
  });
  assert.equal(findGuestEntryQRInState(state.guestEntryQRs, 'GE-0000-0001').entryId, 'tkt-011-p3');
});
