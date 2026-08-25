import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ordersSource = fs.readFileSync(
  new URL('../src/app/pages/OrdersPage.tsx', import.meta.url),
  'utf8',
);
const orderStatusLabelUrl = new URL('../src/app/components/OrderStatusLabel.tsx', import.meta.url);
const orderStatusLabelSource = fs.existsSync(orderStatusLabelUrl)
  ? fs.readFileSync(orderStatusLabelUrl, 'utf8')
  : '';
const orderCoverUrl = new URL('../src/app/components/OrderCover.tsx', import.meta.url);
const orderCoverSource = fs.existsSync(orderCoverUrl)
  ? fs.readFileSync(orderCoverUrl, 'utf8')
  : '';
const orderQrOverlaySource = fs.readFileSync(
  new URL('../src/app/components/OrderQrOverlay.tsx', import.meta.url),
  'utf8',
);
const floatCardSource = fs.readFileSync(
  new URL('../src/app/components/FloatCard.tsx', import.meta.url),
  'utf8',
);
const rootLayoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);
const teamAccessSource = fs.readFileSync(
  new URL('../src/app/data/teamAccess.js', import.meta.url),
  'utf8',
);
const eventsSource = fs.readFileSync(
  new URL('../src/app/data/events.ts', import.meta.url),
  'utf8',
);
const eventBrandSource = fs.readFileSync(
  new URL('../src/app/data/eventBrand.ts', import.meta.url),
  'utf8',
);
const ticketsSource = fs.readFileSync(
  new URL('../src/app/data/tickets.ts', import.meta.url),
  'utf8',
);
const stylesSource = fs.readFileSync(
  new URL('../src/styles/index.css', import.meta.url),
  'utf8',
);
test('Orders detail reserves space below fixed navigation', () => {
  assert.match(ordersSource, /pb-\[calc\(7rem\+env\(safe-area-inset-bottom\)\)\]\s+sm:pb-10/);
});

test('Orders overview does not render the floating attention card over order content', () => {
  assert.match(floatCardSource, /pathname === '\/orders'/);
});

test('the floating attention card remains available on Home while task surfaces hide it', () => {
  assert.doesNotMatch(floatCardSource, /pathname === '\/'/);
  assert.match(floatCardSource, /pathname === '\/orders'/);
  assert.match(floatCardSource, /pathname === '\/passport'/);
  assert.ok(floatCardSource.includes('if (/\\/form(?:\\/|$)/.test(pathname)) return true;'));
});

test('floating forms shortcut opens Orders with Pending selected', () => {
  assert.match(rootLayoutSource, /onPress=\{\(\) => navTo\('\/orders\?filter=pending'\)\}/);
  assert.match(ordersSource, /export function getOrderFilterFromSearch\(search: string\): OrderFilter/);
  assert.match(ordersSource, /const \{ search \} = useLocation\(\);/);
  assert.match(ordersSource, /useState<OrderFilter>\(\(\) => getOrderFilterFromSearch\(search\)\)/);
  assert.match(ordersSource, /setActiveFilter\(getOrderFilterFromSearch\(search\)\)/);
});

test('Orders overview integrates one event image into the complete card surface', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderAmbientImage('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.doesNotMatch(ordersSource, /function getOrderGradientClass\(order: OrderRecord\)/);
  assert.doesNotMatch(ordersSource, /tennis\|pickleball|marathon\|run\|trail\|relay|swim\|coastal/i);
  assert.match(orderCardSource, /getOrderGraphicImages\(order\)\[0\] \|\| ''/);
  assert.match(orderCardSource, /data-testid="order-card-image"/);
  assert.match(orderCardSource, /absolute inset-0 opacity-\[0\.78\]/);
  assert.match(orderCardSource, /scale-\[1\.03\] object-cover contrast-\[1\.04\] saturate-\[1\.12\]/);
  assert.doesNotMatch(orderCardSource, /data-testid="order-glass-vignette"/);
  assert.doesNotMatch(orderCardSource, /backdrop-blur-\[3px\]/);
  assert.match(orderCardSource, /relative z-10 flex min-h-\[164px\] flex-col/);
  assert.match(orderCardSource, /<OrderStatusLabel label=\{state\.label\} tone=\{state\.tone\}/);
  assert.doesNotMatch(orderCardSource, /OrderEventCardStack|order-event-card-stack|order-image-tonal-layer/);
  assert.doesNotMatch(orderCardSource, /OrderGraphicVariant|getOrderGraphicVariant/);
  assert.doesNotMatch(orderCardSource, /blur-\[18px\]|bg-\[rgba\(7,12,18,0\.66\)\]/);
});

