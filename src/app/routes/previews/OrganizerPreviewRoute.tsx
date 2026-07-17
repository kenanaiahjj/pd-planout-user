/** Preview route for /organizers/city-striders — renders Organizer Profile for 'City Striders'. */
import React from 'react';
import { useNavigate } from 'react-router';
import { OrganizerProfilePage } from '@/app/pages/OrganizerProfilePage';
import { getOrganizerBySlug } from '@/app/data/organizers';

export function OrganizerPreviewRoute() {
  const navigate = useNavigate();
  const organizer = getOrganizerBySlug('City Striders')!;

  return (
    <OrganizerProfilePage
      organizer={organizer}
      onBack={() => navigate('/')}
      onEventClick={(eventId) => navigate(`/events/${eventId}`)}
    />
  );
}
