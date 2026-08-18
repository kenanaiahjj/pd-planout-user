import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Slider from '@radix-ui/react-slider';
import { ChevronDown, MapPin, Search, Navigation } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Enhanced city data with provinces
export interface LocationItem {
  city: string;
  province: string;
}

export const PH_LOCATIONS: LocationItem[] = [
  { city: "Manila", province: "Metro Manila" },
  { city: "Quezon City", province: "Metro Manila" },
  { city: "Davao City", province: "Davao del Sur" },
  { city: "Cebu City", province: "Cebu" },
  { city: "Taguig", province: "Metro Manila" },
  { city: "Makati", province: "Metro Manila" },
  { city: "Pasig", province: "Metro Manila" },
  { city: "Baguio", province: "Benguet" },
  { city: "Iloilo City", province: "Iloilo" },
  { city: "Bacolod", province: "Negros Occidental" },
  { city: "Cagayan de Oro", province: "Misamis Oriental" },
  { city: "Zamboanga City", province: "Zamboanga del Sur" },
  { city: "General Santos", province: "South Cotabato" },
  { city: "Lapu-Lapu City", province: "Cebu" },
  { city: "Mandaluyong", province: "Metro Manila" },
  { city: "Pasay", province: "Metro Manila" },
  { city: "Caloocan", province: "Metro Manila" },
  { city: "Muntinlupa", province: "Metro Manila" },
  { city: "Las Piñas", province: "Metro Manila" },
  { city: "Parañaque", province: "Metro Manila" },
  { city: "Antipolo", province: "Rizal" },
  { city: "Tagaytay", province: "Cavite" },
  { city: "Puerto Princesa", province: "Palawan" },
  { city: "Dumaguete", province: "Negros Oriental" },
  { city: "Tacloban", province: "Leyte" },
  { city: "Legazpi", province: "Albay" },
  { city: "Naga", province: "Camarines Sur" },
  { city: "Olongapo", province: "Zambales" },
  { city: "Angeles", province: "Pampanga" },
  { city: "San Juan", province: "Metro Manila" }
].sort((a, b) => a.city.localeCompare(b.city));

/** Props for controlled mode — if provided, external state is used. */
interface LocationDropdownProps {
  value?: LocationItem | null;
  onChange?: (loc: LocationItem | null) => void;
  radiusValue?: number;
  onRadiusChange?: (r: number) => void;
}

export function LocationDropdown({
  value,
  onChange,
  radiusValue,
  onRadiusChange,
}: LocationDropdownProps = {}) {
  // Internal state (used when uncontrolled)
  const [internalLocation, setInternalLocation] = useState<LocationItem | null>(null);
  const [internalRadius, setInternalRadius] = useState([10]);

  // Resolve controlled vs uncontrolled
  const selectedLocation = value !== undefined ? value : internalLocation;
  const setSelectedLocation = (loc: LocationItem | null) => {
    if (onChange) onChange(loc);
    else setInternalLocation(loc);
  };
  const radius = radiusValue !== undefined ? [radiusValue] : internalRadius;
  const setRadius = (v: number[]) => {
    if (onRadiusChange) onRadiusChange(v[0]);
    else setInternalRadius(v);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Sync search text when controlled value changes externally
  useEffect(() => {
    if (value !== undefined) {
      if (value) {
        setSearch(value.city === "Current Location" ? "Current Location" : `${value.city}, ${value.province}`);
      } else {
        setSearch("");
      }
    }
  }, [value]);

  // Helper to construct the display string (without radius)
  const getDisplayString = (loc: { city: string, province: string }) => {
    if (loc.city === "Current Location") {
      return "Current Location";
    }
    return `${loc.city}, ${loc.province}`;
  };

  const filteredLocations = PH_LOCATIONS.filter(loc => {
    if (!search) return true;
    if (selectedLocation) {
      const label = getDisplayString(selectedLocation);
      if (search === label) return true;
    }
    return loc.city.toLowerCase().includes(search.toLowerCase()) || 
    loc.province.toLowerCase().includes(search.toLowerCase());
  });

  const handleNearMe = () => {
    const loc = { city: "Current Location", province: "Near Me" };
    setSelectedLocation(loc);
    setSearch(getDisplayString(loc));
    setIsOpen(false);
  };

  // Check if the current search text matches the selected location exactly
  const isMatch = selectedLocation && search === getDisplayString(selectedLocation);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            aria-label="Search city"
            className={cn(
              "w-full bg-white border border-slate-200/80 rounded-xl py-2.5 text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#177564] focus:ring-1 focus:ring-[#177564]/20 transition-all cursor-text shadow-[0_1px_2px_rgba(0,0,0,0.015)]",
              "pl-10", // Left padding for search icon
              isMatch ? "pr-20" : "pr-10" // Right padding: larger if showing radius text
            )}
            placeholder="Search city..."
            value={isMatch && selectedLocation ? selectedLocation.city : search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
          
          {/* Subtle Radius Indicator - Only visible when matched */}
          {isMatch && (
            <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748b] pointer-events-none select-none">
              {radius} km
            </span>
          )}

          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] transition-transform duration-200 group-data-[state=open]:rotate-180 pointer-events-none" />
        </div>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="bg-white rounded-2xl shadow-premium w-[300px] p-4.5 z-50 animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 border border-black/[0.04]"
          sideOffset={5}
          align="start"
        >
          {/* Near Me Option */}
          <button 
            onClick={handleNearMe}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-[#177564] bg-[#177564]/8 hover:bg-[#177564]/12 rounded-xl transition-all mb-4 font-bold text-[13px] cursor-pointer outline-none active:scale-[0.98]"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            Use my current location
          </button>

          {/* Radius Slider */}
          <div className="mb-4 bg-white border border-slate-100 rounded-xl p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Radius</label>
              <span className="text-[12.5px] font-bold text-[#177564] bg-[#177564]/8 px-2 py-0.5 rounded-md">{radius} km</span>
            </div>
            <Slider.Root 
              className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
              value={radius}
              max={100}
              step={1}
              onValueChange={setRadius}
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

          <div className="h-[1px] bg-slate-100 my-3.5" />

          {/* Cities List with Custom Scrollbar */}
          <div className="max-h-[180px] overflow-y-auto -mx-2 px-2 space-y-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
             <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-1 px-1">Cities in Philippines</div>
             {filteredLocations.length === 0 ? (
               <div className="text-sm text-slate-400 py-4 text-center">No locations found</div>
             ) : (
               filteredLocations.map((loc) => {
                 const isSelected = selectedLocation?.city === loc.city;
                 return (
                   <button
                     key={loc.city}
                     onClick={() => {
                       setSelectedLocation(loc);
                       setSearch(getDisplayString(loc));
                       setIsOpen(false);
                     }}
                     className={cn(
                       "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center justify-between cursor-pointer outline-none",
                       isSelected ? "bg-[#177564]/8 text-[#177564]" : "hover:bg-slate-100/60 text-slate-700"
                     )}
                   >
                     <div className="flex flex-col">
                       <span className={cn("font-semibold", isSelected ? "text-[#177564]" : "text-slate-800")}>
                         {loc.city}
                       </span>
                       <span className={cn("text-xs", isSelected ? "text-[#177564]/80" : "text-slate-400")} style={{ color: isSelected ? 'rgba(23,117,100,0.8)' : '#64748b' }}>
                         {loc.province}
                       </span>
                     </div>
                     {isSelected && <MapPin className="w-3.5 h-3.5 text-[#177564]" />}
                   </button>
                 );
               })
             )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
