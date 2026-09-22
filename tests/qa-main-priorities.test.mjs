import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

const eventPeek = read('../src/app/components/EventPeekPanel.tsx');
const cartRoute = read('../src/app/routes/CartRoute.tsx');
const ordersPage = read('../src/app/pages/OrdersPage.tsx');
const rootLayout = read('../src/app/layouts/RootLayout.tsx');

test('event peek uses the shared ticket price catalog', () => {
  assert.match(eventPeek, /getCheapestTicketPriceLabel/);
  assert.match(eventPeek, /const ticketPriceLabel = isPast \? 'Registration closed' : getCheapestTicketPriceLabel\(\);/);
  assert.doesNotMatch(eventPeek, /From ₱0/);
});

test('cart close returns through in-app history with a home fallback', () => {
  assert.match(cartRoute, /window\.history\.state\?\.idx > 0/);
  assert.match(cartRoute, /navigate\(-1\)/);
  assert.match(cartRoute, /navigate\('\/'\)/);
});

test('orders filter changes replace the URL and restore from search', () => {
  assert.match(ordersPage, /const handleFilterChange = \(nextFilter: OrderFilter\)/);
  assert.match(ordersPage, /navigate\(`\/orders\$\{nextSearch \? `\?\$\{nextSearch\}` : ''\}`, \{ replace: true \}\)/);
  assert.match(ordersPage, /<FilterTabs active=\{activeFilter\} onChange=\{handleFilterChange\} orders=\{visibleOrders\} \/>/);
  assert.match(ordersPage, /setActiveFilter\(getOrderFilterFromSearch\(search\)\)/);
});

test('settings subpages suppress the duplicate global back control', () => {
  assert.match(rootLayout, /const hasLocalSettingsBack =\s*pathname === '\/settings\/account'\s*\|\|\s*pathname === '\/settings\/transactions'\s*\|\|\s*pathname === '\/settings\/inbox';/s);
  assert.match(rootLayout, /const showBack = !isTabRoot && !hasLocalSettingsBack;/);
  assert.match(rootLayout, /pathname === '\/settings\/apply-organizer'/);
});
