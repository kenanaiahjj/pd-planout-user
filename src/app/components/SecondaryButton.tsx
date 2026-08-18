import React from 'react';

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  compact?: boolean;
  tone?: 'brand' | 'neutral';
}

export function SecondaryButton({
  children,
  className = '',
  fullWidth = false,
  compact = false,
  tone = 'brand',
  disabled,
  ...rest
}: SecondaryButtonProps) {
  const toneClass =
    tone === 'neutral'
      ? 'border-[#e2e8f0] text-[#64748b] shadow-none hover:border-[#cbd5e1] hover:bg-[#f8fafc] hover:text-[#475569] disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300'
      : 'border-[#d9e8e5] text-[#177564] shadow-[0_4px_10px_-8px_rgba(15,23,42,0.42)] hover:bg-[#f5fbf9] hover:text-[#125c4f] disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 disabled:shadow-none';

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        ${compact ? 'min-h-10 rounded-[10px] px-3 py-2 shadow-none' : 'min-h-11 rounded-[12px] px-5 py-2.5'}
        ${fullWidth ? 'w-full' : ''}
        border bg-white
        text-[13px] font-semibold
        ${toneClass}
        transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out
        active:scale-[0.98]
        motion-reduce:transition-none motion-reduce:active:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        ${className}
      `.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
