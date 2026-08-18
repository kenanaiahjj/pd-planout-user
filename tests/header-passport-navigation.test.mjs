import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const headerSource = fs.readFileSync(new URL('../src/app/components/layout/Header.tsx', import.meta.url), 'utf8');
const menuSource = fs.readFileSync(new URL('../src/app/components/UserMenuDropdown.tsx', import.meta.url), 'utf8');
const bottomNavSource = fs.readFileSync(new URL('../src/app/components/layout/BottomNav.tsx', import.meta.url), 'utf8');

test('desktop Header places Passport directly before the profile avatar', () => {
  assert.match(headerSource, /IdCard/);
  assert.match(headerSource, /aria-label="Open Passport"/);
  assert.match(headerSource, /onClick=\{onPassportClick\}/);

  const actionsStart = headerSource.indexOf('{/* Right Column — Actions Capsule */}');
  const avatarStart = headerSource.indexOf('{/* User avatar */}', actionsStart);
  const actionsSource = headerSource.slice(actionsStart, avatarStart);
  assert.match(actionsSource, /aria-label="Open Passport"/);
  assert.match(actionsSource, />\s*Passport\s*</);

  const centerStart = headerSource.indexOf('{/* Center Column — Nav Links */}');
  const centerEnd = headerSource.indexOf('{/* Right Column — Actions Capsule */}', centerStart);
  const centerSource = headerSource.slice(centerStart, centerEnd);
  assert.doesNotMatch(centerSource, /Passport/);
});

test('Passport is no longer hidden inside the avatar menu while mobile BottomNav stays available', () => {
  assert.doesNotMatch(menuSource, /label: 'Passport'/);
  assert.doesNotMatch(menuSource, /onPassportClick/);
  assert.match(bottomNavSource, /aria-label="Open Passport"/);
});
