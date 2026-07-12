document.addEventListener('DOMContentLoaded', () => {
  loadMessages();
});

async function loadMessages() {
  try {
    const data = await apiGet('/contact?page=1&limit=20');
    renderMessagesTable(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error('Failed to load messages:', e);
    const tbody = document.getElementById('messagesTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--danger);padding:24px;">Erreur de chargement des messages</td></tr>';
  }
}

function renderMessagesTable(messages) {
  const tbody = document.getElementById('messagesTableBody');
  if (!tbody) return;

  if (!messages.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px;">Aucun message</td></tr>';
    return;
  }

  tbody.innerHTML = messages.map((m) => `
    <tr>
      <td><strong>${escapeHtml(m.name)}</strong><br><small style="color:var(--text-muted)">${escapeHtml(m.email)}</small></td>
      <td>${escapeHtml(m.subject)}</td>
      <td><span class="status-badge status-${m.status}">${m.status === 'unread' ? 'Non lu' : 'Lu'}</span></td>
      <td>${new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
      <td>
        <div class="table-actions">
          <button class="action-btn" onclick="viewMessage(${m.id})" title="Voir">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          <button class="action-btn delete" onclick="deleteMessage(${m.id})" title="Supprimer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function viewMessage(id) {
  try {
    const msg = await apiGet(`/contact/${id}`);
    if (msg) {
      await fetch(`${API_URL}/contact/${id}/read`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } });
      alert(`De: ${msg.name} (${msg.email})\nSujet: ${msg.subject}\n\n${msg.message}`);
      loadMessages();
    }
  } catch (e) {
    showNotification('Erreur', 'error');
  }
}

async function deleteMessage(id) {
  if (!confirmAction('Supprimer ce message ?')) return;
  try {
    await apiDelete(`/contact/${id}`);
    showNotification('Message supprimé');
    loadMessages();
  } catch (e) {
    showNotification('Erreur', 'error');
  }
}
