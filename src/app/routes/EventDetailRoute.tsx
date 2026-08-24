/**
 * Route wrapper for Event Detail page.
 * Looks up event by :eventId param from MOCK_EVENTS.
 */
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { EventDetailsPage } from '@/app/components/EventDetailsPage';
import { MOCK_EVENTS } from '@/app/data/events';
import { getOrganizerBySlug } from '@/app/data/organizers';
import { getCartAdditionDescription } from '@/app/data/cart.js';
import { useAppContext } from '@/app/context/AppContext';
import { toast } from 'sonner';

export function EventDetailRoute() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setCheckoutIntent, addCartItems } = useAppContext();

  const event = MOCK_EVENTS.find((e) => e.id === eventId);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  return (
    <EventDetailsPage
      event={event}
      onBack={() => navigate(-1)}
      onOrganizerClick={(slug) => {
        const org = getOrganizerBySlug(slug);
        if (org) {
          navigate(`/organizers/${encodeURIComponent(org.slug)}`);
        }
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
      }}
      onGoToCheckout={(eventName, category, price, image, items) => {
        setCheckoutIntent({ eventName, category, price, image, items });
        navigate('/checkout');
      }}
    />
  );
}
