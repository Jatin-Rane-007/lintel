import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '../themed-text';

import type { ReactNode } from 'react';

import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, spacing } from '@/theme/tokens';

export type PageHeaderProps = {
  /** The screen's one h1: what this screen is. */
  title: string;
  /** One quiet line under the title — a count, a place, a date. */
  note?: string;
  /** A single control at the far edge, on a 44 px target. */
  trailing?: ReactNode;
  /** Draws the sun-line rule under the header. Off inside scroll content. */
  rule?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The header of a destination screen. It sits on the page ground without a
 * card, a border or a shadow: structure comes from the type and the sun-line
 * rule, and the title is always left-aligned so every screen shares one edge.
 */
export function PageHeader({ title, note, trailing, rule = true, style }: PageHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.root, style]}>
      <View style={styles.row}>
        <View style={styles.titles}>
          <ThemedText variant="h1" accessibilityRole="header">
            {title}
          </ThemedText>
          {note ? (
            <ThemedText variant="meta" tone="textMuted">
              {note}
            </ThemedText>
          ) : null}
        </View>
        {trailing}
      </View>

      {rule ? (
        <View style={styles.rule}>
          <View style={[styles.ember, { backgroundColor: colors.accentFill }]} />
          <View style={[styles.hairline, { backgroundColor: colors.borderHairline }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  titles: {
    flex: 1,
    gap: spacing[1],
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 2,
  },
  ember: {
    width: spacing[6],
    height: 2,
  },
  hairline: {
    flex: 1,
    height: borderWidth.hairline,
  },
});
