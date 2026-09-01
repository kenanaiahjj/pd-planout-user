/**
 * Route wrapper for the Checkout page.
 * Reads checkout data from AppContext.checkoutIntent.
 * If no checkout intent exists, redirects to /cart.
 * If user is not authenticated, redirects to /login with returnTo.
 */
import React, { useEffect } from 'react';
import { Navigate } from 'react-router';
import { CheckoutPage } from '@/app/components/CheckoutPage';
import { useAppContext } from '@/app/context/AppContext';

export function CheckoutRoute() {
  const { checkoutIntent, setCheckoutIntent, userProfile, setUserProfile, isAuthenticated } = useAppContext();

  const isDemo = window.location.hash.includes('demo');

  useEffect(() => {
    if (isDemo) {
      if (!userProfile.name) {
        setUserProfile((p) => ({
          ...p,
          name: 'Jessica Sanchez',
          email: 'jessica@email.com',
          phone: '0917 123 4567',
        }));
      }
      if (window.location.hash.includes('demo-same') || window.location.hash.includes('demo-multi')) {
        setCheckoutIntent({
          eventName: 'NegOr50•50 Series 2: NUTRI-RUN 65',
          category: '65K Ultramarathon Entry (Solo)',
          price: 4500,
          image: '',
          items: [
            {
              ticketId: 'tkt-65k',
              category: '65K Ultramarathon Entry (Solo)',
              eventName: 'NegOr50•50 Series 2: NUTRI-RUN 65',
              price: 1500,
              qty: 3,
            },
          ],
        });
      } else if (!checkoutIntent) {
        setCheckoutIntent({
          eventName: 'NegOr50•50 Series 2: NUTRI-RUN 65',
          category: '3 ticket types',
          price: 3300,
          image: '',
        });
      }
    }
  }, [isDemo, checkoutIntent, userProfile, setCheckoutIntent, setUserProfile]);

  // Auth guard — redirect to login and preserve return path
  if (!isAuthenticated && !isDemo) {
    // We need to set returnTo before redirecting
    return <CheckoutAuthRedirect />;
  }

  // Must have checkout data
  if (!checkoutIntent && !isDemo) {
    return <Navigate to="/cart" replace />;
  }

  // Wait for demo state to initialize in AppContext
  if (isDemo && (!checkoutIntent || !userProfile.name)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#177564] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-semibold">Initializing Demo State...</p>
        </div>
      </div>
    );
  }

  return (
    <CheckoutPage
      eventName={checkoutIntent!.eventName}
      category={checkoutIntent!.category}
      price={checkoutIntent!.price}
      image={checkoutIntent!.image}
      userName={userProfile.name}
      userEmail={userProfile.email}
      userPhone={userProfile.phone}
    />
  );
}

/** Helper component that sets returnTo and redirects to login. */
function CheckoutAuthRedirect() {
  const { setReturnTo } = useAppContext();

  useEffect(() => {
    setReturnTo('/checkout');
  }, [setReturnTo]);

  return <Navigate to="/login" replace />;
}
