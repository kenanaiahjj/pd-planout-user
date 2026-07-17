/**
 * Route wrapper for the Organizer Profile page.
 * Looks up organizer by :slug param.
 */
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { OrganizerProfilePage } from '@/app/pages/OrganizerProfilePage';
import { getOrganizerBySlug } from '@/app/data/organizers';

export function OrganizerRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const organizer = slug ? getOrganizerBySlug(decodeURIComponent(slug)) : undefined;

  if (!organizer) {
    return <Navigate to="/" replace />;
  }

  return (
    <OrganizerProfilePage
      organizer={organizer}
      onBack={() => navigate('/')}
      onEventClick={(eventId) => navigate(`/events/${eventId}`)}
    />
  );
}
