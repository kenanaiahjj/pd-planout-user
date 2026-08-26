import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const checkoutSource = fs.readFileSync(
  new URL('../src/app/components/CheckoutPage.tsx', import.meta.url),
  'utf8',
);

test('confirmation success includes the order summary for every success path', () => {
  const successStart = checkoutSource.indexOf("{confirmationState === 'success' && (<>" );
  const rightColumnStart = checkoutSource.indexOf('{/* Right Column: Ticket Card (Desktop) */}', successStart);
  const successBlock = checkoutSource.slice(successStart, rightColumnStart);

  assert.match(successBlock, /Do this later[\s\S]*\{confirmationOrderDetails\}/);
});

test('pending confirmation places View order inside the order summary', () => {
  const summaryStart = checkoutSource.indexOf('const confirmationOrderDetails = (');
  const summaryEnd = checkoutSource.indexOf('  const applyVoucher', summaryStart);
  const summaryBlock = checkoutSource.slice(summaryStart, summaryEnd);

  assert.match(summaryBlock, /footerAction=\{/);
  assert.match(summaryBlock, /View order/);

  const doLaterStart = checkoutSource.indexOf('Do this later');
  const pendingActions = checkoutSource.slice(doLaterStart - 450, doLaterStart + 100);

  assert.doesNotMatch(pendingActions, /View order/);
  assert.match(pendingActions, /Do this later/);
});

test('checkout forms expose the same three completion choices as Orders', () => {
  assert.match(checkoutSource, /type CheckoutEntryOwner = 'self' \| 'guest';/);
  assert.match(checkoutSource, /EntryCompletionChoice/);
  assert.match(checkoutSource, /value=\{singleSlotData\.deliveryMethod === 'invite' \? 'claim' : singleSlotData\.entryOwner\}/);
  assert.match(checkoutSource, /value=\{data\.deliveryMethod === 'invite' \? 'claim' : data\.entryOwner\}/);
  assert.match(checkoutSource, /choice === 'claim' \? 'invite' : 'fill'/);
  assert.match(checkoutSource, /entryOwner/);
  assert.match(checkoutSource, /const isPrimary = slot\.id === checkoutSlots\[0\]\?\.id;/);
});

test('buyer-filled checkout entries resolve to Passport or Guest QR access', () => {
  assert.match(checkoutSource, /entryOwner === 'guest' \? 'guest_qr' : 'passport'/);
  assert.match(checkoutSource, /entryOwner === 'guest' \? 'guest' : 'self'/);
});

test('confirmation totals and line items follow the displayed order shape', () => {
  assert.match(checkoutSource, /const subtotal = displayedItems\.reduce\(/);
  assert.match(checkoutSource, /const confirmationSubtotal = subtotal;/);
  assert.match(checkoutSource, /const confirmationPaymentLines = displayedItems\.map\(/);
});

test('payment and confirmation totals share the displayed order subtotal', () => {
  assert.match(checkoutSource, /const subtotal = displayedItems\.reduce\(/);
  assert.match(checkoutSource, /const confirmationSubtotal = subtotal;/);
});

test('confirmation success identifies a form completed before checkout', () => {
  assert.match(
    checkoutSource,
    /const frontloadedFormComplete\s*=\s*allGatedSlots\.length > 0 && allGatedSlots\.every\(\(slot\) => slot\.item\.formComplete\)/,
  );
  assert.match(checkoutSource, /Form completed before checkout/);
  assert.match(checkoutSource, /frontloadedFormComplete \? 'Form completed before checkout' : 'Passport ready'/);
});

test('confirmation keeps one entry inline and sends multiple entries to form pages', () => {
  assert.match(
    checkoutSource,
    /const shouldShowInlineConfirmationForm =\n\s*displayedItems\.length === 1 && itemQuantity === 1;/,
  );
  assert.match(checkoutSource, /function getConfirmationFormPath\(entry: RegistrationQueueEntry\)/);
  assert.match(checkoutSource, /params\.set\('participantId', `\$\{entry\.id\}-guest-/);
  assert.match(checkoutSource, /params\.set\('participantId', `\$\{entry\.id\}-member-/);
  assert.match(checkoutSource, /navigate\(getConfirmationFormPath\(entry\)\)/);
});

test('multiple event mode reopens every displayed form', () => {
  const modeStart = checkoutSource.indexOf("if (mode === 'single')");
  const displayedItemsStart = checkoutSource.indexOf('const displayedItems', modeStart);
  const modeBlock = checkoutSource.slice(modeStart, displayedItemsStart);

  assert.match(modeBlock, /prev\.map\(\(item\) => \(\{ \.\.\.item, formComplete: false \}\)\)/);
});

test('mixed checkout separates required-now forms from after-payment forms', () => {
  const gateStart = checkoutSource.indexOf('{showPreCheckoutForms && (');
  const gateEnd = checkoutSource.indexOf('{!showPreCheckoutForms && (', gateStart);
  const gateSource = checkoutSource.slice(gateStart, gateEnd);

  assert.match(checkoutSource, /const preCheckoutVisibleSlots = gatedSlots;/);
  assert.match(checkoutSource, /const afterCheckoutPendingSlots = useMemo/);
  assert.match(checkoutSource, /const afterCheckoutPreviewItems = useMemo/);
  assert.match(gateSource, /<DeferredCheckoutFormsSummary/);
  assert.match(gateSource, /Required before payment/);
  assert.doesNotMatch(checkoutSource, /const preCheckoutVisibleSlots = pendingCheckoutFormSlots/);
});

test('required-before-payment forms do not expose a bypass action', () => {
  const gateStart = checkoutSource.indexOf('{showPreCheckoutForms && (');
  const gateEnd = checkoutSource.indexOf('{!showPreCheckoutForms && (', gateStart);
  const gateSource = checkoutSource.slice(gateStart, gateEnd);

  assert.match(gateSource, /Required before payment/);
  assert.doesNotMatch(gateSource, /Fill up later/);
  assert.doesNotMatch(gateSource, /setPreCheckoutFormsDeferred/);
});

test('deferred checkout forms point users to confirmation and Orders only', () => {
  assert.match(checkoutSource, /complete them from confirmation or Orders\./);
  assert.doesNotMatch(checkoutSource, /complete them from confirmation, Orders, or Passport\./);
});

test('pre-payment participant details use a flat header band instead of a card shell', () => {
  const gateStart = checkoutSource.indexOf('data-pre-payment-gate');
  const headerStart = checkoutSource.lastIndexOf('<div className=', gateStart);
  const headerEnd = checkoutSource.indexOf('<div className="flex items-center justify-between', headerStart);
  const headerSource = checkoutSource.slice(headerStart, headerEnd);

  assert.match(headerSource, /fixed inset-x-0 top-\[70px\]/);
  assert.match(headerSource, /border-b/);
  assert.match(headerSource, /shadow-none/);
  assert.doesNotMatch(headerSource, /left-3 right-3/);
  assert.doesNotMatch(headerSource, /rounded-\[14px\]/);
});

test('pre-payment gate leaves a little more breathing room below its header', () => {
  assert.match(
    checkoutSource,
    /participant-form-premium space-y-4 pt-\[124px\] lg:pt-0/,
  );
});

test('required form submission uses a taller full-width action', () => {
  const submitStart = checkoutSource.indexOf("'Save details and continue'");
  const submitBlock = checkoutSource.slice(submitStart - 700, submitStart);

  assert.match(submitBlock, /fullWidth/);
  assert.match(submitBlock, /h-14/);
  assert.doesNotMatch(submitBlock, /h-11/);
});
