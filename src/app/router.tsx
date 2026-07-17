/**
 * @file router.tsx
 * @description React Router route tree for PlanOut Sports.
 *
 * NOTE: This file was renamed from `routes.tsx` to `router.tsx` to avoid
 * a naming collision with the `routes/` directory, which caused Vite's
 * module resolution to fail with "Failed to fetch dynamically imported module".
 *
 * Route structure:
 *  /login                   -> LoginPage (no header/footer chrome)
 *  /exclusive               -> RestrictedRoute (no header/footer chrome)
 *  /                        -> RootLayout wrapper
 *    /                      -> HomePage (landing / discovery)
 *    /events                -> EventsPage (full events listing)
 *    /events/:eventId       -> EventDetailsPage
 *    /cart                  -> CartPage
 *    /checkout              -> CheckoutPage (auth-guarded)
 *    /orders                -> OrdersPage
 *    /orders/:ticketId/form -> ParticipantFormPage
 *    /orders/:orderId/entry/:entryId/guest-qr -> BuyerGuestQrPage
 *    /orders/:orderId/entry/:entryId/temporary-guest-qr -> legacy Guest QR alias
 *    /orders/:orderId/guest-manager -> MultiGuestManagerPage
 *    /guest-entry/:guestQRRef -> PublicGuestEntryPage
 *    /ticket-claim/:claimRef -> GuestTicketClaimPage
 *    /registration-queue    -> Legacy redirect to Passport forms
 *    /passport/entry/:entryId/guest-qr -> Guest QR stub
 *    /orders/:orderId       -> OrderDetailPage
 *    /passport              -> PassportPage
 *    /profile               -> ProfilePage
 *    /notifications         -> NotificationsPage
 *    /settings              -> SettingsPage
 *    /settings/inbox        -> InboxPage
 *    /settings/account      -> MyAccountPage
 *    /settings/transactions -> TransactionsPage
 *    /settings/transactions/:txnId -> TransactionDetailPage
 *    /settings/apply-organizer -> ApplyOrganizerPage
 *    /organizers/:slug      -> OrganizerProfilePage
 *    *                      -> 404 -> redirect to /
 */

import { createBrowserRouter } from 'react-router';

// Layout
import { RootLayout } from '@/app/layouts/RootLayout';
import { AppProviderLayout, RootErrorBoundary } from '@/app/layouts/AppProviderLayout';

// Route wrappers
import { LoginRoute } from '@/app/routes/LoginRoute';
import { HomeRoute } from '@/app/routes/HomeRoute';
import { EventsRoute } from '@/app/routes/EventsRoute';
import { EventDetailRoute } from '@/app/routes/EventDetailRoute';
import { CartRoute } from '@/app/routes/CartRoute';
import { CheckoutRoute } from '@/app/routes/CheckoutRoute';
import { OrdersRoute } from '@/app/routes/OrdersRoute';
import { OrderDetailRoute } from '@/app/routes/OrderDetailRoute';
import { ParticipantFormRoute } from '@/app/routes/ParticipantFormRoute';
import { PassportEventsRoute, PassportRoute } from '@/app/routes/PassportRoute';
import { ProfileRoute } from '@/app/routes/ProfileRoute';
import { NotificationsRoute } from '@/app/routes/NotificationsRoute';
import { SettingsRoute } from '@/app/routes/SettingsRoute';
import { InboxRoute } from '@/app/routes/InboxRoute';
import { MyAccountRoute } from '@/app/routes/MyAccountRoute';
import { TransactionsRoute } from '@/app/routes/TransactionsRoute';
import { TransactionDetailRoute } from '@/app/routes/TransactionDetailRoute';
import { ApplyOrganizerRoute } from '@/app/routes/ApplyOrganizerRoute';
import { OrganizerRoute } from '@/app/routes/OrganizerRoute';
import { NotFoundRoute } from '@/app/routes/NotFoundRoute';
import { PassportCasesRoute } from '@/app/routes/PassportCasesRoute';
import { RestrictedRoute } from '@/app/routes/RestrictedRoute';
import { StubRoute } from '@/app/routes/StubRoute';
import { RegistrationQueueRoute } from '@/app/routes/RegistrationQueueRoute';
import { FormDiffPage } from '@/app/pages/FormDiffPage';
import {
  BuyerGuestQrPage,
  AddGuestEntryToPassportPage,
  GroupTicketSharePage,
  GuestTicketClaimPage,
  MultiGuestManagerPage,
  PublicGuestEntryPage,
  TemporaryGuestQrPage,
} from '@/app/pages/GuestEntryPages';
import { AuthGuard } from '@/app/components/AuthGuard';

