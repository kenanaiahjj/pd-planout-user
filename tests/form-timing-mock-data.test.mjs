import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const eventsSource = fs.readFileSync(
  new URL('../src/app/data/events.ts', import.meta.url),
  'utf8',
);

function eventBlock(title) {
  const start = eventsSource.indexOf(`title: "${title}"`);
  assert.ok(start >= 0, `missing mock event: ${title}`);
  const end = eventsSource.indexOf('\n  },', start);
  return eventsSource.slice(start, end);
}

test('events define the shared form timing contract and compatibility resolver', () => {
  assert.match(eventsSource, /export type FormTiming = 'before_checkout' \| 'after_checkout';/);
  assert.match(eventsSource, /export function getEventFormTiming\(/);
  assert.match(eventsSource, /event\?\.formTiming === 'before_checkout'/);
  assert.match(eventsSource, /event\?\.formTiming === 'after_checkout'/);
  assert.match(eventsSource, /requireFormsBeforeCheckout === true/);
});

test('active mock events include both pre-payment and post-payment form policies', () => {
  const beforeEvents = [
    'NegOr50•50 Series 2: NUTRI-RUN 65',
    'National Basketball League Finals',
    'Premier Soccer Cup',
  ];
  const afterEvents = [
    'Grand Slam Tennis Open',
    'Regional Swimming Championship',
    'Tour de City Cycling Race',
    'Beach Volleyball Open',
    'Badminton Doubles Tournament',
    'Apo Island Open Water Swim',
  ];

  for (const title of beforeEvents) {
    assert.match(eventBlock(title), /formTiming: 'before_checkout'/, title);
  }
  for (const title of afterEvents) {
    assert.match(eventBlock(title), /formTiming: 'after_checkout'/, title);
  }
});
