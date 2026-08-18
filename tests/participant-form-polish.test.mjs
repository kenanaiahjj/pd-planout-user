import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const fieldSource = fs.readFileSync(
  new URL('../src/app/components/FormTextField.tsx', import.meta.url),
  'utf8',
);
const segmentedSource = fs.readFileSync(
  new URL('../src/app/components/SegmentedChoice.tsx', import.meta.url),
  'utf8',
);
const participantSource = fs.readFileSync(
  new URL('../src/app/pages/ParticipantFormPage.tsx', import.meta.url),
  'utf8',
);
const checkoutSource = fs.readFileSync(
  new URL('../src/app/components/CheckoutPage.tsx', import.meta.url),
  'utf8',
);
const stylesSource = fs.readFileSync(
  new URL('../src/styles/index.css', import.meta.url),
  'utf8',
);

test('shared form controls expose stable semantic hooks without changing their API', () => {
  assert.match(fieldSource, /form-text-field/);
  assert.match(fieldSource, /form-text-field__label/);
  assert.match(fieldSource, /form-text-field__frame/);
  assert.match(fieldSource, /form-text-field__input/);
  assert.match(fieldSource, /form-textarea__input/);
  assert.match(segmentedSource, /segmented-choice/);
  assert.match(segmentedSource, /segmented-choice__item/);
  assert.match(segmentedSource, /data-selected=\{isActive \? '' : undefined\}/);
});

test('ParticipantFormPage opts into Quiet luxury without changing its structure', () => {
  assert.match(participantSource, /participant-form-premium flex flex-col gap-3 pb-6/);
  assert.match(participantSource, /participant-form-event-card/);
  assert.match(participantSource, /participant-form-card/);
  assert.match(participantSource, /participant-form-identity/);
  assert.match(participantSource, /participant-form-ownership/);
  assert.match(participantSource, /participant-form-owner-choice/);
  assert.match(participantSource, /participant-form-upload/);
  assert.match(participantSource, /participant-form-footer/);
  assert.match(participantSource, /Fill Details Myself/);
  assert.match(participantSource, /Invite via Email/);
  assert.match(participantSource, /Save details/);
  assert.match(participantSource, /Submit Form/);
});

test('Quiet luxury CSS is scoped and leaves shared defaults untouched', () => {
  assert.match(stylesSource, /\.participant-form-premium\s*\{/);
  assert.match(stylesSource, /\.participant-form-premium \.form-text-field__frame/);
  assert.match(stylesSource, /\.participant-form-premium \.segmented-choice/);
  assert.match(stylesSource, /\.participant-form-premium \.participant-form-owner-choice/);
  assert.doesNotMatch(stylesSource, /^\.form-text-field__frame\s*\{/m);
  assert.doesNotMatch(stylesSource, /^\.segmented-choice\s*\{/m);
});

test('Checkout scopes Quiet luxury to participant form containers only', () => {
  assert.match(checkoutSource, /participant-form-premium space-y-3/);
  assert.match(checkoutSource, /participant-form-premium participant-form-card rounded-\[22px\]/);
  assert.match(checkoutSource, /participant-form-ownership flex flex-col gap-2/);
  assert.match(checkoutSource, /participant-form-owner-choice flex min-h-\[70px\]/);
  assert.match(checkoutSource, /data-selected=\{selected \? '' : undefined\}/);
  assert.doesNotMatch(checkoutSource, /Checkout dev tools[\s\S]{0,900}participant-form-premium/);
});
