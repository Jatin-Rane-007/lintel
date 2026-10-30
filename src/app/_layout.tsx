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
import { Slot, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
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

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_600SemiBold,
  });

  useEffect(() => {
    // A font failure is not worth an empty screen: the system faces are the
    // fallback stack and the type scale still holds its sizes.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        // Already hidden.
      });
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

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
