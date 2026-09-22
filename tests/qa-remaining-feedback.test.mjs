import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (relativePath) => fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');

const floatCard = read('../src/app/components/FloatCard.tsx');
const rootLayout = read('../src/app/layouts/RootLayout.tsx');
const home = read('../src/app/pages/HomePage.tsx');
const tickets = read('../src/app/components/GetTicketsModal.tsx');
const eventDetails = read('../src/app/components/EventDetailsPage.tsx');
const eventPeek = read('../src/app/components/EventPeekPanel.tsx');
const organizer = read('../src/app/pages/ApplyOrganizerPage.tsx');
const registration = read('../src/app/components/RegistrationItemComponents.tsx');
const orders = read('../src/app/pages/OrdersPage.tsx');
const events = read('../src/app/pages/EventsPage.tsx');
const filters = read('../src/app/components/MobileFilters.tsx');
const passport = read('../src/app/pages/PassportPage.tsx');
const guestEntry = read('../src/app/pages/GuestEntryPages.tsx');

test('attention surfaces are prioritized, compact, dismissible, and available on Home', () => {
  assert.match(floatCard, /onDismiss\?: \(\) => void/);
  assert.match(floatCard, /Dismiss forms reminder/);
  assert.doesNotMatch(floatCard, /if \(pathname === '\/'\) return true;/);
  assert.match(rootLayout, /isPendingFormCardDismissed/);
  assert.match(rootLayout, /onDismiss=\{\(\) => setIsPendingFormCardDismissed\(true\)\}/);

  const formsIndex = home.indexOf('<FormsToFinishSection');
  const upcomingIndex = home.indexOf('<UpcomingEventCard');
  assert.ok(formsIndex >= 0 && formsIndex < upcomingIndex, 'forms needing attention should appear before the upcoming event');
  assert.match(home, /passportStatusLabel = hasPending \?/);
  assert.match(home, /placeholder="Search events or sports\.\.\."/);
  assert.match(home, /data-testid="how-it-works"/);
  assert.match(home, /data-step=\{step\}/);
  assert.match(home, /data-testid="how-it-works-connector"/);
  assert.match(home, /bg-amber-50\/80/);
});

test('ticket modal starts with direct ticket discovery, locks background scroll, and accepts event brand styling', () => {
  assert.match(tickets, /import React, \{ useState, useMemo, useCallback, useEffect \}/);
  assert.match(tickets, /brandGradient\?:/);
  assert.match(tickets, /useState<'guided' \| 'list'>\('list'\)/);
  assert.match(tickets, /document\.body\.style\.overflow = 'hidden'/);
  assert.doesNotMatch(tickets, /text-slate-650|text-slate-350/);
  assert.match(eventDetails, /brandGradient=\{brand\.buttonGradient\}/);
  assert.match(eventPeek, /brandGradient=\{brand\.buttonGradient\}/);
});

test('organizer application validates actionable fields inline before submission', () => {
  assert.match(organizer, /submitAttempted/);
  assert.match(organizer, /emailIsValid/);
  assert.match(organizer, /phoneIsValid/);
  assert.match(organizer, /const handleSubmit = \(\) =>/);
  assert.match(organizer, /setSubmitAttempted\(true\)/);
  assert.match(organizer, /role="alert"/);
  assert.match(organizer, /aria-invalid=\{Boolean\(submitAttempted/);
});

test('participant actions expose loading feedback and completed contact context', () => {
  assert.match(registration, /isRevoking/);
  assert.match(registration, /Revoking…/);
  assert.match(registration, /isSending/);
  assert.match(registration, /Sending…/);
  assert.match(registration, /data-testid="participant-contact-summary"/);
  assert.match(registration, /Maximum players reached/);
});

test('Guest QR claiming exposes an in-progress state before the entry is added', () => {
  assert.match(guestEntry, /isClaiming/);
  assert.match(guestEntry, /Adding…/);
  assert.match(guestEntry, /disabled=\{isClaiming\}/);
});

test('remaining mobile and page polish uses concise copy and explicit status guidance', () => {
  assert.match(events, /placeholder="Search events or sports\.\.\."/);
  assert.match(filters, /background: isTriggerHovered \? '#f8fffd' : '#ffffff'/);
  assert.match(orders, /Track participant forms, event access, and ticket delivery\./);
  assert.match(orders, /data-testid="orders-status-guide"/);
  assert.match(orders, /Forms needed/);
  assert.match(orders, /Ready for gate/);
  assert.match(orders, /Complete/);
  assert.match(passport, /data-testid="passport-add-event-card"[\s\S]*order-first lg:order-none/);
  assert.match(eventDetails, /Event reminders on/);
  assert.match(eventDetails, /Event reminders off/);
});
