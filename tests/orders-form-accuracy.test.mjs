import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { hydrateParticipantFromRegistrationEntry } from '../src/app/data/participantFormState.js';

// Exercise the real Orders model and rendered controls, not source-text patterns.
const result = await build({
  stdin: { contents: `
    export { buildOrders, OrderDetailPage } from './src/app/pages/OrdersPage';
    export { MY_TICKETS, createRegistrationQueueEntries, getOrderFormActionEntries, getPendingFormCount } from './src/app/data/tickets';
    export { RegistrationItem } from './src/app/components/RegistrationItemComponents';
    export { ParticipantFormPage } from './src/app/pages/ParticipantFormPage';
    export { GroupedRegistrationList } from './src/app/components/RegistrationItemComponents';
    export { AppProvider } from './src/app/context/AppContext';
  `, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, format: 'cjs', platform: 'node', write: false,
  packages: 'external', alias: { '@': path.resolve('src') },
  loader: { '.png': 'dataurl', '.svg': 'dataurl', '.css': 'empty' },
});
const mod = { exports: {} };
// Production React supports this static-render check without client-effect warnings.
process.env.NODE_ENV = 'production';
const require = createRequire(import.meta.url);
new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, mod, mod.exports);
const { buildOrders, OrderDetailPage, MY_TICKETS, createRegistrationQueueEntries, getOrderFormActionEntries, getPendingFormCount, RegistrationItem, GroupedRegistrationList, ParticipantFormPage, AppProvider } = mod.exports;
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { MemoryRouter, Routes, Route } = require('react-router');
const participant = { id: 'p1', name: 'Completed Person', email: 'person@example.com', formStatus: 'completed', inviteStatus: 'accepted', isPrimary: true };
const sample = (status, participants = [participant]) => ({ ...MY_TICKETS.find(t => t.ticketType === 'single'), entryStatus: status, participants });
const queueFor = ticket => createRegistrationQueueEntries([ticket]).filter(e => e.ticketId === ticket.id);
const entriesFor = options => buildOrders(options).flatMap(o => o.eventEntries);

test('completed participants do not inherit a ticket-level pending form', () => {
  assert.equal(queueFor(sample('pending_form'))[0].entryStatus, 'attached');
});

test('an incomplete participant does not inherit a ticket-level attached status', () => {
  assert.equal(queueFor(sample('attached', [{ ...participant, formStatus: 'not_started' }]))[0].entryStatus, 'pending_form');
});

test('tickets without an aggregate entryStatus still contribute their participant forms', () => {
  assert.equal(queueFor(sample(undefined)).length, 1);
});

test('explicit release, payment, and resubmission states are preserved', () => {
  for (const status of ['released', 'no_show', 'pending_payment', 'resubmit_required']) {
    assert.equal(queueFor(sample(status))[0].entryStatus, status);
  }
});

test('Orders repairs a legacy pending flag for an unchanged completed participant', () => {
  const ticket = MY_TICKETS.find(t => t.ticketType === 'single' && t.participants[0].formStatus === 'completed');
  const entry = { ...queueFor(ticket)[0], entryStatus: 'pending_form' };
  assert.equal(entriesFor({ registrationQueueEntries: [entry] }).find(e => e.ticket.id === ticket.id).status, 'attached');
});

test('a newly added team player needs a form even when the purchased ticket is attached', () => {
  const ticket = MY_TICKETS.find(t => t.ticketType === 'team' && t.entryStatus === 'attached');
  const player = { id: 'new-player', name: null, email: null, formStatus: 'not_started', inviteStatus: 'not_invited' };
  const entries = entriesFor({ registrationQueueEntries: createRegistrationQueueEntries(), teamPlayerRoster: { [ticket.id]: [...ticket.participants, player] } });
  assert.equal(entries.find(e => e.participantId === player.id).status, 'pending_form');
});

test('reopening a revoked or resubmission form does not restore completed fixture state', () => {
  for (const entry of [
    { entryStatus: 'pending_form', accessPath: 'pending', inviteStatus: 'not_invited', claimLinkRevoked: true },
    { entryStatus: 'resubmit_required' },
  ]) {
    assert.notEqual(hydrateParticipantFromRegistrationEntry(participant, entry).formStatus, 'completed');
  }
});

test('an invited individual and invited team player both expose Fill up', () => {
  const orders = buildOrders({ registrationQueueEntries: createRegistrationQueueEntries() });
  for (const type of ['guest', 'team']) {
    const order = orders.find(o => o.eventEntries.some(e => e.type === type && e.inviteStatus === 'invited' && e.status === 'pending_form'));
    const entry = order.eventEntries.find(e => e.type === type && e.inviteStatus === 'invited' && e.status === 'pending_form');
    const markup = renderToStaticMarkup(React.createElement(MemoryRouter, null,
      React.createElement(AppProvider, null, React.createElement(RegistrationItem, {
        entry, order, orderId: order.id, teamEntries: type === 'team' ? [entry] : [],
      }))));
    assert.match(markup, />Fill up<|>\s*Fill up\s*</, type);
  }
});

