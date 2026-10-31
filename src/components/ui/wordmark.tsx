import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../themed-text';
import { LintelMark } from './lintel-mark';

import { useThemeColors } from '@/hooks/use-theme';
import { radius, type as typeScale } from '@/theme/tokens';

const WORDMARK = 'lintel';

export type WordmarkProps = {
  /** Type size in px. The mark and the ember point scale from it. */
  size?: number;
  /** Draw the Lintel symbol before the word — the full lockup. */
  mark?: boolean;
  /**
   * Draw the trailing ember point. Defaults to the opposite of `mark`: the
   * lockup already carries one point of light, in the mark's opening, and two
   * embers in one masthead break the "one point of light" rule (§2.4).
   */
  point?: boolean;
};

/**
 * The lockup as type and vectors, not as an image (DESIGN.md §8.6): Poppins 600,
 * lowercase, −0.02em, an optional Lintel mark on the left and an ember
 * sun-point where a period would be.
 *
 * Drawn rather than shipped as a PNG so it follows the theme — an
 * ink-on-transparent asset disappears on the Lamp­light background, and a
 * per-scheme pair would drift from the tokens.
 */
export function Wordmark({
  size = typeScale.display.fontSize,
  mark = false,
  point = !mark,
}: WordmarkProps) {
  const colors = useThemeColors();
  const dotSize = size * 0.3;

  return (
    // Not an accessible element on purpose: Android draws its default focus
    // highlight around a focused node, and a branding mark that grabs focus
    // paints a grey box over the wordmark. The letters are read as text.
    <View style={styles.row}>
      {mark ? (
        <LintelMark size={size} style={[styles.mark, { marginRight: size * 0.34 }]} />
      ) : null}
      <ThemedText
        variant="display"
        style={[styles.letters, { fontSize: size, lineHeight: size * 1.1, color: colors.text }]}
      >
        {WORDMARK}
      </ThemedText>
      {point ? (
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  // The mark is centred on the cap-height band rather than dropped to the
  // baseline: the posts end where the letters end, not where their descenders do.
  mark: {
    alignSelf: 'center',
  },
  letters: {
    letterSpacing: typeScale.display.letterSpacing,
  },
});
