import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSavedProperty } from '@/hooks/use-saved-property';
import { useThemeColors } from '@/hooks/use-theme';
import { formatArea, formatPrice } from '@/lib/utils';
import { borderWidth, layout, radius, spacing } from '@/theme/tokens';
import type { Property } from '@/types';

import { ThemedText } from './themed-text';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';
import { PressableScale } from './ui/pressable-scale';
import { SunLine } from './ui/sun-line';
import { TitleBlock } from './ui/title-block';

export type FeaturedCardProps = {
  property: Property;
  onPress: () => void;
  /**
   * `folio` is the editorial opening: one tall photograph with its caption
   * beneath, full width. `rail` is the horizontal row's 288 px card.
   */
  variant?: 'folio' | 'rail';
};

/**
 * "Today's folio" (§5.1): one property shown as a page from a portfolio — a
 * tall photograph, the sun-line, then the title block beneath it. It is the
 * only place in the app where a photograph is this large, which is what makes
 * the opening read as editorial rather than as a feed.
 */
export function FeaturedCard({ property, onPress, variant = 'folio' }: FeaturedCardProps) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const { isSaved, saveFailed, toggleSave } = useSavedProperty(property.id);

  const cover = property.images?.[0];
  const isFolio = variant === 'folio';
  const unavailable = property.is_sold;

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
      accessibilityLabel={`${property.title}, ${formatPrice(property.price)}`}
      style={[isFolio ? styles.folio : styles.rail, isFolio && styles.folioWidth]}
    >
      <View>
        {cover ? (
          <Image
            source={{ uri: cover }}
            style={[styles.photo, isFolio ? styles.photoFolio : styles.photoRail]}
            contentFit="cover"
            transition={200}
            accessibilityLabel={`Photograph of ${property.title}`}
          />
        ) : (
          <View
            style={[
              styles.photo,
              isFolio ? styles.photoFolio : styles.photoRail,
              { backgroundColor: colors.bgSunk },
            ]}
          />
        )}

        {/* The opening card saves like every other one: the heart holds the
            top-right corner so the gesture is learned once, on the largest
            photograph in the app. `box-none` keeps the empty strip of the
            overlay from swallowing the tap that opens the home. */}
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.badges}>
            {property.is_featured ? <Badge label="Featured" showIcon={false} /> : null}
            {unavailable ? <Badge label="No longer available" tone="unavailable" /> : null}
          </View>

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
        </View>
      </View>

      {property.is_sold ? (
        <View style={[styles.unavailableRule, { backgroundColor: colors.unavailableBg }]} />
      ) : (
        <SunLine active={pressed} style={styles.sunLine} />
      )}

      <View style={[styles.caption, !isFolio && styles.captionRail]}>
        <ThemedText variant="label" tone="textMuted" numberOfLines={1}>
          {`Nº ${property.id.slice(0, 4).toUpperCase()} · ${property.type}`}
        </ThemedText>

        <ThemedText variant={isFolio ? 'h1' : 'h4'} numberOfLines={2}>
          {property.title}
        </ThemedText>

        <View style={styles.metaRow}>
          <ThemedText variant="meta" tone="textMuted" numberOfLines={1} style={styles.location}>
            {isFolio ? `${property.address}, ${property.city}` : property.city}
          </ThemedText>
          <ThemedText variant={isFolio ? 'priceLg' : 'priceSm'} tabular>
            {formatPrice(property.price)}
          </ThemedText>
        </View>

        {saveFailed ? (
          <ThemedText variant="caption" tone="errorText">
            Couldn’t save this home. Try the heart again.
          </ThemedText>
        ) : null}
      </View>

      <TitleBlock cells={specs} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  folio: {
    gap: 0,
  },
  folioWidth: {
    width: '100%',
    maxWidth: layout.contentMax,
  },
  rail: {
    width: layout.cardMinWidth,
    borderRadius: radius.xs,
    borderWidth: borderWidth.hairline,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
  },
  photoFolio: {
    aspectRatio: 4 / 5,
  },
  photoRail: {
    aspectRatio: 4 / 3,
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
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: spacing[2],
  },
  save: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunLine: {
    marginTop: spacing[0],
  },
  unavailableRule: {
    height: 2,
  },
  caption: {
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    gap: spacing[1],
  },
  // The folio caption hangs off the page gutter, so it is already inset. The
  // rail card carries its own hairline, so its caption needs the padding.
  captionRail: {
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[3],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  location: {
    flex: 1,
  },
});
