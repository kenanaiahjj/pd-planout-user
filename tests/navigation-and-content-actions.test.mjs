import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const navigationUrl = new URL('../src/app/data/navigation.js', import.meta.url);
const navigationSource = fs.existsSync(navigationUrl)
  ? fs.readFileSync(navigationUrl, 'utf8')
  : '';
const homeSource = read('../src/app/pages/HomePage.tsx');
const queueRouteSource = read('../src/app/routes/RegistrationQueueRoute.tsx');
const checkoutSource = read('../src/app/components/CheckoutPage.tsx');
const layoutSource = read('../src/app/layouts/RootLayout.tsx');
const routerSource = read('../src/app/router.tsx');

test('all aggregate pending-form shortcuts use Orders Pending', () => {
  assert.match(navigationSource, /export const ORDERS_PENDING_PATH = '\/orders\?filter=pending'/);
  assert.match(homeSource, /onOpenAll=\{\(\) => navigate\(ORDERS_PENDING_PATH\)\}/);
  assert.match(queueRouteSource, /<Navigate to=\{ORDERS_PENDING_PATH\} replace \/>/);
  assert.match(checkoutSource, /navigate\(ORDERS_PENDING_PATH\)/);
  assert.match(layoutSource, /onPress=\{\(\) => navTo\(ORDERS_PENDING_PATH\)\}/);
  assert.doesNotMatch(homeSource, /passportFormsPath/);
  assert.doesNotMatch(queueRouteSource, /focus=forms/);
  assert.doesNotMatch(checkoutSource, /focus=forms/);
});

test('Home keeps direct entry-level participant form links', () => {
  assert.match(homeSource, /orders\/\$\{entry\.ticketId\}\/form\?returnTo=home&entryId=/);
});

test('the legacy route documentation names the Orders Pending destination', () => {
  assert.match(routerSource, /registration-queue\s+-> Legacy redirect to Orders Pending/);
});
