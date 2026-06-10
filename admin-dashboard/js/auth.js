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

// Forgot password: request a reset link by email
document.getElementById('forgotForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const btn = e.target.querySelector('.btn-login');

  btn.textContent = 'Envoi...';
  btn.disabled = true;

  try {
    const data = await apiPost('/auth/forgot-password', { email });
    showNotification(data?.message || 'Si un compte existe, un email a été envoyé.');
  } catch (error) {
    showNotification(error.message || "Erreur lors de l'envoi", 'error');
  } finally {
    btn.textContent = 'Envoyer le lien';
    btn.disabled = false;
  }
});

// Reset password: set a new password using the token from the URL
document.getElementById('resetForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const btn = e.target.querySelector('.btn-login');

  if (password !== confirmPassword) {
    showNotification('Les mots de passe ne correspondent pas', 'error');
    return;
  }

  const token = new URLSearchParams(window.location.search).get('token');
  if (!token) {
    showNotification('Lien invalide ou expiré', 'error');
    return;
  }

  btn.textContent = 'Réinitialisation...';
  btn.disabled = true;

  try {
    await apiPost('/auth/reset-password', { token, new_password: password });
    showNotification('Mot de passe réinitialisé avec succès');
    setTimeout(() => (window.location.href = 'login.html'), 1500);
  } catch (error) {
    showNotification(error.message || 'Lien invalide ou expiré', 'error');
    btn.textContent = 'Réinitialiser';
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
