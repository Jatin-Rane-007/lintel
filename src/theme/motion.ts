/**
 * Motion presets for Reanimated.
 *
 * Rules (DESIGN.md §7.1): motion explains, never decorates; animate only
 * `transform` and `opacity`; nothing in the discovery path exceeds 320 ms;
 * honour the system "Reduce motion" setting.
 */

import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';

import { durations, easingCurves, type DurationToken } from './tokens';

export const easing = {
  /** Entering and moving elements. */
  standard: Easing.bezier(...easingCurves.standard),
  /** Leaving elements — pair with 75 % of the enter duration. */
  exit: Easing.bezier(...easingCurves.exit),
} as const;

/** Timing configs per duration token. */
export const timing: Record<DurationToken, WithTimingConfig> = {
  instant: { duration: durations.instant, easing: easing.standard },
  fast: { duration: durations.fast, easing: easing.standard },
  base: { duration: durations.base, easing: easing.standard },
  slow: { duration: durations.slow, easing: easing.standard },
};

/** Leaving configs — 75 % of the matching enter duration. */
export const timingExit: Record<DurationToken, WithTimingConfig> = {
  instant: { duration: durations.instant * 0.75, easing: easing.exit },
  fast: { duration: durations.fast * 0.75, easing: easing.exit },
  base: { duration: durations.base * 0.75, easing: easing.exit },
  slow: { duration: durations.slow * 0.75, easing: easing.exit },
};

/**
 * Springs are used only for direct manipulation (press feedback, drag settle).
 * Panel presentation uses timing, not springs (DESIGN.md §7.4).
 */
export const spring = {
  press: { damping: 20, stiffness: 320, mass: 0.5 },
  settle: { damping: 24, stiffness: 220, mass: 0.7 },
} satisfies Record<string, WithSpringConfig>;

/** Layout transitions, matched to the duration tokens. */
export const entering = {
  fade: (durationMs = durations.fast) => FadeIn.duration(durationMs).easing(easing.standard),
  fadeUp: FadeInDown.duration(durations.base).easing(easing.standard),
  sheet: SlideInDown.duration(durations.slow).easing(easing.standard),
} as const;

export const exiting = {
  fade: FadeOut.duration(durations.fast * 0.75).easing(easing.exit),
  sheet: SlideOutDown.duration(durations.slow * 0.75).easing(easing.exit),
} as const;

/** Press feedback: 1 → 0.97 scale, 80 ms in, spring back (DESIGN.md §7.3). */
export const press = {
  scale: 0.97,
  config: timing.instant,
} as const;
