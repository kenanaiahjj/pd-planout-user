import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stylesheet = await readFile(resolve(repoRoot, 'src/styles/index.css'), 'utf8');
const participantFormStyles = stylesheet.slice(
  stylesheet.indexOf('/* Quiet-luxury participant form appearance'),
  stylesheet.indexOf('@media (prefers-contrast: more)', stylesheet.indexOf('.participant-form-premium')),
);

test('participant form surfaces use a neutral palette instead of a warm yellow tint', () => {
  assert.ok(participantFormStyles.length > 0, 'participant form style block should exist');
  assert.doesNotMatch(participantFormStyles, /#(?:fffefa|fbfcfa|f7faf8)/i);
  assert.match(participantFormStyles, /--participant-surface:\s*#ffffff/i);
  assert.match(participantFormStyles, /\.form-text-field__frame\s*\{[\s\S]*?background:\s*#ffffff/i);
  assert.match(participantFormStyles, /\.participant-form-owner-choice\s*\{[\s\S]*?background:\s*#ffffff/i);
  assert.match(participantFormStyles, /\.participant-form-footer\s*\{[\s\S]*?background:\s*#ffffff/i);
});

test('participant form keeps selection states distinct without a tinted segmented track', () => {
  assert.match(participantFormStyles, /\.participant-form-owner-choice\[data-selected\][\s\S]*?background:\s*#edf8f4/i);
  assert.match(participantFormStyles, /\.segmented-choice\s*\{[\s\S]*?background:\s*#f8fafc/i);
  assert.match(participantFormStyles, /\.segmented-choice__item\[data-selected\][\s\S]*?background:\s*#ffffff/i);
  assert.match(participantFormStyles, /\.segmented-choice__item\[data-selected\][\s\S]*?border-color:\s*var\(--participant-border-strong\)/i);
});
