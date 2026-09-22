import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';

const result = await build({
  stdin: {
    contents: `
      export {
        MOCK_TICKETS,
        getMockEventById,
        getMockTicketById,
        getTicketEvent,
        getTicketParticipant,
      } from './src/app/data/mockCatalog.ts';
      export { createRegistrationQueueEntries } from './src/app/data/tickets';
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
  MOCK_TICKETS,
  createRegistrationQueueEntries,
  getMockEventById,
  getMockTicketById,
  getTicketEvent,
  getTicketParticipant,
} = mod.exports;

test('every purchased fixture resolves to one event identity', () => {
  for (const ticket of MOCK_TICKETS) {
    const event = getTicketEvent(ticket);
    assert.ok(event, ticket.id);
    assert.equal(event.id, ticket.eventId, ticket.id);
    assert.equal(event.title, ticket.eventTitle, ticket.id);
    assert.equal(event.location, ticket.eventLocation, ticket.id);
  }
});

test('standalone registration scenarios resolve to explicit ticket records', () => {
  for (const entry of createRegistrationQueueEntries()) {
    assert.ok(getMockTicketById(entry.ticketId), entry.id);
  }
});

test('mutable participant overlays are shared by ticket consumers', () => {
  const ticket = getMockTicketById('tkt-011');
  assert.ok(ticket);
  const state = {
    teamPlayerRoster: {},
    registrationQueueEntries: [{
      ticketId: ticket.id,
      participantId: 'p2',
      personName: 'Rina Santos',
      entryStatus: 'attached',
    }],
  };
  assert.equal(getTicketParticipant(ticket, 'p2', state).name, 'Rina Santos');
});

test('unknown event IDs do not borrow a different discovery event', () => {
  assert.equal(getMockEventById('missing-event-id'), undefined);
});
