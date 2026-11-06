import React from 'react';

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  compact?: boolean;
  tone?: 'brand' | 'neutral';
}

export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(function SecondaryButton({
  children,
  className = '',
  fullWidth = false,
  compact = false,
  tone = 'brand',
  disabled,
  ...rest
}, ref) {
  const toneClass =
    tone === 'neutral'
      ? 'border-[#e5e6e2] text-[#62665f] shadow-none hover:border-[#d5d7d2] hover:bg-[#f7f8f6] hover:text-[#30332e] disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400'
      : 'border-[#cbded8] text-[#177564] shadow-none hover:border-[#a8c9bf] hover:bg-[#f5faf8] hover:text-[#125c4f] disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400';

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        ${compact ? 'min-h-10 rounded-[9px] px-3 py-2 shadow-none' : 'min-h-11 rounded-[10px] px-5 py-2.5'}
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
});
