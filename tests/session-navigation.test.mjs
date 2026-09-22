import test from 'node:test';
import assert from 'node:assert/strict';
import * as navigation from '../src/app/data/navigation.js';
let session = {};
try { session = await import('../src/app/data/session.js'); } catch {}

test('guest continuation clears account identity and stays signed out after reload', () => {
  assert.equal(typeof session.createGuestProfile, 'function');
  const profile = session.createGuestProfile();
  assert.equal(profile.name, '');
  assert.equal(profile.email, '');
  assert.equal(session.hasAccountSession(JSON.parse(JSON.stringify(profile))), false);
});

test('SSO creates an account session that survives reload', () => {
  assert.equal(typeof session.createAccountProfile, 'function');
  const profile = session.createAccountProfile({ method: 'email', value: 'google-test@planout.com', displayName: 'Jessica Williams' });
  assert.equal(profile.name, 'Jessica Williams');
  assert.equal(session.hasAccountSession(JSON.parse(JSON.stringify(profile))), true);
});

test('an unfinished account profile can be authenticated without a display name', () => {
  assert.equal(typeof session.hasAccountSession, 'function');
  assert.equal(session.hasAccountSession({ sessionMode: 'account', name: '', email: 'test@example.com' }), true);
  assert.equal(session.hasAccountSession({ sessionMode: 'guest', name: 'Old preview', email: '' }), false);
  assert.equal(session.hasAccountSession({ name: 'Jessica', email: 'test@example.com' }), true);
});

test('guest continuation avoids protected routes and login redirect loops', () => {
  assert.equal(typeof navigation.getLoginDestination, 'function');
  assert.equal(navigation.getLoginDestination('/orders/tkt-013', false), '/');
  assert.equal(navigation.getLoginDestination('/checkout', false), '/cart');
  assert.equal(navigation.getLoginDestination('/events/3?section=tickets', false), '/events/3?section=tickets');
  assert.equal(navigation.getLoginDestination('/orders/tkt-013?filter=pending#form', true), '/orders/tkt-013?filter=pending#form');
  for (const target of ['/login', '//example.com', 'https://example.com', '/\\example.com', undefined]) {
    assert.equal(navigation.getLoginDestination(target, true), '/');
  }
});

test('form links preserve participant identity and existing query parameters', () => {
  assert.equal(typeof navigation.getRegistrationFormPath, 'function');
  const url = new URL(navigation.getRegistrationFormPath({ id: 'entry-3', ticketId: 'ticket-1', type: 'guest', participantId: 'p3', formRoute: '/orders/ticket-1/form?invite=1' }, { returnTo: 'home' }), 'http://localhost');
  assert.equal(url.searchParams.get('participantId'), 'p3');
  assert.equal(url.searchParams.get('entryId'), 'entry-3');
  assert.equal(url.searchParams.get('invite'), '1');
  assert.equal(url.searchParams.get('returnTo'), 'home');
  assert.equal(url.searchParams.get('playerOnly'), '1');
});

test('team summary links open Orders for player selection', () => {
  assert.equal(typeof navigation.getRegistrationFormPath, 'function');
  assert.equal(navigation.getRegistrationFormPath({ id: 'tkt-013-team', ticketId: 'tkt-013', type: 'team' }, { returnTo: 'home' }), '/orders/tkt-013');
});

test('resubmission links use the actual entry and retain the return destination', () => {
  assert.equal(typeof navigation.getRegistrationFormPath, 'function');
  const entry = { id: 'resubmit-aquathlon', ticketId: 'resubmit-aquathlon', type: 'self', entryStatus: 'resubmit_required', formRoute: '/forms/resubmit-aquathlon/diff' };
  assert.equal(navigation.getRegistrationFormPath(entry, { returnTo: 'home' }), '/forms/resubmit-aquathlon/diff?returnTo=home');
  const url = new URL(navigation.getRegistrationFormPath(entry, { returnTo: 'home', resubmit: true }), 'http://localhost');
  assert.equal(url.pathname, '/orders/resubmit-aquathlon/form');
  assert.equal(url.searchParams.get('entryId'), entry.id);
  assert.equal(url.searchParams.get('resubmit'), '1');
});

test('direct deep links have a working Back destination without browser history', () => {
  assert.equal(typeof navigation.getBackDestination, 'function');
  assert.equal(navigation.getBackDestination('/orders/tkt-013/form', '?returnTo=order'), '/orders/tkt-013');
  assert.equal(navigation.getBackDestination('/orders/tkt-013', ''), '/orders');
  assert.equal(navigation.getBackDestination('/events/3', ''), '/events');
  assert.equal(navigation.getBackDestination('/settings/account', ''), '/settings');
  assert.equal(navigation.getBackDestination('/passport/add-entry', ''), '/passport');
});

test('legacy Guest QR links resolve to the matching order entry', () => {
  assert.equal(typeof navigation.getGuestQrDestination, 'function');
  const orders = [{ id: 'ticket-1', eventEntries: [{ id: 'entry-1', accessPath: 'guest_qr' }] }];
  assert.equal(navigation.getGuestQrDestination('entry-1', orders), '/orders/ticket-1/entry/entry-1/guest-qr');
  assert.equal(navigation.getGuestQrDestination('missing-entry', orders), '/passport/events');
});
