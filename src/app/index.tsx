import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme';

/**
 * The one redirect. While Clerk restores a session there is no answer yet, so
 * the screen holds a quiet spinner on the page ground rather than flashing the
 * sign-in form at a person who is already signed in.
 */
export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const colors = useThemeColors();

  if (!isLoaded) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.accentFill} />
      </View>
    );
  }

  if (isSignedIn) return <Redirect href="/(root)/(tabs)" />;
  return <Redirect href="/sign-in" />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
