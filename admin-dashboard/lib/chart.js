// Chart.js CDN loader
// In production, use the CDN version for better caching
// This file serves as a local fallback

(function() {
  if (typeof Chart !== 'undefined') return;

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  script.async = false;
  document.head.appendChild(script);
})();
