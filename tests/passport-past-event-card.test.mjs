import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/app/pages/PassportPage.tsx', import.meta.url), 'utf8');

test('Passport past-event card is scan-first and uses the QR-only recovery path', () => {
  assert.match(source, />Add a past event<\/p>/);
  assert.match(source, /Save an event you attended to your Passport\./);
  assert.match(source, /Scan event QR/);
  assert.match(source, /Camera or saved QR photo/);
  assert.doesNotMatch(source, /Enter code/);
  assert.doesNotMatch(source, /<Keyboard/);
  assert.match(source, /navigate\('\/passport\/add-entry\?scan=1'\)/);
  assert.match(source, /claimedGuestEntries\.length > 0/);
  assert.match(source, /Added from Guest QR/);
  assert.match(source, /bg-\[linear-gradient\(90deg,#3cd4b9_0%,#177564_100%\)\]/);
});

test('Passport card gives Scan event QR one clear primary action', () => {
  const primaryAction = source.search(/>Scan event QR<\/span>/);

  assert.notEqual(primaryAction, -1);
  assert.match(source.slice(primaryAction - 900, primaryAction), /min-h-12/);
  assert.match(source.slice(primaryAction - 900, primaryAction), /rounded-\[12px\]/);
  assert.match(source.slice(primaryAction - 900, primaryAction), /bg-\[linear-gradient\(90deg,#3cd4b9_0%,#177564_100%\)\]/);
});

test('Passport past-event card avoids repeating the scanner icon in the primary action', () => {
  const cardStart = source.indexOf('data-testid="passport-add-event-card"');
  const cardEnd = source.indexOf('</section>', cardStart);
  const cardSource = source.slice(cardStart, cardEnd);

  assert.notEqual(cardStart, -1);
  assert.equal((cardSource.match(/<ScanLine/g) || []).length, 0);
  assert.match(cardSource, /<QrCode className="size-4 text-white\/90/);
  assert.doesNotMatch(cardSource, /<ChevronRight className="size-4/);
});

test('past-event card uses a compact Wallet-style add-pass hierarchy', () => {
  const cardStart = source.indexOf('data-testid="passport-add-event-card"');
  const cardEnd = source.indexOf('</section>', cardStart);
  const cardSource = source.slice(cardStart, cardEnd);

  assert.notEqual(cardStart, -1);
  assert.match(cardSource, /rounded-\[18px\] border border-\[#e3ebe8\] bg-white/);
  assert.match(cardSource, /shadow-\[0_4px_8px_-6px/);
  assert.match(cardSource, /text-balance/);
  assert.match(cardSource, /text-pretty/);
  assert.match(cardSource, /flex min-h-12 w-full items-center justify-between/);
  assert.match(cardSource, /rounded-\[12px\] bg-\[linear-gradient\(90deg,#3cd4b9_0%,#177564_100%\)\]/);
  assert.match(cardSource, /hover:brightness-105/);
  assert.match(cardSource, /active:scale-\[0\.985\]/);
  assert.match(cardSource, />Recently added<\/p>/);
  assert.match(cardSource, /border-t border-\[#e6eeeb\]/);
  assert.match(cardSource, /focus-visible:ring-2/);
  assert.doesNotMatch(cardSource, /rounded-\[24px\] border border-white bg-\[#fffdf8\]|ring-1 ring-black\/\[0\.04\]/);
  assert.doesNotMatch(cardSource, /backdrop-blur/);
  assert.doesNotMatch(source, /Claimed events will appear here/);
});

test('Passport shell scrolls vertically without clipping horizontal decoration', () => {
  const pageStart = source.indexOf('export function PassportPage');
  const pageSource = source.slice(pageStart);
  const rootMatch = pageSource.match(/return \(\s*<div className="([^"]+)">/);

  assert.ok(rootMatch, 'PassportPage root wrapper should be present');
  assert.match(rootMatch[1], /\bmin-h-dvh\b/);
  assert.match(rootMatch[1], /\boverflow-x-hidden\b/);
  assert.doesNotMatch(rootMatch[1], /\boverflow-hidden\b/);
  assert.match(rootMatch[1], /pb-\[calc\(118px\+env\(safe-area-inset-bottom\)\)\]/);
  assert.match(rootMatch[1], /pt-\[calc\(32px\+env\(safe-area-inset-top\)\)\]/);
});
