/**
 * Route wrapper for Event Detail page.
 * Looks up event by :eventId param from MOCK_EVENTS.
 */
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { EventDetailsPage } from '@/app/components/EventDetailsPage';
import { MOCK_EVENTS } from '@/app/data/events';
import { getOrganizerBySlug } from '@/app/data/organizers';
import { useAppContext } from '@/app/context/AppContext';

export function EventDetailRoute() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setCheckoutIntent } = useAppContext();

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
      onGoToCart={() => navigate('/cart')}
      onGoToCheckout={(eventName, category, price, image, items) => {
        setCheckoutIntent({ eventName, category, price, image, items });
        navigate('/checkout');
      }}
    />
  );
}
