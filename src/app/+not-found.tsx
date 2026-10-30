import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { spacing } from '@/theme/tokens';

/**
 * A dead link, handled as a page in the book rather than a crash (§5.12): the
 * house empty state, one sentence on what happened, and the way back to the folio.
 */
export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <EmptyState
      title="This page is not here."
      description="The link may be old, or the page has moved. Every home in the folio is one tap away."
      action={
        <View style={styles.action}>
          <Button label="Back to homes" onPress={() => router.replace('/(root)/(tabs)')} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  action: {
    marginTop: spacing[4],
  },
});
