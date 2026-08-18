export function detectLoginMethod(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes('@') || /[A-Za-z]/.test(trimmed)) return 'email';
  if (/^[+\d(]/.test(trimmed)) return 'phone';

  return 'email';
}
