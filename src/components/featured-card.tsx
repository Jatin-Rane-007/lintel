import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme';
import { formatArea, formatPrice } from '@/lib/utils';
import type { Property } from '@/types';
import { borderWidth, layout, radius, spacing } from '@/theme/tokens';

import { ThemedText } from './themed-text';
import { Badge } from './ui/badge';
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

  const cover = property.images?.[0];
  const isFolio = variant === 'folio';

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

        {property.is_featured ? (
          <View style={styles.badge}>
            <Badge label="Featured" showIcon={false} />
          </View>
        ) : null}
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
  badge: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
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
