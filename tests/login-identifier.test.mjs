import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const loginDataUrl = new URL('../src/app/data/login.js', import.meta.url);

test('detectLoginMethod classifies the identifier while it is being typed', async () => {
  assert.equal(fs.existsSync(loginDataUrl), true, 'login detector module should exist');

  const { detectLoginMethod } = await import(loginDataUrl.href);
  assert.equal(typeof detectLoginMethod, 'function');

  const cases = [
    ['', null],
    ['   ', null],
    ['0', 'phone'],
    ['+63', 'phone'],
    ['(02)', 'phone'],
    ['kenan', 'email'],
    ['123abc', 'email'],
    ['123@example.com', 'email'],
    [' kenan@example.com ', 'email'],
  ];

  for (const [value, expected] of cases) {
    assert.equal(detectLoginMethod(value), expected, `classification for ${JSON.stringify(value)}`);
  }
});

const loginPageSource = fs.readFileSync(
  new URL('../src/app/pages/LoginPage.tsx', import.meta.url),
  'utf8',
);

const primaryButtonSource = fs.readFileSync(
  new URL('../src/app/components/PrimaryButton.tsx', import.meta.url),
  'utf8',
);

test('LoginPage uses one autodetected identifier field instead of a selector', () => {
  assert.match(loginPageSource, /import \{ detectLoginMethod \} from '@\/app\/data\/login';/);
  assert.match(loginPageSource, /const \[identifier, setIdentifier\] = useState\(''\);/);
  assert.match(loginPageSource, /const \[otpTarget, setOtpTarget\] = useState<\{ method: LoginMethod; value: string \} \| null>\(null\);/);
  assert.doesNotMatch(loginPageSource, /setInputMode/);
  assert.doesNotMatch(loginPageSource, /Segmented tab toggle/);
  assert.match(loginPageSource, /type="text"/);
  assert.match(loginPageSource, /inputMode=\{detectedMethod === 'phone' \? 'tel' : 'email'\}/);
  assert.match(loginPageSource, /aria-label="Email or phone number"/);
  assert.match(loginPageSource, /placeholder="Email or phone number"/);
});

test('PrimaryButton exposes an opt-in solid appearance for native actions', () => {
  assert.match(primaryButtonSource, /appearance\?: 'gradient' \| 'solid'/);
  assert.match(primaryButtonSource, /appearance === 'solid'/);
});

test('LoginPage uses the shared rounded-rectangle control language', () => {
  assert.match(loginPageSource, /appearance="solid"/);
  assert.match(loginPageSource, /rounded-\[10px\]/);
  assert.match(loginPageSource, /min-h-11/);
  assert.doesNotMatch(loginPageSource, /p-\[1\.5px\] rounded-full/);
  assert.doesNotMatch(loginPageSource, /rounded-\[16px\]/);
  assert.doesNotMatch(loginPageSource, /scale-\[1\.06\]/);
  assert.doesNotMatch(loginPageSource, /translate-x-\[\-100%\]/);
  assert.doesNotMatch(loginPageSource, /animate-pulse/);
});
