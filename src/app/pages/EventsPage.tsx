/**
 * @file EventsPage.tsx
 * @description Main event discovery / home page.
 *
 * Renders the search bar, location & time filters, desktop sidebar, mobile
 * filter drawer, and a paginated grid of EventCards. Search is debounced at
 * 600 ms and results are loaded in batches of 4 with a "Load More" button.
 *
 * On mobile the full LocationDropdown is hidden — location selection lives
 * inside the MobileFilters drawer instead. On desktop the LocationDropdown
 * and time filter remain visible inline.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronDown,
  Loader2,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { useSearchParams } from 'react-router';
import { Sidebar } from '@/app/components/Sidebar';
import { MobileFilters } from '@/app/components/MobileFilters';
import { EventCard } from '@/app/components/EventCard';
import { EventCardSkeleton } from '@/app/components/EventCardSkeleton';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { LocationDropdown, type LocationItem } from '@/app/components/LocationDropdown';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import { MOCK_EVENTS, type EventData } from '@/app/data/events';
import { motion } from 'motion/react';

// ---------------------------------------------------------------------------
// Constants & Helpers
// ---------------------------------------------------------------------------

const PAGE_SIZE = 4;
const DEBOUNCE_MS = 600;

function eventSearchText(event: EventData) {
  return [
    event.title,
    event.location,
    event.organizer,
    ...event.labels,
  ]
    .join(' ')
    .toLowerCase();
}

function parseEventDate(dateStr: string): Date | null {
  try {
    const cleanStr = dateStr.split(' at ')[0];
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch (e) {
    return null;
  }
}

function matchesTimeFilter(event: EventData, filter: string): boolean {
  if (filter === 'Upcoming Events' || filter === 'Upcoming') {
    return !event.isPast;
  }

  if (filter === 'Past Events') {
    return event.isPast === true;
  }

  const eventDate = parseEventDate(event.date);
  if (!eventDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);

  const diffTime = eventDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (filter === 'Today') {
    return diffDays === 0;
  }

  if (filter === 'Tomorrow') {
    return diffDays === 1;
  }

  if (filter === 'This Weekend') {
    // Saturday (6) and Sunday (0) of the current week (Monday-Sunday)
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return (
      eventDay.getTime() === saturday.getTime() ||
      eventDay.getTime() === sunday.getTime()
    );
  }

  if (filter === 'This Week') {
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return eventDay >= monday && eventDay <= sunday;
  }

  if (filter === 'Next Week') {
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + diffToMonday + 7);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return eventDay >= nextMonday && eventDay <= nextSunday;
  }

  if (filter === 'This Month') {
    return (
      eventDay.getMonth() === today.getMonth() &&
      eventDay.getFullYear() === today.getFullYear()
    );
  }

  return true;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface EventsPageProps {
  /** Called when a user taps an event card to view its details. */
  onEventSelect: (event: EventData) => void;
}