test('payment and no-show entries never ask the buyer to fill a form', () => {
  const order = buildOrders({ registrationQueueEntries: createRegistrationQueueEntries() }).find(o => o.eventEntries.some(e => e.type === 'self'));
  const original = order.eventEntries.find(e => e.type === 'self');
  for (const status of ['pending_payment', 'no_show']) {
    const entry = { ...original, status };
    const markup = renderToStaticMarkup(React.createElement(MemoryRouter, null,
      React.createElement(AppProvider, null, React.createElement(RegistrationItem, { entry, order, orderId: order.id }))));
    assert.doesNotMatch(markup, />\s*Fill up\s*</, status);
    assert.doesNotMatch(markup, />Form needed</, status);
  }
});


test('a completed form never retains the ticket-level pending progress badge', () => {
  const markup = renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(AppProvider, null, React.createElement(ParticipantFormPage, {
      ticket: { ...sample('pending_form'), status: 'pending' }, onBack() {}, onGoToTickets() {},
    }))));
  assert.match(markup, /Completed Information/);
  assert.doesNotMatch(markup, />Pending</);
});

test('the grouped Orders layout exposes the pending participant form action', () => {
  const order = buildOrders({ registrationQueueEntries: createRegistrationQueueEntries() }).find(o => o.id === 'tkt-011');
  const markup = renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(AppProvider, null, React.createElement(GroupedRegistrationList, {
      order, entries: order.eventEntries,
    }))));
  assert.match(markup, />Fill up</);
});


test('Order Details renders every team player and a Fill up action for every pending form', () => {
  const markup = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/orders/tkt-013'] },
    React.createElement(AppProvider, null,
      React.createElement(Routes, null, React.createElement(Route, {
        path: '/orders/:orderId', element: React.createElement(OrderDetailPage),
      })))));
  assert.equal((markup.match(/>Fill up</g) || []).length, 4);
  assert.doesNotMatch(markup, />Ready for gate</);
  assert.doesNotMatch(markup, />Add player</);
});

test('targeted team player form keeps the selected roster number', () => {
  const teamTicket = MY_TICKETS.find((ticket) => ticket.id === 'tkt-013');
  const markup = renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(AppProvider, null, React.createElement(ParticipantFormPage, {
      ticket: teamTicket,
      initialParticipantId: 'p7',
      playerOnly: true,
      onBack() {},
      onGoToTickets() {},
    }))));
  const routeSource = readFileSync(new URL('../src/app/routes/ParticipantFormRoute.tsx', import.meta.url), 'utf8');
  assert.match(routeSource, /participants: formParticipantsWithAccess/);
  assert.doesNotMatch(routeSource, /participants: \[selectedParticipant\]/);
  assert.match(markup, />Player 7</);
  assert.doesNotMatch(markup, />Player 1</);
});


test('returning from one team form never marks the whole team completed', () => {
  const route = readFileSync(new URL('../src/app/routes/ParticipantFormRoute.tsx', import.meta.url), 'utf8');
  const body = route.match(/const persistBuyerCompletion = \(\) => \{([\s\S]*?)\n  \};/)[1];
  let completions = 0;
  const run = new Function('ticket', 'isInvite', 'completionEntryId', 'completionAccessPath', 'completeRegistrationEntry', body);
  run({ ticketType: 'team' }, false, 'team-entry', undefined, () => completions++);
  assert.equal(completions, 0);
  run({ ticketType: 'single' }, false, 'single-entry', 'passport', () => completions++);
  assert.equal(completions, 1);
});


test('every actionable seeded registration has a reachable order', () => {
  const queue = createRegistrationQueueEntries();
  const orders = buildOrders({ registrationQueueEntries: queue });
  for (const entry of queue.filter(e => ['pending_form', 'resubmit_required'].includes(e.entryStatus))) {
    assert.ok(orders.some(o => o.eventEntries.some(e => e.ticket.id === entry.ticketId)), entry.id);
  }
});


test('Home counts group forms individually and reconciles saved guest participants', () => {
  const group = createRegistrationQueueEntries().find(e => e.id === 'guest-swim-relay');
  assert.equal(getPendingFormCount(group), 2);
  const saved = { ...group, id: 'saved-1', participantId: `${group.id}-guest-1`, guestTotalCount: undefined, entryStatus: 'attached' };
  const pending = getOrderFormActionEntries([group, saved]);
  assert.equal(pending.length, 1);
  assert.equal(getPendingFormCount(pending[0]), 1);
  const saved2 = { ...saved, id: 'saved-2', participantId: `${group.id}-guest-2` };
  assert.equal(getOrderFormActionEntries([group, saved, saved2]).length, 0);
  assert.equal(getPendingFormCount({ type: 'team', entryStatus: 'pending_form', teamTotalCount: 8, teamAttachedCount: 4 }), 4);
});
