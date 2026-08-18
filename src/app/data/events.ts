/**
 * @file events.ts
 * @description Shared event types and mock data for the PlanOut Sports app.
 *
 * This module centralizes the `EventData` interface and the `MOCK_EVENTS`
 * dataset so every page that needs event information imports from one place.
 * When Supabase is connected, replace `MOCK_EVENTS` with a live query while
 * keeping the same `EventData` shape.
 */

import imgCanlaonMarathon from '@/assets/9dd246725291ca31eadbba57f65fc35c16ef8f44.png';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Optional organizer-owned palette for event pages and desktop peek. */
export interface EventBrandTheme {
  accent?: string;
  accentDark?: string;
  accentSoft?: string;
  accentWash?: string;
  pageBackground?: string;
  pageBackgroundTo?: string;
  pageForeground?: string;
  pageMuted?: string;
  pageSubtle?: string;
  surface?: string;
  surfaceForeground?: string;
  surfaceMuted?: string;
  surfaceBorder?: string;
  ctaFrom?: string;
  ctaTo?: string;
  textOnAccent?: string;
}

/** Core shape of an event used across all pages (discovery, detail, cart). */
export interface EventData {
  id: string;
  title: string;
  date: string;
  /** Optional end date for multi-day events (same format as `date`). */
  endDate?: string;
  /**
   * Optional array of specific dates for non-consecutive multi-day events.
   * When present, the event happens only on these listed dates (not every day
   * in the range). Each entry uses the same format as `date`.
   */
  eventDates?: string[];
  /**
   * Optional per-day schedule for consecutive multi-day events with varying
   * times. Each entry describes one day's time window. Use alongside `endDate`.
   * When absent, the times from `date` and `endDate` are assumed to apply
   * uniformly across all days.
   */
  dailySchedule?: Array<{ date: string; startTime: string; endTime: string }>;
  location: string;
  organizer: string;
  rating: number;
  labels: string[];
  image?: string;
  /** Organizer/event-owned brand colors for the event page surface. */
  brand?: EventBrandTheme;
  /** If true, this event has already ended and is no longer accepting registrations. */
  isPast?: boolean;
  /** If true, the organizer requires participant forms to be completed before payment/checkout. */
  requireFormsBeforeCheckout?: boolean;
}

