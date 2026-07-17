import { type CSSProperties } from 'react';
import { type EventBrandTheme, type EventData } from '@/app/data/events';

const DEFAULT_EVENT_BRAND = {
  accent: '#177564',
  accentDark: '#0f5f51',
  accentSoft: '#def2ee',
  accentWash: '#f0fdf9',
  pageBackground: '',
  pageBackgroundTo: '',
  pageForeground: '',
  pageMuted: '',
  pageSubtle: '',
  surface: '',
  surfaceForeground: '',
  surfaceMuted: '',
  surfaceBorder: '',
  ctaFrom: '#3cd4b9',
  ctaTo: '#177564',
  textOnAccent: '#ffffff',
};

function normalizeHex(hex: string) {
  const value = hex.replace('#', '').trim();
  if (value.length === 3) {
    return value.split('').map((char) => char + char).join('');
  }
  return value.padEnd(6, '0').slice(0, 6);
}

export function alpha(hex: string, opacity: number) {
  const normalized = normalizeHex(hex);
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function isDarkColor(hex: string) {
  const normalized = normalizeHex(hex);
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance < 0.56;
}

export function getEventBrand(event?: Pick<EventData, 'brand'> | null) {
  const brand = {
    ...DEFAULT_EVENT_BRAND,
    ...(event?.brand || {}),
  };
  const pageBackground = brand.pageBackground || brand.accentWash;
  const pageBackgroundTo = brand.pageBackgroundTo || '#ffffff';
  const isDarkPage = isDarkColor(pageBackground);

  // Always high-contrast neutral — never brand-tinted.
  // Brand accent belongs on interactive elements, not readable text or icons.
  const pageForeground = isDarkPage ? '#ffffff' : '#181d27';
  const pageMuted     = isDarkPage ? 'rgba(255,255,255,0.72)' : 'rgba(15,23,42,0.55)';
  const pageSubtle    = isDarkPage ? 'rgba(255,255,255,0.48)' : 'rgba(15,23,42,0.38)';
  const pageBorder    = isDarkPage ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.08)';
  const surface         = brand.surface || (isDarkPage ? 'rgba(255,255,255,0.10)' : '#ffffff');
  const surfaceForeground = isDarkPage ? '#ffffff' : '#181d27';
  const surfaceMuted    = isDarkPage ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.52)';
  const surfaceBorder   = brand.surfaceBorder || (isDarkPage ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.08)');

  return {
    ...brand,
    isDarkPage,
    pageBackground,
    pageBackgroundTo,
    pageForeground,
    pageMuted,
    pageSubtle,
    pageBorder,
    surface,
    surfaceForeground,
    surfaceMuted,
    surfaceBorder,
    accentFaint: alpha(brand.accent, 0.08),
    accentMuted: alpha(brand.accent, 0.14),
    accentRing: alpha(brand.accent, 0.22),
    accentGlow: alpha(brand.accent, 0.26),
    accentShadow: alpha(brand.accentDark, 0.3),
    heroOverlay: alpha(brand.accentDark, 0.78),
    buttonGradient: {
      from: brand.ctaFrom,
      to: brand.ctaTo,
      shadow: alpha(brand.ctaTo, 0.34),
    },
  };
}

export function getBrandSurfaceStyle(event?: Pick<EventData, 'brand'> | null): CSSProperties {
  const brand = getEventBrand(event);
  const hasCustomTheme = !!(event && event.brand);
  return {
    '--event-page-fg': brand.pageForeground,
    '--event-page-muted': brand.pageMuted,
    '--event-page-subtle': brand.pageSubtle,
    '--event-page-border': brand.pageBorder,
    '--event-surface': brand.surface,
    '--event-surface-fg': brand.surfaceForeground,
    '--event-surface-muted': brand.surfaceMuted,
    '--event-surface-border': brand.surfaceBorder,
    background: hasCustomTheme 
      ? `
        radial-gradient(circle at 50% -8%, ${brand.accentMuted} 0%, transparent 34%),
        linear-gradient(180deg, ${brand.pageBackground} 0%, ${brand.pageBackgroundTo} 100%)
      `
      : '#ffffff',
    color: brand.pageForeground,
  } as CSSProperties;
}

/**
 * Returns only the CSS custom property tokens for the event brand — no background.
 * Use this when the parent layout already owns the page-level background.
 */
export function getBrandCSSVarsStyle(event?: Pick<EventData, 'brand'> | null): CSSProperties {
  const brand = getEventBrand(event);
  return {
    '--event-page-fg': brand.pageForeground,
    '--event-page-muted': brand.pageMuted,
    '--event-page-subtle': brand.pageSubtle,
    '--event-page-border': brand.pageBorder,
    '--event-surface': brand.surface,
    '--event-surface-fg': brand.surfaceForeground,
    '--event-surface-muted': brand.surfaceMuted,
    '--event-surface-border': brand.surfaceBorder,
    color: brand.pageForeground,
  } as CSSProperties;
}

export function getBrandPanelStyle(event?: Pick<EventData, 'brand'> | null): CSSProperties {
  const brand = getEventBrand(event);
  const hasCustomTheme = !!(event && event.brand);
  return {
    '--event-page-fg': brand.pageForeground,
    '--event-page-muted': brand.pageMuted,
    '--event-page-subtle': brand.pageSubtle,
    '--event-page-border': brand.pageBorder,
    '--event-surface': brand.surface,
    '--event-surface-fg': brand.surfaceForeground,
    '--event-surface-muted': brand.surfaceMuted,
    '--event-surface-border': brand.surfaceBorder,
    background: hasCustomTheme 
      ? `
        radial-gradient(circle at 50% -4%, ${brand.accentMuted} 0%, transparent 36%),
        linear-gradient(180deg, ${brand.pageBackground} 0%, ${brand.pageBackgroundTo} 100%)
      `
      : '#ffffff',
    color: brand.pageForeground,
  } as CSSProperties;
}

export function mergeBrandTheme(theme: EventBrandTheme) {
  return {
    ...DEFAULT_EVENT_BRAND,
    ...theme,
  };
}
