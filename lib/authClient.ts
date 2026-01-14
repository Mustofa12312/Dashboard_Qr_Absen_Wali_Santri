// lib/authClient.ts
import { supabase } from "./supabaseClient";

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireAuth() {
  const { data } = await supabase.auth.getUser();
  return data.user ? true : false;
}

export async function logout() {
  await supabase.auth.signOut();
}
