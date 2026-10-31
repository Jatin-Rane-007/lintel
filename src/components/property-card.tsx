import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSavedProperty } from '@/hooks/use-saved-property';
import { useThemeColors } from '@/hooks/use-theme';
import { formatArea, formatPrice } from '@/lib/utils';
import { borderWidth, radius, spacing } from '@/theme/tokens';
import type { Property } from '@/types';

import { ThemedText } from './themed-text';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';
import { PressableScale } from './ui/pressable-scale';
import { SunLine } from './ui/sun-line';
import { TitleBlock } from './ui/title-block';

export type PropertyCardProps = {
  property: Property;
  onPress: () => void;
  /** Called after a successful unsave so a saved list can drop the row. */
  onUnsave?: () => void;
  /** Shows the heart. On a saved list the heart is the way out, so it is on. */
  showSave?: boolean;
};

/**
 * The Folio card (§5.3): a 4:3 photograph, the ember sun-line beneath it, and
 * a ruled title block of figures. Price sits in ink under the reference tag —
 * never orange, never over the photo — so scanning a column of cards reads
 * photograph → price → name → spec.
 *
 * The whole card is one target; the save control floats above it with its own
 * 44 px hit area.
 */
export function PropertyCard({ property, onPress, onUnsave, showSave = true }: PropertyCardProps) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const { isSaved, saveFailed, toggleSave } = useSavedProperty(property.id, onUnsave);

  const unavailable = property.is_sold;
  const cover = property.images?.[0];
  const photoCount = property.images?.length ?? 0;

  const specs = [
    { value: String(property.bedrooms), label: 'Beds' },
    { value: String(property.bathrooms), label: 'Baths' },
    ...(property.area_sqft ? [{ value: formatArea(property.area_sqft), label: 'ft²' }] : []),
  ];

  return (
    <PressableScale
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={`${property.title}, ${formatPrice(property.price)}, ${property.city}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderHairline }]}
    >
      <View style={styles.photoFrame}>
        {cover ? (
          <Image
            source={{ uri: cover }}
            style={[styles.photo, unavailable && styles.photoUnavailable]}
            contentFit="cover"
            transition={160}
            accessibilityLabel={`Photograph of ${property.title}`}
          />
        ) : (
          <View style={[styles.photo, { backgroundColor: colors.bgSunk }]} />
        )}

        <View style={styles.overlay}>
          {/* The badges hold the left edge even when there are none, so the
              save control never drifts to the other corner. */}
          <View style={styles.badges}>
            {property.is_featured ? <Badge label="Featured" showIcon={false} /> : null}
            {unavailable ? <Badge label="No longer available" tone="unavailable" /> : null}
          </View>

          {showSave ? (
            <PressableScale
              onPress={toggleSave}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remove from saved' : 'Save this home'}
              accessibilityState={{ selected: isSaved }}
              style={[styles.save, { backgroundColor: colors.surface }]}
            >
              <Icon
                glyph={Heart}
                size="sm"
                tone={isSaved ? 'accentText' : 'text'}
                fill={isSaved ? colors.accentFill : 'transparent'}
              />
            </PressableScale>
          ) : null}
        </View>

        {photoCount > 1 ? (
          <View style={[styles.countChip, { backgroundColor: colors.surface }]}>
            <ThemedText variant="caption" tone="textSecondary">
              {`${photoCount} photos`}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {/* The sun-line: state marker and the brand's one point of light (§9.1). */}
      {unavailable ? (
        <View style={[styles.rule, { backgroundColor: colors.unavailableBg }]} />
      ) : (
        <SunLine active={pressed} style={styles.rule} />
      )}

      <View style={styles.body}>
        <ThemedText variant="label" tone="textMuted" numberOfLines={1}>
          {`Nº ${property.id.slice(0, 4).toUpperCase()} · ${property.type}`}
        </ThemedText>

        <ThemedText variant="priceLg" tabular style={unavailable ? styles.struck : undefined}>
          {formatPrice(property.price)}
        </ThemedText>
        {unavailable ? (
          <ThemedText variant="caption" tone="textMuted">
            Last price
          </ThemedText>
        ) : null}

        <ThemedText variant="h4" numberOfLines={1}>
          {property.title}
        </ThemedText>
        <ThemedText variant="meta" tone="textMuted" numberOfLines={1}>
          {property.city}
        </ThemedText>

        {/* A save that did not land says so here, once, in the card it belongs
            to — never as a heart that silently springs back. */}
        {saveFailed ? (
          <ThemedText variant="caption" tone="errorText" style={styles.saveError}>
            Couldn’t save this home. Try the heart again.
          </ThemedText>
        ) : null}
      </View>

      <TitleBlock cells={specs} style={styles.titleBlock} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xs,
    borderWidth: borderWidth.hairline,
    overflow: 'hidden',
  },
  photoFrame: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  // "No longer available" never relies on the badge alone (§5.12).
  photoUnavailable: {
    opacity: 0.55,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing[3],
    gap: spacing[2],
  },
  save: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: spacing[2],
  },
  countChip: {
    position: 'absolute',
    left: spacing[3],
    bottom: spacing[3],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  rule: {
    marginHorizontal: spacing[4],
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    gap: 2,
  },
  struck: {
    textDecorationLine: 'line-through',
  },
  saveError: {
    marginTop: spacing[1],
  },
  titleBlock: {
    borderBottomWidth: 0,
  },
});
