import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Live Supabase Client (initialized only if credentials provided)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Robust fallback in-memory store for session operations when credentials aren't bound yet
interface MemoryDatabase {
  sessions: Array<{ id: string; preferred_language: string; selected_persona: string; created_at: string }>;
  experiments: Array<any>;
  gameResults: Array<any>;
  feedback: Array<any>;
}

export const memoryDb: MemoryDatabase = {
  sessions: [],
  experiments: [],
  gameResults: [],
  feedback: [],
};

