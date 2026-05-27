document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
});

async function loadPosts() {
  try {
    const data = await apiGet('/admin/blog');
    renderPostsTable(data?.items || []);
  } catch (e) {
    console.error('Failed to load posts:', e);
    const tbody = document.getElementById('blogTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--danger);padding:24px;">Erreur de chargement des articles</td></tr>';
  }
}

function renderPostsTable(posts) {
  const tbody = document.getElementById('blogTableBody');
  if (!tbody) return;

  if (!posts.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px;">Aucun article</td></tr>';
    return;
  }

  tbody.innerHTML = posts.map((p) => `
    <tr>
      <td>${p.title}</td>
      <td><span class="status-badge">${p.category}</span></td>
      <td><span class="status-badge status-${p.status}">${p.status === 'published' ? 'Publié' : 'Brouillon'}</span></td>
      <td>${new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
      <td>
        <div class="table-actions">
          <a href="add-post.html?id=${p.id}" class="action-btn" title="Modifier">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </a>
          <button class="action-btn delete" onclick="deletePost(${p.id})" title="Supprimer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function deletePost(id) {
  if (!confirmAction('Supprimer cet article ?')) return;
  try {
    await apiDelete(`/admin/blog/${id}`);
    showNotification('Article supprimé');
    loadPosts();
  } catch (e) {
    showNotification('Erreur', 'error');
  }
}
