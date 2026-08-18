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

test('participant form fields stay plain and defer organizer guidance', () => {
  assert.match(participantSource, /placeholder\?: string/);
  assert.doesNotMatch(participantSource, /placeholder="John"|placeholder="Doe"|placeholder="participant@email\.com"/);
  assert.doesNotMatch(participantSource, /placeholder="Enter email address"|placeholder="Helps you identify who you sent it to"/);
  assert.doesNotMatch(participantSource, /This file upload requirement is configured for this event/);
  assert.doesNotMatch(participantSource, /This does not match a PlanOut account automatically/);
});

test('team ownership guidance uses muted secondary text', () => {
  const ownershipGuidance = participantSource.slice(
    participantSource.indexOf('{teamOwnerSelectionLocked &&'),
    participantSource.indexOf('</fieldset>', participantSource.indexOf('{teamOwnerSelectionLocked &&')),
  );
  assert.match(ownershipGuidance, /<p className="text-\[11px\] font-medium leading-relaxed text-\[#64748b\]">/);
  assert.doesNotMatch(ownershipGuidance, /#8a5b08/);
});

test('team participant forms identify the selected slot by player number', () => {
  assert.match(participantSource, /teamPlayerLabel/);
  assert.match(participantSource, /const participantIndex = Math\.max\([\s\S]*selectedParticipant/);
  assert.match(participantSource, /const participantLabel = isTeam[\s\S]*teamPlayerLabel\(participantIndex\)/);
  assert.doesNotMatch(participantSource, /isTeam \? 'Team player entry'/);
});

test('participant identity is a single title without redundant team chrome', () => {
  const identityStart = participantSource.indexOf('className="participant-form-identity');
  const identityEnd = participantSource.indexOf('{ticket.deadline', identityStart);
  const identity = participantSource.slice(identityStart, identityEnd);
  assert.match(identity, /className="participant-form-identity flex items-center justify-between px-0\.5 pb-0\.5"/);
  assert.match(identity, /text-\[17px\] font-semibold tracking-\[-0\.01em\] text-\[#181d27\]/);
  assert.match(identity, /participantLabel/);
  assert.doesNotMatch(identity, /Team player|participantAvatarLabel|participantStatusLabel|Not started|rounded-full|bg-\[#def2ee\]/);
});

test('claim-link guidance uses the PlanOut green information treatment', () => {
  const infoBannerStart = participantSource.indexOf('/* Info banner */');
  const infoBannerEnd = participantSource.indexOf('<FormField', infoBannerStart);
  const infoBanner = participantSource.slice(infoBannerStart, infoBannerEnd);
  assert.match(infoBanner, /bg-\[#f0fdf9\] border border-\[#def2ee\]/);
  assert.match(infoBanner, /text-\[#177564\]/);
  assert.match(infoBanner, /text-\[#35635a\]/);
  assert.doesNotMatch(infoBanner, /bg-\[#eff6ff\]|#1e40af|#3b82f6/);
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
