import test from 'node:test';
import assert from 'node:assert/strict';

let orderPricing = {};
try {
  orderPricing = await import('../src/app/data/orderPricing.js');
} catch {
  // The red test below reports the missing pricing aggregation behavior.
}

const teamEntry = (id, participantIndex) => ({
  id: `${id}-p${participantIndex}`,
  type: 'team',
  ticket: {
    id,
    eventTitle: 'Dumaguete Futsal Cup Season 4',
    ticketTypeName: 'Team of 8',
  },
  entryName: `Dumaguete Futsal Cup Season 4 - Team of 8 · Player ${participantIndex}`,
  price: 5200,
});

test('a team purchase creates one financial line regardless of player slot count', () => {
  assert.equal(typeof orderPricing.getOrderEventLineItems, 'function');
  assert.equal(typeof orderPricing.getOrderEventSubtotal, 'function');

  if (typeof orderPricing.getOrderEventLineItems !== 'function' || typeof orderPricing.getOrderEventSubtotal !== 'function') return;

  const entries = [teamEntry('tkt-013', 1), teamEntry('tkt-013', 2), teamEntry('tkt-013', 3)];
  entries.push({
    id: 'single-p1',
    type: 'self',
    ticket: { id: 'single', eventTitle: 'Solo event', ticketTypeName: '10K' },
    entryName: 'Solo event - 10K',
    price: 1500,
  });

  assert.deepEqual(orderPricing.getOrderEventLineItems(entries), [
    {
      id: 'tkt-013-team-purchase',
      label: 'Dumaguete Futsal Cup Season 4 - Team of 8',
      amount: 5200,
    },
    { id: 'single-p1', label: 'Solo event - 10K', amount: 1500 },
  ]);
  assert.equal(orderPricing.getOrderEventSubtotal(entries), 6700);
});

test('team order detail is represented by one registration card with a compact player summary', () => {
  assert.equal(typeof orderPricing.getOrderRegistrationEntries, 'function');
  assert.equal(typeof orderPricing.getTeamOrderSummary, 'function');

  if (typeof orderPricing.getOrderRegistrationEntries !== 'function' || typeof orderPricing.getTeamOrderSummary !== 'function') return;

  const entries = Array.from({ length: 8 }, (_, index) => ({
    id: `tkt-013-p${index + 1}`,
    type: 'team',
    accessPath: index < 4 ? 'guest_qr' : 'pending',
    teamAttachedCount: 4,
    teamTotalCount: 8,
    ticket: {
      id: 'tkt-013',
      eventTitle: 'Dumaguete Futsal Cup Season 4',
      ticketTypeName: 'Team of 8',
    },
  }));

  assert.equal(orderPricing.getOrderRegistrationEntries(entries).length, 1);
  assert.deepEqual(orderPricing.getTeamOrderSummary(entries), {
    title: 'Dumaguete Futsal Cup Season 4 - Team of 8',
    setUpCount: 4,
    totalCount: 8,
    statusLabel: '4 of 8 player entries set up',
  });
});
