#!/usr/bin/env node

/**
 * Generate the Pantograph manifest for the PlanOut Orders module.
 *
 * The source-backed portion of this generator intentionally compiles and loads
 * the real ticket and Orders modules. That keeps the manifest tied to the
 * current seed data and the current Orders derive logic instead of maintaining
 * a second, silently drifting fixture.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';
import QRCode from 'qrcode';

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'design-manifests', 'orders-all-states.json');
const SOURCE_DATE = '2026-08-24';

const C = {
  canvas: '#f8fafc',
  white: '#ffffff',
  ink: '#181d27',
  darkInk: '#163d37',
  muted: '#64748b',
  slate: '#516173',
  subtle: '#94a3b8',
  line: '#e4e8ec',
  lineSoft: '#edf0f3',
  lineGreen: '#dfe7e5',
  brand: '#177564',
  brandDark: '#0f5f51',
  brandSoft: '#def2ee',
  brandPale: '#e4f4ef',
  brandWash: '#f0f8f6',
  warningBg: '#fff3c4',
  warningText: '#8a5a08',
  warningLine: '#edd377',
  dangerBg: '#fef2f2',
  dangerText: '#b42318',
  dangerDeep: '#991b1b',
  dangerLine: '#fecaca',
  neutralBg: '#f1f5f9',
  neutralText: '#64748b',
  coverFallback: '#0c493f',
  backdrop: '#10211e59',
  darkBackdrop: '#172b2a59',
};

const ICONS = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="#8a9bb1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-2.9 2-2.9 4"/><path d="M12 17h.01"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="#b42318" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14H5V6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="#5f6f86" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-8h3Z"/><path d="M3 19a2 2 0 0 0 2 2h1v-8H3Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="#177564" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>',
  rotate: '<svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/></svg>',
};

const TEXT = {
  body: { size: 14, weight: 500, color: 'ink', lh: 21 },
  bodyStrong: { size: 14, weight: 600, color: 'ink', lh: 20 },
  small: { size: 12, weight: 500, color: 'muted', lh: 18 },
  smallStrong: { size: 12, weight: 600, color: 'ink', lh: 17 },
  caption: { size: 11, weight: 500, color: 'subtle', lh: 14 },
  captionStrong: { size: 11, weight: 600, color: 'slate', lh: 14 },
  h1: { size: 32, weight: 600, color: 'ink', lh: 32, tracking: -0.9 },
  h2: { size: 17, weight: 600, color: 'ink', lh: 21, tracking: -0.3 },
  h3: { size: 15, weight: 600, color: 'ink', lh: 18, tracking: -0.2 },
  cardTitle: { size: 20, weight: 700, color: 'white', lh: 22, tracking: -0.45 },
  cardMeta: { size: 13, weight: 600, color: 'white72', lh: 16 },
  cardSmall: { size: 11, weight: 600, color: 'white82', lh: 14 },
  coverTitle: { size: 36, weight: 700, color: 'white', lh: 37, tracking: -0.75 },
  coverMeta: { size: 11, weight: 600, color: 'white70', lh: 14 },
  mono: { size: 11, weight: 600, color: 'white70', lh: 14, family: 'Inter' },
  monoDark: { size: 11, weight: 600, color: 'subtle', lh: 14, family: 'Inter' },
  button: { size: 12, weight: 600, color: 'ink', lh: 16 },
  buttonBrand: { size: 12, weight: 600, color: 'white', lh: 16 },
  nav: { size: 13, weight: 600, color: 'muted', lh: 16 },
  navActive: { size: 13, weight: 700, color: 'brand', lh: 16 },
  modalTitle: { size: 19, weight: 600, color: 'ink', lh: 22, tracking: -0.4 },
};

const BRAND_FALLBACK = {
  accent: C.brand,
  accentDark: C.brandDark,
  accentWash: '#eafaf6',
  pageBackground: '#1b7c6c',
  pageBackgroundTo: C.coverFallback,
};

const FINDINGS = [
  'The source builds 15 order records but TEMPORARILY_HIDDEN_ORDER_IDS removes only ord-gear-001 from the overview, so the current visible tabs are All 14, Pending 7, and Complete 7.',
  'The shipped merchandise detail for ord-gear-001 remains directly reachable even though that order is hidden from the overview.',
  'ShippingTracker is defined in OrdersPage.tsx but is not rendered by MerchandiseItem, so Processing and Shipped merchandise details still show Claim at the event and no tracking action.',
  'Released team entries are labeled Forms needed on the overview because orderHasPending treats every non-attached team entry as pending; the detail player rows still expose Form needed actions for released players.',
];

const SKIPPED = [
  'Hover, focus, active, reduced-motion, reduced-transparency, and toast states are not static frames.',
  'Participant form pages, public Guest Entry pages, Passport pages, and settings/inbox routes are outside the Orders module scope.',
  'Clipboard results, native share sheets, browser keyboard insets, and live chat replies are behavioral states with no stable source screenshot.',
  'The source generates Guest QR and Passport QR matrices at runtime. The interaction frames use deterministic QR payloads with the same visual contract and source labels.',
  'Breakpoint duplicates are not emitted for every state. The frames use the desktop Orders composition; the source mobile reading order remains represented by the same nested structure.',
];

function text(value, style = 'body', props = {}) {
  return { text: { value: String(value), style, ...props } };
}

function stack(children, props = {}) {
  return { stack: { ...props, children } };
}

function row(children, props = {}) {
  return { row: { ...props, children } };
}

function box(children = [], props = {}) {
  return { box: { ...props, children } };
}

function rule(props = {}) {
  return { rule: { w: 'fill', h: 1, bg: 'lineSoft', ...props } };
}

function icon(name, size = 14, props = {}) {
  return { svg: { src: ICONS[name], size, ...props } };
}

function pill(label, props = {}) {
  return {
    pill: {
      text: label,
      size: 11,
      weight: 600,
      radius: 'full',
      ...props,
    },
  };
}

function button(label, variant = 'secondary', props = {}) {
  return { button: { text: label, variant, size: 'sm', ...props } };
}

function input(value, props = {}) {
  return { input: { value, size: 14, ...props } };
}

function avatar(initials, size = 32, props = {}) {
  return { avatar: { text: initials, size, bg: 'brandSoft', fg: 'brand', radius: 'full', ...props } };
}

function screen(name, size, source, children, notes) {
  return {
    name,
    size,
    dir: 'v',
    bg: 'canvas',
    source,
    notes,
    children,
  };
}

function resolvedBrand(theme = {}) {
  const brand = { ...BRAND_FALLBACK, ...(theme || {}) };
  const hex = (brand.pageBackground || C.coverFallback).replace('#', '').slice(0, 6).padEnd(6, '0');
  const luminance = (0.299 * parseInt(hex.slice(0, 2), 16) + 0.587 * parseInt(hex.slice(2, 4), 16) + 0.114 * parseInt(hex.slice(4, 6), 16)) / 255;
  const dark = luminance < 0.56;
  return {
    ...brand,
    pageBackground: brand.pageBackground || brand.accentWash || C.white,
    pageBackgroundTo: brand.pageBackgroundTo || C.white,
    pageForeground: dark ? C.white : C.ink,
    pageMuted: dark ? 'white72' : 'muted',
    pageSubtle: dark ? 'white48' : 'subtle',
  };
}

function isPendingStatus(status) {
  return status === 'pending_form' || status === 'resubmit_required' || status === 'pending_payment';
}

function isAttachedStatus(status) {
  return status === 'attached';
}

function orderHasPending(order) {
  return order.eventEntries.some((entry) => (
    isPendingStatus(entry.status)
    || (entry.type === 'team' && entry.status !== 'attached')
  ));
}

function orderIsComplete(order) {
  return !orderHasPending(order);
}

function orderIsRefunded(order) {
  return order.paymentStatus === 'Refunded' || Boolean(order.refunded);
}

function getOrderState(order) {
  if (orderIsRefunded(order)) return { label: 'Refunded', tone: 'refunded' };
  if (orderHasPending(order)) return { label: 'Forms needed', tone: 'warning' };
  const hasAttachedEvents = order.eventEntries.length > 0 && order.eventEntries.every((entry) => isAttachedStatus(entry.status));
  if (hasAttachedEvents) return { label: 'Ready for gate', tone: 'ready' };
  if (order.eventEntries.length > 0) return { label: 'Complete', tone: 'neutral' };
  const statuses = order.merchItems.map((item) => item.status);
  if (statuses.includes('Processing')) return { label: 'Processing', tone: 'neutral' };
  if (statuses.includes('Shipped')) return { label: 'Shipped', tone: 'neutral' };
  if (statuses.includes('Delivered')) return { label: 'Delivered', tone: 'ready' };
  return null;
}

function distinctEventCount(order) {
  return new Set(order.eventEntries.map((entry) => entry.ticket.id)).size;
}

function eventLineItems(entries) {
  const teamPurchaseIds = new Set();
  const lines = [];
  entries.forEach((entry) => {
    if (entry.type === 'team') {
      const ticketId = entry.ticket.id;
      if (teamPurchaseIds.has(ticketId)) return;
      teamPurchaseIds.add(ticketId);
      lines.push({
        id: `${ticketId}-team-purchase`,
        label: `${entry.ticket.eventTitle} - ${entry.ticket.ticketTypeName}`,
        amount: entry.price,
      });
      return;
    }
    lines.push({ id: entry.id, label: entry.entryName, amount: entry.price });
  });
  return lines;
}

function registrationEntries(entries) {
  const seenTeamPurchaseIds = new Set();
  return entries.filter((entry) => {
    if (entry.type !== 'team') return true;
    const ticketId = entry.ticket.id;
    if (seenTeamPurchaseIds.has(ticketId)) return false;
    seenTeamPurchaseIds.add(ticketId);
    return true;
  });
}

function teamSummary(entries) {
  const teamEntries = entries.filter((entry) => entry.type === 'team');
  if (!teamEntries.length) return null;
  const first = teamEntries[0];
  const totalCount = first.teamTotalCount ?? teamEntries.length;
  const setUpCount = Math.min(Math.max(first.teamAttachedCount ?? 0, 0), totalCount);
  return {
    title: `${first.ticket.eventTitle} - ${first.ticket.ticketTypeName}`,
    setUpCount,
    totalCount,
  };
}

function orderSubtotal(order) {
  return eventLineItems(order.eventEntries).reduce((sum, item) => sum + item.amount, 0)
    + order.merchItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function orderTotal(order) {
  return orderSubtotal(order) + order.fees;
}

function money(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

function dateOnly(value) {
  const match = String(value).match(/^([A-Za-z]+ \d{1,2}, \d{4})/);
  if (!match) return value;
  const parsed = new Date(`${match[1]} 00:00:00`);
  if (Number.isNaN(parsed.getTime())) return match[1];
  return parsed.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

function orderOverviewTitle(order) {
  const count = distinctEventCount(order);
  return {
    primary: order.eventEntries[0]?.ticket.eventTitle || order.name,
    additionalCount: Math.max(0, count - 1),
  };
}

function orderCardDetails(order) {
  const ticket = order.eventEntries[0]?.ticket;
  if (!ticket) return null;
  const count = distinctEventCount(order);
  return {
    ticketType: ticket.ticketTypeName,
    date: count > 1 ? `${count} events` : dateOnly(ticket.eventDate),
  };
}

function itemSummary(order) {
  const groups = new Map();
  order.eventEntries.forEach((entry) => {
    const key = `${entry.ticket.eventTitle} - ${entry.category}`;
    if (entry.type === 'team' && groups.has(key)) return;
    const current = groups.get(key) || { count: 0, category: entry.category };
    current.count += 1;
    groups.set(key, current);
  });
  const eventCount = distinctEventCount(order);
  if (eventCount > 1) return `${eventCount} events · ${Array.from(groups.values()).reduce((sum, group) => sum + group.count, 0)} registration items`;
  const eventItems = Array.from(groups.values()).map((group) => `${group.count}× ${group.category}`);
  const merchItems = order.merchItems.map((item) => `${item.quantity}× ${item.name}`);
  return [...eventItems, ...merchItems].join(' - ');
}

function coverPresentation(order) {
  const seen = new Set();
  const events = [];
  order.eventEntries.forEach((entry) => {
    if (seen.has(entry.ticket.id)) return;
    seen.add(entry.ticket.id);
    const brand = resolvedBrand(entry.ticket.brand);
    events.push({
      id: entry.ticket.id,
      title: entry.ticket.eventTitle,
      image: entry.ticket.image,
      gradientFrom: brand.pageBackground,
      gradientTo: brand.pageBackgroundTo,
    });
  });
  const fallback = resolvedBrand();
  const merchandiseQuantity = order.merchItems.reduce((sum, item) => sum + item.quantity, 0);
  const items = events.length ? events : [{
    id: order.merchItems[0]?.id || order.id,
    title: order.name,
    image: order.merchItems[0]?.image || order.image,
    gradientFrom: fallback.pageBackground,
    gradientTo: fallback.pageBackgroundTo,
  }];
  return {
    title: events.length > 1 ? `${events.length}-event order` : items[0]?.title || order.name,
    itemSummary: events.length
      ? `${registrationEntries(order.eventEntries).length} registration item${registrationEntries(order.eventEntries).length === 1 ? '' : 's'}`
      : `${merchandiseQuantity} item${merchandiseQuantity === 1 ? '' : 's'}`,
    items,
    totalMediaCount: events.length || 1,
  };
}

function stateAppearance(state) {
  if (!state) return { bg: 'neutralBg', fg: 'neutralText', border: 'line' };
  if (state.tone === 'warning') return { bg: '#33270eb3', fg: '#fff4c5', border: '#f4c95d59' };
  if (state.tone === 'ready') return { bg: '#09241eb3', fg: '#ddfff4', border: '#75e3bf4d' };
  if (state.tone === 'refunded') return { bg: '#32131bb3', fg: '#ffe8ec', border: '#ff8f9c59' };
  return { bg: '#0b1b2db3', fg: '#e7f2ff', border: '#9bc5ff4d' };
}

function semanticPill(label, tone = 'neutral') {
  const colors = tone === 'warning'
    ? { bg: 'warningBg', fg: 'warningText', border: 'warningLine' }
    : tone === 'ready'
      ? { bg: 'brandSoft', fg: 'brand', border: 'brandSoft' }
      : tone === 'danger'
        ? { bg: 'dangerBg', fg: 'dangerText', border: 'dangerLine' }
        : tone === 'refunded'
          ? { bg: '#eef2ff', fg: '#4338ca', border: '#d8ddff' }
          : { bg: 'neutralBg', fg: 'neutralText', border: 'line' };
  return pill(label, { bg: colors.bg, fg: colors.fg, border: colors.border, borderW: 1 });
}

function imageNode(src, size, props = {}) {
  return { image: { src, size, fit: 'crop', ...props } };
}

function fallbackSvg(from, to, label = '') {
  const safeLabel = String(label).replace(/[<&>]/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><text x="44" y="420" fill="#ffffff" fill-opacity=".68" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="600">${safeLabel}</text></svg>`;
}

function svgDataUri(svg) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function loadSourceModule(entryPoint, tempDir, suffix) {
  const result = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    absWorkingDir: ROOT,
    alias: { '@': path.join(ROOT, 'src') },
    loader: { '.png': 'dataurl', '.svg': 'dataurl', '.css': 'empty' },
  });
  const target = path.join(tempDir, `${suffix}.mjs`);
  await fs.writeFile(target, result.outputFiles[0].text);
  return import(`${pathToFileURL(target).href}?cache=${Date.now()}-${suffix}`);
}

async function loadDataUri(source, fallback) {
  if (!source) return svgDataUri(fallbackSvg(fallback[0], fallback[1], fallback[2]));
  if (source.startsWith('data:')) return source;
  if (source.startsWith('http')) {
    try {
      const url = source.replace(/([?&])w=1080\b/, '$1w=720');
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      return `data:${contentType};base64,${bytes.toString('base64')}`;
    } catch (error) {
      mediaFindings.push(`Remote artwork could not be fetched for ${source}: ${error.message}. A source-compatible theme panel fallback was embedded.`);
      return svgDataUri(fallbackSvg(fallback[0], fallback[1], fallback[2]));
    }
  }
  try {
    const bytes = await fs.readFile(path.resolve(ROOT, source));
    return `data:image/png;base64,${bytes.toString('base64')}`;
  } catch {
    mediaFindings.push(`Local artwork could not be read for ${source}. A source-compatible theme panel fallback was embedded.`);
    return svgDataUri(fallbackSvg(fallback[0], fallback[1], fallback[2]));
  }
}

async function qrDataUri(value) {
  return QRCode.toDataURL(value, {
    width: 720,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f172b', light: '#ffffff' },
  });
}

function mediaBox(src, bg, width = 'fill', height = 'fill', size = 320, name = 'Media') {
  return box(src ? [imageNode(src, size, { w: 'fill', h: 'fill', name: `${name} image` })] : [], {
    w: width,
    h: height,
    bg,
    clip: true,
    name,
  });
}

function statusLabel(state, name = 'Status') {
  const appearance = stateAppearance(state);
  return pill(state?.label || '', {
    bg: appearance.bg,
    fg: appearance.fg,
    border: appearance.border,
    borderW: 1,
    name,
  });
}

async function orderCard(order, width) {
  const brand = resolvedBrand(order.eventEntries[0]?.ticket.brand);
  const src = order.eventEntries[0]?.ticket.image || order.merchItems[0]?.image || order.image;
  const image = await loadDataUri(src, [brand.pageBackground, brand.pageBackgroundTo, order.name]);
  const state = getOrderState(order);
  const title = orderOverviewTitle(order);
  const details = orderCardDetails(order);
  const titleRow = row([
    text(title.primary, 'cardTitle', { grow: 1, maxW: 'fill' }),
    ...(title.additionalCount > 0 ? [pill(`+${title.additionalCount} more`, {
      bg: '#0000004d',
      fg: '#ffffffeb',
      border: '#ffffff33',
      borderW: 1,
      size: 11,
      name: 'Additional event count',
    })] : []),
  ], { w: 'fill', align: 'baseline', gap: 8, name: 'Order title' });
  const metadata = details
    ? row([icon('calendar', 14), text(details.date, 'cardSmall')], { w: 'fill', align: 'center', gap: 6 })
    : text(order.date, 'cardSmall');
  const content = stack([
    stack([
      ...(state ? [statusLabel(state, 'Order status')] : []),
      titleRow,
      text(details?.ticketType || itemSummary(order), 'cardMeta', { maxW: 'fill' }),
      metadata,
    ], { gap: 8 }),
    text(money(orderTotal(order)), 'cardTitle', { align: 'right' }),
  ], {
    w: 'fill',
    h: 'fill',
    pad: [14, 16],
    justify: 'between',
    gap: 8,
    name: `Order card content · ${order.ref}`,
  });
  return stack([
    imageNode(image, 720, { w: 'fill', h: 176, name: 'Order card artwork' }),
    { overlay: { anchor: 'center', w: 'fill', h: 'fill', children: [content], name: 'Order card material' } },
  ], {
    w: width,
    h: 176,
    bg: brand.pageBackgroundTo,
    radius: 18,
    clip: true,
    shadow: 'card',
    name: `Order card · ${order.ref}`,
  });
}

function filterTabs(active, visibleOrders) {
  const tabs = [
    ['All', visibleOrders.length, active === 'all'],
    ['Pending', visibleOrders.filter(orderHasPending).length, active === 'pending'],
    ['Complete', visibleOrders.filter(orderIsComplete).length, active === 'complete'],
  ];
  return row(tabs.map(([label, count, selected]) => stack([
    text(label, selected ? 'smallStrong' : 'small', { align: 'center' }),
    text(count, selected ? 'captionStrong' : 'caption', { align: 'center' }),
  ], {
    w: 'fill',
    h: 34,
    align: 'center',
    justify: 'center',
    gap: 1,
    bg: selected ? 'white' : 'none',
    fg: selected ? 'brand' : 'muted',
    radius: 10,
    border: selected ? 'lineGreen' : 'none',
    borderW: selected ? 1 : 0,
    shadow: selected ? 'tab' : undefined,
    name: `Filter tab · ${label}`,
  })), {
    w: 340,
    h: 40,
    pad: 3,
    gap: 3,
    bg: '#f1f5f9',
    radius: 12,
    name: 'Order filters',
  });
}

function headerNode({ detail = false } = {}) {
  const left = row([
    ...(detail ? [box([icon('back', 18)], { w: 40, h: 40, bg: 'white', radius: 'full', border: 'line', borderW: 1, name: 'Back button' })] : []),
    avatar('PO', 24, { bg: 'brandSoft', fg: 'brand', radius: 8, name: 'PlanOut logo tile' }),
    text('PlanOut', 'h3', { color: 'ink' }),
  ], { align: 'center', gap: 8 });
  const nav = row([
    text('Home', 'nav'),
    text('Events', 'nav'),
    row([text('Orders', 'navActive'), pill('3', { bg: '#f43f5e', fg: 'white', size: 9, name: 'Orders badge' })], { align: 'center', gap: 6 }),
  ], { align: 'center', gap: 28 });
  const actions = row([
    icon('bag', 21),
    pill('4', { bg: '#f43f5e', fg: 'white', size: 9, name: 'Notification badge' }),
    avatar('JS', 32, { bg: 'brandSoft', fg: 'brand', name: 'Profile avatar' }),
  ], { align: 'center', gap: 10 });
  return row([left, nav, actions], {
    w: 1280,
    h: 80,
    pad: [0, 40],
    align: 'center',
    justify: 'between',
    name: detail ? 'Orders detail header' : 'Orders header',
  });
}

function pageFrame(mainChildren, { detail = false, pageWidth = 1200 } = {}) {
  return stack([
    headerNode({ detail }),
    stack(mainChildren, {
      w: pageWidth,
      align: 'start',
      gap: 16,
      pad: [32, 0, 48, 0],
      name: detail ? 'Order detail page content' : 'Orders page content',
    }),
  ], { w: 'fill', bg: 'canvas', align: 'center', name: 'PlanOut application shell' });
}

async function overviewPage(active, visibleOrders, empty = false) {
  const filtered = empty
    ? []
    : visibleOrders.filter((order) => active === 'pending' ? orderHasPending(order) : active === 'complete' ? orderIsComplete(order) : true);
  const cards = await Promise.all(filtered.map((order) => orderCard(order, 592)));
  const list = filtered.length
    ? row(cards, { w: 'fill', wrap: true, gap: 16, gapY: 16, name: 'Orders card grid' })
    : stack([
        imageNode(await loadDataUri(path.join('src/assets/empty-states/no-orders.png'), [C.brandSoft, C.canvas, 'No orders']), 128, { w: 128, h: 128, name: 'No orders illustration' }),
        text('No orders here', 'h3', { align: 'center' }),
        text('Try a different order filter.', 'small', { align: 'center' }),
      ], {
        w: 'fill',
        h: 260,
        pad: 32,
        align: 'center',
        justify: 'center',
        gap: 8,
        bg: 'white',
        border: 'lineSoft',
        borderW: 1,
        radius: 16,
        name: 'No orders empty state',
      });
  return pageFrame([
    stack([
      text('Orders', 'h1'),
      text('Forms, access, and delivery in one place.', 'small', { maxW: 560 }),
    ], { gap: 8, name: 'Orders page heading' }),
    filterTabs(active, visibleOrders),
    list,
  ]);
}

async function coverNode(order) {
  const cover = coverPresentation(order);
  const panels = await Promise.all(cover.items.slice(0, 3).map(async (item) => {
    const brand = resolvedBrand(order.eventEntries.find((entry) => entry.ticket.id === item.id)?.ticket.brand);
    return {
      ...item,
      src: await loadDataUri(item.image, [item.gradientFrom || brand.pageBackground, item.gradientTo || brand.pageBackgroundTo, item.title]),
    };
  }));
  const count = cover.totalMediaCount;
  let media;
  if (count <= 1) {
    media = mediaBox(panels[0]?.src, panels[0]?.gradientFrom || C.coverFallback, 'fill', 'fill', 720, 'Single cover panel');
  } else if (count === 2) {
    media = row([
      mediaBox(panels[0]?.src, panels[0].gradientFrom, 696, 'fill', 720, 'Leading cover panel'),
      mediaBox(panels[1]?.src, panels[1].gradientFrom, 504, 'fill', 720, 'Second cover panel'),
    ], { w: 'fill', h: 'fill', gap: 1, name: 'Two-event cover media' });
  } else {
    media = row([
      mediaBox(panels[0]?.src, panels[0].gradientFrom, 744, 'fill', 720, 'Leading mosaic panel'),
      stack([
        mediaBox(panels[1]?.src, panels[1]?.gradientFrom || C.coverFallback, 'fill', 149, 720, 'Upper mosaic panel'),
        mediaBox(panels[2]?.src, panels[2]?.gradientFrom || C.coverFallback, 'fill', 149, 720, 'Lower mosaic panel'),
      ], { w: 456, h: 'fill', gap: 1, name: 'Trailing mosaic panels' }),
    ], { w: 'fill', h: 'fill', gap: 1, name: 'Three-event cover media' });
  }
  const state = getOrderState(order);
  const overflow = Math.max(0, count - 3);
  const statusAndDate = row([
    state ? statusLabel(state, 'Order cover status') : text('', 'caption'),
    text(`Purchased ${order.date}`, 'coverMeta', { align: 'right' }),
  ], { w: 'fill', align: 'center', justify: 'between', gap: 12 });
  const bottom = stack([
    text(`Order details · ${order.ref}`, 'mono'),
    text(cover.title, 'coverTitle', { maxW: 'fill' }),
    row([
      text(cover.itemSummary, 'coverMeta'),
      text('·', 'coverMeta'),
      text(money(orderTotal(order)), 'coverTitle', { size: 18, lh: 20 }),
    ], { align: 'baseline', gap: 8, wrap: true }),
  ], { gap: 8, maxW: 'fill' });
  const content = stack([statusAndDate, bottom], {
    w: 'fill',
    h: 'fill',
    pad: [28, 28],
    justify: 'between',
    gap: 16,
  });
  return stack([
    media,
    { overlay: { anchor: 'center', w: 'fill', h: 'fill', children: [content], name: 'Cover hierarchy overlay' } },
    ...(overflow > 0 ? [{ overlay: { anchor: 'corner-tr', children: [pill(`+${overflow}`, { bg: '#00000073', fg: 'white', border: '#ffffff40', borderW: 1, name: 'Cover overflow count' })] } }] : []),
  ], {
    w: 'fill',
    h: 300,
    bg: 'coverFallback',
    radius: 28,
    clip: true,
    shadow: 'cover',
    name: `Adaptive order cover · ${order.ref}`,
  });
}

function actionRow(actions) {
  return row(actions, { align: 'center', justify: 'end', gap: 8, wrap: true });
}

function actionButton(label, variant = 'secondary') {
  return button(label, variant, { radius: 12 });
}

function registrationHeader(entry) {
  const brand = resolvedBrand(entry.ticket.brand);
  return row([
    mediaBox(null, brand.accentSoft || C.brandSoft, 40, 40, 80, 'Event thumbnail'),
    stack([
      text(entry.entryName, 'h3', { maxW: 'fill' }),
      row([icon('calendar', 12), text(dateOnly(entry.ticket.eventDate), 'captionStrong')], { align: 'center', gap: 5 }),
      row([icon('pin', 12), text(entry.ticket.eventLocation, 'caption', { maxW: 'fill' })], { align: 'start', gap: 5 }),
    ], { grow: 1, gap: 4, minW: 1 }),
  ], { w: 'fill', align: 'center', gap: 12, pad: [16, 20, 8, 20] });
}

function compactStateRow(content, actions, tone = null) {
  const background = tone === 'warning' ? 'warningBg' : tone === 'danger' ? 'dangerBg' : 'none';
  const border = tone === 'warning' ? 'warningLine' : tone === 'danger' ? 'dangerLine' : 'lineSoft';
  return row([
    stack(content, { grow: 1, gap: 5, minW: 1 }),
    actionRow(actions),
  ], {
    w: 'fill',
    minH: 58,
    pad: [12, 20],
    align: 'center',
    gap: 12,
    bg: background,
    border: border,
    borderW: tone ? 1 : 0,
    name: tone ? `Registration state · ${tone}` : 'Registration state',
  });
}

function claimActions() {
  return [actionButton('Copy link'), actionButton('Revoke', 'secondary')];
}

function formActions({ primary = false } = {}) {
  return [actionButton('Fill up'), actionButton('Share form', primary ? 'primary' : 'secondary')];
}

function nonTeamState(entry, order) {
  const isGuestAccess = entry.type === 'guest' && entry.accessPath === 'guest_qr' && entry.status === 'attached';
  const isPassport = entry.status === 'attached' && !isGuestAccess;
  if (isGuestAccess) {
    return compactStateRow([
      pill('Guest QR ready', { bg: 'white', fg: 'brand', border: '#d9ece8', borderW: 1 }),
      text('Ready to share · no app required.', 'small', { color: 'slate' }),
    ], [actionButton('View form'), actionButton('Generate & send QR', 'primary')], 'ready');
  }
  if (isPassport) {
    return compactStateRow([
      row([semanticPill('Ready for gate', 'ready'), text('PlanOut Passport', 'caption')], { align: 'center', gap: 8 }),
    ], [actionButton('View form'), actionButton('View QR', 'primary')]);
  }
  if (entry.inviteStatus === 'invited') {
    return compactStateRow([
      text('Claim link sent', 'small'),
    ], claimActions(), 'pending');
  }
  if (entry.status === 'released') {
    return compactStateRow([
      text('Spot released — form deadline missed', 'bodyStrong', { color: 'dangerText' }),
      text(`The registration form was not submitted before ${entry.ticket.deadline || entry.ticket.eventDate}. Your reserved spot has been returned to inventory. No refund is issued for released spots.`, 'small', { color: 'dangerDeep', maxW: 'fill' }),
    ], [actionButton('Check if slots available', 'primary')], 'danger');
  }
  if (entry.status === 'resubmit_required') {
    return compactStateRow([
      text('Form update required - review and resubmit', 'bodyStrong', { color: '#c2410c' }),
    ], [actionButton('Review changes', 'primary'), actionButton('Contact organizer')], 'warning');
  }
  return compactStateRow([
    row([
      semanticPill(entry.type === 'guest' ? 'Form needed' : 'Form needed', 'warning'),
      text('· participant form required', 'captionStrong', { color: '#8a7760' }),
    ], { align: 'center', gap: 6, wrap: true }),
  ], [...formActions({ primary: entry.type === 'guest' }), ...(entry.type === 'self' ? [] : [actionButton('Contact organizer')])], 'warning');
}

function teamPlayerRow(playerEntry, index, memberId = '7c4f1a92-3b7e-4a11-9d2b-1e8b0c4f6a23') {
  const isGuestQr = playerEntry.accessPath === 'guest_qr' && playerEntry.status === 'attached';
  const isPassport = playerEntry.accessPath === 'passport' && playerEntry.status === 'attached';
  const isInvite = playerEntry.inviteStatus === 'invited';
  const isFormNeeded = !isGuestQr && !isPassport && !isInvite && playerEntry.status !== 'attached';
  const playerName = playerEntry.participantLabel || playerEntry.participantName || `Player ${index + 1}`;
  const playerDetail = isInvite
    ? `${playerEntry.attendeeEmail || 'Recipient'} · Claim link sent`
    : isGuestQr
      ? 'Guest QR'
      : isPassport
        ? 'In Passport'
        : playerEntry.status === 'attached'
          ? 'Ready'
          : 'Form needed';
  let actions = [];
  if (isGuestQr) actions = [actionButton('View form'), actionButton('View QR', 'primary')];
  else if (isPassport && playerEntry.passportMemberId === memberId) actions = [actionButton('View form'), actionButton('View QR', 'primary')];
  else if (isInvite) actions = claimActions();
  else if (playerEntry.status !== 'attached') actions = formActions({ primary: true });
  const content = [
    text(playerName, 'smallStrong'),
    row([
      ...(isGuestQr || isPassport ? [icon('check', 12)] : []),
      ...(isFormNeeded ? [semanticPill(playerDetail, 'warning')] : [text(playerDetail, 'captionStrong')]),
    ], { align: 'center', gap: 6 }),
  ];
  return row([
    stack(content, { grow: 1, gap: 4, minW: 1 }),
    actionRow(actions),
  ], { w: 'fill', minH: 54, pad: [10, 0], align: 'center', gap: 10, border: 'lineSoft', borderW: 0, name: `Team player · ${playerName}` });
}

function teamRegistrationItem(entry, order) {
  const teamEntries = order.eventEntries.filter((item) => item.type === 'team' && item.ticket.id === entry.ticket.id);
  const summary = teamSummary(teamEntries);
  if (!summary) return stack([]);
  const maxPlayers = entry.ticket.maxParticipants ?? teamEntries.length;
  const canAdd = teamEntries.length < maxPlayers;
  const unsent = teamEntries.filter((player) => player.status !== 'attached' && player.status !== 'released' && player.inviteStatus !== 'invited' && player.accessPath !== 'passport' && player.accessPath !== 'guest_qr');
  return stack([
    row([
      box([icon('users', 18)], { w: 40, h: 40, bg: 'brandPale', radius: 13, name: 'Team icon' }),
      stack([
        text('Players', 'h3', { color: 'darkInk' }),
        row([text(`${summary.setUpCount} of ${summary.totalCount} ready`, 'h2', { color: 'slate' }), ...(canAdd ? [] : [text('Full', 'captionStrong')])], { align: 'baseline', gap: 8 }),
      ], { grow: 1, gap: 2 }),
    ], { w: 'fill', align: 'center', gap: 12, pad: [16, 20, 0, 20] }),
    text('Fill for Guest QR, or send a link to their Passport.', 'small', { color: 'slate', maxW: 'fill', }),
    row([box([], { w: 'fill', h: 6, bg: 'brand', radius: 'full', name: 'Team setup progress' })], { w: 'fill', h: 6, bg: '#dcebe7', radius: 'full', clip: true, name: `${summary.setUpCount} of ${summary.totalCount} player entries set up` }),
    row([
      ...(unsent.length ? [text(`${unsent.length} unsent form${unsent.length === 1 ? '' : 's'}`, 'captionStrong', { color: '#6a817b' })] : []),
      actionButton('Send all'),
      actionButton('Copy all'),
      actionButton('Contact organizer'),
    ], { w: 'fill', align: 'center', justify: 'end', gap: 8, wrap: true, pad: [4, 20, 12, 20] }),
    rule({ color: 'lineGreen' }),
    stack(teamEntries.map((player, index) => teamPlayerRow(player, index)), { w: 'fill', pad: [0, 20], gap: 0, name: 'Team player list' }),
    ...(canAdd ? [actionButton('Add player', 'secondary')] : []),
  ], { w: 'fill', gap: 8, name: `Team registration · ${entry.ticket.id}` });
}

async function registrationItem(entry, order) {
  const header = registrationHeader(entry);
  const body = entry.type === 'team' ? teamRegistrationItem(entry, order) : nonTeamState(entry, order);
  return stack([header, body], { w: 'fill', gap: 0, name: `Registration item · ${entry.entryName}` });
}

async function registrationSection(order) {
  if (!order.eventEntries.length) return null;
  const entries = registrationEntries(order.eventEntries);
  const pendingFormCount = order.eventEntries.filter((entry) => entry.status === 'pending_form' || entry.status === 'resubmit_required').length;
  const hasTeam = entries.some((entry) => entry.type === 'team');
  const shareable = order.eventEntries.filter((entry) => entry.status !== 'attached' && entry.status !== 'released' && entry.status !== 'no_show');
  const unsent = shareable.filter((entry) => entry.inviteStatus !== 'invited' && !entry.attendeeEmail && entry.accessPath !== 'passport' && entry.accessPath !== 'guest_qr');
  const items = [];
  entries.forEach((entry, index) => {
    if (index > 0) items.push(rule({ color: 'lineGreen' }));
    items.push(entry);
  });
  const renderedItems = [];
  for (let index = 0; index < entries.length; index += 1) {
    if (index > 0) renderedItems.push(rule({ color: 'lineGreen' }));
    renderedItems.push(await registrationItem(entries[index], order));
  }
  return stack([
    row([
      stack([
        text('Registration', 'h2'),
        text('Forms and access for this order', 'small', { color: '#7b8b9a' }),
      ], { grow: 1, gap: 2 }),
      ...(pendingFormCount > 0 ? [semanticPill(`${pendingFormCount} form${pendingFormCount === 1 ? '' : 's'} needed`, 'warning')] : []),
    ], { w: 'fill', align: 'end', justify: 'between', gap: 12, pad: [0, 4] }),
    ...(!hasTeam && shareable.length ? [row([
      ...(unsent.length ? [text(`${unsent.length} unsent form${unsent.length === 1 ? '' : 's'}`, 'captionStrong', { color: '#6a817b' })] : []),
      actionButton('Send all'),
      actionButton('Copy all'),
    ], { w: 'fill', align: 'center', justify: 'end', gap: 8, wrap: true })] : []),
    stack(renderedItems, {
      w: 'fill',
      bg: 'white',
      border: 'lineGreen',
      borderW: 1,
      radius: 20,
      clip: true,
      shadow: 'card',
      name: 'Registration item list',
    }),
  ], { w: 'fill', gap: 12, name: 'Registration section' });
}

function merchandiseItem(item) {
  const media = item.image ? imageNode(item.image, 80, { w: 40, h: 40, radius: 10, name: `${item.name} image` }) : avatar(item.name[0], 40, { radius: 10 });
  return stack([
    row([
      media,
      stack([
        row([
          stack([
            text(item.name, 'h3'),
            text(`${item.variant} · Qty ${item.quantity}`, 'small'),
          ], { grow: 1, gap: 2, minW: 1 }),
          text(money(item.price * item.quantity), 'smallStrong'),
        ], { w: 'fill', align: 'start', justify: 'between', gap: 12 }),
        text('Claim at the event', 'small', { color: 'subtle' }),
      ], { grow: 1, gap: 8, minW: 1 }),
    ], { w: 'fill', align: 'start', gap: 12 }),
  ], { w: 'fill', pad: 16, gap: 8, bg: 'white', border: 'lineSoft', borderW: 1, radius: 16, name: `Merchandise item · ${item.name}` });
}

function merchandiseSection(order) {
  if (!order.merchItems.length) return null;
  return stack([
    text('Merchandise', 'h2'),
    ...order.merchItems.map(merchandiseItem),
  ], { w: 'fill', gap: 12, name: 'Merchandise section' });
}

function refundSection(order) {
  if (!order.refunded) return null;
  return stack([
    row([icon('rotate', 16), text('Refund', 'h3')], { align: 'center', gap: 8 }),
    text(`${money(order.refunded.amount)} refunded on ${order.refunded.date} via ${order.refunded.method}.`, 'small'),
    ...(order.refunded.neverAttached ? [text('Access was never created for this event — no impact to your QR.', 'caption')] : []),
  ], { w: 'fill', pad: 16, gap: 8, bg: 'white', border: 'lineSoft', borderW: 1, radius: 16, name: 'Refund section' });
}

function paymentSummary(order) {
  const lines = [
    ...eventLineItems(order.eventEntries),
    ...order.merchItems.map((item) => ({ id: item.id, label: `${item.quantity}x ${item.name}`, amount: item.price * item.quantity })),
  ];
  return stack([
    row([text('Payment summary', 'h3'), semanticPill(order.paymentStatus, order.paymentStatus === 'Paid' ? 'ready' : 'danger')], { w: 'fill', align: 'center', justify: 'between', gap: 8 }),
    stack([
      ...lines.map((line) => row([text(line.label, 'small', { maxW: 'fill', grow: 1 }), text(money(line.amount), 'smallStrong')], { w: 'fill', justify: 'between', gap: 12 })),
      rule({ color: 'lineSoft', opacity: lines.length ? 1 : 0 }),
      row([text('Subtotal', 'caption'), text(money(orderSubtotal(order)), 'caption')], { w: 'fill', justify: 'between' }),
      row([text('Fees', 'caption'), text(money(order.fees), 'caption')], { w: 'fill', justify: 'between' }),
      rule({ color: 'lineSoft' }),
      row([text('Total', 'bodyStrong'), text(money(orderTotal(order)), 'h2')], { w: 'fill', justify: 'between', align: 'baseline' }),
    ], { w: 'fill', gap: 8 }),
    text(`${order.paymentMethod} - ${order.paymentDate}`, 'caption', { border: 'lineSoft', borderW: 0 }),
  ], { w: 'fill', pad: 16, gap: 12, bg: 'white', border: 'line', borderW: 1, radius: 16, name: 'Payment summary' });
}

function detailActions() {
  return row([
    button('Download receipt', 'secondary', { w: 'fill' }),
    button('Get help', 'secondary', { w: 'fill' }),
  ], { w: 'fill', gap: 8 });
}

async function orderDetailPage(order) {
  const cover = await coverNode(order);
  const registration = await registrationSection(order);
  const merchandise = merchandiseSection(order);
  const refund = refundSection(order);
  const left = stack([registration, merchandise, refund].filter(Boolean), { grow: 1, gap: 16, minW: 1, name: 'Order detail operational column' });
  const right = stack([paymentSummary(order), detailActions()], { w: 380, gap: 16, name: 'Order detail payment column' });
  return pageFrame([
    cover,
    row([left, right], { w: 'fill', align: 'start', gap: 32, name: 'Order detail columns' }),
  ], { detail: true });
}

function notFoundPage() {
  return pageFrame([
    stack([
      imageNode(svgDataUri(fallbackSvg(C.brandSoft, C.canvas, 'Order not found')), 160, { w: 160, h: 160, name: 'Order not found illustration' }),
      text('Order not found', 'modalTitle'),
      button('Back to Orders', 'primary'),
    ], { w: 'fill', h: 420, align: 'center', justify: 'center', gap: 12, name: 'Order not found state' }),
  ], { detail: true });
}

function modalFrame(panel, name, notes) {
  return screen(name, [1440, 960], 'src/app/pages/OrdersPage.tsx; src/app/components/OrderQrOverlay.tsx', [
    stack([panel], { w: 'fill', h: 'fill', minH: 960, bg: 'backdrop', align: 'center', justify: 'center', pad: 32, name: 'Modal backdrop' }),
  ], notes);
}

function emailReviewPanel({ bulk = false } = {}) {
  if (!bulk) {
    return stack([
      row([
        row([box([icon('mail', 20)], { w: 40, h: 40, bg: 'brandSoft', radius: 12 }), stack([text('Send form link', 'modalTitle'), text('Review before the invite sends.', 'caption')], { gap: 4 })], { align: 'center', gap: 12 }),
        box([icon('close', 16)], { w: 36, h: 36, bg: 'white', radius: 'full', border: 'line', borderW: 1 }),
      ], { w: 'fill', justify: 'between', align: 'start', gap: 16 }),
      stack([
        text('RECIPIENT EMAIL', 'captionStrong', { tracking: 0.8 }),
        input('daniel.cruz@email.com', { w: 'fill', h: 48, bg: 'white', border: '#c9ddd9', borderW: 1, radius: 11 }),
        text('A default PlanOut invite will be sent to this address.', 'caption'),
      ], { w: 'fill', pad: 14, gap: 8, bg: '#f8fcfb', border: 'lineGreen', borderW: 1, radius: 14 }),
      row([button('Cancel', 'secondary'), button('Send invite', 'primary')], { w: 'fill', justify: 'end', gap: 8 }),
    ], { w: 520, pad: 20, gap: 20, bg: 'white', border: 'lineGreen', borderW: 1, radius: 20, shadow: 'modal', name: 'Email review sheet' });
  }
  const group = stack([
    row([text('Dumaguete Futsal Cup Season 4', 'smallStrong', { color: 'slate' }), text('2 recipients', 'captionStrong', { color: '#6a817b' })], { w: 'fill', justify: 'between', align: 'start', gap: 8, pad: [10, 14], bg: '#e9f7f3', border: 'lineGreen', borderW: 1 }),
    stack([
      stack([text('Player 7', 'smallStrong', { color: 'slate' }), input('', { placeholder: 'name@example.com', w: 'fill', h: 44, bg: '#f7f9f8', border: 'lineGreen', borderW: 1, radius: 12 })], { gap: 8, pad: 14 }),
      rule({ color: 'lineSoft' }),
      stack([text('Player 8', 'smallStrong', { color: 'slate' }), input('', { placeholder: 'name@example.com', w: 'fill', h: 44, bg: '#f7f9f8', border: 'lineGreen', borderW: 1, radius: 12 })], { gap: 8, pad: 14 }),
    ], { gap: 0, bg: 'white' }),
  ], { w: 'fill', border: 'lineGreen', borderW: 1, radius: 16, clip: true });
  return stack([
    row([stack([text('Email pending forms', 'modalTitle'), text('Check each recipient before sending.', 'caption')], { gap: 4 }), box([icon('close', 16)], { w: 36, h: 36, bg: 'white', radius: 'full', border: 'line', borderW: 1 })], { w: 'fill', justify: 'between', align: 'start', gap: 16 }),
    group,
    text('Only unsent forms without Passport or Guest QR access are included.', 'caption', { bg: '#f1f5f4', radius: 12, w: 'fill' }),
    row([button('Cancel', 'secondary'), button('Send 2 invites', 'primary')], { w: 'fill', justify: 'end', gap: 8 }),
  ], { w: 520, pad: 20, gap: 16, bg: '#fafcfb', border: '#ffffffb3', borderW: 1, radius: 26, shadow: 'modal', name: 'Bulk email review sheet' });
}

function shareMenuScreen() {
  const selected = stack([
    row([stack([text('Guest 3', 'smallStrong'), text('Form needed · participant form required', 'caption')], { grow: 1, gap: 3 }), button('Share form', 'secondary')], { w: 540, align: 'center', justify: 'between', gap: 12, pad: 16, bg: 'white', border: 'lineGreen', borderW: 1, radius: 16, shadow: 'card' }),
    stack([
      row([icon('mail', 14), text('Send link', 'smallStrong', { color: 'darkInk' })], { align: 'center', gap: 8, pad: [8, 10] }),
      row([icon('copy', 14), text('Copy link', 'smallStrong', { color: 'darkInk' })], { align: 'center', gap: 8, pad: [8, 10] }),
    ], { w: 168, pad: 6, gap: 2, bg: 'white', border: 'lineGreen', borderW: 1, radius: 12, shadow: 'menu', name: 'Form sharing options' }),
  ], { w: 540, gap: 8, name: 'Share form menu state' });
  return screen('Orders / Interaction / 15 — Share form menu', [1440, 960], 'src/app/pages/OrdersPage.tsx', [
    pageFrame([stack([text('Orders', 'h1'), text('Dumaguete City Night Run - setup in progress', 'h2'), selected], { w: 1200, gap: 16, pad: [32, 0, 48, 0] })]),
  ], 'Dropdown state from ParticipantFormLinkActions; native menu geometry is represented as a positioned child without hover or focus styling.');
}

function guestQrPanel(qrSrc) {
  return stack([
    row([stack([text('QR VIEWER', 'captionStrong', { color: 'subtle', tracking: 1.8 }), text('Guest access pass', 'modalTitle'), text('Show or share this app-less entry pass.', 'caption')], { gap: 5 }), box([icon('close', 16)], { w: 36, h: 36, bg: 'white', radius: 'full', border: 'line', borderW: 1 })], { w: 'fill', justify: 'between', align: 'start', gap: 16, pad: [20, 28] }),
    rule({ color: 'lineSoft' }),
    stack([
      text('Mia Torres', 'coverTitle', { size: 24, lh: 27, color: 'white', align: 'center' }),
      text('Dumaguete City Night Run · 10K Group Entry', 'cardMeta', { align: 'center' }),
      imageNode(qrSrc, 220, { w: 220, h: 220, radius: 16, name: 'Guest entry QR code' }),
      text('GE-DEMO-4021', 'mono', { align: 'center', tracking: 1.2 }),
      row([text('AUGUST 14, 2026', 'cardSmall'), text('6:30 PM · Main Gate', 'cardSmall')], { w: 'fill', justify: 'between', gap: 10 }),
      row([text('Valid until', 'caption', { color: 'white70' }), text('AUGUST 14, 2026', 'cardSmall')], { w: 'fill', justify: 'between', gap: 10 }),
    ], { w: 324, pad: [20, 20, 18, 20], align: 'center', gap: 14, bg: '#063c36', radius: 14, name: 'Guest access pass' }),
    row([button('Share Guest QR', 'primary'), button('Regenerate QR', 'ghost')], { w: 324, justify: 'center', gap: 8, pad: [0, 0, 20, 0] }),
  ], { w: 560, bg: 'white', border: '#ffffffcc', borderW: 1, radius: 26, clip: true, shadow: 'modal', align: 'center', gap: 16, name: 'Guest QR overlay' });
}

function passportQrPanel(qrSrc) {
  return stack([
    row([stack([text('QR VIEWER', 'captionStrong', { color: 'subtle', tracking: 1.8 }), text('PlanOut Passport QR', 'modalTitle'), text('Your universal QR for ready event registrations.', 'caption')], { gap: 5 }), box([icon('close', 16)], { w: 36, h: 36, bg: 'white', radius: 'full', border: 'line', borderW: 1 })], { w: 'fill', justify: 'between', align: 'start', gap: 16, pad: [20, 28] }),
    rule({ color: 'lineSoft' }),
    stack([
      row([stack([text('PLANOUT PASSPORT', 'captionStrong', { color: '#71829a', tracking: 1.8 }), text('Universal event QR', 'smallStrong', { color: 'slate' })], { gap: 4 }), semanticPill('Ready', 'ready')], { w: 'fill', justify: 'between', align: 'start', gap: 12 }),
      imageNode(qrSrc, 286, { w: 286, h: 286, radius: 14, name: 'Passport QR code' }),
      text('Jessica Sanchez', 'h2', { align: 'center' }),
      text('PO-7K2M-9XQA', 'monoDark', { align: 'center', tracking: 2 }),
      text('Show this QR at the gate. It works across your ready registrations.', 'small', { align: 'center', maxW: 300 }),
    ], { w: 'fill', pad: [20, 28], gap: 12, align: 'center', bg: '#f7fbfa', name: 'Passport QR viewer body' }),
  ], { w: 560, bg: 'white', border: '#ffffffcc', borderW: 1, radius: 26, clip: true, shadow: 'modal', gap: 0, name: 'Passport QR overlay' });
}

function removePlayerPanel() {
  return stack([
    row([icon('trash', 26)], { w: 56, h: 56, bg: 'dangerBg', radius: 'full', align: 'center', justify: 'center', name: 'Remove player icon' }),
    text('Remove player entry?', 'modalTitle', { align: 'center' }),
    text('Remove Player 7 from this purchase before sending their access?', 'body', { align: 'center', maxW: 360 }),
    row([button('Cancel', 'secondary'), button('Remove', 'primary', { bg: '#dc2626', fg: 'white' })], { w: 'fill', justify: 'end', gap: 8 }),
  ], { w: 420, pad: 24, gap: 14, align: 'center', bg: 'white', border: 'line', borderW: 1, radius: 16, shadow: 'modal', name: 'Remove player confirmation' });
}

function contactOrganizerPanel() {
  const organizer = 'Dumaguete Futsal Association';
  return stack([
    row([
      row([avatar('PO', 40, { bg: 'brandPale', fg: 'brand' }), stack([text('Contact organizer', 'h3'), row([avatar('DF', 20, { size: 20, bg: '#22694d', fg: 'white', radius: 'full' }), text(`${organizer} · Powered by PlanOut`, 'caption')], { align: 'center', gap: 6 })], { gap: 4 })], { align: 'center', gap: 12 }),
      box([icon('close', 18)], { w: 40, h: 40, bg: 'none', radius: 'full' }),
    ], { w: 'fill', justify: 'between', align: 'start', gap: 16, pad: [16, 20] }),
    stack([
      stack([
        text('REGARDING', 'captionStrong', { tracking: 0.8 }),
        text('Dumaguete Futsal Cup Season 4 · Order FUT-2026-002390', 'smallStrong'),
      ], { w: 'fill', pad: 12, gap: 5, bg: 'white', border: 'lineGreen', borderW: 1, radius: 14 }),
      text(`Hi! You’re contacting ${organizer} about Dumaguete Futsal Cup Season 4 · Order FUT-2026-002390. Type a message to chat directly with ${organizer}.`, 'small', { color: 'ink', bg: 'white', border: 'lineGreen', borderW: 1, radius: 18 }),
      stack([
        text(`Choose how to contact ${organizer}`, 'smallStrong'),
        row([
          stack([text('Email organizer', 'smallStrong', { color: 'brand' }), text('contact@dumaguetefutsalassociation.com', 'caption')], { grow: 1, gap: 3, pad: 10, bg: 'brandWash', border: 'lineGreen', borderW: 1, radius: 13 }),
          stack([text('Call organizer', 'smallStrong', { color: 'brand' }), text('+63 912-345-6789', 'caption')], { grow: 1, gap: 3, pad: 10, bg: 'brandWash', border: 'lineGreen', borderW: 1, radius: 13 }),
        ], { w: 'fill', gap: 8 }),
      ], { w: 'fill', pad: 14, gap: 10, bg: 'white', border: 'lineGreen', borderW: 1, radius: 18 }),
    ], { w: 'fill', grow: 1, pad: [24, 20], gap: 12, bg: '#f5faf8' }),
    row([
      box([icon('plus', 18)], { w: 36, h: 36, bg: 'none', radius: 'full' }),
      box([icon('mail', 18)], { w: 36, h: 36, bg: 'none', radius: 'full' }),
      box([text('😊', 'body', { align: 'center' })], { w: 36, h: 36, bg: 'none', radius: 'full' }),
      row([input('', { placeholder: 'Write a message', w: 'fill', bg: '#f5faf8', border: 'none', radius: 'full' }), icon('send', 16)], { w: 'fill', align: 'center', gap: 8, pad: [0, 14], bg: '#f5faf8', radius: 'full' }),
    ], { w: 'fill', gap: 4, pad: [12, 16], bg: 'white', border: 'lineGreen', borderW: 1, align: 'center' }),
  ], { w: 480, h: 720, bg: 'white', border: 'lineGreen', borderW: 1, radius: 20, clip: true, shadow: 'modal', name: 'Contact organizer widget' });
}

function validateNode(node, pathName = 'node') {
  if (!node || typeof node !== 'object' || Array.isArray(node)) throw new Error(`Invalid node at ${pathName}`);
  const kinds = Object.keys(node);
  if (kinds.length !== 1) throw new Error(`Expected one node kind at ${pathName}`);
  const kind = kinds[0];
  const props = node[kind];
  if (!props || typeof props !== 'object') throw new Error(`Invalid ${kind} props at ${pathName}`);
  if (Object.prototype.hasOwnProperty.call(props, 'x') || Object.prototype.hasOwnProperty.call(props, 'y')) {
    throw new Error(`Coordinate found at ${pathName}; use auto-layout instead`);
  }
  const standard = new Set(['w', 'h', 'grow', 'bg', 'fg', 'radius', 'border', 'borderW', 'shadow', 'opacity', 'name', 'minW', 'maxW', 'minH', 'maxH']);
  const own = {
    stack: new Set(['gap', 'pad', 'align', 'justify', 'between', 'clip', 'children']),
    row: new Set(['gap', 'gapY', 'pad', 'align', 'justify', 'between', 'wrap', 'clip', 'children']),
    box: new Set(['pad', 'children', 'clip']),
    text: new Set(['value', 'style', 'size', 'weight', 'color', 'align', 'lh', 'tracking', 'family']),
    rule: new Set(['color', 'children']),
    icon: new Set(['glyph', 'path', 'box', 'size', 'color', 'stroke']),
    svg: new Set(['src', 'size']),
    image: new Set(['src', 'size', 'fit']),
    pill: new Set(['text', 'size', 'upper', 'weight', 'tracking']),
    input: new Set(['placeholder', 'value', 'size']),
    switch: new Set(['on']),
    button: new Set(['text', 'variant', 'size']),
    avatar: new Set(['text', 'size']),
    overlay: new Set(['anchor', 'dx', 'dy', 'children', 'gap', 'pad', 'align', 'justify']),
  }[kind];
  if (!own) throw new Error(`Unknown node kind ${kind} at ${pathName}`);
  for (const key of Object.keys(props)) {
    if (!standard.has(key) && !own.has(key)) throw new Error(`Unknown prop ${key} on ${kind} at ${pathName}`);
  }
  if (kind === 'box' && Array.isArray(props.children) && props.children.length > 1) throw new Error(`box has multiple children at ${pathName}`);
  if ((kind === 'image' || kind === 'svg') && typeof props.src !== 'string') throw new Error(`${kind} is missing src at ${pathName}`);
  if (kind === 'image' && !props.src.startsWith('data:')) throw new Error(`image src is not embedded at ${pathName}`);
  if (kind === 'svg' && !props.src.startsWith('<svg')) throw new Error(`svg src is not raw markup at ${pathName}`);
  if (Array.isArray(props.children)) props.children.forEach((child, index) => validateNode(child, `${pathName}.${kind}[${index}]`));
}

function validateManifest(manifest) {
  if (manifest.version !== '0.2') throw new Error('Unexpected manifest version');
  if (!Array.isArray(manifest.screens) || manifest.screens.length !== 22) throw new Error(`Expected 22 screens, found ${manifest.screens?.length}`);
  const names = new Set();
  for (const [index, current] of manifest.screens.entries()) {
    if (names.has(current.name)) throw new Error(`Duplicate screen name ${current.name}`);
    names.add(current.name);
    if (!Array.isArray(current.size) || current.size.some((value) => !Number.isFinite(value) || value <= 0)) throw new Error(`Invalid size on screen ${current.name}`);
    if (!current.source) throw new Error(`Missing source on screen ${current.name}`);
    current.children.forEach((child, childIndex) => validateNode(child, `screens[${index}].children[${childIndex}]`));
  }
  for (const [key, value] of Object.entries(manifest.theme.space)) {
    if (typeof value !== 'number') throw new Error(`Theme spacing ${key} is not numeric`);
  }
}

let mediaFindings = [];

async function buildManifest() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planout-orders-manifest-'));
  try {
    const tickets = await loadSourceModule('src/app/data/tickets.ts', tempDir, 'tickets');
    const ordersSource = await loadSourceModule('src/app/pages/OrdersPage.tsx', tempDir, 'orders-page');
    const queue = tickets.createRegistrationQueueEntries();
    const allOrders = ordersSource.buildOrders({ registrationQueueEntries: queue });
    const hiddenIds = new Set(['ord-gear-001']);
    const visibleOrders = allOrders.filter((order) => !hiddenIds.has(order.id));

    const screens = [];
    screens.push(screen('Orders / Overview / 01 — All', [1440, 1800], 'src/app/pages/OrdersPage.tsx', [await overviewPage('all', visibleOrders)], 'Default overview state. Current source-derived counts are All 14, Pending 7, and Complete 7 after ord-gear-001 is hidden.'));
    screens.push(screen('Orders / Overview / 02 — Pending', [1440, 1500], 'src/app/pages/OrdersPage.tsx', [await overviewPage('pending', visibleOrders)], 'Pending filter selected; order cards are derived with orderHasPending().'));
    screens.push(screen('Orders / Overview / 03 — Complete', [1440, 1200], 'src/app/pages/OrdersPage.tsx', [await overviewPage('complete', visibleOrders)], 'Complete filter selected; refunded merchandise remains complete because the source defines complete as not pending.'));
    screens.push(screen('Orders / Overview / 04 — Empty filter', [1440, 900], 'src/app/pages/OrdersPage.tsx', [await overviewPage('pending', visibleOrders, true)], 'The source has an empty filtered-list branch. It is emitted as a branch state even though the default seed has pending orders.'));

    const detailIds = [
      ['tkt-001', 'Orders / Detail / 05 — Three-event order', 1200, 'Three-event grouped order; all three registration items and the complete payment summary remain visible.'],
      ['tkt-013', 'Orders / Detail / 06 — Team forms needed', 1600, 'Team of 8 with four Passport-ready players, two sent claim links, and two unassigned player forms.'],
      ['tkt-014', 'Orders / Detail / 07 — Team roster ready', 1400, 'Team roster fully set up with Passport and buyer-managed Guest QR access paths.'],
      ['tkt-011', 'Orders / Detail / 08 — Mixed access', 1300, 'Self ready, invited recipient claim link, and buyer-managed Guest QR ready to generate.'],
      ['tkt-012', 'Orders / Detail / 09 — Mixed access prior', 1300, 'Prior mixed-order state with an invited recipient and an undecided guest slot.'],
      ['tkt-004', 'Orders / Detail / 10 — Released team', 1350, 'Released team purchase; source overview state and per-player detail actions are preserved.'],
      ['tkt-008', 'Orders / Detail / 11 — Released multiple entries', 1450, 'Released multiple-entry purchase with all registration rows in the released state.'],
      ['ord-refund-001', 'Orders / Detail / 12 — Refunded merchandise', 1050, 'Refunded merchandise detail with payment status and refund block.'],
      ['ord-gear-001', 'Orders / Detail / 13 — Shipped merchandise direct detail', 1050, 'Direct route for the temporary overview-hidden shipped merchandise order.'],
    ];
    for (const [id, name, height, notes] of detailIds) {
      const order = allOrders.find((candidate) => candidate.id === id);
      if (!order) throw new Error(`Could not resolve source order ${id}`);
      screens.push(screen(name, [1440, height], 'src/app/pages/OrdersPage.tsx; src/app/components/OrderCover.tsx; src/app/components/OrderDetailBlocks.tsx', [await orderDetailPage(order)], notes));
    }
    screens.push(screen('Orders / Detail / 14 — Order not found', [1440, 900], 'src/app/pages/OrdersPage.tsx', [notFoundPage()], 'Unknown order route branch.'));

    screens.push(shareMenuScreen());
    screens.push(modalFrame(emailReviewPanel(), 'Orders / Interaction / 16 — Send form review', 'EmailReviewSheet open for an invited participant. The recipient field is editable and the primary action is source-disabled until the email is valid.'));
    screens.push(modalFrame(emailReviewPanel({ bulk: true }), 'Orders / Interaction / 17 — Bulk email review', 'BulkEmailReviewSheet open for the two unsent team forms. The source includes only entries without Passport or Guest QR access.'));
    screens.push(modalFrame(guestQrPanel(await qrDataUri('https://planout.app/guest-entry/GE-DEMO-4021')), 'Orders / Interaction / 18 — Guest access pass', 'OrderQrOverlay guest state opened from a Guest QR ready row. The QR payload is deterministic for this manifest.'));
    screens.push(modalFrame(passportQrPanel(await qrDataUri('https://planout.app/m/7c4f1a92-3b7e-4a11-9d2b-1e8b0c4f6a23?v=1&sig=demo')), 'Orders / Interaction / 19 — Passport QR viewer', 'OrderQrOverlay Passport state opened from a ready Passport row.'));
    screens.push(modalFrame(removePlayerPanel(), 'Orders / Interaction / 20 — Remove player confirmation', 'Controlled ConfirmDialog state from TeamRegistrationItem.'));
    screens.push(modalFrame(contactOrganizerPanel(), 'Orders / Interaction / 21 — Contact organizer', 'OrganizerContactWidget opened from an Orders detail action with the source context summary and contact methods.'));
    screens.push(modalFrame(stack([
      row([text('Attachment options', 'modalTitle'), box([icon('close', 16)], { w: 36, h: 36, bg: 'white', radius: 'full', border: 'line', borderW: 1 })], { w: 'fill', justify: 'between', align: 'center' }),
      row([icon('mail', 16), text('Photo or video', 'smallStrong')], { w: 'fill', align: 'center', gap: 8, pad: 10, bg: 'brandWash', radius: 10 }),
      row([icon('copy', 16), text('File', 'smallStrong')], { w: 'fill', align: 'center', gap: 8, pad: 10, bg: 'brandWash', radius: 10 }),
    ], { w: 260, pad: 12, gap: 6, bg: 'white', border: 'lineGreen', borderW: 1, radius: 14, shadow: 'menu', name: 'Attachment options menu' }), 'Orders / Interaction / 22 — Contact attachment menu', 'OrganizerContactWidget attachment menu open. This is the last Orders-owned nested menu state; emoji choices are omitted as a repeated picker variant.'));

    const head = await gitHead();
    const manifest = {
      version: '0.2',
      meta: {
        title: 'PlanOut — Orders all states',
        project: 'PlanOut',
        module: 'Orders',
        source: 'src/app/pages/OrdersPage.tsx',
        repo: 'kenanaiahjj/pd-planout-user',
        commit: head,
        generated: SOURCE_DATE,
        agent: 'Codex GPT-5',
        notes: `Source-backed manifest for the current Orders module. The generator compiles MY_TICKETS and createRegistrationQueueEntries() from src/app/data/tickets.ts and buildOrders() from src/app/pages/OrdersPage.tsx. The source builds ${allOrders.length} order records; ${visibleOrders.length} are visible in the overview after the named temporary visibility set removes ord-gear-001. Remote artwork is embedded as base64 during generation.`,
        findings: [...FINDINGS, ...mediaFindings],
        skipped: SKIPPED,
      },
      section: 'Orders — All states',
      cols: 2,
      theme: {
        root: 16,
        font: { family: 'Inter' },
        color: {
          canvas: C.canvas,
          white: C.white,
          ink: C.ink,
          darkInk: C.darkInk,
          muted: C.muted,
          slate: C.slate,
          subtle: C.subtle,
          white70: '#ffffffb3',
          white72: '#ffffffb8',
          white82: '#ffffffd1',
          white48: '#ffffff7a',
          line: C.line,
          lineSoft: C.lineSoft,
          lineGreen: C.lineGreen,
          brand: C.brand,
          brandDark: C.brandDark,
          brandSoft: C.brandSoft,
          brandPale: C.brandPale,
          brandWash: C.brandWash,
          warningBg: C.warningBg,
          warningText: C.warningText,
          warningLine: C.warningLine,
          dangerBg: C.dangerBg,
          dangerText: C.dangerText,
          dangerDeep: C.dangerDeep,
          dangerLine: C.dangerLine,
          neutralBg: C.neutralBg,
          neutralText: C.neutralText,
          coverFallback: C.coverFallback,
          backdrop: C.backdrop,
          darkBackdrop: C.darkBackdrop,
        },
        space: { '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '7': 28, '8': 32, '10': 40, '12': 48 },
        radius: { sm: 10, md: 12, lg: 16, xl: 18, '2xl': 20, cover: 28, full: 999 },
        text: TEXT,
        shadow: {
          card: { type: 'DROP_SHADOW', color: { r: 15, g: 23, b: 42, a: 0.12 }, offset: { x: 0, y: 8 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' },
          tab: { type: 'DROP_SHADOW', color: { r: 20, g: 39, b: 32, a: 0.06 }, offset: { x: 0, y: 1 }, radius: 2, spread: 0, visible: true, blendMode: 'NORMAL' },
          cover: { type: 'DROP_SHADOW', color: { r: 4, g: 24, b: 19, a: 0.42 }, offset: { x: 0, y: 22 }, radius: 42, spread: -30, visible: true, blendMode: 'NORMAL' },
          modal: { type: 'DROP_SHADOW', color: { r: 16, g: 33, b: 30, a: 0.48 }, offset: { x: 0, y: 24 }, radius: 70, spread: -28, visible: true, blendMode: 'NORMAL' },
          menu: { type: 'DROP_SHADOW', color: { r: 15, g: 23, b: 42, a: 0.18 }, offset: { x: 0, y: 12 }, radius: 24, spread: -12, visible: true, blendMode: 'NORMAL' },
        },
      },
      screens,
    };
    validateManifest(manifest);
    return { manifest, allOrders, visibleOrders };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function gitHead() {
  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: ROOT });
    return stdout.trim();
  } catch {
    return 'unknown';
  }
}

const { manifest, allOrders, visibleOrders } = await buildManifest();
await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Wrote ${OUTPUT}`);
console.log(`Screens: ${manifest.screens.length}`);
console.log(`Source orders: ${allOrders.length}; visible overview orders: ${visibleOrders.length}; pending: ${visibleOrders.filter(orderHasPending).length}; complete: ${visibleOrders.filter(orderIsComplete).length}`);
console.log(`Media findings: ${mediaFindings.length}`);
