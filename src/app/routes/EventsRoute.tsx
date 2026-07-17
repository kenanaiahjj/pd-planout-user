/**
 * Route wrapper for the Events (home) page.
 * Handles desktop peek panel vs mobile navigation.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { EventsPage } from '@/app/pages/EventsPage';
import { useAppContext } from '@/app/context/AppContext';

export function EventsRoute() {
  const navigate = useNavigate();
  const { setPeekEvent, isDesktop } = useAppContext();

  return (
    <EventsPage
      onEventSelect={(event) => {
        if (isDesktop()) {
          setPeekEvent(event);
        } else {
          navigate(`/events/${event.id}`);
        }
      }}
    />
  );
}
