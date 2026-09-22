import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (relativePath) => fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');
const context = read('../src/app/context/AppContext.tsx');
const cart = read('../src/app/data/cart.js');
const details = read('../src/app/components/EventDetailsPage.tsx');
const peek = read('../src/app/components/EventPeekPanel.tsx');
const cartPage = read('../src/app/components/CartPage.tsx');

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
  assert.match(cartPage, /formTiming: item\.formTiming/);
});
