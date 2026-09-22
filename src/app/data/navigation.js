export const ORDERS_PENDING_PATH = '/orders?filter=pending';

export function getOrganizerEmailHref(email) {
  return 'mailto:' + email;
}

export function getGoogleMapsSearchUrl(location) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location);
}

export function getLoginDestination(target, hasAccount) {
  if (typeof target !== 'string' || !target.startsWith('/') || target.startsWith('//') || /[\\\r\n]/.test(target)) return '/';
  const url = new URL(target, 'https://planout.local');
  if (url.pathname === '/login') return '/';
  if (hasAccount) return target;
  if (url.pathname === '/checkout') return '/cart';
  return /^\/(?:$|events(?:\/|$)|organizers(?:\/|$)|cart$|guest-entry(?:\/|$)|order-share(?:\/|$))/.test(url.pathname)
    ? target
    : '/';
}

export function getRegistrationFormPath(entry, { returnTo = 'order', resubmit = false } = {}) {
  if (!entry) return ORDERS_PENDING_PATH;
  if (entry.entryStatus === 'resubmit_required' && !resubmit) {
    return `/forms/${encodeURIComponent(entry.id)}/diff?returnTo=${encodeURIComponent(returnTo)}`;
  }
  if ((entry.type === 'team' || entry.type === 'guest') && !entry.participantId) {
    return `/orders/${encodeURIComponent(entry.ticketId)}`;
  }
  const base = entry.formRoute?.startsWith('/orders/') && entry.formRoute.includes('/form')
    ? entry.formRoute
    : `/orders/${encodeURIComponent(entry.ticketId)}/form`;
  const url = new URL(base, 'https://planout.local');
  url.searchParams.set('entryId', entry.id);
  url.searchParams.set('returnTo', returnTo);
  if (entry.participantId) {
    url.searchParams.set('participantId', entry.participantId);
    url.searchParams.set('playerOnly', '1');
  }
  if (resubmit) url.searchParams.set('resubmit', '1');
  return `${url.pathname}${url.search}`;
}

export function getBackDestination(pathname, search = '') {
  const returnTo = new URLSearchParams(search).get('returnTo');
  if (returnTo === 'home') return '/';
  if (returnTo === 'checkout') return '/checkout';
  if (returnTo === 'passport') return '/passport';
  if (returnTo === 'passport-events' || returnTo === 'registration-queue') return '/passport/events';
  const order = pathname.match(/^\/orders\/([^/]+)(?:\/|$)/);
  if (order) return pathname === `/orders/${order[1]}` ? '/orders' : `/orders/${order[1]}`;
  if (pathname.startsWith('/events/') || pathname.startsWith('/organizers/')) return '/events';
  if (pathname.startsWith('/settings/')) return '/settings';
  if (pathname.startsWith('/passport/')) return '/passport';
  return '/';
}

export function getGuestQrDestination(entryId, orders = []) {
  for (const order of orders) {
    const entry = order.eventEntries.find((item) => item.id === entryId);
    if (entry) return entry.accessPath === 'guest_qr'
      ? `/orders/${encodeURIComponent(order.id)}/entry/${encodeURIComponent(entry.id)}/guest-qr`
      : `/orders/${encodeURIComponent(order.id)}`;
  }
  return '/passport/events';
}
