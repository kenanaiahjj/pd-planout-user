import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { PNG } from 'pngjs';

const widgetSource = fs.readFileSync(
  new URL('../src/app/components/MessengerWidget.tsx', import.meta.url),
  'utf8',
);
const layoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);
const floatCardSource = fs.readFileSync(
  new URL('../src/app/components/FloatCard.tsx', import.meta.url),
  'utf8',
);

test('MessengerWidget exposes the prototype conversation contract', () => {
  assert.match(widgetSource, /export function MessengerWidget/);
  assert.match(widgetSource, /hasPendingFormCard\?: boolean/);
  assert.match(widgetSource, /PlanOut Messenger/);
  assert.match(widgetSource, /INITIAL_MESSAGES/);
  assert.match(widgetSource, /role="dialog"/);
  assert.match(widgetSource, /Escape/);
  assert.match(widgetSource, /QUICK_REPLIES/);
});

test('MessengerWidget uses Meta Messenger visual and accessible trigger cues', () => {
  assert.match(widgetSource, /Open Messenger/);
  assert.match(widgetSource, /Close Messenger/);
  assert.match(widgetSource, /#00b2ff|#006aff/);
  assert.match(widgetSource, /aria-expanded/);
  assert.match(widgetSource, /safe-area-inset-bottom/);
  assert.match(widgetSource, /md:bottom-\[152px\]/);
  assert.match(widgetSource, /bottom-\[calc\(220px\+env\(safe-area-inset-bottom\)\)\]/);
});

test('MessengerWidget uses the supplied official Messenger artwork for the launcher', () => {
  const messengerLogoSourceUrl = new URL('../src/assets/messenger-logo.png', import.meta.url);
  const messengerLogoUrl = new URL('../src/assets/messenger-logo-transparent.png', import.meta.url);

  assert.equal(fs.existsSync(messengerLogoSourceUrl), true);
  assert.equal(fs.existsSync(messengerLogoUrl), true);
  assert.equal(
    crypto.createHash('sha256').update(fs.readFileSync(messengerLogoSourceUrl)).digest('hex'),
    '377ccb88bb04c82a5d7bf1ed4db26839e645bf3f17098a58a4ca92f6a4f409be',
  );
  assert.match(widgetSource, /import imgMessengerLogo from '@\/assets\/messenger-logo-transparent\.png'/);

  const transparentLogo = PNG.sync.read(fs.readFileSync(messengerLogoUrl));
  const cornerAlpha = [
    transparentLogo.data[3],
    transparentLogo.data[(transparentLogo.width - 1) * 4 + 3],
    transparentLogo.data[((transparentLogo.height - 1) * transparentLogo.width) * 4 + 3],
    transparentLogo.data[(transparentLogo.width * transparentLogo.height - 1) * 4 + 3],
  ];
  assert.deepEqual(cornerAlpha, [0, 0, 0, 0]);
  assert.ok(transparentLogo.data.some((value, index) => index % 4 === 3 && value === 255));

  const markSource = widgetSource.slice(
    widgetSource.indexOf('function MessengerMark'),
    widgetSource.indexOf('export function MessengerWidget'),
  );

  assert.match(markSource, /src=\{imgMessengerLogo\}/);
  assert.match(markSource, /alt=""/);
  assert.doesNotMatch(markSource, /MessageCircle|Zap/);
});

test('MessengerWidget keeps a 48px tap target around 40px artwork', () => {
  assert.match(widgetSource, /className="relative flex size-12 items-center justify-center/);
  assert.match(widgetSource, /<MessengerMark className="size-10" \/>/);
});

test('MessengerWidget uses the PlanOut brand mark for the contact avatar', () => {
  assert.match(widgetSource, /import imgPlanOutLogo from '@\/assets\/5a332411061613331a1ffc8c7aa2ccf247ff8699\.png'/);
  assert.match(widgetSource, /src=\{imgPlanOutLogo\}/);
  assert.match(widgetSource, /alt="PlanOut logo"/);
});

test('MessengerWidget keeps the header focused on chat identity and close controls', () => {
  assert.doesNotMatch(widgetSource, /Start audio call|Start video call|<Phone|<Video/);
  assert.match(widgetSource, /aria-label="Messenger details"/);
  assert.match(widgetSource, /aria-label="Close Messenger"/);
});

test('MessengerWidget emulates an active local conversation', () => {
  assert.match(widgetSource, /onSubmit=\{handleSend\}/);
  assert.match(widgetSource, /setMessageInput/);
  assert.match(widgetSource, /aria-label="Send message"/);
  assert.doesNotMatch(widgetSource, /disabled\s+placeholder="Message PlanOut"/);
  assert.match(widgetSource, /Active now/);
  assert.match(widgetSource, /A member of the PlanOut team will get back to you/);
});

test('MessengerWidget keeps the chat surface focused on Messenger conversation controls', () => {
  assert.doesNotMatch(widgetSource, /Continue in Messenger/);
  assert.doesNotMatch(widgetSource, /Messenger handoff simulated/);
  assert.doesNotMatch(widgetSource, /No external connection was made/);
  assert.match(widgetSource, /Active now/);
  assert.match(widgetSource, /aria-label="Add attachment"/);
  assert.match(widgetSource, /aria-label="Add photo"/);
  assert.match(widgetSource, /aria-label="Add emoji"/);
});

test('MessengerWidget keeps implementation disclosure out of the user-facing chat', () => {
  assert.doesNotMatch(widgetSource, /prototype/i);
  assert.doesNotMatch(widgetSource, /In production/);
  assert.doesNotMatch(widgetSource, /Replies are simulated locally/);
  assert.match(widgetSource, /aria-label="Message PlanOut"/);
});

test('MessengerWidget makes composer actions interactive', () => {
  assert.match(widgetSource, /EMOJI_OPTIONS/);
  assert.match(widgetSource, /composerMenu/);
  assert.match(widgetSource, /handleAttachmentChange/);
  assert.match(widgetSource, /type="file"/);
  assert.match(widgetSource, /accept="image\/\*"/);
  assert.match(widgetSource, /capture="environment"/);
  assert.match(widgetSource, /aria-label="Remove attachment"/);
});

test('MessengerWidget signals typing and unread replies', () => {
  assert.match(widgetSource, /const \[unreadCount, setUnreadCount\]/);
  assert.match(widgetSource, /isOpenRef/);
  assert.match(widgetSource, /PlanOut is typing/);
  assert.match(widgetSource, /aria-live="polite"/);
  assert.match(widgetSource, /unread message/);
  assert.match(widgetSource, /unreadCount > 0/);
});

test('MessengerWidget uses full Messenger styling without taking over the viewport', () => {
  assert.match(widgetSource, /aria-label="Messenger conversation"/);
  assert.match(widgetSource, /absolute bottom-\[calc\(100%\+12px\)\] right-0/);
  assert.match(widgetSource, /w-\[min\(400px,calc\(100vw-32px\)\)\]/);
  assert.match(widgetSource, /max-h-\[min\(640px,calc\(100dvh-180px\)\)\]/);
  assert.doesNotMatch(widgetSource, /fixed inset-0 flex.*md:static/);
  assert.doesNotMatch(widgetSource, /md:w-\[420px\]/);
});

test('RootLayout mounts MessengerWidget only for the authenticated shell', () => {
  assert.match(layoutSource, /import \{ MessengerWidget \} from '@\/app\/components\/MessengerWidget'/);
  assert.match(layoutSource, /isAuthenticated && !useFullScreenOverlay/);
  assert.match(layoutSource, /const showPendingFormCard/);
  assert.match(layoutSource, /hasPendingFormCard=\{showPendingFormCard\}/);
  assert.match(floatCardSource, /export function shouldHideFloatCardOnRoute/);
});

test('RootLayout enables MessengerWidget for the authenticated shell', () => {
  assert.match(layoutSource, /const MESSENGER_WIDGET_ENABLED = true/);
  assert.match(layoutSource, /MESSENGER_WIDGET_ENABLED && isAuthenticated && !useFullScreenOverlay/);
});
