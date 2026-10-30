/**
 * Two clients, one project.
 *
 * `supabase` is the anon client for public reads (the property feed). Anything
 * that touches a person's own rows goes through `createClerkSupabaseClient`,
 * which attaches the Clerk session token so row-level security can identify
 * the caller.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY. Add them to .env.local and restart the bundler.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createClerkSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return getToken();
    },
  });
}
