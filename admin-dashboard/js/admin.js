// Theme toggle
const THEME_KEY = 'admin_theme';

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  _updateThemeIcon(next);
}

function _updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  if (theme === 'light') {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.title = 'Mode sombre';
  } else {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.title = 'Mode clair';
  }
}

function _initTheme() {
  const stored = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', stored);
  _updateThemeIcon(stored);
}

_initTheme();

// Sidebar toggle for mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('active');
}

// Close sidebar on overlay click
document.getElementById('sidebarOverlay')?.addEventListener('click', toggleSidebar);

// Set active nav item
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach((item) => {
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    } else if (item.classList.contains('active') && href) {
      item.classList.remove('active');
    }
  });
}

// Format numbers
function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 500;
    color: white; animation: slideIn 0.3s ease;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Confirm action
function confirmAction(message) {
  return confirm(message);
}

// Escape untrusted text before injecting into innerHTML (data from the API,
// e.g. public contact messages, is not HTML-safe by default).
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

setActiveNav();
