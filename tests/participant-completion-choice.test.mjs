import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const readIfPresent = (path) => {
  const url = new URL(path, import.meta.url);
  return fs.existsSync(url) ? fs.readFileSync(url, 'utf8') : '';
};

const choiceSource = readIfPresent('../src/app/components/EntryCompletionChoice.tsx');
const participantSource = read('../src/app/pages/ParticipantFormPage.tsx');
const checkoutSource = read('../src/app/components/CheckoutPage.tsx');

test('the shared entry completion choice exposes the three ownership paths', () => {
  assert.ok(choiceSource, 'EntryCompletionChoice.tsx should exist');
  assert.match(choiceSource, /export type EntryCompletionChoiceValue = 'self' \| 'guest' \| 'claim'/);
  assert.match(choiceSource, /Who will complete this entry\?/);
  assert.match(choiceSource, /For me/);
  assert.match(choiceSource, /For someone else/);
  assert.match(choiceSource, /Send claim link/);
  assert.match(choiceSource, /I’ll fill it out/);
  assert.match(choiceSource, /They’ll fill it out/);
});

test('participant forms use one three-choice control instead of separate mode tabs', () => {
  assert.match(participantSource, /EntryCompletionChoice/);
  assert.match(participantSource, /const completionChoice: EntryCompletionChoiceValue/);
  assert.match(participantSource, /const handleCompletionChoiceChange = \(choice: EntryCompletionChoiceValue\)/);
  assert.doesNotMatch(participantSource, /function ActionModeTabs/);
  assert.doesNotMatch(participantSource, /<ActionModeTabs/);
  assert.doesNotMatch(participantSource, /This entry is for/);
});

test('checkout maps the three visible choices to its existing fill and invite state', () => {
  assert.match(checkoutSource, /EntryCompletionChoice/);
  assert.match(checkoutSource, /const updateSlotEntryChoiceGlobal = \(slotId: string, choice: EntryCompletionChoiceValue\)/);
  assert.match(checkoutSource, /value=\{singleSlotData\.deliveryMethod === 'invite' \? 'claim' : singleSlotData\.entryOwner\}/);
  assert.match(checkoutSource, /value=\{data\.deliveryMethod === 'invite' \? 'claim' : data\.entryOwner\}/);
  assert.match(checkoutSource, /choice === 'claim' \? 'invite' : 'fill'/);
  assert.doesNotMatch(checkoutSource, /function CheckoutEntryOwnerChoice/);
  assert.doesNotMatch(checkoutSource, /Fill Details Myself/);
  assert.doesNotMatch(checkoutSource, /Invite via Email/);
});
