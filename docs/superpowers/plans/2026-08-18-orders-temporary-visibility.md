# Orders Temporary Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Temporarily hide the in-progress `ord-gear-001` merchandise order from the Orders overview without deleting its source fixture or breaking direct detail navigation.

**Architecture:** Keep `buildOrders()` as the complete order source. At the `OrdersPage` presentation boundary, apply a named temporary hidden-ID set, then derive both filter-tab counts and rendered cards from the resulting visible-order list.

**Tech Stack:** React, TypeScript, Vitest-free Node source-contract tests (`node:test`), Vite production build.

## Global Constraints

- Hide only `ord-gear-001` from the Orders overview.
- Keep the `ord-gear-001` fixture in `buildOrders()` so `/orders/ord-gear-001` remains available.
- Use the visible-order list for All, Pending, and Complete counts and for card rendering.
- Keep the refunded `ord-refund-001` PlanOut Official Gear order visible.
- Do not modify unrelated dirty-worktree files.

---

### Task 1: Add the temporary Orders overview visibility boundary

**Files:**
- Modify: `tests/orders-ui-consistency.test.mjs` near the existing Orders overview contract tests
- Modify: `src/app/pages/OrdersPage.tsx:1197-1224`

**Interfaces:**
- Consumes: the existing `OrderRecord[]` returned by `buildOrders()` and the existing `FilterTabs`/`OrderCard` rendering boundary.
- Produces: a module-level `TEMPORARILY_HIDDEN_ORDER_IDS` set, a `visibleOrders` array, and the existing `filteredOrders` derived from `visibleOrders`.

- [ ] **Step 1: Write the failing regression test**

Add this test after `Orders overview keeps status and purchase information in one readable hierarchy` in `tests/orders-ui-consistency.test.mjs`:

```js
test('Orders overview temporarily hides only the in-progress gear fixture', () => {
  assert.match(
    ordersSource,
    /const TEMPORARILY_HIDDEN_ORDER_IDS = new Set\(\['ord-gear-001'\]\);/,
  );
  assert.match(
    ordersSource,
    /const visibleOrders = orders\.filter\(\(order\) => !TEMPORARILY_HIDDEN_ORDER_IDS\.has\(order\.id\)\);/,
  );
  assert.match(
    ordersSource,
    /const filteredOrders = visibleOrders\.filter\(\(order\) =>/,
  );
  assert.match(
    ordersSource,
    /<FilterTabs active=\{activeFilter\} onChange=\{setActiveFilter\} orders=\{visibleOrders\} \/>/,
  );
  assert.match(ordersSource, /id: 'ord-gear-001'/);
  assert.match(ordersSource, /id: 'ord-refund-001'/);
  assert.doesNotMatch(ordersSource, /TEMPORARILY_HIDDEN_ORDER_IDS[^\n]*ord-refund-001/);
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
node --test tests/orders-ui-consistency.test.mjs
```

Expected: the new test fails because the temporary hidden-ID set and `visibleOrders` boundary do not exist yet; the pre-existing Orders tests may remain passing.

- [ ] **Step 3: Implement the minimal presentation filter**

Add this named constant at module scope in `src/app/pages/OrdersPage.tsx`:

```tsx
const TEMPORARILY_HIDDEN_ORDER_IDS = new Set(['ord-gear-001']);
```

Then update `OrdersPage()` so the existing orders memo stays unchanged and the overview derives its data as follows:

```tsx
const visibleOrders = orders.filter((order) => !TEMPORARILY_HIDDEN_ORDER_IDS.has(order.id));

const filteredOrders = visibleOrders.filter((order) => {
  if (activeFilter === 'pending') return orderHasPending(order);
  if (activeFilter === 'complete') return orderIsComplete(order);
  return true;
});
```

Finally, pass `visibleOrders` into the existing filter tabs without changing the component API:

```tsx
<FilterTabs active={activeFilter} onChange={setActiveFilter} orders={visibleOrders} />
```

Do not remove or edit either merch fixture in `buildOrders()`.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run:

```bash
node --test tests/orders-ui-consistency.test.mjs
```

Expected: all tests in the file pass, including the temporary visibility regression.

- [ ] **Step 5: Run the full verification suite**

Run each command from the repository root:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check -- src/app/pages/OrdersPage.tsx tests/orders-ui-consistency.test.mjs
```

Expected: the full Node test suite passes, the Vite build completes successfully, and `git diff --check` reports no whitespace errors. Leave unrelated existing worktree changes untouched and do not commit the implementation in this shared checkout.

