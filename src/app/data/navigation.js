export const ORDERS_PENDING_PATH = '/orders?filter=pending';

export function getOrganizerEmailHref(email) {
  return 'mailto:' + email;
}

export function getGoogleMapsSearchUrl(location) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location);
}
