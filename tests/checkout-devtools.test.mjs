import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const checkoutSource = fs.readFileSync(new URL('../src/app/components/CheckoutPage.tsx', import.meta.url), 'utf8');

test('checkout scenario controls live in a development-only floating tools surface', () => {
  assert.match(checkoutSource, /function CheckoutDevTools\(/);
  assert.match(checkoutSource, /aria-label="Open checkout dev tools"/);
  assert.match(checkoutSource, /import\.meta\.env\.DEV/);
  assert.match(checkoutSource, /top-\[calc\(5\.75rem\+env\(safe-area-inset-top\)\)\]/);
  assert.match(checkoutSource, /absolute bottom-auto right-0 top-12/);
  assert.match(checkoutSource, /<CheckoutDevTools[\s\S]*confirmationState/);
});
