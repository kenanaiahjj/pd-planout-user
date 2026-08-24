import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const widgetSource = fs.readFileSync(
  new URL('../src/app/components/OrganizerContactWidget.tsx', import.meta.url),
  'utf8',
);
const layoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);
const settingsSource = fs.readFileSync(
  new URL('../src/app/components/SettingsPage.tsx', import.meta.url),
  'utf8',
);
const organizersSource = fs.readFileSync(
  new URL('../src/app/data/organizers.ts', import.meta.url),
  'utf8',
);
const ordersSource = fs.readFileSync(
  new URL('../src/app/pages/OrdersPage.tsx', import.meta.url),
  'utf8',
);
const participantFormSource = fs.readFileSync(
  new URL('../src/app/pages/ParticipantFormPage.tsx', import.meta.url),
  'utf8',
);

test('OrganizerContactWidget renders a PlanOut-branded contact chatbox', () => {
  assert.match(widgetSource, /export function OrganizerContactWidget/);
  assert.match(widgetSource, /contact: ContactTarget/);
  assert.match(widgetSource, /Contact organizer/);
  assert.match(widgetSource, /Powered by PlanOut/);
  assert.match(widgetSource, /imgPlanOutLogo/);
  assert.match(widgetSource, /contact\.name/);
  assert.match(widgetSource, /role="dialog"/);
  assert.match(widgetSource, /onSubmit=\{handleSend\}/);
  assert.match(widgetSource, /initiallyOpen\?: boolean/);
  assert.match(widgetSource, /showLauncher\?: boolean/);
  assert.match(widgetSource, /imgMessengerLogo/);
});

