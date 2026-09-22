export function createGuestProfile() {
  return { name: '', email: '', phone: '', loginMethod: 'email', sessionMode: 'guest' };
}

export function createAccountProfile({ method, value, displayName, previous = {} }) {
  return {
    ...previous,
    name: previous.name?.trim() || displayName || 'PlanOut Member',
    email: method === 'email' ? value : previous.email || '',
    phone: method === 'phone' ? value : previous.phone || '',
    loginMethod: method,
    sessionMode: 'account',
  };
}

export function hasAccountSession(profile = {}) {
  if (profile.sessionMode) return profile.sessionMode === 'account';
  // Preserve existing local accounts created before sessionMode was recorded.
  return Boolean(profile.name?.trim());
}
