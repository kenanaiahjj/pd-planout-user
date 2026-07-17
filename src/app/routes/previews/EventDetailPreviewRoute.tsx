/** Preview route for /events/1 — renders Event Detail with hardcoded event id '1'. */
import React from 'react';
import { useNavigate } from 'react-router';
import { EventDetailsPage } from '@/app/components/EventDetailsPage';
import { MOCK_EVENTS } from '@/app/data/events';
import { getOrganizerBySlug } from '@/app/data/organizers';
import { useAppContext } from '@/app/context/AppContext';

export function EventDetailPreviewRoute() {
  const navigate = useNavigate();
  const { setCheckoutIntent } = useAppContext();
  const event = MOCK_EVENTS.find((e) => e.id === '1')!;

  return (
    <EventDetailsPage
      event={event}
      onBack={() => navigate('/')}
      onOrganizerClick={(slug) => {
        const org = getOrganizerBySlug(slug);
        if (org) navigate(`/organizers/${encodeURIComponent(org.slug)}`);
      }}
      onGoToCart={() => navigate('/cart')}
      onGoToCheckout={(eventName, category, price, image, items) => {
        setCheckoutIntent({ eventName, category, price, image, items });
        navigate('/checkout');
      }}
    />
  );
}
