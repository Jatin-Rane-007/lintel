/**
 * Motion helpers that already respect the OS "Reduce motion" setting
 * (DESIGN.md §7.6). Use these instead of importing durations directly, so a
 * reduced-motion user gets instant state changes without any extra branching.
 */

import { useReducedMotion } from 'react-native-reanimated';

import { durations, type DurationToken } from '@/theme/tokens';
import { entering as enteringPresets, press as pressPreset, spring, timing } from '@/theme/motion';

export function useMotion() {
  const reduceMotion = useReducedMotion();

  return {
    reduceMotion,

    /** Duration in ms for a token; 0 when motion is reduced. */
    duration: (token: DurationToken = 'fast') => (reduceMotion ? 0 : durations[token]),

    /** Timing config for imperative `withTiming` calls. */
    timing: (token: DurationToken = 'base') => (reduceMotion ? { duration: 0 } : timing[token]),

    spring: spring.settle,

    /** Scale factor for pressed feedback; 1 (no feedback) when reduced. */
    pressedScale: reduceMotion ? 1 : pressPreset.scale,

    /** Layout animation presets; `undefined` disables the animation. */
    entering: {
      fade: reduceMotion ? undefined : enteringPresets.fade(),
      fadeUp: reduceMotion ? undefined : enteringPresets.fadeUp,
      sheet: reduceMotion ? undefined : enteringPresets.sheet,
    },
  };
}
