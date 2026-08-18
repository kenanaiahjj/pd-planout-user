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
