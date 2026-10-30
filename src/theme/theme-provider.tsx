/**
 * ThemeProvider — system / light / dark preference, persisted per device.
 *
 * It is the only place that talks to NativeWind's colour scheme, so `dark:`
 * utilities and `useTheme()` can never disagree. The resolved scheme feeds
 * React Navigation, the status bar and the Android navigation bar.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { useColorScheme } from 'nativewind';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Appearance, View } from 'react-native';

import { themes, type Theme, type ThemeScheme } from './themes';

export type ThemePreference = 'system' | ThemeScheme;

const STORAGE_KEY = 'lintel.theme.preference';

export type ThemeContextValue = {
  /** What the user chose: system, or a locked scheme. */
  preference: ThemePreference;
  /** What is actually rendered right now. */
  scheme: ThemeScheme;
  theme: Theme;
  /** False until the stored preference has been read. */
  isReady: boolean;
  setPreference: (preference: ThemePreference) => void;
  /** Flips between light and dark, locking the choice. */
  toggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isReady, setIsReady] = useState(false);

  // Restore the stored choice before the first paint is trusted.
  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active || !isPreference(stored) || stored === 'system') return;
        setPreferenceState(stored);
        setColorScheme(stored);
      })
      .catch(() => {
        // A storage failure must never block the app; fall back to the system.
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, [setColorScheme]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      setColorScheme(next);
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
        // Preference is cosmetic: a failed write is not worth interrupting the user.
      });
    },
    [setColorScheme],
  );

  const scheme: ThemeScheme =
    colorScheme ?? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

  const toggleScheme = useCallback(() => {
    setPreference(scheme === 'dark' ? 'light' : 'dark');
  }, [scheme, setPreference]);

  const theme = themes[scheme];

  // Native chrome (Android navigation bar) follows the page background.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.bg).catch(() => {
      // Unsupported on some platforms; the page background still applies.
    });
  }, [theme.colors.bg]);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, scheme, theme, isReady, setPreference, toggleScheme }),
    [preference, scheme, theme, isReady, setPreference, toggleScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return context;
}
