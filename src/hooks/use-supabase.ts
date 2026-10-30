import { useAuth } from '@clerk/expo';
import { useMemo } from 'react';

import { createClerkSupabaseClient } from '@/lib/supabase';

/**
 * A Supabase client that carries the Clerk session token, so row-level
 * security can tell who is asking. Never cache the client beyond the session.
 */
export function useSupabase() {
  const { getToken } = useAuth();

  return useMemo(() => createClerkSupabaseClient(() => getToken()), [getToken]);
}
