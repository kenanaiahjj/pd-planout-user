# Main QA priorities design

## Goal

Resolve the four highest-impact QA findings from the Web and Mobile sheets: the incorrect event price label, Cart return navigation, Orders filter persistence, and duplicate Settings back controls.

## Scope

### 1. Event price source of truth

The event peek panel must use the same ticket catalog used by the ticket modal and full event detail page. It must not hard-code `From ₱0`. The current seeded ticket catalog produces the lowest available ticket price, so the displayed value must match that catalog.

### 2. Cart return navigation

Closing the full Cart route must return to the prior in-app location when browser history contains one. Direct visits without a usable history entry must fall back to Home. The desktop Cart drawer keeps its existing close behavior because it is an overlay, not a route.

### 3. Orders filter persistence

The selected Orders filter must be represented in the URL. Selecting `Pending` or `Complete` updates the current Orders URL without adding unnecessary history entries. Opening an order and returning to Orders must restore the selected filter. `All` remains the default when no filter is present.

### 4. Settings back-control ownership

The global shell back button must be hidden on Settings subpages that already render a page-level back button: Account, Transactions, and Inbox. The Apply Organizer route keeps the global shell back button because it does not render its own page-level control.

## Architecture

Keep each fix at its current ownership boundary:

- Reuse `getCheapestTicketPriceLabel` in `EventPeekPanel` rather than duplicating ticket-price logic.
- Make the route-level `CartRoute` decide whether to navigate back or fall back to `/`; keep `CartPage` reusable for both route and drawer contexts.
- Let `OrdersPage` own the URL/filter synchronization through React Router navigation and its existing `getOrderFilterFromSearch` helper.
- Let `RootLayout` suppress only the duplicate global control for the three Settings subpage paths; do not remove page-level controls.

## Acceptance criteria

- Event preview and event detail show the same non-zero lowest ticket price for the seeded ticket catalog.
- Full Cart close returns to the page that opened it, and direct `/cart` navigation has a safe Home fallback.
- Orders filter selection updates the URL, survives opening an order and returning, and defaults to All without a query.
- Settings Account, Transactions, and Inbox expose one visible back control; Apply Organizer still has one usable back control.
- Existing desktop Cart drawer behavior remains unchanged.
- Focused regression tests pass, and the production build completes successfully.

## Non-goals

This batch does not change the floating forms banner, event theme contrast, ticket modal scroll locking, ticket modal default view, copy polish, or mobile-only spacing findings. Those remain in the next QA batch.

## Testing strategy

Add source-level regression tests before implementation for:

- shared event price helper usage;
- Cart history fallback and back navigation;
- Orders URL filter synchronization;
- Settings path-specific global back visibility.

Run each new test in isolation during the red-green cycle, then run the related existing test files and `npm run build`.
