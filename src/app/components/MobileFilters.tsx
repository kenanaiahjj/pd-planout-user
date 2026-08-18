/**
 * @file MobileFilters.tsx
 * @description Mobile-only filter bottom sheet (Vaul drawer) with:
 *  - Location search & radius slider at the top
 *  - Chip-style toggleable filter options with counts
 *  - Active-filter badge on the trigger
 *  - Sticky footer with Reset / Show Results actions
 *
 * The drawer's open state and location state are lifted to the parent
 * (EventsPage) so a compact location pill can also control them.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Drawer } from 'vaul';
import * as Slider from '@radix-ui/react-slider';
import {
  SlidersHorizontal,
  X,
  CalendarDays,
  RotateCcw,
  Sparkles,
  MapPin,
  Navigation,
  Search,
  Tag,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PH_LOCATIONS, type LocationItem } from './LocationDropdown';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { SegmentedChoice } from './SegmentedChoice';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MobileFiltersProps {
  /** Controlled open state for the drawer. */
  open: boolean;
  /** Callback to change drawer open state. */
  onOpenChange: (open: boolean) => void;
  /** Currently selected location (lifted state). */
  selectedLocation: LocationItem | null;
  /** Callback when location changes. */
  onLocationChange: (loc: LocationItem | null) => void;
  /** Current radius in km (lifted state). */
  radius: number;
  /** Callback when radius changes. */
  onRadiusChange: (r: number) => void;

  // Synced state props
  selectedFilters: Set<string>;
  onToggleFilter: (option: string) => void;
  selectedTimeFilter: string;
  onTimeFilterChange: (option: string) => void;
  onClearAll: () => void;
  filterCounts: Record<string, number>;
  resultCount: number;
  availableTags: string[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MobileFilters({
  open,
  onOpenChange,
  selectedLocation,
  onLocationChange,
  radius,
  onRadiusChange,
  selectedFilters,
  onToggleFilter,
  selectedTimeFilter,
  onTimeFilterChange,
  onClearAll,
  filterCounts,
  resultCount,
  availableTags,
}: MobileFiltersProps) {
  // Location search text (local to drawer)
  const [locationSearch, setLocationSearch] = useState('');
  const [isTriggerHovered, setIsTriggerHovered] = useState(false);

  // Derived counts
  const timeFilterActive = selectedTimeFilter !== 'Upcoming Events';
  const totalSelected =
    selectedFilters.size + (timeFilterActive ? 1 : 0) + (selectedLocation ? 1 : 0);

  // Toggle a single chip option
  const toggle = useCallback((groupId: string, option: string) => {
    if (groupId === 'time') {
      const targetTime = option === 'Upcoming' ? 'Upcoming Events' : option;
      if (selectedTimeFilter === targetTime) {
        onTimeFilterChange('Upcoming Events');
      } else {
        onTimeFilterChange(targetTime);
      }
    } else {
      onToggleFilter(option);
    }
  }, [selectedTimeFilter, onTimeFilterChange, onToggleFilter]);

  // Reset all filters (including location)
  const resetAll = useCallback(() => {
    onClearAll();
    onLocationChange(null);
    setLocationSearch('');
  }, [onClearAll, onLocationChange]);

  // Location helpers
  const filteredLocations = PH_LOCATIONS.filter((loc) => {
    if (!locationSearch) return true;
    return (
      loc.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
      loc.province.toLowerCase().includes(locationSearch.toLowerCase())
    );
  });

  const handleNearMe = () => {
    onLocationChange({ city: 'Current Location', province: 'Near Me' });
    setLocationSearch('');
  };

  const handleSelectCity = (loc: LocationItem) => {
    onLocationChange(loc);
    setLocationSearch('');
  };

  // Reset location search when drawer opens
  const handleOpenChange = (v: boolean) => {
    if (v) setLocationSearch('');
    onOpenChange(v);
  };

  return (
    <Drawer.Root open={open} onOpenChange={handleOpenChange}>
      {/* ---- Trigger button ---- */}
      <Drawer.Trigger asChild>
        <motion.button
          type="button"
          aria-label="Open event filters"
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsTriggerHovered(true)}
          onMouseLeave={() => setIsTriggerHovered(false)}
          style={{
            background: isTriggerHovered
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 250, 0.45) 50%, rgba(204, 251, 241, 0.7) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 253, 250, 0.3) 50%, rgba(204, 251, 241, 0.5) 100%)',
            border: isTriggerHovered
              ? '1px solid rgba(255, 255, 255, 0.95)'
              : '1px solid rgba(255, 255, 255, 0.75)',
            boxShadow: isTriggerHovered
              ? '0 6px 16px rgba(15, 23, 42, 0.055), inset 0 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 3px rgba(23, 117, 100, 0.08)'
              : '0 3px 10px rgba(15, 23, 42, 0.03), inset 0 1.5px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 2px rgba(23, 117, 100, 0.04)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="lg:hidden flex items-center justify-center w-[40px] h-[40px] text-[#177564] rounded-[13px] relative shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-4.5 h-4.5" strokeWidth={1.9} />
          {totalSelected > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#177564] text-white text-[9px] font-extrabold rounded-full px-1 border border-white shadow-[0_2px_6px_rgba(23,117,100,0.25)]">
              {totalSelected}
            </span>
          )}
        </motion.button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-[2px]" />

        <Drawer.Content className="bg-slate-50 flex flex-col rounded-t-[24px] max-h-[85vh] fixed bottom-0 left-0 right-0 z-50 outline-none shadow-[0_-8px_40px_rgba(0,0,0,0.12)] fixed-bottom-ios overflow-hidden">
          
          {/* ---- Frosted Header ---- */}
          <div className="shrink-0 backdrop-blur-md bg-white/90 border-b border-black/[0.04] pt-3 pb-3">
            <div className="flex justify-center mb-2">
              <div className="w-9 h-[5px] rounded-full bg-neutral-300" />
            </div>
            <div className="flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <Drawer.Title className="text-[#181d27] text-[19px] font-semibold tracking-[-0.3px]">
                  Filters
                </Drawer.Title>
                {totalSelected > 0 && (
                  <span className="inline-flex items-center gap-1 bg-[#177564]/10 text-[#177564] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {totalSelected} active
                  </span>
                )}
              </div>
              <Drawer.Description className="sr-only">
                Adjust filters to find specific events.
              </Drawer.Description>
              <Drawer.Close asChild>
                <motion.button 
                  type="button"
                  aria-label="Close event filters"
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors cursor-pointer border border-neutral-200/20"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </Drawer.Close>
            </div>
          </div>

          {/* ---- Scrollable filter sections ---- */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="flex flex-col gap-6">

              {/* ============ LOCATION SECTION ============ */}
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11.5px] font-bold uppercase tracking-[1.5px] text-slate-400">
                      Location
                    </span>
                  </div>
                  {selectedLocation && (
                    <button
                      onClick={() => {
                        onLocationChange(null);
                        setLocationSearch('');
                      }}
                      className="text-[#177564] text-[11px] font-bold uppercase tracking-wide hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  {selectedLocation && (
                    <div className="flex">
                      <span className="inline-flex items-center gap-1.5 bg-[#177564] text-white text-[12px] font-bold px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(23,117,100,0.15)] leading-none">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedLocation.city === 'Current Location'
                          ? 'Near Me'
                          : selectedLocation.city}
                        <span className="text-white/75 text-[10.5px] font-medium ml-1">({radius} km)</span>
                      </span>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.985 }}
                    onClick={handleNearMe}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all font-bold text-[13px] cursor-pointer outline-none ${
                      selectedLocation?.city === 'Current Location'
                        ? 'bg-[#177564] text-white shadow-[0_2px_8px_rgba(23,117,100,0.15)]'
                        : 'text-[#177564] bg-[#177564]/8 hover:bg-[#177564]/12'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    Use my current location
                  </motion.button>

                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 pl-9.5 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#177564] focus:ring-1 focus:ring-[#177564]/20 transition-all font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      style={{ color: '#181d27' }}
                      placeholder="Search city or province..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                    />
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <div className="flex justify-between items-center mb-2.5">
                      <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                        Search Radius
                      </label>
                      <span className="text-[12.5px] font-bold text-[#177564] bg-[#177564]/8 px-2 py-0.5 rounded-md">{radius} km</span>
                    </div>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                      value={[radius]}
                      max={100}
                      min={1}
                      step={1}
                      onValueChange={(v) => onRadiusChange(v[0])}
                    >
                      <Slider.Track className="bg-slate-100 relative grow rounded-full h-[4px]">
                        <Slider.Range className="absolute bg-[#177564] rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb
                        className="block w-5 h-5 bg-white border border-black/[0.04] shadow-[0_2.5px_6px_rgba(0,0,0,0.15),0_0.5px_1.5px_rgba(0,0,0,0.1)] rounded-full focus:outline-none cursor-grab active:cursor-grabbing transition-transform active:scale-110"
                        aria-label="Radius"
                      />
                    </Slider.Root>
                  </div>

                  <div className="max-h-[140px] overflow-y-auto rounded-xl border border-slate-100 bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.01)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="p-1 space-y-0.5">
                      {filteredLocations.length === 0 ? (
                        <div className="text-sm text-slate-400 py-4 text-center">
                          No locations found
                        </div>
                      ) : (
                        filteredLocations.map((loc) => {
                          const isSelected = selectedLocation?.city === loc.city;
                          return (
                            <motion.button
                              whileTap={{ scale: 0.99 }}
                              key={loc.city}
                              onClick={() => handleSelectCity(loc)}
                              className={`w-full text-left px-3.5 py-2 rounded-lg text-sm transition-colors flex items-center justify-between cursor-pointer outline-none ${
                                isSelected
                                  ? 'bg-[#177564]/8 text-[#177564]'
                                  : 'hover:bg-slate-100/60 text-slate-700'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span
                                  className={`font-semibold ${
                                    isSelected ? 'text-[#177564]' : 'text-neutral-800'
                                  }`}
                                >
                                  {loc.city}
                                </span>
                                <span
                                  className={`text-xs ${
                                    isSelected ? 'text-[#177564]/80' : 'text-slate-400'
                                  }`}
                                >
                                  {loc.province}
                                </span>
                              </div>
                              {isSelected && <MapPin className="w-3.5 h-3.5 text-[#177564]" />}
                            </motion.button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ TIME & DATE SECTION ============ */}
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11.5px] font-bold uppercase tracking-[1.5px] text-slate-400">
                      Time & Date
                    </span>
                  </div>
                  {timeFilterActive && (
                    <button
                      onClick={() => onTimeFilterChange('Upcoming Events')}
                      className="text-[#177564] text-[11px] font-bold uppercase tracking-wide hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  <SegmentedChoice
                    size="sm"
                    value={selectedTimeFilter}
                    onChange={onTimeFilterChange}
                    columnsClass="grid-cols-3 max-w-none"
                    className="rounded-xl"
                    wrapLabels
                    options={[
                      { value: 'Upcoming Events', label: 'Upcoming' },
                      { value: 'Today', label: 'Today' },
                      { value: 'This Weekend', label: 'Weekend' },
                      { value: 'Next Week', label: 'Next Week' },
                      { value: 'Past Events', label: 'Past' },
                    ]}
                  />
                </div>
              </div>

              {/* ============ DYNAMIC TAGS SECTION ============ */}
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11.5px] font-bold uppercase tracking-[1.5px] text-slate-400">
                      Tags
                    </span>
                  </div>
                  {selectedFilters.size > 0 && (
                    <button
                      onClick={() => {
                        availableTags.forEach(opt => {
                          if (selectedFilters.has(opt)) onToggleFilter(opt);
                        });
                      }}
                      className="text-[#177564] text-[11px] font-bold uppercase tracking-wide hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isActive = selectedFilters.has(tag);
                    const count = filterCounts[tag] ?? 0;

                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={tag}
                        onClick={() => toggle('tags', tag)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer outline-none ${
                          isActive
                            ? 'bg-[#177564] text-white shadow-[0_2px_8px_rgba(23,117,100,0.25)] border border-transparent'
                            : 'bg-slate-100/60 text-slate-600 border border-slate-200/30 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        <span>{tag}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-200/80 text-slate-500'
                        }`}>
                          {count}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ---- Frosted Footer ---- */}
          <div className="shrink-0 border-t border-black/[0.04] backdrop-blur-md bg-white/90 px-5 py-4 pb-safe">
            <div className="flex gap-3">
              <SecondaryButton
                onClick={resetAll}
                disabled={totalSelected === 0}
                compact
                tone="neutral"
                className="min-h-12 px-4"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </SecondaryButton>

              <Drawer.Close asChild className="flex-1">
                <PrimaryButton compact fullWidth className="min-h-12 rounded-xl text-sm">
                  {resultCount > 0
                    ? `Show ${resultCount} Event${resultCount !== 1 ? 's' : ''}`
                    : 'No Events Found'}
                </PrimaryButton>
              </Drawer.Close>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
