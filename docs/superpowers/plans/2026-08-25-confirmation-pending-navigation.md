# Confirmation form and pending navigation implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep one pending registration form editable on checkout confirmation, route multi-entry orders to separate form pages, and make the floating forms shortcut open Orders with Pending selected.

**Architecture:** Derive confirmation inline behavior from the rendered entry count rather than the checkout demo mode. Give guest and team entries an explicit participant target when confirmation opens the route-level form page. Pass the Pending filter through the Orders URL and initialize the Orders filter from the query string.

**Tech Stack:** React, TypeScript, React Router, Node test runner, Vite.

## Global constraints

- A single pending form remains editable on the checkout confirmation page.
- Multiple pending forms continue to open separate form pages.
- The floating forms shortcut navigates to `/orders?filter=pending`.
- Orders accepts `all`, `pending`, and `complete`; unknown filters fall back to `all`.
- Do not change participant ownership, form validation, or order data semantics.

---

### Task 1: Protect confirmation routing behavior

**Files:**
- Modify: `tests/checkout-confirmation.test.mjs`
- Modify: `src/app/components/CheckoutPage.tsx`

**Interfaces:**
- Consumes: `displayedItems` and `itemQuantity`.
- Produces: `shouldShowInlineConfirmationForm` based on the actual rendered entry count.

- [x] **Step 1: Write the failing regression test**

Add a test that requires the inline confirmation condition to use the rendered item count and quantity, without depending on `itemMode`:

```js
test('confirmation keeps one entry inline and sends multiple entries to form pages', () => {
  assert.match(
    checkoutSource,
    /const shouldShowInlineConfirmationForm =\n\s*displayedItems\.length === 1 && itemQuantity === 1;/,
  );
  assert.match(checkoutSource, /function getConfirmationFormPath\(entry: RegistrationQueueEntry\)/);
  assert.match(checkoutSource, /params\.set\('participantId', `\$\{entry\.id\}-guest-/);
  assert.match(checkoutSource, /navigate\(getConfirmationFormPath\(entry\)\)/);
});
```

- [x] **Step 2: Run the focused test and confirm it fails**

Run `node --test tests/checkout-confirmation.test.mjs`.

Expected: the new test fails because the current condition also requires `itemMode === 'single'`.

- [x] **Step 3: Implement the minimal condition change**

Replace the `shouldShowInlineConfirmationForm` expression with:

```tsx
  const shouldShowInlineConfirmationForm = displayedItems.length === 1 && itemQuantity === 1;
```

Use an explicit `participantId` and `playerOnly=1` query for guest and team entries so the route-level form page renders the first unfinished participant.

- [x] **Step 4: Run the focused test and confirm it passes**

Run `node --test tests/checkout-confirmation.test.mjs`.

Expected: all checkout confirmation tests pass.

### Task 2: Route the floating forms shortcut to Pending Orders

**Files:**
- Modify: `tests/orders-ui-consistency.test.mjs`
- Modify: `src/app/layouts/RootLayout.tsx`
- Modify: `src/app/pages/OrdersPage.tsx`

**Interfaces:**
- Consumes: `navTo` in `RootLayout` and `location.search` in `OrdersPage`.
- Produces: `getOrderFilterFromSearch(search)` and a Pending-filtered Orders landing state.

- [x] **Step 1: Write the failing regression test**

Add assertions for the floating shortcut and query-driven Orders filter:

```js
test('floating forms shortcut opens Orders with Pending selected', () => {
  assert.match(rootLayoutSource, /onPress=\{\(\) => navTo\('\/orders\?filter=pending'\)\}/);
  assert.match(ordersSource, /export function getOrderFilterFromSearch\(search: string\): OrderFilter/);
  assert.match(ordersSource, /const \{ search \} = useLocation\(\);/);
  assert.match(ordersSource, /useState<OrderFilter>\(\(\) => getOrderFilterFromSearch\(search\)\)/);
  assert.match(ordersSource, /setActiveFilter\(getOrderFilterFromSearch\(search\)\)/);
});
```

- [x] **Step 2: Run the focused test and confirm it fails**

Run `node --test tests/orders-ui-consistency.test.mjs`.

Expected: the new test fails because the shortcut currently opens `/orders` and Orders always starts on `all`.

- [x] **Step 3: Implement the minimal navigation and filter parsing**

Add `useLocation`, a strict query parser, and synchronization when the URL search changes:

```tsx
export function getOrderFilterFromSearch(search: string): OrderFilter {
  const requestedFilter = new URLSearchParams(search).get('filter');
  return requestedFilter === 'pending' || requestedFilter === 'complete' ? requestedFilter : 'all';
}
```

Use `getOrderFilterFromSearch(search)` for the initial state and in an effect. Change the RootLayout handler to `navTo('/orders?filter=pending')`.

- [x] **Step 4: Run the focused test and confirm it passes**

Run `node --test tests/orders-ui-consistency.test.mjs`.

Expected: all Orders UI consistency tests pass.

### Task 3: Verify the connected flow

**Files:**
- Verify: `src/app/components/CheckoutPage.tsx`
- Verify: `src/app/layouts/RootLayout.tsx`
- Verify: `src/app/pages/OrdersPage.tsx`

- [x] **Step 1: Run the full test suite**

Run `node --test --test-reporter=dot tests/*.test.mjs` and confirm zero failures.

- [x] **Step 2: Build the application**

Run `npm run build` and confirm exit code 0.

- [x] **Step 3: Check the diff**

Run `git diff --check` and confirm no whitespace errors.

- [x] **Step 4: Browser-verify the routes**

At the checkout confirmation preview, confirm a single pending entry exposes the inline form and a multi-entry confirmation exposes separate form-page actions. From a page showing the floating forms shortcut, activate it and confirm the URL is `/orders?filter=pending`, the Pending tab is selected, and only pending orders are listed. Check browser console warnings and errors.
