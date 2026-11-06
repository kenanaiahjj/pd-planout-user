/**
 * @file EventCard.tsx
 * @description Event discovery card shown in the Events page list.
 *
 * Displays event media, date/session metadata, location, organizer, rating,
 * and the PlanOut Passport check-in relationship.
 */

import React from 'react';
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Star,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  formatEventDate,
  formatEventDateRange,
  formatEventSessionListLabel,
} from '@/app/data/eventDate';

interface EventCardProps {
  title: string;
  date: string;
  endDate?: string;
  eventDates?: string[];
  dailySchedule?: Array<{ date: string; startTime: string; endTime: string }>;
  location: string;
  organizer: string;
  rating: number;
  labels: string[];
  image?: string;
  onClick?: () => void;
}

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2240%22%20height%3D%2240%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.5%22%20fill%3D%22%23d9e8e5%22%2F%3E%3C%2Fpattern%3E%3ClinearGradient%20id%3D%22grad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20style%3D%22stop-color%3A%23f8fafc%3Bstop-opacity%3A1%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20style%3D%22stop-color%3A%23def2ee%3Bstop-opacity%3A1%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grad)%22%2F%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%20opacity%3D%220.55%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2252%25%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2252%22%20fill%3D%22%23177564%22%20text-anchor%3D%22middle%22%20font-weight%3D%22700%22%3EPlanOut%3C%2Ftext%3E%3C%2Fsvg%3E";

export function EventCard({
  title = 'Event Title',
  date = 'Date TBD',
  endDate,
  eventDates,
  location = 'Location TBD',
  organizer = 'Organizer Name',
  rating = 0,
  labels,
  image,
  onClick,
}: Partial<EventCardProps>) {
  const hasMultipleSessions = Boolean(eventDates && eventDates.length > 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`planout-event-card group w-full rounded-[14px] border bg-white p-3 text-left transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/25 focus-visible:ring-offset-2 active:scale-[0.995] sm:p-3.5 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex gap-4 sm:gap-5">
        <div className="planout-event-card__media relative h-[112px] w-[116px] shrink-0 overflow-hidden bg-[#f1f2f0] sm:h-[124px] sm:w-[152px]">
          <ImageWithFallback
            src={image || fallbackImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          <div className="min-w-0 relative pr-6">
            {labels?.[0] && (
              <span className="mb-1 inline-flex w-fit rounded-[5px] bg-[#f1f2f0] px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#62665f]">
                {labels[0]}
              </span>
            )}
            <h3 className="planout-event-card__title line-clamp-2 pr-2 text-[16px] font-semibold leading-[1.22] text-slate-800 transition-colors group-hover:text-slate-950 sm:text-[18px]">
              {title}
            </h3>
            <ArrowUpRight className="absolute right-0 top-0.5 h-4 w-4 text-slate-400 transition-colors group-hover:text-[#177564]" strokeWidth={2} />
            <div className="mt-1 flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[11px] font-medium text-[#6c7069]">{organizer}</span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6c7069]">
                <Star className="h-2.5 w-2.5 fill-[#bd7a21] text-[#bd7a21]" strokeWidth={1.8} />
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex min-w-0 items-start gap-2">
              <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#858980]" strokeWidth={1.8} />
              <div className="min-w-0">
                {hasMultipleSessions ? (
                  <p className="whitespace-normal text-[12px] font-medium leading-[17px] text-[#42463f]">
                    {formatEventSessionListLabel(eventDates ?? [])}
                  </p>
                ) : endDate ? (
                  <p className="whitespace-normal text-[12px] font-medium leading-[17px] text-[#42463f]">
                    {formatEventDateRange(date, endDate)}
                  </p>
                ) : (
                  <p className="whitespace-normal text-[12px] font-medium leading-[17px] text-[#42463f]">
                    {formatEventDate(date)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#858980]" strokeWidth={1.8} />
              <span className="truncate text-[12px] font-medium leading-[17px] text-[#42463f]">
                {location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
