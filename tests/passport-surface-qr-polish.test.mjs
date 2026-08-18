import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rootLayoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);
const passportPageSource = fs.readFileSync(
  new URL('../src/app/pages/PassportPage.tsx', import.meta.url),
  'utf8',
);
const passportCardSource = fs.readFileSync(
  new URL('../src/app/components/PlanOutPassportCard.tsx', import.meta.url),
  'utf8',
);

test('Passport route family uses one continuous white surface', () => {
  assert.match(rootLayoutSource, /const isPassportRoute = pathname\.startsWith\('\/passport'\);/);
  assert.match(rootLayoutSource, /backgroundColor: isGuestQrPage \? '#ffffff' : isPassportRoute \? '#ffffff' : '#f8fafc'/);
  assert.match(passportPageSource, /min-h-dvh overflow-x-hidden bg-white/);
  assert.doesNotMatch(passportPageSource, /min-h-dvh overflow-x-hidden bg-\[#eef7f5\]/);
});

test('Passport holder uses the PlanOut Passport wordmark', () => {
  assert.match(passportCardSource, />\s*PlanOut Passport\s*<\/span>/);
  assert.doesNotMatch(passportCardSource, />\s*Passport Holder\s*<\/span>/);
});

test('Passport QR keeps its payload hooks and uses a premium crisp tile', () => {
  assert.match(passportCardSource, /function PassportQrMini/);
  assert.match(passportCardSource, /data-qr-material="premium"/);
  assert.match(passportCardSource, /shapeRendering="crispEdges"/);
  assert.match(passportCardSource, /fill="#0f172b"/);
  assert.match(passportCardSource, /#d9ebe6/);
  assert.match(passportCardSource, /ring-1 ring-\[#177564\]\/10/);
  assert.match(passportCardSource, /Open Passport QR/);
  assert.match(passportCardSource, /qr-code-button/);
  assert.match(passportCardSource, /createPassportQrSvg/);
  assert.doesNotMatch(passportCardSource, /backdrop-blur-sm/);
  assert.doesNotMatch(passportCardSource, /rx="0\.5"/);
});
