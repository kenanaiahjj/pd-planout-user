/**
 * @file PrimaryButton.tsx
 * @description Reusable PlanOut primary action button.
 *
 * Primary actions use a flat PlanOut green surface. Event-owned gradients stay
 * available when a caller supplies a brand gradient.
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
  /** Use an event gradient for a branded action; default actions are solid. */
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
  appearance,
  brandGradient,
  showShine = false,
  pressScale = true,
  disabled,
  style,
  ...rest
}, ref) {
  const resolvedAppearance = appearance ?? (brandGradient ? 'gradient' : 'solid');
  const resolvedStyle = disabled
    ? { backgroundColor: '#e8e9e4', backgroundImage: 'none', boxShadow: 'none', color: '#69716a', ...style }
    : resolvedAppearance === 'solid'
      ? { backgroundColor: '#177564', backgroundImage: 'none', boxShadow: 'none', ...style }
      : { ...createBackgroundStyle(brandGradient, showShine), ...style };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        ${compact ? 'px-4 py-2' : 'px-[18px] py-[10px]'}
        ${fullWidth ? 'w-full' : ''}
        rounded-[10px] text-[15px] font-semibold text-white text-center
        transition-[filter,transform] duration-150 ease-out
        ${pressScale ? 'active:scale-[0.98] motion-reduce:active:scale-100' : ''}
        motion-reduce:transition-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35 focus-visible:ring-offset-2
        ${disabled ? 'text-[#69716a] opacity-100 cursor-not-allowed' : 'cursor-pointer hover:brightness-105'}
        ${className}
      `.trim()}
      style={resolvedStyle}
      {...rest}
    >
      {/* Content */}
      <span className="relative z-[1] flex items-center justify-center gap-2 leading-[24px] whitespace-nowrap">
        {children}
      </span>

    </button>
  );
});

interface PrimaryButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Stretch to fill the parent. */
  fullWidth?: boolean;
  /** Compact size variant for inline actions. */
  compact?: boolean;
  /** Use an event gradient for a branded action; default actions are solid. */
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

export const PrimaryButtonLink = React.forwardRef<HTMLAnchorElement, PrimaryButtonLinkProps>(function PrimaryButtonLink({
  children,
  className = '',
  fullWidth = false,
  compact = false,
  appearance,
  brandGradient,
  showShine = false,
  pressScale = true,
  style,
  ...rest
}, ref) {
  const resolvedAppearance = appearance ?? (brandGradient ? 'gradient' : 'solid');
  const resolvedStyle = resolvedAppearance === 'solid'
    ? {
        backgroundColor: '#177564',
        backgroundImage: 'none',
        boxShadow: 'none',
        ...style,
      }
    : { ...createBackgroundStyle(brandGradient, showShine), ...style };

  const linkClassName = [
    'relative inline-flex items-center justify-center gap-2',
    compact ? 'px-4 py-2' : 'px-[18px] py-[10px]',
    fullWidth ? 'w-full' : '',
    'rounded-[10px] text-[15px] font-semibold text-white text-center',
    'transition-[filter,transform] duration-150 ease-out',
    pressScale ? 'active:scale-[0.98] motion-reduce:active:scale-100' : '',
    'motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35 focus-visible:ring-offset-2',
    'cursor-pointer hover:brightness-105',
    className,
  ].filter(Boolean).join(' ');

  return (
    <a
      ref={ref}
      className={linkClassName}
      style={resolvedStyle}
      {...rest}
    >
      <span className="relative z-[1] flex items-center justify-center gap-2 leading-[24px] whitespace-nowrap">
        {children}
      </span>
    </a>
  );
});
