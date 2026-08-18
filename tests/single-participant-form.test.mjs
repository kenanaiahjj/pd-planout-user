import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const participantFormSource = fs.readFileSync(
  new URL('../src/app/pages/ParticipantFormPage.tsx', import.meta.url),
  'utf8',
);
const participantFormRouteSource = fs.readFileSync(
  new URL('../src/app/routes/ParticipantFormRoute.tsx', import.meta.url),
  'utf8',
);
const rootLayoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);

test('participant forms are self-contained and do not expose the retired roster editor', () => {
  assert.doesNotMatch(participantFormSource, /isTeamManager|isMultiEditor/);
  assert.doesNotMatch(participantFormSource, /goToNextIncomplete|nextIncompleteIdx/);
  assert.doesNotMatch(participantFormSource, /Next Participant/);
  assert.doesNotMatch(participantFormSource, /Save player access/);
  assert.doesNotMatch(participantFormSource, /Player entries saved!/);
  assert.match(participantFormSource, /playerOnly/);
  assert.match(participantFormSource, /Open QR/);
});

test('targeted team and multiple routes pass only the selected participant into the form', () => {
  assert.match(participantFormRouteSource, /const selectedParticipant/);
  assert.match(participantFormRouteSource, /participants:\s*\[selectedParticipant\]/);
  assert.doesNotMatch(participantFormRouteSource, /newPlayer=\{newPlayer\}/);
  assert.doesNotMatch(participantFormRouteSource, /onPlayerRosterChange=/);
});

test('team and multiple routes without a participant target return to Orders', () => {
  assert.match(
    participantFormRouteSource,
    /if \(\(ticket\.ticketType === 'team' \|\| ticket\.ticketType === 'multiple'\) && !completionParticipantId && !isInvite\)/,
  );
  assert.match(participantFormRouteSource, /Navigate to=\{`\/orders\/\$\{ticket\.id\}`/);
  assert.match(participantFormRouteSource, /&& !selectedParticipant && !isInvite/);
});

test('focused participant forms keep floating chat controls off the input surface', () => {
  assert.match(rootLayoutSource, /const isParticipantForm =/);
  assert.match(rootLayoutSource, /!isGuestQrPage && !isParticipantForm/);
});

test('participant form validation includes the visibly required waiver', () => {
  assert.match(participantFormSource, /isParticipantFormReady/);
  assert.doesNotMatch(
    participantFormSource,
    /const isFormFilled =\s*currentForm\.firstName\.trim\(\) !== ''/,
  );
});

test('participant form does not render a dead copy-link control', () => {
  assert.doesNotMatch(participantFormSource, /title: 'Copy link', action: \(\) => \{\}/);
});

test('waiver upload guidance accepts the document format used by the flow', () => {
  assert.match(participantFormSource, /PDF, PNG or JPG \(max\. 10 MB\)/);
  assert.doesNotMatch(participantFormSource, /SVG, PNG, JPG or GIF \(max\. 800×400px\)/);
});
