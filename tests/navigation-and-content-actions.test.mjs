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

const primaryButtonSource = read('../src/app/components/PrimaryButton.tsx');
const organizerSource = read('../src/app/pages/OrganizerProfilePage.tsx');

test('organizer contact uses a semantic email link with primary-button styling', () => {
  assert.match(primaryButtonSource, /export const PrimaryButtonLink = React\.forwardRef<HTMLAnchorElement/);
  assert.match(organizerSource, /getOrganizerEmailHref/);
  assert.match(organizerSource, /<PrimaryButtonLink[\s\S]*href=\{getOrganizerEmailHref\(organizer\.email\)\}/);
  assert.match(organizerSource, /aria-label=\{'Email ' \+ organizer\.name\}/);
  assert.doesNotMatch(organizerSource, /<PrimaryButton compact[\s\S]*Contact Organizer/);
});

const eventDetailsSource = read('../src/app/components/EventDetailsPage.tsx');

test('event actions expose Google Maps Directions and a cycling gallery', () => {
  assert.match(eventDetailsSource, /getGoogleMapsSearchUrl/);
  assert.match(eventDetailsSource, /href=\{getGoogleMapsSearchUrl\(event\.location\)\}/);
  assert.match(eventDetailsSource, /target="_blank"/);
  assert.match(eventDetailsSource, /rel="noreferrer"/);
  assert.match(eventDetailsSource, /onClick=\{\(\) => setSelectedImageIndex\(0\)\}/);
  assert.match(eventDetailsSource, /function cycleSelectedImage\(direction: -1 \| 1\)/);
  assert.match(eventDetailsSource, /\(current \+ direction \+ galleryImages\.length\) % galleryImages\.length/);
  assert.match(eventDetailsSource, /aria-label="Previous photo"/);
  assert.match(eventDetailsSource, /aria-label="Next photo"/);
  assert.match(eventDetailsSource, /aria-modal="true"/);
});
