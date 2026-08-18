import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const appProviderSource = fs.readFileSync(
  new URL('../src/app/layouts/AppProviderLayout.tsx', import.meta.url),
  'utf8',
);
const orderFormSharingSource = fs.readFileSync(
  new URL('./order-form-sharing.test.mjs', import.meta.url),
  'utf8',
);

test('the app has no simulated iOS keyboard surface or simulator hooks', () => {
  assert.equal(
    fs.existsSync(new URL('../src/app/components/IOSKeyboard.tsx', import.meta.url)),
    false,
  );
  assert.doesNotMatch(appProviderSource, /IOSKeyboard|keyboard simulation/i);
  assert.doesNotMatch(orderFormSharingSource, /iosKeyboardSource|simulated keyboard Done key/i);
});
