import { useAuth } from '@clerk/expo';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { PropertyCard } from '@/components/property-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { PageHeader } from '@/components/ui/page-header';
import { Gutter, Screen } from '@/components/ui/screen';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { useDeferredFlag } from '@/hooks/use-deferred-flag';
import { useSupabase } from '@/hooks/use-supabase';
import { countLabel } from '@/lib/utils';
import { spacing } from '@/theme/tokens';
import type { SavedProperty } from '@/types';

/**
 * Saved (§5.9): one list, newest first, and the heart on each card is the way
 * out. Unavailable homes stay in place — the note the person wrote about them
 * is worth more than a tidy list.
 */
export default function SavedScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const authSupabase = useSupabase();

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const showSkeleton = useDeferredFlag(!hasLoaded);

  const fetchSaved = useCallback(async () => {
    if (!userId) {
      setHasLoaded(true);
      return;
    }

    const { data, error } = await authSupabase
      .from('saved_properties')
      .select('id, property_id, created_at, properties(*)')
      .eq('user_clerk_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      setFailed(true);
    } else {
      setFailed(false);
      setSaved((data as unknown as SavedProperty[]) ?? []);
    }

    setHasLoaded(true);
  }, [authSupabase, userId]);

  // The tab is visited between saves, so it reloads on focus rather than once.
  // The rows stay on screen while the new answer arrives: swapping them for a
  // spinner would blank the page on every visit.
  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved]),
  );

  const isEmpty = saved.length === 0;

  return (
    <Screen>
      <Gutter style={styles.header}>
        <PageHeader
          title="Saved"
          note={isEmpty ? undefined : `${countLabel(saved.length, 'home')} on your shortlist`}
        />
      </Gutter>

      {failed ? (
        <Gutter style={styles.notice}>
          <Notice
            message="We couldn't load your shortlist. Check your connection and try again."
            actionLabel="Try again"
            onAction={fetchSaved}
          />
        </Gutter>
      ) : null}

      <FlatList<SavedProperty>
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Gutter>
            <PropertyCard
              property={item.properties}
              onPress={() =>
                router.push({
                  pathname: '/(root)/property/[id]',
                  params: { id: item.property_id },
                })
              }
              onUnsave={() => setSaved((previous) => previous.filter((row) => row.id !== item.id))}
            />
          </Gutter>
        )}
        contentContainerStyle={[styles.content, isEmpty && styles.contentEmpty]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          hasLoaded ? (
            <EmptyState
              title="Nothing saved yet."
              description="Tap the heart on any home and it will wait for you here, on every device you sign in to."
              edges={['left', 'right']}
              action={
                <Button
                  label="Explore homes"
                  onPress={() => router.push('/(root)/(tabs)')}
                  style={styles.emptyAction}
                />
              }
            />
          ) : showSkeleton ? (
            <Gutter style={styles.skeletons}>
              <PropertyCardSkeleton />
            </Gutter>
          ) : undefined
        }
        ListFooterComponent={
          saved.length > 0 ? (
            <Gutter style={styles.footnote}>
              <ThemedText variant="caption" tone="textMuted">
                Saved homes sync with your account, so they follow you to another device.
              </ThemedText>
            </Gutter>
          ) : undefined
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[3],
    paddingBottom: spacing[5],
  },
  notice: {
    paddingBottom: spacing[3],
  },
  content: {
    paddingBottom: spacing[10],
    gap: spacing[6],
  },
  // The empty state is a page of its own, so it takes the whole list area.
  contentEmpty: {
    flexGrow: 1,
  },
  skeletons: {
    gap: spacing[6],
  },
  footnote: {
    paddingTop: spacing[2],
  },
  emptyAction: {
    marginTop: spacing[4],
  },
});
