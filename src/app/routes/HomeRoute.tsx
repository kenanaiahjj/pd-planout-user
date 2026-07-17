/**
 * Route wrapper for the Home (landing) page.
 * Handles navigation to events (with optional search query) and event detail/peek.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { HomePage } from '@/app/pages/HomePage';
import { useAppContext } from '@/app/context/AppContext';

export function HomeRoute() {
  const navigate = useNavigate();
  const { setPeekEvent, isDesktop, userProfile } = useAppContext();

  return (
    <HomePage
      userName={userProfile.name}
      onEventSelect={(event) => {
        if (isDesktop()) {
          setPeekEvent(event);
        } else {
          navigate(`/events/${event.id}`);
        }
      }}
      onGoToEvents={(query?: string) => {
        if (query) {
          navigate(`/events?q=${encodeURIComponent(query)}`);
        } else {
          navigate('/events');
        }
      }}
    />
  );
}
