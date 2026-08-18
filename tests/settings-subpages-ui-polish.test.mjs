import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

const inbox = read('../src/app/pages/InboxPage.tsx');
const accountPage = read('../src/app/pages/MyAccountPage.tsx');
const transactionsPage = read('../src/app/pages/TransactionsPage.tsx');
const transactions = read('../src/app/components/settings/TransactionsTab.tsx');
const account = read('../src/app/components/settings/AccountTab.tsx');
const preferences = read('../src/app/components/settings/PreferencesTab.tsx');
const certificates = read('../src/app/components/settings/CertificatesTab.tsx');

test('settings subpages share a centered, navigable shell', () => {
  for (const source of [inbox, accountPage, transactionsPage]) {
    assert.match(source, /max-w-\[680px\]/);
    assert.match(source, /ArrowLeft/);
    assert.match(source, /aria-label="Go back"/);
    assert.match(source, /min-h-11|h-11/);
  }
});

test('inbox keeps the mail flow while using a flat list language', () => {
  assert.match(inbox, /SwipeableMessageRow/);
  assert.match(inbox, /handleArchive/);
  assert.match(inbox, /selectedMessage/);
  assert.match(inbox, /inbox-page-shell/);
  assert.doesNotMatch(inbox, /bg-gradient-to-r from-\[#e2e8f0\]/);
  assert.doesNotMatch(inbox, /rounded-2xl border border-slate-200\/60 divide-y/);
});

test('account and transactions use quiet section/list primitives', () => {
  assert.match(accountPage, /account-settings-tabs/);
  assert.match(transactionsPage, /transactions-page-shell/);
  assert.match(transactions, /transactions-list-shell/);
  assert.match(transactions, /StatusBadge/);
  assert.match(account, /account-settings-section/);
  assert.match(preferences, /account-settings-section/);
  assert.match(certificates, /account-settings-section/);
  assert.doesNotMatch(transactions, /shadow-\[0px_1px_3px_0px_rgba/);
  assert.doesNotMatch(account, /bg-white rounded-2xl border border-slate-200\/60/);
  assert.doesNotMatch(preferences, /bg-white rounded-2xl border border-slate-200\/60/);
  assert.doesNotMatch(certificates, /bg-white rounded-2xl border p-4/);
});
