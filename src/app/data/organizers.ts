/**
 * @file organizers.ts
 * @description Shared organizer types and mock data for the PlanOut Sports app.
 *
 * Each organizer has profile info, stats, social links, events, and reviews.
 * When Supabase is connected, replace MOCK_ORGANIZERS with live queries.
 */

import { MOCK_EVENTS } from './events';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrganizerSocial {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'x';
  url: string;
}

export interface OrganizerReview {
  id: string;
  authorName: string;
  authorInitials: string;
  date: string;
  rating: number;
  text: string;
  images?: string[];
  reply?: {
    text: string;
  };
}

export interface OrganizerEvent {
  eventId: string;
  title: string;
  date: string;
  location: string;
  image: string;
  labels: string[];
  rating: number;
  isPast?: boolean;
}

export interface OrganizerData {
  id: string;
  name: string;
  /** Maps to the `organizer` field in EventData. */
  slug: string;
  description: string;
  email: string;
  phone: string;
  coverImage?: string;
  logoColor: string;
  logoInitials: string;
  socials: OrganizerSocial[];
  stats: {
    reviews: number;
    rating: number;
    totalEvents: number;
  };
  events: OrganizerEvent[];
  reviews: OrganizerReview[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

export const MOCK_ORGANIZERS: OrganizerData[] = [
  {
    id: 'org-1',
    name: 'City Striders',
    slug: 'City Striders',
    description:
      'City Striders is a community-driven running organization that has been hosting road races and trail events since 2015. Our mission is to make running accessible, fun, and competitive for everyone from beginners to elite athletes.',
    email: 'hello@citystriders.com',
    phone: '+63 912-345-6789',
    logoColor: '#177564',
    logoInitials: 'CS',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'tiktok', url: '#' },
      { platform: 'youtube', url: '#' },
      { platform: 'x', url: '#' },
    ],
    stats: { reviews: 2091, rating: 4.76, totalEvents: 247 },
    events: [
      {
        eventId: '1',
        title: 'City Half Marathon 2025',
        date: 'June 27, 2025 at 5:00 AM',
        location: 'City Center, Metro',
        image:
          'https://images.unsplash.com/photo-1714962747379-93714999d5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjBjcm93ZHxlbnwxfHx8fDE3NzAxODc2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Running', 'Endurance', 'Outdoor'],
        rating: 4.8,
      },
      {
        eventId: 'past-cs-1',
        title: 'Night Run 10K 2025',
        date: 'March 15, 2025 at 6:00 PM',
        location: 'Riverside Boulevard',
        image:
          'https://images.unsplash.com/photo-1692170226404-969b6e5cde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMGZpbmlzaCUyMGxpbmUlMjBydW5uZXJzfGVufDF8fHx8MTc3MTIzMTE1MXww&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Running', 'Night Run', 'Outdoor'],
        rating: 4.6,
        isPast: true,
      },
      {
        eventId: 'past-cs-2',
        title: 'Trail Ultra 50K 2024',
        date: 'November 3, 2024 at 4:00 AM',
        location: 'Mountain Ridge Trail',
        image:
          'https://images.unsplash.com/photo-1714962747379-93714999d5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjBjcm93ZHxlbnwxfHx8fDE3NzAxODc2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Trail Running', 'Ultra', 'Endurance'],
        rating: 4.9,
        isPast: true,
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Morgan Lee',
        authorInitials: 'ML',
        date: '06-28-25',
        rating: 4,
        text: '"Professional, organized and a looking forward to future events."',
      },
      {
        id: 'rev-2',
        authorName: 'Jordan Smith',
        authorInitials: 'JS',
        date: '06-28-25',
        rating: 4,
        text: '"They made the event truly special, Highly recommended!."',
        images: [
          'https://images.unsplash.com/photo-1714962747379-93714999d5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
          'https://images.unsplash.com/photo-1622241462648-1520dcc06841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
          'https://images.unsplash.com/photo-1767949055225-2e3744ffa60e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&h=200',
        ],
        reply: {
          text: 'Thank you so much for your kind words! We loved having you at our event and hope to see you again soon.',
        },
      },
      {
        id: 'rev-3',
        authorName: 'Morgan Lee',
        authorInitials: 'ML',
        date: '06-28-25',
        rating: 4,
        text: '"Professional, organized and a looking forward to future events."',
      },
      {
        id: 'rev-4',
        authorName: 'Morgan Lee',
        authorInitials: 'ML',
        date: '06-30-25',
        rating: 4,
        text: '"Professional, organized and a looking forward to future events."',
      },
      {
        id: 'rev-5',
        authorName: 'Morgan Lee',
        authorInitials: 'ML',
        date: '06-30-25',
        rating: 4,
        text: '"Professional, organized and a looking forward to future events."',
      },
    ],
  },
  {
    id: 'org-2',
    name: 'NBL Official',
    slug: 'NBL Official',
    description:
      'The official organizer of the National Basketball League. We bring world-class basketball events to fans across the country, from regular season games to the Grand Finals.',
    email: 'events@nblofficial.com',
    phone: '+63 928-456-7890',
    logoColor: '#e97a1f',
    logoInitials: 'NB',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' },
      { platform: 'x', url: '#' },
    ],
    stats: { reviews: 876, rating: 4.9, totalEvents: 134 },
    events: [
      {
        eventId: '2',
        title: 'National Basketball League Finals',
        date: 'July 10, 2025 at 7:00 PM',
        location: 'Grand Arena, Capitol',
        image:
          'https://images.unsplash.com/photo-1559369064-c4d65141e408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZSUyMGluZG9vciUyMGFyZW5hfGVufDF8fHx8MTc3MDE4NzYxMXww&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Basketball', 'Team Sports', 'Indoor'],
        rating: 4.9,
      },
      {
        eventId: 'past-nbl-1',
        title: 'NBL All-Star Weekend 2025',
        date: 'February 8, 2025 at 6:00 PM',
        location: 'Sports Dome, Capitol',
        image:
          'https://images.unsplash.com/photo-1625319130018-f55c5be2a8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdG91cm5hbWVudCUyMGluZG9vciUyMGNyb3dkfGVufDF8fHx8MTc3MTIzMTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Basketball', 'All-Star', 'Indoor'],
        rating: 4.8,
        isPast: true,
      },
    ],
    reviews: [
      {
        id: 'rev-6',
        authorName: 'Alex Rivera',
        authorInitials: 'AR',
        date: '07-12-25',
        rating: 5,
        text: '"Amazing atmosphere and world-class organization. Best basketball event I have attended!"',
      },
      {
        id: 'rev-7',
        authorName: 'Sam Torres',
        authorInitials: 'ST',
        date: '07-10-25',
        rating: 5,
        text: '"The VIP experience was worth every peso. Will definitely be back next season."',
      },
    ],
  },
  {
    id: 'org-3',
    name: 'Tennis Fed',
    slug: 'Tennis Fed',
    description:
      'Tennis Federation is the governing body for competitive tennis in the region. We organize sanctioned tournaments from grassroots level to professional-tier Grand Slam qualifiers.',
    email: 'info@tennisfed.org',
    phone: '+63 917-890-1234',
    logoColor: '#2d7c3e',
    logoInitials: 'TF',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'x', url: '#' },
    ],
    stats: { reviews: 412, rating: 4.7, totalEvents: 89 },
    events: [
      {
        eventId: '3',
        title: 'Grand Slam Tennis Open',
        date: 'August 5, 2025 at 2:00 PM',
        location: 'Green Court Club',
        image:
          'https://images.unsplash.com/photo-1761286753856-2f39b4413c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBwbGF5ZXIlMjBhY3Rpb24lMjBjb3VydxlbnwxfHx8fDE3NzAxNTE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Tennis', 'Tournament', 'Outdoor'],
        rating: 4.7,
      },
      {
        eventId: 'past-tf-1',
        title: 'Spring Open Doubles 2025',
        date: 'April 12, 2025 at 9:00 AM',
        location: 'Green Court Club',
        image:
          'https://images.unsplash.com/photo-1770046519453-83daad039dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydCUyMG91dGRvb3IlMjBtYXRjaHxlbnwxfHx8fDE3NzEyMzExNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Tennis', 'Doubles', 'Outdoor'],
        rating: 4.5,
        isPast: true,
      },
    ],
    reviews: [
      {
        id: 'rev-8',
        authorName: 'Casey Wu',
        authorInitials: 'CW',
        date: '08-06-25',
        rating: 5,
        text: '"Well-run tournament with great facilities. Umpiring was fair and professional."',
      },
    ],
  },
  {
    id: 'org-4',
    name: 'Ironman Official',
    slug: 'Ironman Official',
    description:
      'The official Ironman triathlon organizer in the Philippines. We deliver world-standard endurance events including the iconic 70.3 half-Ironman and full Ironman distance races.',
    email: 'race@ironmanofficial.ph',
    phone: '+63 933-567-8901',
    logoColor: '#c21e28',
    logoInitials: 'IM',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' },
      { platform: 'x', url: '#' },
    ],
    stats: { reviews: 1543, rating: 4.95, totalEvents: 56 },
    events: [
      {
        eventId: '9',
        title: 'Ironman 70.3 Triathlon',
        date: 'December 1, 2025 at 4:30 AM',
        location: 'Coastal Road',
        image:
          'https://images.unsplash.com/photo-1627900258552-50850df9dbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlhdGhsb24lMjBzd2ltbWluZyUyMHJ1bm5pbmclMjBjeWNsaW5nfGVufDF8fHx8MTc3MDA5MTYyNXww&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Triathlon', 'Endurance', 'Elite'],
        rating: 5.0,
      },
      {
        eventId: 'past-im-1',
        title: 'Ironman 5150 Sprint 2025',
        date: 'May 18, 2025 at 5:00 AM',
        location: 'Lakeshore Drive',
        image:
          'https://images.unsplash.com/photo-1765680670996-e9d2e24291ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlhdGhsb24lMjBzd2ltJTIwcmFjZSUyMG9jZWFufGVufDF8fHx8MTc3MTIzMTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        labels: ['Triathlon', 'Sprint', 'Beginner Friendly'],
        rating: 4.8,
        isPast: true,
      },
    ],
    reviews: [
      {
        id: 'rev-9',
        authorName: 'Jamie Reyes',
        authorInitials: 'JR',
        date: '12-03-25',
        rating: 5,
        text: '"Bucket-list race. The course, the aid stations, the crowd — everything was perfect."',
        reply: {
          text: 'Thank you, Jamie! Seeing you cross that finish line was inspiring. See you at the next race!',
        },
      },
      {
        id: 'rev-10',
        authorName: 'Pat Cruz',
        authorInitials: 'PC',
        date: '12-02-25',
        rating: 5,
        text: '"Incredible race-day experience. Safety marshals on point and course markings were crystal clear."',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find organizer by the `organizer` string used in EventData. */
export function getOrganizerBySlug(slug: string): OrganizerData | undefined {
  const normalizedSlug = slug.replace(/-/g, ' ').trim().toLowerCase();
  const found = MOCK_ORGANIZERS.find((o) => (
    o.slug.toLowerCase() === slug.trim().toLowerCase()
    || o.slug.toLowerCase() === normalizedSlug
  ));
  if (found) return found;

  // Create a dynamic fallback organizer so navigation never breaks!
  const initials = slug
    .split(/[\s.-]+/)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 3) || 'ORG';

  const matchingEvents = MOCK_EVENTS.filter((e) => e.organizer === slug).map((e) => ({
    eventId: e.id,
    title: e.title,
    date: e.date,
    location: e.location,
    image: e.image,
    labels: e.labels,
    rating: e.rating,
    isPast: e.isPast,
  }));

  // Assign a consistent color based on slug hash
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#177564', '#0f172a', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const logoColor = colors[Math.abs(hash) % colors.length];

  return {
    id: `org-dynamic-${encodeURIComponent(slug)}`,
    name: slug,
    slug: slug,
    description: `${slug} is a professional sports events organizer committed to building athletic communities and hosting premier races, leagues, and tournaments.`,
    email: `contact@${slug.toLowerCase().replace(/[^a-z0-9]/g, '') || 'organizer'}.com`,
    phone: '+63 912-345-6789',
    logoColor,
    logoInitials: initials,
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'x', url: '#' },
    ],
    stats: {
      reviews: Math.abs(hash % 450) + 120,
      rating: parseFloat((4.5 + Math.abs((hash % 10) / 20)).toFixed(2)),
      totalEvents: matchingEvents.length || 1,
    },
    events: matchingEvents,
    reviews: [
      {
        id: 'rev-dynamic-1',
        authorName: 'Chris Evans',
        authorInitials: 'CE',
        date: '2 months ago',
        rating: 5,
        text: 'Superbly managed race! Water stations were well placed and details were sent ahead of time.',
      },
    ],
  };
}

/** Find organizer by ID. */
export function getOrganizerById(id: string): OrganizerData | undefined {
  return MOCK_ORGANIZERS.find((o) => o.id === id);
}
