export function formatStatus(status: string) {
  const map = {
    published: { label: 'Publié', color: 'success' },
    draft: { label: 'Brouillon', color: 'warning' },
    archived: { label: 'Archivé', color: 'info' },
    deleted: { label: 'Supprimé', color: 'danger' },
    read: { label: 'Lu', color: 'success' },
    unread: { label: 'Non lu', color: 'warning' },
  };
  return map[status] || { label: status, color: 'info' };
}

export function buildQueryString(params: Record<string, any>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });
  return query.toString();
}

export function downloadCSV(data: Record<string, any>[], filename = 'export.csv') {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function paginate(items: any[], page = 1, perPage = 10) {
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    pages: Math.ceil(items.length / perPage),
    page,
  };
}
