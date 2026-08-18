import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(
  new URL('../src/app/pages/LoginPage.tsx', import.meta.url),
  'utf8',
);

test('login keeps one focused product shell for both steps', () => {
  assert.match(source, /Sign in to PlanOut/);
  assert.match(source, /Use your email or phone number to continue/);
  assert.match(source, /aria-label="Email or phone number"/);
  assert.match(source, /bg-gradient-to-r from-\[#28b99e\] to-\[#177564\]/);
  assert.match(source, /Or continue with/);
  assert.match(source, /Continue as Guest/);
  assert.match(source, /Enter your verification code/);
  assert.doesNotMatch(source, /imgHero/);
  assert.doesNotMatch(source, /PlanOut Passport/);
  assert.doesNotMatch(source, /testimonial|Verified|City Striders Runner|48K\+/i);
  assert.doesNotMatch(source, /animate-pulse-slow|translate-x-\[100%\]|group-hover:scale-105/);
});
