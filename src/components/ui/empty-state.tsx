import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../themed-text';
import { LintelMark } from './lintel-mark';

import { useThemeColors } from '@/hooks/use-theme';
import { spacing } from '@/theme/tokens';

/** Mark height in the drawing. The threshold below it matches its width. */
const DRAWING = 96;
const DRAWING_WIDTH = (DRAWING * 176) / 152;

/**
 * The house empty state (DESIGN.md §8.12): centered stack, the brand mark above
 * the words, one sentence in Lora, then the action that fills the screen.
 * Centered is the one place §4.1 allows it.
 *
 * The mark is the doorway itself — a beam over two posts with one point of
 * light in the opening — standing on a plain ink threshold. The point is the
 * only ember in the region, so an empty screen still reads as "nothing here
 * yet, but there is light".
 */
export function EmptyState({
  title,
  description,
  action,
  edges = ['top', 'left', 'right'],
}: {
  title: string;
  description: string;
  action?: ReactNode;
  /** Drop `top` when the state sits below a screen header that already inset. */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={edges}>
      <View style={styles.stack}>
        <View style={styles.drawing}>
          <LintelMark size={DRAWING} />
          <View style={[styles.threshold, { backgroundColor: colors.borderStrong }]} />
        </View>

        <ThemedText variant="h3" accessibilityRole="header" style={styles.centered}>
          {title}
        </ThemedText>
        <ThemedText
          variant="bodySm"
          tone="textSecondary"
          style={[styles.centered, styles.description]}
        >
          {description}
        </ThemedText>
        {action}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[10],
  },
  drawing: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  // The ground the doorway stands on: the mark's own width, so the posts land
  // on it rather than hovering above it.
  threshold: {
    width: DRAWING_WIDTH,
    height: 2,
  },
  centered: {
    textAlign: 'center',
  },
  description: {
    maxWidth: 280,
  },
});
