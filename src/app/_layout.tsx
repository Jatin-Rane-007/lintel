/**
 * The outer shell: fonts, gesture root, safe-area insets, Clerk, and the one
 * theme that every screen reads.
 *
 * Order matters. Clerk has to sit above anything that reads a session; the
 * theme has to sit above anything that paints; the navigation theme has to sit
 * above the router so no screen ever flashes Expo's default colours.
 */

import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Lora_400Regular } from '@expo-google-fonts/lora/400Regular';
import { Lora_400Regular_Italic } from '@expo-google-fonts/lora/400Regular_Italic';
import { Lora_600SemiBold } from '@expo-google-fonts/lora/600SemiBold';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { useFonts } from 'expo-font';
import { ThemeProvider as NavigationThemeProvider, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { ThemeProvider, toNavigationTheme } from '@/theme';

import '../global.css';

// Expo inlines EXPO_PUBLIC_* at build time, so a missing key is a misconfigured
// checkout rather than a runtime condition. Falling back to `''` keeps the
// value a plain string and lets the check below fail with a useful message.
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

if (!publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to .env.local and restart the bundler.',
  );
}

// The splash stays up until the two faces are in memory, so the first screen
// never reflows from a fallback font.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Already hidden: nothing to hold.
});

/**
 * Reads the resolved theme and hands it to the router and the status bar.
 * Split from `RootLayout` because it has to live *inside* `ThemeProvider`.
 */
function ThemedApp() {
  const theme = useTheme();

  return (
    <NavigationThemeProvider value={toNavigationTheme(theme)}>
      <StatusBar style={theme.statusBarStyle} animated />
      <Slot />
    </NavigationThemeProvider>
  );
}

/** How long the shell waits for the two faces before opening without them. */
const FONT_WATCHDOG_MS = 4000;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_600SemiBold,
  });

  // A font that never resolves must not cost the person the app. The splash is
  // a native view held up by this component, so a load that stalls here reads
  // as a frozen logo — the worst first impression there is. After the watchdog
  // the shell opens on the fallback stack and the real faces slot in when they
  // arrive.
  const [watchdogFired, setWatchdogFired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWatchdogFired(true), FONT_WATCHDOG_MS);
    return () => clearTimeout(timer);
  }, []);

  // Derived, not stored: a font failure is not worth an empty screen either —
  // the system faces are the fallback stack and the type scale holds its sizes.
  const ready = fontsLoaded || fontError != null || watchdogFired;

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => {
      // Already hidden.
    });
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ThemeProvider>
            <ThemedApp />
          </ThemeProvider>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