test('OrganizerContactWidget exposes available contact methods', () => {
  assert.match(widgetSource, /Email organizer/);
  assert.match(widgetSource, /Call organizer/);
  assert.match(widgetSource, /mailto:/);
  assert.match(widgetSource, /tel:/);
  assert.match(widgetSource, /contact\.email/);
  assert.match(widgetSource, /contact\.phone/);
  assert.match(widgetSource, /Choose how to contact/);
  assert.match(widgetSource, /aria-label=\{`Email/);
  assert.match(widgetSource, /aria-label=\{`Call/);
});

test('OrganizerContactWidget keeps the floating chatbox responsive and accessible', () => {
  assert.match(widgetSource, /aria-label=\{isOpen/);
  assert.match(widgetSource, /Close contact organizer/);
  assert.match(widgetSource, /Contact \$\{contact\.name\}/);
  assert.match(widgetSource, /enterKeyHint="send"/);
  assert.match(widgetSource, /aria-label=\{`Message/);
  assert.match(widgetSource, /safe-area-inset-bottom/);
  assert.match(widgetSource, /md:bottom-\[152px\]/);
  assert.match(widgetSource, /w-\[min\(400px,calc\(100vw-32px\)\)\]/);
  assert.match(widgetSource, /max-h-\[min\(640px,calc\(100dvh-180px\)\)\]/);
});

test('OrganizerContactWidget uses a customer-support icon for the floating launcher', () => {
  assert.match(widgetSource, /Headset,/);
  assert.match(widgetSource, /<Headset\b/);
  assert.match(widgetSource, /title="Contact organizer"/);
});

test('RootLayout mounts organizer contact wherever one organizer context is known', () => {
  assert.match(layoutSource, /import \{ OrganizerContactWidget \}/);
  assert.match(layoutSource, /const isEventDetailPage =/);
  assert.match(layoutSource, /const currentOrganizer = currentEvent/);
  assert.match(layoutSource, /const organizerRouteMatch = pathname\.match/);
  assert.match(layoutSource, /getOrganizerBySlug\(decodeURIComponent\(organizerProfileSlug\)\)/);
  assert.match(layoutSource, /const peekOrganizer = peekEvent \? getOrganizerBySlug\(peekEvent\.organizer\) : null/);
  assert.match(layoutSource, /organizerProfile \?\? peekOrganizer/);
  assert.match(layoutSource, /const shouldShowOrganizerContact =/);
  assert.match(layoutSource, /shouldShowOrganizerContact && currentOrganizer &&/);
  assert.match(layoutSource, /contact=\{currentOrganizer\}/);
  assert.doesNotMatch(layoutSource, /getOrganizerForRoute/);
  assert.doesNotMatch(layoutSource, /MessengerWidget/);
  assert.doesNotMatch(layoutSource, /MESSENGER_WIDGET_ENABLED/);
});

test('Organizer route slugs resolve to the matching organizer record', () => {
  assert.match(organizersSource, /const normalizedSlug = slug\.replace\(\/-\/g, ' '\)/);
  assert.match(organizersSource, /o\.slug\.toLowerCase\(\) === normalizedSlug/);
});

test('Settings Help Center opens the chatbox without restoring a floating launcher', () => {
  assert.match(settingsSource, /import \{ OrganizerContactWidget, type ContactTarget \}/);
  assert.match(settingsSource, /const PLANOUT_SUPPORT_CONTACT/);
  assert.match(settingsSource, /support@planout\.ph/);
  assert.match(settingsSource, /const \[isHelpOpen, setIsHelpOpen\]/);
  assert.match(settingsSource, /label="Help Center"/);
  assert.match(settingsSource, /onClick=\{\(\) => setIsHelpOpen\(true\)\}/);
  assert.match(settingsSource, /contact=\{PLANOUT_SUPPORT_CONTACT\}/);
  assert.match(settingsSource, /title="PlanOut Help"/);
  assert.match(settingsSource, /showLauncher=\{false\}/);
  assert.match(settingsSource, /initiallyOpen/);
});

test('Settings Help Center opts into the Messenger theme for the future integration', () => {
  assert.match(widgetSource, /theme\?: 'planout' \| 'messenger'/);
  assert.match(widgetSource, /messenger-logo-transparent/);
  assert.match(widgetSource, /theme === 'messenger'/);
  assert.match(settingsSource, /theme="messenger"/);
});

test('PlanOut Support keeps Messenger styling with a PlanOut header identity', () => {
  assert.match(widgetSource, /brandLogo\?: 'planout' \| 'messenger'/);
  assert.match(widgetSource, /brandLogo = 'planout'/);
  assert.match(widgetSource, /brandLogo === 'messenger'/);
  assert.match(settingsSource, /brandLogo="planout"/);
});

test('Settings Help Center uses direct Messenger chat without contact methods', () => {
  assert.match(widgetSource, /showContactMethods\?: boolean/);
  assert.match(widgetSource, /showContactMethods = true/);
  assert.match(widgetSource, /showContactMethods && \(/);
  assert.match(widgetSource, /Type a message to chat directly with/);
  assert.match(settingsSource, /showContactMethods=\{false\}/);
});

test('PlanOut Help offers Messenger-style suggested topics', () => {
  assert.match(widgetSource, /suggestedTopics\?: string\[\]/);
  assert.match(widgetSource, /Suggested topics/);
  assert.match(widgetSource, /queueAssistantResponse\(topic, suggestedTopicReplies\[topic\]\)/);
  assert.match(settingsSource, /PLANOUT_SUPPORT_SUGGESTED_TOPICS/);
  assert.match(settingsSource, /suggestedTopics=\{PLANOUT_SUPPORT_SUGGESTED_TOPICS\}/);
  assert.match(settingsSource, /How do I buy tickets\?/);
});

test('PlanOut Help returns automated answers for suggested topics', () => {
  assert.match(widgetSource, /suggestedTopicReplies\?: Record<string, string>/);
  assert.match(widgetSource, /suggestedTopicReplies\[topic\]/);
  assert.match(settingsSource, /PLANOUT_SUPPORT_SUGGESTED_TOPIC_REPLIES/);
  assert.match(settingsSource, /Open an event and tap Get Tickets/);
  assert.match(settingsSource, /Open Passport to find your QR ticket/);
});

test('Settings Help Center uses a full-screen mobile surface and a desktop panel', () => {
  assert.match(widgetSource, /fullScreenOnMobile\?: boolean/);
  assert.match(widgetSource, /fullScreenOnMobile = false/);
  assert.match(widgetSource, /fixed inset-0/);
  assert.match(widgetSource, /md:absolute/);
  assert.match(widgetSource, /env\(safe-area-inset-top\)/);
  assert.match(settingsSource, /fullScreenOnMobile=\{true\}/);
});

test('Order details contact the organizer for the specific registration item', () => {
  assert.match(widgetSource, /export function ContactOrganizerButton/);
  assert.match(widgetSource, /export function ContactOrganizerButton[\s\S]*<SecondaryButton/);
  assert.match(ordersSource, /ContactOrganizerButton,[\s\S]*OrganizerContactWidget,[\s\S]*type ContactTarget/);
  assert.match(ordersSource, /import \{ getOrganizerBySlug \}/);
  assert.match(ordersSource, /onContactOrganizer\?: \(\) => void/);
  assert.match(ordersSource, /contactAction\?: React\.ReactNode/);
  assert.match(ordersSource, /getOrganizerBySlug\(entry\.ticket\.organizer\)/);
  assert.match(ordersSource, /contextSummary: `\$\{entry\.ticket\.eventTitle\} · Order \$\{order\.ref\}`/);
  assert.match(ordersSource, /<ContactOrganizerButton/);
  assert.match(ordersSource, /initiallyOpen[\s\S]*showLauncher=\{false\}/);
});

test('Team organizer support is scoped to the roster header', () => {
  const shareControlsSource = ordersSource.slice(
    ordersSource.indexOf('function ParticipantFormShareControls'),
    ordersSource.indexOf('function RegistrationCardHeader'),
  );
  const teamSource = ordersSource.slice(
    ordersSource.indexOf('function TeamRegistrationItem'),
    ordersSource.indexOf('function ShippingTracker'),
  );
  const playerRowsSource = teamSource.slice(teamSource.indexOf('{teamEntries.map'));

  assert.match(shareControlsSource, /contactAction\?: React\.ReactNode/);
  assert.match(shareControlsSource, /\{contactAction && \(/);
  assert.match(teamSource, /<ParticipantFormShareControls[\s\S]*contactAction=\{onContactOrganizer \? \(/);
  assert.doesNotMatch(playerRowsSource, /<ContactOrganizerButton/);
});

test('Participant forms keep a contextual organizer contact action beside the organizer identity', () => {
  assert.match(participantFormSource, /ContactOrganizerButton/);
  assert.match(participantFormSource, /OrganizerContactWidget/);
  assert.match(participantFormSource, /getOrganizerBySlug\(ticket\.organizer\)/);
  assert.match(participantFormSource, /const organizerContextSummary = `Form help · \$\{ticket\.eventTitle\} · Order \$\{ticket\.confirmationRef\}`/);
  assert.match(participantFormSource, /onClick=\{openOrganizerContact\}/);
  assert.match(participantFormSource, /!isSentOrDone && organizerContact/);
  assert.match(participantFormSource, /Need help filling this out\?/);
});
