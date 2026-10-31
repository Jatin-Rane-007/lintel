import { useAuth } from '@clerk/expo';
import { useCallback, useEffect, useState } from 'react';

import { useSupabase } from './use-supabase';

/**
 * The saved state of one property. Saving is optimistic in the sense that the
 * heart flips as soon as the write lands, and the list that opened the card is
 * told through `onUnsave` so it can drop the row without refetching.
 *
 * A write that does not land puts the heart back and leaves `saveFailed` on, so
 * the card can say what happened. A heart that quietly flips back is the worst
 * of both worlds: the tap looks broken and there is nothing to read.
 */
export function useSavedProperty(propertyId: string, onUnsave?: () => void) {
  const { userId } = useAuth();
  const authSupabase = useSupabase();

  const [isSaved, setIsSaved] = useState(false);
  /** The id the answer belongs to — anything else is still being checked. */
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    if (!userId || !propertyId) return;

    let active = true;

    authSupabase
      .from('saved_properties')
      .select('id')
      .eq('user_clerk_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setIsSaved(Boolean(data));
        setLoadedFor(propertyId);
      });

    return () => {
      active = false;
    };
  }, [authSupabase, propertyId, userId]);

  const toggleSave = useCallback(async () => {
    if (!userId || !propertyId || isBusy) return;

    setIsBusy(true);
    setSaveFailed(false);
    const next = !isSaved;
    setIsSaved(next);

    const { error } = next
      ? await authSupabase
          .from('saved_properties')
          .insert({ user_clerk_id: userId, property_id: propertyId })
      : await authSupabase
          .from('saved_properties')
          .delete()
          .eq('user_clerk_id', userId)
          .eq('property_id', propertyId);

    if (error) {
      // Put the heart back where it was: the write did not happen.
      setIsSaved(!next);
      setSaveFailed(true);
    } else if (!next) {
      onUnsave?.();
    }

    setIsBusy(false);
  }, [authSupabase, isBusy, isSaved, onUnsave, propertyId, userId]);

  // No session or no listing means nothing to check: the heart is simply inert
  // rather than spinning forever.
  const isChecking = Boolean(userId && propertyId) && loadedFor !== propertyId;

  return { isSaved, saveLoading: isBusy || isChecking, saveFailed, toggleSave };
}
