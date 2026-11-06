import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (relativePath) => fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');
const context = read('../src/app/context/AppContext.tsx');
const cart = read('../src/app/data/cart.js');
const details = read('../src/app/components/EventDetailsPage.tsx');
const peek = read('../src/app/components/EventPeekPanel.tsx');
const cartPage = read('../src/app/components/CartPage.tsx');
const checkout = read('../src/app/components/CheckoutPage.tsx');

test('checkout and cart item types carry the shared form timing', () => {
  assert.match(context, /import \{ type EventData, type FormTiming \}/);
  assert.match(context, /export interface CheckoutIntentItem[\s\S]*formTiming\?: FormTiming/);
  assert.match(context, /export interface CartItem[\s\S]*formTiming\?: FormTiming/);
});

test('event detail and peek selections attach the resolved event timing', () => {
  assert.match(details, /import \{[\s\S]*getEventFormTiming[\s\S]*\} from '@\/app\/data\/events';/);
  assert.match(details, /formTiming: getEventFormTiming\(event\)/);
  assert.match(peek, /import \{[\s\S]*getEventFormTiming[\s\S]*\} from '@\/app\/data\/events';/);
  assert.match(peek, /formTiming: getEventFormTiming\(event\)/);
});

test('cart creation and checkout handoff preserve the timing field', () => {
  assert.match(cart, /formTiming: item\.formTiming/);
  assert.match(cart, /getSelectedCartCheckoutItems[\s\S]*formTiming: item\.formTiming/);
  assert.match(cartPage, /getSelectedCartCheckoutItems\(cart, selectedItems\)/);
});

test('checkout imports and uses the shared timing resolver', () => {
  assert.match(checkout, /getEventFormTiming/);
  assert.match(checkout, /const getItemFormTiming = useCallback\(/);
  assert.match(checkout, /return getEventFormTiming\(item\)/);
});

test('checkout does not assign before-checkout timing by item position', () => {
  assert.doesNotMatch(checkout, /formTiming: lineIndex === 0 \? 'before_checkout'/);
  assert.match(checkout, /const formTiming = line\.formTiming \?\?/);
  assert.match(checkout, /formTiming,/);
});

test('single-event checkout uses the event fixture policy', () => {
  assert.match(checkout, /MOCK_EVENTS\.find\(\(event\) => event\.title === checkoutIntent\.eventName\)/);
  assert.match(checkout, /const formTiming = getEventFormTiming\(eventFixture\)/);
});
