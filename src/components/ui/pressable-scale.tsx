import { type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useMotion } from '@/hooks/use-motion';
import { press } from '@/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  children?: ReactNode;
  /** Static style only — the pressed scale is applied on top. */
  style?: StyleProp<ViewStyle>;
  /** How far to shrink while held. Defaults to the 0.97 motion token. */
  scaleTo?: number;
};

/**
 * Pressable with the design's tactile feedback (DESIGN.md §7.3): 0.97 scale on
 * press, released in 120 ms, skipped entirely when the user reduces motion.
 * Animate `transform` only — never `opacity` or layout on every touch.
 */
export function PressableScale({
  children,
  style,
  scaleTo = press.scale,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: PressableScaleProps) {
  const { reduceMotion, duration } = useMotion();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = reduceMotion ? 1 : 1 - (1 - scaleTo) * pressed.value;
    return { transform: [{ scale }] };
  });

  const handlePressIn = (event: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
    pressed.value = withTiming(1, { duration: duration('instant') });
    onPressIn?.(event);
  };

  const handlePressOut = (event: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
    pressed.value = withTiming(0, { duration: duration('fast') });
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
