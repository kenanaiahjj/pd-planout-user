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

const MONTH_ABBR: Record<string, string> = {
  January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr',
  May: 'May', June: 'Jun', July: 'Jul', August: 'Aug',
  September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec',
};

function abbrevDate(dateStr: string) {
  return dateStr.replace(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g,
    (m) => MONTH_ABBR[m] ?? m,
  );
}

function dateParts(date?: string) {
  if (!date) return { month: 'TBA', day: '--', dateOnly: 'Date TBA', time: 'Time TBA' };
  const [dateOnly, time = 'Time TBA'] = date.split(' at ');
  const [month = 'TBA', day = '--'] = dateOnly.split(/\s+/);

  return {
    month: month.slice(0, 3).toUpperCase(),
    day: day.replace(',', ''),
    dateOnly: abbrevDate(dateOnly),
    time,
  };
}

function dateRangeLabel(startDate: string, endDate: string) {
  const parse = (value: string) => {
    const dateOnly = value.split(' at ')[0];
    const match = dateOnly.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
    if (!match) return null;

    return {
      month: MONTH_ABBR[match[1]] ?? match[1],
      day: match[2],
      year: match[3],
      fallback: abbrevDate(dateOnly),
    };
  };

  const start = parse(startDate);
  const end = parse(endDate);

  if (!start || !end) {
    return `${abbrevDate(startDate.split(' at ')[0])} - ${abbrevDate(endDate.split(' at ')[0])}`;
  }

  if (start.year === end.year && start.month === end.month) {
    return `${start.month} ${start.day}-${end.day}, ${start.year}`;
  }

  if (start.year === end.year) {
    return `${start.month} ${start.day} - ${end.month} ${end.day}, ${start.year}`;
  }

  return `${start.fallback} - ${end.fallback}`;
}

function sessionDateListLabel(dates: string[]) {
  const labels = dates.slice(0, 3).map((value) => {
    const dateOnly = value.split(' at ')[0];
    const match = dateOnly.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+\d{4}$/);
    if (!match) return abbrevDate(dateOnly);

    return `${MONTH_ABBR[match[1]] ?? match[1]} ${match[2]}`;
  });

  const remainingCount = dates.length - labels.length;
  const suffix = remainingCount > 0 ? ` +${remainingCount}` : '';
  return `${dates.length} sessions · ${labels.join(', ')}${suffix}`;
}

export function EventCard({
  title = 'Event Title',
  date = 'Date TBD',
  endDate,
  eventDates,
  location = 'Location TBD',
  organizer = 'Organizer Name',
  rating = 0,
  image,
  onClick,
}: Partial<EventCardProps>) {
  const start = dateParts(date);
  const end = endDate ? dateParts(endDate) : null;
  const hasMultipleSessions = Boolean(eventDates && eventDates.length > 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border border-slate-100/80 bg-white p-4 text-left shadow-[0_2px_8px_rgba(15,23,42,0.01)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-slate-50/30 hover:border-slate-200/50 hover:shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:scale-[1.005] focus:outline-none active:scale-[0.99] sm:p-5 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex gap-4 sm:gap-5">
        <div className="relative h-[142px] w-[104px] shrink-0 overflow-hidden rounded-[14px] bg-slate-100 sm:h-[166px] sm:w-[146px]">
          <ImageWithFallback
            src={image || fallbackImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-start gap-3.5">
          <div className="min-w-0 relative pr-6">
            <h3 className="line-clamp-2 text-[17.5px] sm:text-[20px] font-bold leading-[1.2] tracking-[-0.4px] text-slate-800 pr-2 transition-colors group-hover:text-slate-900">
              {title}
            </h3>
            <ArrowUpRight className="absolute right-0 top-0.5 h-4.5 w-4.5 text-slate-400/80 transition-all duration-300 ease-out group-hover:text-[#177564] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.2} />
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="truncate text-[12px] font-semibold text-slate-400">{organizer}</span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-slate-400">
                <Star className="h-2.5 w-2.5 fill-[#f59e0b] text-[#f59e0b]" strokeWidth={1.8} />
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.8} />
              <div className="min-w-0">
                {hasMultipleSessions ? (
                  <p className="truncate text-[13px] font-semibold leading-[18px] text-slate-600">
                    {sessionDateListLabel(eventDates ?? [])}
                  </p>
                ) : end ? (
                  <p className="truncate text-[13px] font-semibold leading-[18px] text-slate-600">
                    {dateRangeLabel(date, endDate)}
                  </p>
                ) : (
                  <p className="truncate text-[13px] font-semibold leading-[18px] text-slate-600">
                    {start.dateOnly} at {start.time}
                  </p>
                )}
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.8} />
              <span className="truncate text-[13px] font-semibold leading-[18px] text-slate-600">
                {location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
