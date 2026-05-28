const SUPABASE_URL = 'https://zzdqmkiirehejmgfiedl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZHFta2lpcmVoZWptZ2ZpZWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTQyNzEsImV4cCI6MjA5NTU3MDI3MX0.ebAt68XFwzjZ0oeGa2ebqCxabDmZ6wtxZ3eFZrM7yKI';

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

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