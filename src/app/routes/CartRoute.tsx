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

  return (
    <CartPage
      onClose={() => navigate('/')}
      onCheckout={() => {
        setCheckoutIntent({
          eventName: 'City Half Marathon 2025',
          category: '10K Category',
          price: 1500,
          image: 'https://images.unsplash.com/photo-1759674915081-b38844dbb613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lciUyMHJhY2UlMjBiaWIlMjBudW1iZXJ8ZW58MXx8fHwxNzcwODc3MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        });
        navigate('/checkout');
      }}
    />
  );
}
