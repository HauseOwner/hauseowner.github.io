function show(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('pg-' + id).classList.add('active');
    btn.classList.add('active');
}

function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('pg-' + id).classList.add('active');
  if (btn) btn.classList.add('active');

  if (id === 'account') loadAccountPage();
}

let authMode = 'login';

function toggleAuthMode() {
  authMode = authMode === 'login' ? 'signup' : 'login';
  const isSignup = authMode === 'signup';
  document.getElementById('auth-heading').textContent = isSignup ? 'Sign Up' : 'Login';
  document.getElementById('auth-submit-btn').textContent = isSignup ? '▶ SIGN UP' : '▶ LOGIN';
  document.getElementById('auth-toggle-btn').textContent = isSignup ? 'LOGIN INSTEAD' : 'SIGN UP INSTEAD';
  document.getElementById('signup-username-wrap').classList.toggle('hidden', !isSignup);
  document.getElementById('auth-error').classList.add('hidden');
}

async function handleAuthSubmit() {
  const email = document.getElementById('input-email').value.trim();
  const password = document.getElementById('input-password').value;
  const errBox = document.getElementById('auth-error');
  errBox.classList.add('hidden');

  if (authMode === 'signup') {
    const username = document.getElementById('input-username').value.trim();
    if (!username) { errBox.textContent = 'Username is required.'; errBox.classList.remove('hidden'); return; }
    const { error } = await signUp(email, password, username);
    if (error) { errBox.textContent = error.message; errBox.classList.remove('hidden'); return; }
    errBox.style.color = 'var(--fg)';
    errBox.textContent = 'Account created! Check your email to confirm.';
    errBox.classList.remove('hidden');
  } else {
    const { error } = await logIn(email, password);
    if (error) { errBox.textContent = error.message; errBox.classList.remove('hidden'); return; }
    await updateNavAuth();
    showPage('home', document.querySelector('.nav-btn'));
  }
}

async function loadAccountPage() {
  const profile = await getProfile();
  if (!profile) { showPage('login', null); return; }
  document.getElementById('account-username').textContent = profile.username;
  const scores = await getTopScores();
  const list = document.getElementById('scores-list');
  if (scores.length === 0) {
    list.innerHTML = '<p class="coming-sub">// no scores yet</p>';
    return;
  }
  list.innerHTML = scores.map((s, i) =>
    `<div class="score-row"><span>#${i+1} ${s.username}</span><span class="score-val">${s.score} pts</span></div>`
  ).join('');
}

// Init on load
window.addEventListener('load', updateNavAuth);
