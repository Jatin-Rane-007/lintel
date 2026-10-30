import { useRouter } from 'expo-router';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { FilterModal } from '@/components/filter-modal';
import { PropertyCard } from '@/components/property-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { PageHeader } from '@/components/ui/page-header';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Gutter, Screen } from '@/components/ui/screen';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { useDeferredFlag } from '@/hooks/use-deferred-flag';
import { useThemeColors } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';
import { countLabel, formatPrice } from '@/lib/utils';
import { selectActiveFilterCount, useFilterStore } from '@/store/filter-store';
import { borderWidth, radius, spacing } from '@/theme/tokens';
import type { Property } from '@/types';

/**
 * Results (§5.2, §5.5). The search term is a field, the filters live in a
 * sheet behind one counted button, and the active filters stay visible as
 * removable chips — so nothing that narrows the list is ever hidden.
 */
export default function SearchScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const search = useFilterStore((state) => state.search);
  const type = useFilterStore((state) => state.type);
  const bedrooms = useFilterStore((state) => state.bedrooms);
  const minPrice = useFilterStore((state) => state.minPrice);
  const maxPrice = useFilterStore((state) => state.maxPrice);
  const setSearch = useFilterStore((state) => state.setSearch);
  const setType = useFilterStore((state) => state.setType);
  const setBedrooms = useFilterStore((state) => state.setBedrooms);
  const setMinPrice = useFilterStore((state) => state.setMinPrice);
  const setMaxPrice = useFilterStore((state) => state.setMaxPrice);
  const activeCount = useFilterStore(selectActiveFilterCount);

  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const requestId = useRef(0);

  // The store is the field's source of truth, so the term survives leaving the
  // screen; the fetch below is what waits for typing to pause.

  const fetchResults = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);

    let query = supabase.from('properties').select('*');

    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,address.ilike.%${search}%`);
    }
    if (type) query = query.eq('type', type);
    if (bedrooms) query = query.eq('bedrooms', bedrooms);
    if (minPrice !== null) query = query.gte('price', minPrice);
    if (maxPrice !== null) query = query.lte('price', maxPrice);

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(60);

    // A newer query has started; this answer is stale.
    if (id !== requestId.current) return;

    if (error) {
      setFailed(true);
    } else {
      setFailed(false);
      setResults((data as Property[]) ?? []);
    }
    setLoading(false);
  }, [bedrooms, maxPrice, minPrice, search, type]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchResults]);

  const showSkeleton = useDeferredFlag(loading);

  const clearAll = () => {
    setSearch('');
    setType(null);
    setBedrooms(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  const priceLabel =
    minPrice !== null && maxPrice !== null
      ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
      : minPrice !== null
        ? `From ${formatPrice(minPrice)}`
        : maxPrice !== null
          ? `Up to ${formatPrice(maxPrice)}`
          : null;

  const note = loading ? 'Searching…' : `${countLabel(results.length, 'home')} found`;

  const filtersButton = (
    <PressableScale
      onPress={() => setShowFilters(true)}
      accessibilityRole="button"
      accessibilityLabel={
        activeCount > 0 ? `Filters, ${activeCount} active` : 'Filters'
      }
      style={styles.filtersTarget}
    >
      <View
        style={[
          styles.filtersCircle,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderHairline,
          },
        ]}
      >
        <Icon glyph={SlidersHorizontal} size="md" tone="text" />
      </View>
      {activeCount > 0 ? (
        <View style={[styles.count, { backgroundColor: colors.accentFill }]}>
          <ThemedText variant="caption" tone="onAccent" tabular>
            {String(activeCount)}
          </ThemedText>
        </View>
      ) : null}
    </PressableScale>
  );

  return (
    <Screen>
      <Gutter style={styles.header}>
        <PageHeader title="Search" note={note} trailing={filtersButton} />
      </Gutter>

      <Gutter style={styles.controls}>
        <TextField
          label="Where?"
          placeholder="City, neighbourhood or Nº"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={fetchResults}
          autoCapitalize="words"
          autoCorrect={false}
          accessory={
            search.length > 0 ? (
              <PressableScale
                onPress={() => setSearch('')}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                style={styles.clearTarget}
              >
                <Icon glyph={X} size="sm" tone="textMuted" />
              </PressableScale>
            ) : null
          }
        />

        {activeCount > 0 ? (
          <View style={styles.chipRow}>
            {type ? (
              <Chip
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                onRemove={() => setType(null)}
              />
            ) : null}
            {bedrooms !== null ? (
              <Chip
                label={bedrooms >= 4 ? '4+ beds' : `${bedrooms} beds`}
                onRemove={() => setBedrooms(null)}
              />
            ) : null}
            {priceLabel ? (
              <Chip
                label={priceLabel}
                onRemove={() => {
                  setMinPrice(null);
                  setMaxPrice(null);
                }}
              />
            ) : null}
          </View>
        ) : null}

        {failed ? (
          <Notice
            message="We couldn't load homes. Check your connection and try again."
            actionLabel="Try again"
            onAction={fetchResults}
          />
        ) : null}
      </Gutter>

      <FlatList<Property>
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Gutter>
            <PropertyCard
              property={item}
              onPress={() =>
                router.push({
                  pathname: '/(root)/property/[id]',
                  params: { id: item.id },
                })
              }
            />
          </Gutter>
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          showSkeleton ? (
            <Gutter style={styles.skeletons}>
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </Gutter>
          ) : !loading ? (
            <Gutter style={styles.empty}>
              <View style={[styles.emptyRule, { backgroundColor: colors.accentFill }]} />
              <ThemedText variant="h3">No homes match these filters yet.</ThemedText>
              <ThemedText variant="bodySm" tone="textSecondary">
                Try a wider price range or a different city, or start again with
                nothing filtered.
              </ThemedText>
              <Button label="Clear filters" variant="secondary" onPress={clearAll} />
            </Gutter>
          ) : undefined
        }
      />

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        resultCount={results.length}
        resultLoading={loading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[3],
  },
  controls: {
    paddingTop: spacing[5],
    paddingBottom: spacing[4],
    gap: spacing[3],
  },
  filtersTarget: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: borderWidth.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearTarget: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  content: {
    paddingBottom: spacing[10],
    gap: spacing[6],
  },
  skeletons: {
    gap: spacing[6],
  },
  empty: {
    gap: spacing[3],
    paddingTop: spacing[6],
    alignItems: 'flex-start',
  },
  emptyRule: {
    width: spacing[6],
    height: 2,
  },
});
