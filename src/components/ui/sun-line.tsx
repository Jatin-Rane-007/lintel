import { useEffect, useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useThemeColors } from '@/hooks/use-theme';
import { useMotion } from '@/hooks/use-motion';

const DEFAULT_STUB = 24;

export type SunLineProps = {
  /** Extends the stub to the full width: hover, focus or selection. */
  active?: boolean;
  /** Resting width in px. 24 px is the brand default (DESIGN.md §9.1). */
  stubWidth?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * The ember sun-line: a 2 px rule under a photograph, a 24 px stub at rest and
 * full width when the card is active. It animates `scaleX` from a fixed-width
 * line, so no layout is recalculated per frame.
 */
export function SunLine({ active = false, stubWidth = DEFAULT_STUB, style }: SunLineProps) {
  const colors = useThemeColors();
  const { reduceMotion, duration } = useMotion();
  const [width, setWidth] = useState(0);
  const scale = useSharedValue(1);

  const target = active && width > 0 ? width / stubWidth : 1;

  useEffect(() => {
    scale.value = withTiming(target, { duration: duration('base') });
  }, [duration, scale, target]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: scale.value }] }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View onLayout={handleLayout} style={[{ height: 2, justifyContent: 'center' }, style]}>
      <Animated.View
        style={[
          {
            width: stubWidth,
            height: 2,
            backgroundColor: colors.accentFill,
            transformOrigin: ['0%', '50%', 0],
          },
          !reduceMotion && animatedStyle,
        ]}
      />
    </View>
  );
}
