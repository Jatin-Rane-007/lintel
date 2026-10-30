/**
 * Compact / medium / expanded breakpoints (DESIGN.md §6.1).
 * Mobile-first: `compact` is the default composition, never a shrunken desktop.
 */

import { useWindowDimensions } from 'react-native';

import { layout } from '@/theme/tokens';

export type Breakpoint = 'compact' | 'medium' | 'expanded' | 'wide';

export function useBreakpoint() {
  const { width, height } = useWindowDimensions();

  const breakpoint: Breakpoint =
    width >= layout.breakpoints.wide
      ? 'wide'
      : width >= layout.breakpoints.expanded
        ? 'expanded'
        : width >= layout.breakpoints.medium
          ? 'medium'
          : 'compact';

  return {
    width,
    height,
    breakpoint,
    isCompact: breakpoint === 'compact',
    isTablet: breakpoint === 'medium',
    /** True from `medium` upwards — useful for `numColumns`, not for layout swaps. */
    isAtLeastMedium: width >= layout.breakpoints.medium,
  };
}
