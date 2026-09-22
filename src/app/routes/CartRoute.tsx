/**
 * Route wrapper for the Cart page.
 * Provides navigation callbacks using useNavigate.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { CartPage } from '@/app/components/CartPage';
import { useAppContext } from '@/app/context/AppContext';

export function CartRoute() {
  const navigate = useNavigate();
  const { setCheckoutIntent } = useAppContext();
  const handleClose = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <CartPage
      onClose={handleClose}
      onCheckout={(items, totalAmount) => {
        const firstItem = items[0];
        setCheckoutIntent({
          eventName: firstItem?.eventName || 'Selected tickets',
          category: items.length === 1 ? firstItem.category : `${items.length} ticket types`,
          price: totalAmount,
          items,
          image: firstItem?.image || '',
        });
        navigate('/checkout');
      }}
    />
  );
}
