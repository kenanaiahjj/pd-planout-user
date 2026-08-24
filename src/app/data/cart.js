/**
 * Cart transformations shared by the event ticket flow and CartPage.
 * Keeping this boundary pure makes it harder for event identity to disappear
 * between the ticket picker and the cart UI.
 */

export function createCartEventFromAddition({
  eventId,
  eventName,
  date,
  location,
  image,
  items,
}) {
  return {
    id: `evt-${eventId}`,
    eventName,
    date,
    location,
    items: items.map((item) => ({
      id: `item-${eventId}-${item.ticketId}`,
      name: item.category,
      tier: 'Event entry',
      price: item.price,
      quantity: item.qty,
      image: item.image || image,
    })),
  };
}

export function mergeCartEvents(cart, addition) {
  const existingEvent = cart.find((event) => event.id === addition.id);
  if (!existingEvent) return [...cart, addition];

  return cart.map((event) => {
    if (event.id !== addition.id) return event;

    const existingItems = new Map(event.items.map((item) => [item.id, item]));
    for (const item of addition.items) {
      const existingItem = existingItems.get(item.id);
      existingItems.set(
        item.id,
        existingItem
          ? { ...existingItem, quantity: existingItem.quantity + item.quantity }
          : item,
      );
    }

    return { ...event, items: [...existingItems.values()] };
  });
}

export function getCartAdditionDescription(eventName, items) {
  const ticketSummary = items
    .map((item) => `${item.category}${item.qty > 1 ? ` ×${item.qty}` : ''}`)
    .join(', ');

  return `${ticketSummary} · ${eventName}`;
}

export const INITIAL_CART = [
  {
    id: 'evt-1',
    eventName: 'NegOr50•50 Series 2: NUTRI-RUN 65',
    date: 'Jul 4, 2026',
    location: 'Quezon Park, Dumaguete City, Negros Oriental',
    items: [
      {
        id: 'item-1',
        name: '65K Ultramarathon Entry (Solo)',
        tier: 'Regular Registration',
        wave: 'Wave 1',
        price: 1500.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1759674915081-b38844dbb613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjBjcm93ZHxlbnwxfHx8fDE3NzAxODc2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        countdownEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        id: 'item-2',
        name: 'NORSPORTS Event Tee 2026',
        price: 499.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1759503407492-e45b8dd0d5e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBldmVudCUyMHRzaGlydCUyMG1lcmNoYW5kaXNlfGVufDF8fHx8MTc3MDg3NzI2NHww&ixlib=rb-4.1.0&q=80&w=1080',
        holdingEnd: new Date(Date.now() + 4000),
      },
    ],
  },
  {
    id: 'evt-2',
    eventName: 'Pickleball Coaching Certification Series',
    date: 'Jun 5, 2026',
    location: 'Araw Sports Club Dumaguete, Valencia, Negros Oriental',
    items: [
      {
        id: 'item-3',
        name: 'Coaching Certification Course Ticket',
        tier: 'Standard Pass',
        price: 1250.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1687216769793-833dcfe4e3af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZSUyMHRpY2tldHMlMjBhcmVuYXxlbnwxfHx8fDE3NzA4NzcyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        countdownEnd: new Date(Date.now() + 3 * 60 * 60 * 1000),
        holdingEnd: new Date(Date.now() + 8 * 60 * 1000),
      },
    ],
  },
];
