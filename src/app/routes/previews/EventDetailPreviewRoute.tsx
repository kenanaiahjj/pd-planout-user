/** Preview route for /events/1 — renders Event Detail with hardcoded event id '1'. */
import React from 'react';
import { useNavigate } from 'react-router';
import { EventDetailsPage } from '@/app/components/EventDetailsPage';
import { MOCK_EVENTS } from '@/app/data/events';
import { getOrganizerBySlug } from '@/app/data/organizers';
import { useAppContext } from '@/app/context/AppContext';
import { getCartAdditionDescription } from '@/app/data/cart.js';
import { toast } from 'sonner';

export function EventDetailPreviewRoute() {
  const navigate = useNavigate();
  const { setCheckoutIntent, addCartItems } = useAppContext();
  const event = MOCK_EVENTS.find((e) => e.id === '1')!;

  return (
    <EventDetailsPage
      event={event}
      onBack={() => navigate('/')}
      onOrganizerClick={(slug) => {
        const org = getOrganizerBySlug(slug);
        if (org) navigate(`/organizers/${encodeURIComponent(org.slug)}`);
      }}
      onGoToCart={(items) => {
        if (!items?.length) return;

        addCartItems({
          eventId: event.id,
          eventName: event.title,
          date: event.date,
          location: event.location,
          image: event.image || '',
          items,
        });
        toast.success('Added to cart', {
          description: getCartAdditionDescription(event.title, items),
        });
        navigate('/cart');
      }}
      onGoToCheckout={(eventName, category, price, image, items) => {
        setCheckoutIntent({ eventName, category, price, image, items });
        navigate('/checkout');
      }}
    />
  );
}
