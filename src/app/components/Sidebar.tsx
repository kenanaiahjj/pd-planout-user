import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface RadioProps {
  label: string;
  id: string;
  checked?: boolean;
  onChange?: () => void;
  count: number;
}

function FilterRadio({ label, id, checked, onChange, count }: RadioProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      type="button"
      onClick={onChange}
      className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-left transition-all outline-none ${
        checked ? 'bg-[#177564]/8' : 'hover:bg-slate-100/60'
      }`}
      aria-checked={checked}
      role="radio"
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
          checked
            ? 'border-[#177564] bg-[#177564]'
            : 'border-neutral-300 bg-white group-hover:border-[#177564]/80'
        }`}
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: checked ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="h-1.5 w-1.5 rounded-full bg-white" 
        />
      </div>
      <span
        className={`select-none text-[13px] font-semibold leading-none tracking-[-0.15px] transition-colors duration-200 ${
          checked ? 'text-[#177564]' : 'text-neutral-600 group-hover:text-neutral-900'
        }`}
      >
        {label}
      </span>
      <span className={`ml-auto text-[10.5px] font-bold transition-all duration-200 ${
        checked 
          ? 'bg-[#177564]/12 text-[#177564]' 
          : 'bg-slate-100 text-neutral-500 group-hover:bg-slate-200/60 group-hover:text-neutral-700'
      } px-1.5 py-0.5 rounded-md min-w-[20px] text-center`} style={{ contentVisibility: 'auto' }}>
        {count}
      </span>
    </motion.button>
  );
}

interface CheckboxProps {
  label: string;
  id: string;
  checked?: boolean;
  onChange?: () => void;
  count: number;
}

function FilterCheckbox({ label, id, checked, onChange, count }: CheckboxProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      type="button"
      onClick={onChange}
      className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-left transition-all outline-none ${
        checked ? 'bg-[#177564]/8' : 'hover:bg-slate-100/60'
      }`}
      aria-pressed={checked}
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 ${
          checked
            ? 'bg-[#177564] border-[#177564]'
            : 'border-neutral-300 bg-white group-hover:border-[#177564]/80'
        }`}
      >
        <motion.svg 
          initial={{ scale: 0 }}
          animate={{ scale: checked ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          width="10" 
          height="10" 
          viewBox="0 0 10 10" 
          fill="none"
        >
          <path 
            d="M8.25 2.5L3.75 7L1.75 5" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </motion.svg>
      </div>
      <span
        className={`select-none text-[13px] font-semibold leading-none tracking-[-0.15px] transition-colors duration-200 ${
          checked ? 'text-[#177564]' : 'text-neutral-600 group-hover:text-neutral-900'
        }`}
      >
        {label}
      </span>
      <span className={`ml-auto text-[10.5px] font-bold transition-all duration-200 ${
        checked 
          ? 'bg-[#177564]/12 text-[#177564]' 
          : 'bg-slate-100 text-neutral-500 group-hover:bg-slate-200/60 group-hover:text-neutral-700'
      } px-1.5 py-0.5 rounded-md min-w-[20px] text-center`} style={{ contentVisibility: 'auto' }}>
        {count}
      </span>
    </motion.button>
  );
}

export interface SidebarProps {
  className?: string;
  selectedFilters: Set<string>;
  onToggleFilter: (option: string) => void;
  selectedTimeFilter: string;
  onTimeFilterChange: (option: string) => void;
  onClearAll: () => void;
  filterCounts: Record<string, number>;
  availableTags: string[];
}

export function Sidebar({ 
  className, 
  selectedFilters, 
  onToggleFilter, 
  selectedTimeFilter,
  onTimeFilterChange,
  onClearAll,
  filterCounts,
  availableTags
}: SidebarProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const hasActiveFilters = selectedFilters.size > 0 || selectedTimeFilter !== 'Upcoming Events';

  const timeOptions = ['Upcoming Events', 'Today', 'This Weekend', 'Next Week', 'Past Events'];
  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, 8);

  return (
    <div className={cn("flex w-[188px] shrink-0 flex-col gap-5", className)}>
      <div className="flex flex-col gap-4.5">
        {/* Time & Date Section */}
        <div className="flex flex-col gap-2">
          <h3 className="px-2 text-[10.5px] font-bold uppercase tracking-[1px] text-neutral-400">
            Time & Date
          </h3>
          <div className="flex flex-col gap-0.5">
            {timeOptions.map((opt) => (
              <FilterRadio
                key={opt}
                label={opt}
                id={opt.toLowerCase().replace(/\s+/g, '-')}
                checked={selectedTimeFilter === opt}
                onChange={() => onTimeFilterChange(opt)}
                count={filterCounts[opt] ?? 0}
              />
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-neutral-100/80 mx-2" />

        {/* Dynamic Tags Section */}
        <div className="flex flex-col gap-2">
          <h3 className="px-2 text-[10.5px] font-bold uppercase tracking-[1px] text-neutral-400">
            Tags
          </h3>
          <div className="flex flex-col gap-0.5">
            {visibleTags.map((tag) => (
              <FilterCheckbox
                key={tag}
                label={tag}
                id={tag.toLowerCase().replace(/\s+/g, '-')}
                checked={selectedFilters.has(tag)}
                onChange={() => onToggleFilter(tag)}
                count={filterCounts[tag] ?? 0}
              />
            ))}
          </div>
          {availableTags.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllTags(!showAllTags)}
              className="mt-1 px-2.5 text-left text-[11.5px] font-bold text-[#177564] hover:text-[#0f5f51] hover:underline transition-colors cursor-pointer"
            >
              {showAllTags ? 'Show less' : `Show more (${availableTags.length - 8})`}
            </button>
          )}
        </div>
      </div>

      <div className="h-[1px] bg-neutral-100/80 mx-2" />

      <motion.button
        whileTap={hasActiveFilters ? { scale: 0.985 } : {}}
        onClick={onClearAll}
        className={`flex items-center justify-center gap-2 w-full rounded-xl border py-2.5 text-center text-[12px] font-semibold tracking-tight transition-all outline-none ${
          hasActiveFilters
            ? 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm cursor-pointer'
            : 'cursor-not-allowed border-neutral-100 bg-neutral-50/50 text-neutral-400'
        }`}
        disabled={!hasActiveFilters}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset all filters
      </motion.button>
    </div>
  );
}