export function EventsPage({ onEventSelect }: EventsPageProps) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  // Search state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Lifted location state (shared between MobileFilters & desktop dropdown)
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [locationRadius, setLocationRadius] = useState(10);

  // MobileFilters drawer open state
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sidebar filter state (desktop & mobile synced)
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Upcoming Events');

  const handleToggleFilter = useCallback((option: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSelectedFilters(new Set());
    setSelectedTimeFilter('Upcoming Events');
  }, []);

  const handleClearAllFiltersAndLocation = useCallback(() => {
    setSelectedFilters(new Set());
    setSelectedTimeFilter('Upcoming Events');
    setSelectedLocation(null);
  }, []);

  // Total applied filter count (sidebar + location)
  const timeFilterActive = selectedTimeFilter !== 'Upcoming Events';
  const totalAppliedCount =
    selectedFilters.size + (timeFilterActive ? 1 : 0) + (selectedLocation ? 1 : 0);

  const activeFilters = useMemo(() => {
    const list: string[] = [];
    if (timeFilterActive) list.push(selectedTimeFilter);
    selectedFilters.forEach(f => list.push(f));
    return list;
  }, [selectedFilters, selectedTimeFilter, timeFilterActive]);

  const activeLocationLabel = selectedLocation
    ? selectedLocation.city === 'Current Location'
      ? 'Near Me'
      : selectedLocation.city
    : null;

  const eventPool = useMemo(
    () => selectedTimeFilter === 'Past Events'
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((event) => !event.isPast),
    [selectedTimeFilter],
  );

  // -----------------------------------------------------------------------
  // Extract custom tags dynamically from discovery events list
  // -----------------------------------------------------------------------
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    eventPool.forEach(event => {
      event.labels.forEach(label => {
        tags.add(label);
      });
    });
    return Array.from(tags).sort();
  }, [eventPool]);

  // -----------------------------------------------------------------------
  // Debounce search input
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (searchQuery !== debouncedQuery) setIsLoading(true);

    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsLoading(false);
      setVisibleCount(PAGE_SIZE); // Reset pagination on new search
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedQuery]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedFilters, selectedLocation, selectedTimeFilter]);

  // -----------------------------------------------------------------------
  // Dynamic faceted counts calculation
  // -----------------------------------------------------------------------
  const filterCounts = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    const counts: Record<string, number> = {};

    const timeOptions = [
      'Upcoming Events', 'Today', 'This Weekend', 'Next Week',
      'Tomorrow', 'This Week', 'This Month', 'Upcoming', 'Past Events'
    ];
    timeOptions.forEach(opt => { counts[opt] = 0; });
    availableTags.forEach(tag => { counts[tag] = 0; });

    MOCK_EVENTS.forEach(event => {
      const text = eventSearchText(event);
      const matchesSearch = !q || text.includes(q);

      let matchesLocation = true;
      if (selectedLocation && selectedLocation.city !== 'Current Location') {
        const eventLoc = event.location.toLowerCase();
        const cityLower = selectedLocation.city.toLowerCase();
        const provLower = selectedLocation.province.toLowerCase();
        matchesLocation = eventLoc.includes(cityLower) || eventLoc.includes(provLower);
      }

      if (!matchesSearch || !matchesLocation) return;

      // Time counts: event must match the selected tags, if any are selected
      const hasSelectedTags = selectedFilters.size === 0 || event.labels.some(label => selectedFilters.has(label));
      if (hasSelectedTags) {
        timeOptions.forEach(opt => {
          if (matchesTimeFilter(event, opt)) counts[opt] = (counts[opt] || 0) + 1;
        });
      }

      // Tag counts: event must match active time filter
      if (matchesTimeFilter(event, selectedTimeFilter)) {
        event.labels.forEach(label => {
          counts[label] = (counts[label] || 0) + 1;
        });
      }
    });

    return counts;
  }, [debouncedQuery, selectedLocation, selectedTimeFilter, selectedFilters, availableTags]);

  // -----------------------------------------------------------------------
  // Filtering + pagination
  // -----------------------------------------------------------------------
  const filteredEvents = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    return eventPool.filter((event) => {
      const text = eventSearchText(event);
      const matchesSearch = !q || text.includes(q);

      let matchesLocation = true;
      if (selectedLocation && selectedLocation.city !== 'Current Location') {
        const eventLoc = event.location.toLowerCase();
        const cityLower = selectedLocation.city.toLowerCase();
        const provLower = selectedLocation.province.toLowerCase();
        matchesLocation = eventLoc.includes(cityLower) || eventLoc.includes(provLower);
      }

      if (!matchesSearch || !matchesLocation) return false;

      // Time Filter
      if (!matchesTimeFilter(event, selectedTimeFilter)) return false;

      // Tags Filter (OR logic within tag set)
      if (selectedFilters.size > 0 && !event.labels.some(label => selectedFilters.has(label))) {
        return false;
      }

      return true;
    });
  }, [debouncedQuery, selectedLocation, selectedTimeFilter, selectedFilters, eventPool]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;
  const resultLabel = filteredEvents.length === 1 ? 'event' : 'events';

  /** Simulate a network delay then reveal the next batch. */
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 800);
  };

  return (
    <div className="flex max-w-full flex-col gap-4 pb-28 sm:gap-5 sm:pb-8">
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-[28px] font-semibold leading-none tracking-[-0.8px] text-[#111827] sm:text-[34px]">
          Events
        </h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-[96px] flex flex-col gap-4">
            <div>
              <h2 className="text-[17px] font-semibold text-[#181d27]">Filters</h2>
            </div>
            <Sidebar
              selectedFilters={selectedFilters}
              onToggleFilter={handleToggleFilter}
              selectedTimeFilter={selectedTimeFilter}
              onTimeFilterChange={setSelectedTimeFilter}
              onClearAll={handleClearAllFilters}
              filterCounts={filterCounts}
              availableTags={availableTags}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1 flex flex-col gap-4 sm:gap-5">
          <section className="rounded-[20px] border border-slate-100/80 bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                    <input
                      type="search"
                      inputMode="search"
                      enterKeyHint="search"
                      autoComplete="off"
                      aria-label="Search events, sports, or organizers"
                  placeholder="Search events, sports, organizers..."
                  className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-10 text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#177564] focus:ring-1 focus:ring-[#177564]/20 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.015)]"
                  style={{ color: '#181d27' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#177564]" />
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setDebouncedQuery('');
                      }}
                      className="rounded-full p-1 text-[#94a3b8] transition-colors hover:bg-[#e2e8f0] hover:text-[#475569]"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Mobile Filter Drawer Button (Visible on mobile only next to search) */}
              <div className="lg:hidden shrink-0">
                <MobileFilters
                  open={filtersOpen}
                  onOpenChange={setFiltersOpen}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  radius={locationRadius}
                  onRadiusChange={setLocationRadius}
                  selectedFilters={selectedFilters}
                  onToggleFilter={handleToggleFilter}
                  selectedTimeFilter={selectedTimeFilter}
                  onTimeFilterChange={setSelectedTimeFilter}
                  onClearAll={handleClearAllFilters}
                  filterCounts={filterCounts}
                  resultCount={filteredEvents.length}
                  availableTags={availableTags}
                />
              </div>
            </div>

            <div className="mt-3 hidden w-full sm:block">
              <LocationDropdown
                value={selectedLocation}
                onChange={setSelectedLocation}
                radiusValue={locationRadius}
                onRadiusChange={setLocationRadius}
              />
            </div>
          </section>

          {totalAppliedCount > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-[12px] font-semibold text-[#177564]">
                Active:
              </span>

              {activeFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    if (filter === selectedTimeFilter) {
                      setSelectedTimeFilter('Upcoming Events');
                    } else {
                      handleToggleFilter(filter);
                    }
                  }}
                  className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d9e8e5] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#475569] transition-colors hover:border-[#bfe5de] hover:text-[#177564]"
                >
                  {filter}
                  <X className="h-3 w-3 text-[#94a3b8] transition-colors group-hover:text-[#177564]" />
                </button>
              ))}

              {activeLocationLabel && (
                <button
                  type="button"
                  onClick={() => setSelectedLocation(null)}
                  className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#fde68a] bg-[#fffbeb] px-2.5 py-1.5 text-[12px] font-semibold text-[#92400e] transition-colors hover:bg-[#fef3c7]"
                >
                  <MapPin className="h-3 w-3" />
                  {activeLocationLabel}
                  <X className="h-3 w-3 text-[#d97706] transition-colors group-hover:text-[#92400e]" />
                </button>
              )}

              <button
                type="button"
                onClick={handleClearAllFiltersAndLocation}
                className="inline-flex shrink-0 items-center rounded-full border border-dashed border-[#d1d5db] px-2.5 py-1.5 text-[12px] font-semibold text-[#94a3b8] transition-colors hover:border-[#9ca3af] hover:text-[#475569]"
              >
                Clear all ({totalAppliedCount})
              </button>
            </div>
          )}

          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </div>
            ) : visibleEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {visibleEvents.map((event) => (
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
                      onClick={() => onEventSelect(event)}
                    />
                  ))}
                </div>

                <div className="pt-2 flex flex-col items-center gap-3">
                  <p className="text-[13px] font-medium text-[#64748b]">
                    Showing {visibleEvents.length} of {filteredEvents.length} {resultLabel}
                  </p>
                  {hasMore && (
                    <SecondaryButton
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      compact
                      className="rounded-full px-5 py-2.5 text-[13px]"
                    >
                      {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin text-[#177564]" />}
                      {isLoadingMore ? 'Loading events' : 'Load more events'}
                    </SecondaryButton>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-[18px] border border-[#d9e8e5] bg-white px-5 py-10 text-center shadow-[0_16px_38px_-34px_rgba(15,23,42,0.46)]">
                <EmptyStateGraphic kind="no-search-results" className="h-36 w-36" />
                <p className="mt-2 text-[18px] font-semibold tracking-[-0.3px] text-[#181d27]">
                  No events found
                </p>
                <p className="mx-auto mt-1 max-w-[320px] text-[13px] leading-relaxed text-[#64748b]">
                  {debouncedQuery
                    ? `Nothing matched "${debouncedQuery}" with the current filters.`
                    : 'No active events match the current filters.'}
                </p>
                <PrimaryButton
                  type="button"
                  onClick={handleClearAllFiltersAndLocation}
                  compact
                  className="mt-5 rounded-[12px] text-[13px]"
                >
                  Reset filters
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
