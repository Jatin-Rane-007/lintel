/**
 * The one way components read the theme.
 *
 * `useTheme()` returns the full semantic theme (colours + scheme + status bar).
 * `useThemeColors()` is the common case. Both re-render only when the scheme
 * actually changes — colours are plain strings so they are safe to use inside
 * Reanimated styles, Skia props and third-party components.
 */

import { useThemeContext } from '@/theme/theme-provider';

export function useTheme() {
  return useThemeContext().theme;
}

export function useThemeColors() {
  return useThemeContext().theme.colors;
}

export function useThemeScheme() {
  return useThemeContext().scheme;
}

/** System / Light / Dark control for settings screens. */
export function useThemePreference() {
  const { preference, scheme, setPreference, toggleScheme } = useThemeContext();

  return { preference, scheme, setPreference, toggleScheme };
}
