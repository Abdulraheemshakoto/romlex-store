import { signal, computed } from '@preact/signals';
import { supabase } from './supabase';

export const user = signal(null);
export const authLoading = signal(true);

// Load the current user session on startup
export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  user.value = session?.user || null;
  authLoading.value = false;

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
  });
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
  user.value = null;
}