// Dashboard charts initialization
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  loadStats();
});

function initCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
    },
  };

  // Visits chart
  const visitsCtx = document.getElementById('visitsChart');
  if (visitsCtx) {
    new Chart(visitsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [{
          data: [400, 600, 800, 700, 900, 1200],
          borderColor: '#5865f5',
          backgroundColor: 'rgba(88,101,245,0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#5865f5',
        }],
      },
      options: chartOptions,
    });
  }

  // Messages chart
  const messagesCtx = document.getElementById('messagesChart');
  if (messagesCtx) {
    new Chart(messagesCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [{
          data: [3, 5, 8, 4, 6, 9],
          backgroundColor: 'rgba(195,68,240,0.3)',
          borderColor: '#c344f0',
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: chartOptions,
    });
  }
}

async function loadStats() {
  try {
    const stats = await apiGet('/admin/stats');
    if (!stats) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-projects', stats.projects ?? 0);
    set('stat-messages', stats.messages ?? 0);
    set('stat-users', stats.users ?? 0);
    set('stat-blog', stats.blog_posts ?? 0);

    // Update unread messages badge in sidebar
    const badge = document.querySelector('.nav-item .badge');
    if (badge) {
      const unread = stats.unread_messages ?? 0;
      badge.textContent = unread;
      badge.style.display = unread > 0 ? '' : 'none';
    }

    // Load recent activity from messages
    loadRecentActivity();
  } catch (e) {
    console.error('Stats load error:', e);
  }
}

async function loadRecentActivity() {
  try {
    const data = await apiGet('/contact?page=1&limit=5');
    const items = Array.isArray(data) ? data : (data?.items || []);
    const list = document.getElementById('activityList');
    if (!list) return;
    if (!items.length) {
      list.innerHTML = '<div class="activity-item"><span class="activity-text" style="color:var(--text-muted)">Aucune activité récente</span></div>';
      return;
    }
    list.innerHTML = items.map(m => {
      const ago = timeAgo(m.created_at);
      return `<div class="activity-item"><div class="activity-dot"></div><span class="activity-text">Message de <strong>${m.name}</strong> — ${m.subject}</span><span class="activity-time">${ago}</span></div>`;
    }).join('');
  } catch (e) {
    // keep existing activity display
  }
}

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'hier';
  return `il y a ${days}j`;
}
