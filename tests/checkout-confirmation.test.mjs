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

test('checkout forms expose the same ownership choice as Orders', () => {
  assert.match(checkoutSource, /type CheckoutEntryOwner = 'self' \| 'guest';/);
  assert.match(checkoutSource, /This entry is for/);
  assert.match(checkoutSource, /For me/);
  assert.match(checkoutSource, /Attaches to my Passport/);
  assert.match(checkoutSource, /For someone else/);
  assert.match(checkoutSource, /Buyer-filled Guest QR/);
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

test('multiple event mode reopens every displayed form', () => {
  const modeStart = checkoutSource.indexOf("if (mode === 'single')");
  const displayedItemsStart = checkoutSource.indexOf('const displayedItems', modeStart);
  const modeBlock = checkoutSource.slice(modeStart, displayedItemsStart);

  assert.match(modeBlock, /prev\.map\(\(item\) => \(\{ \.\.\.item, formComplete: false \}\)\)/);
});