test('Orders cards use cinematic photography and a directional brand scrim', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderAmbientImage('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(orderCardSource, /--order-card-scrim-leading/);
  assert.match(orderCardSource, /alpha\(brand\.pageBackgroundTo, 0\.90\)/);
  assert.match(orderCardSource, /alpha\(brand\.pageBackground, 0\.56\)/);
  assert.match(orderCardSource, /alpha\(brand\.pageBackgroundTo, 0\.24\)/);
  assert.match(orderCardSource, /absolute inset-0 opacity-\[0\.78\]/);
  assert.match(orderCardSource, /order-card-image-media h-full w-full scale-\[1\.03\] object-cover contrast-\[1\.04\] saturate-\[1\.12\]/);
  assert.match(orderCardSource, /group-hover:scale-\[1\.045\]/);
  assert.match(orderCardSource, /linear-gradient\(to top, rgba\(3,8,12,0\.68\)/);
  assert.match(orderCardSource, /linear-gradient\(96deg, var\(--order-card-scrim-leading\)/);
  assert.doesNotMatch(orderCardSource, /data-testid="order-glass-vignette"|backdrop-blur-\[3px\]/);
  assert.match(orderCardSource, /bg-white\/\[0\.018\] backdrop-saturate-\[112%\]/);
  assert.match(orderCardSource, /line-clamp-2 max-w-\[92%\] text-\[18px\][\s\S]*?tracking-\[-0\.45px\][\s\S]*?sm:text-\[20px\]/);
  assert.match(orderCardSource, /\[text-shadow:0_1px_2px_rgba\(0,0,0,0\.18\)\]/);
  assert.match(stylesSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.order-card-image-media[\s\S]*?scale:\s*1\.03\s*!important/);
});

test('Orders overview keeps status and purchase information in one readable hierarchy', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderOverviewTitle('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(ordersSource, /data-testid="orders-order-list"/);
  assert.match(orderCardSource, /function OrderCard/);
  assert.match(orderCardSource, /const state = getOrderState\(order\)/);
  assert.match(orderCardSource, /data-testid="order-card-status"/);
  assert.match(orderCardSource, /<OrderStatusLabel label=\{state\.label\} tone=\{state\.tone\}/);
  assert.match(ordersSource, /Forms needed/);
  assert.match(ordersSource, /Ready for gate/);
  assert.match(ordersSource, /Processing/);
  assert.match(ordersSource, /Shipped/);
  assert.match(ordersSource, /Refunded/);
  assert.match(orderCardSource, /\{order\.date\}/);
  assert.match(orderCardSource, /aria-label=\{order\.name\}/);
  assert.match(orderCardSource, /getItemSummary\(order\)/);
  assert.match(orderCardSource, /formatMoney\(getOrderTotal\(order\)\)/);
  assert.doesNotMatch(orderCardSource, /rounded-\[5px\].*state\.label|backdrop-blur-\[10px\]/);
});

test('Orders overview keeps the compact event summary and defers location to details', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderOverviewTitle('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(ordersSource, /formatEventDateOnly/);
  assert.match(orderCardSource, /function getOrderCardEventDetails\(order: OrderRecord\)/);
  assert.match(orderCardSource, /data-testid="order-event-details"/);
  assert.match(orderCardSource, /data-testid="order-event-ticket-type"/);
  assert.match(orderCardSource, /data-testid="order-event-date"/);
  assert.match(orderCardSource, /<CalendarDays/);
  assert.match(orderCardSource, /min-h-\[164px\]/);
  assert.match(orderCardSource, /date: eventCount > 1 \? `\$\{eventCount\} events`/);
  assert.doesNotMatch(orderCardSource, /data-testid="order-event-location"|<MapPin|eventLocation|Multiple locations/);
});

test('Orders overview temporarily hides only the in-progress gear fixture', () => {
  assert.match(
    ordersSource,
    /const TEMPORARILY_HIDDEN_ORDER_IDS = new Set\(\['ord-gear-001'\]\);/,
  );
  assert.match(
    ordersSource,
    /const visibleOrders = orders\.filter\(\(order\) => !TEMPORARILY_HIDDEN_ORDER_IDS\.has\(order\.id\)\);/,
  );
  assert.match(
    ordersSource,
    /const filteredOrders = visibleOrders\.filter\(\(order\) =>/,
  );
  assert.match(
    ordersSource,
    /<FilterTabs active=\{activeFilter\} onChange=\{setActiveFilter\} orders=\{visibleOrders\} \/>/,
  );
  assert.match(ordersSource, /id: 'ord-gear-001'/);
  assert.match(ordersSource, /id: 'ord-refund-001'/);
  assert.doesNotMatch(ordersSource, /TEMPORARILY_HIDDEN_ORDER_IDS[^\n]*ord-refund-001/);
});

test('multi-event overview separates the additional-event count from the primary title', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderOverviewTitle('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(orderCardSource, /function getOrderOverviewTitle\(order: OrderRecord\)/);
  assert.match(orderCardSource, /const eventCount = getDistinctEventCount\(order\)/);
  assert.match(orderCardSource, /primary: order\.eventEntries\[0\]\?\.ticket\.eventTitle \|\| order\.name/);
  assert.match(orderCardSource, /additionalCount: Math\.max\(0, eventCount - 1\)/);
  assert.match(orderCardSource, /data-testid="order-additional-events"/);
  assert.match(orderCardSource, /`\+\$\{additionalCount\} more`/);
  assert.match(orderCardSource, /aria-label=\{order\.name\}/);
  assert.match(orderCardSource, /className="line-clamp-2 max-w-\[92%\]/);
  assert.match(orderCardSource, /<span aria-hidden="true">\{primary\}<\/span>/);
  assert.match(orderCardSource, /ml-1\.5 inline-flex whitespace-nowrap/);
  assert.doesNotMatch(orderCardSource, /className="flex max-w-\[82%\] items-end/);
});

test('order status uses one semantic glass label across overview and detail surfaces', () => {
  assert.match(orderStatusLabelSource, /export type OrderStatusTone = 'warning' \| 'ready' \| 'neutral' \| 'refunded'/);
  assert.match(orderStatusLabelSource, /order-status-label/);
  assert.match(orderStatusLabelSource, /backdrop-blur-\[8px\]/);
  assert.match(orderStatusLabelSource, /warning: 'border-\[#f4c95d\]/);
  assert.match(orderStatusLabelSource, /ready: 'border-\[#75e3bf\]/);
  assert.match(orderStatusLabelSource, /neutral: 'border-\[#9bc5ff\]/);
  assert.match(orderStatusLabelSource, /refunded: 'border-\[#ff8f9c\]/);
  assert.match(orderStatusLabelSource, /data-testid=\{testId\}/);
  assert.match(stylesSource, /\.order-status-label,[\s\S]*?\[data-testid="order-additional-events"\][\s\S]*?backdrop-filter: none/);
});

test('order status capsules do not render decorative dots', () => {
  assert.doesNotMatch(orderStatusLabelSource, /dotClasses/);
  assert.doesNotMatch(orderStatusLabelSource, /h-1\.5 w-1\.5/);
});

test('Orders event cards keep every status complete and readable', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderOverviewTitle('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(ordersSource, /return \{ label: 'Complete', tone: 'neutral' \}/);
  assert.match(orderStatusLabelSource, /whitespace-nowrap/);
  assert.doesNotMatch(orderCardSource, /className="truncate">\{state\.label\}/);
});

test('multi-event orders use compact aggregate copy and one first-event image', () => {
  assert.match(ordersSource, /`\$\{firstTicket\.eventTitle\} \+ \$\{tickets\.length - 1\} more`/);
  assert.doesNotMatch(ordersSource, /other event\$\{tickets\.length > 2/);
  assert.match(ordersSource, /function getDistinctEventCount\(order: OrderRecord\)/);
  assert.match(ordersSource, /function getRegistrationItemCount\(order: OrderRecord\)/);
  assert.match(ordersSource, /eventCount > 1[\s\S]*?\$\{eventCount\} event\$\{eventCount === 1 \? '' : 's'\} · \$\{registrationItemCount\} registration item/);
  assert.match(ordersSource, /getOrderGraphicImages\(order\)\[0\] \|\| ''/);
  assert.doesNotMatch(ordersSource, /Math\.min\(3, Math\.max\(variantDepth, eventCount\)\)/);
});

test('Orders cards reuse the first event theme with an explicit PlanOut fallback', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderCardBrand('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(eventsSource, /export const EVENT_BRANDS =/);
  assert.match(eventBrandSource, /export const PLANOUT_EVENT_BRAND: EventBrandTheme =/);
  assert.match(ticketsSource, /brand\?: EventBrandTheme/);
  assert.match(ticketsSource, /brand: EVENT_BRANDS\.arena/);
  assert.match(ticketsSource, /brand: EVENT_BRANDS\.court/);
  assert.match(ordersSource, /function getOrderCardBrand\(order: OrderRecord\)/);
  assert.match(orderCardSource, /order\.eventEntries\[0\]\?\.ticket\.brand \|\| PLANOUT_EVENT_BRAND/);
  assert.match(orderCardSource, /getEventBrand\(\{ brand \}\)/);
  assert.doesNotMatch(orderCardSource, /eventTitle\.toLowerCase|\.includes\(['"](?:run|tennis|swim|bike)/);
  assert.match(orderCardSource, /--order-card-fg/);
  assert.match(orderCardSource, /--order-card-muted/);
  assert.match(orderCardSource, /--order-card-border/);
  assert.match(orderCardSource, /--order-card-scrim-leading/);
  assert.match(orderCardSource, /--order-card-scrim-middle/);
  assert.match(orderCardSource, /--order-card-scrim-trailing/);
  assert.match(orderCardSource, /linear-gradient\(135deg, \$\{brand\.pageBackground\} 0%, \$\{brand\.pageBackgroundTo\} 100%\)/);
  assert.match(orderCardSource, /style=\{getOrderCardStyle\(order\)\}/);
  assert.match(orderCardSource, /text-\[var\(--order-card-fg\)\]/);
  assert.match(orderCardSource, /text-\[var\(--order-card-muted\)\]/);
  assert.doesNotMatch(orderCardSource, /border-\[#dbe7e4\] bg-white/);
});

test('Orders cards use one Apple-like frosted material with accessible fallbacks', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function getOrderAmbientImage('),
    ordersSource.indexOf('function appOrigin'),
  );

  assert.match(orderCardSource, /function getOrderAmbientImage\(order: OrderRecord\)/);
  assert.match(orderCardSource, /getOrderGraphicImages\(order\)\[0\] \|\| ''/);
  assert.match(orderCardSource, /data-testid="order-card-image"/);
  assert.match(orderCardSource, /data-testid="order-glass-tint"/);
  assert.match(orderCardSource, /data-testid="order-glass-material"/);
  assert.match(orderCardSource, /data-testid="order-glass-highlight"/);
  assert.doesNotMatch(orderCardSource, /blur-\[18px\]/);
  assert.doesNotMatch(orderCardSource, /backdrop-blur-\[3px\]/);
  assert.match(orderCardSource, /backdrop-saturate-\[112%\]/);
  assert.match(orderCardSource, /className="relative z-10 flex min-h-\[164px\] flex-col/);
  assert.match(orderCardSource, /--order-card-scrim-leading/);
  assert.match(orderCardSource, /--order-card-solid/);
  assert.match(orderCardSource, /order-glass-card/);
  assert.doesNotMatch(orderCardSource, /gradient-blur|nth-of-type\(6\)|blur\(64px\)/);

  assert.match(stylesSource, /@media \(prefers-reduced-transparency: reduce\)/);
  assert.match(stylesSource, /\.order-glass-card \[data-testid="order-card-image"\][\s\S]*?display: none/);
  assert.match(stylesSource, /backdrop-filter: none/);
  assert.match(stylesSource, /@media \(prefers-contrast: more\)/);
  assert.match(stylesSource, /\.order-glass-card \.order-card-muted/);
});

test('Orders overview defers the order ID to the detail page', () => {
  const orderCardSource = ordersSource.slice(
    ordersSource.indexOf('function OrderCard('),
    ordersSource.indexOf('function appOrigin'),
  );
  const orderDetailSource = ordersSource.slice(
    ordersSource.indexOf('export function OrderDetailPage'),
  );

  assert.doesNotMatch(orderCardSource, /\{order\.ref\}/);
  assert.match(orderCardSource, /\{order\.date\}/);
  assert.match(orderDetailSource, /\{order\.ref\}/);
});

test('Order Details derives one production-ready cover item per distinct event', () => {
  assert.match(ordersSource, /function getUniqueOrderEvents\(order: OrderRecord\)/);
  assert.match(ordersSource, /seen\.has\(entry\.ticket\.id\)/);
  assert.match(ordersSource, /seen\.add\(entry\.ticket\.id\)/);
  assert.match(ordersSource, /function getOrderCoverPresentation\(order: OrderRecord, registrationCount: number\)/);
  assert.match(ordersSource, /eventCount > 1 \? `\$\{eventCount\}-event order`/);
  assert.match(ordersSource, /merchandiseQuantity/);
  assert.match(ordersSource, /<OrderCover/);
});

test('Order Details cover adapts across single, double, and mosaic purchases', () => {
  assert.match(orderCoverSource, /data-testid="order-detail-cover"/);
  assert.match(orderCoverSource, /items\.slice\(0, 3\)/);
  assert.match(orderCoverSource, /data-cover-mode=\{mode\}/);
  assert.match(orderCoverSource, /grid-cols-\[58fr_42fr\]/);
  assert.match(orderCoverSource, /grid-cols-\[62fr_38fr\]/);
  assert.match(orderCoverSource, /row-span-2/);
  assert.match(orderCoverSource, /overflowCount > 0/);
  assert.match(orderCoverSource, /`\+\$\{overflowCount\}`/);
  assert.match(orderCoverSource, /aria-hidden="true"/);
  assert.match(orderCoverSource, /alt=""/);
  assert.match(orderCoverSource, /onError/);
  assert.match(orderCoverSource, /<h1/);
});

test('Order Details keeps registration as the primary operational section below the cover', () => {
  const orderDetailSource = ordersSource.slice(
    ordersSource.indexOf('export function OrderDetailPage'),
  );

  assert.match(orderDetailSource, /<OrderCover[\s\S]*?>Registration</);
  assert.match(orderDetailSource, /pendingFormCount/);
  assert.match(orderDetailSource, /<ParticipantFormShareControls/);
  assert.match(orderDetailSource, /<RegistrationItem/);
  assert.match(orderDetailSource, /<PaymentSummary order=\{order\}/);
});

test('team orders surface unresolved player forms in overview state', () => {
  assert.match(ordersSource, /entry\.type === 'team'\s*&& entry\.status !== 'attached'/);
});

test('desktop QR actions open an order overlay while mobile keeps the deep-link route', () => {
  assert.match(ordersSource, /OrderQrOverlay/);
  assert.match(ordersSource, /const \[qrOverlay, setQrOverlay\]/);
  assert.match(ordersSource, /if \(isDesktop\(\)\)/);
  assert.match(orderQrOverlaySource, /data-testid="order-qr-overlay"/);
  assert.match(orderQrOverlaySource, /mode="overlay"/);
});

test('team order rows prioritize the stored participant or Passport name', () => {
  assert.match(ordersSource, /teamPlayerDisplayName/);
  assert.match(teamAccessSource, /prototypeIdentity/);
  assert.match(ordersSource, /participantLabel: ticket\.ticketType === 'team'/);
  assert.match(ordersSource, /teamPlayerDisplayName\(\{ participant, participantIndex, accessPath \}\)/);
  assert.match(ordersSource, /const playerName = isBuyerPlayer[\s\S]*member\.displayName/);
});

test('individual form sharing is grouped while bulk actions keep the shared secondary treatment', () => {
  const individualActions = ordersSource.slice(
    ordersSource.indexOf('function ParticipantFormLinkActions'),
    ordersSource.indexOf('function ParticipantFormShareControls'),
  );
  const bulkActions = ordersSource.slice(
    ordersSource.indexOf('function ParticipantFormShareControls'),
    ordersSource.indexOf('function RegistrationCardHeader'),
  );

  assert.match(individualActions, /<DropdownMenu>/);
  assert.match(individualActions, /<DropdownMenuTrigger asChild>/);
  assert.match(individualActions, /(?:<PrimaryButton|<SecondaryButton)[\s\S]*Share form/);
  assert.match(individualActions, /<DropdownMenuItem[\s\S]*Send link/);
  assert.match(individualActions, /<DropdownMenuItem[\s\S]*Copy link/);
  assert.doesNotMatch(individualActions, /<SecondaryButton[\s\S]*?Send link[\s\S]*?<\/SecondaryButton>/);
  assert.doesNotMatch(individualActions, /<SecondaryButton[\s\S]*?Copy link[\s\S]*?<\/SecondaryButton>/);
  assert.match(individualActions, /primary\?: boolean/);
  assert.match(bulkActions, /<SecondaryButton[\s\S]*Send all/);
  assert.match(bulkActions, /<SecondaryButton[\s\S]*Copy all/);
  assert.doesNotMatch(bulkActions, /tone="neutral"/);
});

test('team Copy link and Send link use the same sent-state transition', () => {
  const linkActions = ordersSource.slice(
    ordersSource.indexOf('function ParticipantFormLinkActions'),
    ordersSource.indexOf('function ParticipantFormShareControls'),
  );
  const teamRegistrationSource = ordersSource.slice(
    ordersSource.indexOf('function TeamRegistrationItem'),
    ordersSource.indexOf('function ShippingTracker'),
  );

  assert.match(linkActions, /onShare\?\.\(recipient\)/);
  assert.match(linkActions, /onShare\?\.\(\)/);
  assert.match(teamRegistrationSource, /const sharePlayerInvite =/);
  assert.match(teamRegistrationSource, /onShare=\{\(recipient\) => sharePlayerInvite\(playerEntry, recipient\)\}/);
});

test('order header keeps payment state in the payment summary', () => {
  const orderDetailSource = ordersSource.slice(
    ordersSource.indexOf('export function OrderDetailPage'),
  );

  assert.doesNotMatch(orderDetailSource, /order\.paymentStatus/);
  assert.match(ordersSource, /statusLabel=\{order\.paymentStatus\}/);
});

test('bulk form actions stay compact and do not add a standalone divider', () => {
  const bulkActions = ordersSource.slice(
    ordersSource.indexOf('function ParticipantFormShareControls'),
    ordersSource.indexOf('function RegistrationCardHeader'),
  );

  assert.match(bulkActions, /className="mt-1 flex flex-col gap-2"/);
  assert.match(bulkActions, /className="text-right text-\[11px\] font-medium/);
  assert.doesNotMatch(bulkActions, /border-t border-\[#d3e6e1\]/);
});

test('single, multiple, and team order entries share the same detail primitives', () => {
  const registrationSource = ordersSource.slice(
    ordersSource.indexOf('function RegistrationCardHeader'),
    ordersSource.indexOf('function ShippingTracker'),
  );

  assert.match(registrationSource, /function RegistrationItemShell[\s\S]*<RegistrationCardHeader/);
  assert.match(registrationSource, /function RegistrationItem[\s\S]*<RegistrationItemShell/);
  assert.match(registrationSource, /function TeamRegistrationItem[\s\S]*<RegistrationItemShell/);
  assert.match(registrationSource, /function RegistrationStatePanel/);
  assert.match(registrationSource, /function ClaimLinkStatePanel/);
});

test('registration events share one continuous grouped surface', () => {
  const registrationSource = ordersSource.slice(
    ordersSource.indexOf('function RegistrationCardHeader'),
    ordersSource.indexOf('function ShippingTracker'),
  );

  assert.match(ordersSource, /data-testid="registration-event-list"/);
  assert.match(ordersSource, /data-testid="registration-event-list"[\s\S]*divide-y divide-\[#e7ecef\]/);
  assert.match(registrationSource, /data-testid="registration-event-item"/);
  assert.doesNotMatch(registrationSource, /overflow-hidden rounded-\[16px\] border border-\[#e2e8e7\] bg-white/);
});

test('registration sections use a concise operational heading and keep shared bulk actions', () => {
  assert.doesNotMatch(ordersSource, /function RegistrationItemsHeader\(/);
  assert.doesNotMatch(ordersSource, /function ParticipantFormShareCount\(/);
  assert.doesNotMatch(ordersSource, /<h2[^>]*>\s*Registration items\s*<\/h2>/);
  assert.match(ordersSource, /<h2[^>]*>Registration<\/h2>/);
  assert.match(ordersSource, /Forms and access for this order/);
  assert.match(ordersSource, /aria-label="Registration items"/);
  assert.match(ordersSource, /!hasTeamRegistration[\s\S]*<ParticipantFormShareControls[\s\S]*order=\{order\}[\s\S]*onShareEntries=\{/);
  assert.match(ordersSource, /relative flex flex-col gap-4 pb-\[calc\(7rem\+env\(safe-area-inset-bottom\)\)\]/);
});

test('filling an individual form is a secondary action', () => {
  const fillActionSource = ordersSource.slice(
    ordersSource.indexOf('fillAction={('),
    ordersSource.indexOf('viewFormAction={('),
  );
  assert.match(fillActionSource, /<SecondaryButton[\s\S]*>\s*\n\s*Fill up/);
  assert.doesNotMatch(fillActionSource, /<PrimaryButton/);
});

test('sharing is emphasized for non-self participant forms', () => {
  const registrationItemSource = ordersSource.slice(
    ordersSource.indexOf('function RegistrationItem({'),
    ordersSource.indexOf('function TeamRegistrationItem'),
  );
  const teamItemSource = ordersSource.slice(
    ordersSource.indexOf('function TeamRegistrationItem'),
    ordersSource.indexOf('function ShippingTracker'),
  );

  assert.match(registrationItemSource, /primary=\{entry\.type === 'guest'\}/);
  assert.match(teamItemSource, /primary=\{!isBuyerPlayer\}/);
});

test('invite review actions keep one clear primary send action', () => {
  const individualReviewSource = ordersSource.slice(
    ordersSource.indexOf('function EmailReviewSheet'),
    ordersSource.indexOf('function BulkEmailReviewSheet'),
  );
  const bulkReviewSource = ordersSource.slice(
    ordersSource.indexOf('function BulkEmailReviewSheet'),
    ordersSource.indexOf('function ParticipantFormLinkActions'),
  );

  assert.match(individualReviewSource, /<SecondaryButton[\s\S]*Cancel/);
  assert.match(individualReviewSource, /<PrimaryButton[\s\S]*Send invite/);
  assert.match(bulkReviewSource, /<PrimaryButton[\s\S]*entries\.length === 1 \? 'Send invite' : `Send \$\{entries\.length\} invites`/);
  assert.match(bulkReviewSource, /data-testid="bulk-email-actions"[\s\S]*<button[\s\S]*Cancel/);
  assert.doesNotMatch(bulkReviewSource, /<SecondaryButton[\s\S]*Cancel/);
  assert.doesNotMatch(bulkReviewSource, /<Check/);
});

test('all registration variants use one compact status-row composition', () => {
  const registrationItemSource = ordersSource.slice(
    ordersSource.indexOf('function RegistrationItem'),
    ordersSource.indexOf('function TeamRegistrationItem'),
  );
  const teamItemSource = ordersSource.slice(
    ordersSource.indexOf('function TeamRegistrationItem'),
    ordersSource.indexOf('function ShippingTracker'),
  );

  assert.match(ordersSource, /actions\?: React\.ReactNode/);
  assert.doesNotMatch(ordersSource, /rounded-\[14px\] border p-3\.5/);
  assert.match(registrationItemSource, /shareActions=/);
  assert.doesNotMatch(registrationItemSource, />\s*Form still needed\s*</);
  assert.match(teamItemSource, /<RegistrationStatePanel[\s\S]*tone=\{/);
  assert.match(teamItemSource, /<ClaimLinkStatePanel[\s\S]*compact/);
});

test('registration cards use a compact event identity header', () => {
  assert.match(ordersSource, /function RegistrationCardHeader\(\{ title, date, location, image \}/);
  const registrationHeaderSource = ordersSource.slice(
    ordersSource.indexOf('function RegistrationCardHeader'),
    ordersSource.indexOf('function RegistrationItemShell'),
  );
  assert.match(registrationHeaderSource, /formatEventDate\(date, \{ month: 'long' \}\)/);
  assert.match(ordersSource, /<ImageWithFallback[\s\S]*className="h-10 w-10 shrink-0 rounded-\[10px\] object-cover"/);
  assert.match(ordersSource, /<RegistrationCardHeader title=\{title\} date=\{date\} location=\{location\} image=\{image\} \/>/);
  assert.match(ordersSource, /location=\{entry\.ticket\.eventLocation\}/);
  assert.match(ordersSource, /<MapPin/);
  assert.match(ordersSource, /image\?: string/);
});

test('individual registration panels do not add redundant dividers or empty helper copy', () => {
  const passportBannerSource = ordersSource.slice(
    ordersSource.indexOf('function PassportBanner'),
    ordersSource.indexOf('function RegistrationItem({'),
  );

  assert.match(ordersSource, /divider\?: boolean/);
  assert.match(passportBannerSource, /divider=\{false\}/);
  assert.doesNotMatch(ordersSource, /No unsent forms to email\./);
  assert.match(ordersSource, /\{canEmailAll && \(/);
});

test('Passport-owned entries expose form and QR actions from Orders', () => {
  const teamItemSource = ordersSource.slice(
    ordersSource.indexOf('function TeamRegistrationItem'),
    ordersSource.indexOf('function ShippingTracker'),
  );
  assert.match(ordersSource, /viewFormAction\?: React\.ReactNode/);
  assert.match(ordersSource, /viewFormAction=\{/);
  assert.match(ordersSource, />\s*View form\s*<\/SecondaryButton>/);
  assert.match(ordersSource, />\s*View QR\s*<\/PrimaryButton>/);
  assert.match(teamItemSource, /hasPassport && isBuyerPlayer[\s\S]*View QR/);
  assert.doesNotMatch(ordersSource, />\s*View Passport\s*<\/PrimaryButton>/);
});

test('buyer-filled Guest QR entries expose the form and the QR', () => {
  const passportBannerSource = ordersSource.slice(
    ordersSource.indexOf('function PassportBanner'),
    ordersSource.indexOf('function RegistrationItem({'),
  );
  assert.match(passportBannerSource, /isGuestAccessEntry && entry\.status === 'attached'[\s\S]*viewFormAction/);
  assert.match(passportBannerSource, /entry\.guestQR\?\.isActive \? 'View QR'/);
});
