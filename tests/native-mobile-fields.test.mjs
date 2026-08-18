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
const stylesSource = fs.readFileSync(
  new URL('../src/styles/index.css', import.meta.url),
  'utf8',
);
const formTextFieldSource = fs.readFileSync(
  new URL('../src/app/components/FormTextField.tsx', import.meta.url),
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

test('mobile text-entry controls prevent iOS zoom and retain focus clearance', () => {
  assert.match(stylesSource, /\.native-mobile-field/);
  assert.match(stylesSource, /font-size:\s*16px\s*!important/);
  assert.match(stylesSource, /min-block-size:\s*44px/);
  assert.match(stylesSource, /scroll-margin-block:/);
  assert.match(stylesSource, /max-inline-size:\s*100%/);
});

test('shared fields forward native keyboard semantics', () => {
  assert.match(formTextFieldSource, /inputMode\?:/);
  assert.match(formTextFieldSource, /autoComplete\?:/);
  assert.match(formTextFieldSource, /enterKeyHint\?:/);
  assert.match(formTextFieldSource, /inputMode=\{inputMode\}/);
  assert.match(formTextFieldSource, /autoComplete=\{autoComplete\}/);
  assert.match(formTextFieldSource, /enterKeyHint=\{enterKeyHint\}/);
  assert.match(formTextFieldSource, /React\.useId\(\)/);
  assert.match(formTextFieldSource, /htmlFor=\{fieldId\}/);
  assert.match(formTextFieldSource, /id=\{fieldId\}/);
});

function readSource(relativePath) {
  return fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

test('search, login, OTP, email, phone, and message fields expose native hints', () => {
  assert.match(readSource('../src/app/pages/HomePage.tsx'), /type="search"[\s\S]*enterKeyHint="search"/);
  assert.match(readSource('../src/app/pages/LoginPage.tsx'), /autoComplete="username"/);
  assert.match(readSource('../src/app/pages/LoginPage.tsx'), /autoComplete=\{i === 0 \? 'one-time-code' : 'off'\}/);
  assert.match(readSource('../src/app/components/OnboardingScreen.tsx'), /autoComplete="tel"/);
  assert.match(readSource('../src/app/components/OnboardingScreen.tsx'), /autoComplete="email"/);
  assert.match(readSource('../src/app/components/MessengerWidget.tsx'), /enterKeyHint="send"/);
  assert.match(readSource('../src/app/pages/OrdersPage.tsx'), /type="email"[\s\S]*autoComplete="email"/);
});

test('every customer-facing search surface requests the native search keyboard', () => {
  const searchSurfaces = [
    '../src/app/pages/HomePage.tsx',
    '../src/app/pages/EventsPage.tsx',
    '../src/app/components/LocationDropdown.tsx',
    '../src/app/components/MobileFilters.tsx',
    '../src/app/components/settings/TransactionsTab.tsx',
    '../src/app/pages/InboxPage.tsx',
    '../src/app/pages/OrganizerProfilePage.tsx',
    '../src/app/pages/ProfilePage.tsx',
  ];

  for (const surface of searchSurfaces) {
    const source = readSource(surface);
    assert.match(source, /type="search"/, `${surface} should use type=search`);
    assert.match(source, /inputMode="search"/, `${surface} should request search input`);
    assert.match(source, /enterKeyHint="search"/, `${surface} should expose the search action`);
  }
});

test('account and contact verification fields expose autofill and OTP semantics', () => {
  const connectContactSource = readSource('../src/app/components/ConnectContactModal.tsx');
  const accountSource = readSource('../src/app/components/settings/AccountTab.tsx');
  const organizerSource = readSource('../src/app/pages/ApplyOrganizerPage.tsx');

  assert.match(connectContactSource, /autoComplete=\{index === 0 \? 'one-time-code' : 'off'\}/);
  assert.match(accountSource, /autoComplete=\{idx === 0 \? 'one-time-code' : 'off'\}/);
  assert.match(accountSource, /type="email"[\s\S]*autoComplete="email"/);
  assert.match(accountSource, /type="tel"[\s\S]*autoComplete="tel"/);
  assert.match(organizerSource, /autoComplete="name"/);
  assert.match(organizerSource, /autoComplete="email"/);
  assert.match(organizerSource, /autoComplete="tel"/);
});
