const MONTH_INDEX = Object.freeze({
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
});

const EVENT_DATE_PATTERN = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/;

function parseEventDate(value) {
  if (typeof value !== 'string') return null;

  const dateOnly = value.split(' at ')[0].trim();
  const match = dateOnly.match(EVENT_DATE_PATTERN);
  if (!match || MONTH_INDEX[match[1]] === undefined) return null;

  const year = Number(match[3]);
  const day = Number(match[2]);
  const date = new Date(year, MONTH_INDEX[match[1]], day);

  if (
    date.getFullYear() !== year
    || date.getMonth() !== MONTH_INDEX[match[1]]
    || date.getDate() !== day
  ) {
    return null;
  }

  return {
    date,
    time: value.split(' at ')[1]?.trim() || '',
  };
}

function dateLabel(date, { weekday = 'long', month = 'short', includeYear = true } = {}) {
  return new Intl.DateTimeFormat('en-US', {
    weekday,
    month,
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(date);
}

export function formatEventDate(value, { includeTime = true, weekday = 'long', month = 'short' } = {}) {
  const parsed = parseEventDate(value);
  if (!parsed) return value || 'Date to be announced';

  const formattedDate = dateLabel(parsed.date, { weekday, month });
  return includeTime && parsed.time ? `${formattedDate} at ${parsed.time}` : formattedDate;
}

export function formatEventDateOnly(value) {
  return formatEventDate(value, { includeTime: false });
}

export function formatEventDay(value) {
  return formatEventDate(value, { includeTime: false }).replace(/, \d{4}$/, '');
}

export function getEventTime(value) {
  return typeof value === 'string' ? value.split(' at ')[1]?.trim() || 'Time TBD' : 'Time TBD';
}

export function formatEventDateRange(startValue, endValue) {
  const start = parseEventDate(startValue);
  const end = parseEventDate(endValue);

  if (!start || !end) {
    return `${formatEventDate(startValue, { includeTime: false })} - ${formatEventDate(endValue, { includeTime: false })}`;
  }

  if (start.date.getFullYear() === end.date.getFullYear()) {
    return `${dateLabel(start.date, { includeYear: false })} – ${dateLabel(end.date)}`;
  }

  return `${dateLabel(start.date)} – ${dateLabel(end.date)}`;
}

export function formatEventSessionListLabel(values) {
  const labels = values.slice(0, 3).map((value) => formatEventDay(value));
  const remainingCount = values.length - labels.length;
  const suffix = remainingCount > 0 ? ` +${remainingCount}` : '';
  return `${values.length} sessions · ${labels.join(', ')}${suffix}`;
}
