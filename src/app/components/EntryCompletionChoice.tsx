import React from 'react';

export type EntryCompletionChoiceValue = 'self' | 'guest' | 'claim';

interface EntryCompletionChoiceOption {
  value: EntryCompletionChoiceValue;
  label: string;
  description: string;
}

export interface EntryCompletionChoiceProps {
  name: string;
  value: EntryCompletionChoiceValue;
  onChange: (value: EntryCompletionChoiceValue) => void;
  selfTakenByAnotherEntry?: boolean;
  className?: string;
}

const OPTIONS: EntryCompletionChoiceOption[] = [
  {
    value: 'self',
    label: 'For me',
    description: 'I’ll fill it out · Adds to my Passport',
  },
  {
    value: 'guest',
    label: 'For someone else',
    description: 'I’ll fill it out · Creates a Guest QR',
  },
  {
    value: 'claim',
    label: 'Send claim link',
    description: 'They’ll fill it out · Adds to their Passport',
  },
];

export function EntryCompletionChoice({
  name,
  value,
  onChange,
  selfTakenByAnotherEntry = false,
  className = '',
}: EntryCompletionChoiceProps) {
  return (
    <fieldset className={`participant-form-ownership flex flex-col gap-2 ${className}`}>
      <legend className="text-[14px] font-semibold text-[#181d27]">Who will complete this entry?</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          const disabled = option.value === 'self' && selfTakenByAnotherEntry && !selected;

          return (
            <label
              key={option.value}
              data-selected={selected ? '' : undefined}
              className={`participant-form-owner-choice flex min-h-[70px] items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-all ${
                selected
                  ? 'border-[#177564] bg-[#f0fdf9] text-[#177564]'
                  : 'border-[#e2e8f0] bg-white text-[#64748b]'
              } ${disabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-[#b7ded6] hover:bg-[#f8fbfa]'}`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#177564]"
              />
              <span className="min-w-0">
                <span className={`block text-[13px] font-semibold ${selected ? 'text-[#177564]' : 'text-[#181d27]'}`}>
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium leading-relaxed text-[#64748b]">
                  {disabled
                    ? 'This Passport is already used for another player in this order'
                    : option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {selfTakenByAnotherEntry && value !== 'self' && (
        <p className="text-[12px] font-medium leading-relaxed text-[#64748b]">
          This order already has a Passport entry for you. Choose Guest QR or send a claim link for another participant.
        </p>
      )}
    </fieldset>
  );
}
