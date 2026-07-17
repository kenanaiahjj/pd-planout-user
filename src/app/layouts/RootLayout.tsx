/**
 * @file RootLayout.tsx
 * @description Persistent layout shell for all authenticated routes.
 *
 * Renders: Header + <Outlet> + Footer + BottomNav + onboarding modals +
 * desktop peek panel + desktop drawers (cart / notifications).
 *
 * Uses `useLocation()` to determine which chrome to show/hide based on
 * the current route path, replacing the old `activePage` state machine.
 */

import React, { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence } from 'motion/react';

// Layout components
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { BottomNav, type NavTab } from '@/app/components/layout/BottomNav';

// Overlays & modals
import { EventPeekPanel } from '@/app/components/EventPeekPanel';
import { DrawerPanel } from '@/app/components/DrawerPanel';
import { CartPage } from '@/app/components/CartPage';
import { NotificationsPage } from '@/app/pages/NotificationsPage';
import { AnimatedOutlet } from '@/app/components/AnimatedOutlet';
import { FloatCard } from '@/app/components/FloatCard';

// Data
import { MOCK_EVENTS } from '@/app/data/events';
import { getOrganizerBySlug } from '@/app/data/organizers';
import { getEventBrand, getBrandSurfaceStyle } from '@/app/data/eventBrand';

// Context
import { useAppContext } from '@/app/context/AppContext';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive the Header's `activePage` string from the current pathname. */
function getActivePage(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/events') return 'events';
  if (pathname.startsWith('/events/')) return 'eventDetail';
  if (pathname.startsWith('/cart')) return 'cart';
  if (pathname.startsWith('/checkout')) return 'checkout';
  if (pathname.startsWith('/orders')) return 'orders';
  if (pathname.startsWith('/passport')) return 'profile';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/notifications')) return 'notifications';
  if (pathname.startsWith('/settings')) return 'settings';
  if (pathname.startsWith('/organizers')) return 'organizerProfile';
  return 'home';
}

/** Derive the BottomNav active tab from the current pathname. */
function getActiveTab(pathname: string): NavTab {
  if (pathname === '/events' || pathname.startsWith('/events/')) return 'events';
  if (pathname.startsWith('/orders')) return 'orders';
  if (pathname.startsWith('/passport')) return 'passport';
  if (pathname.startsWith('/profile')) return 'settings';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'home';
}

