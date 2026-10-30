import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../themed-text';

import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, spacing } from '@/theme/tokens';

/**
 * The house empty state (DESIGN.md §8.12): centered stack, a drawing — not an
 * icon — above the words, one sentence in Lora, then the action that fills the
 * screen. Centered is the one place §4.1 allows it.
 *
 * The drawing is a doorway: three sides of a frame standing on the sun-line at
 * the threshold — the brand's own way of saying "nothing in here yet, but there
 * is light". The fourth side is deliberately open, so it never reads as a
 * broken picture.
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
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.bg }]}
      edges={edges}
    >
      <View style={styles.stack}>
        <View style={styles.drawing}>
          <View style={[styles.frame, { borderColor: colors.borderStrong }]} />
          <View style={[styles.threshold, { backgroundColor: colors.accentFill }]} />
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
  frame: {
    width: 72,
    height: 96,
    borderTopWidth: borderWidth.strong,
    borderLeftWidth: borderWidth.strong,
    borderRightWidth: borderWidth.strong,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  threshold: {
    width: 72,
    height: 2,
    marginTop: spacing[1],
  },
  centered: {
    textAlign: 'center',
  },
  description: {
    maxWidth: 280,
  },
});
