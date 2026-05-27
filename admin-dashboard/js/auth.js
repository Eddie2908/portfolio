function togglePassword() {
  const input = document.getElementById('password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = e.target.querySelector('.btn-login');

  btn.textContent = 'Connexion...';
  btn.disabled = true;

  try {
    const data = await apiPost('/auth/login', { email, password });
    if (data && data.token) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      window.location.href = 'index.html';
    }
  } catch (error) {
    alert(error.message || 'Email ou mot de passe incorrect');
  } finally {
    btn.textContent = 'Se connecter';
    btn.disabled = false;
  }
});

function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = 'login.html';
}

function checkAuth() {
  const token = localStorage.getItem('admin_token');
  if (!token && !window.location.pathname.includes('login')) {
    window.location.href = 'login.html';
  }
}

checkAuth();
