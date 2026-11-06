import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/app/components/GetTicketsModal.tsx', import.meta.url), 'utf8');
const start = source.indexOf('const checkAvailability = useCallback');
const end = source.indexOf('// -- Handlers --', start);
const availabilityCheck = source.slice(start, end);

test('available mock tickets are not rejected by a random sold-out response', () => {
  assert.notEqual(start, -1, 'checkAvailability should exist');
  assert.doesNotMatch(availabilityCheck, /Math\.random\(\)/);
  assert.match(availabilityCheck, /return true/);
});
