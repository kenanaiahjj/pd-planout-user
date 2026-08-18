import test from 'node:test';
import assert from 'node:assert/strict';

test('maps selected event tickets into a cart event with event identity', async () => {
  const { createCartEventFromAddition } = await import('../src/app/data/cart.js');

  assert.deepEqual(
    createCartEventFromAddition({
      eventId: '3',
      eventName: 'Grand Slam Tennis Open',
      date: 'August 1, 2026 at 7:00 AM',
      location: 'Green Court Club, Dumaguete City',
      image: 'event-image.jpg',
      items: [
        {
          ticketId: 'guided-Beginner-Single-15-30',
          qty: 1,
          category: 'Beginner Single - 15-30',
          price: 950,
          image: '',
        },
      ],
    }),
    {
      id: 'evt-3',
      eventName: 'Grand Slam Tennis Open',
      date: 'August 1, 2026 at 7:00 AM',
      location: 'Green Court Club, Dumaguete City',
      items: [
        {
          id: 'item-3-guided-Beginner-Single-15-30',
          name: 'Beginner Single - 15-30',
          tier: 'Event entry',
          price: 950,
          quantity: 1,
          image: 'event-image.jpg',
        },
      ],
    },
  );
});

test('merges repeated additions instead of duplicating the same cart line', async () => {
  const { mergeCartEvents } = await import('../src/app/data/cart.js');
  const existing = [
    {
      id: 'evt-3',
      eventName: 'Grand Slam Tennis Open',
      date: 'August 1, 2026 at 7:00 AM',
      location: 'Green Court Club, Dumaguete City',
      items: [
        {
          id: 'item-3-guided-Beginner-Single-15-30',
          name: 'Beginner Single - 15-30',
          tier: 'Event entry',
          price: 950,
          quantity: 1,
          image: 'event-image.jpg',
        },
      ],
    },
  ];

  const addition = {
    ...existing[0],
    items: [{ ...existing[0].items[0], quantity: 1 }],
  };

  const merged = mergeCartEvents(existing, addition);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].items.length, 1);
  assert.equal(merged[0].items[0].quantity, 2);
});
