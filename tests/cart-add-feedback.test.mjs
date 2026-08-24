import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const eventDetailRouteSource = fs.readFileSync(
  new URL('../src/app/routes/EventDetailRoute.tsx', import.meta.url),
  'utf8',
);
const rootLayoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);

function getCartHandlerSource(source) {
  const start = source.indexOf('onGoToCart={(items) => {');
  const end = source.indexOf('onGoToCheckout=', start);
  return source.slice(start, end);
}

test('event-page cart additions stay on the event surface and confirm the added tickets', () => {
  const handler = getCartHandlerSource(eventDetailRouteSource);

  assert.match(handler, /toast\.success\(/);
  assert.match(handler, /Added to cart/);
  assert.doesNotMatch(handler, /navigate\('\/cart'\)/);
});

test('event-preview cart additions stay in the preview and confirm the added tickets', () => {
  const handler = getCartHandlerSource(rootLayoutSource);

  assert.match(handler, /toast\.success\(/);
  assert.match(handler, /Added to cart/);
  assert.doesNotMatch(handler, /setActiveDrawer\('cart'\)/);
  assert.doesNotMatch(handler, /navigate\('\/cart'\)/);
});
