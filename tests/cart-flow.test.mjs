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

test('keeps additions separate when an event ID collides with a different cart event', async () => {
  const { createCartEventFromAddition, mergeCartEvents } = await import('../src/app/data/cart.js');
  const existing = [
    {
      id: 'evt-2',
      eventName: 'Pickleball Coaching Certification Series',
      date: 'June 5, 2026',
      location: 'Araw Sports Club Dumaguete',
      items: [{ id: 'item-3', name: 'Coaching Certification Course Ticket', quantity: 1 }],
    },
  ];
  const addition = createCartEventFromAddition({
    eventId: '2',
    eventName: 'National Basketball League Finals',
    date: 'November 6, 2026 at 7:00 PM',
    location: 'Grand Arena, Quezon City',
    image: 'basketball.jpg',
    items: [{ ticketId: 'guided-Beginner-Double-Male-15-below', qty: 1, category: 'Beginner Double Male - 15 & below', price: 1000 }],
  });

  const merged = mergeCartEvents(existing, addition);

  assert.equal(merged.length, 2);
  assert.equal(merged[0].eventName, 'Pickleball Coaching Certification Series');
  assert.equal(merged[1].eventName, 'National Basketball League Finals');
  assert.equal(merged[1].items[0].name, 'Beginner Double Male - 15 & below');
});

test('repeated additions to a colliding event merge into its own cart group', async () => {
  const { createCartEventFromAddition, mergeCartEvents } = await import('../src/app/data/cart.js');
  const existing = [
    { id: 'evt-2', eventName: 'Pickleball Coaching Certification Series', items: [] },
  ];
  const addition = createCartEventFromAddition({
    eventId: '2',
    eventName: 'National Basketball League Finals',
    date: 'November 6, 2026 at 7:00 PM',
    location: 'Grand Arena, Quezon City',
    image: 'basketball.jpg',
    items: [{ ticketId: 'guided-Beginner-Double-Male-15-below', qty: 1, category: 'Beginner Double Male - 15 & below', price: 1000 }],
  });

  const firstAddition = mergeCartEvents(existing, addition);
  const repeatedAddition = mergeCartEvents(firstAddition, addition);

  assert.equal(repeatedAddition.length, 2);
  assert.equal(repeatedAddition[1].eventName, 'National Basketball League Finals');
  assert.equal(repeatedAddition[1].items.length, 1);
  assert.equal(repeatedAddition[1].items[0].quantity, 2);
});

test('selected cart items carry their event date and location into checkout', async () => {
  const { getSelectedCartCheckoutItems } = await import('../src/app/data/cart.js');
  const items = getSelectedCartCheckoutItems(
    [
      {
        id: 'evt-2-national-basketball-league-finals',
        eventName: 'National Basketball League Finals',
        date: 'Friday, November 6, 2026 at 7:00 PM',
        location: 'Grand Arena, Quezon City, Metro Manila',
        items: [
          {
            id: 'item-2-guided-Beginner-Double-Male-15-below',
            name: 'Beginner Double Male - 15 & below',
            price: 1000,
            quantity: 1,
            image: 'basketball.jpg',
          },
        ],
      },
    ],
    new Set(['item-2-guided-Beginner-Double-Male-15-below']),
  );

  assert.deepEqual(items, [
    {
      ticketId: 'item-2-guided-Beginner-Double-Male-15-below',
      qty: 1,
      category: 'Beginner Double Male - 15 & below',
      price: 1000,
      eventName: 'National Basketball League Finals',
      eventDate: 'Friday, November 6, 2026 at 7:00 PM',
      eventLocation: 'Grand Arena, Quezon City, Metro Manila',
      image: 'basketball.jpg',
    },
  ]);
});
