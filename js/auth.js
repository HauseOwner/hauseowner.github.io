const SUPABASE_URL = 'https://zzdqmkirehejmgfiedl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3R155kCqgRLudWvvEk1JdQ_OloBH5v5';

const { createClient } = window.supabase;

// sign up
async function signUp(email, password, username) {
    const { data, error } = await db.auth.signUp({ email, password });
    if (error) return { error };
    await db.from('profiles').insert({ id: data.user.id, username });
    return { data };
}

// log in
async function logIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) return { error };
  return { data };
}

// log out
async function logOut() {
  await db.auth.signOut();
  updateNavAuth();
}

// get current session
async function getSession() {
  const { data } = await db.auth.getSession();
  return data.session;
}

// get profile for current user
async function getProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data } = await db.from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single();
  return data;
}

// update nav to show logged-in state
async function updateNavAuth() {
  const profile = await getProfile();
  const authBtn = document.getElementById('auth-btn');
  if (!authBtn) return;
  if (profile) {
    authBtn.textContent = profile.username;
    authBtn.onclick = () => showPage('account', authBtn);
  } else {
    authBtn.textContent = 'LOGIN';
    authBtn.onclick = () => showPage('login', authBtn);
  }
}