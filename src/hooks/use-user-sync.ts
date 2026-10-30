import { useUser } from '@clerk/expo';
import { useEffect } from 'react';

import { useSupabase } from './use-supabase';

import { useUserStore } from '@/store/user-store';

/**
 * Mirrors the Clerk user into the `users` table and reads back the one flag
 * the interface depends on. Rows are created on first sign-in so the rest of
 * the app can treat every signed-in person as a row that already exists.
 */
export function useUserSync() {
  const { user } = useUser();
  const authSupabase = useSupabase();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const sync = async () => {
      const { data } = await authSupabase
        .from('users')
        .select('clerk_id, is_admin')
        .eq('clerk_id', user.id)
        .maybeSingle();

      if (!active) return;

      if (data) {
        setIsAdmin(Boolean(data.is_admin));
        return;
      }

      const { data: created } = await authSupabase
        .from('users')
        .insert({
          clerk_id: user.id,
          email: user.emailAddresses[0]?.emailAddress ?? null,
          first_name: user.firstName,
          last_name: user.lastName,
          avatar_url: user.imageUrl,
        })
        .select('is_admin')
        .maybeSingle();

      if (!active) return;
      setIsAdmin(Boolean(created?.is_admin));
    };

    sync().catch(() => {
      // A failed sync must not block browsing: the app simply stays non-admin.
      if (active) setIsAdmin(false);
    });

    return () => {
      active = false;
    };
  }, [authSupabase, setIsAdmin, user]);
}
