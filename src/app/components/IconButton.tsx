import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  size?: 'sm' | 'md';
  tone?: 'neutral' | 'brand' | 'primary' | 'inverse';
}

export function IconButton({
  children,
  className = '',
  size = 'md',
  tone = 'neutral',
  type = 'button',
  ...rest
}: IconButtonProps) {
  const sizeClass = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const toneClass =
    tone === 'brand'
      ? 'bg-[#def2ee] text-[#177564] hover:bg-[#cbf0e8] hover:text-[#125c4f]'
      : tone === 'primary'
        ? 'bg-[#177564] text-white hover:bg-[#136354] disabled:bg-slate-300'
      : tone === 'inverse'
        ? 'bg-white/18 text-white hover:bg-white/28'
        : 'border border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#cbd5e1] hover:bg-[#f8fafc] hover:text-[#181d27]';

  return (
    <button
      type={type}
      className={`
        inline-flex shrink-0 items-center justify-center rounded-full
        transition-all active:scale-[0.96]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/20
        disabled:cursor-not-allowed disabled:opacity-45
        ${sizeClass}
        ${toneClass}
        ${className}
      `.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