// Preview routes — static paths for concrete dynamic route previews
import { EventDetailPreviewRoute } from '@/app/routes/previews/EventDetailPreviewRoute';
import { OrganizerPreviewRoute } from '@/app/routes/previews/OrganizerPreviewRoute';
import {
  TransactionCompletedPreviewRoute,
  TransactionPendingPreviewRoute,
  TransactionExpiredPreviewRoute,
} from '@/app/routes/previews/TransactionPreviewRoutes';
import { ParticipantFormPreviewRoute } from '@/app/routes/previews/ParticipantFormPreviewRoute';

export const router = createBrowserRouter([
  {
    // AppProvider wrapper — provides shared context to ALL routes
    Component: AppProviderLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      // Login — standalone, no chrome
      {
        path: '/login',
        Component: LoginRoute,
      },

      // Restricted / Coming Soon — standalone, no chrome
      {
        path: '/exclusive',
        Component: RestrictedRoute,
      },
      {
        path: '/guest-entry/:guestQRRef',
        Component: PublicGuestEntryPage,
      },
      {
        path: '/ticket-claim/:claimRef',
        Component: GuestTicketClaimPage,
      },
      {
        path: '/order-share/:orderId',
        Component: GroupTicketSharePage,
      },

      {
        path: '/passport-cases',
        Component: PassportCasesRoute,
      },

      // Main app — wrapped in RootLayout (header, footer, nav, overlays)
      {
        path: '/',
        Component: RootLayout,
        children: [
          { index: true, Component: HomeRoute },
          { path: 'events', Component: EventsRoute },
          // ── Preview (static) must come before the dynamic sibling ──
          { path: 'events/1', Component: EventDetailPreviewRoute },
          { path: 'events/:eventId', Component: EventDetailRoute },
          { path: 'cart', Component: CartRoute },
          { path: 'checkout', Component: CheckoutRoute },
          { path: 'orders', Component: OrdersRoute },
          { path: 'registration-queue', Component: RegistrationQueueRoute },
          // ── Preview (static) must come before the dynamic sibling ──
          { path: 'orders/tkt-002/form', Component: ParticipantFormPreviewRoute },
          { path: 'orders/:ticketId/form', Component: ParticipantFormRoute },
          {
            path: 'orders/:orderId/entry/:entryId/guest-qr',
            element: (
              <AuthGuard>
                <BuyerGuestQrPage />
              </AuthGuard>
            ),
          },
          {
            path: 'orders/:orderId/entry/:entryId/temporary-guest-qr',
            element: (
              <AuthGuard>
                <TemporaryGuestQrPage />
              </AuthGuard>
            ),
          },
          {
            path: 'orders/:orderId/guest-manager',
            element: (
              <AuthGuard>
                <MultiGuestManagerPage />
              </AuthGuard>
            ),
          },
          { path: 'orders/:orderId', Component: OrderDetailRoute },
          { path: 'passport', Component: PassportRoute },
          { path: 'passport/events', Component: PassportEventsRoute },
          {
            path: 'passport/add-entry',
            element: (
              <AuthGuard>
                <AddGuestEntryToPassportPage />
              </AuthGuard>
            ),
          },
          { path: 'passport/entry/:entryId/guest-qr', Component: StubRoute },
          {
            path: 'forms/:entryId/diff',
            element: (
              <AuthGuard>
                <FormDiffPage />
              </AuthGuard>
            ),
          },
          { path: 'profile', Component: ProfileRoute },

          { path: 'notifications', Component: NotificationsRoute },
          { path: 'settings', Component: SettingsRoute },
          { path: 'settings/inbox', Component: InboxRoute },
          { path: 'settings/account', Component: MyAccountRoute },
          { path: 'settings/transactions', Component: TransactionsRoute },
          // ── Preview (static) must come before the dynamic sibling ──
          { path: 'settings/transactions/AAA-QZCJU2', Component: TransactionCompletedPreviewRoute },
          { path: 'settings/transactions/AAA-L4DJYC', Component: TransactionPendingPreviewRoute },
          { path: 'settings/transactions/AAA-T8KZMW', Component: TransactionExpiredPreviewRoute },
          { path: 'settings/transactions/:txnId', Component: TransactionDetailRoute },
          { path: 'settings/apply-organizer', Component: ApplyOrganizerRoute },
          // ── Preview (static) must come before the dynamic sibling ──
          { path: 'organizers/city-striders', Component: OrganizerPreviewRoute },
          { path: 'organizers/:slug', Component: OrganizerRoute },
          { path: '*', Component: NotFoundRoute },
        ],
      },
    ],
  },
]);
