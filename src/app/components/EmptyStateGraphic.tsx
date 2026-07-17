import imgEmptyCart from '@/assets/empty-states/empty-cart.png';
import imgNoOrders from '@/assets/empty-states/no-orders.png';
import imgOrderNotFound from '@/assets/empty-states/order-not-found.png';
import imgNoNotifications from '@/assets/empty-states/no-notifications.png';
import imgNoMessages from '@/assets/empty-states/no-messages.png';
import imgNoSearchResults from '@/assets/empty-states/no-search-results.png';
import imgNoForms from '@/assets/empty-states/no-forms.png';
import imgNoCertificates from '@/assets/empty-states/no-certificates.png';
import imgNoOrganizerEvents from '@/assets/empty-states/no-organizer-events.png';
import imgNoOrganizerReviews from '@/assets/empty-states/no-organizer-reviews.png';

export type EmptyStateGraphicKind =
  | 'empty-cart'
  | 'no-orders'
  | 'order-not-found'
  | 'no-notifications'
  | 'no-messages'
  | 'no-search-results'
  | 'no-forms'
  | 'no-certificates'
  | 'no-organizer-events'
  | 'no-organizer-reviews';

const emptyStateGraphicSrc: Record<EmptyStateGraphicKind, string> = {
  'empty-cart': imgEmptyCart,
  'no-orders': imgNoOrders,
  'order-not-found': imgOrderNotFound,
  'no-notifications': imgNoNotifications,
  'no-messages': imgNoMessages,
  'no-search-results': imgNoSearchResults,
  'no-forms': imgNoForms,
  'no-certificates': imgNoCertificates,
  'no-organizer-events': imgNoOrganizerEvents,
  'no-organizer-reviews': imgNoOrganizerReviews,
};

interface EmptyStateGraphicProps {
  kind: EmptyStateGraphicKind;
  className?: string;
}

export function EmptyStateGraphic({ kind, className = '' }: EmptyStateGraphicProps) {
  return (
    <img
      src={emptyStateGraphicSrc[kind]}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none mx-auto select-none object-contain ${className}`}
      draggable={false}
    />
  );
}
