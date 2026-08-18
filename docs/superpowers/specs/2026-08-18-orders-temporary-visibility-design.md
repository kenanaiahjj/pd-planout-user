# Orders Temporary Visibility Design

## Goal

Temporarily hide the in-progress `ord-gear-001` merchandise order from the Orders overview while preserving its underlying fixture and detail route.

## Approved behavior

- The overview must omit only `ord-gear-001`.
- The All, Pending, and Complete tab counts must be calculated from the visible overview orders, so the hidden order does not leave a count mismatch.
- Other orders, including the refunded PlanOut Official Gear order, remain visible.
- The order remains available to direct detail navigation and is not deleted or mutated in `buildOrders()`.

## Implementation boundary

Apply a named temporary visibility set at the `OrdersPage` presentation boundary. Keep `buildOrders()` as the complete source of order records so detail pages, future restoration, and any other consumers retain the fixture.

## Verification

- Add a regression test asserting the exact hidden ID and visible-order list feeding both `FilterTabs` and the card filter.
- Run the focused Orders UI test, the full test suite, and the production build.
