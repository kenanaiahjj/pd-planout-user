/**
 * Convert registration records into purchased financial lines.
 *
 * Team purchases keep one record per player slot for form and access
 * management, but the purchase itself is one priced team entry.
 */
export function getOrderEventLineItems(entries = []) {
  const lines = [];
  const teamPurchaseIds = new Set();

  entries.forEach((entry) => {
    if (entry.type === 'team') {
      const ticketId = entry.ticket.id;
      if (teamPurchaseIds.has(ticketId)) return;
      teamPurchaseIds.add(ticketId);
      lines.push({
        id: `${ticketId}-team-purchase`,
        label: `${entry.ticket.eventTitle} - ${entry.ticket.ticketTypeName}`,
        amount: entry.price,
      });
      return;
    }

    lines.push({
      id: entry.id,
      label: entry.entryName,
      amount: entry.price,
    });
  });

  return lines;
}

export function getOrderEventSubtotal(entries = []) {
  return getOrderEventLineItems(entries).reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Keep the order detail focused on the purchased team entry while retaining
 * the individual player records for the form and access flows.
 */
export function getOrderRegistrationEntries(entries = []) {
  const seenTeamPurchaseIds = new Set();

  return entries.filter((entry) => {
    if (entry.type !== 'team') return true;
    const ticketId = entry.ticket.id;
    if (seenTeamPurchaseIds.has(ticketId)) return false;
    seenTeamPurchaseIds.add(ticketId);
    return true;
  });
}

export function getTeamOrderSummary(entries = []) {
  const teamEntries = entries.filter((entry) => entry.type === 'team');
  if (teamEntries.length === 0) return null;

  const firstEntry = teamEntries[0];
  const totalCount = firstEntry.teamTotalCount ?? teamEntries.length;
  const setUpCount = Math.min(
    Math.max(firstEntry.teamAttachedCount ?? 0, 0),
    totalCount,
  );

  return {
    title: `${firstEntry.ticket.eventTitle} - ${firstEntry.ticket.ticketTypeName}`,
    setUpCount,
    totalCount,
    statusLabel: `${setUpCount} of ${totalCount} player entries set up`,
  };
}
