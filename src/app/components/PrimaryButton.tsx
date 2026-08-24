/**
 * @file PrimaryButton.tsx
 * @description Reusable primary CTA button matching the Figma gradient spec.
 *
 * Visual style:
 *  - Linear gradient: #3cd4b9 → #177564 (left to right)
 *  - Subtle radial shine overlay (20% white vignette via inline SVG)
 *  - Inset white border + soft shadow for depth
 *  - Active press scale + hover brightness
 */

import React from 'react';

// ---------------------------------------------------------------------------
// Radial shine overlay (from Figma export)
// ---------------------------------------------------------------------------

const SHINE_SVG = `url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 44" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="0.2"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(0 -2.2 15.67 0 200 22)"><stop stop-color="rgba(255,255,255,0)" offset="0"/><stop stop-color="rgba(255,255,255,1)" offset="1"/></radialGradient></defs></svg>')`;

const DEFAULT_GRADIENT = {
  from: '#3cd4b9',
  to: '#177564',
};

function createBackgroundStyle(
  brandGradient?: PrimaryButtonProps['brandGradient'],
  showShine = true,
): React.CSSProperties {
  const from = brandGradient?.from || DEFAULT_GRADIENT.from;
  const to = brandGradient?.to || DEFAULT_GRADIENT.to;

  return {
    backgroundImage: showShine
      ? `${SHINE_SVG}, linear-gradient(90deg, ${from} 0%, ${to} 100%)`
      : `linear-gradient(90deg, ${from} 0%, ${to} 100%)`,
    boxShadow: brandGradient?.shadow
      ? `0 14px 28px -18px ${brandGradient.shadow}`
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Stretch to fill the parent width. */
  fullWidth?: boolean;
  /** Compact size variant for inline actions (smaller padding). */
  compact?: boolean;
  /** Use a flat native action surface instead of the default gradient shine. */
  appearance?: 'gradient' | 'solid';
  /** Optional organizer/event brand gradient for event-owned surfaces. */
  brandGradient?: {
    from: string;
    to: string;
    shadow?: string;
  };
  showShine?: boolean;
  pressScale?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(function PrimaryButton({
  children,
  className = '',
  fullWidth = false,
  compact = false,
  appearance = 'gradient',
  brandGradient,
  showShine = true,
  pressScale = true,
  disabled,
  style,
  ...rest
}, ref) {
  const resolvedStyle = disabled
    ? style
    : appearance === 'solid'
      ? {
          backgroundColor: '#177564',
          boxShadow: '0 8px 18px -14px rgba(23,117,100,0.6)',
          ...style,
        }
      : { ...createBackgroundStyle(brandGradient, showShine), ...style };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        ${compact ? 'px-4 py-2' : 'px-[18px] py-[10px]'}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl text-[15px] font-semibold text-white text-center
        transition-[filter,transform] duration-150 ease-out
        ${pressScale ? 'active:scale-[0.98] motion-reduce:active:scale-100' : ''}
        motion-reduce:transition-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35 focus-visible:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed saturate-50' : 'cursor-pointer hover:brightness-110'}
        ${className}
      `.trim()}
      style={resolvedStyle}
      {...rest}
    >
      {/* Content */}
      <span className="relative z-[1] flex items-center justify-center gap-2 leading-[24px] whitespace-nowrap">
        {children}
      </span>

      {/* White inset border + shadow overlay */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none"
      />

      {/* Disabled fallback bg (gradient won't show when style is omitted) */}
      {disabled && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit] bg-[#cbd5e1] -z-[1]"
        />
      )}
    </button>
  );
});
