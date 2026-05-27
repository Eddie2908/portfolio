const API_URL = 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin-dashboard/login.html';
      return null;
    }
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Erreur serveur');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

async function apiPost(endpoint, data) {
  return apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) });
}

async function apiPut(endpoint, data) {
  return apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) });
}

async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

async function apiUpload(endpoint, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin-dashboard/login.html';
      return null;
    }
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Upload échoué');
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}
