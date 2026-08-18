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

