import test from 'node:test';
import assert from 'node:assert/strict';

import { formatEventDate } from '../src/app/data/eventDate.js';

test('formats an event date with the full weekday', () => {
  assert.equal(
    formatEventDate('July 21, 2026 at 5:00 AM'),
    'Tuesday, Jul 21, 2026 at 5:00 AM',
  );
});