/** Routes where the bottom nav should be hidden. */
function shouldHideBottomNav(pathname: string, checkoutConfirmed: boolean): boolean {
  // Hide on detail / cart / checkout / participant form / notifications / inbox / account / organizer
  if (pathname.startsWith('/events/')) return true;
  if (pathname === '/cart') return true;
  if (pathname === '/checkout') return !checkoutConfirmed; // Show nav on confirmation step
  if (pathname.match(/^\/orders\/.+\/form$/)) return true;
  if (pathname.match(/^\/orders\/[^/]+\/entry\/[^/]+\/(guest-qr|temporary-guest-qr)$/)) return true;
  if (pathname.match(/^\/orders\/[^/]+\/guest-manager$/)) return true;
  if (pathname === '/notifications') return true;
  if (pathname === '/settings/inbox') return true;
  if (pathname === '/settings/account') return true;
  if (pathname === '/settings/apply-organizer') return true;
  if (pathname.startsWith('/organizers/')) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userProfile,
    setUserProfile,
    isAuthenticated,
    peekEvent,
    setPeekEvent,
    activeDrawer,
    setActiveDrawer,
    setCheckoutIntent,
    isDesktop,
    cartCount,
    notificationCount,
    ticketActionCount,
    passportPendingCount,
    nearestPassportDeadline,
    checkoutConfirmed,
    setReturnTo,
    member,
  } = useAppContext();

  const pathname = location.pathname;
  const activePage = getActivePage(pathname);
  const activeTab = getActiveTab(pathname);
  const useFullScreenOverlay = pathname === '/passport';
  const hideBottomNav = !isAuthenticated || shouldHideBottomNav(pathname, checkoutConfirmed);

  const isTabRoot = pathname === '/' || pathname === '/events' || pathname === '/orders' || pathname === '/settings';
  const showBack = !isTabRoot;
  const hasTopBanner = (pathname.startsWith('/events/') && pathname !== '/events') || pathname.startsWith('/organizers/');

  // Derive dark-header flag from the current event brand
  const eventDetailMatch = pathname.match(/^\/events\/([^/]+)$/);
  const currentEventId = eventDetailMatch?.[1];
  const currentEvent = currentEventId ? MOCK_EVENTS.find((e) => e.id === currentEventId) : null;
  const isDarkHeader = currentEvent ? getEventBrand(currentEvent).isDarkPage : false;

  const handleHeaderBack = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get('returnTo');
    if (returnTo === 'home') {
      navigate('/');
    } else {
      navigate(-1);
    }
  }, [location.search, navigate]);

  // -----------------------------------------------------------------------
  // iOS viewport-fit=cover — ensures env(safe-area-inset-*) are exposed
  // -----------------------------------------------------------------------
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      const content = meta.getAttribute('content') || '';
      if (!content.includes('viewport-fit=cover')) {
        meta.setAttribute('content', content + ', viewport-fit=cover');
      }
    } else {
      const tag = document.createElement('meta');
      tag.name = 'viewport';
      tag.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
      document.head.appendChild(tag);
    }
  }, []);

  // -----------------------------------------------------------------------
  // Navigation helpers
  // -----------------------------------------------------------------------

  const handleTabChange = useCallback(
    (tab: NavTab) => {
      setPeekEvent(null);
      setActiveDrawer(null);
      switch (tab) {
        case 'home':
          navigate('/');
          break;
        case 'events':
          navigate('/events');
          break;
        case 'orders':
          navigate('/orders');
          break;
        case 'passport':
          navigate('/passport');
          break;
        case 'settings':
          navigate('/settings');
          break;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate, setPeekEvent, setActiveDrawer],
  );

  /** Close overlays and navigate. */
  const navTo = useCallback(
    (path: string) => {
      setPeekEvent(null);
      setActiveDrawer(null);
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate, setPeekEvent, setActiveDrawer],
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      className="min-h-dvh font-sans selection:bg-[#def2ee] selection:text-[#177564] transition-colors duration-500"
      style={currentEvent ? getBrandSurfaceStyle(currentEvent) : { backgroundColor: '#f8fafc' }}
    >
      {/* Global scrollbar styles */}
      <style>{`
        html { scrollbar-gutter: stable; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* ---- Header ---- */}
      {!useFullScreenOverlay && (
        <Header
          onCartClick={() => {
            if (isDesktop()) {
              setPeekEvent(null);
              setActiveDrawer((prev) => (prev === 'cart' ? null : 'cart'));
            } else {
              navTo('/cart');
            }
          }}
          cartCount={cartCount}
          onLogoClick={() => navTo('/')}
          onNotificationClick={() => {
            if (isDesktop()) {
              setPeekEvent(null);
              setActiveDrawer((prev) => (prev === 'notifications' ? null : 'notifications'));
            } else {
              navTo('/notifications');
            }
          }}
          notificationCount={notificationCount}
          activePage={activePage}
          onTicketsClick={() => navTo('/orders')}
          onEventsClick={() => navTo('/events')}
          onProfileClick={() => navTo('/profile')}
          onPassportClick={() => navTo('/passport')}
          onInboxClick={() => navTo('/settings/inbox')}
          onSettingsClick={() => navTo('/settings')}
          onSignOut={() => {
            // Clear user profile to "log out"
            setUserProfile({ name: '', email: '', phone: '', loginMethod: 'email' });
            navigate('/login');
          }}
          userName={userProfile.name}
          userEmail={userProfile.email}
          userAvatarUrl={userProfile.avatarUrl || member.avatarUrl}
          ticketActionCount={ticketActionCount}
          onCreateOrganization={() => navTo('/settings/apply-organizer')}
          isAuthenticated={isAuthenticated}
          onLoginClick={() => {
            setReturnTo(pathname);
            navigate('/login');
          }}
          onBackClick={showBack ? handleHeaderBack : undefined}
          isDarkHeader={isDarkHeader}
        />
      )}

      <main
        className={
          useFullScreenOverlay
            ? 'min-h-dvh overflow-x-hidden'
            : [
                // On desktop, event pages go full-bleed (no max-w, no px)
                currentEvent
                  ? 'max-w-[960px] mx-auto px-4 sm:px-8 lg:max-w-none lg:px-0'
                  : 'max-w-[960px] mx-auto px-4 sm:px-8',
                hasTopBanner ? 'pt-0' : 'pt-20 sm:pt-28',
                'overflow-x-hidden',
                hideBottomNav ? 'pb-8 sm:pb-12' : 'pb-28 sm:pb-20',
              ].join(' ')
        }
      >
        <AnimatedOutlet />
      </main>

      {/* ---- Footer ---- */}
      {/* {!useFullScreenOverlay && <Footer />} */}

      {/* ---- Bottom Nav ---- */}
      {!hideBottomNav && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingPassportCount={passportPendingCount}
          isAuthenticated={isAuthenticated}
          ticketActionCount={ticketActionCount}
          userAvatarUrl={userProfile.avatarUrl || member.avatarUrl}
        />
      )}

      {isAuthenticated && !pathname.startsWith('/cart') && !pathname.startsWith('/settings') && !pathname.startsWith('/checkout') && (
        <FloatCard
          pendingCount={passportPendingCount}
          nearestDeadline={nearestPassportDeadline}
          onPress={() => navTo('/orders')}
          accentColor={currentEvent ? getEventBrand(currentEvent).accent : undefined}
          accentDarkColor={currentEvent ? getEventBrand(currentEvent).accentDark : undefined}
        />
      )}

      {/* Onboarding temporarily disabled for faster page QA. */}

      {/* ---- Desktop peek panel ---- */}
      <AnimatePresence>
        {peekEvent && (
          <EventPeekPanel
            key="event-peek"
            event={peekEvent}
            events={MOCK_EVENTS}
            onClose={() => setPeekEvent(null)}
            onEventChange={(event) => setPeekEvent(event)}
            onGoToEventPage={(event) => {
              setPeekEvent(null);
              navigate(`/events/${event.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrganizerClick={(slug) => {
              const org = getOrganizerBySlug(slug);
              if (org) {
                setPeekEvent(null);
                navigate(`/organizers/${encodeURIComponent(org.slug)}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onGoToCart={() => {
              setPeekEvent(null);
              if (isDesktop()) {
                setActiveDrawer('cart');
              } else {
                navigate('/cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onGoToCheckout={(eventName, category, price, image, items) => {
              setPeekEvent(null);
              setCheckoutIntent({ eventName, category, price, image, items });
              navigate('/checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      {/* ---- Desktop drawers ---- */}
      <AnimatePresence>
        {activeDrawer === 'cart' && (
          <DrawerPanel
            key="drawer-cart"
            onClose={() => setActiveDrawer(null)}
            maxWidth="520px"
          >
            <CartPage
              isDrawer
              onClose={() => setActiveDrawer(null)}
              onCheckout={() => {
                setActiveDrawer(null);
                setCheckoutIntent({
                  eventName: 'City Half Marathon 2025',
                  category: '10K Category',
                  price: 1500,
                  image: 'https://images.unsplash.com/photo-1759674915081-b38844dbb613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lciUyMHJhY2UlMjBiaWIlMjBudW1iZXJ8ZW58MXx8fHwxNzcwODc3MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
                });
                navigate('/checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </DrawerPanel>
        )}
        {activeDrawer === 'notifications' && (
          <DrawerPanel
            key="drawer-notifications"
            onClose={() => setActiveDrawer(null)}
            maxWidth="480px"
          >
            <NotificationsPage
              isDrawer
              onBack={() => setActiveDrawer(null)}
              onGoToCompletedTickets={() => {
                setActiveDrawer(null);
                navigate('/orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToInbox={() => {
                setActiveDrawer(null);
                navigate('/settings/inbox');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </DrawerPanel>
        )}
      </AnimatePresence>
    </div>
  );
}
