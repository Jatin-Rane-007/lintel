import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

import { useThemeColors } from '@/hooks/use-theme';
import { useUserSync } from '@/hooks/use-user-sync';

/**
 * Everything behind the door. A stack, not a slot, so a property opens over
 * the tab bar with a real transition and backs out to where it was opened.
 */
export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const colors = useThemeColors();

  useUserSync();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="property/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="property/map" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
