import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useMotion } from '@/hooks/use-motion';
import { useThemeColors } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme/tokens';

export type SkeletonProps = {
  width?: DimensionValue;
  /** Omit to let `style` own the height (an aspect-ratio photo block). */
  height?: number;
  /** Corners are near-square; the default matches the media tiles. */
  corner?: keyof typeof radius;
  style?: StyleProp<ViewStyle>;
};

/**
 * A structural placeholder (§5.11): it mirrors the block it replaces so the
 * layout never shifts when the data lands, and it pulses between 0.6 and 1
 * opacity — except under reduce motion, where it simply rests.
 */
export function Skeleton({ width = '100%', height, corner = 'xs', style }: SkeletonProps) {
  const colors = useThemeColors();
  const { reduceMotion } = useMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    pulse.value = withRepeat(withTiming(0.6, { duration: 1400 }), -1, true);
  }, [pulse, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius[corner],
          backgroundColor: colors.skeleton,
          overflow: 'hidden',
        },
        style,
        !reduceMotion && animatedStyle,
      ]}
    />
  );
}

/**
 * The card skeleton: a 4:3 photo block, a price bar at 46 %, a name bar at
 * 68 %, a location bar at 52 %, and the title-block rule beneath — the same
 * proportions as the real card.
 */
export function PropertyCardSkeleton() {
  const colors = useThemeColors();

  return (
    <View style={[styles.card, { borderColor: colors.borderHairline }]}>
      <Skeleton corner="none" width="100%" style={styles.photo} />
      <View style={styles.body}>
        <Skeleton width="34%" height={12} />
        <Skeleton width="46%" height={24} />
        <Skeleton width="68%" height={16} />
        <Skeleton width="52%" height={13} />
      </View>
      <Skeleton corner="none" height={StyleSheet.hairlineWidth} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing[6],
  },
  photo: {
    aspectRatio: 4 / 3,
  },
  body: {
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
});
