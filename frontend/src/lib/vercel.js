export function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export function getAbsoluteUrl(path = '') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl();
  return `${base}${path}`;
}