// ---------------------------------------------------------------------------
// Helper functions for dynamic relative dates
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatEventDate(date: Date, timeStr: string): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${timeStr}`;
}

export const EVENT_BRANDS = {
  stride: {
    accent: '#c4513f',
    accentDark: '#7f2a22',
    accentSoft: '#f4d3ca',
    accentWash: '#fff4f0',
    pageBackground: '#9c7770',
    pageBackgroundTo: '#625f34',
    ctaFrom: '#f58b62',
    ctaTo: '#b83a31',
  },
  arena: {
    accent: '#a95b19',
    accentDark: '#62320c',
    accentSoft: '#f7dcc0',
    accentWash: '#fff7ed',
    pageBackground: '#5b3037',
    pageBackgroundTo: '#8f2030',
    ctaFrom: '#f4a340',
    ctaTo: '#a04b12',
  },
  court: {
    accent: '#5e7f1f',
    accentDark: '#304510',
    accentSoft: '#dfe9bf',
    accentWash: '#f8fbec',
    pageBackground: '#596d35',
    pageBackgroundTo: '#202b18',
    ctaFrom: '#c6d95a',
    ctaTo: '#59791e',
  },
  aquatic: {
    accent: '#246fa8',
    accentDark: '#143c67',
    accentSoft: '#cfe4f6',
    accentWash: '#f0f7ff',
    pageBackground: '#163f64',
    pageBackgroundTo: '#0e6277',
    ctaFrom: '#58b5df',
    ctaTo: '#1f6098',
  },
  velo: {
    accent: '#8b6f12',
    accentDark: '#4a3906',
    accentSoft: '#ece1aa',
    accentWash: '#fbf7df',
    pageBackground: '#6b5a1f',
    pageBackgroundTo: '#343114',
    ctaFrom: '#d8b83d',
    ctaTo: '#7a6210',
  },
  football: {
    accent: '#22694d',
    accentDark: '#123b2c',
    accentSoft: '#cce4d8',
    accentWash: '#f0f8f3',
    pageBackground: '#174734',
    pageBackgroundTo: '#0f2d24',
    ctaFrom: '#55b77b',
    ctaTo: '#1f6047',
  },
  beach: {
    accent: '#0f7890',
    accentDark: '#0b4050',
    accentSoft: '#c7e7ec',
    accentWash: '#eefafb',
    pageBackground: '#27656d',
    pageBackgroundTo: '#7b6c3d',
    ctaFrom: '#47c1c5',
    ctaTo: '#0c6f84',
  },
  shuttle: {
    accent: '#6f4ea1',
    accentDark: '#3d2b67',
    accentSoft: '#ded2f0',
    accentWash: '#f6f1fb',
    pageBackground: '#4c355b',
    pageBackgroundTo: '#241c35',
    ctaFrom: '#a88ddf',
    ctaTo: '#67479a',
  },
  island: {
    accent: '#147d73',
    accentDark: '#0b4842',
    accentSoft: '#c8e7e1',
    accentWash: '#eefaf7',
    pageBackground: '#2f6c67',
    pageBackgroundTo: '#123f3a',
    ctaFrom: '#4fc0ac',
    ctaTo: '#117268',
  },
  heritage: {
    accent: '#7d3f22',
    accentDark: '#432112',
    accentSoft: '#ead0c2',
    accentWash: '#fbf2ee',
    pageBackground: '#6d493a',
    pageBackgroundTo: '#322118',
    ctaFrom: '#c57a4c',
    ctaTo: '#74361d',
  },
};

export function getTodayDate(timeStr: string): string {
  return formatEventDate(new Date(), timeStr);
}

export function getTomorrowDate(timeStr: string): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatEventDate(d, timeStr);
}

export function getWeekendDayDate(dayIndex: 6 | 0, timeStr: string): string {
  // dayIndex: 6 for Saturday, 0 for Sunday
  const d = new Date();
  const currentDay = d.getDay();
  // We assume the week starts on Monday (1) and ends on Sunday (0)
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const startOfWeek = new Date();
  startOfWeek.setDate(d.getDate() + diffToMonday);
  
  const targetDate = new Date(startOfWeek);
  if (dayIndex === 6) {
    targetDate.setDate(startOfWeek.getDate() + 5);
  } else {
    targetDate.setDate(startOfWeek.getDate() + 6);
  }
  return formatEventDate(targetDate, timeStr);
}

export function getNextWeekDayDate(dayOffsetFromMonday: number, timeStr: string): string {
  // dayOffsetFromMonday: 0 for Mon, 1 for Tue, ..., 6 for Sun
  const d = new Date();
  const currentDay = d.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const startOfNextWeek = new Date();
  startOfNextWeek.setDate(d.getDate() + diffToMonday + 7);
  
  const targetDate = new Date(startOfNextWeek);
  targetDate.setDate(startOfNextWeek.getDate() + dayOffsetFromMonday);
  return formatEventDate(targetDate, timeStr);
}

export function getFutureDate(offsetDays: number, timeStr: string): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatEventDate(d, timeStr);
}

export function getPastDate(offsetDays: number, timeStr: string): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return formatEventDate(d, timeStr);
}

// ---------------------------------------------------------------------------
// Mock Data — Sports events with dynamic relative dates and real cities
// ---------------------------------------------------------------------------
export const MOCK_EVENTS: EventData[] = [
  {
    id: '1',
    title: "NegOr50•50 Series 2: NUTRI-RUN 65",
    date: getTodayDate("5:00 AM"),
    location: "Quezon Park, Dumaguete City, Negros Oriental",
    organizer: "NORSPORTS",
    rating: 4.8,
    labels: ["Running", "Ultramarathon", "Outdoor"],
    image: "https://images.unsplash.com/photo-1714962747379-93714999d5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjBjcm93ZHxlbnwxfHx8fDE3NzAxODc2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    requireFormsBeforeCheckout: true
  },
  {
    id: '2',
    title: "National Basketball League Finals",
    date: getTomorrowDate("7:00 PM"),
    location: "Grand Arena, Quezon City, Metro Manila",
    organizer: "NBL Official",
    rating: 4.9,
    labels: ["Basketball", "Team Sports", "Indoor"],
    brand: EVENT_BRANDS.arena,
    image: "https://images.unsplash.com/photo-1559369064-c4d65141e408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZSUyMGluZG9vciUyMGFyZW5hfGVufDF8fHx8MTc3MDE4NzYxMXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '3',
    title: "Grand Slam Tennis Open",
    date: getWeekendDayDate(6, "2:00 PM"),
    endDate: getWeekendDayDate(0, "6:00 PM"),
    location: "Green Court Club, Taguig, Metro Manila",
    organizer: "Tennis Fed",
    rating: 4.7,
    labels: ["Tennis", "Tournament", "Outdoor"],
    brand: EVENT_BRANDS.court,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBwbGF5ZXIlMjBhY3Rpb24lMjBjb3VydHxlbnwxfHx8fDE3NzAxNTE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '4',
    title: "Regional Swimming Championship",
    date: getWeekendDayDate(0, "8:00 AM"),
    eventDates: [
      getWeekendDayDate(0, "8:00 AM"),
      getFutureDate(8, "8:00 AM"),
      getFutureDate(12, "8:00 AM"),
    ],
    location: "Aquatic Center, Cebu City, Cebu",
    organizer: "Swim Stars",
    rating: 4.6,
    labels: ["Swimming", "Aquatics", "Indoor", "Training"],
    image: "https://images.unsplash.com/photo-1707401252805-9019f342604b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMGNvbXBldGl0aW9uJTIwcG9vbHxlbnwxfHx8fDE3NzAxODc2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '5',
    title: "Tour de City Cycling Race",
    date: getNextWeekDayDate(1, "6:00 AM"), // Next Tuesday
    location: "Mountain Trail, Baguio, Benguet",
    organizer: "Velo Club",
    rating: 4.8,
    labels: ["Cycling", "Endurance", "Outdoor"],
    brand: EVENT_BRANDS.velo,
    image: "https://images.unsplash.com/photo-1586280246643-9e2f01e3c14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcmFjZSUyMHJvYWQlMjBiaWtlc3xlbnwxfHx8fDE3NzAwOTE2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '6',
    title: "Premier Soccer Cup",
    date: getNextWeekDayDate(5, "4:00 PM"), // Next Saturday
    location: "Cebu Stadium, Cebu City, Cebu",
    organizer: "Football Assoc.",
    rating: 4.9,
    labels: ["Soccer", "Team Sports", "Stadium"],
    brand: EVENT_BRANDS.football,
    image: "https://images.unsplash.com/photo-1698844013403-b7c4cf0d3b2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBtYXRjaCUyMHN0YWRpdW18ZW58MXx8fHwxNzcwMDg1OTUwfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '7',
    title: "Beach Volleyball Open",
    date: getNextWeekDayDate(6, "9:00 AM"), // Next Sunday
    location: "Sunset Beach, Boracay, Malay, Aklan",
    organizer: "Beach Volley Pro",
    rating: 4.7,
    labels: ["Volleyball", "Beach", "Outdoor"],
    brand: EVENT_BRANDS.beach,
    image: "https://images.unsplash.com/photo-1628314200733-5f7785cdc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHZvbGxleWJhbGwlMjBtYXRjaHxlbnwxfHx8fDE3NzAxODc2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '8',
    title: "Badminton Doubles Tournament",
    date: getFutureDate(20, "10:00 AM"),
    location: "Smash Arena, Pasig, Metro Manila",
    organizer: "Shuttlecock Club",
    rating: 4.5,
    labels: ["Badminton", "Racquet", "Indoor", "Fitness"],
    brand: EVENT_BRANDS.shuttle,
    image: "https://images.unsplash.com/photo-1640267461512-38f3f6b1b102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBkb3VibGVzJTIwbWF0Y2h8ZW58MXx8fHwxNzcwMTg3NjEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '9',
    title: "Apo Island Open Water Swim",
    date: getFutureDate(25, "6:00 AM"),
    location: "Apo Island, Dauin, Negros Oriental",
    organizer: "Swim Philippines",
    rating: 4.7,
    labels: ["Swimming", "Aquatics", "Outdoor"],
    image: "https://images.unsplash.com/photo-1707401252805-9019f342604b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjB5b2dhJTIwcmV0cmVhdCUyMGJlYWNofGVufDF8fHx8MTc3MDk1NzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },

  // Past events
  {
    id: 'luma-framer-vibes',
    title: "Building Websites from 0 to 1 with Framer & Vibes (AI)",
    date: "September 27, 2025 at 9:00 AM",
    location: "University of San Carlos - Talamban Campus, Cebu City, Philippines",
    organizer: "Art San Diego",
    rating: 4.8,
    labels: ["Workshop", "Design", "AI", "Framer"],
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,anim=false,background=white,quality=75,width=1920,height=1920/event-covers/6g/94b1b636-8579-46b2-b9c2-e942cab57166.png",
    isPast: true,
  },
  {
    id: 'past-1',
    title: "Canlaon Marathon 2025",
    date: getPastDate(5, "4:00 AM"),
    location: "Canlaon City Sports Complex, Negros Oriental",
    organizer: "Intl. Athletics Org",
    rating: 4.9,
    labels: ["Marathon", "Outdoor"],
    brand: EVENT_BRANDS.heritage,
    image: imgCanlaonMarathon,
    isPast: true,
  },
  {
    id: 'past-2',
    title: "Valencia Ridge Trail Ultra 2025",
    date: getPastDate(12, "5:30 AM"),
    location: "Mount Talinis Trail, Valencia, Negros Oriental",
    organizer: "NORSPORTS",
    rating: 4.7,
    labels: ["Ultra", "Trail", "Outdoor"],
    brand: EVENT_BRANDS.stride,
    image: "https://images.unsplash.com/photo-1566147592116-5e51b670137a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbCUyMHJ1bm5pbmclMjBtb3VudGFpbiUyMHJhY2V8ZW58MXx8fHwxNzcwODg2NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    isPast: true,
  },
  {
    id: 'past-3',
    title: "Apo Island Open Water Swim 2025",
    date: getPastDate(20, "6:00 AM"),
    location: "Apo Island, Dauin, Negros Oriental",
    organizer: "Swim Philippines",
    rating: 4.6,
    labels: ["Swimming", "Outdoor"],
    brand: EVENT_BRANDS.island,
    image: "https://images.unsplash.com/photo-1746972170711-7b0933491066?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlhdGhsb24lMjBvY2VhbiUyMHN3aW0lMjByYWNlfGVufDF8fHx8MTc3MDg4NjYzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    isPast: true,
  },
  {
    id: 'past-4',
    title: "Sibulan Mountain Bike Enduro 2025",
    date: getPastDate(30, "7:00 AM"),
    location: "Balili Park trails, Sibulan, Negros Oriental",
    organizer: "Sibulan Cycling Club",
    rating: 4.5,
    labels: ["Cycling", "Mountain", "Outdoor"],
    brand: EVENT_BRANDS.velo,
    image: "https://images.unsplash.com/photo-1720749407269-b92e86cffb68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcmFjZSUyMG91dGRvb3IlMjByb2FkfGVufDF8fHx8MTc3MDg4NjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    isPast: true,
  },
];
