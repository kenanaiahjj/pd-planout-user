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

function extractSnippet(source, pattern, label) {
  const match = source.match(pattern);
  assert.ok(match, `expected ${label} snippet to exist`);
  return match[0];
}

const socialButtonSnippet = extractSnippet(
  loginPageSource,
  /function SocialButton\([\s\S]*?\n}\n\nfunction BrandLockup/,
  'SocialButton',
);

const otpInputSnippet = extractSnippet(
  loginPageSource,
  /function OtpInput\([\s\S]*?\n}\n\n\/\/ ---------------------------------------------------------------------------\n\/\/ Props/,
  'OtpInput',
);

const identifierControlSnippet = [
  extractSnippet(
    loginPageSource,
    /<label htmlFor="login-identifier"[\s\S]*?<\/div>\n\n        <PrimaryButton/,
    'identifier field',
  ),
  extractSnippet(
    loginPageSource,
    /<PrimaryButton[\s\S]*?<\/PrimaryButton>/,
    'Continue button',
  ),
].join('\n');

const nonPrimaryControlSnippets = [socialButtonSnippet, otpInputSnippet, identifierControlSnippet].join('\n');

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

test('LoginPage uses the shared rounded-rectangle control language with the brand gradient primary action', () => {
  assert.match(identifierControlSnippet, /appearance="gradient"/);
  assert.match(identifierControlSnippet, /brandGradient=\{\{ from: '#28b99e', to: '#177564'/);
  assert.match(identifierControlSnippet, /bg-gradient-to-r from-\[#28b99e\] to-\[#177564\]/);
  assert.match(identifierControlSnippet, /rounded-\[12px\]/);
  assert.match(identifierControlSnippet, /min-h-\[52px\]/);
  assert.match(nonPrimaryControlSnippets, /min-h-11/);
  assert.match(nonPrimaryControlSnippets, /rounded-\[10px\]/);
  assert.match(socialButtonSnippet, /rounded-\[12px\]/);
  assert.doesNotMatch(nonPrimaryControlSnippets, /p-\[1\.5px\] rounded-full|rounded-full p-\[1\.5px\]/);
  assert.doesNotMatch(nonPrimaryControlSnippets, /rounded-\[16px\]/);
  assert.doesNotMatch(nonPrimaryControlSnippets, /translate-x-\[\-100%\]/);
  assert.doesNotMatch(nonPrimaryControlSnippets, /scale-\[1\.06\]/);
  assert.doesNotMatch(nonPrimaryControlSnippets, /animate-pulse/);
});
