import React from 'react';

export interface SegmentedChoiceOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
}

interface SegmentedChoiceProps<T extends string> {
  options: SegmentedChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  columnsClass?: string;
  size?: 'sm' | 'md';
  wrapLabels?: boolean;
}

export function SegmentedChoice<T extends string>({
  options,
  value,
  onChange,
  className = '',
  columnsClass = 'grid-cols-2 max-w-sm',
  size = 'md',
  wrapLabels = false,
}: SegmentedChoiceProps<T>) {
  const itemClass =
    size === 'sm'
      ? 'min-h-9 gap-1.5 px-2.5 py-1.5 text-[12px]'
      : 'min-h-11 gap-2 px-3 py-2 text-[14px]';
  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className={`segmented-choice grid ${columnsClass} w-full rounded-full bg-slate-100/80 p-0.5 ${className}`}>
      {options.map(({ value: optionValue, label, icon: Icon, badge }) => {
        const isActive = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            data-selected={isActive ? '' : undefined}
            className={`segmented-choice__item flex min-w-0 items-center justify-center rounded-full border font-semibold transition-all active:scale-[0.98] ${itemClass} ${
              isActive
                ? 'border-slate-200 bg-white text-slate-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {Icon && <Icon className={`${iconClass} shrink-0`} />}
            <span className={wrapLabels ? 'min-w-0 text-center leading-tight' : 'truncate'}>{label}</span>
            {badge != null && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none transition-colors ${
                  isActive ? 'bg-slate-900/5 text-slate-800' : 'bg-slate-900/8 text-slate-500'
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
