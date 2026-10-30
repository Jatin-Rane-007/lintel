import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../themed-text';

import { useThemeColors } from '@/hooks/use-theme';
import { radius, spacing, type as typeScale } from '@/theme/tokens';

const WORDMARK = 'lintel';

export type WordmarkProps = {
  /** Type size in px. The ember sun-point scales with it (0.3em). */
  size?: number;
};

/**
 * The wordmark as type, not an image (DESIGN.md §8.6): Poppins 600, lowercase,
 * −0.02em, with a trailing ember sun-point where a period would be.
 *
 * Set as text so it follows the theme — an ink-on-transparent PNG disappears
 * on the Lamp­light background, and a per-scheme asset would drift from tokens.
 */
export function Wordmark({ size = typeScale.display.fontSize }: WordmarkProps) {
  const colors = useThemeColors();
  const dotSize = size * 0.3;

  return (
    // Not an accessible element on purpose: Android draws its default focus
    // highlight around a focused node, and a branding mark that grabs focus
    // paints a grey box over the wordmark. The letters are read as text.
    <View style={styles.row}>
      <ThemedText
        variant="display"
        style={[styles.letters, { fontSize: size, lineHeight: size * 1.1, color: colors.text }]}
      >
        {WORDMARK}
      </ThemedText>
      <View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: radius.full,
          backgroundColor: colors.accentFill,
          marginLeft: size * 0.06,
          marginBottom: size * 0.06,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[0],
  },
  letters: {
    letterSpacing: typeScale.display.letterSpacing,
  },
});
