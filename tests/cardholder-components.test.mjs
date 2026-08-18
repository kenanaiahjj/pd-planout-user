import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const leatherSource = fs.readFileSync(
  new URL('../src/app/components/LeatherCardholder.tsx', import.meta.url),
  'utf8',
);
const metalSource = fs.readFileSync(
  new URL('../src/app/components/MetalCard.tsx', import.meta.url),
  'utf8',
);
const passportSource = fs.readFileSync(
  new URL('../src/app/components/PlanOutPassportCard.tsx', import.meta.url),
  'utf8',
);

test('LeatherCardholder is a standalone prop-driven closed holder', () => {
  assert.match(leatherSource, /export function LeatherCardholder/);
  assert.match(leatherSource, /name\?: string/);
  assert.match(leatherSource, /number\?: string/);
  assert.match(leatherSource, /date\?: string/);
  assert.match(leatherSource, /clipPath/);
  assert.match(leatherSource, /feTurbulence/);
  assert.match(leatherSource, /MetalCard/);
});

test('MetalCard is a reusable brushed-metal member card', () => {
  assert.match(metalSource, /export function MetalCard/);
  assert.match(metalSource, /name\?: string/);
  assert.match(metalSource, /number\?: string/);
  assert.match(metalSource, /date\?: string/);
  assert.match(metalSource, /data-card-material="brushed-metal"/);
  assert.match(metalSource, /export function MetalCardTexture/);
  assert.match(metalSource, /data-material-texture="micro-brushed"/);
  assert.match(metalSource, /feTurbulence/);
  assert.match(metalSource, /rounded-full/);
  assert.match(metalSource, /#25262a/);
  assert.match(metalSource, /JOSH PIGFORD/);
});

test('Passport holder uses layered forest-green material', () => {
  const holderStart = passportSource.indexOf('top-[104px]');
  const holderEnd = passportSource.indexOf('{/* Fullscreen Overlay */}', holderStart);
  const holderSource = passportSource.slice(holderStart, holderEnd);

  assert.notEqual(holderStart, -1, 'Passport holder backplate should be present');
  assert.notEqual(holderEnd, -1, 'Passport holder overlay boundary should be present');
  assert.match(holderSource, /#0b7067/);
  assert.match(holderSource, /#075f56/);
  assert.match(holderSource, /#063c36/);
  assert.match(holderSource, /#176f63/);
  assert.match(holderSource, /#0a4c46/);
  assert.match(holderSource, /border-\[#084c46\]/);
  assert.match(holderSource, /border-\[#0b4f48\]/);
  assert.match(holderSource, /#b8ddd5/);
  assert.doesNotMatch(holderSource, /#d8b48f|#b28e65|#d8b68f|#bd9a72|#9e7a52|#ad885c|#8a6842/);
});

test('Passport holder scales to its rendered container width', () => {
  assert.match(passportSource, /const holderContainerRef = React\.useRef<HTMLDivElement \| null>\(null\);/);
  assert.match(passportSource, /getBoundingClientRect\(\)\.width/);
  assert.match(passportSource, /new ResizeObserver/);
  assert.match(passportSource, /ref=\{holderContainerRef\}/);
  assert.doesNotMatch(passportSource, /const viewportWidth = window\.innerWidth/);
});
