/**
 * @file ProfilePage.tsx
 * @description User profile page matching Figma reference — cover image,
 * centered avatar, stats, social links, and tabbed content (Events Attended
 * and Certificates). Uses Figma assets for cover/avatar/event images.
 */

import React, { useState } from 'react';
import {
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Search,
  Award,
  X,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { EventCard } from '@/app/components/EventCard';
import { SegmentedChoice } from '@/app/components/SegmentedChoice';
import { useAppContext } from '@/app/context/AppContext';
import { motion } from 'motion/react';

import imgCover from '@/assets/42dc5919595bba34125ab191d040552aeef17365.png';
import imgAvatar from '@/assets/abde7b942aa982263d4cf69ea8ef217b427c3047.png';
import imgEvent1 from '@/assets/9dd246725291ca31eadbba57f65fc35c16ef8f44.png';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProfilePageProps {
  onEventSelect?: (eventId: string) => void;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const PROFILE = {
  name: 'Jessica Sanchez',
  title: 'Trail Runner & Photographer',
  location: 'San Francisco, CA',
  bio: "Hey there! I'm Jessica, a trail runner and adventure photographer who believes the best stories are written with muddy boots and a racing heart. I've completed over 30 trail races including three ultra-marathons.",
  stats: {
    events: 32,
    followers: '1.2k',
    following: 850,
  },
};

interface AttendedEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  eventDates?: string[];
  dailySchedule?: Array<{ date: string; startTime: string; endTime: string }>;
  location: string;
  organizer: string;
  rating: number;
  labels: string[];
  image: string;
}

const ATTENDED_EVENTS: AttendedEvent[] = [
  {
    id: 'past-1',
    title: 'Canlaon Marathon 2025',
    date: 'June 27, 2025 at 4:00 AM',
    location: 'Canlaon City Sports Complex, Philippines',
    organizer: 'Intl. Athletics Org',
    rating: 4.9,
    labels: ['Marathon', 'Outdoor'],
    image: imgEvent1,
  },
  {
    id: 'past-2',
    title: 'San Francisco Trail Ultra',
    date: 'May 14, 2025 at 5:30 AM',
    location: 'Golden Gate Park, San Francisco',
    organizer: 'Bay Area Runners',
    rating: 4.7,
    labels: ['Ultra', 'Trail'],
    image: 'https://images.unsplash.com/photo-1566147592116-5e51b670137a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbCUyMHJ1bm5pbmclMjBtb3VudGFpbiUyMHJhY2V8ZW58MXx8fHwxNzcwODg2NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'past-3',
    title: 'Pacific Coast Triathlon',
    date: 'March 2, 2025 at 6:00 AM',
    location: 'Santa Cruz Beach, California',
    organizer: 'TriSports Federation',
    rating: 4.6,
    labels: ['Triathlon', 'Outdoor'],
    image: 'https://images.unsplash.com/photo-1746972170711-7b0933491066?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlhdGhsb24lMjBvY2VhbiUyMHN3aW0lMjByYWNlfGVufDF8fHx8MTc3MDg4NjYzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'past-4',
    title: 'Mountain Cycling Challenge',
    date: 'January 18, 2025 at 7:00 AM',
    location: 'Marin Headlands, California',
    organizer: 'CycleSport Inc.',
    rating: 4.5,
    labels: ['Cycling', 'Mountain'],
    image: 'https://images.unsplash.com/photo-1720749407269-b92e86cffb68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcmFjZSUyMG91dGRvb3IlMjByb2FkfGVufDF8fHx8MTc3MDg4NjYzMnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

interface Certificate {
  id: string;
  title: string;
  issuer: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: '1',
    title: 'Advanced Trail Running Safety',
    issuer: 'Issued by Mountain Safety Council • May 2024',
  },
  {
    id: '2',
    title: 'Sports First Aid Level 2',
    issuer: 'Issued by Red Cross • March 2024',
  },
  {
    id: '3',
    title: 'Wilderness Photography',
    issuer: 'Issued by NatGeo Expedition • Jan 2024',
  },
  {
    id: '4',
    title: 'Marathon Pace Strategy',
    issuer: 'Issued by RunCoach Academy • Nov 2023',
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SocialButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.05 }}
      type="button"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-[#f8fafc] border border-slate-200/60 flex items-center justify-center text-slate-400 hover:bg-[#f1f5f9] hover:text-slate-700 transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.015)]"
    >
      {children}
    </motion.button>
  );
}

function CertificateRow({ cert }: { cert: Certificate }) {
  return (
    <div className="p-1 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.02)] transition-all duration-300">
      <div className="bg-white rounded-[12px] px-4 py-4 flex items-center gap-3.5 border border-slate-200/30">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-amber-500/8 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/10">
          <Award className="w-5.5 h-5.5" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-slate-800 text-[14.5px] font-bold leading-[1.3] tracking-tight truncate">
            {cert.title}
          </h4>
          <p className="text-slate-400 text-[12px] font-semibold leading-normal mt-0.5 truncate">
            {cert.issuer}
          </p>
        </div>

        {/* Share */}
        <motion.button 
          whileTap={{ scale: 0.92 }}
          type="button"
          aria-label={`Share ${cert.title}`}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
        >
          <Share2 className="w-4.5 h-4.5" />
        </motion.button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ProfilePage({ onEventSelect }: ProfilePageProps) {
  const { userProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState<'events' | 'certificates'>('events');
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = userProfile.name || PROFILE.name;

  return (
    <div className="flex flex-col pb-6 -mx-4 sm:-mx-8 -mt-6 sm:-mt-12">
      {/* ---- Cover Image ---- */}
      <div className="relative h-[200px] w-full bg-slate-900 overflow-hidden">
        <ImageWithFallback
          src={imgCover}
          alt="Profile cover"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* ---- Profile Card ---- */}
      <div className="relative mx-4 sm:mx-8 -mt-[70px] z-10">
        {/* Shell */}
        <div className="p-1 bg-slate-100/40 rounded-[22px] border border-slate-200/30 shadow-[var(--shadow-premium)]">
          {/* Core */}
          <div className="bg-white rounded-[18px] px-5 pt-4 pb-6 border border-slate-200/50">
            {/* Avatar */}
            <div className="flex justify-center -mt-[90px] mb-4">
              <div className="w-[130px] h-[130px] rounded-full overflow-hidden border-[4px] border-white shadow-md bg-gray-100">
                <ImageWithFallback
                  src={userProfile.avatarUrl || imgAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <h1 className="text-slate-800 text-[23px] font-bold leading-[30px] tracking-[-0.5px] text-center">
              {displayName}
            </h1>

            {/* Title + Location */}
            <div className="flex flex-col items-center gap-0.5 mt-1.5">
              <span className="text-[#177564] text-[13.5px] font-bold leading-none tracking-tight text-center">
                {PROFILE.title}
              </span>
              <span className="text-slate-400 text-[13px] font-medium mt-1 leading-none">
                {PROFILE.location}
              </span>
            </div>

            {/* Bio */}
            <p className="text-slate-600 text-[13.5px] leading-relaxed text-center mt-4 max-w-[340px] mx-auto font-medium">
              {PROFILE.bio}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-10 mt-6 pt-5 border-t border-slate-100">
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-800 text-[17px] font-bold tracking-tight">
                  {PROFILE.stats.events}
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[1px]">
                  Events
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-800 text-[17px] font-bold tracking-tight">
                  {PROFILE.stats.followers}
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[1px]">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-800 text-[17px] font-bold tracking-tight">
                  {PROFILE.stats.following}
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[1px]">
                  Following
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <SocialButton label="Facebook"><Facebook className="w-4 h-4" /></SocialButton>
              <SocialButton label="Instagram"><Instagram className="w-4 h-4" /></SocialButton>
              <SocialButton label="Twitter"><Twitter className="w-4 h-4" /></SocialButton>
              <SocialButton label="YouTube"><Youtube className="w-4 h-4" /></SocialButton>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Tab Switcher + Search ---- */}
      <div className="px-4 sm:px-8 mt-6 flex flex-col gap-4 items-center">
        <SegmentedChoice
          size="sm"
          value={activeTab}
          onChange={setActiveTab}
          columnsClass="grid-cols-2 max-w-[346px]"
          options={[
            { value: 'events', label: 'Events Attended' },
            { value: 'certificates', label: 'Certificates' },
          ]}
        />

        {/* Search */}
        <div className="relative w-full max-w-[346px] group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            aria-label={activeTab === 'events' ? 'Search events' : 'Search certificates'}
            placeholder={activeTab === 'events' ? "Search events..." : "Search certificates..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-10 text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#177564] focus:ring-1 focus:ring-[#177564]/20 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.015)]"
            style={{ color: '#181d27' }}
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="rounded-full p-1 text-[#94a3b8] transition-colors hover:bg-[#e2e8f0] hover:text-[#475569] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---- Tab Content ---- */}
      <div className="px-4 sm:px-8 mt-5">
        {activeTab === 'events' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {ATTENDED_EVENTS.filter((e) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                e.title.toLowerCase().includes(q) ||
                e.location.toLowerCase().includes(q) ||
                e.organizer.toLowerCase().includes(q) ||
                e.labels.some((b) => b.toLowerCase().includes(q))
              );
            }).map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                endDate={event.endDate}
                eventDates={event.eventDates}
                dailySchedule={event.dailySchedule}
                location={event.location}
                organizer={event.organizer}
                rating={event.rating}
                labels={event.labels}
                image={event.image}
                onClick={() => onEventSelect?.(event.id)}
              />
            ))}

            {searchQuery &&
              ATTENDED_EVENTS.filter((e) => {
                const q = searchQuery.toLowerCase();
                return (
                  e.title.toLowerCase().includes(q) ||
                  e.location.toLowerCase().includes(q) ||
                  e.organizer.toLowerCase().includes(q) ||
                  e.labels.some((b) => b.toLowerCase().includes(q))
                );
              }).length === 0 && (
                <div className="md:col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.015)]">
                  <p className="text-slate-600 text-[14.5px] font-semibold">No events found</p>
                  <p className="text-slate-400 text-[12px] font-medium mt-1">Try a different search term</p>
                </div>
              )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CERTIFICATES.filter((c) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                c.title.toLowerCase().includes(q) ||
                c.issuer.toLowerCase().includes(q)
              );
            }).map((cert) => (
              <CertificateRow key={cert.id} cert={cert} />
            ))}

            {searchQuery &&
              CERTIFICATES.filter((c) => {
                const q = searchQuery.toLowerCase();
                return (
                  c.title.toLowerCase().includes(q) ||
                  c.issuer.toLowerCase().includes(q)
                );
              }).length === 0 && (
                <div className="md:col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.015)]">
                  <p className="text-slate-600 text-[14.5px] font-semibold">No certificates found</p>
                  <p className="text-slate-400 text-[12px] font-medium mt-1">Try a different search term</p>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  );
}
