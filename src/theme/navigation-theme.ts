/**
 * Bridges the design theme into React Navigation so headers, the tab bar and
 * screen containers never fall back to Expo's default colours.
 */

import { DarkTheme, DefaultTheme } from 'expo-router';

import type { Theme } from './themes';

export function toNavigationTheme(theme: Theme): typeof DefaultTheme {
  return {
    ...(theme.dark ? DarkTheme : DefaultTheme),
    dark: theme.dark,
    colors: {
      primary: theme.colors.accentText,
      background: theme.colors.bg,
      card: theme.colors.bg,
      text: theme.colors.text,
      border: theme.colors.borderHairline,
      notification: theme.colors.accentFill,
    },
  };
}
