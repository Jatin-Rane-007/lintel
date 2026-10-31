import { useUser } from '@clerk/expo';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Building2,
  Home as HomeGlyph,
  Square,
  Trees,
  type LucideIcon,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { FeaturedCard } from '@/components/featured-card';
import { PropertyCard } from '@/components/property-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Gutter, Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { Wordmark } from '@/components/ui/wordmark';
import { useDeferredFlag } from '@/hooks/use-deferred-flag';
import { useThemeColors } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';
import { useFilterStore } from '@/store/filter-store';
import { borderWidth, spacing } from '@/theme/tokens';
import type { Property, PropertyType } from '@/types';

/** The four kinds this catalogue actually holds — nothing invented. */
const TYPES: { label: string; value: PropertyType; icon: LucideIcon }[] = [
  { label: 'Apartments', value: 'apartment', icon: Building2 },
  { label: 'Houses', value: 'house', icon: HomeGlyph },
  { label: 'Villas', value: 'villa', icon: Trees },
  { label: 'Studios', value: 'studio', icon: Square },
];

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Home (§5.1). On a phone the opening is the search ledger, then one tall
 * photograph as "Today's folio". The headline says what the app is in the
 * app's own voice; everything under it is either a real listing or a door
 * into the results.
 */
export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user } = useUser();
  const setSearch = useFilterStore((state) => state.setSearch);
  const setType = useFilterStore((state) => state.setType);

  const [featured, setFeatured] = useState<Property[]>([]);
  const [latest, setLatest] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [draft, setDraft] = useState('');

  const showSkeleton = useDeferredFlag(loading);

  const load = useCallback(async (mode: 'focus' | 'refresh' = 'focus') => {
    if (mode === 'refresh') setRefreshing(true);

    const [featuredResult, latestResult] = await Promise.all([
      supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('properties')
        .select('*')
        .eq('is_featured', false)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    // A failed load keeps what is already on screen (§5.12).
    if (featuredResult.error || latestResult.error) {
      setFailed(true);
    } else {
      setFailed(false);
      setFeatured((featuredResult.data as Property[]) ?? []);
      setLatest((latestResult.data as Property[]) ?? []);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openSearch = () => router.push('/(root)/(tabs)/search');

  const submitSearch = () => {
    setSearch(draft.trim());
    openSearch();
  };

  const browseType = (value: PropertyType) => {
    setType(value);
    setSearch('');
    openSearch();
  };

  const openProperty = (id: string) =>
    router.push({ pathname: '/(root)/property/[id]', params: { id } });

  const folio = featured[0];
  const others = featured.slice(1);
  const firstName = user?.firstName;
  const greeting = firstName
    ? `${greetingFor(new Date().getHours())}, ${firstName}`
    : greetingFor(new Date().getHours());

  const header = (
    <View>
      <Gutter>
        <View style={styles.masthead}>
          <Wordmark size={22} mark />
          <ThemedText
            variant="meta"
            tone="textMuted"
            numberOfLines={1}
            style={styles.greeting}
          >
            {greeting}
          </ThemedText>
        </View>
      </Gutter>
      <View style={[styles.mastheadRule, { backgroundColor: colors.borderHairline }]} />

      <Gutter style={styles.opening}>
        <ThemedText variant="display" accessibilityRole="header">
          Find a home with good light.
        </ThemedText>
        <ThemedText variant="bodyLg" tone="textSecondary">
          A property browser for homes across India — search by city or
          reference, open a home, save the ones you like.
        </ThemedText>

        <View style={styles.ledger}>
          <View style={styles.ledgerField}>
            <TextField
              label="Where?"
              placeholder="City, neighbourhood or Nº"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={submitSearch}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <Button label="Search" onPress={submitSearch} style={styles.searchButton} />
        </View>
      </Gutter>

      {failed ? (
        <Gutter style={styles.notice}>
          <Notice
            message="We couldn't load homes. Check your connection and try again."
            actionLabel="Try again"
            onAction={() => load()}
          />
        </Gutter>
      ) : null}

      {folio ? (
        <Gutter style={styles.section}>
          <SectionHeader title="Today's folio" actionLabel="See all" onAction={openSearch} />
          <FeaturedCard
            property={folio}
            variant="folio"
            onPress={() => openProperty(folio.id)}
          />
        </Gutter>
      ) : null}

      <View style={styles.section}>
        <Gutter>
          <SectionHeader title="Browse by type" />
        </Gutter>
        <View style={[styles.indexRule, { borderBottomColor: colors.borderHairline }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.indexRow}
          >
            {TYPES.map((entry) => (
              <PressableScale
                key={entry.value}
                onPress={() => browseType(entry.value)}
                accessibilityRole="button"
                accessibilityLabel={`Browse ${entry.label}`}
                style={styles.indexItem}
              >
                <Icon glyph={entry.icon} size="lg" tone="textSecondary" />
                <ThemedText variant="ui" tone="textSecondary">
                  {entry.label}
                </ThemedText>
              </PressableScale>
            ))}
          </ScrollView>
        </View>
      </View>

      {others.length > 0 ? (
        <View style={styles.section}>
          <Gutter>
            <SectionHeader title="Also in the folio" note={`${others.length} homes`} />
          </Gutter>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
          >
            {others.map((property) => (
              <FeaturedCard
                key={property.id}
                property={property}
                variant="rail"
                onPress={() => openProperty(property.id)}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <Gutter style={styles.section}>
        <SectionHeader title="Latest" actionLabel="See all" onAction={openSearch} />
      </Gutter>
    </View>
  );

  return (
    <Screen>
      <FlatList<Property>
        data={latest}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Gutter>
            <PropertyCard property={item} onPress={() => openProperty(item.id)} />
          </Gutter>
        )}
        ListHeaderComponent={header}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load('refresh')}
            tintColor={colors.accentFill}
            colors={[colors.accentFill]}
            progressBackgroundColor={colors.surface}
          />
        }
        ListEmptyComponent={
          showSkeleton ? (
            <Gutter style={styles.skeletons}>
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </Gutter>
          ) : !loading ? (
            <Gutter style={styles.empty}>
              <ThemedText variant="h3">No homes listed yet.</ThemedText>
              <ThemedText variant="bodySm" tone="textSecondary">
                New listings appear here as soon as they are added.
              </ThemedText>
            </Gutter>
          ) : undefined
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing[10],
    gap: spacing[6],
  },
  masthead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
  },
  greeting: {
    flex: 1,
    textAlign: 'right',
  },
  mastheadRule: {
    height: borderWidth.hairline,
  },
  opening: {
    paddingTop: spacing[8],
    gap: spacing[4],
  },
  ledger: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  ledgerField: {
    flex: 1,
  },
  searchButton: {
    height: 52,
  },
  notice: {
    marginTop: spacing[6],
  },
  section: {
    marginTop: spacing[10],
    gap: spacing[4],
  },
  indexRule: {
    borderBottomWidth: borderWidth.hairline,
  },
  indexRow: {
    paddingHorizontal: spacing[6],
    gap: spacing[6],
  },
  indexItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    minHeight: 44,
  },
  rail: {
    paddingHorizontal: spacing[6],
    gap: spacing[4],
  },
  skeletons: {
    gap: spacing[6],
  },
  empty: {
    gap: spacing[2],
    paddingTop: spacing[2],
  },
});
